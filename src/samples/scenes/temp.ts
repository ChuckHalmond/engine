import { bindShadowRoot, Fragment, HTML, HTMLStringTemplate, isTagElement, ReactiveChildNodes, ReactiveNode, RegisterCustomHTMLElement } from "engine/editor/elements/HTMLElement";
import { HTMLEDraggableElement } from "engine/editor/elements/lib/controls/draggable/Draggable";
import { DataChangeEvent, HTMLEDropzoneElement } from "engine/editor/elements/lib/controls/draggable/Dropzone";
import { HTMLEViewElementBase } from "engine/editor/elements/view/View";
import { ListModelBase, ObjectModelBase, ListModel } from "engine/editor/model/Model";

export { temp };

function temp() {
    interface FieldData {
        name: string,
        type: string,
        label: string,
        allows_expression: boolean,
        optional: boolean,
        value?: any;
        type_constraint?: FieldTypeConstraintData;
    }
    
    interface FieldTypeConstraintData {
        name: "same_as";
        other: string;
    }
    
    interface FieldsetData {
        signature: string,
        box: string, 
        doc: string,
        label: string,
        is_expression: boolean
    }

    interface FielsetFieldsData {
        fields: FieldData[]
    }

    class FieldModel extends ObjectModelBase<FieldData> {
        constructor(data: FieldData) {
            super(data);
        }
    }
    
    class FieldsetModel extends ObjectModelBase<FieldsetData> {
        readonly fields: ListModel<FieldModel>;

        constructor(data: FieldsetData & FielsetFieldsData) {
            super(data);
            this.fields = new ListModelBase(
                data.fields.map(field => new FieldModel(field))
            );
        }
    }
    
    const fieldset = new FieldsetModel({
        box: "Transformer",
        signature: "replace_transformer",
        is_expression: false,
        label: "Replace",
        doc: "Replace...",
        fields: [
            {
                label: "Column",
                name: "column", 
                type: "any", 
                allows_expression: true,
                type_constraint: {
                    name: "same_as",
                    other: "value"
                },
                optional: false
            },
            {
                label: "Value",
                name: "value", 
                type: "any", 
                type_constraint: {
                    name: "same_as",
                    other: "column"
                },
                allows_expression: true,
                optional: false
            }
        ]
    });

    const plusOperatorFieldset = new FieldsetModel({
        box: "Operator",
        signature: "plus_operator",
        is_expression: false,
        label: "[left] + [right]",
        doc: "Plus...",
        fields: [
            {
                label: "Left",
                name: "left", 
                type: "any", 
                allows_expression: true,
                type_constraint: {
                    name: "same_as",
                    other: "right"
                },
                optional: false
            },
            {
                label: "Right",
                name: "right", 
                type: "any", 
                type_constraint: {
                    name: "same_as",
                    other: "left"
                },
                allows_expression: true,
                optional: false
            }
        ]
    });

    const fieldFragment = (fieldset: HTMLElement, field: FieldModel) => Fragment(
        HTML(/*html*/`<label>`, {
            props: {
                textContent: field.data.label
            }
        }),
        dropzoneInputFragment(fieldset, field)
    );

    const dropzoneInputFragment = (fieldset: HTMLElement, field: FieldModel) => Fragment(
        HTML(/*html*/`<e-dropzoneinput>`, {
            children: [
                HTML(/*html*/`<e-dropzone>`, {
                    props: {
                        slot: "dropzone",
                        name: field.data.name,
                        placeholder: field.data.type, 
                        type: field.data.type,
                        droptest: (dropzone: HTMLEDropzoneElement, draggables: HTMLEDraggableElement[]) => {
                            let accepts = draggables.every(draggable => dropzone.type === "any" || draggable.type === dropzone.type);
                            if (!accepts) {
                                alert(`Only ${dropzone.type} draggables are allowed.`);
                            }
                            return accepts;
                        }
                    },
                    listeners: {
                        datachange: (event: DataChangeEvent) => {
                            let dropzone = event.target as HTMLEDropzoneElement;
                            let constraint = field.data.type_constraint;
                            if (constraint) {
                                switch (constraint.name) {
                                    case "same_as":
                                        let otherDropzone = fieldset.querySelector(`e-dropzone[name=${constraint.other}]`) as HTMLEDropzoneElement;
                                        if (otherDropzone) {
                                            if (event.detail.action === "insert") {    
                                                let draggable = event.detail.draggables[0];
                                                if (draggable) {
                                                    dropzone.type = otherDropzone.type = draggable.type;
                                                    dropzone.placeholder = otherDropzone.placeholder = draggable.type;
                                                }
                                            }
                                            else {
                                                if (otherDropzone.draggables.length === 0) {
                                                    dropzone.type = otherDropzone.type = "any";
                                                    dropzone.placeholder = otherDropzone.placeholder = "any"; 
                                                }
                                            }
                                        }
                                    break;
                                }
                            }
                        }
                    }
                }),
                HTML(/*html*/`<input>`, {
                    props: {
                        slot: "input"
                    }
                })
            ]
        })
    );
    
    @RegisterCustomHTMLElement({
        name: "v-fieldset"
    })
    class FieldsetView extends HTMLEViewElementBase<FieldsetModel> {

        constructor(model: FieldsetModel) {
            super(model);
        }

        public render() {
            return ReactiveChildNodes(this.model.fields, (item) =>
                HTML(/*html*/`<div>`, {
                    props: {
                        className: "field"
                    },
                    children: [
                        HTML(/*html*/`<label>`, {
                            props: {
                                className: "label",
                                textContent: item.data.label
                            }
                        }),
                        fieldFragment(this, item)
                    ]
                })
            )(this);
        }
    }

    @RegisterCustomHTMLElement({
        name: "v-draggablefieldset"
    })
    class DraggableFieldsetView extends HTMLEViewElementBase<FieldsetModel> {

        constructor(model: FieldsetModel) {
            super(model);
        }

        public render() {
            return HTML(/*html*/`<div>`, {
                props: {
                    className: "field"
                },
                children: HTMLStringTemplate(this.model.data.label, this.model.fields.items.reduce(
                    (obj: any, item: FieldModel) => ({
                        ...obj,
                        [item.data.name]: dropzoneInputFragment(this, item)
                    }), {}
                )).childNodes
            });
        }
    }

    let fieldsetView = new DraggableFieldsetView(plusOperatorFieldset);
    let draggable = HTML(/*html*/`<e-draggable>`, {children: [fieldsetView]});

    let extractButton = document.getElementById("extract-button");
    if (extractButton) {
        extractButton.after(draggable);
    }

    (window as any)["fieldset"] = fieldset;
}