import { assert } from '../util.js';
/**
 * A `ScopeStack` is used while traversing a template
 * to track what identifiers are currently in scope.
 */
export default class ScopeStack {
    constructor(identifiers) {
        this.stack = [new Set(identifiers)];
    }
    push(identifiers) {
        let scope = new Set(this.top);
        for (let identifier of identifiers) {
            scope.add(identifier);
        }
        this.stack.unshift(scope);
    }
    pop() {
        assert(this.stack.length > 1);
        this.stack.shift();
    }
    hasBinding(identifier) {
        return this.top.has(identifier);
    }
    get top() {
        return this.stack[0];
    }
}
//# sourceMappingURL=scope-stack.js.map