/**
 * Given an AST node for an embedded template, determines whether it's embedded
 * within a class in such a way that that class should be treated as its backing
 * value.
 */
export function isEmbeddedInClass(ts, node) {
    let current = node;
    do {
        // TODO: this should likely actually filter on whether the template appears in a
        // static block or property definition, but just "am I in a class body" is the
        // current status quo and has been ok so far.
        if (ts.isHeritageClause(current)) {
            return false;
        }
        if (ts.isClassLike(current)) {
            return true;
        }
    } while ((current = current.parent));
    return false;
}
//# sourceMappingURL=index.js.map