import { HotKey } from "engine/core/input/Input";
import { RegisterCustomHTMLElement, GenerateAttributeAccessors, isTagElement, Fragment, bindShadowRoot } from "engine/editor/elements/HTMLElement";
import { HTMLEMenuElement } from "engine/editor/elements/lib/containers/menus/Menu";
import { HTMLEMenuBarElement } from "engine/editor/elements/lib/containers/menus/MenuBar";
import { HTMLEMenuItemGroupElement } from "./MenuItemGroup";

export { EMenuItemElementType };
export { HTMLEMenuItemElement };
export { HTMLEMenuItemElementBase };
export { EHotKeyChangeEvent };

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
class HTMLEMenuItemElementBase extends HTMLElement implements HTMLEMenuItemElement {

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

                :host(:not([type="menu"])) {
                    padding-left: 12px;
                    padding-right: 12px;
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
                    list-style-type: none;
                }

                [part~="content"] {
                    font-size: 1em;
                    flex: auto;
                    display: flex;
                    overflow: hidden;
                    pointer-events: none;
                }

                [part~="input"] {
                    display: inline-block;
                    flex: none;
                    width: 16px;
                    height: 16px;
                    margin: auto 1px;
                }

                [part~="icon"] {
                    display: inline-block;
                    flex: none;
                    width: 18px;
                    height: 18px;
                }

                [part~="icon"]::after {
                    position: absolute;
                    content: " ";
                    display: inline-block;
                    width: 18px;
                    height: 18px;
                    background-color: dimgray;
                    transform: scale(1.2) translateY(8%);
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
                    display: inline-block;
                    flex: none;
                    margin: auto;
                    color: inherit;
                    text-align: center;
                    font-weight: bold;
                    width: 18px;
                    height: 18px;
                }

                [part~="arrow"]::after {
                    position: absolute;
                    content: "›";
                    display: inline-block;
                    width: 18px;
                    height: 18px;
                    transform: scale(1.2) translateY(-8%);
                }

                :host([type="menu"]) [part~="arrow"],
                :host([type="menu"]) [part~="icon"],
                :host([type="menu"]) [part~="input"] {
                    display: none;
                }

                :host(:not([type="menu"])) [part~="label"] {
                    padding-left: 10px;
                    padding-right: 12px;
                }
                
                :host([type="checkbox"]) [part~="icon"],
                :host([type="radio"]) [part~="icon"],
                :host(:not([type="checkbox"]):not([type="radio"])) [part~="input"] {
                    display: none;
                }

                :host([type="submenu"]) [part~="icon"] {
                    visibility: hidden;
                }
                
                :host(:not([type="submenu"])) [part~="arrow"] {
                    visibility: hidden;
                }
            </style>
            <li part="li">
                <span part="content">
                    <span part="icon"></span>
                    <input part="input" type="button" tabindex="-1"></input>
                    <span part="label"></span>
                    <span part="hotkey"></span>
                    <span part="description"></span>
                    <span part="arrow"></span>
                </span>
                <slot name="menu"></slot>
            </li>
        `);
        this.childMenu = null;
        this.parentMenu = null;
        this.group = null;
        this.command = null;
        this._hotkey = null;
    }

    public get hotkey(): HotKey | null {
        return this._hotkey;
    }

    public set hotkey(hotkey: HotKey | null) {
        this.dispatchEvent(
            new CustomEvent("e-hotkeychange", {
                bubbles: true,
                detail: {
                    oldHotKey: this._hotkey,
                    newHotKey: hotkey
                }
            })
        );

        this._hotkey = hotkey;

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
                            this.dispatchEvent(new CustomEvent("e-change", {bubbles: true}));
                        }
                    }
                    break;
                case "type":
                    if (oldValue !== newValue) {
                        const inputPart = this.shadowRoot?.querySelector<HTMLInputElement>("[part~=input]");
                        if (inputPart) {
                            switch (this.type) {
                                case "radio":
                                    inputPart.type = "radio";
                                    break;
                                case "menu":
                                    inputPart.type = "hidden";
                                    break;
                                default:
                                    inputPart.type = "checkbox";
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
                case "checkbox":
                    this.checked = !this.checked;
                    break;
                case "radio":
                    this.dispatchEvent(new CustomEvent("e-radiochangerequest", {bubbles: true}));
                    break;
                case "menu":
                    if (this.childMenu) {
                        this.childMenu.focusItemAt(0);
                    }
                    break;
            }
            this.dispatchEvent(new CustomEvent("e-trigger", {bubbles: true}));
        }
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "e-menuitem": HTMLEMenuItemElement,
    }
}

type EHotKeyChangeEvent = CustomEvent<{
    oldHotKey: HotKey | null;
    newHotKey: HotKey | null;
}>;

declare global {
    interface HTMLElementEventMap {
        "e-hotkeychange": EHotKeyChangeEvent,
    }
}

declare global {
    interface HTMLElementEventMap {
        "e-trigger": Event,
    }
}

declare global {
    interface HTMLElementEventMap {
        "e-radiochangerequest": Event,
    }
}

declare global {
    interface HTMLElementEventMap {
        "e-change": Event,
    }
}