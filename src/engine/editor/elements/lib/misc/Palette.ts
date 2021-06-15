import { bindShadowRoot, GenerateAttributeAccessors, RegisterCustomHTMLElement } from "engine/editor/elements/HTMLElement";

export { PaletteElement };

@RegisterCustomHTMLElement({
    name: 'e-palette'
})
@GenerateAttributeAccessors([{name: 'colors', type: 'json'}])
class PaletteElement extends HTMLElement {

    public colors!: Array<string>;

    constructor() {
        super();
        bindShadowRoot(this, /*template*/`
            <style>
                :host {
                    display: block;
                    content: contains;
                }

               :host #container {
                    display: grid;
                    grid-template-cols: repeat(5, 1fr);
                    grid-auto-rows: 16px;
                }
            </style>
            <div id="container">
            </div>
        `);
    }

    public connectedCallback() {
                
        const colors = this.colors;
        if (colors.length > 0) {
            this.shadowRoot!.querySelector('#container')!.append(
                ...colors.map((color: string) => {
                    const div = document.createElement('div');
                    div.setAttribute('style', `background-color: ${color}`);                    
                    return div;
                })
            );
        }
    }
}