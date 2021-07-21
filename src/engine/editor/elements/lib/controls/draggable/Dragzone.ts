import { RegisterCustomHTMLElement, bindShadowRoot, GenerateAttributeAccessors, isTagElement } from "engine/editor/elements/HTMLElement";
import { HTMLEDraggableElement, isHTMLEDraggableElement } from "./Draggable";

export { isHTMLEDragzoneElement };
export { HTMLEDragzoneElement };
export { BaseHTMLEDragzoneElement };

function isHTMLEDragzoneElement(obj: any): obj is HTMLEDragzoneElement {
    return obj instanceof Node && obj.nodeType === obj.ELEMENT_NODE && (obj as Element).tagName.toLowerCase() === "e-dragzone";
}

interface HTMLEDragzoneElement extends HTMLElement {
    draggables: HTMLEDraggableElement[];
}

@RegisterCustomHTMLElement({
    name: "e-dragzone",
    observedAttributes: ["label"]
})
@GenerateAttributeAccessors([
    {name: "dragovered", type: "boolean"},
    {name: "label", type: "string"},
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
                    display: inline-flex;
                    flex-direction: column;
                    vertical-align: top;
                }

                [part="label"] {
                    pointer-events: none;
                    padding-bottom: 4px;
                }
                
                ::slotted(e-draggable:not(:only-child):not(:first-child)) {
                    margin-top: 6px;
                }
            </style>
            <span part="label"/></span>
            <slot id="draggables">
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
            if (this == relatedTarget || !this.contains(relatedTarget)) {
                this.draggables.forEach((thisSelectedDraggable) => {
                    thisSelectedDraggable.selected = false;
                });
            }
        });
        
        this.addEventListener("mousedown", (event: MouseEvent) => {
            let target = event.target as any;
            if (this.draggables.includes(target)) {
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

    public attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
        if (newValue !== oldValue) {
            switch (name) {
                case "label":
                    if (oldValue !== newValue) {
                        const labelPart = this.shadowRoot?.querySelector("[part~=label]");
                        if (labelPart) {
                            labelPart.textContent = newValue;
                        }
                    }
                    break;
            }
        }
    }
}