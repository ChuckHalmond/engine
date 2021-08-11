import { EventDispatcher, Event } from "engine/libs/patterns/messaging/events/EventDispatcher";

export { ItemModel };
export { ListModel };
export { ItemModelData };

type ListModelDataChangeType = "update" | "insert" | "remove";

interface ListModelDataChangeEvent {
    type: "datachange";
    data: {
        model: ListModel;
        type: ListModelDataChangeType;
        index: number;
    };
}

interface ListModelEvents {
    "datachange": ListModelDataChangeEvent;
}

interface ItemModelDataChangeEvent {
    type: "datachange";
    data: {
        model: ListModel;
        properties: string[];
    };
}

interface ItemModelEvents {
    "datachange": ItemModelDataChangeEvent;
}


type ItemModelData<I> = I extends ItemModel<infer Data> ? Data : never;

interface ItemModel<Data extends object> extends EventDispatcher {
    setProperties(data: Partial<Data>): void
}

class BaseItemModel<Data extends object> extends EventDispatcher {
    private _data: Data;
    private _parent: ListModel;

    constructor(data: Data) {
        super();
        this._data = data;
    }

    public setProperties(data: Partial<Data>): void {
        let keys = Object.keys(data) as (keyof Data)[];
        keys.forEach((key) => {
            this._data[key] = data[key]!;
        });
        this.dispatchEvent(new Event("datachange", {type: "update", model: this, properties: keys}));
    }
}

interface ListModel<Item extends object = object, Data extends object = object> extends ItemModel<Data> {
    readonly items: ReadonlyArray<Item>;
    insertItem(index: number, item: Item): void;
    removeItem(index: number): void;
}

class BaseListModel<Item extends object, Data extends object> extends BaseItemModel<Data> {
    private _items: Item[];

    constructor(data: Data, items: Item[]) {
        super(data);
        this._items = items;
    }

    public get items(): ReadonlyArray<Item> {
        return this._items;
    }

    public getItem(index: number): Item | null {
        if (index >= 0 && index < this._items.length) {
            return this._items[index];
        }
        return null;
    }

    public insertItem(index: number, data: Item): void {
        if (index >= 0 && index < this._items.length) {
            this._items.splice(index, 0, data);
            this.dispatchEvent(new Event("datachange", {type: "insert", model: this, index: index}));
        }
    }

    public removeItem(index: number): void {
        if (index >= 0 && index < this._items.length) {
            this._items.splice(index, 1);
            this.dispatchEvent(new Event("datachange", {type: "remove", model: this, index: index}));
        }
    }
}