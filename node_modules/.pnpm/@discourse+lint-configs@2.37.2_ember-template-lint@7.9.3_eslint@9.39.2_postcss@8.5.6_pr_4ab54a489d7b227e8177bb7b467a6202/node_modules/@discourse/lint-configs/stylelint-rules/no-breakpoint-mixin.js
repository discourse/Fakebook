import stylelint from "stylelint";

const ruleName = "discourse/no-breakpoint-mixin";
const messages = stylelint.utils.ruleMessages(ruleName, {
  rejected:
    'Replace "@include breakpoint(...)" with "@include viewport.until(...)"',
});

const breakpointMappings = {
  "mobile-small": "sm",
  "mobile-medium": "sm",
  "mobile-large": "sm",
  "mobile-extra-large": "sm",
  tablet: "md",
  medium: "lg",
  large: "lg",
  "extra-large": "xl",
};

const ruleFunction = (primaryOption) => {
  return (root, result) => {
    if (!primaryOption) {
      return;
    }

    root.walkAtRules("include", (atRule) => {
      if (atRule.params.startsWith("breakpoint(")) {
        // Report the issue
        stylelint.utils.report({
          message: messages.rejected,
          node: atRule,
          result,
          ruleName,
          fix: () => {
            const fixableRegex = /breakpoint\("?([^,]+?)"?(, min-width)?\)/;
            const match = atRule.params.match(fixableRegex);
            if (!match) {
              // Not autofixable
              return;
            }

            const oldBreakpoint = match[1].trim();
            const newBreakpoint = breakpointMappings[oldBreakpoint];
            const isMinWidth = match[2] === ", min-width";

            if (!newBreakpoint) {
              // Not autofixable
              return;
            }

            // Apply autofix
            if (isMinWidth) {
              atRule.params = atRule.params.replace(
                fixableRegex,
                `viewport.from(${newBreakpoint})`
              );
            } else {
              atRule.params = atRule.params.replace(
                fixableRegex,
                `viewport.until(${newBreakpoint})`
              );
            }

            // Ensure the `@use "lib/viewport";` is added at the top of the file
            const hasViewportImport = root.nodes.some(
              (node) =>
                node.type === "atrule" &&
                node.name === "use" &&
                node.params.includes('"lib/viewport"')
            );

            if (!hasViewportImport) {
              root.prepend(`@use "lib/viewport";\n`);
            }
          },
        });
      }
    });
  };
};

ruleFunction.ruleName = ruleName;
ruleFunction.messages = messages;
ruleFunction.meta = {
  fixable: true,
};

export default stylelint.createPlugin(ruleName, ruleFunction);
