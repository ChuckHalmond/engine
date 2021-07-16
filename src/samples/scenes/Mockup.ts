import { HTMLEDuplicableElementBase } from "engine/editor/elements/lib/containers/duplicable/Duplicable";
import { BaseHTMLEMenuElement } from "engine/editor/elements/lib/containers/menus/Menu";
import { BaseHTMLEMenuBarElement } from "engine/editor/elements/lib/containers/menus/MenuBar";
import { BaseHTMLEMenuItemElement } from "engine/editor/elements/lib/containers/menus/MenuItem";
import { BaseHTMLEMenuItemGroupElement } from "engine/editor/elements/lib/containers/menus/MenuItemGroup";
import { BaseHTMLETabElement } from "engine/editor/elements/lib/containers/tabs/Tab";
import { BaseHTMLETabListElement } from "engine/editor/elements/lib/containers/tabs/TabList";
import { BaseHTMLETabPanelElement } from "engine/editor/elements/lib/containers/tabs/TabPanel";
import { BaseHTMLEDraggableElement, HTMLEDraggableElement } from "engine/editor/elements/lib/controls/draggable/Draggable";
import { BaseHTMLEDragzoneElement } from "engine/editor/elements/lib/controls/draggable/Dragzone";
import { BaseHTMLEDropzoneElement } from "engine/editor/elements/lib/controls/draggable/Dropzone";
import { StructuredFormData } from "engine/editor/objects/StructuredFormData";
import { HTMLDraggableInputTemplate } from "engine/editor/templates/other/DraggableInputTemplate";

BaseHTMLETabElement;
BaseHTMLETabListElement;
BaseHTMLETabPanelElement;

BaseHTMLEDraggableElement;
BaseHTMLEDropzoneElement;
BaseHTMLEDragzoneElement;

BaseHTMLEMenuBarElement;
BaseHTMLEMenuElement;
BaseHTMLEMenuItemGroupElement;
BaseHTMLEMenuItemElement;

HTMLEDuplicableElementBase;

const body = /*template*/`
    <link rel="stylesheet" href="../css/mockup.css"/>
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
    <div id="root" class="flex-rows">
        <header class="flex-cols flex-none padded">
            <e-menubar tabindex="0">
                <e-menuitem name="canvas-menu-item" type="menu" label="Canvas" tabindex="-1" aria-label="Canvas">
                    <e-menu slot="menu" tabindex="-1">
                        <e-menuitemgroup tabindex="-1">
                            <e-menuitem name="canvas-play-item" type="button" label="Play" icon="play_arrow" value="play"
                                tabindex="-1" aria-label="Play"></e-menuitem>
                            <e-menuitem name="canvas-pause-item" type="button" label="Pause" icon="pause" value="pause"
                                tabindex="-1" aria-label="Pause"></e-menuitem>
                        </e-menuitemgroup>
                        <e-menuitemgroup tabindex="-1">
                            <e-menuitem name="show-fps-item" type="checkbox" label="Show FPS" icon="60fps" tabindex="-1"
                                aria-label="Show FPS"></e-menuitem>
                        </e-menuitemgroup>
                        <e-menuitemgroup name="submenus" tabindex="-1">
                            <e-menuitem name="letters-menu" type="submenu" label="Letters" tabindex="-1" aria-label="Letters">
                                <e-menu slot="menu" tabindex="-1">
                                    <e-menuitemgroup name="favorite-letter" label="Favorite letter" tabindex="-1">
                                        <e-menuitem name="a-item" type="radio" label="Letter A" value="a" tabindex="-1"
                                            aria-label="Letter A" checked=""></e-menuitem>
                                        <e-menuitem name="b-item" type="radio" label="Letter B" value="b" tabindex="-1"
                                            aria-label="Letter B"></e-menuitem>
                                    </e-menuitemgroup>
                                </e-menu>
                            </e-menuitem>
                        </e-menuitemgroup>
                    </e-menu>
                </e-menuitem>
            </e-menubar>
        </header>
        <main class="flex-cols flex-auto padded">
            <div id="tabs-col" class="flex-none">
                <e-tablist id="tablist">
                    <e-tab name="extract" controls="extract-panel">Extract</e-tab>
                    <e-tab name="transform" controls="transform-panel" active>Transform</e-tab>
                    <e-tab name="export" controls="export-panel">Export</e-tab>
                </e-tablist>
            </div>
            <div id="data-col" class="flex-none padded">
                <details class="indented" open>
                    <summary>Dataset 1</summary>
                    <e-dragzone>
                        <e-draggable id="draggableA" tabindex="-1" type="column" ref="D1A">Column A</e-draggable>
                        <e-draggable id="draggableB" tabindex="-1" type="column" ref="D1B">Column B</e-draggable>
                        <e-draggable id="draggableC" tabindex="-1" type="column" ref="D1C">Column C</e-draggable>
                        <e-draggable id="draggableD" tabindex="-1" type="column" ref="D1D">Column D</e-draggable>
                    </e-dragzone>
                </details>
            </div>
            <div id ="panels-col" class="flex-auto padded">
                <e-tabpanel id="extract-panel">
                    <label for="file">Choose a data file</label><br/>
                    <input name="file" type="file"/>
                    <!--<e-duplicable>
                        <input slot="input" type="number" value="1" min="0"></input>
                        <div slot="prototype">
                            <label>Item <span data-duplicate-index></span></label>
                            <input type="number"/>
                        </div>
                    </e-duplicable>-->
                </e-tabpanel>
                <e-tabpanel id="transform-panel">
                    <form>
                        <details class="indented" open>
                            <summary>
                                Transformer
                                <!--<select data-class="toggler-select">
                                    <option value="aggregate" selected>Transformer</option>
                                    <option value="median_imputer">Median imputer</option>
                                </select>-->
                                <select data-class="toggler-select">
                                    <option value="">...</option>
                                    <option value="aggregate" selected>Aggregate</option>
                                    <option value="median_imputer">Median imputer</option>
                                </select>
                            </summary>
                            <fieldset id="aggregate">
                                <details class="indented" open>
                                    <summary>
                                        Columns
                                    </summary>
                                    <e-dropzone allowedtypes="*" multiple>
                                        <input slot="input" type="text" name="columns"></input>
                                    </e-dropzone>
                                    <br/>
                                </details>
                            </fieldset>
                            <fieldset id="median_imputer">
                                <details class="indented" open>
                                    <summary>
                                        Median
                                    </summary>
                                    <input name="median" type="number" value="1" min="0" max="100"></input>
                                </details>
                            </fieldset>
                        </details>
                    </form>
                </e-tabpanel>
                <e-tabpanel id="export-panel">
                    <button id="download-btn">Download</button>
                </e-tab-panel>
            </div>
            <div id="doc-col" class="flex-none padded"></div>
        </main>
        <footer class="flex-cols flex-none padded">
        </footer>
    </div>
`;

export async function mockup() {
    const bodyTemplate = document.createElement("template");
    bodyTemplate.innerHTML = body;
    document.body.insertBefore(bodyTemplate.content, document.body.firstChild);
    
    /*const docCol = document.getElementById("doc-col");
    if (docCol) {
        docCol.innerText = marked('# Marked in the browser\n\nRendered by **marked**.');
    }*/
    
    const dragA = document.querySelector<HTMLEDraggableElement>("e-draggable#draggableA");
    if (dragA) {
        dragA.value = JSON.stringify({
            value: "dragA"
        });
    }

    const dragB = document.querySelector<HTMLEDraggableElement>("e-draggable#draggableB");
    if (dragB) {
        dragB.value = JSON.stringify({
            lol: "lol"
        });
    }

    // let columns = await fetch("json/columns.json").then((resp) => {
    //     if (resp.ok) {
    //         return resp.json();
    //     }
    // });
    // columns.forEach((col) => {

    // });

    console.log(HTMLDraggableInputTemplate({
        id:"draggableD",
        type:"column",
        ref:"D2D",
        name:"D2D",
        value:"Column_D2D"
    }));

    let downloadBtn = document.getElementById("download-btn");
    if (downloadBtn) {
        downloadBtn.addEventListener("click", () => {
            let form = document.querySelector("form");
            if (form) {
                let structuredFormData = new StructuredFormData(form).getStructuredFormData();
                console.log(structuredFormData);
                return;
                let dataBlob = new Blob([JSON.stringify(structuredFormData, null, 4)], {type: "application/json"});

                let donwloadAnchor = document.createElement("a");
                donwloadAnchor.href = URL.createObjectURL(dataBlob);
                donwloadAnchor.download = "config.json";
                donwloadAnchor.click();
            }
        });
    }
}