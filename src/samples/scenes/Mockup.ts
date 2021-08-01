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
import { HTMLEDraggableElement } from "engine/editor/elements/lib/controls/draggable/Draggable";
import "engine/editor/elements/lib/controls/draggable/Dragzone";
import "engine/editor/elements/lib/controls/draggable/Dropzone";
import "engine/editor/elements/lib/utils/Import";


import "engine/editor/elements/lib/controls/breadcrumb/BreadcrumbItem"
import "engine/editor/elements/lib/controls/breadcrumb/BreadcrumbTrail"

import { StructuredFormData } from "engine/editor/objects/StructuredFormData";
import { HTMLDraggableInputTemplate } from "engine/editor/templates/other/DraggableInputTemplate";
import { HTMLEDragzoneElement } from "engine/editor/elements/lib/controls/draggable/Dragzone";
import { DataChangeEvent, HTMLEDropzoneElement } from "engine/editor/elements/lib/controls/draggable/Dropzone";
import { FormDataObject } from "engine/editor/elements/forms/FormDataObject";

const body = /*template*/`
    <link rel="stylesheet" href="../css/mockup.css"/>
    <div id="root" class="flex-rows">
        <header class="flex-cols flex-none padded">
            <!--<e-menubar tabindex="0">
                <e-menuitem name="file-menu-item" type="menu" label="File" tabindex="-1" aria-label="File">
                    <e-menu slot="menu" tabindex="-1">
                            <e-menuitem name="canvas-play-item" type="button" label="Import a config..."
                                tabindex="-1" aria-label="Import a config..."></e-menuitem>
                    </e-menu>
                </e-menuitem>
            </e-menubar>-->
        </header>
        <main class="flex-cols flex-auto padded">
            <div id="tabs-col" class="col flex-none">
                <e-tablist id="tablist">
                    <e-tab name="extract" controls="extract-panel" title="Extract" active></e-tab>
                    <e-tab name="transform" controls="transform-panel" title="Transform"></e-tab>
                    <e-tab name="export" controls="export-panel" title="Export"></e-tab>
                </e-tablist>
            </div>
            <div id="data-col" class="col flex-none padded borded">
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
                        <e-draggable class="draggable-dropzone" tabindex="-1">max(<e-dropzone placeholder="col"></e-dropzone>)</e-draggable>
                        <e-draggable class="draggable-dropzone" tabindex="-1">notna(<e-dropzone placeholder="col"></e-dropzone>)</e-draggable>
                    </e-dragzone>
                </details>
                <details open>
                    <summary>Functions</summary>
                    <details class="indented" open>
                        <summary>string</summary>
                        <e-dragzone id="string-functions-dragzone">
                            <e-draggable class="draggable-dropzone" tabindex="-1">concat(<e-dropzone placeholder="str0"></e-dropzone>,<button type="button">+</button>)</e-draggable>
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
                        <fieldset>
                            <details open>
                                <summary>Extractor 
                                    <select class="doc-select" name="signature" data-class="toggler-select">
                                        <option value="netezza" selected>Netezza</option>
                                        <option value="csv">CSV</option>
                                    </select>
                                </summary>
                                <div id="extractors-fieldsets">

                                </div>
                                <!--<fieldset name="netezza" class="grid-fieldset margin-top" hidden>
                                    <label for="user">User</label>
                                    <input type="text" name="userid" required value="Net" ondrop="event.preventDefault()/">
                                    <label for="password">Password</label>
                                    <input type="password" name="password" required ondrop="event.preventDefault()"/>
                                    <label for="database">Database</label>
                                    <input type="text" name="database" required ondrop="event.preventDefault()"/>
                                    <label for="query">Query</label>
                                    <textarea name="query"></textarea>
                                </fieldset>-->
                                <!--<fieldset name="csv" class="grid-fieldset margin-top" hidden>
                                    <label for="filepath">Filepath</label>
                                    <input name="filepath" type="file"/>
                                </fieldset>-->
                            </details>
                            <div class="indented"><button id="extract-button" type="button">Extract</button></div>
                        </fieldset>
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
                                    <div>
                                        <div class="flex-field">
                                            <fieldset name="left">
                                                <e-dropzone></e-dropzone>
                                            </fieldset>
                                            <select>
                                                <option selected>==</option>
                                                <option>!=</option>
                                                <option>></option>
                                                <option><</option>
                                                <option>>=</option>
                                                <option><=</option>
                                            </select>
                                            <fieldset name="right">
                                                <e-dropzone></e-dropzone>
                                            </fieldset>
                                            <!--<button class="flex-none" type="button">X</button>-->
                                        </div>
                                        <!--<button type="button">AND</button><button type="button">OR</button>-->
                                    </div>
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
                                <e-dropzone multiple id="columns"></e-dropzone>
                            </fieldset>
                        </details>
                        <div class="indented"><button id="export-button" type="button">Export</button></div>
                    </fieldset>
                </form>
                </e-tab-panel>
            </div>
            <div id="doc-col" class="col flex-none padded borded"></div>
        </main>
        <footer class="flex-cols flex-none padded"></footer>
    </div>
`;

declare global {
    var marked: (src: string) => string;
 }

export async function mockup() {
    const bodyTemplate = document.createElement("template");
    bodyTemplate.innerHTML = body;
    document.body.insertBefore(bodyTemplate.content, document.body.firstChild);

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
    }*/

    (window as any)["FormDataObject"] = FormDataObject;

    let extractorsFieldsets = document.getElementById("extractors-fieldsets");
    let netezzaExtractorTemplate = document.createElement("template");
    netezzaExtractorTemplate.innerHTML = /*template*/`
        <fieldset>
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

    let booleanExpressionTemplate = document.createElement("template");
    booleanExpressionTemplate.innerHTML = /*template*/`
        <label for="expression">Where</label>
        <div>
            <div class="flex-field">
                <fieldset name="left">
                    <e-dropzone></e-dropzone>
                </fieldset>
                <select name="signature">
                    <option selected value="equals_operator">==</option>
                    <option value="not_equals_operator">!=</option>
                    <option value="greater_than_operator">></option>
                    <option value="lower_to_operator"><</option>
                </select>
                <fieldset name="right">
                    <e-dropzone></e-dropzone>
                </fieldset>
                <!--<button class="flex-none" type="button">X</button>-->
            </div>
        </div>
    `;

    const dropzone = document.querySelector<HTMLEDropzoneElement>("e-dropzone#columns");
    if (dropzone) {
        dropzone.addEventListener("datachange", (event: DataChangeEvent) => {
            const fieldsets = dropzone.querySelectorAll(":scope > e-draggable > fieldset");
            console.log(fieldsets);
        });
    }


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
                    "A", "B", "C", "D", "E", "F"
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
                    "M1", "M2"
                ]);
            }
        });
    }

    const info = {
        type: "df",
        name: "df"
    };

    /*const dropzone = document.querySelector<HTMLEDropzoneElement>("e-dropzone#columns");
    if (dropzone) {
        dropzone.droptest = (draggables: HTMLEDraggableElement[]) => {
            let success = false;
            try {
                if (draggables.length > 0) {
                    success = (draggables[0].type == "df");
                }
            }
            finally {
                if (!success) {
                    throw new Error("Please insert a dataframe node.");
                }
            }
        };
        dropzone.addEventListener("datatransfer", (event: DataTransferEvent) => {
            let target = event.target as HTMLEDropzoneElement;
            if (event.detail.success) {
                if (event.detail.draggables.length > 0) {
                    let draggable = event.detail.draggables[0];
                    let input = draggable.querySelector("input");
                    if (input) {
                        input.name = info.name;
                    }
                }
            }
            else {
                alert(event.detail.statusText);
            }
        });


        dropzone?.addEventListener("change", () => {
            alert();
        });
    }*/

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