import { EventDispatcher, Event } from "engine/libs/patterns/messaging/events/EventDispatcher";

export { ModelDataChangeEvent };
export { Model };
export { BaseModel };
export { ListModel };
export { BaseListModel };
export { ModelData };

interface ModelDataChangeEvent {
    type: "datachange";
    data: {
        property: string;
        type: "property";
    };
}

interface ListModelDataChangeEvent {
    type: "datachange";
    data: {
        index: number;
        type: "insert" | "remove" | "clear";
    };
}

interface ModelEvents {
    "datachange": ModelDataChangeEvent;
}

interface ListModelEvents {
    "datachange": ListModelDataChangeEvent;
}

type ModelData<I> = I extends Model<infer Data> ? Data : never;

interface Model<Data extends object> extends EventDispatcher<ModelEvents> {
    get<K extends keyof Data>(key: K): Readonly<Data[K]>;
    set<K extends keyof Data>(key: K, value: Data[K]): void;
}

class BaseModel<Data extends object> extends EventDispatcher<ModelEvents> {
    private _data: Data;

    constructor(data: Data) {
        super();
        this._data = data;
    }

    public get<K extends keyof Data>(key: K): Readonly<Data[K]> {
        return this._data[key];
    }

    public set<K extends keyof Data>(key: K, value: Data[K]): void {
        this._data[key] = value;
        this.dispatchEvent(new Event("datachange", {type: "property", property: key}));
    }
}

interface ListModel<Item> extends EventDispatcher<ListModelEvents> {
    readonly items: ReadonlyArray<Item>;
    insert(index: number, item: Item): void;
    remove(index: number): void;
}

class BaseListModel<Item> extends EventDispatcher<ListModelEvents> {
    private _items: Item[];

    constructor(items: Item[]) {
        super();
        this._items = items;
    }

    public get items(): ReadonlyArray<Item> {
        return this._items;
    }

    public insert(index: number, item: Item): void {
        if (index >= 0 && index < this._items.length) {
            this._items.splice(index, 0, item);
            this.dispatchEvent(new Event("datachange", {type: "insert", index: index}));
        }
    }

    public remove(index: number): void {
        if (index >= 0 && index < this._items.length) {
            this._items.splice(index, 1);
            this.dispatchEvent(new Event("datachange", {type: "remove", index: index}));
        }
    }

    public clear(): void {
        this._items.length = 0;
        this.dispatchEvent(new Event("datachange", {type: "clear", index: 0}));
    }
}