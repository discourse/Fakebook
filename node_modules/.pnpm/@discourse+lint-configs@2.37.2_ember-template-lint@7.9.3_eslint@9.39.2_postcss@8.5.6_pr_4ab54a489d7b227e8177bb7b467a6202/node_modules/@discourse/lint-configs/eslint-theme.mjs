import DiscourseBaseConfig from "./eslint.mjs";

export default [
  ...DiscourseBaseConfig,
  {
    languageOptions: {
      globals: {
        settings: "readonly",
        themePrefix: "readonly",
      },
    },
  },
  {
    ignores: ["javascripts/vendor/*"],
  },
];
