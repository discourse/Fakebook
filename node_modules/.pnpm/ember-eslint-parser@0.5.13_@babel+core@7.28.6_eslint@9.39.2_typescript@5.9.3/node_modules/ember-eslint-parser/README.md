# ember-eslint-parser

This is the eslint parser for ember's gjs and gts files (using `<template>`).

It is meant to be used with [eslint-plugin-ember](https://github.com/ember-cli/eslint-plugin-ember), which provides nice defaults for all the different file types in ember projects.

It's recommended to only use _overrides_ when defining your eslint config, so using this parser would look like this:
```js 
    {
      files: ['**/*.gjs'],
      parser: 'ember-eslint-parser',
      plugins: ['ember'],
      extends: [
        'eslint:recommended',
        'plugin:ember/recommended',
        'plugin:ember/recommended-gjs',
      ],
    },
    {
      files: ['**/*.gts'],
      parser: 'ember-eslint-parser',
      plugins: ['ember'],
      extends: [
        'eslint:recommended',
        'plugin:ember/recommended',
        'plugin:ember/recommended-gts',
      ],
    },
```

if we detect a typescript parser, it will also be used for all files, otherwise babel parser will be used.
If we cannot find a typescript parser when linting gts we throw an error. 

## Support

eslint-plugin-ember is the primary consumer of this parser library, so SemVer _may_ not be respected for other consumers.
