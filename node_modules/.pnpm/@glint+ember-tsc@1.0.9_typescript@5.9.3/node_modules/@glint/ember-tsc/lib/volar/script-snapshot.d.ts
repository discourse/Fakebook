/**
 * @typedef {import('typescript').IScriptSnapshot} IScriptSnapshot
 */
import { IScriptSnapshot, TextChangeRange } from 'typescript';
/**
 * A TypeScript compatible script snapshot that wraps a string of text.
 *
 * @implements {IScriptSnapshot}
 */
export declare class ScriptSnapshot implements IScriptSnapshot {
    text: string;
    constructor(text: string);
    getChangeRange(_oldSnapshot: IScriptSnapshot): TextChangeRange | undefined;
    getLength(): number;
    getText(start: number, end: number): string;
}
//# sourceMappingURL=script-snapshot.d.ts.map