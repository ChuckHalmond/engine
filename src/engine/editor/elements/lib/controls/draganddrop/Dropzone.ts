import { RegisterCustomHTMLElement, bindShadowRoot, GenerateAttributeAccessors } from "engine/editor/elements/HTMLElement";
import { HTMLEDraggableElement, isHTMLEDraggableElement } from "./Draggable";

export { EDataTransferEvent };
export { isHTMLEDropzoneElement };
export { HTMLEDropzoneElement };
export { BaseHTMLEDropzoneElement };

function isHTMLEDropzoneElement(obj: any): obj is HTMLEDropzoneElement {
    return obj instanceof Node && obj.nodeType === obj.ELEMENT_NODE && (obj as Element).tagName.toLowerCase() === "e-dropzone";
}

interface HTMLEDropzoneElement extends HTMLElement {
    draggedover: boolean;
    allowedtypes: string;
    multiple: boolean;
    droppreview: boolean;
}

type EDataTransferEvent = CustomEvent<{
    draggables: HTMLEDraggableElement[],
    position: number,
    success: boolean,
    data: any
}>

@RegisterCustomHTMLElement({
    name: "e-dropzone"
})
@GenerateAttributeAccessors([
    {name: "draggedover", type: "boolean"},
    {name: "allowedtypes", type: "string"},
    {name: "multiple", type: "boolean"},
    {name: "droppreview", type: "boolean"},
])
class BaseHTMLEDropzoneElement extends HTMLElement implements HTMLEDropzoneElement {

    public draggedover!: boolean;
    public allowedtypes!: string;
    public multiple!: boolean;
    public droppreview!: boolean;

    constructor() {
        super();

        bindShadowRoot(this, /*template*/`
            <style>
                :host {
                    display: block;
                }

                [part~="clear"] {
                    cursor: pointer;
                }

                :host [part~="placeholder"]::after {
                    content: "Drag a column here..";
                    font-size: 0.9em;
                    display: inline-block;
                }

                :host(:empty) [part~="clear"],
                :host(:not(:empty)) [part~="placeholder"] {
                    display: none;
                }

                [part~="clear"]::after {
                    display: inline-block;
                    content: "[x]";
                }

                ::slotted(:not(e-draggable)) {
                    pointer-events: none;
                    user-select: none;
                }
            </style>
            <slot id="draggables"></slot>
            <span part="placeholder"/></span>
            <span part="clear"/></span>
        `);
    }
    
    public connectedCallback() {
        this.tabIndex = this.tabIndex;

        const clear = this.shadowRoot!.querySelector("[part~='clear']");
        if (clear) {
            clear.addEventListener("click", () => {
                this.dispatchEvent(new CustomEvent("cleardata", {bubbles: true}));
                let childDraggables = Array.from(this.children).filter(isHTMLEDraggableElement);
                childDraggables.forEach((childDraggable) => {
                    childDraggable.remove();
                });
            });
        }

        this.addEventListener("dragover", (event: DragEvent) => {
            event.preventDefault();
        }, {capture: true});

        this.shadowRoot!.addEventListener("dragover", (event) => {
            event.preventDefault();
        }, {capture: true});
        
        this.addEventListener("dragenter", (event: DragEvent) => {
            let target = event.target as any;
            this.draggedover = true;
            if (target == this) {
                this.droppreview = true;
            }
            else if (isHTMLEDraggableElement(target)) {
                target.droppreview = true;
            }
            event.preventDefault();
        }, {capture: true});
        
        this.shadowRoot!.addEventListener("dragenter", (event) => {
            event.preventDefault();
        }, {capture: true});
        
        this.addEventListener("dragleave", (event: DragEvent) => {
            let target = event.target as any;
            let relatedTarget = event.relatedTarget as any;
            if (!this.contains(relatedTarget)) {
                this.draggedover = false;
            }
            if (target == this) {
                this.droppreview = false;
            }
            else if (isHTMLEDraggableElement(target)) {
                target.droppreview = false;
            }
            event.preventDefault();
        }, {capture: true});
        
        this.addEventListener("drop", (event: DragEvent) => {
            let target = event.target as any;

            if (target == this) {
                this.droppreview = false;
            }
            else if (isHTMLEDraggableElement(target)) {
                target.droppreview = false;
            }
            event.preventDefault();

            let draggables = Array.from(
                document.querySelectorAll<HTMLEDraggableElement>("e-draggable[selected]")
            );
            let dragged = document.querySelector<HTMLEDraggableElement>("e-draggable[dragged]");

            let draggablesTypes = new Set<string>();
            draggables.forEach((draggable) => {
                draggable.dragged = false;
                draggable.selected = false;
                draggablesTypes.add(draggable.type);
            });

            let thisAllowedTypes = new Set((this.allowedtypes || "").split(" "));
            
            let success = thisAllowedTypes.has("*") ||
                Array.from(
                    draggablesTypes.values()
                ).every(
                    type => thisAllowedTypes.has(type)
                );
            
            let position = -1;
            if (success) {
                if (this.multiple) {
                    draggables.forEach((draggable) => {
                        let ref = (this.querySelector(`[ref="${draggable.ref}"]`) || draggable.cloneNode(true)) as HTMLElement;

                        if (target == this) {
                            this.appendChild(ref);
                            position = (position < 0) ? this.childElementCount - 1 : position;
                        }
                        else if (isHTMLEDraggableElement(target)) {
                            target.insertAdjacentElement("beforebegin", ref);
                            position = (position < 0) ? Array.from(this.children).indexOf(target) - 1 : position;
                        }
                    });
                }
                else {
                    if (dragged) {
                        let ref = (this.querySelector(`[ref="${dragged.ref}"]`) || dragged.cloneNode(true)) as HTMLElement;
                        
                        if (this.firstChild) {
                            this.replaceChild(ref, this.firstChild);
                        }
                        else {
                            this.appendChild(ref);
                        }
                    }
                    position = 0;
                }
                
                let dataTransfer = event.dataTransfer;
                if (dataTransfer) {
                    let data = JSON.parse(dataTransfer.getData("text/plain"));
                    let event: EDataTransferEvent = new CustomEvent("datatransfer", {
                        bubbles: true,
                        detail: {
                            draggables: draggables,
                            position: position,
                            success: success,
                            data: data
                        } 
                    });
                    this.dispatchEvent(event);
                }
                this.draggedover = false;
            }
        });
    }
}