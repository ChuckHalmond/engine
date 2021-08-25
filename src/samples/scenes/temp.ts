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
        doc: "PLus...",
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
        HTML(/*html*/`<e-dropzone>`, {
            props: {
                className: "dropzone",
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

    interface HTMLEDropzoneInput extends HTMLElement {
        dropzone: HTMLEDropzoneElement | null;
        input: HTMLInputElement | null;
        converter: ((dropzone: HTMLEDropzoneElement) => string) | null;
    }

    @RegisterCustomHTMLElement({
        name: "e-dropzoneinput"
    })
    class HTMLEDropzoneInputElementBase extends HTMLElement implements HTMLEDropzoneInput {
        dropzone: HTMLEDropzoneElement | null;
        input: HTMLInputElement | null;

        public converter: ((dropzone: HTMLEDropzoneElement) => string) | null;

        constructor() {
            super();
        
            bindShadowRoot(this, /*html*/`
                <style>
                    :host {
                        display: block;
                    }

                    [part~="container"] {
                        position: relative;
                        display: flex;
                        flex-direction: row;
                    }
                    
                    ::slotted(e-dropzone) {
                        flex: auto;
                    }
    
                    ::slotted(input) {
                        position: absolute;
                        flex: none;
                        width: 100%;
                        height: 100%;
                        left: 0;
                        top: 0;
                        opacity: 0;
                        pointer-events: none;
                    }
                </style>
                <div part="container">
                    <slot name="input"></slot>
                    <slot name="dropzone"></slot>
                </div>
                `
            );
            this.dropzone = null;
            this.input = null;
            this.converter = (dropzone) => dropzone.type;
        }

        public connectedCallback() {
            this.tabIndex = this.tabIndex;

            this.addEventListener("datachange", (event: DataChangeEvent) => {
                let target = event.target;
                if (target == this.dropzone && this.dropzone && this.input && this.converter) {
                    this.input.value = this.converter(this.dropzone);
                }
            });
    
            const dropzoneSlot = this.shadowRoot?.querySelector<HTMLSlotElement>("slot[name='dropzone']");
            if (dropzoneSlot) {
                dropzoneSlot.addEventListener("slotchange", () => {
                    const dropzone = dropzoneSlot.assignedElements().filter(
                        elem => isTagElement("e-dropzone", elem)
                    ) as HTMLEDropzoneElement[];
                    if (dropzone.length > 0) {
                        this.dropzone = dropzone[0];
                    }
                });
            }

            const inputSlot = this.shadowRoot?.querySelector<HTMLSlotElement>("slot[name='input']");
            if (inputSlot) {
                inputSlot.addEventListener("slotchange", () => {
                    const input = inputSlot.assignedElements().filter(
                        elem => isTagElement("input", elem)
                    ) as HTMLInputElement[];
                    if (input.length > 0) {
                        this.input = input[0];
                    }
                });
            }
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
                        [item.data.name]: fieldFragment(this, item)
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