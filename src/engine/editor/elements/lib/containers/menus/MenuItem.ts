import { HotKey } from "engine/core/input/Input";
import { editor } from "engine/editor/Editor";
import { RegisterCustomHTMLElement, GenerateAttributeAccessors, bindShadowRoot, isTagElement } from "engine/editor/elements/HTMLElement";
import { HTMLEMenuElement } from "engine/editor/elements/lib/containers/menus/Menu";
import { HTMLEMenuBarElement } from "engine/editor/elements/lib/containers/menus/MenuBar";
import { HTMLEMenuItemGroupElement } from "./MenuItemGroup";

export { EMenuItemElementType };
export { HTMLEMenuItemElement };
export { BaseHTMLEMenuItemElement };

type EMenuItemElementType = "button" | "radio" | "checkbox" | "menu" | "submenu";

interface HTMLEMenuItemElement extends HTMLElement {
    name: string;
    label: string;
    type: EMenuItemElementType;
    disabled: boolean;
    checked: boolean;
    value: string;
    icon: string;

    group: HTMLEMenuItemGroupElement | null;
    parentMenu: HTMLEMenuElement | HTMLEMenuBarElement | null;
    childMenu: HTMLEMenuElement | null;

    hotkey: HotKey | null;
    command: string | null;
    commandArgs: any;

    trigger(): void;
}

@RegisterCustomHTMLElement({
    name: "e-menuitem",
    observedAttributes: ["icon", "label", "checked", "type"]
})
@GenerateAttributeAccessors([
    {name: "name", type: "string"},
    {name: "label", type: "string"},
    {name: "icon", type: "string"},
    {name: "type", type: "string"},
    {name: "disabled", type: "boolean"},
    {name: "checked", type: "boolean"},
])
class BaseHTMLEMenuItemElement extends HTMLElement implements HTMLEMenuItemElement {

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

                    padding: 2px 6px;
                    cursor: pointer;
                }

                :host(:focus) {
                    outline: none;
                }

                :host(:focus-within) {
                    color: black;
                    background-color: lightgray;
                }

                :host([disabled]) {
                    color: lightgray;
                }

                :host([type="submenu"]) ::slotted([slot="menu"]),
                :host([type="menu"]) ::slotted([slot="menu"]) {
                    z-index: 1;
                    position: absolute;
                    color: initial;
                }

                :host([type="menu"]) ::slotted([slot="menu"]) {
                    top: 100%;
                    left: 0;
                }

                :host([type="submenu"]) ::slotted([slot="menu"]) {
                    left: 100%;
                    top: -6px;
                }
                
                :host([type="submenu"]) ::slotted([slot="menu"][overflowing]) {
                    right: 100%;
                    left: auto;
                }
                
                :host([type="menu"]) ::slotted([slot="menu"][overflowing]) {
                    right: 0;
                    left: auto;
                }

                :host([type="menu"]) ::slotted([slot="menu"]:not([expanded])),
                :host([type="submenu"]) ::slotted([slot="menu"]:not([expanded])) {
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
                    width: 14px;
                    height: 14px;
                    margin-right: 2px;
                }

                [part~="state"] {
                    flex: none;
                    width: 16px;
                    margin-right: 8px;
                }

                [part~="input"] {
                    flex: none;
                    width: 14px;
                    height: 14px;
                    margin-right: 8px;
                    pointer-events: none;
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
                    color: inherit;
                }

                [part~="visual"] {
                    color: dimgray;
                    font-size: 1.6em;
                    line-height: 0.625;
                }

                [part~="visual"]::after {
                    pointer-events: none;
                }

                :host(:not([type="checkbox"]):not([type="radio"])) [part~="input"] {
                    display: none;
                }

                :host(:not([icon])) [part~="icon"],
                :host(:not([type="checkbox"]):not([type="radio"])) [part~="state"] {
                    visibility: hidden;
                }

                :host(:not([type="checkbox"]):not([type="radio"])) [part~="state"] {
                    display: none;
                }
                
                :host(:not([type="submenu"])) [part~="arrow"] {
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

                :host([type="submenu"]) [part~="arrow"]::after {
                    content: "›";
                }
            </style>
            <li part="li">
                <span part="content">
                    <span part="visual icon"></span>
                    <!--<span part="visual state"></span>-->
                    <input part="input" type="hidden" tabindex="-1"></input>
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
                if (isTagElement("e-menu", menuElem)) {
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
                        const inputPart = this.shadowRoot?.querySelector<HTMLInputElement>("[part~=input]");
                        if (inputPart) {
                            inputPart.checked = (newValue !== null);
                        }
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
                case "type":
                    if (oldValue !== newValue) {
                        const inputPart = this.shadowRoot?.querySelector<HTMLInputElement>("[part~=input]");
                        if (inputPart) {
                            switch (this.type) {
                                case "button":
                                    inputPart.type = "button";
                                case "checkbox":
                                    inputPart.type = "checkbox";
                                    break;
                                case "radio":
                                    inputPart.type = "radio";
                                    break;
                                default:
                                    inputPart.type = "hidden";
                                    break;
                            }
                        }
                    }
                    break;
            }
        }
    }

    public trigger(): void {
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

declare global {
    interface HTMLElementTagNameMap {
        "e-menuitem": HTMLEMenuItemElement,
    }
}