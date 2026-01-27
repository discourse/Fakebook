/**
 * @typedef {import('typescript').IScriptSnapshot} IScriptSnapshot
 */
/**
 * A TypeScript compatible script snapshot that wraps a string of text.
 *
 * @implements {IScriptSnapshot}
 */
export class ScriptSnapshot {
    constructor(text) {
        this.text = text;
    }
    // Not Implemented
    getChangeRange(_oldSnapshot) {
        return undefined;
    }
    getLength() {
        return this.text.length;
    }
    getText(start, end) {
        return this.text.slice(start, end);
    }
}
//# sourceMappingURL=script-snapshot.js.map