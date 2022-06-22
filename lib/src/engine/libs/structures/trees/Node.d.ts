export { Node };
export { NodeBase };
interface Node {
    parent: Node | null;
    readonly children: Node[];
    removeChild(child: Node): void;
    root(): Node | null;
}
declare abstract class NodeBase implements Node {
    protected _parent: Node | null;
    protected _children: Node[];
    constructor();
    constructor(parent: Node);
    root(): Node | null;
    set parent(parent: Node | null);
    get parent(): Node | null;
    get children(): Node[];
    removeChild(child: Node): void;
}
