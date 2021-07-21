import { RegisterCustomHTMLElement, bindShadowRoot, GenerateAttributeAccessors } from "engine/editor/elements/HTMLElement";

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
    {name: "value", type: "string"},
])
class BaseHTMLEDraggableElement extends HTMLElement implements HTMLEDraggableElement {
    
    public selected!: boolean;
    public dragovered!: boolean;
    public dragged!: boolean;
    public disabled!: boolean;

    public ref!: string;
    public value!: string;

    constructor() {
        super();

        bindShadowRoot(this, /*template*/`
            <style>
                :host {
                    position: relative;
                    display: inline-block;
                    padding: 2px 4px;
                    border-radius: 4px;
                    border: 1px solid black;
                    cursor: pointer;
                }

                :host([disabled]) {
                    pointer-events: none;
                    color: gray;
                    border-color: gray;
                }

                :host(:focus),
                :host([selected]),
                :host([dragovered]) {
                    font-weight: bold;
                    outline: none;
                }

                slot {
                    pointer-events: none;
                    user-select: none;
                }
            </style>
            <slot></slot>
        `);
    }
    
    public connectedCallback() {
        this.tabIndex = this.tabIndex;
        this.draggable = true;
    }
}