export default {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "disallow imports from 'discourse-common' and replace with modern equivalents",
    },
    fixable: "code",
    schema: [], // no options
  },

  create(context) {
    return {
      ImportDeclaration(node) {
        const modulePath = node.source.value.toLowerCase();
        if (MAPPINGS[modulePath]) {
          const newModule = MAPPINGS[modulePath];
          context.report({
            node,
            message: `Importing ${modulePath} is no longer allowed. Use ${newModule} instead.`,
            fix(fixer) {
              return fixer.replaceText(node.source, `"${newModule}"`);
            },
          });
        }
      },
    };
  },
};

const MAPPINGS = {
  "discourse-common/helpers/base-path": "discourse/helpers/base-path",
  "discourse-common/helpers/base-url": "discourse/helpers/base-url",
  "discourse-common/helpers/bound-i18n": "discourse/helpers/bound-i18n",
  "discourse-common/helpers/component-for-collection":
    "discourse/helpers/component-for-collection",
  "discourse-common/helpers/component-for-row":
    "discourse/helpers/component-for-row",
  "discourse-common/helpers/d-icon": "discourse/helpers/d-icon",
  "discourse-common/helpers/fa-icon": "discourse/helpers/fa-icon",
  "discourse-common/helpers/get-url": "discourse/helpers/get-url",
  "discourse-common/helpers/html-safe": "discourse/helpers/html-safe",
  "discourse-common/helpers/i18n-yes-no": "discourse/helpers/i18n-yes-no",
  // "discourse-common/helpers/i18n": "discourse/helpers/i18n", // This one is handled by i18n-import-location
  "discourse-common/lib/attribute-hook": "discourse/lib/attribute-hook",
  "discourse-common/lib/avatar-utils": "discourse/lib/avatar-utils",
  "discourse-common/lib/case-converter": "discourse/lib/case-converter",
  "discourse-common/lib/debounce": "discourse/lib/debounce",
  "discourse-common/lib/deprecated": "discourse/lib/deprecated",
  "discourse-common/lib/discourse-template-map":
    "discourse/lib/discourse-template-map",
  "discourse-common/lib/dom-from-string": "discourse/lib/dom-from-string",
  "discourse-common/lib/escape": "discourse/lib/escape",
  "discourse-common/lib/get-owner": "discourse/lib/get-owner",
  "discourse-common/lib/get-url": "discourse/lib/get-url",
  "discourse-common/lib/helpers": "discourse/lib/helpers",
  "discourse-common/lib/icon-library": "discourse/lib/icon-library",
  "discourse-common/lib/later": "discourse/lib/later",
  "discourse-common/lib/loader-shim": "discourse/lib/loader-shim",
  "discourse-common/lib/object": "discourse/lib/object",
  "discourse-common/lib/popular-themes": "discourse/lib/popular-themes",
  "discourse-common/lib/raw-handlebars-helpers":
    "discourse/lib/raw-handlebars-helpers",
  "discourse-common/lib/raw-handlebars": "discourse/lib/raw-handlebars",
  "discourse-common/lib/raw-templates": "discourse/lib/raw-templates",
  "discourse-common/lib/suffix-trie": "discourse/lib/suffix-trie",
  "discourse-common/utils/decorator-alias": "discourse/lib/decorator-alias",
  "discourse-common/utils/decorators": "discourse/lib/decorators",
  "discourse-common/utils/dom-utils": "discourse/lib/dom-utils",
  "discourse-common/utils/escape-regexp": "discourse/lib/escape-regexp",
  "discourse-common/utils/extract-value": "discourse/lib/extract-value",
  "discourse-common/utils/handle-descriptor": "discourse/lib/handle-descriptor",
  "discourse-common/utils/is-descriptor": "discourse/lib/is-descriptor",
  "discourse-common/utils/macro-alias": "discourse/lib/macro-alias",
  "discourse-common/utils/multi-cache": "discourse/lib/multi-cache",
  "discourse-common/deprecation-workflow": "discourse/deprecation-workflow",
  "discourse-common/resolver": "discourse/resolver",
  "discourse-common/config/environment": "discourse/lib/environment",
};
