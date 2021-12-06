export { Node };
export { NodeBase };
interface Node<N extends Node<any>> {
    parent: N | null;
    readonly children: N[];
    traverse(func: (node: N, parent: N | null) => any): void;
}
declare abstract class NodeBase<N extends NodeBase<any>> implements Node<N> {
    protected _parent: N | null;
    protected _children: N[];
    constructor();
    constructor(parent: N);
    set parent(parent: N | null);
    get parent(): N | null;
    get children(): N[];
    protected _removeChild(child: N): void;
    traverse(func: (node: N, parent: N | null) => any): void;
}
