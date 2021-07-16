import { RegisterCustomHTMLElement, GenerateAttributeAccessors, bindShadowRoot, isTagElement } from "engine/editor/elements/HTMLElement";

export { HTMLEDuplicableElementBase };
export { HTMLEDuplicableElement };
export { isHTMLEDuplicableElement };

function isHTMLEDuplicableElement(elem: any): elem is HTMLEDuplicableElement {
    return  elem instanceof Node && elem.nodeType === elem.ELEMENT_NODE && (elem as Element).tagName.toLowerCase() === "e-duplicable";
}

interface HTMLEDuplicableElement {
    duplicate(count: number): void;
}

@RegisterCustomHTMLElement({
    name: "e-duplicable"
})
class HTMLEDuplicableElementBase extends HTMLElement implements HTMLEDuplicableElement {

    public name!: string;
    public prototype: Element | null;
    public input: HTMLInputElement | null;

    constructor() {
        super();

        bindShadowRoot(this, /*template*/`
            <style>
                :host {
                    display: block;
                }

                ::slotted([slot="prototype"]) {
                    display: none;
                }
            </style>
            <slot name="input"></slot>
            <slot name="prototype"></slot>
            <slot name="items"></slot>
        `);
        this.prototype = null;
        this.input = null;
    }

    public connectedCallback() {
        this.tabIndex = this.tabIndex;

        const prototypeSlot = this.shadowRoot?.querySelector<HTMLSlotElement>("slot[name=prototype]");
        if (prototypeSlot) {
            prototypeSlot.addEventListener("slotchange", () => {
                const prototype = prototypeSlot.assignedElements()[0];
                this.prototype = prototype;
                if (this.input) {
                    this.duplicate(parseInt(this.input.value));
                }
            });
        }

        const inputSlot = this.shadowRoot?.querySelector<HTMLSlotElement>("slot[name=input]");
        if (inputSlot) {
            inputSlot.addEventListener("slotchange", () => {
                const input = inputSlot.assignedElements()[0];
                if (isTagElement("input", input)) {
                    input.addEventListener("change", () => {
                        this.duplicate(parseInt(input.value));
                    });
                    this.duplicate(parseInt(input.value));
                    this.input = input;
                }
            });
        }
    }

    public duplicate(count: number): void {
        if (this.prototype) {
            let items = this.querySelectorAll("[slot='items']");
            let itemsCount = items.length;
            while (itemsCount < count) {
                let clone = this.prototype.cloneNode(true) as Element;
                clone.slot = "items";
                this.appendChild(clone);
                itemsCount++;
                let index = clone.querySelector("[data-duplicate-index]");
                if (index) {
                    index.textContent = itemsCount.toString();
                }
            }
            if (count >= 0) {
                while (itemsCount > count) {
                    items[itemsCount - 1].remove();
                    itemsCount--;
                }
            }
        }
    }
}
