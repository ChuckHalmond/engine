import { RegisterCustomHTMLElement, GenerateAttributeAccessors, bindShadowRoot } from "engine/editor/elements/HTMLElement";
import { isStateElement } from "engine/editor/elements/lib/containers/buttons/ButtonState";

export { StatefulButtonElement };

@RegisterCustomHTMLElement({
    name: 'e-stateful-button'
})
@GenerateAttributeAccessors([
    {name: 'state', type: 'string'},
])
class StatefulButtonElement extends HTMLElement {

    public state!: string;

    constructor() {
        super();

        bindShadowRoot(this, /*template*/`
            <style>
                :host {
                    display: block;
                }

                ::slotted([active]) {
                    display: flex;
                }

                ::slotted(:not([active])) {
                    display: none;
                }
            </style>
            <slot id="states"></slot>
        `);

        const statesSlot = this.shadowRoot!.getElementById('states')!;
        statesSlot.addEventListener('slotchange', (event: Event) => {

            const slottedStates = (event.target as HTMLSlotElement).assignedElements();
            slottedStates.forEach((state) => {
                if (isStateElement(state)) {

                    this.addEventListener('statechange', ((event: CustomEvent<{state: string}>) => {
                        state.active = (event.detail.state === state.name);
                        this.state = state.name;
                    }) as EventListener);
                    
                    state.addEventListener('click', () => {
                        this.dispatchEvent(new CustomEvent<{state: string}>('statechange', {
                            detail: {
                                state: state.next
                            }
                        }));
                    });

                    if (state.active) {
                        this.state = state.name;
                    }
                }
            });
        }, {once: true});
    }

    public connectedCallback() {
        this.tabIndex = this.tabIndex;
    }
}