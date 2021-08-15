import "engine/editor/elements/lib/containers/duplicable/Duplicable";
import "engine/editor/elements/lib/containers/menus/Menu";
import "engine/editor/elements/lib/containers/menus/MenuBar";
import "engine/editor/elements/lib/containers/menus/MenuItem";
import "engine/editor/elements/lib/containers/menus/MenuItemGroup";
import "engine/editor/elements/lib/containers/tabs/Tab";
import { HTMLETabElement } from "engine/editor/elements/lib/containers/tabs/Tab";
import "engine/editor/elements/lib/containers/tabs/TabList";
import "engine/editor/elements/lib/containers/tabs/TabPanel";
import "engine/editor/elements/lib/controls/draggable/Draggable";
import "engine/editor/elements/lib/controls/draggable/Dragzone";
import "engine/editor/elements/lib/controls/draggable/Dropzone";
import "engine/editor/elements/lib/utils/Import";


import "engine/editor/elements/lib/controls/breadcrumb/BreadcrumbItem"
import "engine/editor/elements/lib/controls/breadcrumb/BreadcrumbTrail"

import { DataChangeEvent, HTMLEDropzoneElement } from "engine/editor/elements/lib/controls/draggable/Dropzone";
import { StructuredFormData } from "engine/editor/elements/forms/StructuredFormData";
import { HTMLElementConstructor, HTMLElementInit } from "engine/editor/elements/HTMLElement";
import { TestFunction } from "engine/core/rendering/webgl/WebGLConstants";
import { BaseListModel, BaseModel, ListModel, Model, ModelData, ModelDataChangeEvent } from "engine/editor/models/Model";
import { forAllHierarchyNodes } from "engine/editor/elements/Snippets";
import { EventDispatcher } from "engine/libs/patterns/messaging/events/EventDispatcher";

const body = /*template*/`
    <link rel="stylesheet" href="../css/mockup.css"/>
    <div id="root" class="flex-rows">
        <!--<header class="flex-cols flex-none padded">
            <e-menubar tabindex="0">
                <e-menuitem name="file-menu-item" type="menu" label="File" tabindex="-1" aria-label="File">
                    <e-menu slot="menu" tabindex="-1">
                            <e-menuitem name="canvas-play-item" type="button" label="Import a config..."
                                tabindex="-1" aria-label="Import a config..."></e-menuitem>
                    </e-menu>
                </e-menuitem>
            </e-menubar>
        </header>-->
        <main class="flex-cols flex-auto padded">
            <div id="tabs-col" class="col flex-none">
                <e-tablist id="tablist">
                    <e-tab name="extract" controls="extract-panel" title="Extract" active></e-tab>
                    <e-tab name="transform" controls="transform-panel" title="Transform"></e-tab>
                    <e-tab name="export" controls="export-panel" title="Export"></e-tab>
                </e-tablist>
            </div>
            <div id="data-col" class="col flex-none padded borded">
                <details id="flow-details" open>
                    <summary>Flow</summary>
                    <details id="flow-details" class="indented" open>
                        <summary>Extraction</summary>
                        <a href="#">Extractor[0]</a>[X]
                    </details>
                </details>
                <details id="datasets-details" open>
                    <summary>Datasets</summary>
                </details>
                <details open>
                    <summary>Constants</summary>
                    <div class="details-content">
                        <e-dragzone id="constants-dragzone">
                            <e-draggable data-node-signature="const" type="date"><input type="date" name="const"/></e-draggable>
                            <e-draggable data-node-signature="const" type="datetime"><input type="datetime-local" name="const"/></e-draggable>
                            <e-draggable data-node-signature="const" type="string"><input type="text" name="const" placeholder="string"/></e-draggable>
                            <e-draggable data-node-signature="const" type="number"><input type="number" name="const" placeholder="number"/></e-draggable>
                            <e-draggable data-node-signature="const" type="bool"><input type="text" name="const" value="True" readonly/></e-draggable>
                            <e-draggable data-node-signature="const" type="bool"><input type="text" name="const" value="False" readonly/></e-draggable>
                        </e-dragzone>
                    </div>
                </details>
                <details open>
                    <summary>Metrics</summary>
                    <e-dragzone id="metrics-dragzone">
                        <e-draggable tabindex="-1"><fieldset data-signature="max_function">max(<e-dropzone placeholder="col"></e-dropzone>)</fieldset></e-draggable>
                        <e-draggable tabindex="-1">notna(<e-dropzone placeholder="col"></e-dropzone>)</e-draggable>
                    </e-dragzone>
                </details>
                <details open>
                    <summary>Operators</summary>
                    <e-dragzone id="operators-dragzone">
                        <e-draggable tabindex="-1">(<e-dropzone placeholder="expr"></e-dropzone>)</e-draggable>
                    </e-dragzone>
                    <details class="indented" open>
                        <summary>boolean</summary>
                        <e-dragzone id="boolean-operators-dragzone">
                            <e-draggable tabindex="-1"><e-dropzone placeholder="left"></e-dropzone>&nbsp;and&nbsp;<e-dropzone placeholder="right"></e-dropzone></e-draggable>
                            <e-draggable tabindex="-1"><e-dropzone placeholder="left"></e-dropzone>&nbsp;or&nbsp;<e-dropzone placeholder="right"></e-dropzone></e-draggable>
                            <e-draggable tabindex="-1"><e-dropzone placeholder="left"></e-dropzone>&nbsp;<&nbsp;<e-dropzone placeholder="right"></e-dropzone></e-draggable>
                            <e-draggable tabindex="-1"><e-dropzone placeholder="left"></e-dropzone>&nbsp;>&nbsp;<e-dropzone placeholder="right"></e-dropzone></e-draggable>
                            <e-draggable tabindex="-1"><e-dropzone placeholder="left"></e-dropzone>&nbsp;==&nbsp;<e-dropzone placeholder="right"></e-dropzone></e-draggable>
                            <e-draggable tabindex="-1"><e-dropzone placeholder="left"></e-dropzone>&nbsp;!==&nbsp;<e-dropzone placeholder="right"></e-dropzone></e-draggable>
                        </e-dragzone>
                    </details>
                    <details class="indented" open>
                    <summary>numeric</summary>
                        <e-dragzone id="numeric-operators-dragzone">
                            <e-draggable tabindex="-1"><e-dropzone placeholder="left"></e-dropzone>&nbsp;+&nbsp;<e-dropzone placeholder="right"></e-dropzone></e-draggable>
                            <e-draggable tabindex="-1"><e-dropzone placeholder="left"></e-dropzone>&nbsp;-&nbsp;<e-dropzone placeholder="right"></e-dropzone></e-draggable>
                            <e-draggable tabindex="-1"><e-dropzone placeholder="left"></e-dropzone>&nbsp;/&nbsp;<e-dropzone placeholder="right"></e-dropzone></e-draggable>
                            <e-draggable tabindex="-1"><e-dropzone placeholder="left"></e-dropzone>&nbsp;*&nbsp;<e-dropzone placeholder="right"></e-dropzone></e-draggable>
                        </e-dragzone>
                    </details>
                </details>
                <details open>
                    <summary>Functions</summary>
                    <details class="indented" open>
                        <summary>string</summary>
                        <e-dragzone id="string-functions-dragzone">
                            <e-draggable class="draggable-dropzone" tabindex="-1">concat(<e-dropzone placeholder="left"></e-dropzone>, <e-dropzone placeholder="right"></e-dropzone>)</e-draggable>
                        </e-dragzone>
                    </details>
                    <details class="indented" open>
                        <summary>generator</summary>
                        <e-dragzone id="generator-functions-dragzone">
                            <e-draggable class="draggable-dropzone" tabindex="-1">range(<e-dropzone placeholder="number"></e-dropzone>)</e-draggable>
                        </e-dragzone>
                    </details>
                </details>
            </div>
            <div id="panels-col" class="col flex-auto padded-horizontal">
                <e-tabpanel id="extract-panel">
                    <!--<e-breadcrumbtrail class="padded borded margin-bottom">
                        <e-breadcrumbitem>Item 0</e-breadcrumbitem>
                        <e-breadcrumbitem>Item 1</e-breadcrumbitem>
                    </e-breadcrumbtrail>-->
                    <form id="extract-form">
                    <!--<fieldset>
                        <details open>
                            <summary>Statement
                                <select class="doc-select" name="signature" data-class="toggler-select">
                                    <option value="sequence" selected>Sequence</option>
                                    <option value="loop">Loop</option>
                                    <option value="condition">Condition</option>
                                </select>
                            </summary>
                            <fieldset name="sequence" class="grid-fieldset margin-top" hidden>
                                <label for="user">Sequence size</label>
                                <input type="number" name="userid" required ondrop="event.preventDefault()/">
                                <label for="user">Statement [0]</label>
                                <input type="number" name="userid" required ondrop="event.preventDefault()/">
                            </fieldset>-->
                            <fieldset name="loop" class="grid-fieldset margin-top" hidden>
                                <label for="filepath">Filepath</label>
                                <input name="filepath" type="file"/>
                                <label for="as">As</label>
                                <input type="text" name="as" required ondrop="event.preventDefault()"/>
                            </fieldset>
                            <fieldset>
                                <details open>
                                    <summary>
                                        Extractor 
                                        <select class="doc-select" name="signature" data-class="toggler-select">
                                            <option value="netezza" selected>Netezza</option>
                                            <option value="csv">CSV</option>
                                        </select>
                                    </summary>
                                    <fieldset name="netezza" class="grid-fieldset margin-top" hidden>
                                        <label for="user">User</label>
                                        <input type="text" name="userid" required ondrop="event.preventDefault()/">
                                        <label for="password">Password</label>
                                        <input type="password" name="password" required ondrop="event.preventDefault()"/>
                                        <label for="database">Database</label>
                                        <input type="text" name="database" required ondrop="event.preventDefault()"/>
                                        <label for="query">Query</label>
                                        <textarea name="query"></textarea>
                                        <label for="as">As</label>
                                        <input type="text" name="as" required ondrop="event.preventDefault()"/>
                                    </fieldset>
                                    <fieldset name="csv" class="grid-fieldset margin-top" hidden>
                                        <label for="filepath">Filepath</label>
                                        <input name="filepath" type="file"/>
                                        <label for="as">As</label>
                                        <input type="text" name="as" required ondrop="event.preventDefault()"/>
                                    </fieldset>
                                </details>
                                last execution: never<br/>
                                last execution status: none<br/>
                                <button id="extract-button" type="button">Extract</button>
                            </fieldset>
                        <!--</details>
                    </fieldset>-->
                </form>
                </e-tabpanel>
                <e-tabpanel id="transform-panel">
                    <form id="transform-form">
                        <fieldset>
                            <details open>
                                <summary>Transformer
                                    <select class="doc-select" data-class="toggler-select">
                                        <option value="replace" selected>Replace</option>
                                        <option value="merge">Merge</option>
                                        <option value="median_imputer">Median imputer</option>
                                    </select>
                                </summary>
                                <fieldset name="merge" class="grid-fieldset indented margin-top">
                                    <label for="left">Left</label>
                                    <e-dropzone></e-dropzone>
                                    <label for="right">Right</label>
                                    <e-dropzone></e-dropzone>
                                    <label for="on">On</label>
                                    <e-dropzone></e-dropzone>
                                    <label for="how">How</label>
                                    <select>
                                        <option value="left" selected>left</option>
                                        <option value="right">right</option>
                                    </select>
                                    <label for="outputDataframe">Output dataframe</label>
                                    <input type="text" name="outputdataframe" required ondrop="event.preventDefault()"></input>
                                </fieldset>
                                <fieldset name="replace" class="grid-fieldset indented margin-top">
                                    <label for="column">Column</label>
                                    <e-dropzone></e-dropzone>
                                    <label for="value">Value</label>
                                    <e-dropzone></e-dropzone>
                                    <label for="expression">Where</label>
                                    <e-dropzone placeholder="boolean"></e-dropzone>
                                </fieldset>
                                <fieldset name="median_imputer" class="grid-fieldset indented margin-top">
                                    <label for="column">Column(s)</label>
                                    <e-dropzone multiple></e-dropzone>
                                </fieldset>
                            </details>
                            <div class="indented"><button id="transform-button" type="button">Transform</button></div>
                        </fieldset>
                    </form>
                </e-tabpanel>
                <e-tabpanel id="export-panel">
                    <form id="export-form">
                    <fieldset>
                        <details open>
                            <summary>Exporter 
                                <select class="doc-select" data-class="toggler-select">
                                    <option value="csv">CSV</option>
                                </select>
                            </summary>
                            <fieldset name="csv" class="grid-fieldset indented margin-top" hidden>
                                <label for="filename">Filename</label>
                                <input type="text" name="filename" ondrop="event.preventDefault()" required></input>
                                <label for="columns">Columns</label>
                                <e-dropzone multiple id="columns" name="columns"></e-dropzone>
                            </fieldset>
                        </details>
                        <div class="indented"><button id="export-button" type="button">Export</button></div>
                    </fieldset>
                </form>
                </e-tab-panel>
            </div>
            <div id="doc-col" class="col flex-none padded borded"></div>
        </main>
        <!--<footer class="flex-cols flex-none padded"></footer>-->
    </div>
`;

declare global {
    var marked: (src: string) => string;
 }

export async function mockup() {
    const bodyTemplate = document.createElement("template");
    bodyTemplate.innerHTML = body;
    document.body.appendChild(bodyTemplate.content);

    const extractForm = document.querySelector<HTMLFormElement>("form#extract-form")
    
    const extractTab = document.querySelector<HTMLETabElement>("e-tab[name='extract']");
    const transformTab = document.querySelector<HTMLETabElement>("e-tab[name='transform']");
    const exportTab = document.querySelector<HTMLETabElement>("e-tab[name='export']");

    const extractButton = document.querySelector<HTMLButtonElement>("button#extract-button");
    const transformButton = document.querySelector<HTMLButtonElement>("button#transform-button");
    const exportButton = document.querySelector<HTMLButtonElement>("button#export-button");


    /*if (extractForm) {
        const jsonData = new JSONFormData(extractForm);
        console.log(jsonData.getData());
    }

    (window as any)["FormDataObject"] = FormDataObject;*/

    let extractorsFieldsets = document.getElementById("extractors-fieldsets");
    let netezzaExtractorTemplate = document.createElement("template");
    netezzaExtractorTemplate.innerHTML = `
        <fieldset data-signature="sql-extractor">
            <fieldset name="left">
                <input type="datetime-local" name="date" required ondrop="event.preventDefault()"/>
                <label for="user">my radio 1</label>
                <input type="radio" required ondrop="event.preventDefault()"/>
                <label for="user">my radio 2</label>
                <input type="radio" name="radio-2" required ondrop="event.preventDefault()"/>
            <fieldset>
            <label for="user">User</label>
            <input type="text" name="userid" required value="Net" ondrop="event.preventDefault()"/>
            <label for="password">Password</label>
            <input type="password" name="password" required ondrop="event.preventDefault()"/>
            <label for="database">Database</label>
            <input type="text" name="database" required ondrop="event.preventDefault()"/>
            <label for="query">Query</label>
            <textarea name="query"></textarea>
        </fieldset>
    `;
    
    if (extractorsFieldsets) {
        extractorsFieldsets.appendChild(netezzaExtractorTemplate.content);
    }

    //(window as any)["StructuredFormData"] = StructuredFormData;

    function kebabize(str: string) {
        return str &&
            str.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
            ?.map(x => x.toLowerCase())
            .join('-') || "";
    }

    function camelize(str: string) {
        return str.toLowerCase()
            .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
    }

    function generateDataset(name: string, columns: string[]) {
        const datasetsDetails = document.querySelector<HTMLElement>("#datasets-details");
        if (datasetsDetails) {
            const dataset1Summary = document.createElement("summary");
            dataset1Summary.textContent = `${name}`;
            const dataset1Details = document.createElement("details");
            dataset1Details.classList.add("indented");
            dataset1Details.open = true;
            const dataset1Dragzone = document.createElement("e-dragzone");
            dataset1Dragzone.id = `dataset-${kebabize(name)}-dragzone`;
            const dataset1Draggable = document.createElement("e-draggable");
            dataset1Draggable.textContent = `${name}`;
            dataset1Dragzone.append(
                dataset1Draggable,
                ...columns.map((col) => {
                    let draggable = document.createElement("e-draggable");
                    draggable.textContent = `Col ${name}${col}`;
                    return draggable;
                })
            );
            dataset1Details.append(
                dataset1Summary, dataset1Dragzone
            );
            datasetsDetails.append(dataset1Details);
        }
    }

    const docs = new Map();
    docs.set(
        "netezza",
        "<b>Netezza</b> Extractor<br/>\
        <p>Extract data from a Netezza database.</p>\
        <p class='params'><span class='param-name'>User:</span><span>database user</span>\
        <span class='param-name'>Password:</span><span>user password</span>\
        <span class='param-name'>Database:</span><span>database name</span></p>"
    );
    docs.set(
        "csv",
        "<b>CSV</b> Extractor<br/>\
        <p>Extract data from a .csv file.</p>\
        <p class='params'><span class='param-name'>Filepath:</span><span>filepath to the .csv file</span>"
    );
    docs.set(
        "replace",
        "<b>Replace</b> Transformer<br/>\
        <p>Replace by a given value where a condition is met.</p>\
        <p class='params'><span class='param-name'>Columns:</span><span>the columns where the transformer will be applied</span>\
        <p class='params'><span class='param-name'>Value:</span><span>the value to use as a replacement</span>\
        <p class='params'><span class='param-name'>Where:</span><span>the condition to meet</span>"
    );

    function setDocstringText(name: string) {
        if (docCol) {
            let docstring = docs.get(name);
            docCol.innerHTML = docstring || "";
        }
    }

    const docCol = document.getElementById("doc-col");
    const docsSelects = Array.from(document.querySelectorAll<HTMLSelectElement>("select.doc-select"));
    if (docsSelects.length > 0) {
        setDocstringText(docsSelects[0].value);
        docsSelects.forEach((select) => {
            select.addEventListener("change", () => {
                setDocstringText(select.value);
            });
        });
    }

    if (extractButton) {
        extractButton.addEventListener("click", () => {
            if (transformTab) {
                transformTab.active = true;
                generateDataset("D1", [
                    "A", "B", "C", "D", "E", "F",
                ]);
                generateDataset("D2", [
                    "A", "G", "H", "I", "J"
                ]);
            }
        });
    }

    if (transformButton) {
        transformButton.addEventListener("click", () => {
            if (exportTab) {
                exportTab.active = true;
                generateDataset("Merged", [
                    "M1 (M)", "M2 (M)"
                ]);
            }
        });
    }

    const info = {
        type: "df",
        name: "df"
    };

    abstract class Directive {
        node: Node;
        public abstract execute(): void;
    }

    interface ReactDirective<M extends Model> {
        model: M;
        react: (model: M, event?: ModelDataChangeEvent) => string | Node | TemplateResult;
        result: Node;
        execute(event?: ModelDataChangeEvent): void;
        initialize(): void;
        finalize(): void;
    }

    class BaseReactDirective<M extends Model> {
        model: M;
        react: (model: M, event?: ModelDataChangeEvent) => string | Node | TemplateResult;
        result: Node;
        private _callback: (event: ModelDataChangeEvent) => void;

        constructor(model: M, react: (model: M, event?: ModelDataChangeEvent) => string | Node | TemplateResult) {
            this.model = model;
            this.react = react;
            this.result = document.createTextNode("");
            this._callback = (event: ModelDataChangeEvent) => {
                this.execute(event);
            };
        }

        public execute(event?: ModelDataChangeEvent): void {
            let result: string | Node | TemplateResult = this.react(this.model, event);
            let nodeResult = (typeof result === "string") ? document.createTextNode(result) : result;
            if (typeof nodeResult === "object" && "directives" in nodeResult) {
                (this.result as ChildNode).replaceWith(nodeResult.fragment);
            }
            else {
                (this.result as ChildNode).replaceWith(nodeResult);
            }
            this.result = nodeResult as ChildNode;
        }

        public initialize(): void {
            this.model.addEventListener("datachange", this._callback);
        }

        public finalize(): void {
            this.model.removeEventListener("datachange", this._callback);
        }
    }

    function react<M extends Model>(model: M, react: (model: M, event?: ModelDataChangeEvent) => string | Node | TemplateResult): ReactDirective<M> {
        return new BaseReactDirective(model, react);
    }

    function template(parts: TemplateStringsArray, ...slots: (string | Node | Directive | TemplateResult)[]): TemplateResult {
        let toParse = "";
        let timestamp = new Date().getTime();
        parts.forEach((part, index) => {
            if (index < slots.length) {
                toParse = `${toParse}${part}<div id="${timestamp}-${index}"></div>`;
            }
            else {
                toParse = `${toParse}${part}`;
            }
        });
        let fragment = HTMLElementConstructor("template", {props: {innerHTML: toParse}}).content;
        let directives: Directive[] = [];
        slots.forEach((slot, index) => {
            let slotPlaceholder = fragment.getElementById(`${timestamp}-${index}`);
            if (slotPlaceholder) {
                if (slot instanceof Directive) {
                    directives.push(slot);
                    slot.execute();
                    slotPlaceholder.replaceWith(slot.node);
                }
                else if (typeof slot === "object" && "directives" in slot) {
                    slotPlaceholder.replaceWith(slot.fragment);
                }
                else {
                    slotPlaceholder.replaceWith(slot);
                }
            }
        });
        return {
            // TODO: return everything needed
            fragment: fragment,
            directives: directives
        };
    }

    
    interface TemplateResult {
        fragment: DocumentFragment;
        directives: Directive[];
    }

    interface Model extends EventDispatcher {

    }
    
    class FieldModel extends BaseModel<{type: string, label: number}> {
        constructor(type: string, label: number) {
            super({type, label});
        }
    }

    class FieldsetModel extends BaseListModel<FieldModel> {
        constructor(fields: FieldModel[]) {
            super(fields);
        }
    }

    
    const onField = new FieldModel("str", 1);
    const fieldset = new FieldsetModel([onField])


    let fieldReactCallback = (model: FieldModel, event?: ModelDataChangeEvent) => {
        return template`<div></div>`;
    }

    let frag = template/*html*/`<div>${react(onField, fieldReactCallback)}${HTMLElementConstructor("label", {props: {textContent: "Label"}, listeners: {click: [() => {alert();}]}})}</div>`;
    
    /*function view(parts: TemplateStringsArray, ...slots: any[]): void {
        const parser = new DOMParser();
        let src = parts.flatMap((part, index) => {
            if (index < expressions.length) {
                if (expressions[index] instanceof Directive) {
                    return [part, expressions[index].constructor.name];
                }
            }
            else {
                return part;
            }
        });

        console.log(src);

        const dom = parser.parseFromString(parts.join("\"\""), "text/html");
        forAllHierarchyNodes(html.body, (child, parent) => {
            if (child.nodeType === Node.COMMENT_NODE && child.nodeValue == "") {
                let index = parseInt(child.nodeValue);
                if (expr[index] instanceof Directive) {
                    console.log("previous");
                    console.log(child.previousSibling);
                    console.log("parent");
                    console.log(parent);
                }
            }
        });
        console.log(html.body.innerHTML);
        return 1;
    }*/


    abstract class View<M extends Model<object>> {
        model: M;
        public abstract onModelChange<K extends keyof ModelData<M>>(key: K, oldValue: ModelData<M>[K], newValue: ModelData<M>[K]): void;
    }

    class MyModel extends Model {
        @property()
        item: string;
    }

    class FieldView extends View<FieldModel> {
        model: FieldModel;
        template: HTMLTemplateElement;
        
        @slot()
        items: HTMLElement[];

        @slot()
        label: HTMLElement;

        constructor(model: FieldModel) {
            super();
            this.model = model;
            this.template = template`
                <div>
                    <div>${slot(this.label)}</div>
                    ${slotEach(this.items, (item) =>html`<div>${item}</div>`)}
                </div>`;

            this.label = HTMLElementConstructor("label");
            this.items = [];
        }

        public connectedCallback() {

        }

        public onModelDataChange<K extends keyof ModelData<FieldModel>>(key: K, type: ModelDataChangeType,
            oldValue: ModelData<FieldModel>[K], newValue: ModelData<FieldModel>[K]): void {
            switch (key) {
                case "label":
                    oldValue
            }
            this.items.push(

            )
        }

        // _input replaceChild (dropzone template)

        /*constructor(model: FieldModel) {
            this.model = model;

            this.labelTemplate = (model: FieldModel) => {
                HTMLElementConstructor("button", {props: {textContent: model.lol.toString()}});
            }

            this._dom = partialview`<div>${list(this.model, this._listTemplate)}${choice(this.model, "type", {"input": this._inputTemplate})}</div>`;
        }

        public onModelChange(property: string, oldValue) {
            this.button =  new PartialView(
                model,
                (model: PersonModel) => {
                    `<button>`, {props: {textContent: model.name.toString()}}
                },
                (el: properties: (keyof ModelData<PersonModel>)[], model: PersonModel) => {
                    (typeof data.lol !== "undefined") ? el.textContent = model.name : void 0;
                }
            });
        }*/
    }

    // Class
    // Directive
    // TemplateFunction -> Class / Directives

    let itemViewModel = {
        init: (data: ModelData<MyItemModel>) => {
            let buttonSlot = HTMLElementConstructor(/*html*/"button", {props: {textContent: data.lol.toString()}});
            // partial template
            return partialview/*html*/`<div>${slot("button", buttonSlot)}</div>`;
        },
        react: (slots: PartialViewSlots, data: Partial<ModelData<MyItemModel>>) => {
            (typeof data.lol !== "undefined") ? slots.get("button").textContent = data.lol.toString() : void 0;
        }
    };

    let parentViewModel = {
        init: (data: ModelData<MyParentModel>) => {
            return partialview/*html*/`<div>${list(items, itemViewModel)}</div>`;
        },
        react: (slots: ViewSlots, data: Partial<ModelData<MyItemModel>>) => {
            (typeof data.lol !== "undefined") ? slots.get("button").textContent = data.lol.toString() : void 0;
        }
    };
    
    let myView = partialview/*html*/`<div>${item(parent, parentViewModel)}</div>`;

    class MyView {

    }
    
    console.log(myView);
    const dropzone = document.querySelector<HTMLEDropzoneElement>("e-dropzone#columns");
    if (dropzone) {
        dropzone.addEventListener("datachange", () => {
            if (dropzone.multiple) {
                dropzone.draggables.forEach((draggable, index) => {
                    draggable.dataset.scope = `${dropzone.name}[${index}]`;
                });
            }
        });
    }

    if (exportButton) {
        exportButton.addEventListener("click", () => {
            alert("Tadam!");
            /*let form = document.querySelector("form");
            if (form) {
                let structuredFormData = new StructuredFormData(form).getStructuredFormData();
                let dataBlob = new Blob([JSON.stringify(structuredFormData, null, 4)], {type: "application/json"});

                let donwloadAnchor = document.createElement("a");
                donwloadAnchor.href = URL.createObjectURL(dataBlob);
                donwloadAnchor.download = "config.json";
                donwloadAnchor.click();
            }*/
        });
    }
}