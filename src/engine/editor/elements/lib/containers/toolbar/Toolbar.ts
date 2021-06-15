import { RegisterCustomHTMLElement, GenerateAttributeAccessors, bindShadowRoot } from "engine/editor/elements/HTMLElement";
import { isHTMLEMenuItemElement, HTMLEMenuItemElement } from "engine/editor/elements/lib/containers/menus/MenuItem";
import { isHTMLEMenuElement } from "./Menu";

export { HTMLEMenuBarElement };
export { isHTMLEMenuBarElement };

function isHTMLEMenuBarElement(elem: Element): elem is HTMLEMenuBarElement {
    return elem.tagName.toLowerCase() === "e-menubar";
}

@RegisterCustomHTMLElement({
    name: "e-menubar",
    observedAttributes: ["active"]
})
@GenerateAttributeAccessors([
    {name: "name", type: "string"},
    {name: "active", type: "boolean"},
])
class HTMLEMenuBarElement extends HTMLElement {

    public name!: string;
    public active!: boolean;
    
    public items: HTMLEMenuItemElement[];

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

                :host(:focus-within) {
                    outline: 2px solid -webkit-focus-ring-color;
                }

                :host(:focus) ::slotted(:first-child),
                :host(:not(:focus-within)) ::slotted(:hover) {
                    background-color: rgb(180, 180, 180);
                }

                [part~="ul"] {
                    display: block;
                    list-style-type: none;
                    padding: 0; margin: 0;
                }
            </style>
            <ul part="ul">
                <slot></slot>
            </ul>
        `);

        this.items = [];
        this._selectedItemIndex = -1;
    }

    public get selectedItemIndex(): number {
        return this._selectedItemIndex;
    }

    public get selectedItem(): HTMLEMenuItemElement | null {
        return this.items[this.selectedItemIndex] || null;
    }

    public connectedCallback() {
        this.tabIndex = this.tabIndex;
        
        const slot = this.shadowRoot?.querySelector("slot");
        if (slot) {
            slot.addEventListener("slotchange", () => {
                const items = slot.assignedElements();
                items.forEach((item) => {
                    if (isHTMLEMenuItemElement(item)) {
                        this.items.push(item);
                        item.parentMenu = this;
                        item.addEventListener("mouseenter", () => {
                            this.selectItem(this.items.indexOf(item), {passive: !this.active});
                            if (this.active && this.selectedItem && this.selectedItem.childMenu) {
                                this.selectedItem.childMenu.focus();
                            }
                        });
                        item.addEventListener("disconnected", () => {
                            this.clearSelection();
                            this.items.splice(this.items.indexOf(item), 1);
                        });
                    }
                });
            });
        }

        this.addEventListener("keydown", (event: KeyboardEvent) => {
            let selectedItem;
            switch (event.key) {
                case "ArrowLeft":
                    this.selectItem((this.selectedItemIndex <= 0) ? this.items.length - 1 : this.selectedItemIndex - 1);
                    if (this.active && this.selectedItem && this.selectedItem.childMenu) {
                        this.selectedItem.childMenu.selectItem(0);
                    }
                    break;
                case "ArrowRight":
                    this.selectItem((this.selectedItemIndex >= this.items.length - 1) ? 0 : this.selectedItemIndex + 1);
                    if (this.active && this.selectedItem && this.selectedItem.childMenu) {
                        this.selectedItem.childMenu.selectItem(0);
                    }
                    break;
                case "ArrowDown":
                    this.selectItem(this.selectedItemIndex);
                    if (this.active && this.selectedItem && this.selectedItem.childMenu) {
                        this.selectedItem.childMenu.selectItem(0);
                    }
                    break;
                case "Enter":
                    selectedItem = this.selectedItem;
                    if (selectedItem) {
                        if (!this.active) {
                            this.active = true;
                        }
                        selectedItem.activate();
                    }
                    break;
                case "Escape":
                    this.selectItem(this.selectedItemIndex);
                    this.active = false;
                    break;
            }
        });

        this.addEventListener("click", (event: Event) => {
            if (this.items.indexOf(event.target as HTMLEMenuItemElement) >= 0) {
                let selectedItem = this.selectedItem;
                if (!this.active) {
                    this.active = true;
                    if (selectedItem && selectedItem.childMenu) {
                        selectedItem.childMenu.focus();
                    }
                }
                else {
                    this.active = false;
                    if (selectedItem && selectedItem.childMenu) {
                        selectedItem.childMenu.clearSelection();
                    }
                }
                event.stopPropagation();
            }
        }, {capture: true});

        this.addEventListener("focus", () => {
            this.selectItem(0, {passive: true});
        });

        this.addEventListener("blur", (event: FocusEvent) => {
            let containsNewFocus = (event.relatedTarget !== null) && this.contains(event.relatedTarget as Node);
            if (!containsNewFocus) {
                this.active = false;
            }
        }, {capture: true});
    }

    public selectItem(index: number, opts?: {passive?: boolean}): void {
        let item = this.items[index];
        if (opts?.passive) {
            if (item) {
                this._selectedItemIndex = index;
            }
        }
        else {
            if (this._selectedItemIndex !== index) {
                this.clearSelection();
            }
            if (item) {
                this._selectedItemIndex = index;
                if (!opts?.passive) {
                    item.focus();
                }
            }
        }
    }

    public clearSelection() {
        let item = this.selectedItem;
        if (item) {
            this._selectedItemIndex = -1;
            if (item.childMenu) {
                item.childMenu.clearSelection();
            }
        }
    }

    public findItem(predicate: (item: HTMLEMenuItemElement) => boolean): HTMLEMenuItemElement | null {
        let foundItem: HTMLEMenuItemElement | null = null;
        for (let idx = 0; idx < this.items.length; idx++) {
            let item = this.items[idx];
            if (predicate(item)) {
                return item;
            }
            if (item.childMenu) {
                foundItem = item.childMenu.findItem(predicate);
                if (foundItem) {
                    return foundItem;
                }
            }
        }
        return foundItem;
    }
}