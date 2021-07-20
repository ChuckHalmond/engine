import { GenerateAttributeAccessors, RegisterCustomHTMLElement } from "engine/editor/elements/HTMLElement";

export { isHTMLEImportElement };
export { HTMLEImportElement };
export { BaseHTMLEImportElement };

function isHTMLEImportElement(obj: any): obj is HTMLEImportElement {
    return obj instanceof Node && obj.nodeType === obj.ELEMENT_NODE && (obj as Element).tagName.toLowerCase() === "e-import";
}

interface HTMLEImportElement extends HTMLElement {
    src: string;
}

@RegisterCustomHTMLElement({
    name: "e-import"
})
@GenerateAttributeAccessors([
    {name: "src", type: "string"}
])
class BaseHTMLEImportElement extends HTMLElement {

    public src!: string;

    constructor() {
        super();
    }
    
    public connectedCallback(): void {
        const importRequest = async (src: string) => {
            this.outerHTML = await fetch(src).then((response: Response) => {
                if (response.ok) {
                    return response.text();
                }
                else {
                    throw new Error(response.statusText);
                }
            });
            this.dispatchEvent(new Event("loaded"));
        }
        if (this.src) {
            importRequest(this.src);
        }
    }
}