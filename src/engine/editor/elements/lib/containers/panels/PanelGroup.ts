import { bindShadowRoot, GenerateAttributeAccessors, RegisterCustomHTMLElement } from "engine/editor/elements/HTMLElement";

export { PanelGroupElement };

@RegisterCustomHTMLElement({
    name: 'e-panel-group'
})
@GenerateAttributeAccessors([
    {name: 'label', type: 'string'},
    {name: 'state', type: 'string'},
])
class PanelGroupElement extends HTMLElement {

    public label!: string;
    public state!: 'opened' | 'closed';

    public static readonly observedAttributes = ['state'];
    
    constructor() {
        super();

        bindShadowRoot(this, /*template*/`
            <link rel="stylesheet" href="css/theme.css"/>
            <style>
                :host {
                    display: block;
                }

                :host([state='closed']) #content {
                    display: none;
                }

                :host([state='closed']) #less {
                    display: none;
                }

                :host([state='opened']) #more {
                    display: none;
                }

                #toggler {
                    display: flex;
                }

                #toggler:hover {
                    font-weight: 500;
                    color: var(--label-on-hover-color);
                }

                #label {
                    flex: 1;
                }
            </style>
            <div>
                <div id="toggler">
                    <span id="arrow"><!--<icon #less><icon #more>--></span>
                    <span id="label"></span>
                </div>
                <div id="content">
                    <slot></slot>
                </div>
            </div>
        `);

        
        this.state = this.state || 'closed';
    }

    public connectedCallback() {
        const toggler = this.shadowRoot!.querySelector<HTMLElement>('#toggler')!;
        const arrow = this.shadowRoot!.querySelector<HTMLElement>('#arrow')!;
        const label = this.shadowRoot!.querySelector<HTMLElement>('#label')!;

        toggler.addEventListener(
            'click', () => {
                if (this.state === 'opened') {
                    this.state = 'closed';
                }
                else if (this.state === 'closed') {
                    this.state = 'opened';
                }
            }
        );

        label.innerHTML = this.label!;
    }
}