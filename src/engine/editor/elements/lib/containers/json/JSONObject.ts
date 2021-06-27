import { RegisterCustomHTMLElement, GenerateAttributeAccessors, bindShadowRoot } from "engine/editor/elements/HTMLElement";
import { HTMLEJSONArrayElement, isHTMLEJSONArrayElement } from "./JSONArray";

export { HTMLEJSONObjectElement };
export { isHTMLEJSONObjectElement };

function isHTMLEJSONObjectElement(elem: any): elem is HTMLEJSONObjectElement {
    return  elem instanceof Node && elem.nodeType === elem.ELEMENT_NODE && (elem as Element).tagName.toLowerCase() === "e-jsonobject";
}

@RegisterCustomHTMLElement({
    name: "e-jsonobject"
})
@GenerateAttributeAccessors([
    {name: "name", type: "string"},
    {name: "disabled", type: "boolean"},
])
class HTMLEJSONObjectElement extends HTMLElement {

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
            <fieldset part="fieldset">
                <details part="details">
                    <summary part="summary">
                        <label part="label">JSONObject</label>
                    </summary>
                    <slot></slot>
                </details>
            </fieldset>
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

    public getJSON() {
        let json: any = {};

        const jsonObjects = this.querySelectorAll<HTMLEJSONObjectElement | HTMLEJSONArrayElement>(":scope > e-jsonarray, :scope > e-jsonobject");
        jsonObjects.forEach((jsonObject) => {
            json[jsonObject.name] = jsonObject.getJSON();
            jsonObject.disabled = true;
        });

        const form = document.createElement("form");
        form.innerHTML = this.innerHTML;
        let data = new FormData(form);
        Array.from(data.keys()).forEach(
            (key) => {
                json[key] = data.get(key);
            }
        );
        
        jsonObjects.forEach((jsonObject) => {
            jsonObject.disabled = false;
        });

        return json;
    }
}
