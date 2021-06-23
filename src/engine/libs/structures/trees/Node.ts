export { Node };
export { NodeBase };

interface Node<N extends Node<any>> {
    parent: N | null;
    readonly children: N[];
    traverse(func: (node: N, parent: N | null) => any): void;
}

abstract class NodeBase<N extends NodeBase<any>> implements Node<N> {
    protected _parent: N | null;
    protected _children: N[];

    constructor()
    constructor(parent: N)
    constructor(parent?: N) {
        this._parent = null;
        this._children = [];
    }

    public set parent(parent: N | null) {
        if (this._parent != null) {
            this._parent._removeChild(this);
        }
        if (parent != null) {
            this._parent = parent;
            this._parent.children.push(this);
        }
    }

    public get parent(): N | null {
        return this._parent;
    }

    public get children(): N[] {
        return this._children;
    }

    protected _removeChild(child: N) {
        const childIdx = this._children.indexOf(child);
        if (childIdx > -1) {
            const last = this._children.pop();
            if (last !== undefined) {
                this._children[childIdx] = last;
            }
        }
    }
    
    public traverse(func: (node: N, parent: N | null) => any) {
        func(this as unknown as N, this.parent);
        for (const child of this._children) {
            child.traverse(func);
        }
    }
}