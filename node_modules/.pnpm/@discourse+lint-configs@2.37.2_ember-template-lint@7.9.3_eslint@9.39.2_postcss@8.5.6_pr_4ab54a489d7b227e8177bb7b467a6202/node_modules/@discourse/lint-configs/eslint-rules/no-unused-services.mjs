// Based on https://github.com/ember-cli/eslint-plugin-ember/blob/8e4b717c1d7d2c0555f4de807709156c89f7aa7a/lib/rules/no-unused-services.js

const MACROS_TO_TRACKED_ARGUMENT_COUNT = {
  alias: 1,
  and: Number.MAX_VALUE,
  bool: 1,
  collect: Number.MAX_VALUE,
  deprecatingAlias: 1,
  empty: 1,
  equal: 1,
  filter: 1,
  filterBy: 1,
  gt: 1,
  gte: 1,
  intersect: Number.MAX_VALUE,
  lt: 1,
  lte: 1,
  map: 1,
  mapBy: 1,
  match: 1,
  max: 1,
  min: 1,
  none: 1,
  not: 1,
  notEmpty: 1,
  oneWay: 1,
  or: Number.MAX_VALUE,
  readOnly: 1,
  reads: 1,
  setDiff: 2,
  sort: 1,
  sum: Number.MAX_VALUE,
  union: Number.MAX_VALUE,
  uniq: 1,
  uniqBy: 1,
};

const EMBER_MACROS = Object.keys(MACROS_TO_TRACKED_ARGUMENT_COUNT);

function splitValue(value) {
  return value ? value.split(".")[0] : undefined;
}

function getImportIdentifier(node, source, namedImportIdentifier = null) {
  if (node.source.value !== source) {
    return null;
  }

  return node.specifiers
    .filter((specifier) => {
      return (
        (specifier.type === "ImportSpecifier" &&
          specifier.imported.name === namedImportIdentifier) ||
        (!namedImportIdentifier && specifier.type === "ImportDefaultSpecifier")
      );
    })
    .map((specifier) => specifier.local.name)
    .pop();
}

function isObserverDecorator(node, importedObservesName) {
  return (
    node?.type === "Decorator" &&
    node.expression?.type === "CallExpression" &&
    node.expression.callee?.type === "Identifier" &&
    node.expression.callee.name === importedObservesName
  );
}

function isPropOfType(node, importedServiceName, importedOptionalServiceName) {
  if (
    (node?.type === "ClassProperty" ||
      node?.type === "PropertyDefinition" ||
      node?.type === "MethodDefinition") &&
    node.decorators
  ) {
    return node.decorators.some((decorator) => {
      const expression = decorator.expression;
      return (
        (expression?.type === "Identifier" &&
          (expression.name === importedServiceName ||
            expression.name === importedOptionalServiceName)) ||
        (expression?.type === "CallExpression" &&
          (expression.callee.name === importedServiceName ||
            expression.callee.name === importedOptionalServiceName))
      );
    });
  }
  return false;
}

function isThisGetCall(node) {
  if (
    node?.type === "CallExpression" &&
    node.callee?.type === "MemberExpression" &&
    node.callee.object?.type === "ThisExpression" &&
    node.callee.property?.type === "Identifier" &&
    node.callee.property.name === "get" &&
    node.arguments.length === 1 &&
    node.arguments[0]?.type === "Literal" &&
    typeof node.arguments[0]?.value === "string"
  ) {
    // Looks like: this.get('property')
    return true;
  }

  return false;
}

function isComputedProp(node, importedComputedName) {
  return (
    // computed
    (node?.type === "Identifier" && node.name === importedComputedName) ||
    // computed()
    (node?.type === "CallExpression" &&
      node.callee?.type === "Identifier" &&
      node.callee.name === importedComputedName)
  );
}

export default {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "disallow unused service injections (see rule doc for limitations)",
      category: "Services",
      recommended: false,
      url: "https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-unused-services.md",
    },
    fixable: null,
    hasSuggestions: true,
    schema: [],
    messages: {
      main: "The service `{{name}}` is not referenced in this file and might be unused (note: it could still be used in a parent/child class).",
      removeServiceInjection: "Remove the service injection.",
    },
  },

  create(context) {
    let currentClass;

    let importedComputedName;
    let importedDiscourseComputedName;
    let importedGetName;
    let importedGetPropertiesName;
    let importedServiceName;
    let importedOptionalServiceName;
    let importedObserverName;
    let importedObservesName;
    const importedMacros = {};

    /**
     * Gets the trailing comma token of the given node.
     * If the trailing comma does not exist, this returns undefined.
     * @param {ASTNode} node The given node
     * @returns {Token|undefined} The trailing comma token or undefined
     */
    function getTrailingToken(node) {
      const nextToken = context.sourceCode.getTokenAfter(node);
      return nextToken.type === "Punctuator" && nextToken.value === ","
        ? nextToken
        : undefined;
    }

    /**
     * Go through the current class and report any unused services
     * @returns {void}
     */
    function reportInstances() {
      const { services, uses } = currentClass;
      currentClass = null;

      if (Object.keys(services).length === 0) {
        return;
      }

      for (const name of Object.keys(services)) {
        if (!uses.has(name)) {
          const node = services[name];
          context.report({
            node,
            data: { name },
            messageId: "main",
            suggest: [
              {
                messageId: "removeServiceInjection",
                fix(fixer) {
                  const fixers = [fixer.remove(node)];
                  if (node?.type === "Property") {
                    const trailingTokenNode = getTrailingToken(node);
                    if (trailingTokenNode) {
                      fixers.push(fixer.remove(trailingTokenNode));
                    }
                  }
                  return fixers;
                },
              },
            ],
          });
        }
      }
    }

    return {
      ImportDeclaration(node) {
        if (node.source.value === "@ember/object") {
          importedComputedName ||= getImportIdentifier(
            node,
            "@ember/object",
            "computed"
          );
          importedGetName ||= getImportIdentifier(node, "@ember/object", "get");
          importedGetPropertiesName ||= getImportIdentifier(
            node,
            "@ember/object",
            "getProperties"
          );
          importedObserverName ||= getImportIdentifier(
            node,
            "@ember/object",
            "observer"
          );
        } else if (node.source.value === "@ember/object/computed") {
          for (const spec of node.specifiers) {
            if (spec.type === "ImportDefaultSpecifier") {
              continue;
            }
            const name = spec.imported.name;
            if (EMBER_MACROS.includes(name)) {
              const localName = spec.local.name;
              importedMacros[localName] = name;
            }
          }
        } else if (node.source.value === "discourse/lib/decorators") {
          importedDiscourseComputedName ||= getImportIdentifier(
            node,
            "discourse/lib/decorators"
          );
        } else if (node.source.value === "@ember/service") {
          importedServiceName ||= getImportIdentifier(
            node,
            "@ember/service",
            "service"
          );
        } else if (node.source.value === "discourse/lib/optional-service") {
          importedOptionalServiceName ||= getImportIdentifier(
            node,
            "discourse/lib/optional-service"
          );
        } else if (node.source.value === "@ember-decorators/object") {
          importedObservesName ||= getImportIdentifier(
            node,
            "@ember-decorators/object",
            "observes"
          );
        }
      },

      // Native JS class
      ClassDeclaration(node) {
        currentClass = { node, services: {}, uses: new Set() };
      },

      CallExpression(node) {
        if (!currentClass) {
          return;
        }

        if (isComputedProp(node, importedComputedName)) {
          // computed()
          for (const elem of node.arguments) {
            if (elem?.type === "Literal" && typeof elem?.value === "string") {
              const name = splitValue(elem.value);
              currentClass.uses.add(name);
            }
          }
        } else if (isComputedProp(node, importedDiscourseComputedName)) {
          // discourseComputed()
          for (const elem of node.arguments) {
            if (elem?.type === "Literal" && typeof elem?.value === "string") {
              const name = splitValue(elem.value);
              currentClass.uses.add(name);
            }
          }
        } else if (isThisGetCall(node)) {
          // this.get('foo...');
          const name = splitValue(node.arguments[0].value);
          currentClass.uses.add(name);
        } else if (
          node.callee.object?.type === "ThisExpression" &&
          node.callee.property.name === "getProperties"
        ) {
          // this.getProperties([..., 'foo..', ...]); or this.getProperties(..., 'foo..', ...);
          const argArray =
            node.arguments[0]?.type === "ArrayExpression"
              ? node.arguments[0].elements
              : node.arguments;
          for (const elem of argArray) {
            const name = splitValue(elem.value);
            currentClass.uses.add(name);
          }
        } else if (node.callee?.type === "Identifier") {
          const calleeName = node.callee.name;
          if (node.arguments[0]?.type === "ThisExpression") {
            // If `get` and `getProperties` weren't imported, skip out early
            if (!importedGetName && !importedGetPropertiesName) {
              return;
            }

            if (calleeName === importedGetName) {
              // get(this, 'foo...');
              const name = splitValue(node.arguments[1].value);
              currentClass.uses.add(name);
            } else if (calleeName === importedGetPropertiesName) {
              // getProperties(this, [..., 'foo..', ...]); or getProperties(this, ..., 'foo..', ...);
              const argArray =
                node.arguments[1]?.type === "ArrayExpression"
                  ? node.arguments[1].elements
                  : node.arguments.slice(1);
              for (const elem of argArray) {
                const name = splitValue(elem.value);
                currentClass.uses.add(name);
              }
            }
          } else if (importedMacros[calleeName]) {
            // Computed macros like @alias(), @or()
            const macroName = importedMacros[calleeName];
            for (
              let idx = 0;
              idx < MACROS_TO_TRACKED_ARGUMENT_COUNT[macroName] &&
              idx < node.arguments.length;
              idx++
            ) {
              const elem = node.arguments[idx];
              if (elem?.type === "Literal" && typeof elem?.value === "string") {
                const name = splitValue(elem.value);
                currentClass.uses.add(name);
              }
            }
          } else if (calleeName === importedObserverName) {
            // observer('foo', ...)
            for (const elem of node.arguments) {
              if (elem?.type === "Literal" && typeof elem?.value === "string") {
                const name = splitValue(elem.value);
                currentClass.uses.add(name);
              }
            }
          }
        }
      },

      "ClassDeclaration:exit"(node) {
        if (currentClass && currentClass.node === node) {
          // Leaving current class
          reportInstances();
        }
      },

      // @observes('foo', ...)
      Decorator(node) {
        // If `service` and `optionalService` weren't imported OR observes wasn't imported, skip out early
        if (
          (!importedServiceName && !importedOptionalServiceName) ||
          !importedObservesName
        ) {
          return;
        }

        if (
          currentClass &&
          isObserverDecorator(node, importedObservesName) &&
          node.expression?.type === "CallExpression"
        ) {
          for (const elem of node.expression.arguments) {
            if (elem.type === "Literal" && typeof elem.value === "string") {
              const name = splitValue(elem.value);
              currentClass.uses.add(name);
            }
          }
        }
      },

      PropertyDefinition(node) {
        // Handles:
        //   @service(...) foo;
        //   @optionalService(...) foo;

        // If `service` and `optionalService` weren't imported, skip out early
        if (!importedServiceName && !importedOptionalServiceName) {
          return;
        }

        if (
          currentClass &&
          isPropOfType(node, importedServiceName, importedOptionalServiceName)
        ) {
          if (node.key.type === "Identifier") {
            const name = node.key.name;
            currentClass.services[name] = node;
          } else if (
            node.key?.type === "Literal" &&
            typeof node.key?.value === "string"
          ) {
            const name = node.key.value;
            currentClass.services[name] = node;
          }
        }
      },

      // this.foo...
      MemberExpression(node) {
        if (
          currentClass &&
          node.object?.type === "ThisExpression" &&
          node.property?.type === "Identifier"
        ) {
          const name = node.property.name;
          currentClass.uses.add(name);
        }
      },

      GlimmerPathExpression(node) {
        if (
          currentClass &&
          node.head.type === "ThisHead" &&
          node.tail.length > 0
        ) {
          const name = node.tail[0];
          currentClass.uses.add(name);
        }
      },

      VariableDeclarator(node) {
        if (
          currentClass &&
          node.init?.type === "ThisExpression" &&
          node.id?.type === "ObjectPattern"
        ) {
          for (const property of node.id.properties) {
            currentClass.uses.add(property.key.name);
          }
        }
      },
    };
  },
};
