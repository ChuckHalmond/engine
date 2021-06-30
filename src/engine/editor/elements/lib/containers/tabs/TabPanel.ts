import { bindShadowRoot, GenerateAttributeAccessors, RegisterCustomHTMLElement } from "engine/editor/elements/HTMLElement";

export { HTMLETabPanelElement };
export { BaseHTMLETabPanelElement };

interface HTMLETabPanelElement extends HTMLElement {
    name: string;
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
        
        this.dispatchEvent(new CustomEvent("connected"));
    }
}