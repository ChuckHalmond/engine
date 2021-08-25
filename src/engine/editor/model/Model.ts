import { EventDispatcher, Event } from "engine/libs/patterns/messaging/events/EventDispatcher";

export { ObjectModelChangeEvent };
export { ObjectModel };
export { ObjectModelBase };
export { ListModelChangeEvent };
export { ListModelChangeType };
export { ListModel };
export { ListModelBase };

interface ObjectModelChangeEvent {
    type: "objectmodelchange";
    data: {
        property: string;
        oldValue: any;
        newValue: any;
    };
}

interface ObjectModelChangeEvents {
    "objectmodelchange": ObjectModelChangeEvent;
}

interface ObjectModel<Data extends object> extends EventDispatcher<ObjectModelChangeEvents> {
    readonly data: Readonly<Data>;
    setData<K extends keyof Data>(key: K, value: Data[K]): void;
}

class ObjectModelBase<Data extends object> extends EventDispatcher<ObjectModelChangeEvents> implements ObjectModel<Data> {
    private _data: Data;

    constructor(data: Data) {
        super();
        this._data = data;
    }

    public get data(): Readonly<Data> {
        return this._data;
    }

    public setData<K extends keyof Data>(key: K, value: Data[K]): void {
        let oldValue = this._data[key];
        this._data[key] = value;
        this.dispatchEvent(new Event("objectmodelchange", {property: key, oldValue: oldValue, newValue: value}));
    }
}

type ListModelChangeType = "insert" | "remove" | "clear";

interface ListModelChangeEvent {
    type: "listmodelchange";
    data: {
        index: number;
        addedItems: any[];
        removedItems: any[];
    };
}

interface ListModelEvents {
    "listmodelchange": ListModelChangeEvent;
}

interface ListModel<Item> extends EventDispatcher<ListModelEvents> {
    readonly items: ReadonlyArray<Item>;
    insertItem(index: number, item: Item): void;
    removeItem(index: number): void;
    clearItems(): void;
}

class ListModelBase<Item> extends EventDispatcher<ListModelEvents> implements ListModel<Item> {
    private _items: Item[];
    
    constructor(items: Item[]) {
        super();
        this._items = items;
    }

    public get items(): ReadonlyArray<Item> {
        return this._items;
    }

    public insertItem(index: number, item: Item): void {
        if (index >= 0 && index <= this._items.length) {
            this._items.splice(index, 0, item);
            this.dispatchEvent(new Event("listmodelchange", {addedItems: [item], removedItems: [], index: index}));
        }
    }

    public removeItem(index: number): void {
        if (index >= 0 && index < this._items.length) {
            let item = this._items.splice(index, 1)[0];
            this.dispatchEvent(new Event("listmodelchange", {addedItems: [], removedItems: [item], index: index}));
        }
    }

    public clearItems(): void {
        let items = this._items;
        this._items = [];
        this.dispatchEvent(new Event("listmodelchange", {addedItems: [], removedItems: items, index: 0}));
    }
}