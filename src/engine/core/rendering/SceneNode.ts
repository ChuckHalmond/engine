export { SceneNode };

interface SceneNodeProperties {
    parent: SceneNode | null;
}

interface SceneNodeConstructor {
    prototype: SceneNode;
    new(properties: SceneNodeProperties): SceneNode;
}

interface SceneNode {
    get parent(): SceneNode | null;
    readonly nodes: SceneNode[];
}

class SceneNodeBase implements SceneNode {
    #parent: SceneNode | null;
    readonly nodes: SceneNode[];

    get parent(): SceneNode | null {
        return this.#parent;
    }

    constructor(properties: SceneNodeProperties) {
        this.#parent = properties.parent ?? null;
        this.nodes = [];
    }

    add(...nodes: SceneNode[]): void {
        nodes.forEach((node) => {
            const {parent} = node;
            if (parent !== null && parent !== this) {
                const {nodes} = parent;
                const index = nodes.indexOf(node);
                if (index > -1) {
                    nodes.splice(index, 1);
                }
                if (node instanceof SceneNodeBase) {
                    node.#parent = this;
                }
            }
            else if (parent == null) {
                if (node instanceof SceneNodeBase) {
                    node.#parent = this;
                }
            }
        });
    }

    dispose(): void {

    }
}

var SceneNode: SceneNodeConstructor = SceneNodeBase;