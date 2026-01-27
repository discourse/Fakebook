export default {
  meta: {
    type: "suggestion",
    docs: {
      description: "Use the correct import paths",
    },
    fixable: "code",
    schema: [], // no options
  },

  create(context) {
    return {
      ImportDeclaration(node) {
        function denyImporting(symbolName, messageTemplate) {
          const specifier = node.specifiers.find(
            (spec) => spec.imported && spec.imported.name === symbolName
          );

          if (specifier) {
            context.report({
              node: specifier,
              message: messageTemplate(symbolName),
            });
          }
        }

        function denyDefaultImport(message) {
          const defaultSpecifier = node.specifiers.find(
            (spec) => spec.type === "ImportDefaultSpecifier"
          );

          if (defaultSpecifier) {
            context.report({
              node: defaultSpecifier,
              message,
            });
          }
        }

        if (node.source.value === "discourse/helpers/get-url") {
          context.report({
            node,
            message:
              "Use 'discourse/lib/get-url' instead of 'discourse/helpers/get-url'",
            fix(fixer) {
              return fixer.replaceText(node.source, `"discourse/lib/get-url"`);
            },
          });
        } else if (
          node.source.value === "discourse/helpers/html-safe" &&
          node.specifiers[0]?.local.name === "htmlSafe"
        ) {
          context.report({
            node,
            message:
              "Use '@ember/template' instead of 'discourse/helpers/html-safe'",
            fix(fixer) {
              return fixer.replaceText(
                node,
                `import { htmlSafe } from "@ember/template";`
              );
            },
          });
        } else if (
          node.source.value === "@ember/application" &&
          node.specifiers[0]?.local.name === "getOwner"
        ) {
          context.report({
            node,
            message:
              "Use '@ember/owner' instead of '@ember/application' to import 'getOwner'",
            fix(fixer) {
              return fixer.replaceText(
                node,
                `import { getOwner } from "@ember/owner";`
              );
            },
          });
        } else if (node.source.value === "@ember/array") {
          const messageTemplate = (symbolName) =>
            `Importing '${symbolName}' from '@ember/array' is deprecated. Use tracked arrays or native JavaScript arrays instead.`;

          denyImporting("A", messageTemplate);
          denyImporting("NativeArray", messageTemplate);
          denyImporting("MutableArray", messageTemplate);

          denyDefaultImport(
            "Importing EmberArray (default) from '@ember/array' is deprecated. Use tracked arrays or native JavaScript arrays instead."
          );
        } else if (node.source.value === "@ember/array/mutable") {
          denyDefaultImport(
            "Importing MutableArray (default) from '@ember/array/mutable' is deprecated. Use tracked arrays or native JavaScript arrays instead."
          );
        } else if (node.source.value === "@ember/array/proxy") {
          denyDefaultImport(
            "Importing ArrayProxy (default) from '@ember/array/proxy' is deprecated. Use tracked arrays or native JavaScript arrays instead."
          );
        }
      },
    };
  },
};
