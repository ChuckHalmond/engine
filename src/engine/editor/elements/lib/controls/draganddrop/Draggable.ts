import { RegisterCustomHTMLElement, bindShadowRoot, GenerateAttributeAccessors } from "engine/editor/elements/HTMLElement";

export { isHTMLEDraggableElement };
export { HTMLEDraggableElement };

function isHTMLEDraggableElement(obj: any): obj is HTMLEDraggableElement {
    return obj instanceof Node && obj.nodeType === obj.ELEMENT_NODE && (obj as Element).tagName.toLowerCase() === "e-draggable";
}

@RegisterCustomHTMLElement({
    name: "e-draggable"
})
@GenerateAttributeAccessors([
    {name: "dropaction", type: "string"},
    {name: "ref", type: "string"},
    {name: "selected", type: "boolean"},
    {name: "dragged", type: "boolean"},
    {name: "droppreview", type: "boolean"},
    {name: "type", type: "string"}
])
class HTMLEDraggableElement extends HTMLElement {
    
    public selected!: boolean;
    public dragged!: boolean;
    
    public ref!: string;
    public type!: string;

    public droppreview!: boolean;

    public data: any;

    constructor() {
        super();

        bindShadowRoot(this, /*template*/`
            <style>
                :host {
                    display: inline-block;
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

        this.addEventListener("dragstart", (event: DragEvent) => {
            let draggables = Array.from(
                document.querySelectorAll<HTMLEDraggableElement>("e-draggable[selected]")
            );
            let draggablesData: any[] = [];
            draggables.forEach((draggable) => {
                draggablesData.push(draggable.data);
            });
            let dataTransfer = event.dataTransfer;
            if (dataTransfer !== null) {
                let data = JSON.stringify(draggablesData);
                dataTransfer.setData("text/plain", data);
            }
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