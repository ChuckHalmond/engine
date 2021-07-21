import { RegisterCustomHTMLElement, GenerateAttributeAccessors, bindShadowRoot } from "engine/editor/elements/HTMLElement";
import { HTMLETabPanelElement } from "engine/editor/elements/lib/containers/tabs/TabPanel";
import { HTMLETabListElement, TabChangeEvent } from "./TabList";

export { isHTMLETabElement };
export { HTMLETabElement };
export { BaseHTMLETabElement };

function isHTMLETabElement(obj: any): obj is HTMLETabElement {
    return obj instanceof Node && obj.nodeType === obj.ELEMENT_NODE && (obj as Element).tagName.toLowerCase() === "e-tab";
}

interface HTMLETabElement extends HTMLElement {
    name: string;
    active: boolean;
    disabled: boolean;
    controls: string;
    panel: HTMLETabPanelElement | null;
}

@RegisterCustomHTMLElement({
    name: "e-tab",
    observedAttributes: ["active", "controls"]
})
@GenerateAttributeAccessors([
    {name: "name", type: "string"},
    {name: "active", type: "boolean"},
    {name: "disabled", type: "boolean"},
    {name: "controls", type: "string"},
])
class BaseHTMLETabElement extends HTMLElement implements HTMLETabElement {

    public name!: string;
    public disabled!: boolean;
    public active!: boolean;
    public controls!: string;

    public panel: HTMLETabPanelElement | null;

    constructor() {
        super();

        bindShadowRoot(this, /*template*/`
            <style>
                :host {
                    display: block;
                    user-select: none;
                    white-space: nowrap;
                    padding: 2px 6px;
                    border-left: 4px solid transparent;
                    cursor: pointer;
                }
                
                :host([disabled]) {
                    color: grey;
                    pointer-events: none;
                }

                :host(:hover:not([active])) {
                    font-weight: bold;
                    border-left: 4px solid lightgrey;
                }

                :host([active]) {
                    font-weight: bold;
                    border-left: 4px solid dimgray;
                }
            </style>
            <slot></slot>
        `);
        this.panel = null;
    }

    public connectedCallback(): void {
        this.tabIndex = this.tabIndex;
        this.panel = document.querySelector<HTMLETabPanelElement>(`#${this.controls}`);

        if (this.panel !== null) {
            if (this.panel.isConnected) {
                this.panel.hidden = !this.active;
            }
            else {
                this.panel.addEventListener("connected", (event) => {
                    let panel = event.target as HTMLETabPanelElement;
                    panel.hidden = !this.active;
                }, {once: true});
            }
        }
    }
    
    public attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
        switch (name) {
            case "controls":
                if (oldValue !== newValue) {
                    this.panel = document.querySelector<HTMLETabPanelElement>(`#${newValue}`);
                }
                break;
            case "active":
                if (this.active) {
                    this.dispatchEvent(new CustomEvent("tabchange", {detail: {tab: this}, bubbles: true}) as TabChangeEvent);
                }
                if (this.panel) {
                    this.panel.hidden = !this.active;
                }
                break;
        }
    }
}