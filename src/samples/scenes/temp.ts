import { Fragment, Element, ReactiveChildNodes, ReactiveNode, parseStringTemplate, setElementChildren } from "engine/editor/elements/HTMLElement";
import { HTMLEDraggableElement } from "engine/editor/elements/lib/controls/draggable/Draggable";
import { HTMLEDragzoneElement } from "engine/editor/elements/lib/controls/draggable/Dragzone";
import { DataChangeEvent, HTMLEDropzoneElement } from "engine/editor/elements/lib/controls/draggable/Dropzone";
import { ViewBase } from "engine/editor/elements/view/View";
import { ListModelBase, ObjectModelBase, ListModel, ObjectModelChangeEvent } from "engine/editor/model/Model";

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
        signature: string;
        box: string; 
        doc: string;
        label: string;
        is_expression: boolean;
    }

    class FieldModel extends ObjectModelBase<FieldData> {
        constructor(data: FieldData) {
            super(data);
        }
    }
    
    class FieldsetModel extends ObjectModelBase<FieldsetData> {
        readonly fields: ListModel<FieldModel>;

        constructor(data: FieldsetData & {fields: FieldData[]}) {
            super(data);
            this.fields = new ListModelBase(
                data.fields.map(field => new FieldModel(field))
            );
        }

        public getData(): Readonly<FieldsetData & {fields: FieldData[]}> {
            return Object.assign(
                this.data, {
                    fields: this.fields.items.map(item => item.data)
                }
            );
        }
    }

    type StatementExecutionStatus = "success" | "error" | "warning";

    interface StatementLastExecutionData {
        datetime: Date | null;
        status: StatementExecutionStatus | null;
        message: string | null;
    }

    interface StatementData {
        fieldset: FieldsetData & {fields: FieldData[]};
        children: StatementData[];
        result: StatementResultData & {columns: DataframeColumnData[]};
        lastExecution: StatementLastExecutionData;
    }

    class StatementLastExecutionModel extends ObjectModelBase<StatementLastExecutionData> {
        constructor(data: StatementLastExecutionData) {
            super(data);
        }
    }

    interface StatementResultData {
        dataframe: string;
    }

    interface DataframeColumnData {
        name: string;
    }

    class DataframeColumnModel extends ObjectModelBase<DataframeColumnData> {
        constructor(data: DataframeColumnData) {
            super(data);
        }
    }

    class StatementResultModel extends ObjectModelBase<StatementResultData> {
        readonly columns:  ListModel<DataframeColumnModel>;

        constructor(data: StatementResultData & {columns: DataframeColumnData[]}) {
            super(data);
            this.columns = new ListModelBase(
                data.columns.map((column) => new DataframeColumnModel(column))
            );
        }

        public getData(): Readonly<StatementResultData & {columns: DataframeColumnData[]}> {
            return Object.assign(
                this.data, {
                    columns: this.columns.items.map(item => item.data)
                }
            );
        }
    }

    class Statement {
        readonly parent: Statement | null;
        readonly children: Statement[];

        readonly fieldsetModel: FieldsetModel;
        readonly lastExecutionModel: StatementLastExecutionModel;
        readonly resultModel: StatementResultModel;
        
        readonly fieldsetView: StatementFieldsetView;
        readonly lastExecutionView: StatementLastExecutionView;
        readonly resultView: StatementResultView;

        constructor(parent: Statement | null, data: StatementData) {
            this.parent = parent;
            this.children = data.children.map(child => new Statement(this, child));
            this.fieldsetModel = new FieldsetModel(data.fieldset);
            this.lastExecutionModel = new StatementLastExecutionModel(data.lastExecution);
            this.resultModel = new StatementResultModel(data.result);
            this.fieldsetView = new StatementFieldsetView(this.fieldsetModel);
            this.lastExecutionView = new StatementLastExecutionView(this.lastExecutionModel);
            this.resultView = new StatementResultView(this.resultModel);
        }

        public execute() {

        }

        public invalidate() {

        }
    }

    /*class Expression {
        draggable: HTMLEDraggableElement;

        constructor() {
        }
    }*/
    
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

    const FieldFragment = (fieldset: HTMLElement, field: FieldModel) => Fragment(
        Element(
            /*html*/`<div>`, {
                children: [
                    ReactiveNode(
                        Element(/*html*/`<label>`),
                        field,
                        (div, property, oldValue, newValue) => {
                            switch (property) {
                                case "label":
                                    if (newValue !== oldValue) {
                                        div.textContent = field.data.label
                                    }
                                break;
                            }
                        }
                    ),
                    DropzoneInputFragment(fieldset, field)
                ]
            }
        )
    );

    const DropzoneInputFragment = (host: Element, field: FieldModel) => Fragment(
        Element(/*html*/`<e-dropzoneinput>`, {
            children: [
                ReactiveNode(
                    Element(/*html*/`<e-dropzone>`, {
                        props: {
                            className: "field__dropzone",
                            slot: "dropzone",
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
                                            let otherDropzone = host.querySelector(`e-dropzone[name=${constraint.other}]`) as HTMLEDropzoneElement;
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
                    field,
                    (dropzone, property, oldValue, newValue) => {
                        switch (property) {
                            case "name":
                                if (newValue !== oldValue) {
                                    dropzone.name = newValue;
                                }
                            break;
                            case "type":
                                if (newValue !== oldValue) {
                                    dropzone.placeholder = newValue;
                                    dropzone.type = newValue;
                                }
                            break;
                        }
                    }
                ),
                Element(/*html*/`<input>`, {
                    props: {
                        className: "field__input",
                        slot: "input"
                    }
                })
            ]
        })
    );
    
    class StatementFieldsetView extends ViewBase<FieldsetModel, HTMLFieldSetElement> {

        constructor(model: FieldsetModel) {
            super(model);
        }

        public render() {
            return Element(/*html*/`<fieldset>`, {
                props: {
                    className: "statement-fieldset"
                },
                children: ReactiveChildNodes(
                    this.model.fields,
                    (item) => FieldFragment(this.element, item)
                )
            });
        }
    }

    class StatementLastExecutionView extends ViewBase<StatementLastExecutionModel, HTMLDivElement> {

        constructor(model: StatementLastExecutionModel) {
            super(model);
        }

        public render() {
            return Element(/*html*/`<div>`, {
                children: [
                    ReactiveNode(
                        document.createTextNode(`Last execution date : ${this.model.data.datetime}`),
                        this.model,
                        (node, property, oldValue, newValue) => {
                            if (property === "datetime") {
                                node.textContent = `Last execution date : ${newValue}`;
                            }
                        }
                    )
                ]
            });
        }
    }

    class StatementResultView extends ViewBase<StatementResultModel, HTMLEDragzoneElement> {

        constructor(model: StatementResultModel) {
            super(model);
        }

        public render() {
            return Element(/*html*/`<e-dragzone>`, {
                children: ReactiveChildNodes(
                    this.model.columns,
                    (item) => Element(/*html*/`<e-draggable>`, {
                        props: {
                            textContent: item.data.name
                        }
                    })
                )
            });
        }
    }
    
    class ExpressionDraggableView extends ViewBase<FieldsetModel, HTMLEDraggableElement> {

        constructor(model: FieldsetModel) {
            super(model);
        }

        public render() {
            return ReactiveNode(
                Element(/*html*/`<e-draggable>`, {
                    children: parseStringTemplate(
                        this.model.data.label,
                        this.model.fields.items.reduce(
                            (obj: any, item: FieldModel) => ({
                                ...obj,
                                [item.data.name]: DropzoneInputFragment(this.element, item)
                            }), {}
                        )
                    ).childNodes
                }),
                this.model,
                (draggable, property, oldValue, newValue) => {
                    switch (property) {
                        case "label":
                            if (newValue !== oldValue) {
                                setElementChildren(draggable, parseStringTemplate(
                                    this.model.data.label,
                                    this.model.fields.items.reduce(
                                        (obj: any, item: FieldModel) => ({
                                            ...obj,
                                            [item.data.name]: DropzoneInputFragment(this.element, item)
                                        }), {}
                                    )
                                ).childNodes);
                            }
                            break;
                    }
                }
            );
        }
    }

    const view = new StatementFieldsetView(fieldset);
    let extractButton = document.getElementById("extract-button");
    (window as any)["view"] = view;
    (window as any)["fieldset"] = fieldset;
    if (extractButton) {
        extractButton.after(view.element);
    }
    //let fieldsetView = new StatementFieldsetView(plusOperatorFieldset);
    //let draggable = HTML(/*html*/`<e-draggable>`, {children: [fieldsetView]});

    /*
        extractButton.after(fieldsetView);
    }

    (window as any)["fieldset"] = fieldset;*/
}