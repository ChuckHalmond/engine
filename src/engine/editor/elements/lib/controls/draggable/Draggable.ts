import { RegisterCustomHTMLElement, bindShadowRoot, GenerateAttributeAccessors } from "engine/editor/elements/HTMLElement";
import { HTMLEDragzoneElement } from "./Dragzone";
import { HTMLEDropzoneElement } from "./Dropzone";

export { isHTMLEDraggableElement };
export { HTMLEDraggableElement };
export { BaseHTMLEDraggableElement };

function isHTMLEDraggableElement(obj: any): obj is HTMLEDraggableElement {
    return obj instanceof Node && obj.nodeType === obj.ELEMENT_NODE && (obj as Element).tagName.toLowerCase() === "e-draggable";
}

interface HTMLEDraggableElement extends HTMLElement {
    selected: boolean;
    dragged: boolean;
    type: string;
    dragovered: boolean;
}

@RegisterCustomHTMLElement({
    name: "e-draggable"
})
@GenerateAttributeAccessors([
    {name: "selected", type: "boolean"},
    {name: "dragged", type: "boolean"},
    {name: "dragovered", type: "boolean"},
    {name: "disabled", type: "boolean"},
    {name: "type", type: "string"},
])
class BaseHTMLEDraggableElement extends HTMLElement implements HTMLEDraggableElement {
    
    public selected!: boolean;
    public dragovered!: boolean;
    public dragged!: boolean;
    public disabled!: boolean;

    public type!: string;

    constructor() {
        super();

        bindShadowRoot(this, /*template*/`
            <style>
                :host {
                    display: inline-block;
                    padding: 3px 4px;
                    cursor: grab;
                    white-space: nowrap;
                    border-radius: 4px;
                    border: 1px solid black;
                    user-select: none;
                }

                :host([disabled]) {
                    pointer-events: none;
                    color: gray;
                    border-color: gray;
                }
                
                :host([selected]) {
                    font-weight: bold;
                    outline: 1px auto black;
                }

                :host(:active) {
                    cursor: grabbing;
                }

                :host([dragovered]) {
                    border-style: dotted;
                }
                     
                ::slotted(e-dropzone) {
                    display: inline-block;
                    border-radius: 4px;
                }
            </style>
            <slot>&nbsp;</slot>
        `);
    }
    
    public connectedCallback() {
        this.tabIndex = this.tabIndex;
        this.draggable = true;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "e-draggable": HTMLEDraggableElement,
    }
}