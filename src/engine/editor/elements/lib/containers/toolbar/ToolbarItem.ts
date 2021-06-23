import { editor, EditorHotKey } from "engine/editor/Editor";
import { RegisterCustomHTMLElement, GenerateAttributeAccessors, bindShadowRoot } from "engine/editor/elements/HTMLElement";
import { isHTMLEMenuElement, HTMLEMenuElement } from "engine/editor/elements/lib/containers/menus/Menu";
import { HTMLEMenuBarElement } from "engine/editor/elements/lib/containers/menus/MenuBar";
import { HTMLEMenuItemGroupElement } from "./MenuItemGroup";

export { HTMLEMenuItemElement };
export { isHTMLEMenuItemElement };

type EMenuItemElementType = "button" | "radio" | "checkbox" | "menu";

function isHTMLEMenuItemElement(elem: Element): elem is HTMLEMenuItemElement {
    return elem.tagName.toLowerCase() === "e-menuitem";
}

@RegisterCustomHTMLElement({
    name: "e-menuitem",
    observedAttributes: ["icon", "label", "checked"]
})
@GenerateAttributeAccessors([
    {name: "name", type: "string"},
    {name: "label", type: "string"},
    {name: "icon", type: "string"},
    {name: "type", type: "string"},
    {name: "disabled", type: "boolean"},
    {name: "checked", type: "boolean"},
    {name: "value", type: "string"},
])

class HTMLEMenuItemElement extends HTMLElement {

    public name!: string;
    public label!: string;
    public type!: EMenuItemElementType;
    public disabled!: boolean;
    public checked!: boolean;
    public value!: string;
    public icon!: string;

    public group: HTMLEMenuItemGroupElement | null;
    public parentMenu: HTMLEMenuElement | HTMLEMenuBarElement | null;
    public childMenu: HTMLEMenuElement | null;

    public command: string | null;
    public commandArgs: any;

    private _hotkey: EditorHotKey | null;
    private _hotkeyEventListener: ((event: KeyboardEvent) => any) | null;

    public get hotkey(): EditorHotKey | null {
        return this._hotkey;
    }

    public set hotkey(hotkey: EditorHotKey | null) {
        if (this._hotkey && this._hotkeyEventListener) {
            document.removeEventListener("keydown", this._hotkeyEventListener);
        }
        
        this._hotkey = hotkey;

        let hotkeyPart = this.shadowRoot?.querySelector("[part~=hotkey]");
        if (hotkeyPart) {
            hotkeyPart.textContent = hotkey ? hotkey.toString() : "";
        }

        if (hotkey) {
            this._hotkeyEventListener = (event: KeyboardEvent) => {
                if (this._hotkey && this._hotkey.test(event)) {
                    this.activate();
                }
            };
            document.addEventListener("keydown", this._hotkeyEventListener);
        }
    }

    constructor() {
        super();

        bindShadowRoot(this, /*template*/`
            <style>
                :host {
                    position: relative;
                    display: inline-block;

                    user-select: none;
                    white-space: nowrap;

                    padding: 2px 6px;
                    background-color: white;
                    cursor: pointer;
                    pointer-events: auto;
                }
                
                :host(:focus-within) {
                    outline: none;
                    background-color: rgb(180, 180, 180);
                }

                :host([disabled]),
                :host([disabled]) [part~="visual"] {
                    color: rgb(180, 180, 180);
                }

                :host(:focus-within[disabled]) {
                    background-color: rgb(220, 220, 220);
                }

                :host([type="menu"]) ::slotted([slot="menu"]) {
                    z-index: 1;
                    position: absolute;
                    
                    left: 100%;
                    top: -6px;

                    max-width: 0;
                    max-height: 0;
                    overflow: clip;
                }
                
                :host([type="menu"]:not(:focus):focus-within) ::slotted([slot="menu"]) {            
                    max-width: none;
                    max-height: none;
                    overflow: visible;
                }

                [part~="li"] {
                    display: flex;
                    height: 100%;
                    list-style-type: none;
                }

                [part~="content"] {
                    font-size: 1em;
                    flex: auto;
                    display: flex;
                }

                [part~="icon"] {
                    flex: none;
                    display: none;
                    width: 16px;
                    margin-right: 2px;
                }

                [part~="state"] {
                    flex: none;
                    width: 16px;
                    margin-right: 8px;
                }

                [part~="label"] {
                    flex: auto;
                    text-align: left;
                }

                [part~="hotkey"] {
                    flex: none;
                    text-align: right;
                    margin-left: 16px;
                }

                [part~="hotkey"]:empty {
                    display: none !important;
                }

                [part~="arrow"] {
                    flex: none;
                    margin-left: 8px;
                }

                [part~="visual"] {
                    color: grey;
                    font-size: 1.6em;
                    line-height: 0.625;
                }

                [part~="visual"]::after {
                    pointer-events: none;
                }

                :host(:not([icon])) [part~="icon"],
                :host(:not([type="checkbox"]):not([type="radio"])) [part~="state"] {
                    visibility: hidden;
                }

                :host(:not([type="checkbox"]):not([type="radio"])) [part~="state"] {
                    display: none;
                }

                :host(:not([type="menu"])) [part~="arrow"] {
                    display: none !important;
                }
                
                :host([type="checkbox"][checked]) [part~="state"]::after {
                    content: "■";
                }

                :host([type="checkbox"]:not([checked])) [part~="state"]::after {
                    content: "□";
                }

                :host([type="radio"][checked]) [part~="state"]::after {
                    content: "●";
                }

                :host([type="radio"]:not([checked])) [part~="state"]::after {
                    content: "○";
                }

                :host([type="menu"]) [part~="arrow"]::after {
                    content: "»";
                }
            </style>
            <li part="li">
                <span part="content">
                    <span part="visual icon"></span>
                    <span part="visual state"></span>
                    <span part="label"></span>
                    <span part="hotkey"></span>
                    <span part="description"></span>
                    <span part="visual arrow"></span>
                </span>
                <slot name="menu"></slot>
            </li>
        `);
        this.childMenu = null;
        this.parentMenu = null;
        this.group = null;
        this.command = null;
        this._hotkey = null;
        this._hotkeyEventListener = null;
    }

    public connectedCallback() {
        this.tabIndex = this.tabIndex;

        const menuSlot = this.shadowRoot?.querySelector<HTMLSlotElement>("slot[name=menu]");
        if (menuSlot) {
            menuSlot.addEventListener("slotchange", () => {
                const menuElem = menuSlot.assignedElements()[0];
                if (isHTMLEMenuElement(menuElem)) {
                    this.childMenu = menuElem;
                    menuElem.parentItem = this;
                }
            });
        }

        this.addEventListener("click", (event: Event) => {
            this.activate();
            event.stopPropagation();
        });
    }

    public disconnectedCallback(): void {
        if (this._hotkeyEventListener) {
            document.removeEventListener("keydown", this._hotkeyEventListener);
        }
        this.dispatchEvent(new CustomEvent("disconnected", {bubbles: false}));
    }

    public attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
        if (newValue !== oldValue) {
            switch (name) {
                case "label":
                    if (oldValue !== newValue) {
                        const labelPart = this.shadowRoot?.querySelector("[part~=label]");
                        if (labelPart) {
                            labelPart.textContent = newValue;
                        }
                    }
                    break;
                case "icon":
                    if (oldValue !== newValue) {
                        const iconPart = this.shadowRoot?.querySelector<HTMLElement>("[part~=icon]");
                        if (iconPart) {
                            iconPart.dataset.value = newValue;
                        }
                    }
                    break;
                case "checked":
                    if (oldValue !== newValue) {
                        switch (this.type) {
                            case "checkbox":
                                this.dispatchEvent(new CustomEvent("change"));
                                if (this.command) {
                                    editor.executeCommand(this.command, this.commandArgs, this.checked ? void 0 : {undo: true});
                                }
                                break;
                            case "radio":
                                this.dispatchEvent(new CustomEvent("change"));
                                if (this.command) {
                                    editor.executeCommand(this.command, this.commandArgs, this.checked ? void 0 : {undo: true});
                                }
                                break;
                        }
                    }
                    break;
            }
        }
    }

    public activate() {
        if (!this.disabled) {
            switch (this.type) {
                case "button":
                default:
                    if (this.command) {
                        editor.executeCommand(this.command, this.commandArgs);
                    }
                    break;
                case "checkbox":
                    this.checked = !this.checked;
                    break;
                case "radio":
                    this.checked = true;
                    break;
                case "menu":
                    if (this.childMenu) {
                        this.childMenu.selectItem(0);
                    }
                    break;
            }
        }
    }

    public clearFocus() {
        if (this.childMenu) {
            this.childMenu.clearSelection();
        }
    }
}
