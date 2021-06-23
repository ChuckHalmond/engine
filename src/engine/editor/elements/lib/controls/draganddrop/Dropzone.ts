import { RegisterCustomHTMLElement, bindShadowRoot, GenerateAttributeAccessors } from "engine/editor/elements/HTMLElement";
import { HTMLEDraggableElement, isHTMLEDraggableElement } from "./Draggable";

export { isHTMLEDropzoneElement };
export { HTMLEDropzoneElement };

function isHTMLEDropzoneElement(obj: any): obj is HTMLEDropzoneElement {
    return obj instanceof Node && obj.nodeType === obj.ELEMENT_NODE && (obj as Element).tagName.toLowerCase() === "e-dropzone";
}

@RegisterCustomHTMLElement({
    name: "e-dropzone"
})
@GenerateAttributeAccessors([
    {name: "draggedover", type: "boolean"},
    {name: "allowedtypes", type: "string"},
])
class HTMLEDropzoneElement extends HTMLElement {

    public draggedover!: boolean;
    public allowedtypes!: string;

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

        this.addEventListener("dragover", (event: DragEvent) => {
            event.preventDefault();
        });
        
        this.addEventListener("dragenter", (event: DragEvent) => {
            let target = event.target as any;
            if (this.contains(target)) {
                this.draggedover = true;
            }
        });
        
        this.addEventListener("dragleave", (event: DragEvent) => {
            let relatedTarget = event.relatedTarget as any;
            if (!this.contains(relatedTarget)) {
                this.draggedover = false;
            }
        });
        
        this.addEventListener("drop", (event: DragEvent) => {
            let target = event.target as any;
            let selectedDraggables = Array.from(document.querySelectorAll<HTMLEDraggableElement>("e-draggable[selected]"));
            let selectedDraggablesTypes: Set<string> = new Set();

            selectedDraggables.forEach((selectedDrag) => {
                if (selectedDrag.parentElement !== this) {
                    if (selectedDrag.parentElement !== null) {
                        selectedDrag.parentElement.removeChild(selectedDrag);
                    }
                }
                if (isHTMLEDraggableElement(target)) {
                    if (target.compareDocumentPosition(selectedDrag) & Node.DOCUMENT_POSITION_FOLLOWING) {
                        target.insertAdjacentElement("beforebegin", selectedDrag);
                    }
                    else {
                        target.insertAdjacentElement("afterend", selectedDrag);
                    }
                }
                else {
                    this.appendChild(selectedDrag);
                }
                selectedDrag.dragged = false;
                selectedDraggablesTypes.add(selectedDrag.type);
            });

            let dataTransfer = event.dataTransfer;
            if (dataTransfer) {
                let thisAllowedTypesSet = new Set((this.allowedtypes || "").split(" "));
                let dataTransferSuccess = Array.from(selectedDraggablesTypes.values()).every(type => thisAllowedTypesSet.has(type));
                this.dispatchEvent(new CustomEvent("datatransfer", {
                    detail: {
                        success: dataTransferSuccess,
                        data: JSON.parse(dataTransfer.getData("text/plain"))
                    }
                }));
            }
            this.draggedover = false;
        });
    }
}
