import { RegisterCustomHTMLElement, GenerateAttributeAccessors, isTagElement, HTMLElementConstructor } from "engine/editor/elements/HTMLElement";
import { HTMLEDraggableElement, isHTMLEDraggableElement } from "./Draggable";
import { BaseHTMLEDragzoneElement, HTMLEDragzoneElement } from "./Dragzone";

export { DataTransferEvent };
export { isHTMLEDropzoneElement };
export { HTMLEDropzoneElement };
export { BaseHTMLEDropzoneElement };

function isHTMLEDropzoneElement(obj: any): obj is HTMLEDropzoneElement {
    return obj instanceof Node && obj.nodeType === obj.ELEMENT_NODE && (obj as Element).tagName.toLowerCase() === "e-dropzone";
}

interface HTMLEDropzoneElement extends HTMLEDragzoneElement {
    dragovered: boolean;
    multiple: boolean;
    droptest: ((draggable: HTMLEDraggableElement) => void) | null;
    addDraggables(draggables: HTMLEDraggableElement[], position: number): void;
    removeDraggables(draggables: HTMLEDraggableElement[]): void;
}

type DataTransferEvent = CustomEvent<{
    draggables: HTMLEDraggableElement[];
    position: number;
    success: boolean;
    statusText: string;
}>

@RegisterCustomHTMLElement({
    name: "e-dropzone"
})
@GenerateAttributeAccessors([
    {name: "dragovered", type: "boolean"},
    {name: "multiple", type: "boolean"},
])
class BaseHTMLEDropzoneElement extends BaseHTMLEDragzoneElement implements HTMLEDropzoneElement {

    public dragovered!: boolean;
    public multiple!: boolean;

    public droptest!: ((draggable: HTMLEDraggableElement) => void) | null;

    public dragoveredDraggables: HTMLEDraggableElement | null;

    constructor() {
        super();
        
        this.shadowRoot!.querySelector("style")?.insertAdjacentHTML("beforeend",
            /*css*/`
                ::slotted([slot="input"]) {
                    display: none;
                }

                :host {
                    min-width: 120px;
                    min-height: 1.5em;
                    padding: 4px;
                    border: 1px dashed gray;
                }

                [part~="label"] {
                    color: gray;
                    font-size: 0.8em;
                }

                :host([dragovered]) {
                    border-color: transparent;
                    outline: 1px auto black;
                }
            `
        );

        this.shadowRoot!.querySelector("slot#draggables")?.insertAdjacentHTML("afterend",
            /*template*/`
                <slot name="input"></slot>
            `
        );

        this.droptest = null;
        this.dragoveredDraggables = null;
    }
    
    public connectedCallback() {
        super.connectedCallback();

        const inputSlot = this.shadowRoot!.querySelector<HTMLSlotElement>("slot[name='input']");
        if (inputSlot) {
            inputSlot.addEventListener("slotchange", () => {
                const input = inputSlot.assignedElements()[0];
                if (isTagElement("input", input)) {
                    this.addEventListener("datatransfer", (() => {
                        let thisDraggables = Array.from(this.querySelectorAll<HTMLEDraggableElement>("e-draggable"));
                        input.value = `[${thisDraggables.map(draggable => (draggable.value)).filter(draggable => draggable !== null).join(", ")}]`;
                    }) as EventListener);
                    this.addEventListener("dataclear", (() => {
                        let thisDraggables = Array.from(this.querySelectorAll<HTMLEDraggableElement>("e-draggable"));
                        input.value = `[${thisDraggables.map(draggable => draggable.value).filter(draggable => draggable !== null).join(", ")}]`;
                    }) as EventListener);
                }
            });
        }

        this.addEventListener("keydown", (event: KeyboardEvent) => {
            switch (event.key) {
                case "Delete":
                    let selectedDraggables = Array.from(
                        document.querySelectorAll<HTMLEDraggableElement>("e-draggable[selected]")
                    );
                    if (selectedDraggables.length == 0) {
                        this.removeDraggables(this.draggables);
                    }
                    else {
                        this.removeDraggables(selectedDraggables);
                    }
                    event.stopPropagation();
                    break;
            }
        });

        this.addEventListener("dragover", (event: DragEvent) => {
            event.preventDefault();
        });

        this.addEventListener("dragenter", (event: DragEvent) => {
            let target = event.target as any;
            if (isHTMLEDraggableElement(target)) {
                target.dragovered = true;
            }
            this.dragovered = true;
            event.preventDefault();
        });

        this.addEventListener("dragleave", (event: DragEvent) => {
            let relatedTarget = event.relatedTarget as any;
            let target = event.target as any;
            if (isHTMLEDraggableElement(target)) {
                target.dragovered = false;
            }
            if (!this.contains(relatedTarget)) {
                this.dragovered = false;
            }
            event.preventDefault();
        });
        
        this.addEventListener("drop", (event) => {
            let selectedDraggables = Array.from(
                document.querySelectorAll<HTMLEDraggableElement>("e-draggable[selected]")
            );
            let dropIndex = this.draggables.length;
            
            let target = event.target as any;
            if (isHTMLEDraggableElement(target)) {
                target.dragovered = false;
                dropIndex = this.draggables.indexOf(target);
            }
            
            selectedDraggables.forEach((selectedDraggable) => {
                selectedDraggable.dragged = false;
                selectedDraggable.selected = false;
            });

            this.addDraggables(selectedDraggables, dropIndex);

            this.dragovered = false;
            event.preventDefault();
        });
    }

    public addDraggables(draggables: HTMLEDraggableElement[], position: number) {
        if (draggables.length > 0) {
            let lastDraggable = draggables[draggables.length - 1];

            let dataTransferSuccess = true;
            let dataTransferStatusText = "";
            try {
                draggables.forEach((draggable) => {
                    if (this.droptest) {
                        this.droptest(draggable);
                    }
                });
            }
            catch (error) {
                dataTransferStatusText = error.message;
                dataTransferSuccess = false;
            }
            
            let insertionIndex = -1;
            if (dataTransferSuccess) {
                let thisDraggables = Array.from(this.children).filter(isHTMLEDraggableElement);
                if (this.multiple) {
                    draggables.forEach((draggable) => {
                        let draggableRef = (this.querySelector(`[ref="${draggable.ref}"]`) || draggable.cloneNode(true)) as HTMLElement;
                        if (position > -1 && position < thisDraggables.length) {
                            let pivotDraggable = thisDraggables[position];
                            pivotDraggable.insertAdjacentElement("beforebegin", draggableRef);
                            insertionIndex = (insertionIndex < 0) ? position : insertionIndex;
                        }
                        else {
                            this.appendChild(draggableRef);
                            insertionIndex = (insertionIndex < 0) ? thisDraggables.length - 1 : insertionIndex;
                        }
                    });
                }
                else {
                    let ref = (this.querySelector(`[ref="${lastDraggable.ref}"]`) || lastDraggable.cloneNode(true)) as HTMLElement;
                    if (thisDraggables.length > 0) {
                        this.replaceChild(ref, thisDraggables[thisDraggables.length - 1]);
                    }
                    else {
                        this.appendChild(ref);
                    }
                    insertionIndex = 0;
                }
            }

            let dataTransferEvent: DataTransferEvent = new CustomEvent("datatransfer", {
                bubbles: true,
                detail: {
                    draggables: draggables,
                    position: insertionIndex,
                    success: dataTransferSuccess,
                    statusText: dataTransferStatusText,
                } 
            });
            this.dispatchEvent(dataTransferEvent);
        }
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