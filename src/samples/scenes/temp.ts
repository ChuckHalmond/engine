import { Fragment, HTML, isNode, isParentNode, isReactiveNode, isReactiveParentNode, isTagElement, ReactiveChildNodes, ReactiveNode, RegisterCustomHTMLElement } from "engine/editor/elements/HTMLElement";
import { HTMLEDraggableElement } from "engine/editor/elements/lib/controls/draggable/Draggable";
import { DataChangeEvent, HTMLEDropzoneElement } from "engine/editor/elements/lib/controls/draggable/Dropzone";
import { forAllSubtreeNodes } from "engine/editor/elements/Snippets";
import { BaseListModel, BaseObjectModel, ListModel } from "engine/editor/models/Model";

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

    class FieldModel extends BaseObjectModel<FieldData> {
        constructor(data: FieldData) {
            super(data);
        }
    }
    
    class FieldsetModel extends BaseObjectModel<FieldsetData> {
        readonly fields: ListModel<FieldModel>;

        constructor(data: FieldsetData & FielsetFieldsData) {
            super(data);
            this.fields = new BaseListModel(
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

    abstract class HTMLEViewElement<M extends object> extends HTMLElement {
        _model: M;
        _observer: MutationObserver;

        constructor(model: M) {
            super();
            this._model = model;

            this._observer = new MutationObserver((mutations: MutationRecord[]) => {
                mutations.forEach((record: MutationRecord) => {
                    Array.from(record.removedNodes).map((node) => {
                        this._removeReactiveListeners(node);
                        if (isParentNode(node)) {
                            forAllSubtreeNodes(node, (childNode) => {
                                this._removeReactiveListeners(childNode);
                            });
                        }
                    });
                    Array.from(record.addedNodes).map((node) => {
                        this._addReactiveListeners(node);
                        if (isParentNode(node)) {
                            forAllSubtreeNodes(node, (childNode) => {
                                this._addReactiveListeners(childNode);
                            });
                        }
                    });
                });
            });

            let content = this.render();
            if (isNode(content)) {
                this.append(content);
            }
            else {
                this.append(...content);
            }

            this._observer.observe(this, {
                subtree: true,
                childList: true
            });

            this._addReactiveListeners(this);
        }

        public get model(): M {
            return this._model;
        }

        public setModel(model: M): void {
            this._model = model;
            this.innerHTML = "";
            let content = this.render();
            if (isNode(content)) {
                this.append(content);
            }
            else {
                this.append(...content);
            }
        }

        public abstract render(): Node | (Node | string)[];

        public connectedCallback(): void {
            Array.from(this.childNodes).map((node) => {
                this._addReactiveListeners(node);
                if (isParentNode(node)) {
                    forAllSubtreeNodes(node, (childNode) => {
                        this._addReactiveListeners(childNode);
                    });
                }
            });
        }

        public disconnectedCallback(): void {
            Array.from(this.childNodes).map((node) => {
                this._removeReactiveListeners(node);
                if (isParentNode(node)) {
                    forAllSubtreeNodes(node, (childNode) => {
                        this._removeReactiveListeners(childNode);
                    });
                }
            });
        }

        private _addReactiveListeners(node: Node): void {
            if (isReactiveParentNode(node)) {
                const { _reactModel, _reactEvent, _reactListener } = node._reactAttributes; 
                _reactModel.addEventListener(_reactEvent, _reactListener);
            }
            else if (isReactiveNode(node)) {
                const { _reactModel, _reactEvent, _reactListener } = node._reactAttributes; 
                _reactModel.addEventListener(_reactEvent, _reactListener);
            }
        }

        private _removeReactiveListeners(node: Node): void {
            if (isReactiveParentNode(node)) {
                const { _reactModel, _reactEvent, _reactListener } = node._reactAttributes; 
                _reactModel.removeEventListener(_reactEvent, _reactListener);
            }
            else if (isReactiveNode(node)) {
                const { _reactModel, _reactEvent, _reactListener } = node._reactAttributes; 
                _reactModel.removeEventListener(_reactEvent, _reactListener);
            }
        }
    }
    
    @RegisterCustomHTMLElement({
        name: "v-fieldset"
    })
    class FieldsetView extends HTMLEViewElement<FieldsetModel> {

        constructor(model: FieldsetModel) {
            super(model);
        }

        public render() {
            return ReactiveChildNodes(this.model.fields, (item) => ReactiveNode(item,
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
                        HTML(/*html*/`<e-dropzone>`, {
                            props: {
                                className: "dropzone",
                                name: item.data.name,
                                placeholder: item.data.type,
                                type: item.data.type,
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
                                    let constraint = item.data.type_constraint;
                                    if (constraint) {
                                        switch (constraint.name) {
                                            case "same_as":
                                                let otherDropzone = this.querySelector(`e-dropzone[name=${constraint.other}]`) as HTMLEDropzoneElement;
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
                    ]
                }),
                this.fieldDataChangedCallback
            ))(this);
        }
    
        public fieldDataChangedCallback<K extends keyof FieldData>(field: HTMLDivElement, property: keyof FieldData, oldValue: FieldData[K], newValue: FieldData[K]) {
            switch (property) {
                case "label":
                    field.querySelector(".label")!.textContent = newValue as string;
                    break;
            }
        }
    }

    let fieldsetView = new FieldsetView(fieldset);
    
    document.body.appendChild(fieldsetView);

    (window as any)["fieldset"] = fieldset;
}