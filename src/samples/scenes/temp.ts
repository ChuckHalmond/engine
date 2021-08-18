import { HTML, ReactiveChildren, ReactiveElement, RegisterCustomHTMLElement } from "engine/editor/elements/HTMLElement";
import { BaseListModel, BaseObjectModel, ListModel, ListModelChangeEvent, ObjectModel } from "engine/editor/models/Model";

export { temp };

function temp() {
    interface FieldData {
        name: string,
        type: string,
        label: string,
        allows_expression: boolean,
        optional: boolean,
        type_constraint?: FieldTypeConstraintData;
    }
    
    interface FieldTypeConstraintData {
        constraint: "same_as";
        other: string;
    }
    
    interface FieldsetData {
        signature: string,
        box: string, 
        doc: string,
        label: string,
        fields: FieldsetFieldsModel,
        is_expression: boolean
    }
    
    class FieldsetFieldsModel extends BaseListModel<FieldModel> {
        constructor(items: FieldModel[]) {
            super(items);
        }
    }
    
    class FieldModel extends BaseObjectModel<FieldData> {
        constructor(data: FieldData) {
            super(data);
        }
    }
    
    class FieldsetModel extends BaseObjectModel<FieldsetData> {
        constructor(data: FieldsetData) {
            super(data);
        }
    }
    
    const fieldset = new FieldsetModel({
        box: "Transformer",
        signature: "replace_transformer",
        is_expression: false,
        label: "Replace",
        doc: "Replace...",
        fields: new FieldsetFieldsModel([
            new FieldModel({
                label: "Column",
                name: "column", 
                type: "", 
                allows_expression: true,
                type_constraint: {
                    constraint: "same_as",
                    other: "value"
                },
                optional: false
            }),
            new FieldModel({
                label: "Value",
                name: "value", 
                type: "", 
                type_constraint: {
                    constraint: "same_as",
                    other: "column"
                },
                allows_expression: true,
                optional: false
            })
        ])
    });
    
    @RegisterCustomHTMLElement({
        name: "v-fieldset"
    })
    class FieldsetView extends HTMLElement {
        model: FieldsetModel;
    
        constructor(model: FieldsetModel) {
            super();
            this.model = model;
    
            this.appendChild(
                HTML(/*html*/`<fieldset>`, {
                    children: ReactiveChildren(this.model.data.fields, (item) =>
                        ReactiveElement(item,
                            HTML(/*html*/`<div>`, {
                                children: [
                                    HTML(/*html*/`<label>`, {
                                        props: {
                                            textContent: item.data.label
                                        }
                                    }),
                                    HTML(/*html*/`<e-dropzone>`, {
                                        props: {
                                            placeholder: item.data.type
                                        }
                                    })
                                ]}
                            ),
                            this.onFieldDataChange
                        )
                    )
                }),
    
            );
    
            /*new MutationObserver((mutations: MutationRecord[], observer: MutationObserver) => {
                let isReactiveElement = (node: Node) => {
                    return node.nodeType === node.ELEMENT_NODE &&
                        (node as Element).hasAttribute("data-reactive");
                };
                mutations.forEach((record: MutationRecord) => {
                    let addedReactiveElements = Array.from(record.addedNodes).filter(isReactiveElement) as (Element & {
                        _reactModel: ListModel<any> | ObjectModel<any>,
                        _reactListener: EventListener
                    })[];
                    addedReactiveElements.forEach((reactiveElement) => {
                        if ("_reactListener" in reactiveElement && "_reactModel" in reactiveElement) {
                            reactiveElement._reactModel.addEventListener(event)
                        }
                    });
                    let removedReactiveElements = Array.from(record.removedNodes).filter(isReactiveElement);
                })
            })*/
        }
    
        public onFieldDataChange<K extends keyof FieldData>(label: HTMLSpanElement, property: K, oldValue: FieldData[K], newValue: FieldData[K]) {
            /*switch (property) {
                case "label":
                    label.textContent = newValue;
            }*/
        }
    }
    
    let fieldsetView = new FieldsetView(fieldset);
    document.body.appendChild(fieldsetView);

    (window as any)["fieldset"] = fieldset;
}