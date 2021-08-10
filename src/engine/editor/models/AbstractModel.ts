import { EventDispatcher } from "engine/libs/patterns/messaging/events/EventDispatcher";

export { ModelModificationType };
export { ModelIndex };
export { ModelModifiedEvent };
export { AbstractModel };

type ModelModificationType = "insertItem" | "replaceItem" | "removeItem" | "setItemProperty" | "setProperty";

interface ModelIndex {
    index?: number;
    row?: number;
    column?: number;
    parent?: ModelIndex;
}

interface ModelModifiedEvent {
    type: "modified";
    data: {
        type: "modified";
        modification: ModelModificationType;
        index: ModelIndex;
        property: string;
    }
}

class ModelModifiedEvent implements ModelModifiedEvent {
    type: "modified";
    modification: ModelModificationType;
    index: ModelIndex;
    property?: string;

    constructor(modification: ModelModificationType, index: ModelIndex, property?: string) {
        this.type = "modified";
        this.modification = modification;
        this.index = index;
        this.property = property;
    }
}

interface ModelEvents {
    "modified": ModelModifiedEvent;
}

abstract class AbstractModel<M> extends EventDispatcher<ModelEvents> {
    protected _data: M;

    constructor(data: M) {
        super();
        this._data = data;
    }

    public abstract getItem(index: ModelIndex): M | null;
    public abstract _createItem(index: ModelIndex): M | null;
    public abstract _removeItem(index: ModelIndex): boolean;

    public replaceItem(index: ModelIndex, data: M): void {
        let atIndex = this.getItem(index);
        if (atIndex) {
            let atIndexKeys = Object.keys(atIndex) as (keyof M)[];
            let dataKeys = Object.keys(data) as (keyof M)[];
            let oldKeys = atIndexKeys.filter(
                (key) => dataKeys.indexOf(key) < 0
            );
            for (let oldKey of oldKeys) {
                delete atIndex[oldKey];
            }
            for (let dataKey of dataKeys) {
                atIndex[dataKey] = data[dataKey];
            }
            this.dispatchEvent(new ModelModifiedEvent("replaceItem", index));
        }
    }

    public insertItem(index: ModelIndex, data: M): void {
        let newIndex = this._createItem(index);
        if (newIndex) {
            for (let item in newIndex) {
                newIndex[item] = data[item];
            }
            this.dispatchEvent(new ModelModifiedEvent("insertItem", index));
        }
    }

    public removeItem(index: ModelIndex): void {
        let removeSuccess = this._removeItem(index);
        if (removeSuccess) {
            this.dispatchEvent(new ModelModifiedEvent("removeItem", index));
        }
    }

    public getItemProperty<K extends keyof M>(index: ModelIndex, prop: K): any {
        let atIndex = this.getItem(index);
        if (atIndex) {
            return atIndex[prop];
        }
    }

    public setItemProperty<K extends Extract<keyof M, string>>(index: ModelIndex, prop: K, data: M[K]): void {
        let atIndex = this.getItem(index);
        if (atIndex) {
            atIndex[prop] = data;
            this.dispatchEvent(new ModelModifiedEvent("setItemProperty", index, prop));
        }
    }

    public getProperty<K extends Extract<keyof M, string>>(prop: K): M[K] {
        return this._data[prop];
    }

    public setProperty<K extends Extract<keyof M, string>>(prop: K, data: M[K]): void {
        this._data[prop] = data;
        this.dispatchEvent(new ModelModifiedEvent("setProperty", {}, prop));
    }
}
