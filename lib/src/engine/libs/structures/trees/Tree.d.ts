import { Node } from "./Node";
export { Tree };
export { BaseTree };
interface Tree<N extends Node<any>> {
    readonly root: N;
    traverse(func: (...args: any) => any): void;
}
declare class BaseTree<N extends Node<any>> {
    readonly root: N;
    constructor(root: N);
    traverse(func: (...args: any) => any): void;
}
