import { AbstractModel } from "./AbstractModel";

export { TreeModelIndex };
export { TreeModelNode };
export { TreeModel };

interface TreeModelIndex {
    index: number;
    parent?: TreeModelIndex;
}

type TreeModelNode<D extends object = object, N extends TreeModelNode<D> = TreeModelNode<D, any>> = D & {
    items?: N[];
}

class TreeModel<M extends TreeModelNode<object, M>> extends AbstractModel<M> {
    constructor(data: M) {
        super(data);
    }

    public getItem(index: TreeModelIndex): M | null {
        let parentIndex: TreeModelIndex | undefined = index;
        let nodeData = this._data;
        while (parentIndex && parentIndex.parent) {
            parentIndex = parentIndex.parent;
            if (nodeData && nodeData.items) {
                nodeData = nodeData.items[parentIndex.index];
            }
        }
        return nodeData;
    }

    public _createItem(index: TreeModelIndex): M | null {
        if (index.parent) {
            let parent = this.getItem(index.parent);
            if (parent && parent.items) {
                parent.items.splice(index.index, 0, {} as M);
            }
        }
        return {} as M;
    }

    public _removeItem(index: TreeModelIndex): boolean {
        if (index.parent) {
            let parent = this.getItem(index.parent);
            if (parent && parent.items) {
                parent.items.splice(index.index, 1);
                return true;
            }
        }
        return false;
    }
}

interface MenuBarModel {
    label: string;
    items: MenuItemModel[];
}

interface MenuModel {
    name: string;
    items: (MenuItemModel | MenuItemGroupModel)[];
}

interface MenuItemModel {
    name: string;
    label: string;
    menu?: MenuModel;
}

interface MenuItemGroupModel {
    name: string;
    label: string;
    items: MenuItemModel[];
}