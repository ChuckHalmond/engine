import { RegisterCustomHTMLElement } from "../elements/HTMLElement";
import { ObjectModel, ObjectModelChangeEvent, ListModel, ListModelChangeEvent } from "./Model";

export { View };
export { HTMLEViewElement };
export { BaseView };
export { ObjectView };
export { BaseObjectView };
export { ListView };
export { BaseListView };

declare global {
    interface HTMLElementTagNameMap {
        "e-view": HTMLEViewElement,
    }
}

interface HTMLEViewElement extends HTMLElement {
    addView(view: View): void;
    removeView(view: View): void;
}

declare global {
    interface HTMLElementTagNameMap {
        "e-view": HTMLEViewElement,
    }
}

@RegisterCustomHTMLElement({
    name: "e-view"
})
class BaseHTMLEViewElement extends HTMLElement {
    private _views: View[];

    constructor() {
        super();
        this._views = [];
    }

    public connectedCallback() {
        this._views.forEach((view) => {
            view.addListeners();
        });
    }

    public disconnectedCallback() {
        this._views.forEach((view) => {
            view.removeListeners();
        });
    }

    public addView(view: View): void {
        if (!this._views.includes(view)) {
            this._views.push(view);
            if (this.isConnected) {
                view.addListeners();
            }
        }
    }

    public removeView(view: View): void {
        let viewIndex = this._views.indexOf(view);
        if (viewIndex > -1) {
            let view = this._views.splice(viewIndex, 1)[0];
            if (this.isConnected) {
                view.removeListeners();
            }
        }
    }
}

interface View<E extends Element = Element> {
    model: object;
    readonly root: ViewRoot<E> | null;
    attachRoot(root: E): void;
    remove(): void;
    addListeners(): void;
    removeListeners(): void;
    modelChangedCallback(...args: any[]): void;
}

type ViewRoot<E extends Element = Element> = E & {
    view?: View;
}

abstract class BaseView<E extends Element> implements View<E> {
    public model: object;
    private _root: ViewRoot<E> | null;

    constructor(model: object) {
        this.model = model;
        this._root = null;
    }

    public get root(): ViewRoot<E> | null {
        return this._root;
    }

    public attachRoot(root: E) {
        if (this._root) {
            delete this._root.view;
        }
        this._root = Object.assign(
            root, {
                view: this
            }
        );
    }

    public remove(): void {
        if (this.root) {
            this.root.remove();
        }
    }

    public abstract modelChangedCallback(...args: any[]): void;
    public abstract addListeners(): void;
    public abstract removeListeners(): void;
}

interface ObjectView<E extends Element = Element> extends View<E> {
    modelChangedCallback(property: string, oldValue: any, newValue: any): void;
}

abstract class BaseObjectView<E extends Element, M extends ObjectModel<object>> extends BaseView<E> implements ObjectView {
    model!: M;
    
    private readonly _modelChangedCallback: (event: ObjectModelChangeEvent) => void = (event: ObjectModelChangeEvent) => {
        this.modelChangedCallback(event.data.property, event.data.oldValue, event.data.newValue);
    };

    constructor(model: M) {
        super(model);
        this.addListeners();
    }

    public addListeners(): void {
        this.model.addEventListener("objectmodelchange", this._modelChangedCallback);
    }

    public removeListeners(): void {
        this.model.removeEventListener("objectmodelchange", this._modelChangedCallback);
    }

    public remove(): void {
        super.remove();
        this.removeListeners();
    }

    public abstract modelChangedCallback(property: string, oldValue: any, newValue: any): void;
}

interface ListView<E extends Element, M extends ListModel<I>, I extends object = M extends ListModel<infer I> ? I : never> extends View<E> {
    modelChangedCallback(index: number, addedFields: I[], removedFields: I[]): void;
}

abstract class BaseListView<E extends Element, M extends ListModel<I>, I extends object = M extends ListModel<infer I> ? I : never> extends BaseView<E> implements ListView<E, M, I> {
    model!: M;

    private readonly _modelChangedCallback: (event: ListModelChangeEvent) => void = (event: ListModelChangeEvent) => {
        this.modelChangedCallback(event.data.index, event.data.addedItems, event.data.removedItems);
    };

    constructor(model: M) {
        super(model);
        this.addListeners();
    }

    public remove(): void {
        super.remove();
        this.removeListeners();
    }

    public addListeners(): void {
        this.model.addEventListener("listmodelchange", this._modelChangedCallback);
    }

    public removeListeners(): void {
        this.model.removeEventListener("listmodelchange", this._modelChangedCallback);
    }

    public abstract modelChangedCallback(index: number, addedFields: I[], removedFields: I[]): void;
}