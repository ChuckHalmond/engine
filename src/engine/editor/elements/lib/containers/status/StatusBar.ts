import { RegisterCustomHTMLElement, GenerateAttributeAccessors, bindShadowRoot } from "engine/editor/elements/HTMLElement";
import { HTMLEStatusItemElement, isHTMLEStatusItemElement } from "./StatusItem";

export { HTMLEStatusBarElement };
export { isHTMLEStatusBarElement };

function isHTMLEStatusBarElement(elem: Element): elem is HTMLEStatusBarElement {
    return elem.tagName.toLowerCase() === "e-statusbar";
}

@RegisterCustomHTMLElement({
    name: "e-statusbar"
})
@GenerateAttributeAccessors([
    {name: "name", type: "string"},
    {name: "active", type: "boolean"},
])
class HTMLEStatusBarElement extends HTMLElement {

    public name!: string;
    public active!: boolean;
    
    public items: HTMLEStatusItemElement[];

    public _selectedItemIndex: number;

    constructor() {
        super();

        bindShadowRoot(this, /*template*/`
            <style>
                :host {
                    display: flex;
                    position: relative; 
                    user-select: none;

                    background-color: white;
                }

                ul {
                    display: block;
                    list-style-type: none;
                    padding: 0; margin: 0;
                }
            </style>
            <ul>
                <slot id="items"></slot>
            </ul>
        `);

        this.items = [];
        this._selectedItemIndex = -1;
    }

    public connectedCallback() {
        this.tabIndex = this.tabIndex;
        
        const itemsSlot = this.shadowRoot?.getElementById("items");
        if (itemsSlot) {
            itemsSlot.addEventListener("slotchange", (event: Event) => {
                const items = (event.target as HTMLSlotElement).assignedElements();
                items.forEach((item) => {
                    if (isHTMLEStatusItemElement(item)) {
                        this.items.push(item);
                    }
                });
            }, {once: true});
        }

        const focusInCallback = function(this: HTMLEStatusBarElement, keydownControls: (this: HTMLElement, ev: KeyboardEvent) => void) {
            this.addEventListener("keydown", keydownControls);
            this.addEventListener("click", () => {
                this.active = true;
            }, {capture: true});
        }

        const focusOutCallback = function(this: HTMLEStatusBarElement, keydownControls: (this: HTMLElement, ev: KeyboardEvent) => void) {
            this.removeEventListener("keydown", keydownControls);
            this.active = false;
        };

        const keydownControls = (event: KeyboardEvent) => {
            switch (event.key) {
                case "ArrowLeft":
                    this.selectItem((this.selectedItemIndex <= 0) ? this.items.length - 1 : this.selectedItemIndex - 1);
                    break;
                case "ArrowRight":
                    this.selectItem((this.selectedItemIndex >= this.items.length - 1) ? 0 : this.selectedItemIndex + 1);
                    break;
                case "Enter":
                    this.active = true;
                    if (this.selectedItem) {
                        this.selectedItem.activate();
                    }
                    break;
                case "Home":
                    this.selectItem(0);
                    break;
                case "End":
                    this.selectItem(this.items.length - 1);
                    break;
                case "Escape":
                    this.selectItem(this.selectedItemIndex);
                    this.active = false;
                    break;
            }
        };

        this.addEventListener("focus", () => {
            this.selectItem(0);
        });
    }

    public get selectedItemIndex(): number {
        return this._selectedItemIndex;
    }

    public get selectedItem(): HTMLEStatusItemElement | null {
        return this.items[this.selectedItemIndex] || null;
    }

    public insertItem(index: number, item: HTMLEStatusItemElement): void {
        index = Math.min(Math.max(index, -this.items.length), this.items.length);
        this.insertBefore(item, this.children[index >= 0 ? index : this.children.length + index]);
        this.items.splice(index, 0, item);
        item.addEventListener("mouseenter", () => {
            this.selectItem(this.items.indexOf(item));
        });
        item.addEventListener("mouseleave", () => {
        });
    }

    public findItem(predicate: (item: HTMLEStatusItemElement) => boolean): HTMLEStatusItemElement | null {
        const items = this.findItems(predicate);
        if (items.length > 0) {
            return items[0];
        }
        return null;
    }

    public findItems(predicate: (item: HTMLEStatusItemElement) => boolean): HTMLEStatusItemElement[] {
        const items: HTMLEStatusItemElement[] = [];
        this.items.forEach((item) => {
            if (predicate(item)) {
                items.push(item);
            }
        });
        return items;
    }

    public selectItem(index: number): void {
        if (index !== this.selectedItemIndex) {
            this.clearSelection();
            let item = this.items[index];
            if (item) {
                this._selectedItemIndex = index;
            }
        }
    }

    public clearSelection() {
        let item = this.selectedItem;
        if (item) {
            this._selectedItemIndex = -1;
        }
    }
}