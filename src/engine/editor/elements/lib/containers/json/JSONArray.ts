import { RegisterCustomHTMLElement, GenerateAttributeAccessors, bindShadowRoot } from "engine/editor/elements/HTMLElement";
import { HTMLEJSONObjectElement, isHTMLEJSONObjectElement } from "./JSONObject";

export { HTMLEJSONArrayElement };
export { isHTMLEJSONArrayElement };

function isHTMLEJSONArrayElement(elem: any): elem is HTMLEJSONArrayElement {
    return  elem instanceof Node && elem.nodeType === elem.ELEMENT_NODE && (elem as Element).tagName.toLowerCase() === "e-jsonarray";
}

@RegisterCustomHTMLElement({
    name: "e-jsonarray"
})
@GenerateAttributeAccessors([
    {name: "name", type: "string"},
    {name: "disabled", type: "boolean"},
])
class HTMLEJSONArrayElement extends HTMLElement {

    public name!: string;
    public disabled!: boolean;
    public prototype: HTMLEJSONObjectElement | null;

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
            <fieldset part="fieldset">
                <details part="details">
                    <summary part="summary">
                        <label part="label">size</label>
                        <input part="size" type="number" value="0" min="0"></input>
                        <slot name="prototype"></slot>
                    </summary>
                    <slot name="items"></slot>
                </details>
            </fieldset>
        `);
        this.prototype = null;
    }

    public connectedCallback() {
        this.tabIndex = this.tabIndex;

        const prototypeSlot = this.shadowRoot?.querySelector<HTMLSlotElement>("slot[name=prototype]");
        if (prototypeSlot) {
            prototypeSlot.addEventListener("slotchange", () => {
                const prototype = prototypeSlot.assignedElements()[0];
                if (isHTMLEJSONObjectElement(prototype)) {
                    this.prototype = prototype;
                }
            });
        }

        const size = this.shadowRoot!.querySelector<HTMLInputElement>("input[part~='size']");
        if (size) {
            size.addEventListener("change", () => {
                let count = parseInt(size.value);
                if (this.prototype) {
                    let items = this.querySelectorAll("[slot='items']");
                    let itemsCount = items.length;
                    while (itemsCount < count) {
                        let clone = this.prototype.cloneNode(true) as Element;
                        clone.setAttribute("slot", "items");
                        this.appendChild(clone);
                        itemsCount++;
                    }
                    if (count >= 0) {
                        while (itemsCount > count) {
                            items[itemsCount - 1].remove();
                            itemsCount--;
                        }
                    }
                }
            });
        }
    }

    public attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
        if (newValue !== oldValue) {
            switch (name) {
            }
        }
    }

    public getJSON() {
        let children = Array.from(this.children);
        children.forEach((child) => {
            if (isHTMLEJSONObjectElement(child) || isHTMLEJSONArrayElement(child)) {
                child.getJSON();
            }
        });
        const form = document.createElement("form");
        form.innerHTML = this.innerHTML;
        console.log(Array.from(new FormData(form).values()));
    }
}
