import { RegisterCustomHTMLElement, GenerateAttributeAccessors, bindShadowRoot } from "engine/editor/elements/HTMLElement";

export { RangeElement };

@RegisterCustomHTMLElement({
    name: 'e-range'
})
@GenerateAttributeAccessors([
    {name: 'value', type: 'number'},
])
class RangeElement extends HTMLElement {

    constructor() {
        super();

        bindShadowRoot(this, /*template*/`
            <link rel="stylesheet" href="css/default.css"/>
            <style>
                :host {
                    display: block;
                }

                ::slotted([slot='input']) {
                    -webkit-appearance: none;
                }
            </style>
            <slot id="input" name="input"></slot>
        `);
    }

    public connectedCallback() {
        this.tabIndex = this.tabIndex;
    }
}