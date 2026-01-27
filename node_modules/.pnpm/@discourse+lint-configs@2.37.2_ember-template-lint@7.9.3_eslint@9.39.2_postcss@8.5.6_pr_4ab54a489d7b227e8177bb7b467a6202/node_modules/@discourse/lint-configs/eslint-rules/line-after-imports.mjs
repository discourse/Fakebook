import {
  findFirstConsecutiveTokenBefore,
  findLastConsecutiveTokenAfter,
  getBoundaryTokens,
  hasTokenOrCommentBetween,
} from "./utils/tokens.mjs";

function findLastIndexOfType(nodes, type) {
  return nodes.findLastIndex((node) => node.type === type);
}

export default {
  meta: {
    type: "layout",
    docs: {
      description: "Require an empty line after the imports block",
    },
    fixable: "whitespace",
    schema: [], // no options
  },

  create(context) {
    const sourceCode = context.sourceCode;

    return {
      Program(node) {
        const body = node.body;
        const index = findLastIndexOfType(body, "ImportDeclaration");

        if (index === -1) {
          // No imports
          return;
        }

        if (!body[index + 1]) {
          // Nothing after imports
          return;
        }

        const { curLast, nextFirst } = getBoundaryTokens(
          sourceCode,
          body[index],
          body[index + 1]
        );

        const beforePadding = findLastConsecutiveTokenAfter(
          sourceCode,
          curLast,
          nextFirst,
          1
        );
        const afterPadding = findFirstConsecutiveTokenBefore(
          sourceCode,
          nextFirst,
          curLast,
          1
        );
        const isPadded =
          afterPadding.loc.start.line - beforePadding.loc.end.line > 1;
        const hasTokenInPadding = hasTokenOrCommentBetween(
          sourceCode,
          beforePadding,
          afterPadding
        );
        const curLineLastToken = findLastConsecutiveTokenAfter(
          sourceCode,
          curLast,
          nextFirst,
          0
        );

        if (isPadded) {
          return;
        }

        context.report({
          node: body[index],
          message: "Expected blank line after imports.",

          fix(fixer) {
            if (hasTokenInPadding) {
              return null;
            }

            return fixer.insertTextAfter(curLineLastToken, "\n");
          },
        });
      },
    };
  },
};
