import { bindShadowRoot, GenerateAttributeAccessors, RegisterCustomHTMLElement } from "engine/editor/elements/HTMLElement";

export { PanelElement };

@RegisterCustomHTMLElement({
    name: 'e-panel',
    observedAttributes: ['state']
})
@GenerateAttributeAccessors([
    {name: 'label', type: 'string'},
    {name: 'state', type: 'string'},
])
class PanelElement extends HTMLElement {

    public label!: string;
    public state!: 'opened' | 'closed';

    constructor() {
        super();
        bindShadowRoot(this, /*template*/`
            <style>
                :host {
                    display: block;
                }

                :host([state='closed']) #label,
                :host([state='closed']) #content {
                    display: none;
                }

                :host([state='closed']) #header {
                    padding: 0;
                }

                :host([state='closed']) #arrow {
                    display: inherit;
                }
                
                :host([state='opened']) #label,
                :host([state='opened']) #content {
                    display: inherit;
                }

                :host([state='opened']) #arrow {
                    display: none;
                }

                #content {
                    padding: var(--content-padding, inherit);
                }

                #header {
                    color: var(--header-color, inherit);
                    text-align: center;
                    padding-top: 0;

                    user-select: none;
                }

                #header:hover {
                    --color: var(--header-hover-color, var(--header-color));
                    color: var(--header-hover-color, var(--header-color));
                    font-weight: var(--header-hover-font-weight);
                }
            </style>
            <div>
                <div id="header">
                    <span id="arrow"></span>
                    <span id="label"></span>
                </div>
                <div id="content">
                    <slot></slot>
                </div>
            </div>
        `);
 
        const header = this.shadowRoot!.getElementById('header')!;

        header.addEventListener(
            'click', () => {
                this.state = (this.state === 'opened') ? 'closed' : 'opened';
            }
        );
    }
    
    public async render() {
        const label = this.shadowRoot!.getElementById('label')!;
        const arrow = this.shadowRoot!.getElementById('arrow')!;
        
        let rect = this.getBoundingClientRect();
        const arr = (rect.left < window.innerWidth / 2) ? '>' : '<';
        arrow.innerHTML = arr;
        label.innerHTML = this.label || '';
    }

    public connectedCallback() {
        this.label = this.label || 'label';
        this.state = this.state || 'opened';

        this.render();
    }
}