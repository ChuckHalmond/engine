import { RegisterCustomHTMLElement, bindShadowRoot, isTagElement } from "engine/editor/elements/HTMLElement";
import { HTMLEDropzoneElement, DataChangeEvent } from "./Dropzone";

interface HTMLEDropzoneInputElement extends HTMLElement {
    dropzone: HTMLEDropzoneElement | null;
    input: HTMLInputElement | null;
    converter: ((dropzone: HTMLEDropzoneElement) => string) | null;
}

@RegisterCustomHTMLElement({
    name: "e-dropzoneinput"
})
class HTMLEDropzoneInputElementBase extends HTMLElement implements HTMLEDropzoneInputElement {
    dropzone: HTMLEDropzoneElement | null;
    input: HTMLInputElement | null;

    public converter: ((dropzone: HTMLEDropzoneElement) => string) | null;

    constructor() {
        super();
    
        bindShadowRoot(this, /*html*/`
            <style>
                :host {
                    display: block;
                }

                [part~="container"] {
                    position: relative;
                    display: flex;
                    flex-direction: row;
                }
                
                ::slotted(e-dropzone) {
                    flex: auto;
                }

                ::slotted(input) {
                    position: absolute;
                    flex: none;
                    width: 100%;
                    height: 100%;
                    left: 0;
                    top: 0;
                    opacity: 0;
                    pointer-events: none;
                }
            </style>
            <div part="container">
                <slot name="input"></slot>
                <slot name="dropzone"></slot>
            </div>
            `
        );
        this.dropzone = null;
        this.input = null;
        this.converter = (dropzone) => dropzone.type;
    }

    public connectedCallback() {
        this.tabIndex = this.tabIndex;

        this.addEventListener("datachange", (event: DataChangeEvent) => {
            let target = event.target;
            if (target == this.dropzone && this.dropzone && this.input && this.converter) {
                this.input.value = this.converter(this.dropzone);
            }
        });

        const dropzoneSlot = this.shadowRoot?.querySelector<HTMLSlotElement>("slot[name='dropzone']");
        if (dropzoneSlot) {
            dropzoneSlot.addEventListener("slotchange", () => {
                const dropzone = dropzoneSlot.assignedElements().filter(
                    elem => isTagElement("e-dropzone", elem)
                ) as HTMLEDropzoneElement[];
                if (dropzone.length > 0) {
                    this.dropzone = dropzone[0];
                }
            });
        }

        const inputSlot = this.shadowRoot?.querySelector<HTMLSlotElement>("slot[name='input']");
        if (inputSlot) {
            inputSlot.addEventListener("slotchange", () => {
                const input = inputSlot.assignedElements().filter(
                    elem => isTagElement("input", elem)
                ) as HTMLInputElement[];
                if (input.length > 0) {
                    this.input = input[0];
                }
            });
        }
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "e-dropzoneinput": HTMLEDropzoneInputElement,
    }
}