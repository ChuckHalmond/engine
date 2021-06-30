import { RegisterCustomHTMLElement, GenerateAttributeAccessors, bindShadowRoot } from "engine/editor/elements/HTMLElement";
import { HTMLEMenuElement, isHTMLEMenuElement } from "./Menu";

export { HTMLEMenuButtonElement };
export { isHTMLEMenuButtonElement };
export { BaseHTMLEMenuButtonElement };

function isHTMLEMenuButtonElement(elem: Element): elem is HTMLEMenuButtonElement {
    return elem.tagName.toLowerCase() === "e-menubutton";
}

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
    {name: "type", type: "string"},
    {name: "disabled", type: "boolean"},
])
class BaseHTMLEMenuButtonElement extends HTMLElement implements HTMLEMenuButtonElement {

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

                    padding: 3px 6px;
                    background-color: white;

                    cursor: pointer;
                }

                :host(:focus) {
                    outline: 1px solid -webkit-focus-ring-color;
                }

                :host(:hover),
                :host(:focus-within) {
                    color: white;
                    background-color: rgb(92, 92, 92);
                }

                :host([disabled]) {
                    color: rgb(180, 180, 180);
                }

                :host(:hover) [part~="visual"],
                :host(:focus) [part~="visual"],
                :host(:focus-within) [part~="visual"] {
                    color: inherit;
                }

                :host(:focus) ::slotted([slot="menu"]),
                :host(:focus-within) ::slotted([slot="menu"]) {
                    color: initial;
                }

                :host(:focus[disabled]),
                :host(:focus-within[disabled]) {
                    background-color: rgb(220, 220, 220);
                }

                :host ::slotted([slot="menu"]) {
                    z-index: 1;
                    position: absolute;
                    
                    top: 100%;
                    left: 0;
                }

                :host ::slotted([slot="menu"]:not(:focus-within)) {
                    max-width: 0;
                    max-height: 0;
                    padding: 0;
                    overflow: clip;
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

                [part~="label"] {
                    flex: auto;
                    text-align: left;
                }

                [part~="arrow"] {
                    flex: none;
                    margin-left: 8px;
                    transform: rotate(90deg);
                }

                [part~="visual"] {
                    color: rgb(92, 92, 92);
                    font-size: 1.6em;
                    line-height: 0.625;
                }

                [part~="visual"]::after {
                    pointer-events: none;
                }

                :host(:not([icon])) [part~="icon"] {
                    visibility: hidden;
                }

                :host [part~="arrow"]::after {
                    content: "»";
                }
            </style>
            <li part="li">
                <span part="content">
                    <span part="visual icon"></span>
                    <span part="label"></span>
                    <span part="visual arrow"></span>
                </span>
                <slot name="menu" part="menu"></slot>
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
                if (isHTMLEMenuElement(menuElem)) {
                    this.childMenu = menuElem;
                }
            });
        }
    }
}