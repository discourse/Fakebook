const replacements = {
  "store:main": "service:store",
  "search-service:main": "service:search",
  "key-value-store:main": "service:key-value-store",
  "pm-topic-tracking-state:main": "service:pm-topic-tracking-state",
  "message-bus:main": "service:message-bus",
  "site-settings:main": "service:site-settings",
  "capabilities:main": "service:capabilities",
  "current-user:main": "service:current-user",
  "site:main": "service:site",
  "topic-tracking-state:main": "service:topic-tracking-state",
  "controller:composer": "service:composer",
};

export default {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "replace deprecated resolver 'lookup' calls and modifyClass arguments with modern equivalents",
    },
    fixable: "code",
    schema: [], // no options
  },

  create(context) {
    return {
      CallExpression(node) {
        const calleeName =
          node.callee.type === "MemberExpression"
            ? node.callee.property.name
            : null;
        const isLookupCall = calleeName === "lookup";
        const isModifyClassCall =
          calleeName === "modifyClass" || calleeName === "modifyClassStatic";

        if ((isLookupCall || isModifyClassCall) && node.arguments.length > 0) {
          const firstArg = node.arguments[0];
          if (firstArg.type === "Literal") {
            const argValue = firstArg.value;
            const replacement = replacements[argValue];

            if (replacement) {
              context.report({
                node: firstArg,
                message: `Use '${replacement}' instead of '${argValue}'`,
                fix(fixer) {
                  return fixer.replaceText(firstArg, `"${replacement}"`);
                },
              });
            }
          }
        }
      },
    };
  },
};
