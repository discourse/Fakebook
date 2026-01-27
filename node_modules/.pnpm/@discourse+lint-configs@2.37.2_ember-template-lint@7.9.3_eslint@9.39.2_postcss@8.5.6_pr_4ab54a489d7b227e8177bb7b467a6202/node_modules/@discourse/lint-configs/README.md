# @discourse/lint-configs

Shareable lint configs for Discourse core, plugins, and themes

## Usage

Add `@discourse/lint-configs` to package.json, and create these three files:

### eslint.config.mjs

```js
import DiscourseRecommended from "@discourse/lint-configs/eslint";
export default [...DiscourseRecommended];
```

or in themes/theme components:

```js
import DiscourseThemeRecommended from "@discourse/lint-configs/eslint-theme";
export default [...DiscourseThemeRecommended];
```

### .prettierrc.cjs

```js
module.exports = require("@discourse/lint-configs/prettier");
```

### stylelint.config.mjs

```js
export default {
  extends: ["@discourse/lint-configs/stylelint"],
};
```

### .template-lintrc.cjs

```js
module.exports = require("@discourse/lint-configs/template-lint");
```
