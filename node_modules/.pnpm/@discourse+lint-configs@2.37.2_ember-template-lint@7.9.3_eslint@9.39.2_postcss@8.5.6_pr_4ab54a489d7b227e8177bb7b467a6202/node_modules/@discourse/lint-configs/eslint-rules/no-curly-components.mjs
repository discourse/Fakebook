import path from "path";

function lintCurlyComponent(node, context) {
  const isSimplePath =
    node.path.type === "GlimmerPathExpression" &&
    node.path.head.type === "VarHead" &&
    !node.tail?.length;

  if (!isSimplePath) {
    return;
  }

  let check = node.parent;
  while (check) {
    if (check.type === "GlimmerAttrNode") {
      // <Foo @bar={{baz}} />
      return;
    }
    check = check.parent;
  }

  const variableName = node.path.head.name;

  const moduleScope = context.sourceCode.scopeManager.scopes.find(
    (s) => s.type === "module"
  );
  const variable = moduleScope.variables.find((v) => v.name === variableName);

  if (!variable) {
    return;
  }

  const importBinding = variable.defs.find(
    (d) =>
      d.type === "ImportBinding" && d.node.type === "ImportDefaultSpecifier"
  );

  if (!importBinding) {
    return;
  }

  const importedModuleName = importBinding.node.parent.source.value;

  // This is not perfect, but it should catch 99% of components
  let resolvedModuleName = importedModuleName;
  if (importedModuleName.startsWith(".")) {
    const cwd = context.cwd;
    const sourceDirectoryFromCwd = path.dirname(
      path.relative(cwd, context.getFilename())
    );

    resolvedModuleName = path.join(sourceDirectoryFromCwd, importedModuleName);
  }

  if (!resolvedModuleName.includes("/components/")) {
    return;
  }

  context.report({
    node,
    message: `Use angle bracket syntax for components.`,
    fix(fixer) {
      const fixes = [];

      let argumentString = "";
      node.hash?.pairs.forEach(({ key, value }) => {
        let valueSource = context.sourceCode.getText(value);
        valueSource = valueSource.replace(/^\(/, "").replace(/\)$/, "");
        if (value.type !== "GlimmerStringLiteral") {
          valueSource = `{{${valueSource}}}`;
        }
        argumentString += `@${key}=${valueSource} `;
      });

      if (node.type === "GlimmerBlockStatement") {
        fixes.push(
          fixer.replaceText(
            node,
            `<${variable.name} ${argumentString}>${context.sourceCode.getText(
              node.program
            )}</${variable.name}>`
          )
        );
      } else if (node.type === "GlimmerMustacheStatement") {
        fixes.push(
          fixer.replaceText(node, `<${variable.name} ${argumentString}/>`)
        );
      }

      return fixes;
    },
  });
}

export default {
  meta: {
    type: "suggestion",
    docs: {
      description: "Use angle-bracket syntax for components.",
    },
    fixable: "code",
    schema: [], // no options
  },

  create(context) {
    return {
      GlimmerBlockStatement(node) {
        return lintCurlyComponent(node, context);
      },

      GlimmerMustacheStatement(node) {
        return lintCurlyComponent(node, context);
      },
    };
  },
};
