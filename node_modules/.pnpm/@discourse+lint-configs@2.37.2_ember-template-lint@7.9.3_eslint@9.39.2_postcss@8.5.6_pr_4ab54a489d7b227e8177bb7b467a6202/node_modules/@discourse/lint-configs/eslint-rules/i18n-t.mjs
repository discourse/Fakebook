import { fixImport } from "./utils/fix-import.mjs";

export default {
  meta: {
    type: "suggestion",
    docs: {
      description: "Use i18n(...) instead of 'I18n.t(...)'.",
    },
    fixable: "code",
    schema: [], // no options
  },

  create(context) {
    const sourceCode = context.sourceCode ?? context.getSourceCode();
    let alreadyFixedImport = false;

    return {
      MemberExpression(node) {
        const isI18nT =
          node.object.name === "I18n" && node.property.name === "t";
        if (!isI18nT) {
          return;
        }

        let scope = sourceCode.getScope(node);
        let variable;
        while (scope && !variable) {
          variable = scope.variables.find((v) => v.name === "I18n");
          scope = scope.upper;
        }

        if (!variable) {
          return;
        }

        const i18nDefaultImport = variable.defs.find(
          (d) =>
            d.type === "ImportBinding" &&
            d.node.type === "ImportDefaultSpecifier" &&
            d.node.parent.source.value === "discourse-i18n"
        );

        if (!i18nDefaultImport) {
          // I18n imported from elsewhere... weird!
          return;
        }

        context.report({
          node,
          message: "Use 'i18n(...)' instead of 'I18n.t(...)'.",
          fix(fixer) {
            const fixes = [];

            // Replace I18n.t with i18n
            fixes.push(fixer.replaceText(node, "i18n"));

            if (!alreadyFixedImport) {
              const importDeclaration = i18nDefaultImport.node.parent;
              const i18nSpecifier = importDeclaration.specifiers.find(
                (specifier) =>
                  specifier.type === "ImportSpecifier" &&
                  specifier.imported.name === "i18n"
              );

              // Check if I18n is used elsewhere
              const shouldRemoveDefaultImport = !variable.references.some(
                (ref) =>
                  ref.identifier.parent.type !== "MemberExpression" ||
                  ref.identifier.parent.property.name !== "t"
              );

              if (!i18nSpecifier || shouldRemoveDefaultImport) {
                fixes.push(
                  fixImport(fixer, importDeclaration, {
                    defaultImport: !shouldRemoveDefaultImport,
                    namedImportsToAdd: ["i18n"],
                  })
                );
              }

              alreadyFixedImport = true;
            }

            return fixes;
          },
        });
      },
    };
  },
};
