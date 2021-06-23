import { RegisterCustomHTMLElement, bindShadowRoot, GenerateAttributeAccessors } from "engine/editor/elements/HTMLElement";
import { HTMLEDraggableElement } from "./Draggable";

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
])
class HTMLEDropzoneElement extends HTMLElement {

    public draggedover!: boolean;

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
}

document.addEventListener("dragover", (event) => {
    let target = event.target;
    if (isHTMLEDropzoneElement(target)) {
        event.preventDefault();
    }
});

document.addEventListener("dragenter", (event) => {
    let target = event.target;
    if (isHTMLEDropzoneElement(target)) {
        target.draggedover = true;
    }
});

document.addEventListener("dragleave", (event) => {
    let target = event.target;
    if (isHTMLEDropzoneElement(target)) {
        target.draggedover = false;
    }
});

document.addEventListener("drop", (event) => {
    let target = event.target as any;
    if (isHTMLEDropzoneElement(target)) {
        let selectedDraggables = Array.from(document.querySelectorAll<HTMLEDraggableElement>("e-draggable[selected]"));
        selectedDraggables.forEach((selectedDrag) => {
            selectedDrag.remove();
            target.appendChild(selectedDrag);
            selectedDrag.dragged = false;
        });
        let dataTransfer = event.dataTransfer;
        if (dataTransfer) {
            target.dispatchEvent(new CustomEvent("datatransfer", {
                detail: {
                    data: JSON.parse(dataTransfer.getData("text/plain"))
                }
            }));
        }
        target.draggedover = false;
    }
});