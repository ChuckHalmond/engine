import { Input, Key } from "engine/core/input/Input";
import { RegisterCustomHTMLElement, bindShadowRoot, GenerateAttributeAccessors } from "engine/editor/elements/HTMLElement";

export { isHTMLEDraggableElement };
export { HTMLEDraggableElement };

function isHTMLEDraggableElement(obj: any): obj is HTMLEDraggableElement {
    return obj instanceof Node && obj.nodeType === obj.ELEMENT_NODE && (obj as Element).tagName.toLowerCase() === "e-draggable";
}

@RegisterCustomHTMLElement({
    name: "e-draggable"
})
@GenerateAttributeAccessors([
    {name: "selected", type: "boolean"},
    {name: "dragged", type: "boolean"}
])
class HTMLEDraggableElement extends HTMLElement {
    
    public selected!: boolean;
    public dragged!: boolean;

    public data: any = {};

    constructor() {
        super();

        bindShadowRoot(this, /*template*/`
            <style>
                :host {
                    display: block;
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

document.addEventListener("dragstart", (event) => {
    let target = event.target;
    if (isHTMLEDraggableElement(target)) {
        let dataTransfer = event.dataTransfer;
        if (dataTransfer !== null) {
            dataTransfer.setData("text/plain", JSON.stringify(target.data));
        }
        target.dragged = true;
    }
});

document.addEventListener("dragend", (event) => {
    let target = event.target;
    if (isHTMLEDraggableElement(target)) {
        target.dragged = false;
        let selectedDraggables = Array.from(document.querySelectorAll<HTMLEDraggableElement>("e-draggable[selected]"));
        selectedDraggables.forEach((selectedDraggable) => {
            selectedDraggable.selected = false;
        });
    }
});

document.addEventListener("mousedown", (event) => {
    let target = event.target as any;
    if (isHTMLEDraggableElement(target)) {
        if (!Input.getKeyDown(Key.SHIFT)) {
            if (!target.selected) {
                let selectedDraggables = Array.from(document.querySelectorAll<HTMLEDraggableElement>("e-draggable[selected]"));
                selectedDraggables.forEach((selectedDraggable) => {
                    selectedDraggable.selected = false;
                });
                target.selected = true;
            }
        }
        else {
            target.selected = true;
        }
    }
    else {
        let selectedDraggables = Array.from(document.querySelectorAll<HTMLEDraggableElement>("e-draggable[selected]"));
        selectedDraggables.forEach((selectedDraggable) => {
            selectedDraggable.selected = false;
        });
    }
});

document.addEventListener("mouseup", (event) => {
    let target = event.target as any;
    if (isHTMLEDraggableElement(target)) {
        if (!Input.getKeyDown(Key.SHIFT)) {
            let selectedDraggables = Array.from(document.querySelectorAll<HTMLEDraggableElement>("e-draggable[selected]"));
            selectedDraggables.forEach((selectedDraggable) => {
                if (selectedDraggable !== target) {
                    selectedDraggable.selected = false;
                }
            });
        }
    }
});

Input.initialize(document.documentElement);