export default {
  meta: {
    type: "suggestion",
    docs: {
      description: "Component names should start with a capital letter.",
    },
    fixable: "code",
    schema: [], // no options
  },

  create(context) {
    return {
      GlimmerElementNode(node) {
        if (node.name === "template") {
          return;
        }

        if (!node.name.match(/^[a-z]/)) {
          return;
        }

        const moduleScope = context.sourceCode.scopeManager.scopes.find(
          (s) => s.type === "module"
        );
        const variable = moduleScope.variables.find(
          (v) => v.name === node.name
        );

        if (!variable) {
          return;
        }

        const newVariableName = variable.name.replace(/^[a-z]/, (char) =>
          char.toUpperCase()
        );

        const importBinding = variable.defs.find(
          (d) =>
            d.type === "ImportBinding" &&
            d.node.type === "ImportDefaultSpecifier"
        );

        if (!importBinding) {
          return;
        }

        context.report({
          node: node.openTag,
          message: `Component names should start with a capital letter.`,
          fix(fixer) {
            const fixes = [];

            fixes.push(fixer.replaceText(importBinding.node, newVariableName));

            variable.references.forEach((ref) => {
              fixes.push(fixer.replaceText(ref.identifier, newVariableName));
            });

            return fixes;
          },
        });
      },
    };
  },
};
