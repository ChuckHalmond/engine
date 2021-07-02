import { RegisterCustomHTMLElement, bindShadowRoot, GenerateAttributeAccessors } from "engine/editor/elements/HTMLElement";

export { isHTMLEDraggableElement };
export { HTMLEDraggableElement };
export { BaseHTMLEDraggableElement };

function isHTMLEDraggableElement(obj: any): obj is HTMLEDraggableElement {
    return obj instanceof Node && obj.nodeType === obj.ELEMENT_NODE && (obj as Element).tagName.toLowerCase() === "e-draggable";
}

interface HTMLEDraggableElement extends HTMLElement {
    selected: boolean;
    dragged: boolean;
    ref: string;
    type: string;
    value: string;
    dragovered: boolean;
    data: any;
}

@RegisterCustomHTMLElement({
    name: "e-draggable"
})
@GenerateAttributeAccessors([
    {name: "dropaction", type: "string"},
    {name: "ref", type: "string"},
    {name: "selected", type: "boolean"},
    {name: "dragged", type: "boolean"},
    {name: "dragovered", type: "boolean"},
    {name: "type", type: "string"},
    {name: "value", type: "string"},
])
class BaseHTMLEDraggableElement extends HTMLElement implements HTMLEDraggableElement {
    
    public selected!: boolean;
    public dragged!: boolean;

    public ref!: string;
    public type!: string;
    public dragovered!: boolean;
    public value!: string;

    public data: any;

    constructor() {
        super();

        bindShadowRoot(this, /*template*/`
            <style>
                :host {
                    display: block;
                    cursor: pointer;
                }

                slot {
                    pointer-events: none;
                    user-select: none;
                }
            </style>
            <slot></slot>
        `);

        this.data = null;
    }
    
    public connectedCallback() {
        this.tabIndex = this.tabIndex;
        this.draggable = true;

        this.addEventListener("dragstart", () => {
            let selectedDraggables = Array.from(
                document.querySelectorAll<HTMLEDraggableElement>("e-draggable[selected]")
            );
            let selectedData: any[] = [];
            selectedDraggables.forEach((selectedDraggable) => {
                selectedData.push(selectedDraggable.data);
            });
            this.dragged = true;
        });
        
        this.addEventListener("dragend", () => {
            this.dragged = false;
            let selectedDraggables = Array.from(
                document.querySelectorAll<HTMLEDraggableElement>("e-draggable[selected]")
            );
            selectedDraggables.forEach((selectedDraggable) => {
                selectedDraggable.selected = false;
            });
        });
        
        this.addEventListener("focusout", (event: FocusEvent) => {
            let relatedTarget = event.relatedTarget as any;
            if (!isHTMLEDraggableElement(relatedTarget)) {
                let selectedDraggables = Array.from(
                    document.querySelectorAll<HTMLEDraggableElement>("e-draggable[selected]")
                );
                selectedDraggables.forEach((selectedDrag) => {
                    selectedDrag.selected = false;
                });
            }
        });
        
        this.addEventListener("mousedown", (event: MouseEvent) => {
            if (!event.shiftKey) {
                if (!this.selected) {
                    let selectedDraggables = Array.from(
                        document.querySelectorAll<HTMLEDraggableElement>("e-draggable[selected]")
                    );
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
                let selectedDraggables = Array.from(
                    document.querySelectorAll<HTMLEDraggableElement>("e-draggable[selected]")
                );
                selectedDraggables.forEach((selectedDraggable) => {
                    if (selectedDraggable !== this) {
                        selectedDraggable.selected = false;
                    }
                });
            }
        });
    }
}