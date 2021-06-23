import { bindShadowRoot, GenerateAttributeAccessors, RegisterCustomHTMLElement } from "engine/editor/elements/HTMLElement";

export { TabPanelElement };

@RegisterCustomHTMLElement({
    name: "e-tab-panel"
})
@GenerateAttributeAccessors([
    {name: "name", type: "string"},
    {name: "active", type: "boolean"},
])
class TabPanelElement extends HTMLElement {

    public active!: boolean;
    public name!: string;

    constructor() {
        super();
        
        bindShadowRoot(this, /*template*/`
            <style>
                :host {
                    display: block;
                    padding: 2px 6px;
                }

                :host(:not([active])) {
                    display: none;
                }
            </style>
            <slot></slot>
        `);
    }

    public connectedCallback() {
        this.dispatchEvent(new CustomEvent("connected"));
    }

    public show() {
        this.active = true;
    }

    public hide() {
        this.active = false;
    }
}