export default {
  meta: {
    type: "problem",
    docs: {
      description:
        "Do not use themeSetting, themeI18n, or themePrefix helpers.",
    },
    fixable: "code",
    schema: [], // no options
  },

  create(context) {
    return {
      ImportDeclaration(node) {
        const modulePath = node.source.value.toLowerCase();
        const moduleScope = context.sourceCode.scopeManager.scopes.find(
          (s) => s.type === "module"
        );

        if (modulePath === "discourse/helpers/theme-setting") {
          context.report({
            node,
            message: `Importing themeSetting is not allowed.`,
            fix(fixer) {
              const fixes = [fixer.remove(node)];

              let addImport = false;
              const importName = node.specifiers[0].local.name;
              const themeSetting = moduleScope.variables.find(
                (v) => v.name === importName
              );
              themeSetting.references.forEach((ref) => {
                const expression = ref.identifier.parent.parent;

                const param = expression?.params[0];
                if (param?.value) {
                  if (expression?.type === "GlimmerMustacheStatement") {
                    fixes.push(
                      fixer.replaceText(
                        expression,
                        `{{settings.${param.value}}}`
                      )
                    );
                  } else if (expression?.type === "GlimmerSubExpression") {
                    fixes.push(
                      fixer.replaceText(expression, `settings.${param.value}`)
                    );
                  }
                } else {
                  // the complex params case
                  if (
                    [
                      "GlimmerMustacheStatement",
                      "GlimmerSubExpression",
                    ].includes(expression?.type)
                  ) {
                    if (param) {
                      addImport = true;
                      fixes.push(
                        fixer.replaceText(ref.identifier, "get settings")
                      );
                    }
                  }
                }
              });

              if (addImport) {
                const getFunction = moduleScope.variables.find(
                  (v) => v.name === "get"
                );
                if (getFunction) {
                  const importBindingDefinition = getFunction.defs[0];
                  if (importBindingDefinition.node.imported.name === "get") {
                    if (
                      importBindingDefinition.parent.source.value ===
                      "@ember/object"
                    ) {
                      // no need to add the import
                    } else {
                      // can't autofix
                      return;
                    }
                  } else {
                    // can't autofix
                    return;
                  }
                } else {
                  fixes.push(
                    fixer.insertTextAfter(
                      node,
                      `import { get } from "@ember/object";`
                    )
                  );
                }
              }

              return fixes;
            },
          });
        } else if (modulePath === "discourse/helpers/theme-prefix") {
          context.report({
            node,
            message: `Importing themePrefix is not allowed.`,
            fix(fixer) {
              const fixes = [fixer.remove(node)];

              const importName = node.specifiers[0].local.name;

              if (importName !== "themePrefix") {
                const themePrefix = moduleScope.variables.find(
                  (v) => v.name === importName
                );
                themePrefix.references.forEach((ref) => {
                  const ident = ref.identifier;

                  if (ident?.type === "VarHead") {
                    fixes.push(fixer.replaceText(ident, "themePrefix"));
                  }
                });
              }

              return fixes;
            },
          });
        } else if (modulePath === "discourse/helpers/theme-i18n") {
          context.report({
            node,
            message: `Importing themeI18n is not allowed.`,
            fix(fixer) {
              const fixes = [];

              const i18nImport = moduleScope.variables.find(
                (v) => v.name === "i18n"
              );
              if (i18nImport) {
                fixes.push(fixer.remove(node));
              } else {
                fixes.push(
                  fixer.replaceText(
                    node,
                    `import { i18n } from "discourse-i18n";`
                  )
                );
              }

              const importName = node.specifiers[0].local.name;
              const themeI18n = moduleScope.variables.find(
                (v) => v.name === importName
              );
              themeI18n.references.forEach((ref) => {
                const expression = ref.identifier.parent.parent;
                if (
                  ["GlimmerMustacheStatement", "GlimmerSubExpression"].includes(
                    expression?.type
                  )
                ) {
                  const param = expression.params[0];
                  if (param) {
                    fixes.push(fixer.replaceText(ref.identifier, "i18n"));
                    fixes.push(fixer.insertTextBefore(param, "(themePrefix "));
                    fixes.push(fixer.insertTextAfter(param, ")"));
                  }
                }
              });

              return fixes;
            },
          });
        }
      },
    };
  },
};
