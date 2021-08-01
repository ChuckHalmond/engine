import { RegisterCustomHTMLElement, bindShadowRoot, GenerateAttributeAccessors } from "engine/editor/elements/HTMLElement";
import { HTMLEBreadcrumbTrailElement } from "./BreadcrumbTrail";

export { isHTMLEBreadcrumbItemElement };
export { HTMLEBreadcrumbItemElement };

function isHTMLEBreadcrumbItemElement(obj: any): obj is HTMLEBreadcrumbItemElement {
    return obj instanceof Node && obj.nodeType === obj.ELEMENT_NODE && (obj as Element).tagName.toLowerCase() === "e-breadcrumbitem";
}

@RegisterCustomHTMLElement({
    name: "e-breadcrumbitem",
    observedAttributes: ["label"]
})
@GenerateAttributeAccessors([
    {name: "label", type: "string"},
    {name: "active", type: "boolean"}
])
class HTMLEBreadcrumbItemElement extends HTMLElement {
    
    public label!: string;
    public active!: boolean;

    constructor() {
        super();

        bindShadowRoot(this, /*template*/`
            <style>
                :host {
                    display: inline-block;
                    cursor: pointer;
                }

                :host([active]) {
                    font-weight: bold;
                }

                :host(:not([active]))::after {
                    content: ">";
                    display: inline-block;
                }

                :host([hidden]) {
                    display: none;
                }

                [part~="li"] {
                    display: inline-block;
                    list-style-type: none;
                }
            </style>
            <li part="li">
                <slot></slot>
            </li>
        `);
    }
    
    public connectedCallback() {
        this.tabIndex = this.tabIndex;
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
            }
        }
    }
}