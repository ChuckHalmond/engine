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
    ref: string;
    type: string;
    value: string;
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
    {name: "ref", type: "string"},
    {name: "type", type: "string"},
    {name: "value", type: "string"},
])
class BaseHTMLEDraggableElement extends HTMLElement implements HTMLEDraggableElement {
    
    public selected!: boolean;
    public dragovered!: boolean;
    public dragged!: boolean;
    public disabled!: boolean;

    public ref!: string;
    public type!: string;
    public value!: string;

    public dragzone: HTMLEDragzoneElement | null;
    public dropzone: HTMLEDropzoneElement | null;

    constructor() {
        super();

        bindShadowRoot(this, /*template*/`
            <style>
                :host {
                    position: relative;
                    display: block;
                    padding: 2px 4px;
                    border-radius: 4px;
                    border: 1px solid black;
                    margin-top: 6px;
                    cursor: pointer;
                }

                :host([disabled]) {
                    pointer-events: none;
                    color: gray;
                    border-color: gray;
                }

                :host(:focus),
                :host([selected]) {
                    font-weight: bold;
                    outline: none;
                }

                :host([dragovered]) {
                    margin-top: 20px;
                }

                :host([dragovered])::before {
                    content: "";
                    pointer-events: none;
                    display: block;
                    position: absolute;
                    left: 0;
                    top: -11px;
                    width: 100%;
                    border: 1px solid black;
                }

                slot {
                    pointer-events: none;
                    user-select: none;
                }
            </style>
            <slot></slot>
        `);
        
        this.dragzone = null;
        this.dropzone = null;
    }
    
    public connectedCallback() {
        this.tabIndex = this.tabIndex;
        this.draggable = true;
    }
}