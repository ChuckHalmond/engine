import { EventDispatcher, Event } from "engine/libs/patterns/messaging/events/EventDispatcher";

export { ObjectModelChangeEvent };
export { ListModelChangeEvent };
export { ObjectModel };
export { BaseObjectModel };
export { ListModel };
export { BaseListModel };
export { ListModelChangeType };

type ListModelChangeType = "insert" | "remove" | "clear";

interface ObjectModelChangeEvent {
    type: "objectmodelchange";
    data: {
        property: string;
        oldValue: any;
        newValue: any;
    };
}

interface ListModelChangeEvent {
    type: "listmodelchange";
    data: {
        index: number;
        addedItems: any[];
        removedItems: any[];
    };
}

interface ObjectModelChangeEvents {
    "objectmodelchange": ObjectModelChangeEvent;
}

interface ListModelEvents {
    "listmodelchange": ListModelChangeEvent;
}

interface ObjectModel<Data extends object> extends EventDispatcher<ObjectModelChangeEvents> {
    get<K extends keyof Data>(key: K): Readonly<Data[K]>;
    set<K extends keyof Data>(key: K, value: Data[K]): void;
}

class BaseObjectModel<Data extends object> extends EventDispatcher<ObjectModelChangeEvents> implements ObjectModel<Data> {
    private _data: Data;

    constructor(data: Data) {
        super();
        this._data = data;
    }

    public get<K extends keyof Data>(key: K): Readonly<Data[K]> {
        return this._data[key];
    }

    public set<K extends keyof Data>(key: K, value: Data[K]): void {
        let oldValue = this._data[key];
        this._data[key] = value;
        this.dispatchEvent(new Event("objectmodelchange", {property: key, oldValue: oldValue, newValue: value}));
    }
}

interface ListModel<Item> extends EventDispatcher<ListModelEvents> {
    readonly items: ReadonlyArray<Item>;
    insert(index: number, item: Item): void;
    remove(index: number): void;
}

class BaseListModel<Item> extends EventDispatcher<ListModelEvents> implements ListModel<Item> {
    private _items: Item[];

    constructor(items: Item[]) {
        super();
        this._items = items;
    }

    public get items(): ReadonlyArray<Item> {
        return this._items;
    }

    public insert(index: number, item: Item): void {
        if (index >= 0 && index <= this._items.length) {
            this._items.splice(index, 0, item);
            this.dispatchEvent(new Event("listmodelchange", {addedItems: [item], removedItems: [], index: index}));
        }
    }

    public remove(index: number): void {
        if (index >= 0 && index < this._items.length) {
            let item = this._items.splice(index, 1)[0];
            this.dispatchEvent(new Event("listmodelchange", {addedItems: [], removedItems: [item], index: index}));
        }
    }

    public clear(): void {
        let items = this._items;
        this._items = [];
        this.dispatchEvent(new Event("listmodelchange", {addedItems: [], removedItems: items, index: 0}));
    }
}