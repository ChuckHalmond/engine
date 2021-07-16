import { RegisterCustomHTMLElement, GenerateAttributeAccessors, isTagElement } from "engine/editor/elements/HTMLElement";
import { HTMLEDraggableElement, isHTMLEDraggableElement } from "./Draggable";
import { BaseHTMLEDragzoneElement, HTMLEDragzoneElement } from "./Dragzone";

export { EDataTransferEvent };
export { isHTMLEDropzoneElement };
export { HTMLEDropzoneElement };
export { BaseHTMLEDropzoneElement };

function isHTMLEDropzoneElement(obj: any): obj is HTMLEDropzoneElement {
    return obj instanceof Node && obj.nodeType === obj.ELEMENT_NODE && (obj as Element).tagName.toLowerCase() === "e-dropzone";
}

interface HTMLEDropzoneElement extends HTMLEDragzoneElement {
    dragovered: boolean;
    allowedtypes: string;
    multiple: boolean;
    addDraggables(draggables: HTMLEDraggableElement[], position: number): void;
    removeDraggables(draggables: HTMLEDraggableElement[]): void;
}

type EDataTransferEvent = CustomEvent<{
    draggables: HTMLEDraggableElement[],
    position: number,
    success: boolean,
}>

@RegisterCustomHTMLElement({
    name: "e-dropzone"
})
@GenerateAttributeAccessors([
    {name: "dragovered", type: "boolean"},
    {name: "allowedtypes", type: "string"},
    {name: "multiple", type: "boolean"},
])
class BaseHTMLEDropzoneElement extends BaseHTMLEDragzoneElement implements HTMLEDropzoneElement {

    public dragovered!: boolean;
    public allowedtypes!: string;
    public multiple!: boolean;

    constructor() {
        super();
        
        this.shadowRoot!.querySelector("style")?.insertAdjacentHTML("beforeend",
            /*css*/`
                ::slotted([slot="input"]) {
                    display: none;
                }

                :host {
                    position: relative;
                    display: inline-block;
                    border-radius: 4px;
                    min-width: 32px;
                    min-height: 32px;
                    padding: 4px;
                    margin-top: 8px;
                    border: 1px dashed black;
                    outline: 1px solid transparent;
                }

                :host [part~="appendarea"] {
                    position: relative;
                    height: 10px;
                    margin-top: 8px;
                }

                :host([dragovered]) [part~="appendarea"] {
                    margin-top: 20px;
                }

                :host([dragovered]) [part~="appendarea"]::before {
                    content: "";
                    pointer-events: none;
                    display: block;
                    position: absolute;
                    left: 0;
                    top: -11px;
                    width: 100%;
                    border: 1px solid black;
                }
            `
        );

        this.shadowRoot!.querySelector("slot#draggables")?.insertAdjacentHTML("afterend",
            /*template*/`
                <slot name="input"></slot>
                <div part="appendarea"></div>
            `
        );
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
                    this.removeDraggables(selectedDraggables);
                    event.stopPropagation();
                    break;
            }
        });

        this.addEventListener("dragover", (event: DragEvent) => {
            event.preventDefault();
        }, {capture: true});

        this.shadowRoot!.addEventListener("dragover", (event) => {
            event.preventDefault();
        }, {capture: true});
        
        this.addEventListener("dragenter", (event: DragEvent) => {
            let target = event.target as any;
            if (isHTMLEDraggableElement(target)) {
                let dragoveredDraggable = this.querySelector<HTMLEDraggableElement>("e-draggable[dragovered]");
                if (dragoveredDraggable) {
                    dragoveredDraggable.dragovered = false;
                }
                target.dragovered = true;
            }
            else {
                this.dragovered = true;
            }
            event.preventDefault();
        }, {capture: true});
        
        this.shadowRoot!.addEventListener("dragenter", (event) => {
            let target = event.target;
            if (!isHTMLEDraggableElement(target)) {
                let dragoveredDraggable = this.querySelector<HTMLEDraggableElement>("e-draggable[dragovered]");
                if (dragoveredDraggable) {
                    dragoveredDraggable.dragovered = false;
                }
                this.dragovered = true;
            }
            event.preventDefault();
        }, {capture: true});

        this.shadowRoot!.addEventListener("dragleave", (event) => {
            event.preventDefault();
        }, {capture: true});
        
        this.addEventListener("dragleave", (event: DragEvent) => {
            let relatedTarget = event.relatedTarget as any;
            if (!(this.contains(relatedTarget) || this.shadowRoot!.contains(relatedTarget))) {
                let dragoveredDraggable = this.querySelector<HTMLEDraggableElement>("e-draggable[dragovered]");
                if (dragoveredDraggable) {
                    dragoveredDraggable.dragovered = false;
                }
            }
            this.dragovered = false;
            event.preventDefault();
        }, {capture: true});
        
        this.addEventListener("drop", () => {
            let thisDraggables = Array.from(this.children).filter(isHTMLEDraggableElement);
            let dragoveredDraggable = this.querySelector<HTMLEDraggableElement>("e-draggable[dragovered]");
            let dragoveredDraggableIndex = thisDraggables.length;

            if (dragoveredDraggable) {
                dragoveredDraggable.dragovered = false;
                dragoveredDraggableIndex = Array.from(thisDraggables).indexOf(dragoveredDraggable);
            }

            let selectedDraggables = Array.from(
                document.querySelectorAll<HTMLEDraggableElement>("e-draggable[selected]")
            );
            
            selectedDraggables.forEach((selectedDraggable) => {
                selectedDraggable.dragged = false;
                selectedDraggable.selected = false;
            });

            this.addDraggables(selectedDraggables, dragoveredDraggableIndex);

            this.dragovered = false;
        });
    }

    public addDraggables(draggables: HTMLEDraggableElement[], position: number) {
        if (draggables.length > 0) {
            let lastDraggable = draggables[draggables.length - 1];

            let draggablesTypes = new Set<string>();
            draggables.forEach((draggable) => {
                draggablesTypes.add(draggable.type);
            });

            let thisAllowedtypes = new Set((this.allowedtypes || "").split(" "));
            
            let dataTransferSuccess = thisAllowedtypes.has("*") ||
                Array.from(
                    draggablesTypes.values()
                ).every(
                    type => thisAllowedtypes.has(type)
                );
            
            let insertionIndex = -1;
            if (dataTransferSuccess) {
                let thisDraggables = Array.from(this.children).filter(isHTMLEDraggableElement);
                let thisLastDraggable = thisDraggables[thisDraggables.length - 1];
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
                    if (position > -1 && position < thisDraggables.length) {
                        let pivotDraggable = thisDraggables[position];
                        pivotDraggable.insertAdjacentElement("beforebegin", lastDraggable);
                        insertionIndex = position;
                    }
                    else {
                        let ref = (this.querySelector(`[ref="${lastDraggable.ref}"]`) || lastDraggable.cloneNode(true)) as HTMLElement;
                        if (thisLastDraggable) {
                            this.replaceChild(ref, thisLastDraggable);
                        }
                        else {
                            this.appendChild(ref);
                        }
                        insertionIndex = 0;
                    }
                }
                
                let dataTransferEvent: EDataTransferEvent = new CustomEvent("datatransfer", {
                    bubbles: true,
                    detail: {
                        draggables: draggables,
                        position: insertionIndex,
                        success: dataTransferSuccess,
                    } 
                });
                this.dispatchEvent(dataTransferEvent);
            }
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