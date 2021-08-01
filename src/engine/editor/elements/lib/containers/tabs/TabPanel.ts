import { bindShadowRoot, GenerateAttributeAccessors, RegisterCustomHTMLElement } from "engine/editor/elements/HTMLElement";

export { isHTMLETabPanelElement };
export { HTMLETabPanelElement };
export { BaseHTMLETabPanelElement };

interface HTMLETabPanelElement extends HTMLElement {
    name: string;
}

function isHTMLETabPanelElement(obj: any): obj is BaseHTMLETabPanelElement {
    return obj instanceof Node && obj.nodeType === obj.ELEMENT_NODE && (obj as Element).tagName.toLowerCase() === "e-tabpanel";
}

@RegisterCustomHTMLElement({
    name: "e-tabpanel"
})
@GenerateAttributeAccessors([
    {name: "name", type: "string"}
])
class BaseHTMLETabPanelElement extends HTMLElement implements HTMLETabPanelElement {

    public name!: string;

    constructor() {
        super();
        
        bindShadowRoot(this, /*template*/`
            <style>
                :host {
                    display: block;
                }

                :host([hidden]) {
                    display: none;
                }
            </style>
            <slot></slot>
        `);
    }

    public connectedCallback(): void {
        this.tabIndex = this.tabIndex;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "e-tabpanel": HTMLETabPanelElement,
    }
}