import { RegisterCustomHTMLElement, GenerateAttributeAccessors, bindShadowRoot } from "engine/editor/elements/HTMLElement";
import { HTMLEFormDataObjectElement } from "./FormDataObject";

export { HTMLEFormDataArrayElement };
export { isHTMLEFormDataArrayElement };

function isHTMLEFormDataArrayElement(elem: any): elem is HTMLEFormDataArrayElement {
    return  elem instanceof Node && elem.nodeType === elem.ELEMENT_NODE && (elem as Element).tagName.toLowerCase() === "e-fdarray";
}

@RegisterCustomHTMLElement({
    name: "e-fdarray"
})
@GenerateAttributeAccessors([
    {name: "name", type: "string"},
])
class HTMLEFormDataArrayElement extends HTMLElement {

    public name!: string;
    public prototype: Element | null;

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
                <input part="size" type="number" value="0" min="0"></input>
                <slot name="prototype"></slot>
                <slot name="items"></slot>
            </details>
        `);
        this.prototype = null;
    }

    public connectedCallback() {
        this.tabIndex = this.tabIndex;

        const prototypeSlot = this.shadowRoot?.querySelector<HTMLSlotElement>("slot[name=prototype]");
        if (prototypeSlot) {
            prototypeSlot.addEventListener("slotchange", () => {
                const prototype = prototypeSlot.assignedElements()[0];
                this.prototype = prototype;
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

    public getFormData(): any[] {
        let formData: any = [];

        let fdos = this.querySelectorAll<HTMLEFormDataObjectElement | HTMLEFormDataArrayElement>(":scope > e-fdobject[slot='items'], :scope > e-fdarray[slot='items']");
        fdos.forEach((fdo) => {
            formData.push(fdo.getFormData());
        });

        let formElements = Array.from(this.querySelectorAll("*:not(e-fdobject):not(e-fdarray) input[slot='items'], *:not(e-fdobject):not(e-fdarray) select[slot='items']"));
        let tempForm = document.createElement("form");
        tempForm.append(...formElements);

        let tempFormData = new FormData(tempForm);
        Array.from(tempFormData.keys()).forEach(
            (key) => {
                formData.push(tempFormData.get(key));
            }
        );

        return formData;
    }
}
