import { BaseHTMLEMenuElement } from "engine/editor/elements/lib/containers/menus/Menu";
import { BaseHTMLEMenuBarElement } from "engine/editor/elements/lib/containers/menus/MenuBar";
import { BaseHTMLEMenuItemElement } from "engine/editor/elements/lib/containers/menus/MenuItem";
import { BaseHTMLEMenuItemGroupElement } from "engine/editor/elements/lib/containers/menus/MenuItemGroup";
import { BaseHTMLETabElement } from "engine/editor/elements/lib/containers/tabs/Tab";
import { BaseHTMLETabListElement } from "engine/editor/elements/lib/containers/tabs/TabList";
import { BaseHTMLETabPanelElement } from "engine/editor/elements/lib/containers/tabs/TabPanel";
import { BaseHTMLEDraggableElement } from "engine/editor/elements/lib/controls/draganddrop/Draggable";
import { BaseHTMLEDropzoneElement } from "engine/editor/elements/lib/controls/draganddrop/Dropzone";
import { StructuredFormData } from "engine/editor/objects/StructuredFormData";

BaseHTMLETabElement;
BaseHTMLETabListElement;
BaseHTMLETabPanelElement;

BaseHTMLEDraggableElement;
BaseHTMLEDropzoneElement;

BaseHTMLEMenuBarElement;
BaseHTMLEMenuElement;
BaseHTMLEMenuItemGroupElement;
BaseHTMLEMenuItemElement;

const body = /*template*/`
    <link rel="stylesheet" href="../css/mockup.css"/>
    <div class="main flex-rows">
        <nav class="flex-cols flex-none">
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
                        <e-menuitem name="letters-menu" type="submenu" label="Letters" tabindex="-1" aria-label="Letters">
                            <e-menu slot="menu" tabindex="-1">
                                <e-menuitemgroup name="favorite-letter" tabindex="-1">
                                    <e-menuitem name="a-item" type="radio" label="Letter A" value="a" tabindex="-1"
                                        aria-label="Letter A" checked=""></e-menuitem>
                                    <e-menuitem name="b-item" type="radio" label="Letter B" value="b" tabindex="-1"
                                        aria-label="Letter B"></e-menuitem>
                                </e-menuitemgroup>
                            </e-menu>
                        </e-menuitem>
                    </e-menu>
                </e-menuitem>
            </e-menubar>
        </nav>
        <div class="flex-cols flex-auto">
            <div id="tabs-col" class="flex-none padded">
                <e-tablist id="tablist">
                    <e-tab name="extract" controls="extract-panel" active>Extract</e-tab>
                    <e-tab name="transform" controls="transform-panel">Transform</e-tab>
                    <e-tab name="export" controls="export-panel">Export</e-tab>
                </e-tablist>
            </div>
            <div id="columns-col" class="flex-none padded">
                <details open>
                    <summary>Dataset 1</summary>
                    <e-draggable id="draggableA" tabindex="-1" type="column" ref="A">Column A<input name="A" value="Column_A" hidden></input></e-draggable>
                    <e-draggable id="draggableB" tabindex="-1" type="column" ref="B">Column B<input name="B" value="Column_B" hidden></input></e-draggable>
                    <e-draggable id="draggableC" tabindex="-1" type="column" ref="C">Column C<input name="C" value="Column_C" hidden></input></e-draggable>
                    <e-draggable id="draggableD" tabindex="-1" type="column" ref="D">Column D<input name="D" value="Column_D" hidden></input></e-draggable>
                </details>
                <details open>
                    <summary>Dataset 1</summary>
                    <e-draggable id="draggableA" tabindex="-1" type="column" ref="A">Column A<input name="A" value="Column_A" hidden></input></e-draggable>
                    <e-draggable id="draggableB" tabindex="-1" type="column" ref="B">Column B<input name="B" value="Column_B" hidden></input></e-draggable>
                    <e-draggable id="draggableC" tabindex="-1" type="column" ref="C">Column C<input name="C" value="Column_C" hidden></input></e-draggable>
                    <e-draggable id="draggableD" tabindex="-1" type="column" ref="D">Column D<input name="D" value="Column_D" hidden></input></e-draggable>
                </details>
            </div>
            <div id ="panels-col" class="flex-auto padded">
                <e-tabpanel id="extract-panel" class="padded">
                    <label for="file">Choose a data file</label><br/>
                    <input name="file" type="file"/>
                </e-tabpanel>
                <e-tabpanel id="transform-panel" class="padded">
                    <form>
                        <details open>
                            <summary>Transformation
                                <select data-class="toggler-select">
                                    <option value="aggregate" selected>Aggregate</option>
                                    <option value="median_imputer">Median imputer</option>
                                </select>
                            </summary>
                            <fieldset id="aggregate" class="indented">
                                <label>Columns</label><br/>
                                <e-dropzone data-class="input-dropzone" data-input-dropzone-name="name" allowedtypes="*" multiple></e-dropzone><br/>
                            </fieldset>
                            <fieldset id="median_imputer" class="indented">
                                <label>Median</label><input class="indented" name="median" type="number" value="1" min="0" max="100"></input><br/>
                            </fieldset>
                        </details>
                    </form>
                </e-tabpanel>
                <e-tabpanel id="export-panel" class="padded">
                    <button id="download-btn">Download</button>
                </e-tab-panel>
            </div>
        </div>
    </div>
`;

export async function mockup() {
    const bodyTemplate = document.createElement("template");
    bodyTemplate.innerHTML = body;
    document.body.insertBefore(bodyTemplate.content, document.body.firstChild);

    // let columns = await fetch("json/columns.json").then((resp) => {
    //     if (resp.ok) {
    //         return resp.json();
    //     }
    // });
    // columns.forEach((col) => {

    // });

    let downloadBtn = document.getElementById("download-btn");
    if (downloadBtn) {
        downloadBtn.addEventListener("click", () => {
            let form = document.querySelector("form");
            if (form) {
                let structuredFormData = new StructuredFormData(form).getStructuredFormData();
                let dataBlob = new Blob([JSON.stringify(structuredFormData, null, 4)], {type: "application/json"});

                let donwloadAnchor = document.createElement("a");
                donwloadAnchor.href = URL.createObjectURL(dataBlob);
                donwloadAnchor.download = "config.json";
                donwloadAnchor.click();
            }
        });
    }
}