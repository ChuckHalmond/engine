import { RegisterCustomHTMLElement, GenerateAttributeAccessors, bindShadowRoot } from "engine/editor/elements/HTMLElement";
import { HTMLEFormDataArrayElement } from "./FormDataArray";

export { HTMLEFormDataObjectElement };
export { isHTMLEFormDataObjectElement };

function isHTMLEFormDataObjectElement(elem: any): elem is HTMLEFormDataObjectElement {
    return  elem instanceof Node && elem.nodeType === elem.ELEMENT_NODE && (elem as Element).tagName.toLowerCase() === "e-fdobject";
}

@RegisterCustomHTMLElement({
    name: "e-fdobject"
})
@GenerateAttributeAccessors([
    {name: "name", type: "string"},
    {name: "disabled", type: "boolean"},
])
class HTMLEFormDataObjectElement extends HTMLElement {

    public name!: string;
    public disabled!: boolean;

    constructor() {
        super();

        bindShadowRoot(this, /*template*/`
            <style>
                :host {
                    display: block;
                }
            </style>
            <slot></slot>
        `);
    }

    public connectedCallback() {
        this.tabIndex = this.tabIndex;
    }

    public attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
        if (newValue !== oldValue) {
            switch (name) {
                case "disabled":
                    let inputs = this.querySelectorAll<HTMLInputElement>("input, select");
                    inputs.forEach((input) => {
                        input.disabled = !!newValue;
                    });
            }
        }
    }

    public getFormData(): object {
        let formData: any = {};

        let fdos = this.querySelectorAll<HTMLEFormDataObjectElement | HTMLEFormDataArrayElement>(":scope > e-fdobject, :scope > e-fdarray");
        fdos.forEach((fdo) => {
            formData[fdo.name] = fdo.getFormData();
        });

        let formElements = Array.from(this.querySelectorAll("*:not(e-fdobject):not(e-fdarray) input, *:not(e-fdobject):not(e-fdarray) select"));
        let tempForm = document.createElement("form");
        tempForm.append(...formElements);

        let tempFormData = new FormData(tempForm);
        Array.from(tempFormData.keys()).forEach(
            (key) => {
                formData[key] = tempFormData.get(key);
            }
        );

        return formData;
    }
}
