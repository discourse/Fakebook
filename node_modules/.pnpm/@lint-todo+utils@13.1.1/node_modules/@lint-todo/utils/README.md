# @lint-todo/utils

![CI Build](https://github.com/lint-todo/utils/workflows/CI%20Build/badge.svg)
[![npm version](https://badge.fury.io/js/%40lint-todo%2Futils.svg)](https://badge.fury.io/js/%40lint-todo%2Futils)
[![License](https://img.shields.io/npm/l/@checkup/cli.svg)](https://github.com/checkupjs/checkup/blob/master/package.json)
![Dependabot](https://badgen.net/badge/icon/dependabot?icon=dependabot&label)
![Volta Managed](https://img.shields.io/static/v1?label=volta&message=managed&color=yellow&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QAeQC6AMEpK7AhAAAACXBIWXMAAAsSAAALEgHS3X78AAAAB3RJTUUH5AMGFS07qAYEaAAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAFmSURBVDjLY2CgB/g/j0H5/2wGW2xyTAQ1r2DQYOBgm8nwh+EY6TYvZtD7f9rn5e81fAGka17GYPL/esObP+dyj5Cs+edqZsv/V8o//H+z7P+XHarW+NSyoAv8WsFszyKTtoVBM5Tn7/Xys+zf7v76vYrJlPEvAwPjH0YGxp//3jGl/L8LU8+IrPnPUkY3ZomoDQwOpZwMv14zMHy8yMDwh4mB4Q8jA8OTgwz/L299wMDyx4Mp9f9NDAP+bWVwY3jGsJpB3JaDQVCEgYHlLwPDfwYWRqVQJgZmHoZ/+3PPfWP+68Mb/Pw5sqUoLni9ipuRnekrAwMjA8Ofb6K8/PKBF5nU7RX+Hize8Y2DOZTP7+kXogPy1zrH+f/vT/j/Z5nUvGcr5VhJioUf88UC/59L+/97gUgDyVH4YzqXxL8dOs/+zuFLJivd/53HseLPPHZPsjT/nsHi93cqozHZue7rLDYhUvUAADjCgneouzo/AAAAAElFTkSuQmCC&link=https://volta.sh)
![TypeScript](https://badgen.net/badge/icon/typescript?icon=typescript&label)
[![Code Style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](#badge)

A collection of utilities to generate and store lint item metadata.

Those utilities are:

<!--DOCS_START-->
## Functions

<dl>
<dt><a href="#buildTodoDatum">buildTodoDatum(lintResult, lintMessage, todoConfig)</a> ⇒</dt>
<dd><p>Adapts a <a href="https://github.com/lint-todo/utils/blob/master/src/types/lint.ts#L31">LintResult</a> to a <a href="https://github.com/lint-todo/utils/blob/master/src/types/todo.ts#L61">TodoData</a>. FilePaths are absolute
when received from a lint result, so they&#39;re converted to relative paths for stability in
serializing the contents to disc.</p>
</dd>
<dt><a href="#todoStorageFileExists">todoStorageFileExists(baseDir)</a> ⇒</dt>
<dd><p>Determines if the .lint-todo storage file exists.</p>
</dd>
<dt><a href="#ensureTodoStorageFile">ensureTodoStorageFile(baseDir)</a> ⇒</dt>
<dd><p>Creates, or ensures the creation of, the .lint-todo file.</p>
</dd>
<dt><a href="#getTodoStorageFilePath">getTodoStorageFilePath(baseDir)</a> ⇒</dt>
<dd></dd>
<dt><a href="#hasConflicts">hasConflicts(todoContents)</a> ⇒</dt>
<dd><p>Determines if the .lint-todo storage file has conflicts.</p>
</dd>
<dt><a href="#resolveConflicts">resolveConflicts(operations)</a> ⇒</dt>
<dd><p>Resolves git conflicts in todo operations by removing any lines that match conflict markers.</p>
</dd>
<dt><a href="#readTodoStorageFile">readTodoStorageFile(todoStorageFilePath)</a> ⇒</dt>
<dd><p>Reads the .lint-todo storage file.</p>
</dd>
<dt><a href="#writeTodoStorageFile">writeTodoStorageFile(todoStorageFilePath, operations)</a></dt>
<dd><p>Writes the operations to the .lint-todo storage file to the path provided by todoStorageFilePath.</p>
</dd>
<dt><a href="#writeTodos">writeTodos(baseDir, maybeTodos, options)</a> ⇒</dt>
<dd><p>Writes files for todo lint violations. One file is generated for each violation, using a generated
hash to identify each.</p>
<p>Given a list of todo lint violations, this function will also delete existing files that no longer
have a todo lint violation.</p>
</dd>
<dt><a href="#readTodos">readTodos(baseDir, options, shouldLock)</a> ⇒</dt>
<dd><p>Reads all todo files in the .lint-todo file.</p>
</dd>
<dt><a href="#readTodosForFilePath">readTodosForFilePath(baseDir, options, shouldLock)</a> ⇒</dt>
<dd><p>Reads todo files in the .lint-todo file for a specific filePath.</p>
</dd>
<dt><a href="#readTodoData">readTodoData(baseDir, options)</a> ⇒</dt>
<dd><p>Reads todos in the .lint-todo file and returns Todo data in an array.</p>
</dd>
<dt><a href="#readTodoDataForFilePath">readTodoDataForFilePath(baseDir, options)</a> ⇒</dt>
<dd><p>Reads todos for a single filePath in the .lint-todo file and returns Todo data in an array.</p>
</dd>
<dt><a href="#generateTodoBatches">generateTodoBatches(baseDir, maybeTodos, options)</a> ⇒</dt>
<dd><p>Gets 4 data structures containing todo items to add, remove, those that are expired, and those that are stable (not to be modified).</p>
</dd>
<dt><a href="#getTodoBatches">getTodoBatches(maybeTodos, existing, options)</a> ⇒</dt>
<dd><p>Gets 4 data structures containing todo items to add, remove, those that are expired, and those that are stable (not to be modified).</p>
</dd>
<dt><a href="#applyTodoChanges">applyTodoChanges(baseDir, add, remove, shouldLock)</a></dt>
<dd><p>Applies todo changes, either adding or removing, based on batches from <code>getTodoBatches</code>.</p>
</dd>
<dt><a href="#compactTodoStorageFile">compactTodoStorageFile(baseDir)</a> ⇒</dt>
<dd><p>Compacts the .lint-todo storage file.</p>
</dd>
<dt><a href="#getTodoConfig">getTodoConfig(baseDir, engine, customDaysToDecay)</a> ⇒</dt>
<dd><p>Gets the todo configuration from one of a number of locations.</p>
</dd>
<dt><a href="#validateConfig">validateConfig(baseDir)</a> ⇒</dt>
<dd><p>Validates whether we have a unique config in a single location.</p>
</dd>
<dt><a href="#getSeverity">getSeverity(todo, today)</a> ⇒</dt>
<dd><p>Returns the correct severity level based on the todo data&#39;s decay dates.</p>
</dd>
<dt><a href="#isExpired">isExpired(date, today)</a> ⇒</dt>
<dd><p>Evaluates whether a date is expired (earlier than today)</p>
</dd>
<dt><a href="#getDatePart">getDatePart(date)</a> ⇒</dt>
<dd><p>Converts a date to include year, month, and day values only (time is zeroed out).</p>
</dd>
<dt><a href="#differenceInDays">differenceInDays(startDate, endDate)</a> ⇒</dt>
<dd><p>Returns the difference in days between two dates.</p>
</dd>
<dt><a href="#format">format(date)</a> ⇒</dt>
<dd><p>Formats the date in short form, eg. 2021-01-01</p>
</dd>
<dt><a href="#buildRange">buildRange(line, column, endLine, endColumn)</a> ⇒</dt>
<dd><p>Converts node positional numbers into a Range object.</p>
</dd>
<dt><a href="#readSource">readSource(filePath)</a> ⇒</dt>
<dd><p>Reads a source file, optionally caching it if it&#39;s already been read.</p>
</dd>
<dt><a href="#getSourceForRange">getSourceForRange(source, range)</a> ⇒</dt>
<dd><p>Extracts a source fragment from a file&#39;s contents based on the provided Range.</p>
</dd>
</dl>

<a name="buildTodoDatum"></a>

## buildTodoDatum(lintResult, lintMessage, todoConfig) ⇒
Adapts a [LintResult](https://github.com/lint-todo/utils/blob/master/src/types/lint.ts#L31) to a [TodoData](https://github.com/lint-todo/utils/blob/master/src/types/todo.ts#L61). FilePaths are absolute
when received from a lint result, so they're converted to relative paths for stability in
serializing the contents to disc.

**Kind**: global function  
**Returns**: - A [TodoData](https://github.com/lint-todo/utils/blob/master/src/types/todo.ts#L61) object.  

| Param | Description |
| --- | --- |
| lintResult | The lint result object. |
| lintMessage | A lint message object representing a specific violation for a file. |
| todoConfig | An object containing the warn or error days, in integers. |

<a name="todoStorageFileExists"></a>

## todoStorageFileExists(baseDir) ⇒
Determines if the .lint-todo storage file exists.

**Kind**: global function  
**Returns**: - true if the todo storage file exists, otherwise false.  

| Param | Description |
| --- | --- |
| baseDir | The base directory that contains the .lint-todo storage file. |

<a name="ensureTodoStorageFile"></a>

## ensureTodoStorageFile(baseDir) ⇒
Creates, or ensures the creation of, the .lint-todo file.

**Kind**: global function  
**Returns**: - The todo storage file path.  

| Param | Description |
| --- | --- |
| baseDir | The base directory that contains the .lint-todo storage file. |

<a name="getTodoStorageFilePath"></a>

## getTodoStorageFilePath(baseDir) ⇒
**Kind**: global function  
**Returns**: - The todo storage file path.  

| Param | Description |
| --- | --- |
| baseDir | The base directory that contains the .lint-todo storage file. |

<a name="hasConflicts"></a>

## hasConflicts(todoContents) ⇒
Determines if the .lint-todo storage file has conflicts.

**Kind**: global function  
**Returns**: true if the file has conflicts, otherwise false.  

| Param | Description |
| --- | --- |
| todoContents | The unparsed contents of the .lint-todo file. |

<a name="resolveConflicts"></a>

## resolveConflicts(operations) ⇒
Resolves git conflicts in todo operations by removing any lines that match conflict markers.

**Kind**: global function  
**Returns**: An array of string operations excluding any operations that were identified as git conflict lines.  

| Param | Description |
| --- | --- |
| operations | An array of string operations that are used to recreate todos. |

<a name="readTodoStorageFile"></a>

## readTodoStorageFile(todoStorageFilePath) ⇒
Reads the .lint-todo storage file.

**Kind**: global function  
**Returns**: A array of todo operations.  

| Param | Description |
| --- | --- |
| todoStorageFilePath | The .lint-todo storage file path. |

<a name="writeTodoStorageFile"></a>

## writeTodoStorageFile(todoStorageFilePath, operations)
Writes the operations to the .lint-todo storage file to the path provided by todoStorageFilePath.

**Kind**: global function  

| Param | Description |
| --- | --- |
| todoStorageFilePath | The .lint-todo storage file path. |
| operations | An array of string operations that are used to recreate todos. |

<a name="writeTodos"></a>

## writeTodos(baseDir, maybeTodos, options) ⇒
Writes files for todo lint violations. One file is generated for each violation, using a generated
hash to identify each.

Given a list of todo lint violations, this function will also delete existing files that no longer
have a todo lint violation.

**Kind**: global function  
**Returns**: - The counts of added and removed todos.  

| Param | Description |
| --- | --- |
| baseDir | The base directory that contains the .lint-todo storage file. |
| maybeTodos | The linting data, converted to TodoData format. |
| options | An object containing write options. |

<a name="readTodos"></a>

## readTodos(baseDir, options, shouldLock) ⇒
Reads all todo files in the .lint-todo file.

**Kind**: global function  
**Returns**: - A [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) of [FilePath](https://github.com/lint-todo/utils/blob/master/src/types/todo.ts#L25)/[TodoMatcher](https://github.com/lint-todo/utils/blob/master/src/todo-matcher.ts#L4).  

| Param | Default | Description |
| --- | --- | --- |
| baseDir |  | The base directory that contains the .lint-todo storage file. |
| options |  | An object containing read options. |
| shouldLock | <code>true</code> | True if the .lint-todo storage file should be locked, otherwise false. Default: true. |

<a name="readTodosForFilePath"></a>

## readTodosForFilePath(baseDir, options, shouldLock) ⇒
Reads todo files in the .lint-todo file for a specific filePath.

**Kind**: global function  
**Returns**: - A [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) of [FilePath](https://github.com/lint-todo/utils/blob/master/src/types/todo.ts#L25)/[TodoMatcher](https://github.com/lint-todo/utils/blob/master/src/todo-matcher.ts#L4).  

| Param | Default | Description |
| --- | --- | --- |
| baseDir |  | The base directory that contains the .lint-todo storage file. |
| options |  | An object containing read options. |
| shouldLock | <code>true</code> | True if the .lint-todo storage file should be locked, otherwise false. Default: true. |

<a name="readTodoData"></a>

## readTodoData(baseDir, options) ⇒
Reads todos in the .lint-todo file and returns Todo data in an array.

**Kind**: global function  
**Returns**: An array of [TodoData](https://github.com/lint-todo/utils/blob/master/src/types/todo.ts#L61)  

| Param | Description |
| --- | --- |
| baseDir | The base directory that contains the .lint-todo storage file. |
| options | An object containing read options. |

<a name="readTodoDataForFilePath"></a>

## readTodoDataForFilePath(baseDir, options) ⇒
Reads todos for a single filePath in the .lint-todo file and returns Todo data in an array.

**Kind**: global function  
**Returns**: An array of [TodoData](https://github.com/lint-todo/utils/blob/master/src/types/todo.ts#L61)  

| Param | Description |
| --- | --- |
| baseDir | The base directory that contains the .lint-todo storage file. |
| options | An object containing read options. |

<a name="generateTodoBatches"></a>

## generateTodoBatches(baseDir, maybeTodos, options) ⇒
Gets 4 data structures containing todo items to add, remove, those that are expired, and those that are stable (not to be modified).

**Kind**: global function  
**Returns**: - An object of [TodoBatches](https://github.com/lint-todo/utils/blob/master/src/types/todo.ts#L36).  

| Param | Description |
| --- | --- |
| baseDir | The base directory that contains the .lint-todo storage file. |
| maybeTodos | The linting data for violations. |
| options | An object containing write options. |

<a name="getTodoBatches"></a>

## getTodoBatches(maybeTodos, existing, options) ⇒
Gets 4 data structures containing todo items to add, remove, those that are expired, and those that are stable (not to be modified).

**Kind**: global function  
**Returns**: - An object of [TodoBatches](https://github.com/lint-todo/utils/blob/master/src/types/todo.ts#L36).  

| Param | Description |
| --- | --- |
| maybeTodos | The linting data for violations. |
| existing | Existing todo lint data. |
| options | An object containing write options. |

<a name="applyTodoChanges"></a>

## applyTodoChanges(baseDir, add, remove, shouldLock)
Applies todo changes, either adding or removing, based on batches from `getTodoBatches`.

**Kind**: global function  

| Param | Default | Description |
| --- | --- | --- |
| baseDir |  | The base directory that contains the .lint-todo storage file. |
| add |  | Batch of todos to add. |
| remove |  | Batch of todos to remove. |
| shouldLock | <code>true</code> | True if the .lint-todo storage file should be locked, otherwise false. Default: true. |

<a name="compactTodoStorageFile"></a>

## compactTodoStorageFile(baseDir) ⇒
Compacts the .lint-todo storage file.

**Kind**: global function  
**Returns**: The count of compacted todos.  

| Param | Description |
| --- | --- |
| baseDir | The base directory that contains the .lint-todo storage file. |

<a name="getTodoConfig"></a>

## getTodoConfig(baseDir, engine, customDaysToDecay) ⇒
Gets the todo configuration from one of a number of locations.

**Kind**: global function  
**Returns**: - The todo config object.  

| Param | Description |
| --- | --- |
| baseDir | The base directory that contains the project's package.json. |
| engine | The engine for this configuration, eg. eslint |
| customDaysToDecay | The optional custom days to decay configuration. |

**Example**  
Using the package.json
```json
{
  "lintTodo": {
    "some-engine": {
      "daysToDecay": {
        "warn": 5,
        "error": 10
      },
      "daysToDecayByRule": {
        "no-bare-strings": { "warn": 10, "error": 20 }
      }
    }
  }
}
```
**Example**  
Using the .lint-todorc.js file
```js
module.exports = {
  "some-engine": {
    "daysToDecay": {
      "warn": 5,
      "error": 10
    },
    "daysToDecayByRule": {
      "no-bare-strings": { "warn": 10, "error": 20 }
    }
  }
}
```
**Example**  
```js
Using environment variables (`TODO_DAYS_TO_WARN` or `TODO_DAYS_TO_ERROR`)
	- Env vars override package.json config
```
**Example**  
```js
Passed in directly, such as from command line options.
	- Passed in options override both env vars and package.json config
```
<a name="validateConfig"></a>

## validateConfig(baseDir) ⇒
Validates whether we have a unique config in a single location.

**Kind**: global function  
**Returns**: A ConfigValidationResult that indicates whether a config is unique  

| Param | Description |
| --- | --- |
| baseDir | The base directory that contains the project's package.json. |

<a name="getSeverity"></a>

## getSeverity(todo, today) ⇒
Returns the correct severity level based on the todo data's decay dates.

**Kind**: global function  
**Returns**: Severity - the lint severity based on the evaluation of the decay dates.  

| Param | Description |
| --- | --- |
| todo | The todo data. |
| today | A number representing a date (UNIX Epoch - milliseconds) |

<a name="isExpired"></a>

## isExpired(date, today) ⇒
Evaluates whether a date is expired (earlier than today)

**Kind**: global function  
**Returns**: true if the date is earlier than today, otherwise false  

| Param | Description |
| --- | --- |
| date | The date to evaluate |
| today | A number representing a date (UNIX Epoch - milliseconds) |

<a name="getDatePart"></a>

## getDatePart(date) ⇒
Converts a date to include year, month, and day values only (time is zeroed out).

**Kind**: global function  
**Returns**: Date - A date with the time zeroed out eg. '2021-01-01T08:00:00.000Z'  

| Param | Description |
| --- | --- |
| date | The date to convert |

<a name="differenceInDays"></a>

## differenceInDays(startDate, endDate) ⇒
Returns the difference in days between two dates.

**Kind**: global function  
**Returns**: a number representing the days between the dates  

| Param | Description |
| --- | --- |
| startDate | The start date |
| endDate | The end date |

<a name="format"></a>

## format(date) ⇒
Formats the date in short form, eg. 2021-01-01

**Kind**: global function  
**Returns**: A string representing the formatted date  

| Param | Description |
| --- | --- |
| date | The date to format |

<a name="buildRange"></a>

## buildRange(line, column, endLine, endColumn) ⇒
Converts node positional numbers into a Range object.

**Kind**: global function  
**Returns**: A range object.  

| Param | Description |
| --- | --- |
| line | The source start line. |
| column | The source start column. |
| endLine | The source end line. |
| endColumn | The source end column. |

<a name="readSource"></a>

## readSource(filePath) ⇒
Reads a source file, optionally caching it if it's already been read.

**Kind**: global function  
**Returns**: The file contents.  

| Param | Description |
| --- | --- |
| filePath | The path to the source file. |

<a name="getSourceForRange"></a>

## getSourceForRange(source, range) ⇒
Extracts a source fragment from a file's contents based on the provided Range.

**Kind**: global function  
**Returns**: The source fragment.  

| Param | Description |
| --- | --- |
| source | The file contents. |
| range | A Range object representing the range to extract from the file contents. |


<!--DOCS_END-->
