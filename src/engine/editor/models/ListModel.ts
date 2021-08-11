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
        type: string;
    };
}

interface ModelEvents {
    "datachange": ModelDataChangeEvent;
}

type ModelData<I> = I extends Model<infer Data> ? Data : never;

interface Model<Data extends object> extends EventDispatcher<ModelEvents> {
    getProperty<K extends keyof Data>(key: K): Readonly<Data[K]>;
    setProperty<K extends keyof Data>(key: K, value: Data[K]): void;
    setProperties(data: Partial<Data>): void
}

class BaseModel<Data extends object> extends EventDispatcher<ModelEvents> {
    private _data: Data;

    constructor(data: Data) {
        super();
        this._data = data;
    }

    public getProperty<K extends keyof Data>(key: K): Readonly<Data[K]> {
        return this._data[key];
    }

    public setProperty<K extends keyof Data>(key: K, value: Data[K]): void {
        this._data[key] = value;
        this.dispatchEvent(new Event("datachange", {type: "property", properties: key}));
    }

    public setProperties(data: Partial<Data>): void {
        let keys = Object.keys(data) as (keyof Data)[];
        keys.forEach((key) => {
            this._data[key] = data[key]!;
        });
        this.dispatchEvent(new Event("datachange", {type: "properties", properties: keys}));
    }
}

interface ListModel<Item extends object = object, Data extends object = object> extends Model<Data> {
    readonly items: ReadonlyArray<Item>;
    insertItem(index: number, item: Item): void;
    removeItem(index: number): void;
}

class BaseListModel<Item extends object, Data extends object> extends BaseModel<Data> {
    private _items: Item[];

    constructor(data: Data, items: Item[]) {
        super(data);
        this._items = items;
    }

    public get items(): ReadonlyArray<Item> {
        return this._items;
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