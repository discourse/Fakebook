export function isTokenOnSameLine(left, right) {
  return left?.loc?.end.line === right?.loc?.start.line;
}

export function isSemicolonToken(token) {
  return token.value === ";" && token.type === "Punctuator";
}

/**
 * Gets a pair of tokens that should be used to check lines between two class member nodes.
 *
 * In most cases, this returns the very last token of the current node and
 * the very first token of the next node.
 * For example:
 *
 *     class C {
 *         x = 1;   // curLast: `;` nextFirst: `in`
 *         in = 2
 *     }
 *
 * There is only one exception. If the given node ends with a semicolon, and it looks like
 * a semicolon-less style's semicolon - one that is not on the same line as the preceding
 * token, but is on the line where the next class member starts - this returns the preceding
 * token and the semicolon as boundary tokens.
 * For example:
 *
 *     class C {
 *         x = 1    // curLast: `1` nextFirst: `;`
 *         ;in = 2
 *     }
 * When determining the desired layout of the code, we should treat this semicolon as
 * a part of the next class member node instead of the one it technically belongs to.
 * @param curNode Current class member node.
 * @param nextNode Next class member node.
 * @returns The actual last token of `node`.
 * @private
 */
export function getBoundaryTokens(sourceCode, curNode, nextNode) {
  const lastToken = sourceCode.getLastToken(curNode);
  const prevToken = sourceCode.getTokenBefore(lastToken);
  const nextToken = sourceCode.getFirstToken(nextNode); // skip possible lone `;` between nodes

  const isSemicolonLessStyle =
    isSemicolonToken(lastToken) &&
    !isTokenOnSameLine(prevToken, lastToken) &&
    isTokenOnSameLine(lastToken, nextToken);

  return isSemicolonLessStyle
    ? { curLast: prevToken, nextFirst: lastToken }
    : { curLast: lastToken, nextFirst: nextToken };
}

/**
 * Return the last token among the consecutive tokens that have no exceed max line difference in between, before the first token in the next member.
 * @param prevLastToken The last token in the previous member node.
 * @param nextFirstToken The first token in the next member node.
 * @param maxLine The maximum number of allowed line difference between consecutive tokens.
 * @returns  The last token among the consecutive tokens.
 */
export function findLastConsecutiveTokenAfter(
  sourceCode,
  prevLastToken,
  nextFirstToken,
  maxLine
) {
  const after = sourceCode.getTokenAfter(prevLastToken, {
    includeComments: true,
  });

  if (
    after !== nextFirstToken &&
    after.loc.start.line - prevLastToken.loc.end.line <= maxLine
  ) {
    return findLastConsecutiveTokenAfter(
      sourceCode,
      after,
      nextFirstToken,
      maxLine
    );
  }

  return prevLastToken;
}

/**
 * Return the first token among the consecutive tokens that have no exceed max line difference in between, after the last token in the previous member.
 * @param nextFirstToken The first token in the next member node.
 * @param prevLastToken The last token in the previous member node.
 * @param maxLine The maximum number of allowed line difference between consecutive tokens.
 * @returns The first token among the consecutive tokens.
 */
export function findFirstConsecutiveTokenBefore(
  sourceCode,
  nextFirstToken,
  prevLastToken,
  maxLine
) {
  const before = sourceCode.getTokenBefore(nextFirstToken, {
    includeComments: true,
  });

  if (
    before !== prevLastToken &&
    nextFirstToken.loc.start.line - before.loc.end.line <= maxLine
  ) {
    return findFirstConsecutiveTokenBefore(
      sourceCode,
      before,
      prevLastToken,
      maxLine
    );
  }

  return nextFirstToken;
}

/**
 * Checks if there is a token or comment between two tokens.
 * @param before The token before.
 * @param after The token after.
 * @returns True if there is a token or comment between two tokens.
 */
export function hasTokenOrCommentBetween(sourceCode, before, after) {
  return (
    sourceCode.getTokensBetween(before, after, { includeComments: true })
      .length !== 0
  );
}
