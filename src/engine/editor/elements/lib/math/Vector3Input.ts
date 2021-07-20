import { bindShadowRoot, GenerateAttributeAccessors, RegisterCustomHTMLElement } from "engine/editor/elements/HTMLElement";
import { Vector3 } from "engine/libs/maths/algebra/vectors/Vector3";

export { Vector3InputElement };

@RegisterCustomHTMLElement({
    name: 'e-vector3-input'
})
@GenerateAttributeAccessors([
    {name: 'label'},
    {name: 'tooltip'}
])
class Vector3InputElement extends HTMLElement {

    public readonly vector: Vector3;
    public label!: string;
    public tooltip!: string;

    constructor() {
        super();
        bindShadowRoot(this, /*template*/`
            <link rel="stylesheet" href="css/theme.css"/>
            <style>
                :host {
                    /*font-size: 1em;*/
                }

                [part~="input"] {
                    padding: var(--container-padding);
                    border-radius: var(--container-border-radius);
        
                    color: var(--theme-on-color);
                    caret-color: var(--theme-on-color);
                    text-align: center;
                    background-color: var(--theme-color-600);
                    width: 32px;
                    border: 1px solid transparent;
                    outline: 0;
                }
        
                [part~="input"]::selection {
                    background-color: var(--theme-color-200);
                }
                
                [part~="input"]:focus {
                    border: 1px solid var(--theme-on-color);
                }
            </style>
        
            <span id="label"></span> 
            X <input part="input" id="x" is="number-input" type="text" spellcheck="false" value="0"/>
            Y <input part="input" id="y" is="number-input" type="text" spellcheck="false" value="0"/>
            Z <input part="input" id="z" is="number-input" type="text" spellcheck="false" value="0"/>
        `);
        
        this.vector = new Vector3();
        
        this.shadowRoot!.getElementById('x')!.addEventListener('input', (event) => {
            this.vector.x = parseFloat((event.target as HTMLInputElement).value) || 0;
        });

        this.shadowRoot!.getElementById('y')!.addEventListener('input', (event) => {
            this.vector.y = parseFloat((event.target as HTMLInputElement).value) || 0;
        });

        this.shadowRoot!.getElementById('z')!.addEventListener('input', (event) => {
            this.vector.z = parseFloat((event.target as HTMLInputElement).value) || 0;
        });

        this.shadowRoot!.getElementById('label')!.innerText = this.label;
        this.tooltip = this.label;
    }

    public refresh() {
        (this.shadowRoot!.getElementById('x')! as HTMLInputElement).value = this.vector.x.toString();
        (this.shadowRoot!.getElementById('y')! as HTMLInputElement).value = this.vector.y.toString();
        (this.shadowRoot!.getElementById('z')! as HTMLInputElement).value = this.vector.z.toString();
    }

    connectedCallback() {
        this.refresh();
    }
}