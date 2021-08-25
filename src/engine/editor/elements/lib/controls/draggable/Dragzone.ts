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
                    this.selectedDraggables.forEach(draggable => draggable.selected = false);
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
                this.draggables.forEach((thisDraggable) => {
                    thisDraggable.selected = false;
                });
            }
        });
        
        this.addEventListener("mousedown", (event: MouseEvent) => {
            let target = event.target as any;
            if (event.button === 0) {
                if (this.draggables.includes(target)) {
                    if (!event.shiftKey && !event.ctrlKey) {
                        if (this.selectedDraggables.length == 0) {
                            target.selected = true;
                        }
                    }
                    else if (event.ctrlKey) {
                        target.selected = !target.selected;
                    }
                    else if (event.shiftKey) {
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
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "e-dragzone": HTMLEDragzoneElement,
    }
}