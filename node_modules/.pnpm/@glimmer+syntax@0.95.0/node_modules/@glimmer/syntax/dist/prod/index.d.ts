import { Nullable, Maybe, PresentArray, GetContextualFreeOpcode, Dict, Core } from '@glimmer/interfaces';

/**
 * @module
 *
 * This file contains types for the raw AST returned from the Handlebars parser.
 * These types were originally imported from
 * https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/handlebars/index.d.ts.
 */

interface CommonNode {
    loc: SourceLocation$1;
}
interface SourceLocation$1 {
    source: string;
    start: Position;
    end: Position;
}
interface Position {
    line: number;
    column: number;
}
interface Program$1 extends CommonNode {
    type: 'Program';
    body: Statement$1[];
    blockParams?: string[];
    chained?: boolean;
}
type Statement$1 = MustacheStatement$1 | BlockStatement$1 | DecoratorBlock | PartialStatement | PartialBlockStatement | ContentStatement | CommentStatement$1;
interface CommonMustache extends CommonNode {
    path: Expression$1;
    params: Expression$1[];
    hash: Hash$1;
    escaped: boolean;
    strip: StripFlags$1;
}
interface MustacheStatement$1 extends CommonMustache {
    type: 'MustacheStatement';
}
interface CommonBlock extends CommonNode {
    chained: boolean;
    path: PathExpression$2 | SubExpression$1;
    params: Expression$1[];
    hash: Hash$1;
    program: Program$1;
    inverse?: Program$1;
    openStrip?: StripFlags$1;
    inverseStrip?: StripFlags$1;
    closeStrip?: StripFlags$1;
}
interface BlockStatement$1 extends CommonBlock {
    type: 'BlockStatement';
}
interface DecoratorBlock extends CommonBlock {
    type: 'DecoratorBlock';
}
interface PartialStatement extends CommonNode {
    type: 'PartialStatement';
    name: PathExpression$2 | SubExpression$1;
    params: Expression$1[];
    hash: Hash$1;
    indent: string;
    strip: StripFlags$1;
}
interface PartialBlockStatement extends CommonNode {
    type: 'PartialBlockStatement';
    name: PathExpression$2 | SubExpression$1;
    params: Expression$1[];
    hash: Hash$1;
    program: Program$1;
    openStrip: StripFlags$1;
    closeStrip: StripFlags$1;
}
interface ContentStatement extends CommonNode {
    type: 'ContentStatement';
    value: string;
    original: StripFlags$1;
}
interface CommentStatement$1 extends CommonNode {
    type: 'CommentStatement';
    value: string;
    strip: StripFlags$1;
}
type Expression$1 = SubExpression$1 | PathExpression$2 | Literal$1;
interface SubExpression$1 extends CommonNode {
    type: 'SubExpression';
    path: PathExpression$2 | SubExpression$1;
    params: Expression$1[];
    hash: Hash$1;
}
interface PathExpression$2 extends CommonNode {
    type: 'PathExpression';
    data: boolean;
    depth: number;
    parts: string[];
    original: string;
}
type Literal$1 = StringLiteral$2 | BooleanLiteral$1 | NumberLiteral$1 | UndefinedLiteral$1 | NullLiteral$1;
interface StringLiteral$2 extends CommonNode {
    type: 'StringLiteral';
    value: string;
    original: string;
}
interface BooleanLiteral$1 extends CommonNode {
    type: 'BooleanLiteral';
    value: boolean;
    original: boolean;
}
interface NumberLiteral$1 extends CommonNode {
    type: 'NumberLiteral';
    value: number;
    original: number;
}
interface UndefinedLiteral$1 extends CommonNode {
    type: 'UndefinedLiteral';
}
interface NullLiteral$1 extends CommonNode {
    type: 'NullLiteral';
}
interface Hash$1 extends CommonNode {
    pairs: HashPair$1[];
}
interface HashPair$1 extends CommonNode {
    key: string;
    value: Expression$1;
}
interface StripFlags$1 {
    open: boolean;
    close: boolean;
}

declare const visitorKeys: {
    readonly Template: readonly ["body"];
    readonly Block: readonly ["body"];
    readonly MustacheStatement: readonly ["path", "params", "hash"];
    readonly BlockStatement: readonly ["path", "params", "hash", "program", "inverse"];
    readonly ElementModifierStatement: readonly ["path", "params", "hash"];
    readonly CommentStatement: readonly [];
    readonly MustacheCommentStatement: readonly [];
    readonly ElementNode: readonly ["attributes", "modifiers", "children", "comments"];
    readonly AttrNode: readonly ["value"];
    readonly TextNode: readonly [];
    readonly ConcatStatement: readonly ["parts"];
    readonly SubExpression: readonly ["path", "params", "hash"];
    readonly PathExpression: readonly [];
    readonly StringLiteral: readonly [];
    readonly BooleanLiteral: readonly [];
    readonly NumberLiteral: readonly [];
    readonly NullLiteral: readonly [];
    readonly UndefinedLiteral: readonly [];
    readonly Hash: readonly ["pairs"];
    readonly HashPair: readonly ["value"];
};
type VisitorKeysMap = typeof visitorKeys;
type VisitorKeys = {
    [P in keyof VisitorKeysMap]: VisitorKeysMap[P][number];
};
type VisitorKey<N extends Node> = VisitorKeys[N['type']] & keyof N;

declare class WalkerPath<N extends Node> {
    node: N;
    parent: WalkerPath<Node> | null;
    parentKey: string | null;
    constructor(node: N, parent?: WalkerPath<Node> | null, parentKey?: string | null);
    get parentNode(): Node | null;
    parents(): Iterable<WalkerPath<Node> | null>;
}

interface FullNodeTraversal<N extends Node> {
    enter?(node: N, path: WalkerPath<N>): void;
    exit?(node: N, path: WalkerPath<N>): void;
    keys?: KeysVisitor<N>;
}
type NodeHandler<N extends Node> = (node: N, path: WalkerPath<N>) => Node | Node[] | undefined | void;
type NodeTraversal<N extends Node> = FullNodeTraversal<N> | NodeHandler<N>;
type NodeVisitor = {
    [P in keyof Nodes]?: NodeTraversal<Nodes[P]>;
} & {
    All?: NodeTraversal<Node>;
    /**
     * @deprecated use Template or Block instead
     */
    Program?: NodeTraversal<Template$1 | Block$1>;
};
interface FullKeyTraversal<N extends Node, K extends string> {
    enter?(node: N, key: K): void;
    exit?(node: N, key: K): void;
}
type KeyHandler<N extends Node, K extends VisitorKey<N>> = (node: N, key: K) => void;
type KeyTraversal<N extends Node, K extends VisitorKey<N>> = FullKeyTraversal<N, K> | KeyHandler<N, K>;
type KeysVisitor<N extends Node> = {
    [P in VisitorKey<N>]?: KeyTraversal<N, P>;
} & {
    All?: KeyTraversal<N, VisitorKey<N>>;
    /**
     * @deprecated use Template or Block instead
     */
    Program?: KeyTraversal<Template$1 | Block$1, 'body'>;
};

declare function traverse(node: Node, visitor: NodeVisitor): void;

type NodeCallback<N extends Node> = (node: N, walker: Walker) => void;
declare class Walker {
    order?: unknown | undefined;
    stack: unknown[];
    constructor(order?: unknown | undefined);
    visit<N extends Node>(node: Nullable<N>, visitor: NodeCallback<N>): void;
    children<N extends Node>(node: N & Node, callback: NodeCallback<N & Node>): void;
}

type BuilderHead = string | CallableExpression;
type TagDescriptor = string | PathExpression$1 | {
    path: PathExpression$1;
    selfClosing?: boolean;
} | {
    name: string;
    selfClosing?: boolean;
};
declare function buildMustache(path: BuilderHead | Literal, params?: Expression[], hash?: Hash, trusting?: boolean, loc?: SourceLocation, strip?: StripFlags): MustacheStatement;
type PossiblyDeprecatedBlock = Block$1 | Template$1;
declare function buildBlock(path: BuilderHead, params: Nullable<Expression[]>, hash: Nullable<Hash>, _defaultBlock: PossiblyDeprecatedBlock, _elseBlock?: Nullable<PossiblyDeprecatedBlock>, loc?: SourceLocation, openStrip?: StripFlags, inverseStrip?: StripFlags, closeStrip?: StripFlags): BlockStatement;
declare function buildElementModifier(path: BuilderHead, params?: Expression[], hash?: Hash, loc?: Nullable<SourceLocation>): ElementModifierStatement;
declare function buildComment(value: string, loc?: SourceLocation): CommentStatement;
declare function buildMustacheComment(value: string, loc?: SourceLocation): MustacheCommentStatement;
declare function buildConcat(parts: (TextNode | MustacheStatement)[], loc?: SourceLocation): ConcatStatement;
interface BuildElementOptions {
    attrs?: AttrNode$1[];
    modifiers?: ElementModifierStatement[];
    children?: Statement[];
    comments?: MustacheCommentStatement[];
    blockParams?: VarHead[] | string[];
    openTag?: SourceLocation;
    closeTag?: Maybe<SourceLocation>;
    loc?: SourceLocation;
}
declare function buildElement(tag: TagDescriptor, options?: BuildElementOptions): ElementNode$1;
declare function buildAttr(name: string, value: AttrValue, loc?: SourceLocation): AttrNode$1;
declare function buildText(chars?: string, loc?: SourceLocation): TextNode;
declare function buildSexpr(path: BuilderHead, params?: Expression[], hash?: Hash, loc?: SourceLocation): SubExpression;
declare function buildThis(loc?: SourceLocation): ThisHead;
declare function buildAtName(name: string, loc?: SourceLocation): AtHead;
declare function buildVar(name: string, loc?: SourceLocation): VarHead;
declare function buildHeadFromString(original: string, loc?: SourceLocation): PathHead;
declare function buildCleanPath(head: PathHead, tail?: string[], loc?: SourceLocation): PathExpression$1;
declare function buildPath(path: PathExpression$1 | string | {
    head: string;
    tail: string[];
}, loc?: SourceLocation): PathExpression$1;
declare function buildPath(path: BuilderHead, loc?: SourceLocation): CallableExpression;
declare function buildPath(path: BuilderHead | Literal | Expression, loc?: SourceLocation): Expression;
declare function buildLiteral<T extends Literal>(type: T['type'], value: T['value'], loc?: SourceLocation): T;
declare function buildHash(pairs?: HashPair[], loc?: SourceLocation): Hash;
declare function buildPair(key: string, value: Expression, loc?: SourceLocation): HashPair;
declare function buildProgram(body?: Statement[], blockParams?: string[], loc?: SourceLocation): Template$1 | Block$1;
declare function buildBlockItself(body?: Statement[], params?: Array<VarHead | string>, chained?: boolean, loc?: SourceLocation): Block$1;
declare function buildTemplate(body?: Statement[], blockParams?: string[], loc?: SourceLocation): Template$1;
declare function buildPosition(line: number, column: number): SourcePosition;
declare function buildLoc(loc: Nullable<SourceLocation>): SourceSpan;
declare function buildLoc(startLine: number, startColumn: number, endLine?: number, endColumn?: number, source?: string): SourceSpan;
declare const _default: {
    mustache: typeof buildMustache;
    block: typeof buildBlock;
    comment: typeof buildComment;
    mustacheComment: typeof buildMustacheComment;
    element: typeof buildElement;
    elementModifier: typeof buildElementModifier;
    attr: typeof buildAttr;
    text: typeof buildText;
    sexpr: typeof buildSexpr;
    concat: typeof buildConcat;
    hash: typeof buildHash;
    pair: typeof buildPair;
    literal: typeof buildLiteral;
    program: typeof buildProgram;
    blockItself: typeof buildBlockItself;
    template: typeof buildTemplate;
    loc: typeof buildLoc;
    pos: typeof buildPosition;
    path: typeof buildPath;
    fullPath: typeof buildCleanPath;
    head: typeof buildHeadFromString;
    at: typeof buildAtName;
    var: typeof buildVar;
    this: typeof buildThis;
    string: (value: string) => StringLiteral$1;
    boolean: (value: boolean) => BooleanLiteral;
    number: (value: number) => NumberLiteral;
    undefined(): UndefinedLiteral;
    null(): NullLiteral;
};

/**
  ASTPlugins can make changes to the Glimmer template AST before
  compilation begins.
*/
interface ASTPluginBuilder<TEnv extends ASTPluginEnvironment = ASTPluginEnvironment> {
    (env: TEnv): ASTPlugin;
}
interface ASTPlugin {
    name: string;
    visitor: NodeVisitor;
}
interface ASTPluginEnvironment {
    meta?: object | undefined;
    syntax: Syntax;
}
interface HandlebarsParseOptions {
    srcName?: string;
    ignoreStandalone?: boolean;
}
interface TemplateIdFn {
    (src: string): Nullable<string>;
}
interface PrecompileOptions extends PreprocessOptions {
    id?: TemplateIdFn;
    /**
     * Additional non-native keywords.
     *
     * Local variables (block params or lexical scope) always takes precedence,
     * but otherwise, suitable free variable candidates (e.g. those are not part
     * of a path) are matched against this list and turned into keywords.
     *
     * In strict mode compilation, keywords suppresses the undefined reference
     * error and will be resolved by the runtime environment.
     *
     * In loose mode, keywords are currently ignored and since all free variables
     * are already resolved by the runtime environment.
     */
    keywords?: readonly string[];
    /**
     * In loose mode, this hook allows embedding environments to customize the name of an
     * angle-bracket component. In practice, this means that `<HelloWorld />` in Ember is
     * compiled by Glimmer as an invocation of a component named `hello-world`.
     *
     * It's a little weird that this is needed in addition to the resolver, but it's a
     * classic-only feature and it seems fine to leave it alone for classic consumers.
     */
    customizeComponentName?: ((input: string) => string) | undefined;
}
interface PrecompileOptionsWithLexicalScope extends PrecompileOptions {
    lexicalScope: (variable: string) => boolean;
    /**
     * If `emit.debugSymbols` is set to `true`, the name of lexical local variables
     * will be included in the wire format.
     */
    emit?: {
        debugSymbols?: boolean;
    } | undefined;
}
interface PreprocessOptions {
    strictMode?: boolean | undefined;
    locals?: string[] | undefined;
    meta?: {
        moduleName?: string | undefined;
    } | undefined;
    plugins?: {
        ast?: ASTPluginBuilder[] | undefined;
    } | undefined;
    parseOptions?: HandlebarsParseOptions | undefined;
    customizeComponentName?: ((input: string) => string) | undefined;
    /**
      Useful for specifying a group of options together.
  
      When `'codemod'` we disable all whitespace control in handlebars
      (to preserve as much as possible) and we also avoid any
      escaping/unescaping of HTML entity codes.
     */
    mode?: 'codemod' | 'precompile' | undefined;
}
interface Syntax {
    parse: typeof preprocess;
    builders: typeof _default;
    print: typeof build;
    traverse: typeof traverse;
    Walker: typeof Walker;
}
declare function preprocess(input: string | Source | Program$1, options?: PreprocessOptions): Template$1;

declare class Source {
    readonly source: string;
    readonly module: string;
    static from(source: string, options?: PrecompileOptions): Source;
    constructor(source: string, module?: string);
    /**
     * Validate that the character offset represents a position in the source string.
     */
    validate(offset: number): boolean;
    slice(start: number, end: number): string;
    offsetFor(line: number, column: number): SourceOffset;
    spanFor({ start, end }: Readonly<SourceLocation>): SourceSpan;
    hbsPosFor(offset: number): Nullable<SourcePosition>;
    charPosFor(position: SourcePosition): number | null;
}

/**
 * We have already computed the character position of this offset or span.
 */
type CharOffsetKind = 'CharPosition';
/**
 * This offset or span was instantiated with a Handlebars SourcePosition or SourceLocation. Its
 * character position will be computed on demand.
 */
type HbsPositionKind = 'HbsPosition';
/**
 * for (rare) situations where a node is created but there was no source location (e.g. the name
 * "default" in default blocks when the word "default" never appeared in source). This is used
 * by the internals when there is a legitimate reason for the internals to synthesize a node
 * with no location.
 */
type InternalSyntheticKind = 'InternalsSynthetic';
/**
 * For situations where a node represents zero parts of the source (for example, empty arguments).
 * In general, we attempt to assign these nodes *some* position (empty arguments can be
 * positioned immediately after the callee), but it's not always possible
 */
type NonExistentKind = 'NonExistent';
/**
 * For situations where a source location was expected, but it didn't correspond to the node in
 * the source. This happens if a plugin creates broken locations.
 */
type BrokenKind = 'Broken';
type OffsetKind = CharOffsetKind | HbsPositionKind | InvisibleKind;
/**
 * These kinds  describe spans that don't have a concrete location in the original source.
 */
type InvisibleKind = BrokenKind | InternalSyntheticKind | NonExistentKind;

type SerializedSourceSlice<Chars extends string = string> = [
    chars: Chars,
    span: SerializedSourceSpan
];
declare class SourceSlice<Chars extends string = string> {
    static synthetic<S extends string>(chars: S): SourceSlice<S>;
    static load(source: Source, slice: SerializedSourceSlice): SourceSlice;
    readonly chars: Chars;
    readonly loc: SourceSpan;
    constructor(options: {
        loc: SourceSpan;
        chars: Chars;
    });
    getString(): string;
    serialize(): SerializedSourceSlice<Chars>;
}

/**
 * All spans have these details in common.
 */
interface SpanData {
    readonly kind: OffsetKind;
    /**
     * Convert this span into a string. If the span is broken, return `''`.
     */
    asString(): string;
    /**
     * Gets the module the span was located in.
     */
    getModule(): string;
    /**
     * Get the starting position for this span. Try to avoid creating new position objects, as they
     * cache computations.
     */
    getStart(): AnyPosition;
    /**
     * Get the ending position for this span. Try to avoid creating new position objects, as they
     * cache computations.
     */
    getEnd(): AnyPosition;
    /**
     * Compute the `SourceLocation` for this span, returned as an instance of `HbsSpan`.
     */
    toHbsSpan(): HbsSpan | null;
    /**
     * For compatibility, whenever the `start` or `end` of a {@see SourceOffset} changes, spans are
     * notified of the change so they can update themselves. This shouldn't happen outside of AST
     * plugins.
     */
    locDidUpdate(changes: {
        start?: SourcePosition;
        end?: SourcePosition;
    }): void;
    /**
     * Serialize into a {@see SerializedSourceSpan}, which is compact and designed for readability in
     * context like AST Explorer. If you need a {@see SourceLocation}, use {@see toJSON}.
     */
    serialize(): SerializedSourceSpan;
}
/**
 * A `SourceSpan` object represents a span of characters inside of a template source.
 *
 * There are three kinds of `SourceSpan` objects:
 *
 * - `ConcreteSourceSpan`, which contains byte offsets
 * - `LazySourceSpan`, which contains `SourceLocation`s from the Handlebars AST, which can be
 *   converted to byte offsets on demand.
 * - `InvisibleSourceSpan`, which represent source strings that aren't present in the source,
 *   because:
 *     - they were created synthetically
 *     - their location is nonsensical (the span is broken)
 *     - they represent nothing in the source (this currently happens only when a bug in the
 *       upstream Handlebars parser fails to assign a location to empty blocks)
 *
 * At a high level, all `SourceSpan` objects provide:
 *
 * - byte offsets
 * - source in column and line format
 *
 * And you can do these operations on `SourceSpan`s:
 *
 * - collapse it to a `SourceSpan` representing its starting or ending position
 * - slice out some characters, optionally skipping some characters at the beginning or end
 * - create a new `SourceSpan` with a different starting or ending offset
 *
 * All SourceSpan objects implement `SourceLocation`, for compatibility. All SourceSpan
 * objects have a `toJSON` that emits `SourceLocation`, also for compatibility.
 *
 * For compatibility, subclasses of `AbstractSourceSpan` must implement `locDidUpdate`, which
 * happens when an AST plugin attempts to modify the `start` or `end` of a span directly.
 *
 * The goal is to avoid creating any problems for use-cases like AST Explorer.
 */
declare class SourceSpan implements SourceLocation {
    private data;
    static get NON_EXISTENT(): SourceSpan;
    static load(source: Source, serialized: SerializedSourceSpan): SourceSpan;
    static forHbsLoc(source: Source, loc: SourceLocation): SourceSpan;
    static forCharPositions(source: Source, startPos: number, endPos: number): SourceSpan;
    static synthetic(chars: string): SourceSpan;
    static broken(pos?: SourceLocation): SourceSpan;
    readonly isInvisible: boolean;
    constructor(data: SpanData & AnySpan);
    getStart(): SourceOffset;
    getEnd(): SourceOffset;
    get loc(): SourceLocation;
    get module(): string;
    /**
     * Get the starting `SourcePosition` for this `SourceSpan`, lazily computing it if needed.
     */
    get startPosition(): SourcePosition;
    /**
     * Get the ending `SourcePosition` for this `SourceSpan`, lazily computing it if needed.
     */
    get endPosition(): SourcePosition;
    /**
     * Support converting ASTv1 nodes into a serialized format using JSON.stringify.
     */
    toJSON(): SourceLocation;
    /**
     * Create a new span with the current span's end and a new beginning.
     */
    withStart(other: SourceOffset): SourceSpan;
    /**
     * Create a new span with the current span's beginning and a new ending.
     */
    withEnd(other: SourceOffset): SourceSpan;
    asString(): string;
    /**
     * Convert this `SourceSpan` into a `SourceSlice`.
     */
    toSlice(expected?: string): SourceSlice;
    /**
     * For compatibility with SourceLocation in AST plugins
     *
     * @deprecated use startPosition instead
     */
    get start(): SourcePosition;
    /**
     * For compatibility with SourceLocation in AST plugins
     *
     * @deprecated use withStart instead
     */
    set start(position: SourcePosition);
    /**
     * For compatibility with SourceLocation in AST plugins
     *
     * @deprecated use endPosition instead
     */
    get end(): SourcePosition;
    /**
     * For compatibility with SourceLocation in AST plugins
     *
     * @deprecated use withEnd instead
     */
    set end(position: SourcePosition);
    /**
     * For compatibility with SourceLocation in AST plugins
     *
     * @deprecated use module instead
     */
    get source(): string;
    collapse(where: 'start' | 'end'): SourceSpan;
    extend(other: SourceSpan): SourceSpan;
    serialize(): SerializedSourceSpan;
    slice({ skipStart, skipEnd }: {
        skipStart?: number;
        skipEnd?: number;
    }): SourceSpan;
    sliceStartChars({ skipStart, chars }: {
        skipStart?: number;
        chars: number;
    }): SourceSpan;
    sliceEndChars({ skipEnd, chars }: {
        skipEnd?: number;
        chars: number;
    }): SourceSpan;
}
type AnySpan = HbsSpan | CharPositionSpan | InvisibleSpan;
declare class CharPositionSpan implements SpanData {
    #private;
    readonly source: Source;
    readonly charPositions: {
        start: CharPosition;
        end: CharPosition;
    };
    readonly kind: "CharPosition";
    constructor(source: Source, charPositions: {
        start: CharPosition;
        end: CharPosition;
    });
    wrap(): SourceSpan;
    asString(): string;
    getModule(): string;
    getStart(): AnyPosition;
    getEnd(): AnyPosition;
    locDidUpdate(): void;
    toHbsSpan(): HbsSpan | null;
    serialize(): SerializedSourceSpan;
    toCharPosSpan(): this;
}
declare class HbsSpan implements SpanData {
    #private;
    readonly source: Source;
    readonly hbsPositions: {
        start: HbsPosition;
        end: HbsPosition;
    };
    readonly kind: "HbsPosition";
    constructor(source: Source, hbsPositions: {
        start: HbsPosition;
        end: HbsPosition;
    }, providedHbsLoc?: SourceLocation | null);
    serialize(): SerializedConcreteSourceSpan;
    wrap(): SourceSpan;
    private updateProvided;
    locDidUpdate({ start, end }: {
        start?: SourcePosition;
        end?: SourcePosition;
    }): void;
    asString(): string;
    getModule(): string;
    getStart(): AnyPosition;
    getEnd(): AnyPosition;
    toHbsLoc(): SourceLocation;
    toHbsSpan(): this;
    toCharPosSpan(): CharPositionSpan | null;
}
declare class InvisibleSpan implements SpanData {
    readonly kind: InvisibleKind;
    readonly loc: SourceLocation;
    readonly string: string | null;
    constructor(kind: InvisibleKind, loc: SourceLocation, string?: string | null);
    serialize(): SerializedConcreteSourceSpan;
    wrap(): SourceSpan;
    asString(): string;
    locDidUpdate({ start, end }: {
        start?: SourcePosition;
        end?: SourcePosition;
    }): void;
    getModule(): string;
    getStart(): AnyPosition;
    getEnd(): AnyPosition;
    toCharPosSpan(): this;
    toHbsSpan(): null;
    toHbsLoc(): SourceLocation;
}
type SerializedConcreteSourceSpan = /** collapsed */ number | /** normal */ [start: number, size: number] | /** synthetic */ string;
type SerializedSourceSpan = SerializedConcreteSourceSpan;

interface SourceLocation {
    start: SourcePosition;
    end: SourcePosition;
}
interface SourcePosition {
    /** >= 1 */
    line: number;
    /** >= 0 */
    column: number;
}
declare const UNKNOWN_POSITION: Readonly<{
    readonly line: 1;
    readonly column: 0;
}>;
declare const SYNTHETIC_LOCATION: Readonly<{
    readonly source: "(synthetic)";
    readonly start: Readonly<{
        readonly line: 1;
        readonly column: 0;
    }>;
    readonly end: Readonly<{
        readonly line: 1;
        readonly column: 0;
    }>;
}>;
declare const NON_EXISTENT_LOCATION: Readonly<{
    readonly source: "(nonexistent)";
    readonly start: Readonly<{
        readonly line: 1;
        readonly column: 0;
    }>;
    readonly end: Readonly<{
        readonly line: 1;
        readonly column: 0;
    }>;
}>;

/**
 * All positions have these details in common. Most notably, all three kinds of positions can
 * must be able to attempt to convert themselves into {@see CharPosition}.
 */
interface PositionData {
    readonly kind: OffsetKind;
    toCharPos(): CharPosition | null;
    toJSON(): SourcePosition;
}
/**
 * Used to indicate that an attempt to convert a `SourcePosition` to a character offset failed. It
 * is separate from `null` so that `null` can be used to indicate that the computation wasn't yet
 * attempted (and therefore to cache the failure)
 */
declare const BROKEN = "BROKEN";
type BROKEN = 'BROKEN';
type AnyPosition = HbsPosition | CharPosition | InvisiblePosition;
/**
 * A `SourceOffset` represents a single position in the source.
 *
 * There are three kinds of backing data for `SourceOffset` objects:
 *
 * - `CharPosition`, which contains a character offset into the raw source string
 * - `HbsPosition`, which contains a `SourcePosition` from the Handlebars AST, which can be
 *   converted to a `CharPosition` on demand.
 * - `InvisiblePosition`, which represents a position not in source (@see {InvisiblePosition})
 */
declare class SourceOffset {
    readonly data: PositionData & AnyPosition;
    /**
     * Create a `SourceOffset` from a Handlebars `SourcePosition`. It's stored as-is, and converted
     * into a character offset on demand, which avoids unnecessarily computing the offset of every
     * `SourceLocation`, but also means that broken `SourcePosition`s are not always detected.
     */
    static forHbsPos(source: Source, pos: SourcePosition): SourceOffset;
    /**
     * Create a `SourceOffset` that corresponds to a broken `SourcePosition`. This means that the
     * calling code determined (or knows) that the `SourceLocation` doesn't correspond correctly to
     * any part of the source.
     */
    static broken(pos?: SourcePosition): SourceOffset;
    constructor(data: PositionData & AnyPosition);
    /**
     * Get the character offset for this `SourceOffset`, if possible.
     */
    get offset(): number | null;
    /**
     * Compare this offset with another one.
     *
     * If both offsets are `HbsPosition`s, they're equivalent as long as their lines and columns are
     * the same. This avoids computing offsets unnecessarily.
     *
     * Otherwise, two `SourceOffset`s are equivalent if their successfully computed character offsets
     * are the same.
     */
    eql(right: SourceOffset): boolean;
    /**
     * Create a span that starts from this source offset and ends with another source offset. Avoid
     * computing character offsets if both `SourceOffset`s are still lazy.
     */
    until(other: SourceOffset): SourceSpan;
    /**
     * Create a `SourceOffset` by moving the character position represented by this source offset
     * forward or backward (if `by` is negative), if possible.
     *
     * If this `SourceOffset` can't compute a valid character offset, `move` returns a broken offset.
     *
     * If the resulting character offset is less than 0 or greater than the size of the source, `move`
     * returns a broken offset.
     */
    move(by: number): SourceOffset;
    /**
     * Create a new `SourceSpan` that represents a collapsed range at this source offset. Avoid
     * computing the character offset if it has not already been computed.
     */
    collapsed(): SourceSpan;
    /**
     * Convert this `SourceOffset` into a Handlebars {@see SourcePosition} for compatibility with
     * existing plugins.
     */
    toJSON(): SourcePosition;
}
declare class CharPosition implements PositionData {
    readonly source: Source;
    readonly charPos: number;
    readonly kind: "CharPosition";
    /** Computed from char offset */
    _locPos: HbsPosition | BROKEN | null;
    constructor(source: Source, charPos: number);
    /**
     * This is already a `CharPosition`.
     *
     * {@see HbsPosition} for the alternative.
     */
    toCharPos(): this;
    /**
     * Produce a Handlebars {@see SourcePosition} for this `CharPosition`. If this `CharPosition` was
     * computed using {@see SourceOffset#move}, this will compute the `SourcePosition` for the offset.
     */
    toJSON(): SourcePosition;
    wrap(): SourceOffset;
    /**
     * A `CharPosition` always has an offset it can produce without any additional computation.
     */
    get offset(): number;
    /**
     * Convert the current character offset to an `HbsPosition`, if it was not already computed. Once
     * a `CharPosition` has computed its `HbsPosition`, it will not need to do compute it again, and
     * the same `CharPosition` is retained when used as one of the ends of a `SourceSpan`, so
     * computing the `HbsPosition` should be a one-time operation.
     */
    toHbsPos(): HbsPosition | null;
}
declare class HbsPosition implements PositionData {
    readonly source: Source;
    readonly hbsPos: SourcePosition;
    readonly kind: "HbsPosition";
    _charPos: CharPosition | BROKEN | null;
    constructor(source: Source, hbsPos: SourcePosition, charPos?: number | null);
    /**
     * Lazily compute the character offset from the {@see SourcePosition}. Once an `HbsPosition` has
     * computed its `CharPosition`, it will not need to do compute it again, and the same
     * `HbsPosition` is retained when used as one of the ends of a `SourceSpan`, so computing the
     * `CharPosition` should be a one-time operation.
     */
    toCharPos(): CharPosition | null;
    /**
     * Return the {@see SourcePosition} that this `HbsPosition` was instantiated with. This operation
     * does not need to compute anything.
     */
    toJSON(): SourcePosition;
    wrap(): SourceOffset;
    /**
     * This is already an `HbsPosition`.
     *
     * {@see CharPosition} for the alternative.
     */
    toHbsPos(): this;
}
declare class InvisiblePosition implements PositionData {
    readonly kind: BrokenKind | InternalSyntheticKind | NonExistentKind;
    readonly pos: SourcePosition;
    constructor(kind: BrokenKind | InternalSyntheticKind | NonExistentKind, pos: SourcePosition);
    /**
     * A broken position cannot be turned into a {@see CharacterPosition}.
     */
    toCharPos(): null;
    /**
     * The serialization of an `InvisiblePosition is whatever Handlebars {@see SourcePosition} was
     * originally identified as broken, non-existent or synthetic.
     *
     * If an `InvisiblePosition` never had an source offset at all, this method returns
     * {@see UNKNOWN_POSITION} for compatibility.
     */
    toJSON(): SourcePosition;
    wrap(): SourceOffset;
    get offset(): null;
}

declare class SpanList {
    static range(span: PresentArray<HasSourceSpan>): SourceSpan;
    static range(span: HasSourceSpan[], fallback: SourceSpan): SourceSpan;
    _span: SourceSpan[];
    constructor(span?: SourceSpan[]);
    add(offset: SourceSpan): void;
    getRangeOffset(fallback: SourceSpan): SourceSpan;
}
type HasSourceSpan = {
    loc: SourceSpan;
} | SourceSpan | [HasSourceSpan, ...HasSourceSpan[]];
declare function loc(span: HasSourceSpan): SourceSpan;
type MaybeHasSourceSpan = {
    loc: SourceSpan;
} | SourceSpan | MaybeHasSourceSpan[];
declare function hasSpan(span: MaybeHasSourceSpan): span is HasSourceSpan;
declare function maybeLoc(location: MaybeHasSourceSpan, fallback: SourceSpan): SourceSpan;

type api$2_HasSourceSpan = HasSourceSpan;
type api$2_MaybeHasSourceSpan = MaybeHasSourceSpan;
declare const api$2_NON_EXISTENT_LOCATION: typeof NON_EXISTENT_LOCATION;
declare const api$2_SYNTHETIC_LOCATION: typeof SYNTHETIC_LOCATION;
type api$2_SerializedSourceSpan = SerializedSourceSpan;
type api$2_Source = Source;
declare const api$2_Source: typeof Source;
type api$2_SourceLocation = SourceLocation;
type api$2_SourceOffset = SourceOffset;
declare const api$2_SourceOffset: typeof SourceOffset;
type api$2_SourcePosition = SourcePosition;
type api$2_SourceSlice<Chars extends string = string> = SourceSlice<Chars>;
declare const api$2_SourceSlice: typeof SourceSlice;
type api$2_SourceSpan = SourceSpan;
declare const api$2_SourceSpan: typeof SourceSpan;
type api$2_SpanList = SpanList;
declare const api$2_SpanList: typeof SpanList;
declare const api$2_UNKNOWN_POSITION: typeof UNKNOWN_POSITION;
declare const api$2_hasSpan: typeof hasSpan;
declare const api$2_loc: typeof loc;
declare const api$2_maybeLoc: typeof maybeLoc;
declare namespace api$2 {
  export { type api$2_HasSourceSpan as HasSourceSpan, type api$2_MaybeHasSourceSpan as MaybeHasSourceSpan, api$2_NON_EXISTENT_LOCATION as NON_EXISTENT_LOCATION, api$2_SYNTHETIC_LOCATION as SYNTHETIC_LOCATION, type api$2_SerializedSourceSpan as SerializedSourceSpan, api$2_Source as Source, type api$2_SourceLocation as SourceLocation, api$2_SourceOffset as SourceOffset, type api$2_SourcePosition as SourcePosition, api$2_SourceSlice as SourceSlice, api$2_SourceSpan as SourceSpan, api$2_SpanList as SpanList, api$2_UNKNOWN_POSITION as UNKNOWN_POSITION, api$2_hasSpan as hasSpan, api$2_loc as loc, api$2_maybeLoc as maybeLoc };
}

interface BaseNode {
    type: NodeType;
    loc: SourceSpan;
}
interface CommonProgram extends BaseNode {
    body: Statement[];
}
interface Block$1 extends CommonProgram {
    type: 'Block';
    params: VarHead[];
    chained?: boolean;
    /**
     * string accessor for params.name
     */
    blockParams: string[];
}
type EntityEncodingState = 'transformed' | 'raw';
interface Template$1 extends CommonProgram {
    type: 'Template';
    blockParams: string[];
}
/**
 * @deprecated use Template or Block instead
 */
type Program = Template$1 | Block$1;
type CallableExpression = SubExpression | PathExpression$1;
interface CallParts {
    path: CallableExpression;
    params: Expression[];
    hash: Hash;
    loc: SourceSpan;
}
type CallNode$1 = MustacheStatement | BlockStatement | ElementModifierStatement | SubExpression;
interface MustacheStatement extends BaseNode {
    type: 'MustacheStatement';
    path: Expression;
    params: Expression[];
    hash: Hash;
    trusting: boolean;
    strip: StripFlags;
    /**
     * @deprecated use trusting instead
     */
    escaped: boolean;
}
interface BlockStatement extends BaseNode {
    type: 'BlockStatement';
    path: CallableExpression;
    params: Expression[];
    hash: Hash;
    program: Block$1;
    inverse?: Nullable<Block$1>;
    openStrip: StripFlags;
    inverseStrip: StripFlags;
    closeStrip: StripFlags;
    chained?: boolean;
}
interface ElementModifierStatement extends BaseNode {
    type: 'ElementModifierStatement';
    path: CallableExpression;
    params: Expression[];
    hash: Hash;
}
interface CommentStatement extends BaseNode {
    type: 'CommentStatement';
    value: string;
}
interface MustacheCommentStatement extends BaseNode {
    type: 'MustacheCommentStatement';
    value: string;
}
interface ElementNode$1 extends BaseNode {
    type: 'ElementNode';
    path: PathExpression$1;
    selfClosing: boolean;
    attributes: AttrNode$1[];
    params: VarHead[];
    modifiers: ElementModifierStatement[];
    comments: MustacheCommentStatement[];
    children: Statement[];
    /**
     * span for the open tag
     */
    openTag: SourceSpan;
    /**
     * span for the close tag, null for void or self-closing tags
     */
    closeTag: Nullable<SourceSpan>;
    /**
     * string accessor for path.original
     */
    tag: string;
    /**
     * string accessor for params.name
     */
    blockParams: string[];
}
type StatementName = 'MustacheStatement' | 'CommentStatement' | 'BlockStatement' | 'MustacheCommentStatement' | 'TextNode' | 'ElementNode';
interface AttrNode$1 extends BaseNode {
    type: 'AttrNode';
    name: string;
    value: AttrValue;
}
type AttrValue = TextNode | MustacheStatement | ConcatStatement;
type AttrPart = TextNode | MustacheStatement;
interface TextNode extends BaseNode {
    type: 'TextNode';
    chars: string;
}
interface ConcatStatement extends BaseNode {
    type: 'ConcatStatement';
    parts: PresentArray<TextNode | MustacheStatement>;
}
type ExpressionName = 'SubExpression' | 'PathExpression' | LiteralName;
interface SubExpression extends BaseNode {
    type: 'SubExpression';
    path: CallableExpression;
    params: Expression[];
    hash: Hash;
}
interface ThisHead {
    type: 'ThisHead';
    original: 'this';
    loc: SourceSpan;
}
interface AtHead {
    type: 'AtHead';
    name: string;
    loc: SourceSpan;
    /**
     * alias for name
     */
    original: string;
}
interface VarHead {
    type: 'VarHead';
    name: string;
    loc: SourceSpan;
    /**
     * alias for name
     */
    original: string;
}
type PathHead = ThisHead | AtHead | VarHead;
interface MinimalPathExpression extends BaseNode {
    type: 'PathExpression';
    head: PathHead;
    tail: string[];
}
interface PathExpression$1 extends MinimalPathExpression {
    type: 'PathExpression';
    original: string;
    head: PathHead;
    tail: string[];
    /**
     * @deprecated use `head` and `tail` instead
     */
    parts: readonly string[];
    /**
     * @deprecated use `head.type` instead
     */
    readonly this: boolean;
    /**
     * @deprecated use `head.type' instead
     */
    readonly data: boolean;
}
type LiteralName = 'StringLiteral' | 'BooleanLiteral' | 'NumberLiteral' | 'UndefinedLiteral' | 'NullLiteral';
interface StringLiteral$1 extends BaseNode {
    type: 'StringLiteral';
    value: string;
    /**
     * @deprecated use value instead
     */
    original: string;
}
interface BooleanLiteral extends BaseNode {
    type: 'BooleanLiteral';
    value: boolean;
    /**
     * @deprecated use value instead
     */
    original: boolean;
}
interface NumberLiteral extends BaseNode {
    type: 'NumberLiteral';
    value: number;
    /**
     * @deprecated use value instead
     */
    original: number;
}
interface UndefinedLiteral extends BaseNode {
    type: 'UndefinedLiteral';
    value: undefined;
    /**
     * @deprecated use value instead
     */
    original: undefined;
}
interface NullLiteral extends BaseNode {
    type: 'NullLiteral';
    value: null;
    /**
     * @deprecated use value instead
     */
    original: null;
}
interface Hash extends BaseNode {
    type: 'Hash';
    pairs: HashPair[];
}
interface HashPair extends BaseNode {
    type: 'HashPair';
    key: string;
    value: Expression;
}
interface StripFlags {
    open: boolean;
    close: boolean;
}
type Nodes = {
    Template: Template$1;
    Block: Block$1;
    MustacheStatement: MustacheStatement;
    BlockStatement: BlockStatement;
    ElementModifierStatement: ElementModifierStatement;
    CommentStatement: CommentStatement;
    MustacheCommentStatement: MustacheCommentStatement;
    ElementNode: ElementNode$1;
    AttrNode: AttrNode$1;
    TextNode: TextNode;
    ConcatStatement: ConcatStatement;
    SubExpression: SubExpression;
    PathExpression: PathExpression$1;
    StringLiteral: StringLiteral$1;
    BooleanLiteral: BooleanLiteral;
    NumberLiteral: NumberLiteral;
    NullLiteral: NullLiteral;
    UndefinedLiteral: UndefinedLiteral;
    Hash: Hash;
    HashPair: HashPair;
};
type NodeType = keyof Nodes;
type Node = Nodes[NodeType];
type SubNodes = {
    ThisHead: ThisHead;
    AtHead: AtHead;
    VarHead: VarHead;
};
type SubNodeType = keyof SubNodes;
type SubNode = SubNodes[SubNodeType];
type Statement = Nodes[StatementName];
type Statements = Pick<Nodes, StatementName>;
type Literal = Nodes[LiteralName];
type Expression = Nodes[ExpressionName];
type Expressions = Pick<Nodes, ExpressionName>;
type TopLevelStatement = Statement | Nodes['Block'];
type ParentNode = Template$1 | Block$1 | ElementNode$1;

type api$1_AtHead = AtHead;
type api$1_AttrPart = AttrPart;
type api$1_AttrValue = AttrValue;
type api$1_BaseNode = BaseNode;
type api$1_BlockStatement = BlockStatement;
type api$1_BooleanLiteral = BooleanLiteral;
type api$1_CallParts = CallParts;
type api$1_CallableExpression = CallableExpression;
type api$1_CommentStatement = CommentStatement;
type api$1_CommonProgram = CommonProgram;
type api$1_ConcatStatement = ConcatStatement;
type api$1_ElementModifierStatement = ElementModifierStatement;
type api$1_EntityEncodingState = EntityEncodingState;
type api$1_Expression = Expression;
type api$1_ExpressionName = ExpressionName;
type api$1_Expressions = Expressions;
type api$1_Hash = Hash;
type api$1_HashPair = HashPair;
type api$1_Literal = Literal;
type api$1_LiteralName = LiteralName;
type api$1_MinimalPathExpression = MinimalPathExpression;
type api$1_MustacheCommentStatement = MustacheCommentStatement;
type api$1_MustacheStatement = MustacheStatement;
type api$1_Node = Node;
type api$1_NodeType = NodeType;
type api$1_Nodes = Nodes;
type api$1_NullLiteral = NullLiteral;
type api$1_NumberLiteral = NumberLiteral;
type api$1_ParentNode = ParentNode;
type api$1_PathHead = PathHead;
type api$1_Program = Program;
type api$1_SourceLocation = SourceLocation;
type api$1_SourcePosition = SourcePosition;
type api$1_Statement = Statement;
type api$1_StatementName = StatementName;
type api$1_Statements = Statements;
type api$1_StripFlags = StripFlags;
type api$1_SubExpression = SubExpression;
type api$1_SubNode = SubNode;
type api$1_SubNodeType = SubNodeType;
type api$1_SubNodes = SubNodes;
type api$1_TextNode = TextNode;
type api$1_ThisHead = ThisHead;
type api$1_TopLevelStatement = TopLevelStatement;
type api$1_UndefinedLiteral = UndefinedLiteral;
type api$1_VarHead = VarHead;
declare namespace api$1 {
  export type { api$1_AtHead as AtHead, AttrNode$1 as AttrNode, api$1_AttrPart as AttrPart, api$1_AttrValue as AttrValue, api$1_BaseNode as BaseNode, Block$1 as Block, api$1_BlockStatement as BlockStatement, api$1_BooleanLiteral as BooleanLiteral, CallNode$1 as CallNode, api$1_CallParts as CallParts, api$1_CallableExpression as CallableExpression, api$1_CommentStatement as CommentStatement, api$1_CommonProgram as CommonProgram, api$1_ConcatStatement as ConcatStatement, api$1_ElementModifierStatement as ElementModifierStatement, ElementNode$1 as ElementNode, api$1_EntityEncodingState as EntityEncodingState, api$1_Expression as Expression, api$1_ExpressionName as ExpressionName, api$1_Expressions as Expressions, api$1_Hash as Hash, api$1_HashPair as HashPair, api$1_Literal as Literal, api$1_LiteralName as LiteralName, api$1_MinimalPathExpression as MinimalPathExpression, api$1_MustacheCommentStatement as MustacheCommentStatement, api$1_MustacheStatement as MustacheStatement, api$1_Node as Node, api$1_NodeType as NodeType, api$1_Nodes as Nodes, api$1_NullLiteral as NullLiteral, api$1_NumberLiteral as NumberLiteral, api$1_ParentNode as ParentNode, PathExpression$1 as PathExpression, api$1_PathHead as PathHead, SourcePosition as Position, api$1_Program as Program, api$1_SourceLocation as SourceLocation, api$1_SourcePosition as SourcePosition, api$1_Statement as Statement, api$1_StatementName as StatementName, api$1_Statements as Statements, StringLiteral$1 as StringLiteral, api$1_StripFlags as StripFlags, api$1_SubExpression as SubExpression, api$1_SubNode as SubNode, api$1_SubNodeType as SubNodeType, api$1_SubNodes as SubNodes, Template$1 as Template, api$1_TextNode as TextNode, api$1_ThisHead as ThisHead, api$1_TopLevelStatement as TopLevelStatement, api$1_UndefinedLiteral as UndefinedLiteral, api$1_VarHead as VarHead };
}

declare function getVoidTags(): string[];
interface PrinterOptions {
    entityEncoding: EntityEncodingState;
    /**
     * Used to override the mechanism of printing a given AST.Node.
     *
     * This will generally only be useful to source -> source codemods
     * where you would like to specialize/override the way a given node is
     * printed (e.g. you would like to preserve as much of the original
     * formatting as possible).
     *
     * When the provided override returns undefined, the default built in printing
     * will be done for the AST.Node.
     *
     * @param ast the ast node to be printed
     * @param options the options specified during the print() invocation
     */
    override?(ast: Node, options: PrinterOptions): void | string;
}
/**
 * Examples when true:
 *  - link
 *  - liNK
 *
 * Examples when false:
 *  - Link (component)
 */
declare function isVoidTag(tag: string): boolean;

declare function build(ast: Node, options?: PrinterOptions): string;

declare function sortByLoc(a: Node, b: Node): -1 | 0 | 1;

interface GetTemplateLocalsOptions {
    includeKeywords?: boolean;
    includeHtmlElements?: boolean;
}
/**
 * Parses and traverses a given handlebars html template to extract all template locals
 * referenced that could possible come from the parent scope. Can exclude known keywords
 * optionally.
 */
declare function getTemplateLocals(html: string, options?: GetTemplateLocalsOptions): string[];

type Keywords = keyof typeof KEYWORDS_TYPES;
type KeywordType = 'Call' | 'Modifier' | 'Append' | 'Block';
declare function isKeyword(word: string): word is Keywords;
declare function isKeyword(word: string, type: KeywordType): boolean;
/**
 * This includes the full list of keywords currently in use in the template
 * language, and where their valid usages are.
 */
declare const KEYWORDS_TYPES: {
    action: ("Call" | "Modifier")[];
    component: ("Block" | "Call" | "Append")[];
    debugger: "Append"[];
    'each-in': "Block"[];
    each: "Block"[];
    'has-block-params': ("Call" | "Append")[];
    'has-block': ("Call" | "Append")[];
    helper: ("Call" | "Append")[];
    if: ("Block" | "Call" | "Append")[];
    'in-element': "Block"[];
    let: "Block"[];
    log: ("Call" | "Append")[];
    modifier: ("Call" | "Modifier")[];
    mount: "Append"[];
    mut: ("Call" | "Append")[];
    outlet: "Append"[];
    readonly: ("Call" | "Append")[];
    unbound: ("Call" | "Append")[];
    unless: ("Block" | "Call" | "Append")[];
    yield: "Append"[];
};

interface BaseNodeFields {
    loc: SourceSpan;
}
/**
 * This is a convenience function for creating ASTv2 nodes, with an optional name and the node's
 * options.
 *
 * ```ts
 * export class HtmlText extends node('HtmlText').fields<{ chars: string }>() {}
 * ```
 *
 * This creates a new ASTv2 node with the name `'HtmlText'` and one field `chars: string` (in
 * addition to a `loc: SourceOffsets` field, which all nodes have).
 *
 * ```ts
 * export class Args extends node().fields<{
 *  positional: PositionalArguments;
 *  named: NamedArguments
 * }>() {}
 * ```
 *
 * This creates a new un-named ASTv2 node with two fields (`positional: Positional` and `named:
 * Named`, in addition to the generic `loc: SourceOffsets` field).
 *
 * Once you create a node using `node`, it is instantiated with all of its fields (including `loc`):
 *
 * ```ts
 * new HtmlText({ loc: offsets, chars: someString });
 * ```
 */
declare function node(): {
    fields<Fields extends object>(): NodeConstructor<Fields & BaseNodeFields>;
};
declare function node<T extends string>(name: T): {
    fields<Fields extends object>(): TypedNodeConstructor<T, Fields & BaseNodeFields>;
};
interface NodeConstructor<Fields> {
    new (fields: Fields): Readonly<Fields>;
}
type TypedNode<T extends string, Fields> = {
    type: T;
} & Readonly<Fields>;
interface TypedNodeConstructor<T extends string, Fields> {
    new (options: Fields): TypedNode<T, Fields>;
}

/**
 * Attr nodes look like HTML attributes, but are classified as:
 *
 * 1. `HtmlAttr`, which means a regular HTML attribute in Glimmer
 * 2. `SplatAttr`, which means `...attributes`
 * 3. `ComponentArg`, which means an attribute whose name begins with `@`, and it is therefore a
 *    component argument.
 */
type AttrNode = HtmlAttr | SplatAttr | ComponentArg;
/**
 * `HtmlAttr` and `SplatAttr` are grouped together because the order of the `SplatAttr` node,
 * relative to other attributes, matters.
 */
type HtmlOrSplatAttr = HtmlAttr | SplatAttr;
/**
 * "Attr Block" nodes are allowed inside an open element tag in templates. They interact with the
 * element (or component).
 */
type AttrBlockNode = AttrNode | ElementModifier;
declare const HtmlAttr_base: TypedNodeConstructor<"HtmlAttr", AttrNodeOptions & BaseNodeFields>;
/**
 * `HtmlAttr` nodes are valid HTML attributes, with or without a value.
 *
 * Exceptions:
 *
 * - `...attributes` is `SplatAttr`
 * - `@x=<value>` is `ComponentArg`
 */
declare class HtmlAttr extends HtmlAttr_base {
}
declare const SplatAttr_base: TypedNodeConstructor<"SplatAttr", {
    symbol: number;
} & BaseNodeFields>;
declare class SplatAttr extends SplatAttr_base {
}
declare const ComponentArg_base: NodeConstructor<AttrNodeOptions & BaseNodeFields>;
/**
 * Corresponds to an argument passed by a component (`@x=<value>`)
 */
declare class ComponentArg extends ComponentArg_base {
    /**
     * Convert the component argument into a named argument node
     */
    toNamedArgument(): NamedArgument;
}
declare const ElementModifier_base: TypedNodeConstructor<"ElementModifier", CallFields & BaseNodeFields>;
/**
 * An `ElementModifier` is just a normal call node in modifier position.
 */
declare class ElementModifier extends ElementModifier_base {
}
interface AttrNodeOptions {
    name: SourceSlice;
    value: ExpressionNode;
    trusting: boolean;
}

declare const Template_base: NodeConstructor<{
    table: ProgramSymbolTable;
} & GlimmerParentNodeOptions & BaseNodeFields>;
/**
 * Corresponds to an entire template.
 */
declare class Template extends Template_base {
}
declare const Block_base: NodeConstructor<{
    scope: BlockSymbolTable;
} & GlimmerParentNodeOptions & BaseNodeFields>;
/**
 * Represents a block. In principle this could be merged with `NamedBlock`, because all cases
 * involving blocks have at least a notional name.
 */
declare class Block extends Block_base {
}
declare const NamedBlocks_base: NodeConstructor<{
    blocks: readonly NamedBlock[];
} & BaseNodeFields>;
/**
 * Corresponds to a collection of named blocks.
 */
declare class NamedBlocks extends NamedBlocks_base {
    /**
     * Get the `NamedBlock` for a given name.
     */
    get(name: 'default'): NamedBlock;
    get(name: string): NamedBlock | null;
}
interface NamedBlockFields extends BaseNodeFields {
    name: SourceSlice;
    block: Block;
    attrs: readonly HtmlOrSplatAttr[];
    componentArgs: readonly ComponentArg[];
    modifiers: readonly ElementModifier[];
}
declare const NamedBlock_base: NodeConstructor<NamedBlockFields & BaseNodeFields>;
/**
 * Corresponds to a single named block. This is used for anonymous named blocks (`default` and
 * `else`).
 */
declare class NamedBlock extends NamedBlock_base {
    get args(): Args;
}

/**
 * Content Nodes are allowed in content positions in templates. They correspond to behavior in the
 * [Data][data] tokenization state in HTML.
 *
 * [data]: https://html.spec.whatwg.org/multipage/parsing.html#data-state
 */
type ContentNode = HtmlText | HtmlComment | AppendContent | InvokeBlock | InvokeComponent | SimpleElement | GlimmerComment;
declare const GlimmerComment_base: TypedNodeConstructor<"GlimmerComment", {
    text: SourceSlice;
} & BaseNodeFields>;
declare class GlimmerComment extends GlimmerComment_base {
}
declare const HtmlText_base: TypedNodeConstructor<"HtmlText", {
    chars: string;
} & BaseNodeFields>;
declare class HtmlText extends HtmlText_base {
}
declare const HtmlComment_base: TypedNodeConstructor<"HtmlComment", {
    text: SourceSlice;
} & BaseNodeFields>;
declare class HtmlComment extends HtmlComment_base {
}
declare const AppendContent_base: TypedNodeConstructor<"AppendContent", {
    value: ExpressionNode;
    trusting: boolean;
    table: SymbolTable;
} & BaseNodeFields>;
declare class AppendContent extends AppendContent_base {
    get callee(): ExpressionNode;
    get args(): Args;
}
declare const InvokeBlock_base: TypedNodeConstructor<"InvokeBlock", CallFields & {
    blocks: NamedBlocks;
} & BaseNodeFields>;
declare class InvokeBlock extends InvokeBlock_base {
}
interface InvokeComponentFields {
    callee: ExpressionNode;
    blocks: NamedBlocks;
    attrs: readonly HtmlOrSplatAttr[];
    componentArgs: readonly ComponentArg[];
    modifiers: readonly ElementModifier[];
}
declare const InvokeComponent_base: TypedNodeConstructor<"InvokeComponent", InvokeComponentFields & BaseNodeFields>;
/**
 * Corresponds to a component invocation. When the content of a component invocation contains no
 * named blocks, `blocks` contains a single named block named `"default"`. When a component
 * invocation is self-closing, `blocks` is empty.
 */
declare class InvokeComponent extends InvokeComponent_base {
    get args(): Args;
}
interface SimpleElementOptions extends BaseNodeFields {
    tag: SourceSlice;
    body: readonly ContentNode[];
    attrs: readonly HtmlOrSplatAttr[];
    componentArgs: readonly ComponentArg[];
    modifiers: readonly ElementModifier[];
}
declare const SimpleElement_base: TypedNodeConstructor<"SimpleElement", SimpleElementOptions & BaseNodeFields>;
/**
 * Corresponds to a simple HTML element. The AST allows component arguments and modifiers to support
 * future extensions.
 */
declare class SimpleElement extends SimpleElement_base {
    get args(): Args;
}
type ElementNode = NamedBlock | InvokeComponent | SimpleElement;

interface SerializedBaseNode {
    loc: SerializedSourceSpan;
}
interface GlimmerParentNodeOptions extends BaseNodeFields {
    body: readonly ContentNode[];
}
interface CallFields extends BaseNodeFields {
    callee: CalleeNode;
    args: Args;
}
type CalleeNode = KeywordExpression | PathExpression | CallExpression;
type CallNode = CallExpression | InvokeBlock | AppendContent | InvokeComponent | ElementModifier;

type HELPER_VAR_NS = 'Helper';
declare const HELPER_VAR_NS: HELPER_VAR_NS;
type MODIFIER_VAR_NS = 'Modifier';
declare const MODIFIER_VAR_NS: MODIFIER_VAR_NS;
type COMPONENT_VAR_NS = 'Component';
declare const COMPONENT_VAR_NS: COMPONENT_VAR_NS;
type FreeVarNamespace = HELPER_VAR_NS | MODIFIER_VAR_NS | COMPONENT_VAR_NS;

/**
 * A free variable is resolved according to a resolution rule:
 *
 * 1. Strict resolution
 * 2. Namespaced resolution
 */

/**
 * Strict resolution is used:
 *
 * 1. in a strict mode template
 * 2. in an local variable invocation with dot paths
 */
declare const STRICT_RESOLUTION: {
    resolution: () => GetContextualFreeOpcode;
    serialize: () => SerializedResolution;
    isAngleBracket: false;
};
type StrictResolution = typeof STRICT_RESOLUTION;
declare const HTML_RESOLUTION: {
    isAngleBracket: true;
    resolution: () => GetContextualFreeOpcode;
    serialize: () => SerializedResolution;
};
type HtmlResolution = typeof HTML_RESOLUTION;
declare function isStrictResolution(value: unknown): value is StrictResolution;
/**
 * A `LooseModeResolution` includes one or more namespaces to resolve the variable in
 *
 * In practice, there are a limited number of possible combinations of these degrees of freedom,
 * and they are captured by the `Namespaces` union below.
 */
declare class LooseModeResolution {
    readonly namespaces: Namespaces;
    readonly isAngleBracket: boolean;
    /**
     * Namespaced resolution is used in an unambiguous syntax position:
     *
     * 1. `(sexp)` (namespace: `Helper`)
     * 2. `{{#block}}` (namespace: `Component`)
     * 3. `<a {{modifier}}>` (namespace: `Modifier`)
     * 4. `<Component />` (namespace: `Component`)
     */
    static namespaced(namespace: FreeVarNamespace, isAngleBracket?: boolean): LooseModeResolution;
    /**
     * Append resolution is used when the variable should be resolved in both the `component` and
     * `helper` namespaces.
     *
     * ```hbs
     * {{x}}
     * ```
     *
     * ```hbs
     * {{x y}}
     * ```
     *
     * ^ In either case, `x` should be resolved in the `component` and `helper` namespaces.
     */
    static append(): LooseModeResolution;
    /**
     * Trusting append resolution is used when the variable should be resolved only in the
     * `helper` namespaces.
     *
     * ```hbs
     * {{{x}}}
     * ```
     *
     * ```hbs
     * {{{x y}}}
     * ```
     *
     * ^ In either case, `x` should be resolved in the `helper` namespace.
     */
    static trustingAppend(): LooseModeResolution;
    constructor(namespaces: Namespaces, isAngleBracket?: boolean);
    resolution(): GetContextualFreeOpcode;
    serialize(): SerializedResolution;
}
declare const HELPER_NAMESPACE: "Helper";
declare const MODIFIER_NAMESPACE: "Modifier";
declare const COMPONENT_NAMESPACE: "Component";
/**
 * A `Namespaced` must be resolved in one or more namespaces.
 *
 * ```hbs
 * <X />
 * ```
 *
 * ^ `X` is resolved in the `component` namespace
 *
 * ```hbs
 * (x)
 * ```
 *
 * ^ `x` is resolved in the `helper` namespace
 *
 * ```hbs
 * <a {{x}} />
 * ```
 *
 * ^ `x` is resolved in the `modifier` namespace
 */
type Namespaces = [HELPER_VAR_NS] | [MODIFIER_VAR_NS] | [COMPONENT_VAR_NS] | [COMPONENT_VAR_NS, HELPER_VAR_NS];
type FreeVarResolution = StrictResolution | HtmlResolution | LooseModeResolution;
type SerializedResolution = 'Strict' | 'Helper' | 'Modifier' | 'Component' | 'ComponentOrHelper';
declare function loadResolution(resolution: SerializedResolution): FreeVarResolution;

declare const ThisReference_base: TypedNodeConstructor<"This", object & BaseNodeFields>;
/**
 * Corresponds to `this` at the head of an expression.
 */
declare class ThisReference extends ThisReference_base {
}
declare const ArgReference_base: TypedNodeConstructor<"Arg", {
    name: SourceSlice;
    symbol: number;
} & BaseNodeFields>;
/**
 * Corresponds to `@<ident>` at the beginning of an expression.
 */
declare class ArgReference extends ArgReference_base {
}
declare const LocalVarReference_base: TypedNodeConstructor<"Local", {
    name: string;
    isTemplateLocal: boolean;
    symbol: number;
} & BaseNodeFields>;
/**
 * Corresponds to `<ident>` at the beginning of an expression, when `<ident>` is in the current
 * block's scope.
 */
declare class LocalVarReference extends LocalVarReference_base {
}
declare const FreeVarReference_base: TypedNodeConstructor<"Free", {
    name: string;
    resolution: FreeVarResolution;
    symbol: number;
} & BaseNodeFields>;
/**
 * Corresponds to `<ident>` at the beginning of an expression, when `<ident>` is *not* in the
 * current block's scope.
 *
 * The `resolution: FreeVarResolution` field describes how to resolve the free variable.
 *
 * Note: In strict mode, it must always be a variable that is in a concrete JavaScript scope that
 * the template will be installed into.
 */
declare class FreeVarReference extends FreeVarReference_base {
}
type VariableReference = ThisReference | ArgReference | LocalVarReference | FreeVarReference;

/**
 * A Handlebars literal.
 *
 * {@link https://handlebarsjs.com/guide/expressions.html#literal-segments}
 */
type LiteralValue = string | boolean | number | undefined | null;
interface LiteralTypes {
    string: string;
    boolean: boolean;
    number: number;
    null: null;
    undefined: undefined;
}
declare const LiteralExpression_base: TypedNodeConstructor<"Literal", {
    value: LiteralValue;
} & BaseNodeFields>;
/**
 * Corresponds to a Handlebars literal.
 *
 * @see {LiteralValue}
 */
declare class LiteralExpression extends LiteralExpression_base {
    toSlice(this: StringLiteral): SourceSlice;
}
type StringLiteral = LiteralExpression & {
    value: string;
};
/**
 * Returns true if an input {@see ExpressionNode} is a literal.
 */
declare function isLiteral<K extends keyof LiteralTypes = keyof LiteralTypes>(node: ExpressionNode, kind?: K): node is StringLiteral;
declare const PathExpression_base: TypedNodeConstructor<"Path", {
    ref: VariableReference;
    tail: readonly SourceSlice[];
} & BaseNodeFields>;
/**
 * Corresponds to a path in expression position.
 *
 * ```hbs
 * this
 * this.x
 * @x
 * @x.y
 * x
 * x.y
 * ```
 */
declare class PathExpression extends PathExpression_base {
}
declare const KeywordExpression_base: TypedNodeConstructor<"Keyword", {
    name: string;
    symbol: number;
} & BaseNodeFields>;
/**
 * Corresponds to a known strict-mode keyword. It behaves similarly to a
 * PathExpression with a FreeVarReference, but implies StrictResolution and
 * is guaranteed to not have a tail, since `{{outlet.foo}}` would have been
 * illegal.
 */
declare class KeywordExpression extends KeywordExpression_base {
}
declare const CallExpression_base: TypedNodeConstructor<"Call", CallFields & BaseNodeFields>;
/**
 * Corresponds to a parenthesized call expression.
 *
 * ```hbs
 * (x)
 * (x.y)
 * (x y)
 * (x.y z)
 * ```
 */
declare class CallExpression extends CallExpression_base {
}
declare const InterpolateExpression_base: TypedNodeConstructor<"Interpolate", {
    parts: PresentArray<ExpressionNode>;
} & BaseNodeFields>;
/**
 * Corresponds to an interpolation in attribute value position.
 *
 * ```hbs
 * <a href="{{url}}.html"
 * ```
 */
declare class InterpolateExpression extends InterpolateExpression_base {
}
type ExpressionNode = LiteralExpression | PathExpression | KeywordExpression | CallExpression | InterpolateExpression;

declare const Args_base: NodeConstructor<{
    positional: PositionalArguments;
    named: NamedArguments;
} & BaseNodeFields>;
/**
 * Corresponds to syntaxes with positional and named arguments:
 *
 * - SubExpression
 * - Invoking Append
 * - Invoking attributes
 * - InvokeBlock
 *
 * If `Args` is empty, the `SourceOffsets` for this node should be the collapsed position
 * immediately after the parent call node's `callee`.
 */
declare class Args extends Args_base {
    static empty(loc: SourceSpan): Args;
    static named(named: NamedArguments): Args;
    nth(offset: number): ExpressionNode | null;
    get(name: string): ExpressionNode | null;
    isEmpty(): boolean;
}
declare const PositionalArguments_base: NodeConstructor<{
    exprs: readonly ExpressionNode[];
} & BaseNodeFields>;
/**
 * Corresponds to positional arguments.
 *
 * If `PositionalArguments` is empty, the `SourceOffsets` for this node should be the collapsed
 * position immediately after the parent call node's `callee`.
 */
declare class PositionalArguments extends PositionalArguments_base {
    static empty(loc: SourceSpan): PositionalArguments;
    get size(): number;
    nth(offset: number): ExpressionNode | null;
    isEmpty(): boolean;
}
declare const NamedArguments_base: NodeConstructor<{
    entries: readonly NamedArgument[];
} & BaseNodeFields>;
/**
 * Corresponds to named arguments.
 *
 * If `PositionalArguments` and `NamedArguments` are empty, the `SourceOffsets` for this node should
 * be the same as the `Args` node that contains this node.
 *
 * If `PositionalArguments` is not empty but `NamedArguments` is empty, the `SourceOffsets` for this
 * node should be the collapsed position immediately after the last positional argument.
 */
declare class NamedArguments extends NamedArguments_base {
    static empty(loc: SourceSpan): NamedArguments;
    get size(): number;
    get(name: string): ExpressionNode | null;
    isEmpty(): boolean;
}
/**
 * Corresponds to a single named argument.
 *
 * ```hbs
 * x=<expr>
 * ```
 */
declare class NamedArgument {
    readonly loc: SourceSpan;
    readonly name: SourceSlice;
    readonly value: ExpressionNode;
    constructor(options: {
        name: SourceSlice;
        value: ExpressionNode;
    });
}

type api_AppendContent = AppendContent;
declare const api_AppendContent: typeof AppendContent;
type api_ArgReference = ArgReference;
declare const api_ArgReference: typeof ArgReference;
type api_Args = Args;
declare const api_Args: typeof Args;
type api_AttrBlockNode = AttrBlockNode;
type api_AttrNode = AttrNode;
type api_AttrNodeOptions = AttrNodeOptions;
type api_BaseNodeFields = BaseNodeFields;
type api_Block = Block;
declare const api_Block: typeof Block;
declare const api_COMPONENT_NAMESPACE: typeof COMPONENT_NAMESPACE;
type api_CallExpression = CallExpression;
declare const api_CallExpression: typeof CallExpression;
type api_CallFields = CallFields;
type api_CallNode = CallNode;
type api_CalleeNode = CalleeNode;
type api_ComponentArg = ComponentArg;
declare const api_ComponentArg: typeof ComponentArg;
type api_ContentNode = ContentNode;
type api_ElementModifier = ElementModifier;
declare const api_ElementModifier: typeof ElementModifier;
type api_ElementNode = ElementNode;
type api_ExpressionNode = ExpressionNode;
type api_FreeVarReference = FreeVarReference;
declare const api_FreeVarReference: typeof FreeVarReference;
type api_FreeVarResolution = FreeVarResolution;
type api_GlimmerComment = GlimmerComment;
declare const api_GlimmerComment: typeof GlimmerComment;
type api_GlimmerParentNodeOptions = GlimmerParentNodeOptions;
declare const api_HELPER_NAMESPACE: typeof HELPER_NAMESPACE;
declare const api_HTML_RESOLUTION: typeof HTML_RESOLUTION;
type api_HtmlAttr = HtmlAttr;
declare const api_HtmlAttr: typeof HtmlAttr;
type api_HtmlComment = HtmlComment;
declare const api_HtmlComment: typeof HtmlComment;
type api_HtmlOrSplatAttr = HtmlOrSplatAttr;
type api_HtmlResolution = HtmlResolution;
type api_HtmlText = HtmlText;
declare const api_HtmlText: typeof HtmlText;
type api_InterpolateExpression = InterpolateExpression;
declare const api_InterpolateExpression: typeof InterpolateExpression;
type api_InvokeBlock = InvokeBlock;
declare const api_InvokeBlock: typeof InvokeBlock;
type api_InvokeComponent = InvokeComponent;
declare const api_InvokeComponent: typeof InvokeComponent;
type api_KeywordExpression = KeywordExpression;
declare const api_KeywordExpression: typeof KeywordExpression;
type api_LiteralExpression = LiteralExpression;
declare const api_LiteralExpression: typeof LiteralExpression;
type api_LiteralTypes = LiteralTypes;
type api_LiteralValue = LiteralValue;
type api_LocalVarReference = LocalVarReference;
declare const api_LocalVarReference: typeof LocalVarReference;
type api_LooseModeResolution = LooseModeResolution;
declare const api_LooseModeResolution: typeof LooseModeResolution;
declare const api_MODIFIER_NAMESPACE: typeof MODIFIER_NAMESPACE;
type api_NamedArgument = NamedArgument;
declare const api_NamedArgument: typeof NamedArgument;
type api_NamedArguments = NamedArguments;
declare const api_NamedArguments: typeof NamedArguments;
type api_NamedBlock = NamedBlock;
declare const api_NamedBlock: typeof NamedBlock;
type api_NamedBlockFields = NamedBlockFields;
type api_NamedBlocks = NamedBlocks;
declare const api_NamedBlocks: typeof NamedBlocks;
type api_NodeConstructor<Fields> = NodeConstructor<Fields>;
type api_PathExpression = PathExpression;
declare const api_PathExpression: typeof PathExpression;
type api_PositionalArguments = PositionalArguments;
declare const api_PositionalArguments: typeof PositionalArguments;
declare const api_STRICT_RESOLUTION: typeof STRICT_RESOLUTION;
type api_SerializedBaseNode = SerializedBaseNode;
type api_SerializedResolution = SerializedResolution;
type api_SimpleElement = SimpleElement;
declare const api_SimpleElement: typeof SimpleElement;
type api_SplatAttr = SplatAttr;
declare const api_SplatAttr: typeof SplatAttr;
type api_StrictResolution = StrictResolution;
type api_StringLiteral = StringLiteral;
type api_Template = Template;
declare const api_Template: typeof Template;
type api_ThisReference = ThisReference;
declare const api_ThisReference: typeof ThisReference;
type api_TypedNodeConstructor<T extends string, Fields> = TypedNodeConstructor<T, Fields>;
type api_VariableReference = VariableReference;
declare const api_isLiteral: typeof isLiteral;
declare const api_isStrictResolution: typeof isStrictResolution;
declare const api_loadResolution: typeof loadResolution;
declare const api_node: typeof node;
declare namespace api {
  export { api_AppendContent as AppendContent, api_ArgReference as ArgReference, api_Args as Args, type api_AttrBlockNode as AttrBlockNode, type api_AttrNode as AttrNode, type api_AttrNodeOptions as AttrNodeOptions, type api_BaseNodeFields as BaseNodeFields, api_Block as Block, api_COMPONENT_NAMESPACE as COMPONENT_NAMESPACE, api_CallExpression as CallExpression, type api_CallFields as CallFields, type api_CallNode as CallNode, type api_CalleeNode as CalleeNode, api_ComponentArg as ComponentArg, type api_ContentNode as ContentNode, api_ElementModifier as ElementModifier, type api_ElementNode as ElementNode, type api_ExpressionNode as ExpressionNode, api_FreeVarReference as FreeVarReference, type api_FreeVarResolution as FreeVarResolution, api_GlimmerComment as GlimmerComment, type api_GlimmerParentNodeOptions as GlimmerParentNodeOptions, api_HELPER_NAMESPACE as HELPER_NAMESPACE, api_HTML_RESOLUTION as HTML_RESOLUTION, api_HtmlAttr as HtmlAttr, api_HtmlComment as HtmlComment, type api_HtmlOrSplatAttr as HtmlOrSplatAttr, type api_HtmlResolution as HtmlResolution, api_HtmlText as HtmlText, api_InterpolateExpression as InterpolateExpression, api_InvokeBlock as InvokeBlock, api_InvokeComponent as InvokeComponent, api_KeywordExpression as KeywordExpression, api_LiteralExpression as LiteralExpression, type api_LiteralTypes as LiteralTypes, type api_LiteralValue as LiteralValue, api_LocalVarReference as LocalVarReference, api_LooseModeResolution as LooseModeResolution, api_MODIFIER_NAMESPACE as MODIFIER_NAMESPACE, api_NamedArgument as NamedArgument, api_NamedArguments as NamedArguments, api_NamedBlock as NamedBlock, type api_NamedBlockFields as NamedBlockFields, api_NamedBlocks as NamedBlocks, type api_NodeConstructor as NodeConstructor, api_PathExpression as PathExpression, api_PositionalArguments as PositionalArguments, api_STRICT_RESOLUTION as STRICT_RESOLUTION, type api_SerializedBaseNode as SerializedBaseNode, type api_SerializedResolution as SerializedResolution, api_SimpleElement as SimpleElement, api_SplatAttr as SplatAttr, type api_StrictResolution as StrictResolution, type api_StringLiteral as StringLiteral, api_Template as Template, api_ThisReference as ThisReference, type api_TypedNodeConstructor as TypedNodeConstructor, type api_VariableReference as VariableReference, api_isLiteral as isLiteral, api_isStrictResolution as isStrictResolution, api_loadResolution as loadResolution, api_node as node };
}

interface SymbolTableOptions {
    customizeComponentName: (input: string) => string;
    lexicalScope: (variable: string) => boolean;
}
declare abstract class SymbolTable {
    static top(locals: readonly string[], keywords: readonly string[], options: SymbolTableOptions): ProgramSymbolTable;
    abstract root(): ProgramSymbolTable;
    abstract has(name: string): boolean;
    abstract get(name: string): [symbol: number, isRoot: boolean];
    abstract hasKeyword(name: string): boolean;
    abstract getKeyword(name: string): number;
    abstract hasLexical(name: string): boolean;
    abstract getLocalsMap(): Dict<number>;
    abstract getDebugInfo(): Core.DebugSymbols;
    abstract allocateFree(name: string, resolution: FreeVarResolution): number;
    abstract allocateNamed(name: string): number;
    abstract allocateBlock(name: string): number;
    abstract allocate(identifier: string): number;
    child(locals: string[]): BlockSymbolTable;
}
declare class ProgramSymbolTable extends SymbolTable {
    private templateLocals;
    private keywords;
    private options;
    constructor(templateLocals: readonly string[], keywords: readonly string[], options: SymbolTableOptions);
    readonly symbols: string[];
    readonly upvars: string[];
    private size;
    readonly named: Dict<number>;
    readonly blocks: Dict<number>;
    readonly usedTemplateLocals: string[];
    root(): this;
    hasLexical(name: string): boolean;
    hasKeyword(name: string): boolean;
    getKeyword(name: string): number;
    getUsedTemplateLocals(): string[];
    has(name: string): boolean;
    get(name: string): [number, boolean];
    getLocalsMap(): Dict<number>;
    getDebugInfo(): Core.DebugSymbols;
    allocateFree(name: string, resolution: FreeVarResolution): number;
    allocateNamed(name: string): number;
    allocateBlock(name: string): number;
    allocate(identifier: string): number;
}
declare class BlockSymbolTable extends SymbolTable {
    #private;
    private parent;
    symbols: string[];
    slots: number[];
    constructor(parent: SymbolTable, symbols: string[], slots: number[]);
    root(): ProgramSymbolTable;
    get locals(): string[];
    hasLexical(name: string): boolean;
    getKeyword(name: string): number;
    hasKeyword(name: string): boolean;
    has(name: string): boolean;
    get(name: string): [number, boolean];
    getLocalsMap(): Dict<number>;
    getDebugInfo(): [locals: Record<string, number>, upvars: Record<string, number>];
    allocateFree(name: string, resolution: FreeVarResolution): number;
    allocateNamed(name: string): number;
    allocateBlock(name: string): number;
    allocate(identifier: string): number;
}

interface GlimmerSyntaxError extends Error {
    location: SourceSpan | null;
    code: string | null;
}
declare function generateSyntaxError(message: string, location: SourceSpan): GlimmerSyntaxError;

interface TraversalErrorConstructor {
    new (message: string, node: Node, parent: Nullable<Node>, key: string): TraversalError;
    readonly prototype: TraversalError;
}
interface TraversalError extends Error {
    constructor: TraversalErrorConstructor;
    key: string;
    node: Node;
    parent: Nullable<Node>;
    stack?: string;
}
declare const TraversalError: TraversalErrorConstructor;

declare function cannotRemoveNode(node: Node, parent: Node, key: string): TraversalError;
declare function cannotReplaceNode(node: Node, parent: Node, key: string): TraversalError;

declare function normalize(source: Source, options?: PrecompileOptionsWithLexicalScope): [ast: Template, locals: string[]];

export { api$1 as AST, type ASTPlugin, type ASTPluginBuilder, type ASTPluginEnvironment, api$1 as ASTv1, api as ASTv2, BlockSymbolTable, type GlimmerSyntaxError, type HasSourceSpan, KEYWORDS_TYPES, type KeywordType, type MaybeHasSourceSpan, type NodeVisitor, Walker as Path, type PrecompileOptions, type PrecompileOptionsWithLexicalScope, type PreprocessOptions, ProgramSymbolTable, SourceSlice, SpanList, SymbolTable, type Syntax, type TemplateIdFn, Walker, WalkerPath, _default as builders, cannotRemoveNode, cannotReplaceNode, generateSyntaxError, getTemplateLocals, getVoidTags, hasSpan, isKeyword, isVoidTag, loc, maybeLoc, node, normalize, preprocess, build as print, sortByLoc, api$2 as src, traverse, visitorKeys };
