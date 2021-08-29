import "engine/editor/elements/lib/containers/menus/Menu";
import "engine/editor/elements/lib/containers/menus/MenuButton";
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
import "engine/editor/elements/lib/controls/draggable/DropzoneInput";
import "engine/editor/elements/lib/utils/Import";
import "engine/editor/elements/lib/utils/Loader";
import "engine/editor/elements/lib/utils/Sash";

import "engine/editor/elements/lib/containers/treeview/TreeViewList";
import "engine/editor/elements/lib/containers/treeview/TreeViewItem";

import "engine/editor/elements/lib/controls/breadcrumb/BreadcrumbItem"
import "engine/editor/elements/lib/controls/breadcrumb/BreadcrumbTrail"

import { HTMLEDropzoneElement } from "engine/editor/elements/lib/controls/draggable/Dropzone";
import { temp } from "./temp";
import { HTMLEMenuItemElement } from "engine/editor/elements/lib/containers/menus/MenuItem";
import { HotKey, Key, KeyModifier } from "engine/core/input/Input";
import { Editor, EditorBase } from "engine/editor/Editor";


const body = /*template*/`
    <link rel="stylesheet" href="../css/mockup.css"/>
    <div id="root" class="flex-rows">
        <!--<header class="flex-cols flex-none padded">
            <e-menubar tabindex="0">
                <e-menuitem name="file-menu" type="menu" label="File" tabindex="-1" aria-label="File">
                    <e-menu slot="menu" tabindex="-1">
                            <e-menuitem id="file-import-menu-button" name="file-import-menu-button" type="button" label="Import file"
                                tabindex="-1" aria-label="Import file"></e-menuitem>
                            <e-menuitem id="file-export-menu-button" name="file-export-menu-button" type="button" label="Export file"
                            tabindex="-1" aria-label="Export file"></e-menuitem>
                    </e-menu>
                </e-menuitem>
                <e-menuitem name="view-menu" type="menu" label="View" tabindex="-1" aria-label="View">
                    <e-menu slot="menu" tabindex="-1">
                        <e-menuitem name="view-boolean-menuitem" type="checkbox" label="Advanced User"
                        tabindex="-1" aria-label="Advanced User"></e-menuitem>
                        <e-menuitem name="view-layout-menuitem" type="submenu" label="Layout"
                        tabindex="-1" aria-label="Layout">
                            <e-menu slot="menu" name="view-layout-menu">
                                <e-menuitemgroup>
                                    <e-menuitem name="view-layout-standard-menuitem" type="radio" label="Standard"
                                    tabindex="-1" aria-label="Standard" checked></e-menuitem>
                                </e-menuitemgroup>
                            </e-menu>
                        </e-menuitem>
                    </e-menu>
                </e-menuitem>
            </e-menubar>
        </header>-->
        <main class="flex-cols flex-auto padded">
            <div id="tabs-col" class="col flex-none">
                <e-tablist id="tablist">
                    <e-tab name="extract" controls="extract-panel" title="Extract" active tabindex="-1"></e-tab>
                    <e-tab name="transform" controls="transform-panel" title="Transform" tabindex="-1"></e-tab>
                    <e-tab name="export" controls="export-panel" title="Export" tabindex="-1"></e-tab>
                </e-tablist>
            </div>
            <div id="data-col" class="col flex-none padded borded">
                <span>Extraction</span>
                <div id="datasets">
                    <details id="timeline-details" open>
                        <summary>Timeline</summary>
                        <e-treeviewlist tabindex="-1">
                            <e-treeviewitem label="Extract" tabindex="-1">
                                <e-treeviewitem label="[1] CSV Extractor" tabindex="-1"></e-treeviewitem>
                                <e-treeviewitem label="[2] Netezza Extractor" tabindex="-1"></e-treeviewitem>
                            </e-treeviewitem>
                            <e-treeviewitem label="Transform" tabindex="-1">
                                <e-treeviewitem label="[1] Loop" tabindex="-1">
                                    <e-treeviewitem label="[1.1] Replace" tabindex="-1"></e-treeviewitem>
                                    <e-treeviewitem label="[1.2] Merge" tabindex="-1"></e-treeviewitem>
                                </e-treeviewitem>
                            </e-treeviewitem>
                            <e-treeviewitem label="Export" tabindex="-1">
                                <e-treeviewitem label="[1] CSV Exporter" tabindex="-1"></e-treeviewitem>
                            </e-treeviewitem>
                        </e-treeviewlist>
                    </details>
                    <details id="datasets-details" open>
                        <summary>Datasets</summary>
                    </details>
                </div>
                <div id="expressions">
                    <details>
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
                    <details>
                        <summary>Metrics</summary>
                        <e-dragzone id="metrics-dragzone">
                            <e-draggable tabindex="-1"><fieldset data-signature="max_function">max(<e-dropzone placeholder="col"></e-dropzone>)</fieldset></e-draggable>
                            <e-draggable tabindex="-1">notna(<e-dropzone placeholder="col"></e-dropzone>)</e-draggable>
                        </e-dragzone>
                    </details>
                    <details>
                        <summary>Operators</summary>
                        <e-dragzone id="operators-dragzone">
                            <e-draggable tabindex="-1">(<e-dropzone placeholder="expr"></e-dropzone>)</e-draggable>
                        </e-dragzone>
                        <details class="indented">
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
                        <details class="indented">
                        <summary>numeric</summary>
                            <e-dragzone id="numeric-operators-dragzone">
                                <e-draggable tabindex="-1"><e-dropzone placeholder="left"></e-dropzone>&nbsp;+&nbsp;<e-dropzone placeholder="right"></e-dropzone></e-draggable>
                                <e-draggable tabindex="-1"><e-dropzone placeholder="left"></e-dropzone>&nbsp;-&nbsp;<e-dropzone placeholder="right"></e-dropzone></e-draggable>
                                <e-draggable tabindex="-1"><e-dropzone placeholder="left"></e-dropzone>&nbsp;/&nbsp;<e-dropzone placeholder="right"></e-dropzone></e-draggable>
                                <e-draggable tabindex="-1"><e-dropzone placeholder="left"></e-dropzone>&nbsp;*&nbsp;<e-dropzone placeholder="right"></e-dropzone></e-draggable>
                            </e-dragzone>
                        </details>
                    </details>
                    <details>
                        <summary>Functions</summary>
                        <details class="indented">
                            <summary>string</summary>
                            <e-dragzone id="string-functions-dragzone">
                                <e-draggable class="draggable-dropzone" tabindex="-1">concat(<e-dropzone placeholder="left"></e-dropzone>, <e-dropzone placeholder="right"></e-dropzone>)</e-draggable>
                            </e-dragzone>
                        </details>
                        <details class="indented">
                            <summary>generator</summary>
                            <e-dragzone id="generator-functions-dragzone">
                                <e-draggable class="draggable-dropzone" tabindex="-1">range(<e-dropzone placeholder="number"></e-dropzone>)</e-draggable>
                            </e-dragzone>
                        </details>
                    </details>
                </div>
            </div>
            <e-sash controls="data-col" data-view></e-sash>
            <div id="panels-col" class="col flex-auto padded-horizontal">
                <!--<e-breadcrumbtrail class="margin-bottom">
                    <e-breadcrumbitem>Item 0</e-breadcrumbitem>
                    <e-breadcrumbitem>Item 1</e-breadcrumbitem>
                </e-breadcrumbtrail>-->
                <e-tabpanel id="extract-panel">
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
                            <!--<fieldset name="loop" class="grid-fieldset margin-top" hidden>
                                <label for="filepath">Filepath</label>
                                <input name="filepath" type="file"/>
                                <label for="as">As</label>
                                <input type="text" name="as" required ondrop="event.preventDefault()"/>
                            </fieldset>-->
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
                                        <input type="text" name="userid" required ondrop="event.preventDefault()"/>
                                        <label for="password">Password</label>
                                        <input type="password" name="password" required ondrop="event.preventDefault()"/>
                                        <label for="database">Database</label>
                                        <input type="text" name="database" required ondrop="event.preventDefault()"/>
                                        <label for="query">Query</label>
                                        <textarea name="query" required></textarea>
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
            <e-sash id="doc-col-sash" controls="doc-col"></e-sash>
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

    const editor = new EditorBase();
    
    editor.registerCommand("import", {
        exec(): void {
          alert("Import");
        },
        context: 'default'
    });

    editor.registerCommand("export", {
        exec(): void {
          alert("Export");
        },
        context: 'default'
    });

    editor.setup();
    
    let importMenuItem = document.getElementById("file-import-menu-button") as HTMLEMenuItemElement;
    if (importMenuItem) {
        importMenuItem.command = "import";
        importMenuItem.hotkey = new HotKey(Key.I, KeyModifier.Control, KeyModifier.Alt);
    }

    let exportMenuItem = document.getElementById("file-export-menu-button") as HTMLEMenuItemElement;
    if (exportMenuItem) {
        exportMenuItem.command = "export";
        exportMenuItem.hotkey = new HotKey(Key.J, KeyModifier.Control, KeyModifier.Alt);
    }

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