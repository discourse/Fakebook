// Based on `@stylistic/js/lines-between-class-members`
// See: https://github.com/eslint-stylistic/eslint-stylistic/blob/d6809c910510a4477e01ea248071f0701d0af4ed/packages/eslint-plugin/rules/lines-between-class-members/lines-between-class-members._js_.ts

import {
  findFirstConsecutiveTokenBefore,
  findLastConsecutiveTokenAfter,
  getBoundaryTokens,
  hasTokenOrCommentBetween,
  isTokenOnSameLine,
} from "./utils/tokens.mjs";

export default {
  meta: {
    type: "layout",
    docs: {
      description: "Require an empty line between class members",
    },
    fixable: "whitespace",
    schema: [], // no options
    messages: {
      never: "Unexpected blank line between class members.",
      always: "Expected blank line between class members.",
    },
  },

  create(context) {
    const configureList = [
      { blankLine: "always", prev: "service", next: "*" },
      { blankLine: "always", prev: "*", next: "method" },
      { blankLine: "always", prev: "method", next: "*" },
      { blankLine: "always", prev: "*", next: "template" },
    ];
    const sourceCode = context.sourceCode;

    /**
     * Returns the type of the node.
     * @param node The class member node to check.
     * @returns The type string (see `configureList`)
     * @private
     */
    function nodeType(node) {
      if (
        node.type === "PropertyDefinition" &&
        ["service", "optionalService", "controller"].includes(
          node.decorators?.[0]?.expression?.name ||
            node.decorators?.[0]?.expression?.callee?.name
        )
      ) {
        return "service";
      } else if (node.type === "PropertyDefinition") {
        return "field";
      } else if (node.type === "MethodDefinition") {
        return "method";
      } else if (node.type === "GlimmerTemplate") {
        return "template";
      } else {
        return "other";
      }
    }

    /**
     * Checks whether the given node matches the given type.
     * @param node The class member node to check.
     * @param type The class member type to check.
     * @returns `true` if the class member node matched the type.
     * @private
     */
    function match(node, type) {
      if (type === "*") {
        return true;
      }

      return nodeType(node) === type;
    }

    /**
     * Finds the last matched configuration from the configureList.
     * @param prevNode The previous node to match.
     * @param nextNode The current node to match.
     * @returns Padding type or `null` if no matches were found.
     * @private
     */
    function getPaddingType(prevNode, nextNode) {
      for (let i = configureList.length - 1; i >= 0; --i) {
        const configure = configureList[i];
        const matched =
          match(prevNode, configure.prev) && match(nextNode, configure.next);

        if (matched) {
          return configure.blankLine;
        }
      }
      return null;
    }

    return {
      ClassBody(node) {
        const body = node.body;

        for (let i = 0; i < body.length - 1; i++) {
          const curFirst = sourceCode.getFirstToken(body[i]);
          const { curLast, nextFirst } = getBoundaryTokens(
            sourceCode,
            body[i],
            body[i + 1]
          );
          const singleLine = isTokenOnSameLine(curFirst, curLast);
          const skip =
            singleLine && nodeType(body[i]) === nodeType(body[i + 1]);
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
          const paddingType = getPaddingType(body[i], body[i + 1]);

          if (paddingType === "never" && isPadded) {
            context.report({
              node: body[i + 1],
              messageId: "never",

              fix(fixer) {
                if (hasTokenInPadding) {
                  return null;
                }

                return fixer.replaceTextRange(
                  [beforePadding.range[1], afterPadding.range[0]],
                  "\n"
                );
              },
            });
          } else if (paddingType === "always" && !skip && !isPadded) {
            context.report({
              node: body[i + 1],
              messageId: "always",

              fix(fixer) {
                if (hasTokenInPadding) {
                  return null;
                }

                return fixer.insertTextAfter(curLineLastToken, "\n");
              },
            });
          }
        }
      },
    };
  },
};
