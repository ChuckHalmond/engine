import { HTMLElementConstructor, RegisterCustomHTMLElement } from "engine/editor/elements/HTMLElement";
import { ListModel, ListModelChangeType, ListModelChangeEvent, BaseListModel, BaseObjectModel, ObjectModel, ObjectModelChangeEvent } from "engine/editor/models/Model";
import { LinearToneMapping } from "three";

export { temp };

declare global {
    interface HTMLElementTagNameMap {
        "e-view": HTMLEViewElement,
    }
}

interface View {
    readonly fragment: DocumentViewFragment;
    attach(): void;
    detach(): void;
}

interface ObjectView extends View {
    objectModelChangedCallback(property: string, oldValue: any, newValue: any): void;
}

abstract class BaseObjectView<M extends ObjectModel<object>> implements ObjectView {
    object: M;
    public fragment: DocumentViewFragment;
    private _objectModelChangedCallback: () => (event: ObjectModelChangeEvent) => void;

    constructor(object: M) {
        this.fragment = new BaseDocumentViewFragment();
        this.object = object;
        this._objectModelChangedCallback = () => {
            let view = this;
            return (event: ObjectModelChangeEvent) => {
                view.objectModelChangedCallback(event.data.property, event.data.oldValue, event.data.newValue);
            }
        };
    }

    public abstract objectModelChangedCallback(property: string, oldValue: any, newValue: any): void;

    public attach(): void {
        this.object.addEventListener("objectmodelchange", this._objectModelChangedCallback());
    }

    public detach(): void {
        this.object.removeEventListener("objectmodelchange", this._objectModelChangedCallback());
    }
}

interface ListView extends View {
    listModelChangedCallback(type: ListModelChangeType, index: number): void;
}

abstract class BaseListView<M extends ListModel<object>> implements ListView {
    list: M;
    public fragment: DocumentViewFragment;
    private _listModelChangedCallback: () => (event: ListModelChangeEvent) => void;

    constructor(list: M) {
        this.list = list;
        this.fragment = new BaseDocumentViewFragment();
        this._listModelChangedCallback = () => {
            let view = this;
            return (event: ListModelChangeEvent) => {
                view.listModelChangedCallback(event.data.type, event.data.index);
            }
        };
    }

    public abstract listModelChangedCallback(type: ListModelChangeType, index: number): void;

    public attach(): void {
        this.list.addEventListener("listmodelchange", this._listModelChangedCallback());
    }

    public detach(): void {
        this.list.removeEventListener("listmodelchange", this._listModelChangedCallback());
    }
}

function fragment(parts: TemplateStringsArray, ...slots: (Node | View)[]): DocumentViewFragment {
    let timestamp = new Date().getTime();
    let html = parts.reduce((html, part, index) => {
        return `${html}${part}${(index < slots.length) ? `<div id="${timestamp}-${index}"></div>` : ""}`;
    }, "");
    let parser = new DOMParser();
    let fragment = new BaseDocumentViewFragment();
    fragment.append(...parser.parseFromString(html, "text/html").body.children);
    slots.forEach((slot, index) => {
        let placeholder = fragment.getElementById(`${timestamp}-${index}`);
        if (placeholder) {
            if (slot instanceof Node) {
                placeholder.replaceWith(slot);
            }
            else {
                fragment.adoptView(slot);
                placeholder.replaceWith(slot.fragment);
            }
        }
    });
    return fragment;
}

class BaseDocumentViewFragment extends DocumentFragment implements DocumentViewFragment {
    views: View[];

    constructor() {
        super();
        this.views = [];
    }
    
    public adoptView(view: View): void {
        this.views.push(view);
        this.dispatchEvent(new CustomEvent("viewadopt", {bubbles: true, detail: {view: view}}));
    }
}

interface DocumentViewFragment extends DocumentFragment {
    views: View[];
    adoptView(view: View): void;
}

interface HTMLEViewElement extends HTMLElement {
    fragment: DocumentViewFragment | null;
    attachFragment(fragment: DocumentViewFragment): void;
}

@RegisterCustomHTMLElement({
    name: "e-view"
})
class ViewElement extends HTMLElement {
    fragment: DocumentViewFragment | null;

    constructor() {
        super();
        this.fragment = null;
    }

    private _forEachFragmentView(fragment: DocumentViewFragment, func: (view: View) => void): void {
        fragment.views.forEach((view) => {
            func(view);
            this._forEachFragmentView(view.fragment, func);
        });
    };

    public attachFragment(fragment: DocumentViewFragment) {
        this.fragment = fragment;
        this.appendChild(fragment);

        this._forEachFragmentView(fragment, (view) => {
            view.attach();
        });
    }

    public connectedCallback() {
        this.addEventListener("viewadopt", ((event: CustomEvent<{view: View}>) => {
            event.detail.view.attach();
        }) as EventListener);
    }

    public disconnectedCallback() {
        if (this.fragment) {
            this._forEachFragmentView(this.fragment, (view) => {
                view.attach();
            });
        }
    }
}

function temp() {

    interface FieldModelData {
        type: string;
        label: string;
    }
    
    class FieldModel extends BaseObjectModel<FieldModelData> {
        constructor(type: string, label: string) {
            super({type, label});
        }
    }

    class FieldsetModel extends BaseListModel<FieldModel> {
        constructor(fields: FieldModel[]) {
            super(fields);
        }
    }
    
    const field1 = new FieldModel("type", "label");
    const fieldset1 = new FieldsetModel([field1]);

    (window as any)["field1"] = field1;
    (window as any)["fieldset1"] = fieldset1;
    (window as any)["FieldModel"] = FieldModel;
    (window as any)["FieldsetModel"] = FieldsetModel;
    
    class FieldsetView extends BaseListView<FieldsetModel> {
        fieldViews: FieldView[];

        constructor(model: FieldsetModel) {
            super(model);
            this.fieldViews =  model.items.map((item) => new FieldView(item));

            this.fragment.append(...this.fieldViews.map((view) => {
                this.fragment.adoptView(view);
                return view.fragment;
            }));

            console.log(this.fragment.childNodes);
        }

        public listModelChangedCallback(type: ListModelChangeType, index: number): void {
            console.log(this.fragment.childNodes);
            switch (type) {
                case "insert":
                    let fieldView = new FieldView(this.list.items[index]);
                    this.fragment.adoptView(fieldView);
                    console.log(this.fragment.childNodes);
                    //console.log(this.fragment.childNodes);
                    //this.fragment.insertBefore(fieldView.fragment, this.fragment.children[index]);
                    break;
            }
        }
    }

    class FieldView extends BaseObjectView<FieldModel> {
        label: HTMLLabelElement;

        constructor(model: FieldModel) {
            super(model);
            this.label = HTMLElementConstructor("label", {props: {textContent: model.get("label")}});
            this.fragment.appendChild(this.label);
        }

        public objectModelChangedCallback<K extends keyof FieldModelData>(property: K, oldValue: FieldModelData[K], newValue: FieldModelData[K]): void {
            if (property == "label") {
                this.label.textContent = this.object.get("label");
            }
        }
    }

    let frag = fragment/*html*/`<div>${new FieldsetView(fieldset1)}</div>`;
    let view = document.createElement("e-view");
    view.attachFragment(frag);
    document.body.appendChild(view);
}