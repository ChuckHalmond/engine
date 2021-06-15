import { RegisterCustomHTMLElement, GenerateAttributeAccessors, bindShadowRoot } from "engine/editor/elements/HTMLElement";

export { ComboBoxElement };

@RegisterCustomHTMLElement({
    name: 'e-combobox'
})
@GenerateAttributeAccessors([
    {name: 'value', type: 'number'},
])
class ComboBoxElement extends HTMLElement {
    
    constructor() {
        super();

        bindShadowRoot(this, /*template*/`
            <link rel="stylesheet" href="css/default.css"/>
            <style>
                :host {
                    display: block;
                }

                ::slotted([slot='select']) {
                    -webkit-appearance: none;
                }
            </style>
            <slot id="select" name="select"></slot>
        `);
    }

    public connectedCallback() {
        this.tabIndex = this.tabIndex;
    }
}