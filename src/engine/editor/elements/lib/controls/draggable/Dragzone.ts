import { RegisterCustomHTMLElement, bindShadowRoot, isTagElement } from "engine/editor/elements/HTMLElement";
import { HTMLEDraggableElement } from "./Draggable";

export { HTMLEDragzoneElement };
export { HTMLEDragzoneElementBase };

interface HTMLEDragzoneElement extends HTMLElement {
    draggables: HTMLEDraggableElement[];
    selectedDraggables: HTMLEDraggableElement[];
    label: string;
}

@RegisterCustomHTMLElement({
    name: "e-dragzone"
})
class HTMLEDragzoneElementBase extends HTMLElement implements HTMLEDragzoneElement {

    public label!: string;

    public draggables: HTMLEDraggableElement[];
    public selectedDraggables: HTMLEDraggableElement[];

    constructor() {
        super();

        bindShadowRoot(this, /*template*/`
            <style>
                :host {
                    display: block;
                }

                :host([disabled]) {
                    pointer-events: none;
                }

                [part~="container"]:empty {
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
            </style>
            <div part="container">
                <span part="label"/></span>
                <slot></slot>
            </div>
        `);
        this.draggables = [];
        this.selectedDraggables = [];
    }

    public selectDraggable(draggable: HTMLEDraggableElement): void {
        draggable.selected = true;
        this.selectedDraggables.push(draggable);
    }

    public unselectDraggable(draggable: HTMLEDraggableElement): void {
        let index = this.selectedDraggables.indexOf(draggable);
        if (index > -1) {
            draggable.selected = false;
            this.selectedDraggables.splice(index, 1);
        }
    }

    public clearSelection(): void {
        this.selectedDraggables.splice(0, this.selectedDraggables.length).forEach((draggable) => {
            draggable.selected = false;
        });
    }
    
    public connectedCallback() {
        this.tabIndex = this.tabIndex;

        const slot = this.shadowRoot?.querySelector("slot");
        if (slot) {
            slot.addEventListener("slotchange", () => {
                const draggables = slot.assignedElements().filter(
                    elem => isTagElement("e-draggable", elem)
                ) as HTMLEDraggableElement[];
                this.draggables = draggables;
                this.draggables.forEach((draggable) => {
                    draggable.draggable = true;
                });
            });
        }

        this.addEventListener("keydown", (event: KeyboardEvent) => {
            switch (event.key) {
                case "Escape":
                    this.clearSelection();
                    this.focus();
                    break;
            }
        });

        this.addEventListener("dragstart", (event: DragEvent) => {
            let target = event.target as any;
            if (this.draggables.includes(target)) {
                this.selectedDraggables.forEach((thisSelectedDraggable) => {
                    thisSelectedDraggable.dragged = true;
                });
                let dataTransfer = event.dataTransfer;
                if (dataTransfer) {
                    dataTransfer.setData("text/plain", this.id);
                }
            }
        });
        
        this.addEventListener("dragend", (event: DragEvent) => {
            let target = event.target as any;
            if (this.draggables.includes(target)) {
                let thisDraggedDraggables = this.draggables.filter(draggable => draggable.dragged);
                thisDraggedDraggables.forEach((thisDraggedDraggable) => {
                    thisDraggedDraggable.dragged = false;
                });
            }
        });

        this.addEventListener("focusout", (event: FocusEvent) => {
            let relatedTarget = event.relatedTarget as any;
            if (!this.contains(relatedTarget)) {
                this.clearSelection();
            }
        });
        
        this.addEventListener("mousedown", (event: MouseEvent) => {
            let target = event.target as any;
            if (event.button === 0) {
                if (this.draggables.includes(target)) {
                    if (!event.shiftKey && !event.ctrlKey) {
                        if (!target.selected) {
                            this.clearSelection();
                            this.selectDraggable(target);
                        }
                    }
                    else if (event.ctrlKey) {
                        (!target.selected) ?
                            this.selectDraggable(target) :
                            this.unselectDraggable(target);
                    }
                    else if (event.shiftKey) {
                        let startRangeIndex = Math.min(
                            this.draggables.indexOf(this.selectedDraggables[0]),
                            this.draggables.indexOf(target)
                        );
                        let endRangeIndex = Math.max(
                            this.draggables.indexOf(this.selectedDraggables[0]),
                            this.draggables.indexOf(target)
                        );
                        this.draggables.forEach((thisDraggable, thisDraggableIndex) => {
                            (thisDraggableIndex >= startRangeIndex && thisDraggableIndex <= endRangeIndex) ? 
                                this.selectDraggable(thisDraggable) :
                                this.unselectDraggable(thisDraggable);
                        });
                    }
                }
                else {
                    this.clearSelection();
                }
            }
        });
        
        this.addEventListener("mouseup", (event: MouseEvent) => {
            let target = event.target as any;
            if (event.button === 0) {
                if (this.draggables.includes(target)) {
                    if (!event.shiftKey && !event.ctrlKey) {
                        this.draggables.forEach((thisDraggable) => {
                            if (thisDraggable !== target) {
                                this.unselectDraggable(thisDraggable);
                            }
                        });
                    }
                }
            }
        });
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "e-dragzone": HTMLEDragzoneElement,
    }
}