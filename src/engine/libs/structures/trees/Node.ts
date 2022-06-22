export { Node };
export { NodeBase };

interface Node {
    parent: Node | null;
    readonly children: Node[];
    removeChild(child: Node): void;
    root(): Node | null;
}

abstract class NodeBase implements Node {
    protected _parent: Node | null;
    protected _children: Node[];

    constructor()
    constructor(parent: Node)
    constructor(parent?: Node) {
        this._parent = parent || null;
        this._children = [];
    }

    public root(): Node | null {
        if (this._parent !== null) {
            return this._parent.parent;
        }
        return this;
    }

    public set parent(parent: Node | null) {
        if (this._parent != null) {
            this._parent.removeChild(this);
        }
        if (parent != null) {
            this._parent = parent;
            this._parent.children.push(this);
        }
    }

    public get parent(): Node | null {
        return this._parent;
    }

    public get children(): Node[] {
        return this._children;
    }

    public removeChild(child: Node): void {
        const childIdx = this._children.indexOf(child);
        if (childIdx > -1) {
            const last = this._children.pop();
            if (last !== undefined) {
                this._children[childIdx] = last;
            }
        }
    }
}