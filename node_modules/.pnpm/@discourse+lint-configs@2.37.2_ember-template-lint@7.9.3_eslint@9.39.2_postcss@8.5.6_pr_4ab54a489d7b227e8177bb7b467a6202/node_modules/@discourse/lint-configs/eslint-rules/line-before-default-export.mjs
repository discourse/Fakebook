function isCommentNode(node) {
  return node.type === "Line" || node.type === "Block";
}

export default {
  meta: {
    type: "layout",
    docs: {
      description: "Require an empty line before the default export",
    },
    fixable: "whitespace",
    schema: [], // no options
  },

  create(context) {
    const sourceCode = context.sourceCode;

    return {
      ExportDefaultDeclaration(node) {
        let targetNode = node;
        if (node.declaration?.decorators?.length) {
          targetNode = node.declaration.decorators[0];
        }

        let previousToken;
        while (true) {
          previousToken = sourceCode.getTokenBefore(targetNode, {
            includeComments: true,
          });
          if (!previousToken) {
            // Top of file, no need for newline
            return;
          }

          const isPadded =
            targetNode.loc.start.line - previousToken.loc.end.line > 1;
          if (isPadded) {
            return;
          }

          if (isCommentNode(previousToken)) {
            targetNode = previousToken;
            continue;
          }

          break;
        }

        context.report({
          node: targetNode,
          message: "Expected blank line before the default export.",

          fix(fixer) {
            return fixer.insertTextAfter(previousToken, "\n");
          },
        });
      },
    };
  },
};
