import { RegisterCustomHTMLElement, bindShadowRoot, GenerateAttributeAccessors } from "engine/editor/elements/HTMLElement";
import { HTMLEDraggableElement } from "../Draggable";
import { EDataTransferEvent, HTMLEDropzoneElement } from "../Dropzone";

export { isHTMLEInputDropzoneElement };
export { HTMLEInputDropzoneElement };

function isHTMLEInputDropzoneElement(obj: any): obj is HTMLEInputDropzoneElement {
    return obj instanceof Node && obj.nodeType === obj.ELEMENT_NODE && (obj as Element).tagName.toLowerCase() === "e-input-dropzone";
}

@RegisterCustomHTMLElement({
    name: "e-input-dropzone"
})
@GenerateAttributeAccessors([
    {name: "name", type: "string"}
])
class HTMLEInputDropzoneElement extends HTMLEDropzoneElement {

    public name!: string;

    constructor() {
        super();
    }

    public connectedCallback() {
        super.connectedCallback();

    }
}