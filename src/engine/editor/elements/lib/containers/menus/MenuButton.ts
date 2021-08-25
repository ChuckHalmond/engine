import { RegisterCustomHTMLElement, GenerateAttributeAccessors, isTagElement, bindShadowRoot } from "engine/editor/elements/HTMLElement";
import { HTMLEMenuElement } from "./Menu";

export { HTMLEMenuButtonElement };
export { HTMLEMenuButtonElementBase };

interface HTMLEMenuButtonElement extends HTMLElement {
    name: string;
    label: string;
    disabled: boolean;
    icon: string;
    active: boolean;
    childMenu: HTMLEMenuElement | null;
    trigger(): void
}

@RegisterCustomHTMLElement({
    name: "e-menubutton",
    observedAttributes: ["icon", "label", "checked"]
})
@GenerateAttributeAccessors([
    {name: "name", type: "string"},
    {name: "active", type: "boolean"},
    {name: "label", type: "string"},
    {name: "icon", type: "string"},
    {name: "disabled", type: "boolean"},
])
class HTMLEMenuButtonElementBase extends HTMLElement implements HTMLEMenuButtonElement {

    public name!: string;
    public label!: string;
    public disabled!: boolean;
    public icon!: string;
    public active!: boolean;

    public childMenu: HTMLEMenuElement | null;

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

                :host(:hover) {
                    color: black;
                    background-color: gainsboro;
                }

                /*:host(:focus) {
                    outline: none;
                }*/

                :host(:focus-within) {
                    color: black;
                    background-color: lightgray;
                }

                :host([disabled]) {
                    color: lightgray;
                }

                :host ::slotted([slot="menu"]) {
                    z-index: 1;
                    position: absolute;
                    color: initial;
                }

                :host ::slotted([slot="menu"]) {
                    top: 100%;
                    left: 0;
                }
                
                :host ::slotted([slot="menu"][overflowing]) {
                    right: 0;
                    left: auto;
                }

                :host ::slotted([slot="menu"]:not([expanded])) {
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
                    display: none;
                    flex: none;
                    width: 16px;
                    height: 16px;
                    margin-right: 2px;
                    pointer-events: none;
                }

                [part~="input"] {
                    display: inline-block;
                    flex: none;
                    width: 16px;
                    height: 16px;
                    margin: auto;
                    pointer-events: none;
                }

                [part~="label"] {
                    flex: auto;
                    text-align: left;
                }
            </style>
            <li part="li">
                <span part="content">
                    <span part="icon"></span>
                    <span part="label"></span>
                    <span part="description"></span>
                </span>
                <slot name="menu"></slot>
            </li>
        `);
        this.childMenu = null;

        this.addEventListener("keydown", (event: KeyboardEvent) => {
            switch (event.key) {
                case "Enter":
                    if (!this.active) {
                        this.active = true;
                        if (this.childMenu) {
                            this.childMenu.focusItemAt(0);
                        }
                    }
                    break;
                case "Escape":
                    this.focus();
                    this.active = false;
                    break;
            }
        });

        this.addEventListener("click", () => {
            this.trigger();
        });

        this.addEventListener("blur", (event: FocusEvent) => {
            let containsNewFocus = (event.relatedTarget !== null) && this.contains(event.relatedTarget as Node);
            if (!containsNewFocus) {
                this.active = false;
            }
        }, {capture: true});
    }

    public trigger(): void {
        if (!this.active) {
            this.active = true;
            if (this.childMenu) {
                this.childMenu.focus();
            }
        }
        else {
            this.active = false;
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
                            iconPart.textContent = newValue;
                        }
                    }
                    break;
            }
        }
    }

    public connectedCallback() {
        this.tabIndex = this.tabIndex;

        const menuSlot = this.shadowRoot?.querySelector<HTMLSlotElement>("slot[name=menu]");
        if (menuSlot) {
            menuSlot.addEventListener("slotchange", () => {
                const menuElem = menuSlot.assignedElements()[0];
                if (isTagElement("e-menu", menuElem)) {
                    this.childMenu = menuElem;
                }
            });
        }
    }
}