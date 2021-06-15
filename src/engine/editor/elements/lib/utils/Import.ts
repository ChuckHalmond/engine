import { GenerateAttributeAccessors, RegisterCustomHTMLElement } from "engine/editor/elements/HTMLElement";

export { ImportElement };

@RegisterCustomHTMLElement({
    name: 'e-import'
})
@GenerateAttributeAccessors([
    {name: 'src', type: 'string'}
])
class ImportElement extends HTMLElement {

    public src!: string | null;

    constructor() {
        super();
    }
    
    public connectedCallback(): void {
        const importRequest = async (src: string) => {
            this.innerHTML = new DOMParser().parseFromString(
                await fetch(src).then((response: Response) => {
                    if (response.ok) {
                        return response.text();
                    }
                    else {
                        throw new Error(response.statusText);
                    }
                }), "text/html"
            ).body.innerHTML;
            this.dispatchEvent(new Event('loaded'));
        }
        if (this.src) {
            importRequest(this.src);
        }
    }
}