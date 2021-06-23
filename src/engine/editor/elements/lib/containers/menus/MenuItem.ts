import { HotKey } from "engine/core/input/Input";
import { editor } from "engine/editor/Editor";
import { RegisterCustomHTMLElement, GenerateAttributeAccessors, bindShadowRoot } from "engine/editor/elements/HTMLElement";
import { isHTMLEMenuElement, HTMLEMenuElement } from "engine/editor/elements/lib/containers/menus/Menu";
import { HTMLEMenuBarElement } from "engine/editor/elements/lib/containers/menus/MenuBar";
import { HTMLEMenuItemGroupElement } from "./MenuItemGroup";

export { HTMLEMenuItemElement };
export { isHTMLEMenuItemElement };

type EMenuItemElementType = "button" | "radio" | "checkbox" | "menu";

function isHTMLEMenuItemElement(elem: any): elem is HTMLEMenuItemElement {
    return  elem instanceof Node && elem.nodeType === elem.ELEMENT_NODE && (elem as Element).tagName.toLowerCase() === "e-menuitem";
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

    private _hotkey: HotKey | null;
    private _hotkeyExec: (() => void) | null;

    constructor() {
        super();

        bindShadowRoot(this, /*template*/`
            <style>
                :host {
                    position: relative;
                    display: inline-block;

                    user-select: none;
                    white-space: nowrap;

                    padding: 3px 6px;
                    background-color: white;
                    cursor: pointer;
                }
                
                :host(:focus) {
                    outline: none;
                }
                
                :host(:focus-within) {
                    color: white;
                    background-color: rgb(92, 92, 92);
                }
                
                :host(:hover) [part~="visual"],
                :host(:focus-within) [part~="visual"] {
                    color: inherit;
                }

                :host([disabled]) {
                    color: rgb(180, 180, 180);
                }

                :host(:focus-within[disabled]) {
                    background-color: rgb(220, 220, 220);
                }

                :host([type="menu"]) ::slotted([slot="menu"]) {
                    z-index: 1;
                    position: absolute;
                    color: initial;
                    
                    left: 100%;
                    top: -6px;
                }

                :host([type="menu"]) ::slotted([slot="menu"][overflowing]) {
                    right: 100%;
                    left: auto;
                }

                :host([type="menu"]) ::slotted([slot="menu"]:not([expanded])) {
                    opacity: 0;
                    pointer-events: none !important;
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
                    color: rgb(92, 92, 92);
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
        this._hotkeyExec = null;
    }

    public get hotkey(): HotKey | null {
        return this._hotkey;
    }

    public set hotkey(hotkey: HotKey | null) {
        if (this._hotkey !== null && this._hotkeyExec !== null) {
            editor.removeHotkeyExec(this._hotkey, this._hotkeyExec);
        }

        if (!this._hotkeyExec) {
            this._hotkeyExec = () => {
                if (this.command) {
                    editor.executeCommand(this.command, this.commandArgs);
                }
            };
        }
        
        if (hotkey instanceof HotKey) {
            this._hotkey = hotkey;
            editor.addHotkeyExec(this._hotkey, this._hotkeyExec);
        }

        let hotkeyPart = this.shadowRoot?.querySelector("[part~=hotkey]");
        if (hotkeyPart) {
            hotkeyPart.textContent = hotkey ? hotkey.toString() : "";
        }
    }

    public connectedCallback() {
        this.tabIndex = this.tabIndex;

        this.setAttribute("aria-label", this.label);

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
    }

    public disconnectedCallback(): void {
        if (this._hotkey !== null && this._hotkeyExec !== null) {
            editor.removeHotkeyExec(this._hotkey, this._hotkeyExec);
        }
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
                                this.dispatchEvent(new CustomEvent("change", {bubbles: true}));
                                if (this.command) {
                                    editor.executeCommand(this.command, this.commandArgs, this.checked ? void 0 : {undo: true});
                                }
                                break;
                            case "radio":
                                this.dispatchEvent(new CustomEvent("change", {bubbles: true}));
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

    public trigger() {
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
                        this.childMenu.focusItemAt(0);
                    }
                    break;
            }
            this.dispatchEvent(new CustomEvent("trigger", {bubbles: true}));
        }
    }
}
