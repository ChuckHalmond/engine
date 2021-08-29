import { RegisterCustomHTMLElement, bindShadowRoot, GenerateAttributeAccessors } from "engine/editor/elements/HTMLElement";

export { HTMLEBreadcrumbItemElement };
export { HTMLEBreadcrumbItemElementBase };

interface HTMLEBreadcrumbItemElement extends HTMLElement {
    label: string;
    active: boolean;
}

@RegisterCustomHTMLElement({
    name: "e-breadcrumbitem",
    observedAttributes: ["label"]
})
@GenerateAttributeAccessors([
    {name: "label", type: "string"},
    {name: "active", type: "boolean"}
])
class HTMLEBreadcrumbItemElementBase extends HTMLElement implements HTMLEBreadcrumbItemElement {
    
    public label!: string;
    public active!: boolean;

    constructor() {
        super();

        let separatorArrowUrl = JSON.stringify("../assets/editor/icons/chevron_right_black_18dp.svg");

        bindShadowRoot(this, /*template*/`
            <link rel="preload" href=${separatorArrowUrl} as="image" crossorigin>
            <style>
                :host {
                    display: inline-block;
                    cursor: pointer;

                    --separator-arrow-url: url(${separatorArrowUrl});
                }

                :host([active]) {
                    font-weight: bold;
                }

                :host([active]) [part~="li"]::after {
                    display: none;
                }

                [part~="li"]::after {
                    content: "";
                    display: inline-block;
                    width: 18px;
                    height: 18px;
                    background-color: dimgray;
                    transform: scale(1.2) translateY(4%);
                    -webkit-mask-image: var(--separator-arrow-url);
                    mask-image: var(--separator-arrow-url);
                }

                :host([hidden]) {
                    display: none;
                }

                [part~="li"] {
                    display: flex;
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

declare global {
    interface HTMLElementTagNameMap {
        "e-breadcrumbitem": HTMLEBreadcrumbItemElement,
    }
}