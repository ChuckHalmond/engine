import { RegisterCustomHTMLElement, GenerateAttributeAccessors, bindShadowRoot } from "engine/editor/elements/HTMLElement";

export { HTMLEDropdownElement };
export { isDropdownElement };

function isDropdownElement(elem: Element): elem is HTMLEDropdownElement {
    return elem.tagName.toLowerCase() === 'e-dropdown';
}

@RegisterCustomHTMLElement({
    name: 'e-dropdown'
})
@GenerateAttributeAccessors([
    {name: 'expanded', type: 'boolean'},
])
class HTMLEDropdownElement extends HTMLElement {

    public expanded!: boolean;

    public button: HTMLElement | null;
    public content: HTMLElement | null;

    constructor() {
        super();

        bindShadowRoot(this, /*template*/`
            <style>
                :host {
                    display: block;
                    position: relative;
                    user-select: none;
                    white-space: nowrap;
                }

                :host(:not([expanded])) ::slotted([slot="content"]) {
                    display: none;
                }

                :host ::slotted([slot="content"]) {
                    display: flex;
                    z-index: 1;
                    position: absolute;

                    left: 0;
                    top: 100%;

                    padding: 8px 0;
                    background-color: white;
                    border: 1px solid grey;
                }
            </style>
            <slot id="button" name="button"></slot>
            <slot id="content" name="content"></slot>
        `);

        this.button = null;
        this.content = null;
    }

    public connectedCallback() {

        const buttonSlot = this.shadowRoot?.getElementById('button');
        if (buttonSlot) {
            buttonSlot.addEventListener('slotchange', (event: Event) => {
                const button = (event.target as HTMLSlotElement).assignedElements()[0];
                this.button = button as HTMLElement;

                button.addEventListener('click', () => {
                    if (!this.expanded) {
                        this.expanded = true;
                        setTimeout(() => {
                            document.addEventListener('click', clickOutListener);
                        });
                    }
                    else {
                        this.expanded = false;
                        document.removeEventListener('click', clickOutListener);
                    }
                });

                const clickOutListener = (event: Event) => {
                    if (!this.contains(event.currentTarget as Element)) {
                        this.expanded = false;
                        document.removeEventListener('click', clickOutListener);
                    }
                };
            });
        }

        const contentSlot = this.shadowRoot?.getElementById('content');
        if (contentSlot) {
            contentSlot.addEventListener('slotchange', (event: Event) => {
                const contentElem = (event.target as HTMLSlotElement).assignedElements()[0];
                this.content = contentElem as HTMLElement;
                
                this.content.addEventListener('click', (event: Event) => {
                    event.stopImmediatePropagation();
                });
            });
        }
    }
}