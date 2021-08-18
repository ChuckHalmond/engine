import { HTML } from "engine/editor/elements/HTMLElement";
import { BaseListModel, BaseObjectModel, ListModel, ListModelChangeEvent } from "engine/editor/models/Model";
import { BaseListView, HTMLEViewElement, BaseObjectView, ListView, View } from "engine/editor/models/View";
import { safeQuerySelector } from "engine/utils/Snippets";

export { temp };

function temp() {

    HTML(/*html*/`<a>`, {
        props: {textContent: "My anchor"},
        children: [
            HTML(/*html*/`<button>`, {
                props: {textContent: "My anchor"},
                children: []
            })
        ]
    });

    interface FieldData {
        type: string;
        label: string;
    }
    
    class FieldModel extends BaseObjectModel<FieldData> {
        constructor(type: string, label: string) {
            super({type, label});
        }
    }

    class FieldsetModel extends BaseListModel<FieldModel> {
        constructor(fields: FieldModel[]) {
            super(fields);
        }

        public static fromData(data: FieldData[]) {
            return new FieldsetModel(
                data.map((fieldData) => new FieldModel(fieldData.type, fieldData.label))
            );
        }
    }
    
    const field1 = new FieldModel("type", "label");
    const fieldset1 = new FieldsetModel([field1]);

    (window as any)["field1"] = field1;
    (window as any)["fieldset1"] = fieldset1;
    (window as any)["FieldModel"] = FieldModel;
    (window as any)["FieldsetModel"] = FieldsetModel;

    function bindList<I extends object>(list: ListModel<I>, parent: Element, map: (item: I) => Element) {
        list.addEventListener("listmodelchange", (event: ListModelChangeEvent) => {
            if (event.data.removedItems.length) {
                for (let i = 0; i < event.data.removedItems.length; i++) {
                    parent!.children.item(event.data.index)!.remove();
                }
            }
            if (event.data.addedItems.length) {
                let addedElements = event.data.addedItems.map(item => map(item));
                if (event.data.index >= list.items.length) {
                    parent!.append(...addedElements);
                }
                else {
                    parent!.children.item(event.data.index - event.data.removedItems.length)!.before(...addedElements);
                }
            }
        })
    }
    
    class FieldsetView extends BaseListView<HTMLFieldSetElement, FieldsetModel> {
        fieldViews: FieldView[];

        constructor(model: FieldsetModel) {
            super(model);
            
            this.fieldViews = model.items.map(item => new FieldView(item));
            
            this.attachRoot(
                HTML(/*html*/`<fieldset>`, {
                    children: this.fieldViews.map((view) => view.root!)
                })
            );
        }

        public modelChangedCallback(index: number, addedItems: FieldModel[], removedItems: FieldModel[]): void {
            if (removedItems.length) {
                this.fieldViews.splice(index, removedItems.length).forEach((fieldView) => {
                    fieldView.remove();
                });
            }

            if (addedItems.length) {
                let newFieldviews = addedItems.map(item => new FieldView(item));
                if (index >= this.fieldViews.length) {
                    this.fieldViews.push(...newFieldviews);
                    this.root!.append(...newFieldviews.map(view => view.root!));
                }
                else {
                    this.fieldViews.splice(index - removedItems.length, 0, ...newFieldviews);
                    this.root!.children.item(index - removedItems.length)!.before(...newFieldviews.map(view => view.root!));
                }
            }
        }
    }

    class FieldView extends BaseObjectView<HTMLDivElement, FieldModel> {
        label: HTMLLabelElement;

        constructor(model: FieldModel) {
            super(model);

            this.attachRoot(
                HTML(/*html*/`<div>`, {
                    children: [
                        HTML(/*html*/`<label>`, {
                            props: {
                                className: "label",
                                textContent: this.model.get("label")
                            }
                        })
                    ]
                })
            );

            this.label = this.root!.querySelector(".label")!;
        }

        public modelChangedCallback<K extends keyof FieldData>(property: K, oldValue: FieldData[K], newValue: FieldData[K]): void {
            if (property === "label") {
                this.label.textContent = this.model.get("label");
            }
        }
    }

    let view = document.createElement("e-view");

    let fieldsetView = new FieldsetView(fieldset1);

    view.appendChild(fieldsetView.root!);

    document.body.appendChild(view);

    fieldset1.insert(0, new FieldModel("", "My label"));
    fieldset1.insert(0, new FieldModel("", "My label 1"));
    fieldset1.insert(0, new FieldModel("", "My label 2"));
    fieldset1.insert(2, new FieldModel("", "My label 0"));
    fieldset1.remove(2);
}