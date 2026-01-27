const ContentTag = require('content-tag');
const glimmer = require('@glimmer/syntax');
const DocumentLines = require('../utils/document');
const { visitorKeys: glimmerVisitorKeys } = require('@glimmer/syntax');
const { Reference, Scope, Variable, Definition } = require('eslint-scope');
const htmlTags = require('html-tags');
const svgTags = require('svg-tags');
const mathMLTags = require('mathml-tag-names');

let TypescriptScope = null;
try {
  const parserPath = require.resolve('@typescript-eslint/parser');
  // eslint-disable-next-line n/no-unpublished-require
  const scopeManagerPath = require.resolve('@typescript-eslint/scope-manager', {
    paths: [parserPath],
  });
  TypescriptScope = require(scopeManagerPath);
} catch {
  // not available
}

const BufferMap = new Map();

function getBuffer(str) {
  let buf = BufferMap.get(str);
  if (!buf) {
    buf = Buffer.from(str);
    BufferMap.set(str, buf);
  }
  return buf;
}

function sliceByteRange(str, a, b) {
  const buf = getBuffer(str);
  return buf.slice(a, b).toString();
}

function byteToCharIndex(str, byteOffset) {
  const buf = getBuffer(str);
  return buf.slice(0, byteOffset).toString().length;
}

function byteLength(str) {
  return getBuffer(str).length;
}

/**
 * finds the nearest node scope
 * @param scopeManager
 * @param nodePath
 * @return {*|null}
 */
function findParentScope(scopeManager, nodePath) {
  let scope = null;
  let path = nodePath;
  while (path) {
    scope = scopeManager.acquire(path.node, true);
    if (scope) {
      return scope;
    }
    path = path.parentPath;
  }
  return null;
}

/**
 * tries to find the variable names {name} in any parent scope
 * if the variable is not found it just returns the nearest scope,
 * so that it's usage can be registered.
 * @param scopeManager
 * @param nodePath
 * @param name
 * @return {{scope: null, variable: *}|{scope: (*|null)}}
 */
function findVarInParentScopes(scopeManager, nodePath, name) {
  let scope = null;
  let path = nodePath;
  while (path) {
    scope = scopeManager.acquire(path.node, true);
    if (scope && scope.set.has(name)) {
      break;
    }
    path = path.parentPath;
  }
  const currentScope = findParentScope(scopeManager, nodePath);
  if (!scope) {
    return { scope: currentScope };
  }

  return { scope: currentScope, variable: scope.set.get(name) };
}

/**
 * registers a node variable usage in the scope.
 * @param node
 * @param scope
 * @param variable
 */
function registerNodeInScope(node, scope, variable) {
  const ref = new Reference(node, scope, Reference.READ);
  if (variable) {
    variable.references.push(ref);
    ref.resolved = variable;
  } else {
    // register missing variable in most upper scope.
    let s = scope;
    while (s.upper) {
      s = s.upper;
    }
    s.through.push(ref);
  }
  scope.references.push(ref);
}

/**
 * traverses all nodes using the {visitorKeys} calling the callback function, visitor
 * @param visitorKeys
 * @param node
 * @param visitor
 */
function traverse(visitorKeys, node, visitor) {
  const allVisitorKeys = visitorKeys;
  const queue = [];

  queue.push({
    node,
    parent: null,
    parentKey: null,
    parentPath: null,
    context: {},
  });

  while (queue.length > 0) {
    const currentPath = queue.pop();

    visitor(currentPath);

    if (!currentPath.node) continue;

    const visitorKeys = [...(allVisitorKeys[currentPath.node.type] || [])];
    if (currentPath.node.type === 'GlimmerElementNode') {
      if (!visitorKeys.includes('blockParamNodes')) {
        visitorKeys.push('blockParamNodes', 'parts');
      }
    }
    if (currentPath.node.type === 'GlimmerProgram') {
      if (!visitorKeys.includes('blockParamNodes')) {
        visitorKeys.push('blockParamNodes');
      }
    }
    if (!visitorKeys) {
      continue;
    }

    for (const visitorKey of visitorKeys) {
      const child = currentPath.node[visitorKey];

      if (!child) {
        continue;
      } else if (Array.isArray(child)) {
        for (const item of child) {
          queue.push({
            node: item,
            parent: currentPath.node,
            context: Object.assign({}, currentPath.context),
            parentKey: visitorKey,
            parentPath: currentPath,
          });
        }
      } else {
        queue.push({
          node: child,
          parent: currentPath.node,
          context: Object.assign({}, currentPath.context),
          parentKey: visitorKey,
          parentPath: currentPath,
        });
      }
    }
  }
}

function isUpperCase(char) {
  return char.toUpperCase() === char;
}

function isAlphaNumeric(code) {
  return !(
    !(code > 47 && code < 58) && // numeric (0-9)
    !(code > 64 && code < 91) && // upper alpha (A-Z)
    !(code > 96 && code < 123)
  );
}

function isWhiteSpace(code) {
  return code === ' ' || code === '\t' || code === '\r' || code === '\n' || code === '\v';
}

/**
 * simple tokenizer for templates, just splits it up into words and punctuators
 * @param template {string}
 * @param startOffset {number}
 * @param doc {DocumentLines}
 * @return {Token[]}
 */
function tokenize(template, doc, startOffset) {
  const tokens = [];
  let current = '';
  let start = 0;
  function pushToken(value, type, range) {
    const t = {
      type,
      value,
      range,
      start: range[0],
      end: range[1],
      loc: {
        start: { ...doc.offsetToPosition(range[0]), index: range[0] },
        end: { ...doc.offsetToPosition(range[1]), index: range[1] },
      },
    };
    tokens.push(t);
  }
  for (const [i, c] of [...template].entries()) {
    if (isAlphaNumeric(c.codePointAt(0))) {
      if (current.length === 0) {
        start = i;
      }
      current += c;
    } else {
      let range = [startOffset + start, startOffset + i];
      if (current.length > 0) {
        pushToken(current, 'word', range);
        current = '';
      }
      range = [startOffset + i, startOffset + i + 1];
      if (!isWhiteSpace(c)) {
        pushToken(c, 'Punctuator', range);
      }
    }
  }
  return tokens;
}

/**
 * Preprocesses the template info, parsing the template content to Glimmer AST,
 * fixing the offsets and locations of all nodes
 * also calculates the block params locations & ranges
 * and adding it to the info
 * @param info
 * @param code
 * @return {{templateVisitorKeys: {}, comments: *[], templateInfos: {templateRange: *, range: *, replacedRange: *}[]}}
 */
module.exports.preprocessGlimmerTemplates = function preprocessGlimmerTemplates(info, code) {
  const templateInfos = info.templateInfos.map((r) => ({
    range: [r.contentRange.start, r.contentRange.end],
    templateRange: [r.range.start, r.range.end],
    utf16Range: [byteToCharIndex(code, r.range.start), byteToCharIndex(code, r.range.end)],
  }));
  const templateVisitorKeys = {};
  const codeLines = new DocumentLines(code);
  const comments = [];
  for (const tpl of templateInfos) {
    const currentComments = [];
    const textNodes = [];
    const emptyTextNodes = [];
    const range = tpl.utf16Range;
    const offset = range[0];
    const template = code.slice(...range);
    const docLines = new DocumentLines(template);
    const ast = glimmer.preprocess(template, { mode: 'codemod' });
    ast.tokens = tokenize(sliceByteRange(code, ...tpl.templateRange), codeLines, tpl.utf16Range[0]);
    const allNodes = [];
    glimmer.traverse(ast, {
      All(node, path) {
        const n = node;
        n.parent = path.parentNode;
        allNodes.push(node);
        if (node.type === 'CommentStatement' || node.type === 'MustacheCommentStatement') {
          comments.push(node);
          currentComments.push(node);
        }
        if (node.type === 'TextNode') {
          n.value = node.chars;
          // empty text nodes are not allowed, it's empty if its only whitespace or line terminators
          // it's okay for AttrNodes
          if (n.value.trim().length !== 0 || n.parent.type === 'AttrNode') {
            textNodes.push(node);
          } else {
            emptyTextNodes.push(node);
          }
        }
      },
    });
    ast.content = template;
    const allNodeTypes = new Set();
    for (const n of allNodes) {
      if (n.type === 'PathExpression') {
        n.head.range = [
          offset + docLines.positionToOffset(n.head.loc.start),
          offset + docLines.positionToOffset(n.head.loc.end),
        ];
        n.head.loc = {
          start: codeLines.offsetToPosition(n.head.range[0]),
          end: codeLines.offsetToPosition(n.head.range[1]),
        };
      }
      n.range =
        n.type === 'Template'
          ? [...tpl.utf16Range]
          : [
              offset + docLines.positionToOffset(n.loc.start),
              offset + docLines.positionToOffset(n.loc.end),
            ];
      n.start = n.range[0];
      n.end = n.range[1];
      n.loc = {
        start: codeLines.offsetToPosition(n.range[0]),
        end: codeLines.offsetToPosition(n.range[1]),
      };
      if (n.type === 'Template') {
        n.loc.start = codeLines.offsetToPosition(tpl.utf16Range[0]);
        n.loc.end = codeLines.offsetToPosition(tpl.utf16Range[1]);
      }

      if (n.type === 'ElementNode') {
        n.name = n.tag;
        n.parts = [n.path.head].map((p) => {
          const range = [
            offset + docLines.positionToOffset(p.loc.start),
            offset + docLines.positionToOffset(p.loc.end),
          ];
          const loc = {
            start: codeLines.offsetToPosition(range[0]),
            end: codeLines.offsetToPosition(range[1]),
          };
          return {
            ...p,
            name: p.original,
            parent: n,
            type: 'GlimmerElementNodePart',
            range,
            loc,
          };
        });
      }

      if ('blockParams' in n) {
        n.params = (n.params || []).map((p) => {
          const range = [
            offset + docLines.positionToOffset(p.loc.start),
            offset + docLines.positionToOffset(p.loc.end),
          ];
          const loc = {
            start: codeLines.offsetToPosition(range[0]),
            end: codeLines.offsetToPosition(range[1]),
          };
          return {
            ...p,
            type: 'BlockParam',
            name: p.original,
            parent: n,
            range,
            loc,
          };
        });
      }
      n.type = `Glimmer${n.type}`;
      allNodeTypes.add(n.type);
    }

    // ast should not contains empty text nodes
    for (const node of emptyTextNodes) {
      const children = node.parent.children || node.parent.body || node.parent.parts;
      const idx = children.indexOf(node);
      children.splice(idx, 1);
    }

    // ast should not contain comment nodes
    for (const comment of currentComments) {
      const parentBody = comment.parent.body || comment.parent.children;
      const idx = parentBody.indexOf(comment);
      if (idx >= 0) {
        parentBody.splice(idx, 1);
      }
      // comment type can be a block comment or a line comment
      // mark comments as always block comment, this works for eslint in all cases
      comment.type = 'Block';
    }
    // tokens should not contain tokens of comments
    ast.tokens = ast.tokens.filter(
      (t) => !comments.some((c) => c.range[0] <= t.range[0] && c.range[1] >= t.range[1])
    );
    // tokens should not contain tokens of text nodes, but represent the whole node
    // remove existing tokens
    ast.tokens = ast.tokens.filter(
      (t) => !textNodes.some((c) => c.range[0] <= t.range[0] && c.range[1] >= t.range[1])
    );
    // merge in text nodes
    let currentTextNode = textNodes.pop();
    for (let i = ast.tokens.length - 1; i >= 0; i--) {
      const t = ast.tokens[i];
      while (currentTextNode && t.range[0] < currentTextNode.range[0]) {
        ast.tokens.splice(i + 1, 0, currentTextNode);
        currentTextNode = textNodes.pop();
      }
    }
    ast.contents = template;
    tpl.ast = ast;
  }
  for (const [k, v] of Object.entries(glimmerVisitorKeys)) {
    templateVisitorKeys[`Glimmer${k}`] = [...v];
  }
  return {
    templateVisitorKeys,
    templateInfos,
    comments,
  };
};

/**
 * traverses the AST and replaces the transformed template parts with the Glimmer
 * AST.
 * This also creates the scopes for the Glimmer Blocks and registers the block params
 * in the scope, and also any usages of variables in path expressions
 * this allows the basic eslint rules no-undef and no-unsused to work also for the
 * templates without needing any custom rules
 * @param result
 * @param preprocessedResult
 * @param visitorKeys
 */
module.exports.convertAst = function convertAst(result, preprocessedResult, visitorKeys) {
  const templateInfos = preprocessedResult.templateInfos;
  let counter = 0;
  result.ast.comments.push(...preprocessedResult.comments);

  for (const ti of templateInfos) {
    const firstIdx = result.ast.tokens.findIndex((t) => t.range[0] === ti.utf16Range[0]);
    const lastIdx = result.ast.tokens.findIndex((t) => t.range[1] === ti.utf16Range[1]);
    result.ast.tokens.splice(firstIdx, lastIdx - firstIdx + 1, ...ti.ast.tokens);
  }

  // eslint-disable-next-line complexity
  traverse(visitorKeys, result.ast, (path) => {
    const node = path.node;
    if (!node) return null;

    if (
      node.type === 'ExpressionStatement' ||
      node.type === 'StaticBlock' ||
      node.type === 'TemplateLiteral' ||
      node.type === 'ExportDefaultDeclaration'
    ) {
      let range = node.range;
      if (node.type === 'ExportDefaultDeclaration') {
        range = [node.declaration.range[0], node.declaration.range[1]];
      }

      const template = templateInfos.find(
        (t) =>
          t.utf16Range[0] === range[0] &&
          (t.utf16Range[1] === range[1] || t.utf16Range[1] === range[1] + 1)
      );
      if (!template) {
        return null;
      }
      counter++;
      const ast = template.ast;
      Object.assign(node, ast);
    }

    if (node.type === 'GlimmerPathExpression' && node.head.type === 'VarHead') {
      const name = node.head.name;
      if (glimmer.isKeyword(name)) {
        return null;
      }
      const { scope, variable } = findVarInParentScopes(result.scopeManager, path, name) || {};
      if (scope) {
        node.head.parent = node;
        registerNodeInScope(node.head, scope, variable);
      }
    }
    if (node.type === 'GlimmerElementNode') {
      // always reference first part of tag name, this also has the advantage
      // that errors regarding this tag will only mark the tag name instead of
      // the whole tag + children
      const n = node.parts[0];
      const { scope, variable } = findVarInParentScopes(result.scopeManager, path, n.name) || {};
      /*
      register a node in scope if we found a variable
      we ignore named-blocks and args as we know that it doesn't reference anything in current scope
      we also ignore `this`
      if we do not find a variable we register it with a missing variable if
        * it starts with upper case, it should be a component with a reference
        * it includes a dot, it's a path which should have a reference
        * it's NOT a standard html, svg or mathml tag, it should have a referenced variable
      */
      const ignore =
        // Local instance access
        n.name === 'this' ||
        // named block
        n.name.startsWith(':') ||
        // argument
        n.name.startsWith('@') ||
        // defined locally
        !scope ||
        // custom-elements are allowed to be used even if they don't exist
        // and are undefined
        n.name.includes('-');

      const registerUndef =
        isUpperCase(n.name[0]) ||
        node.name.includes('.') ||
        (!htmlTags.includes(node.name) &&
          !svgTags.includes(node.name) &&
          !mathMLTags.includes(node.name));

      if (!ignore && (variable || registerUndef)) {
        registerNodeInScope(n, scope, variable);
      }
    }

    if ('blockParams' in node) {
      const upperScope = findParentScope(result.scopeManager, path);
      const scope = result.isTypescript
        ? new TypescriptScope.BlockScope(result.scopeManager, upperScope, node)
        : new Scope(result.scopeManager, 'block', upperScope, node);
      const declaredVariables =
        result.scopeManager.declaredVariables || result.scopeManager.__declaredVariables;
      const vars = [];
      declaredVariables.set(node, vars);
      const virtualJSParentNode = {
        type: 'FunctionDeclaration',
        params: node.params,
        range: node.range,
        loc: node.loc,
        parent: path.parent,
      };
      for (const [i, b] of node.params.entries()) {
        const v = new Variable(b.name, scope);
        v.identifiers.push(b);
        scope.variables.push(v);
        scope.set.set(b.name, v);
        vars.push(v);

        const virtualJSNode = {
          type: 'Identifier',
          name: b.name,
          range: b.range,
          loc: b.loc,
          parent: virtualJSParentNode,
        };
        v.defs.push(new Definition('Parameter', virtualJSNode, node, node, i, 'Block Param'));
        v.defs.push(new Definition('Parameter', b, node, node, i, 'Block Param'));
      }
    }
    return null;
  });

  traverse(visitorKeys, result.ast, (path) => {
    const node = path.node;
    if (!node) return null;

    if (
      ['GlimmerMustacheStatement', 'GlimmerBlockStatement', 'GlimmerSubExpression'].includes(
        node.type
      )
    ) {
      if (node.hash && node.hash.pairs.length === 0) {
        node.hash = null;
      }
    }
  });

  if (counter !== templateInfos.length) {
    throw new Error('failed to process all templates');
  }
};

const replaceRange = function replaceRange(s, start, end, substitute) {
  return sliceByteRange(s, 0, start) + substitute + sliceByteRange(s, end);
};
module.exports.replaceRange = replaceRange;

const processor = new ContentTag.Preprocessor();

class EmberParserError extends Error {
  constructor(message, fileName, location) {
    super(message);
    this.location = location;
    this.fileName = fileName;
    Object.defineProperty(this, 'name', {
      configurable: true,
      enumerable: false,
      value: new.target.name,
    });
  }

  // For old version of ESLint https://github.com/typescript-eslint/typescript-eslint/pull/6556#discussion_r1123237311
  get index() {
    return this.location.start.offset;
  }

  // https://github.com/eslint/eslint/blob/b09a512107249a4eb19ef5a37b0bd672266eafdb/lib/linter/linter.js#L853
  get lineNumber() {
    return this.location.start.line;
  }

  // https://github.com/eslint/eslint/blob/b09a512107249a4eb19ef5a37b0bd672266eafdb/lib/linter/linter.js#L854
  get column() {
    return this.location.start.column;
  }
}

function createError(code, message, fileName, start, end = start) {
  return new EmberParserError(message, fileName, { end, start });
}

module.exports.transformForLint = function transformForLint(code, fileName) {
  let jsCode = code;
  /**
   *
   * @type {{
   *   type: 'expression' | 'class-member';
   *   tagName: 'template';
   *   contents: string;
   *   range: {
   *     start: number;
   *     end: number;
   *   };
   *   contentRange: {
   *     start: number;
   *     end: number;
   *   };
   *   startRange: {
   *     end: number;
   *     start: number;
   *   };
   *   endRange: {
   *     start: number;
   *     end: number;
   *   };
   * }[]}
   */
  let result = null;
  try {
    result = processor.parse(code);
  } catch (e) {
    // Parse Error at <anon>:1:19: 1:19
    if (e.message.includes('Parse Error at')) {
      const [line, column] = e.message
        .split(':')
        .slice(-2)
        .map((x) => parseInt(x));
      // e.source_code has actually usable info, e.g × Expected ',', got 'string literal (, '')'
      //     ╭─[9:1]
      //   9 │
      //  10 │ console.log(test'');
      //     ·                 ──
      //     ╰────
      throw createError(code, e.source_code, fileName, { line, column });
    }
    throw e;
  }
  for (const tplInfo of result.reverse()) {
    const content = tplInfo.contents.replace(/`/g, '\\`').replace(/\$/g, '\\$');
    if (tplInfo.type === 'class-member') {
      const tplLength = tplInfo.range.end - tplInfo.range.start;
      const spaces = tplLength - byteLength(content) - 'static{`'.length - '`}'.length;
      const total = content + ' '.repeat(spaces);
      const replacementCode = `static{\`${total}\`}`;
      jsCode = replaceRange(jsCode, tplInfo.range.start, tplInfo.range.end, replacementCode);
    } else {
      const tplLength = tplInfo.range.end - tplInfo.range.start;
      const spaces = tplLength - byteLength(content) - '`'.length - '`'.length;
      const total = content + ' '.repeat(spaces);
      const replacementCode = `\`${total}\``;
      jsCode = replaceRange(jsCode, tplInfo.range.start, tplInfo.range.end, replacementCode);
    }
  }
  /* istanbul ignore next */
  if (jsCode.length !== code.length) {
    throw new Error('bad transform');
  }
  return {
    templateInfos: result,
    output: jsCode,
  };
};

module.exports.traverse = traverse;
module.exports.tokenize = tokenize;
