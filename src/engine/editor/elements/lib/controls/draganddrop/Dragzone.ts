import { RegisterCustomHTMLElement, bindShadowRoot, GenerateAttributeAccessors, isTagElement } from "engine/editor/elements/HTMLElement";
import { HTMLEDraggableElement, isHTMLEDraggableElement } from "./Draggable";

export { EDataTransferEvent };
export { isHTMLEDragzoneElement };
export { HTMLEDragzoneElement };
export { BaseHTMLEDragzoneElement };

function isHTMLEDragzoneElement(obj: any): obj is HTMLEDragzoneElement {
    return obj instanceof Node && obj.nodeType === obj.ELEMENT_NODE && (obj as Element).tagName.toLowerCase() === "e-dragzone";
}

interface HTMLEDragzoneElement extends HTMLElement {
    draggables: HTMLEDraggableElement[];
}

type EDataTransferEvent = CustomEvent<{
    draggables: HTMLEDraggableElement[],
    position: number,
    success: boolean,
}>

@RegisterCustomHTMLElement({
    name: "e-dragzone"
})
@GenerateAttributeAccessors([
    {name: "dragovered", type: "boolean"},
    {name: "allowedtypes", type: "string"},
    {name: "multiple", type: "boolean"},
])
class BaseHTMLEDragzoneElement extends HTMLElement implements HTMLEDragzoneElement {

    public draggables: HTMLEDraggableElement[];

    constructor() {
        super();

        bindShadowRoot(this, /*template*/`
            <style>
                :host {
                    display: block;
                }
            </style>
            <slot id="draggables">
                <span part="placeholder"/></span>
            </slot>
        `);
        this.draggables = [];
    }
    
    public connectedCallback() {
        this.tabIndex = this.tabIndex;

        const slot = this.shadowRoot?.querySelector("slot");
        if (slot) {
            slot.addEventListener("slotchange", () => {
                const draggables = slot.assignedElements().filter(
                    elem => isHTMLEDraggableElement(elem)
                ) as HTMLEDraggableElement[];
                this.draggables = draggables;
            });
        }

        this.addEventListener("dragstart", () => {
            let thisSelectedDraggables = this.draggables.filter(draggable => draggable.selected);
            thisSelectedDraggables.forEach((thisSelectedDraggable) => {
                thisSelectedDraggable.dragged = true;
            });
        });
        
        this.addEventListener("dragend", () => {
            let thisDraggedDraggables = this.draggables.filter(draggable => draggable.dragged);
            thisDraggedDraggables.forEach((thisDraggedDraggable) => {
                thisDraggedDraggable.dragged = false;
            });
        });
        
        this.addEventListener("focusout", (event: FocusEvent) => {
            let relatedTarget = event.relatedTarget as any;
            if (!this.contains(relatedTarget)) {
                this.draggables.forEach((thisSelectedDraggable) => {
                    thisSelectedDraggable.selected = false;
                });
            }
        });
        
        this.addEventListener("mousedown", (event: MouseEvent) => {
            let target = event.target as any;
            if (this.draggables.includes(target)) {
                console.log(target);
                if (!event.shiftKey) {
                    if (!target.selected) {
                        this.draggables.forEach((thisDraggable) => {
                            thisDraggable.selected = (thisDraggable == target);
                        });
                    }
                }
                else {
                    target.selected = true;
                }
            }
        });
        
        this.addEventListener("mouseup", (event: MouseEvent) => {
            let target = event.target as any;
            if (this.draggables.includes(target)) {
                if (!event.shiftKey) {
                    this.draggables.forEach((thisDraggable) => {
                        thisDraggable.selected = (thisDraggable == target);
                    });
                }
            }
        });
    }
}