import { Node } from "./Node";

export { Tree };
export { BaseTree };

interface Tree<N extends Node<any>> {
    readonly root: N;
    traverse(func: (...args: any) => any): void;
}

class BaseTree<N extends Node<any>> {
    public readonly root: N;

    constructor(root: N) {
        this.root = root;
    }

    public traverse(func: (...args: any) => any): void {
        this.root.traverse(func);
    }
}