import { RegisterCustomHTMLElement, GenerateAttributeAccessors, bindShadowRoot } from "engine/editor/elements/HTMLElement";
import { HTMLEDraggableElement, isHTMLEDraggableElement } from "./Draggable";
import { HTMLEDragzoneElement } from "./Dragzone";

export { DataTransferEvent };
export { isHTMLEDropzoneElement };
export { HTMLEDropzoneElement };
export { BaseHTMLEDropzoneElement };

function isHTMLEDropzoneElement(obj: any): obj is HTMLEDropzoneElement {
    return obj instanceof Node && obj.nodeType === obj.ELEMENT_NODE && (obj as Element).tagName.toLowerCase() === "e-dropzone";
}

interface HTMLEDropzoneElement extends HTMLElement {
    selectedDraggables: HTMLEDraggableElement[]
    draggables: HTMLEDraggableElement[];
    dragovered: DropzoneDragoveredType | null;
    multiple: boolean;
    disabled: boolean;
    droptest: ((draggables: HTMLEDraggableElement[]) => void) | null;
    addDraggables(draggables: HTMLEDraggableElement[], position: number): void;
    removeDraggables(draggables: HTMLEDraggableElement[]): void;
}

type DropzoneDragoveredType = "self" | "draggable" | "appendarea";

type DataTransferEvent = CustomEvent<{
    draggables: HTMLEDraggableElement[];
    position: number;
    success: boolean;
    statusText: string;
}>;

@RegisterCustomHTMLElement({
    name: "e-dropzone",
    observedAttributes: ["placeholder", "label"]
})
@GenerateAttributeAccessors([
    {name: "dragovered", type: "string"},
    {name: "placeholder", type: "string"},
    {name: "disabled", type: "boolean"},
    {name: "multiple", type: "boolean"},
    {name: "label", type: "string"},
])
class BaseHTMLEDropzoneElement extends HTMLElement implements HTMLEDropzoneElement {
    
    public dragovered!: DropzoneDragoveredType | null;
    public placeholder!: string;
    public multiple!: boolean;
    public disabled!: boolean;

    public droptest!: ((draggables: HTMLEDraggableElement[]) => void) | null;
    public value: any;

    public draggables: HTMLEDraggableElement[];

    constructor() {
        super();
        
        bindShadowRoot(this, /*html*/`
            <style>
                :host {
                    display: block;
                    border: 1px dashed gray;
                    cursor: pointer;
                }

                :host(:focus) {
                    outline: 1px auto black;
                }

                :host([disabled]) {
                    pointer-events: none;
                }

                :host(:empty) [part~="container"] {
                    display: none !important;
                }

                [part~="container"] {
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    padding: 2px;
                }

                ::slotted(e-draggable:not(:only-child)) {
                    margin-top: 2px;
                    margin-bottom: 2px;
                }

                :host(:not([multiple]):not(:empty)) [part="appendarea"],
                :host(:not(:empty):not([dragovered])) [part="appendarea"] {
                    display: none !important;
                }

                [part="appendarea"] {
                    display: block;
                    margin: 2px;
                    border-radius: 4px;
                    border: 1px dotted black;
                }

                :host(:not([dragovered="appendarea"])) [part="appendarea"] {
                    border-color: transparent;
                }
                
                [part="placeholder"] {
                    display: inline-block;
                    color: grey;
                    pointer-events: none;
                }
            </style>
            <div part="container">
                <slot></slot>
            </div>
            <div part="appendarea">
                <span part="placeholder">&nbsp;</span>
            </div>
            `
        );
        this.draggables = [];
        this.droptest = null;
    }

    public get selectedDraggables(): HTMLEDraggableElement[] {
        return this.draggables.filter(draggable => draggable.selected);
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
                this.draggables.forEach((draggable) => {
                    draggable.draggable = false;
                });
            });
        }

        const appendAreaPart = this.shadowRoot!.querySelector<HTMLDivElement>("[part='appendarea']");

        this.addEventListener("keydown", (event: KeyboardEvent) => {
            switch (event.key) {
                case "Delete":
                    let selectedDraggables = this.draggables.filter(draggable => draggable.selected);
                    if (selectedDraggables.length > 0) {
                        this.removeDraggables(selectedDraggables);
                    }
                    else if (this == event.target) {
                        this.removeDraggables(this.draggables);
                    }
                    event.stopPropagation();
                    break;
                case "Escape":
                    this.selectedDraggables.forEach(draggable => draggable.selected = false);
                    this.focus();
                    break;
            }
        });

        this.addEventListener("focusout", (event: FocusEvent) => {
            let relatedTarget = event.relatedTarget as any;
            if (!this.contains(relatedTarget)) {
                this.draggables.forEach((thisDraggable) => {
                    thisDraggable.selected = false;
                });
            }
        });
        
        this.addEventListener("mousedown", (event: MouseEvent) => {
            let target = event.target as any;
            if (event.button === 0) {
                if (this.draggables.includes(target)) {
                    if (!event.shiftKey) {
                        if (!target.selected) {
                            this.draggables.forEach((thisDraggable) => {
                                thisDraggable.selected = (thisDraggable == target);
                            });
                        }
                        if (event.ctrlKey) {
                            target.selected = !target.selected;
                        }
                    }
                    else {
                        let startRangeIndex = Math.min(this.draggables.indexOf(this.selectedDraggables[0]), this.draggables.indexOf(target));
                        let endRangeIndex = Math.max(this.draggables.indexOf(this.selectedDraggables[0]), this.draggables.indexOf(target));
                        this.draggables.forEach((thisDraggable, thisDraggableIndex) => {
                            thisDraggable.selected = (thisDraggableIndex >= startRangeIndex && thisDraggableIndex <= endRangeIndex);
                        });
                        target.selected = true;
                    }
                }
                else {
                    this.draggables.forEach((thisDraggable) => {
                        thisDraggable.selected = false;
                    });
                }
            }
        });
        
        this.addEventListener("mouseup", (event: MouseEvent) => {
            let target = event.target as any;
            if (event.button === 0) {
                if (this.draggables.includes(target)) {
                    if (!event.shiftKey && !event.ctrlKey) {
                        this.draggables.forEach((thisDraggable) => {
                            thisDraggable.selected = (thisDraggable == target);
                        });
                    }
                }
            }
        });

        this.addEventListener("dragover", (event: DragEvent) => {
            event.preventDefault();
        });

        this.shadowRoot!.addEventListener("dragover", (event) => {
            event.preventDefault();
        });

        this.addEventListener("dragenter", (event: DragEvent) => {
            let target = event.target as any;
            if (this.draggables.includes(target)) {
                target.dragovered = true;
                this.dragovered = "draggable";
            }
            else {
                this.dragovered = "self";
            }
            event.preventDefault();
        });

        this.shadowRoot!.addEventListener("dragenter", (event) => {
            let target = event.target as any;
            if (target == appendAreaPart) {
                this.dragovered = "appendarea";
            }
            event.preventDefault();
        });

        this.addEventListener("dragleave", (event: DragEvent) => {
            let relatedTarget = event.relatedTarget as any;
            let target = event.target as any;
            if (target == this || this.draggables.includes(target)) {
                if (target == this) {
                    if (appendAreaPart) {
                        this.dragovered = "self";
                    }
                    if (!this.draggables.includes(relatedTarget)) {
                        this.dragovered = null;
                    }
                }
                else {
                    target.dragovered = false;
                }
            }
            event.preventDefault();
        });

        this.shadowRoot!.addEventListener("dragleave", (event) => {
            let target = event.target as any;
            if (target == appendAreaPart) {
                this.dragovered = "self";
            }
            event.preventDefault();
        });
        
        this.addEventListener("drop", (event) => {
            let target = event.target as any;
            if (target == this || this.draggables.includes(target)) {
                let dropIndex = this.draggables.length;
                if (target == this) {
                    this.dragovered = null;
                }
                else {
                    target.dragovered = false;
                    dropIndex = this.draggables.indexOf(target);
                }

                let dataTransfer = event.dataTransfer;
                if (dataTransfer) {
                    let dragzoneId = dataTransfer.getData("text/plain");
                    let dragzone = document.getElementById(dragzoneId) as HTMLEDragzoneElement;
                    if (dragzone) {
                        let selectedDraggables = dragzone.selectedDraggables;
                        if (selectedDraggables) {
                            selectedDraggables.forEach((selectedDraggable) => {
                                selectedDraggable.dragged = false;
                                selectedDraggable.selected = false;
                            });
                            this.addDraggables(selectedDraggables, dropIndex);
                        }
                    }
                }
            }
            this.dragovered = null;
            event.preventDefault();
        });
    }

    public attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
        if (newValue !== oldValue) {
            switch (name) {
                case "placeholder":
                    if (oldValue !== newValue) {
                        const placeholderPart = this.shadowRoot?.querySelector("[part~=placeholder]");
                        if (placeholderPart) {
                            placeholderPart.textContent = newValue;
                        }
                    }
                    break;
            }
        }
    }

    public addDraggables(draggables: HTMLEDraggableElement[], position: number): HTMLEDraggableElement[] | null {
        if (draggables.length > 0) {
            let firstDraggable = draggables[0];

            let dataTransferSuccess = true;
            let dataTransferStatusText = "";
            try {
                if (this.droptest) {
                    this.droptest(draggables);
                }
            }
            catch (error) {
                dataTransferStatusText = error.message;
                dataTransferSuccess = false;
            }
            
            let newDraggables = [];
            let insertionIndex = -1;
            if (dataTransferSuccess) {
                if (this.multiple) {
                    draggables.forEach((draggable) => {
                        let newDraggable = draggable.cloneNode(true) as HTMLEDraggableElement;
                        if (position > -1 && position < this.draggables.length) {
                            this.draggables[position].insertAdjacentElement("beforebegin", newDraggable);
                            insertionIndex = (insertionIndex < 0) ? position : insertionIndex;
                        }
                        else {
                            this.appendChild(newDraggable);
                            insertionIndex = (insertionIndex < 0) ? this.draggables.length - 1 : insertionIndex;
                        }
                        newDraggables.push(newDraggable);
                    });
                }
                else {
                    let newDraggable = firstDraggable.cloneNode(true) as HTMLEDraggableElement;
                    if (this.draggables.length > 0) {
                        this.replaceChild(newDraggable, this.draggables[0]);
                    }
                    else {
                        this.appendChild(newDraggable);
                    }
                    newDraggables.push(newDraggable);
                    insertionIndex = 0;
                }
            }
            let dataTransferEvent: DataTransferEvent = new CustomEvent("datatransfer", {
                bubbles: true,
                detail: {
                    draggables: newDraggables,
                    position: insertionIndex,
                    success: dataTransferSuccess,
                    statusText: dataTransferStatusText,
                }
            });
            this.dispatchEvent(dataTransferEvent);
            return newDraggables;
        }
        return null;
    }

    public removeDraggables(draggables: HTMLEDraggableElement[]) {
        let thisDraggables = Array.from(this.children).filter(isHTMLEDraggableElement);
        thisDraggables.forEach((draggable) => {
            if (draggables.includes(draggable)) {
                draggable.remove();
            }
        });
        this.dispatchEvent(new CustomEvent("dataclear", {bubbles: true}));
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "e-dropzone": HTMLEDropzoneElement,
    }
}

declare global {
    interface HTMLElementEventMap {
        "datatransfer": DataTransferEvent,
        "dataclear": Event
    }
}