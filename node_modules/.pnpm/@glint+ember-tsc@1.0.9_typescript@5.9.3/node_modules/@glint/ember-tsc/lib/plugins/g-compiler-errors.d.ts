import type { LanguageServicePlugin } from '@volar/language-service';
/**
 * This LanguageServicePlugin surfaces compiler/syntax errors as diagnostics
 * within .gts/.gjs files, e.g. if there is an unclosed html tag or `{{` curly brace,
 * the entire `<template>` tag region will be highlighted as an error.
 *
 * @GLINT_FEATURE_DIAGNOSTICS
 * @GLINT_FEATURE_DIAGNOSTICS_LANGUAGE_SERVER
 * @GLINT_FEATURE_DIAGNOSTICS_LANGUAGE_SERVER_GTS_COMPILER_ERRORS
 */
export declare function create(): LanguageServicePlugin;
//# sourceMappingURL=g-compiler-errors.d.ts.map