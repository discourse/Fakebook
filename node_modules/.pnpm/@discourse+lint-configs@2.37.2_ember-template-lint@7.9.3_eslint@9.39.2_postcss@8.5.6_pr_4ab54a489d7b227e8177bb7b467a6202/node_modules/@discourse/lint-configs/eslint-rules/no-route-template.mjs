export default {
  meta: {
    type: "suggestion",
    docs: {
      description: "Disallow RouteTemplate wrapper for route templates.",
    },
    fixable: "code",
    schema: [],
    messages: {
      removeRouteTemplate: "Remove RouteTemplate wrapper for route templates.",
    },
  },

  create(context) {
    return {
      ExportDefaultDeclaration(node) {
        if (
          node.declaration &&
          node.declaration.type === "CallExpression" &&
          node.declaration.callee.name === "RouteTemplate" &&
          node.declaration.arguments.length === 1
        ) {
          context.report({
            node,
            messageId: "removeRouteTemplate",
            fix(fixer) {
              const sourceCode = context.getSourceCode();
              const arg = node.declaration.arguments[0];
              // Find import of RouteTemplate
              const importDecl = sourceCode.ast.body.find(
                (n) =>
                  n.type === "ImportDeclaration" &&
                  n.specifiers.some(
                    (s) =>
                      s.type === "ImportDefaultSpecifier" &&
                      s.local.name === "RouteTemplate"
                  )
              );

              // Only remove the import and replace the export, do not touch whitespace/indentation
              const fixes = [];
              if (importDecl) {
                fixes.push(fixer.remove(importDecl));
              }
              fixes.push(
                fixer.replaceText(node.declaration, sourceCode.getText(arg))
              );
              return fixes;
            },
          });
        }
      },
    };
  },
};
