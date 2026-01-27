import { Dict, Stack, Nullable, SimpleElement, SimpleNode } from '@glimmer/interfaces';

declare const EMPTY_ARRAY: readonly unknown[];
declare function emptyArray<T>(): T[];
declare const EMPTY_STRING_ARRAY: string[];
declare const EMPTY_NUMBER_ARRAY: number[];
/**
 * This function returns `true` if the input array is the special empty array sentinel,
 * which is sometimes used for optimizations.
 */
declare function isEmptyArray(input: unknown[] | readonly unknown[]): boolean;
declare function reverse<T>(input: T[]): IterableIterator<T>;
declare function enumerate<T>(input: Iterable<T>): IterableIterator<[number, T]>;
type ZipEntry<T extends readonly unknown[]> = {
    [P in keyof T]: P extends `${infer N extends number}` ? [N, T[P], T[P]] : never;
}[keyof T & number];
/**
 * Zip two tuples with the same type and number of elements.
 */
declare function zipTuples<T extends readonly unknown[]>(left: T, right: T): IterableIterator<ZipEntry<T>>;
declare function zipArrays<T>(left: T[], right: T[]): IterableIterator<[
    'retain',
    number,
    T,
    T
] | ['pop', number, T, undefined] | ['push', number, undefined, T]>;

declare function dict<T = unknown>(): Dict<T>;
declare function isDict<T>(u: T): u is Dict & T;
declare function isIndexable<T>(u: T): u is object & T;
declare class StackImpl<T> implements Stack<T> {
    private stack;
    current: Nullable<T>;
    constructor(values?: T[]);
    get size(): number;
    push(item: T): void;
    pop(): Nullable<T>;
    nth(from: number): Nullable<T>;
    isEmpty(): boolean;
    snapshot(): T[];
    toArray(): T[];
}

declare let beginTestSteps: (() => void) | undefined;
declare let endTestSteps: (() => void) | undefined;
declare let verifySteps: ((type: string, steps: unknown[] | ((steps: unknown[]) => void), message?: string) => void) | undefined;
declare let logStep: ((type: string, steps: unknown) => void) | undefined;

declare function clearElement(parent: SimpleElement): void;

/**
  Strongly hint runtimes to intern the provided string.

  When do I need to use this function?

  For the most part, never. Pre-mature optimization is bad, and often the
  runtime does exactly what you need it to, and more often the trade-off isn't
  worth it.

  Why?

  Runtimes store strings in at least 2 different representations:
  Ropes and Symbols (interned strings). The Rope provides a memory efficient
  data-structure for strings created from concatenation or some other string
  manipulation like splitting.

  Unfortunately checking equality of different ropes can be quite costly as
  runtimes must resort to clever string comparison algorithms. These
  algorithms typically cost in proportion to the length of the string.
  Luckily, this is where the Symbols (interned strings) shine. As Symbols are
  unique by their string content, equality checks can be done by pointer
  comparison.

  How do I know if my string is a rope or symbol?

  Typically (warning general sweeping statement, but truthy in runtimes at
  present) static strings created as part of the JS source are interned.
  Strings often used for comparisons can be interned at runtime if some
  criteria are met.  One of these criteria can be the size of the entire rope.
  For example, in chrome 38 a rope longer then 12 characters will not
  intern, nor will segments of that rope.

  Some numbers: http://jsperf.com/eval-vs-keys/8

  Known Trick™

  @private
  @return {String} interned version of the provided string
*/
declare function intern(str: string): string;

declare const SERIALIZATION_FIRST_NODE_STRING = "%+b:0%";
declare function isSerializationFirstNode(node: SimpleNode): boolean;

declare const assign: {
    <T extends {}, U>(target: T, source: U): T & U;
    <T extends {}, U, V>(target: T, source1: U, source2: V): T & U & V;
    <T extends {}, U, V, W>(target: T, source1: U, source2: V, source3: W): T & U & V & W;
    (target: object, ...sources: any[]): any;
};
declare function values<T>(obj: {
    [s: string]: T;
}): T[];
type ObjectEntry<D extends object> = {
    [P in keyof D]: [P, D[P]];
}[keyof D];
declare function entries<D extends object>(dict: D): ObjectEntry<D>[];
declare function keys<T extends object>(obj: T): (keyof T)[];

declare function strip(strings: TemplateStringsArray, ...args: unknown[]): string;

type FIXME<T, S extends string> = (T & S) | T;
/**
 * This constant exists to make it easier to differentiate normal logs from
 * errant console.logs. LOCAL_LOGGER should only be used inside a
 * LOCAL_TRACE_LOGGING check.
 *
 * It does not alleviate the need to check LOCAL_TRACE_LOGGING, which is used
 * for stripping.
 */
declare const LOCAL_LOGGER: Console;
/**
 * This constant exists to make it easier to differentiate normal logs from
 * errant console.logs. LOGGER can be used outside of LOCAL_TRACE_LOGGING checks,
 * and is meant to be used in the rare situation where a console.* call is
 * actually appropriate.
 */
declare const LOGGER: Console;
declare function assertNever(value: never, desc?: string): never;

export { EMPTY_ARRAY, EMPTY_NUMBER_ARRAY, EMPTY_STRING_ARRAY, type FIXME, LOCAL_LOGGER, LOGGER, SERIALIZATION_FIRST_NODE_STRING, StackImpl as Stack, assertNever, assign, beginTestSteps, clearElement, dict, emptyArray, endTestSteps, entries, enumerate, intern, isDict, isEmptyArray, isIndexable, isSerializationFirstNode, keys, logStep, reverse, strip, values, verifySteps, zipArrays, zipTuples };
