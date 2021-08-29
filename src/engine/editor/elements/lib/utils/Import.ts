import { GenerateAttributeAccessors, RegisterCustomHTMLElement } from "engine/editor/elements/HTMLElement";

export { HTMLEImportElement };
export { HTMLEImportElementBase };

interface HTMLEImportElement extends HTMLElement {
    src: string;
}

@RegisterCustomHTMLElement({
    name: "e-import"
})
@GenerateAttributeAccessors([
    {name: "src", type: "string"}
])
class HTMLEImportElementBase extends HTMLElement {

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
            this.dispatchEvent(new CustomEvent("e-load"));
        }
        if (this.src) {
            importRequest(this.src);
        }
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "e-import": HTMLEImportElement,
    }
}

declare global {
    interface HTMLElementEventMap {
        "e-load": CustomEvent
    }
}