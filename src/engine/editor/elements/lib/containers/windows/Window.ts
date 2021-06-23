import { bindShadowRoot, GenerateAttributeAccessors, RegisterCustomHTMLElement } from "engine/editor/elements/HTMLElement";

export { WindowElement };

@RegisterCustomHTMLElement({
    name: 'e-window'
})
@GenerateAttributeAccessors([
    {name: 'title', type: 'string'},
    {name: 'tooltip', type: 'string'},
    {name: 'toggled', type: 'boolean'}
])
class WindowElement extends HTMLElement {

    public title!: string;
    public tooltip!: string;
    public toggled!: boolean;

    constructor() {
        super();

        bindShadowRoot(this, /*template*/`
            <link rel="stylesheet" href="css/default.css"/>
            <style>
                :host {
                    position: absolute;
                    display: block;
                    contain: content;
                    z-index: 10;

                    width: auto;
                    height: auto;

                    box-shadow: 0 2px 4px -1px rgba(0, 0, 0, .2), 0 4px 5px 0 rgba(0, 0, 0, .14), 0 1px 10px 0 rgba(0, 0, 0, .12);
                }

                #header {
                    display: flex;
                    flex-wrap: nowrap;
                }

                #title {
                    flex: 1;
                    display: inline-block;
                }

                #header > *:not(#title) {
                    flex: 0;
                }

                #content {
                    border-top: 1px solid white;
                }

                :host([toggled]) #content {
                    display: none;
                }
            </style>
            <div>
                <div id="header">
                    <span id="title"></span>
                    <e-stateful-button id="toggle">
                        <e-button-state name='minimize' icon='assets/editor/icons/material/rounded/24dp/remove.svg' next='maximize' initial></e-button-state>
                        <e-button-state name='maximize' icon='assets/editor/icons/material/rounded/24dp/add.svg' next='minimize'></e-button-state>
                    </e-stateful-button>
                    <e-stateful-button id="close">
                        <e-button-state name='close' icon='assets/editor/icons/material/rounded/24dp/close.svg' initial></e-button-state>
                    </e-stateful-button>
                </div>
                <div id="content">
                    <slot></slot>
                </div>
            </div>
        `);

        const header = this.shadowRoot!.getElementById('header')!;

        header.addEventListener('pointerdown', () => {
            document.addEventListener('pointermove', onPointerMouve);
        });

        const onPointerMouve = (event: PointerEvent) => {
            const pos = this.getBoundingClientRect();
            this.style.top = `${pos.y + event.movementY}px`;
            this.style.left = `${pos.x + event.movementX}px`;
        };

        header.addEventListener('pointerup', () => {
            document.removeEventListener('pointermove', onPointerMouve);
        });

        this.shadowRoot!.getElementById('close')!.addEventListener('click', () => {
            this.parentElement!.removeChild(this);
        });

        this.shadowRoot!.getElementById('toggle')!.addEventListener('click', () => {
            this.toggled = !this.toggled;
        });
    }

    public connectedCallback() {
        this.shadowRoot!.getElementById('title')!.innerHTML = this.title;
    }
}