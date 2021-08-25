import { editor } from "engine/editor/Editor";
import { RegisterCustomHTMLElement, GenerateAttributeAccessors, bindShadowRoot } from "engine/editor/elements/HTMLElement";

export { HTMLEStatusItemElement };
export { HTMLEStatusItemElementBase };

interface HTMLEStatusItemElement extends HTMLElement {

}

type EStatusElementType = "button" | "widget";

@RegisterCustomHTMLElement({
    name: "e-statusitem",
})
@GenerateAttributeAccessors([
    {name: "name", type: "string"},
    {name: "icon", type: "string"},
    {name: "type", type: "string"},
])
class HTMLEStatusItemElementBase extends HTMLElement implements HTMLEStatusItemElement {

    public name!: string;
    public type!: EStatusElementType;
    public icon!: string;

    public command: string | null;

    private _stateMap: ((state: any) => {content: string}) | null;

    public get stateMap(): ((state: any) => {content: string}) | null {
        return this._stateMap;
    }

    public set stateMap(stateMap: ((state: any) => {content: string}) | null) {
        this._stateMap = stateMap;
    }

    public update(newValue: any): void {
        const { content } = (typeof this.stateMap === "function") ? this.stateMap(newValue) : newValue;
        this.textContent = content;
    }


    // TODO: Add sync with Promise (icons, etc.)
    
    constructor() {
        super();

        bindShadowRoot(this, /*template*/`
            <style>
                :host {
                    position: relative;
                    display: inline-block;

                    user-select: none;
                    white-space: nowrap;

                    padding: 2px 6px;
                    background-color: white;
                }

                :host(:focus-visible) {
                    outline: none;
                }

                :host(:hover),
                :host([active]) {
                    background-color: rgb(180, 180, 180);
                }
                
                li {
                    display: flex;
                    height: 100%;
                    list-style-type: none;
                }
            </style>
            <li>
                <slot></slot>
            </li>
        `);

        this.command = null;
        this._stateMap = null;
    }

    public activate() {
        const command = this.command;
        if (command) {
            editor.executeCommand(command);
        }
        this.dispatchEvent(new CustomEvent("activate"));
    }

    public connectedCallback() {
        this.tabIndex = this.tabIndex;
        
        this.addEventListener("click", (event: Event) => {
            this.activate();
            event.stopPropagation();
        });
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "e-statusitem": HTMLEStatusItemElement,
    }
}