import { RegisterCustomHTMLElement, GenerateAttributeAccessors, bindShadowRoot } from "engine/editor/elements/HTMLElement";
import { isHTMLEMenuItemElement, HTMLEMenuItemElement } from "engine/editor/elements/lib/containers/menus/MenuItem";
import { HTMLEMenuElement, isHTMLEMenuElement } from "./Menu";

export { isHTMLEMenuItemGroupElement };
export { HTMLEMenuItemGroupElement };

function isHTMLEMenuItemGroupElement(elem: Element): elem is HTMLEMenuItemGroupElement {
    return elem.tagName.toLowerCase() === "e-menuitemgroup";
}

@RegisterCustomHTMLElement({
    name: "e-menuitemgroup",
    observedAttributes: ["label", "active"]
})
@GenerateAttributeAccessors([
    {name: "active", type: "boolean"},
    {name: "label", type: "string"},
    {name: "type", type: "string"},
    {name: "name", type: "string"},
    {name: "rows", type: "number"},
    {name: "cells", type: "number"},
])
class HTMLEMenuItemGroupElement extends HTMLElement {

    public name!: string;
    public label!: string;
    public type!: "list" | "grid";
    public rows!: number;
    public cells!: number;

    public active!: boolean;

    public parentMenu: HTMLEMenuElement | null;
    public items: HTMLEMenuItemElement[];

    private _selectedItemIndex: number;

    constructor() {
        super();

        bindShadowRoot(this, /*template*/`
            <style>
                :host {
                    display: inline-block;
                    position: relative;
                    user-select: none;
                }

                :host(:focus) {
                    outline: none;
                }
                
                :host(:not([label])) [part~="li"] {
                    display: none;
                }

                [part~="label"] {
                    position: relative;
                    display: inline-block;
                    width: 100%;

                    user-select: none;
                    white-space: nowrap;

                    padding: 2px 6px 6px 6px;
                    font-weight: bold;
                }

                [part~="li"] {
                    display: flex;
                    height: 100%;
                    list-style-type: none;
                }
                
                ::slotted(*) {
                    display: block;
                    width: 100%;
                }
            </style>
            <div part="content">
                <li part="li">
                    <span part="label"></span>
                </li>
                <slot></slot>
            </div>
        `);

        this._selectedItemIndex = -1;
        this.parentMenu = null;
        this.items = [];
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
                const items = slot.assignedElements().filter(isHTMLEMenuItemElement);
                items.forEach((item) => {
                    if (!this.items.includes(item)) {
                        this.items.push(item);
                        item.group = this;
                        item.parentMenu = this.parentMenu;
                        item.addEventListener("mouseenter", () => {
                            this.selectItem(this.items.indexOf(item));
                            if (this.selectedItem && this.selectedItem.childMenu) {
                                this.selectedItem.childMenu.focus();
                            }
                        });
                        item.addEventListener("change", () => {
                            if (item.type === "radio" && item.checked) {
                                let newCheckedRadio = item;
                                let checkedRadio = this.findItem(
                                    (item: HTMLEMenuItemElement) => {
                                        return item.type === "radio" && item.checked && item !== newCheckedRadio
                                    }
                                );
                                if (checkedRadio) {
                                    checkedRadio.checked = false;
                                }
                            }
                        })
                        item.addEventListener("disconnected", () => {
                            this.clearFocus();
                            this.items.splice(this.items.indexOf(item), 1);
                        });
                    }
                });
            });
        }

        this.addEventListener("keydown", (event: KeyboardEvent) => {
            let selectedItem;
            switch (event.key) {
                case "ArrowUp":
                    if (this.selectedItemIndex > 0) {
                        this.selectItem(this.selectedItemIndex - 1);
                        event.stopPropagation();
                    }
                    break;
                case "ArrowDown":
                    if (this.selectedItemIndex < this.items.length - 1) {
                        this.selectItem(this.selectedItemIndex + 1);
                        event.stopPropagation();
                    }
                    break;
                case "Enter":
                    selectedItem = this.selectedItem;
                    if (selectedItem) {
                        selectedItem.activate();
                        event.stopPropagation();
                    }
                    break;
                case "ArrowRight":
                    selectedItem = this.selectedItem;
                    if (this.items.indexOf(event.target as HTMLEMenuItemElement) >= 0) {
                        if (selectedItem && isHTMLEMenuItemElement(selectedItem) && selectedItem.childMenu) {
                            selectedItem.childMenu.selectItem(0);
                            event.stopPropagation();
                        }
                    }
                    break;
                case "Home":
                    this.selectItem(0);
                    break;
                case "End":
                    this.selectItem(this.items.length - 1);
                    break;
                case "Escape":
                    this.clearFocus();
                    break;
            }
        });

        this.addEventListener("focus", () => {
            this.selectItem(0);
        });
    }

    public disconnectedCallback(): void {
        this.dispatchEvent(new CustomEvent("disconnected", {bubbles: false}));
    }

    public attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
        if (oldValue !== newValue) {
            switch (name) {
            case "label":
                if (oldValue !== newValue) {
                    const label = this.shadowRoot?.querySelector("[part~=label]");
                    if (label) {
                        label.textContent = newValue;
                    }
                }
            }
        }
    }
    
    public clearFocus() {
        this.clearSelection();
        this.blur();
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
            item.clearFocus();
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