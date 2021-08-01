import { RegisterCustomHTMLElement, GenerateAttributeAccessors, bindShadowRoot, isTagElement } from "engine/editor/elements/HTMLElement";
import { HTMLETabPanelElement, isHTMLETabPanelElement } from "engine/editor/elements/lib/containers/tabs/TabPanel";

export { HTMLETabElement };
export { BaseHTMLETabElement };

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
                }

                :host([active]) {
                    font-weight: bold;
                    border-left: 4px solid black;
                }
            </style>
            <slot></slot>
        `);
        this.panel = null;
    }

    public connectedCallback(): void {
        this.tabIndex = this.tabIndex;

        let panel = document.getElementById(this.controls);
        if (isTagElement("e-tabpanel", panel)) {
            this.panel = panel;
            this.panel.hidden = !this.active;
        }
    }
    
    public attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
        switch (name) {
            case "controls":
                if (oldValue !== newValue) {
                    let panel = document.getElementById(this.controls);
                    if (isHTMLETabPanelElement(panel)) {
                        this.panel = panel;
                    }
                }
                break;
            case "active":
                if (this.active) {
                    this.dispatchEvent(new CustomEvent("tabchange", {detail: {tab: this}, bubbles: true}));
                }
                if (this.panel) {
                    this.panel.hidden = !this.active;
                }
                break;
        }
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "e-tab": HTMLETabElement,
    }
}