import { Input, Key } from "engine/core/input/Input";
import { RegisterCustomHTMLElement, bindShadowRoot, GenerateAttributeAccessors } from "engine/editor/elements/HTMLElement";
import { isHTMLEDropzoneElement } from "./Dropzone";

export { isHTMLEDraggableElement };
export { HTMLEDraggableElement };

function isHTMLEDraggableElement(obj: any): obj is HTMLEDraggableElement {
    return obj instanceof Node && obj.nodeType === obj.ELEMENT_NODE && (obj as Element).tagName.toLowerCase() === "e-draggable";
}

@RegisterCustomHTMLElement({
    name: "e-draggable"
})
@GenerateAttributeAccessors([
    {name: "selected", type: "boolean"},
    {name: "dragged", type: "boolean"},
    {name: "type", type: "string"}
])
class HTMLEDraggableElement extends HTMLElement {
    
    public selected!: boolean;
    public dragged!: boolean;
    public type!: string;

    public data: any;

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

        this.data = null;
    }
    
    public connectedCallback() {
        this.tabIndex = this.tabIndex;
        this.draggable = true;

        this.addEventListener("dragstart", (event: DragEvent) => {
            let selectedDraggables = Array.from(document.querySelectorAll<HTMLEDraggableElement>("e-draggable[selected]"));
            let selectedDraggablesData: any[] = [];
            selectedDraggables.forEach((selectedDraggable) => {
                selectedDraggablesData.push(selectedDraggable.data);
            });
            let dataTransfer = event.dataTransfer;
            if (dataTransfer !== null) {
                dataTransfer.setData("text/plain", JSON.stringify(selectedDraggablesData));
            }
            this.dragged = true;
        });
        
        this.addEventListener("dragend", () => {
            this.dragged = false;
            let selectedDraggables = Array.from(document.querySelectorAll<HTMLEDraggableElement>("e-draggable[selected]"));
            selectedDraggables.forEach((selectedDraggable) => {
                selectedDraggable.selected = false;
            });
        });
        
        this.addEventListener("mousedown", (event: MouseEvent) => {
            if (!event.shiftKey) {
                if (!this.selected) {
                    let selectedDraggables = Array.from(document.querySelectorAll<HTMLEDraggableElement>("e-draggable[selected]"));
                    selectedDraggables.forEach((selectedDraggable) => {
                        selectedDraggable.selected = false;
                    });
                    this.selected = true;
                }
            }
            else {
                this.selected = true;
            }
        });
        
        this.addEventListener("mouseup", (event: MouseEvent) => {
            if (!event.shiftKey) {
                let selectedDraggables = Array.from(document.querySelectorAll<HTMLEDraggableElement>("e-draggable[selected]"));
                selectedDraggables.forEach((selectedDraggable) => {
                    if (selectedDraggable !== this) {
                        selectedDraggable.selected = false;
                    }
                });
            }
        });
    }
}

Input.initialize(document.documentElement);
