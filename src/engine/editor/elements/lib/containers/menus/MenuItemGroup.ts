import { RegisterCustomHTMLElement, GenerateAttributeAccessors, isTagElement, Fragment } from "engine/editor/elements/HTMLElement";
import { HTMLEMenuItemElement } from "engine/editor/elements/lib/containers/menus/MenuItem";
import { pointIntersectsWithDOMRect } from "engine/editor/elements/Snippets";
import { HTMLEMenuElement } from "./Menu";

export { HTMLEMenuItemGroupElementData };
export { HTMLEMenuItemGroupElement };
export { BaseHTMLEMenuItemGroupElement };

interface HTMLEMenuItemGroupElementData {
    name: string;
    label: string;
}

interface HTMLEMenuItemGroupElement extends HTMLElement {
    name: string;
    label: string;
    type: "list" | "grid";
    rows: number;
    cells: number;

    parentMenu: HTMLEMenuElement | null;
    items: HTMLEMenuItemElement[];

    setData(data: HTMLEMenuItemGroupElementData): void;
    getData(): HTMLEMenuItemGroupElementData;

    readonly activeIndex: number;
    readonly activeItem: HTMLEMenuItemElement | null;
    
    focusItemAt(index: number, childMenu?: boolean): void;
    reset(): void;
    focusItem(predicate: (item: HTMLEMenuItemElement) => boolean, subitems?: boolean): void;
    findItem(predicate: (item: HTMLEMenuItemElement) => boolean, subitems?: boolean): HTMLEMenuItemElement | null;
}

@RegisterCustomHTMLElement({
    name: "e-menuitemgroup",
    observedAttributes: ["label"]
})
@GenerateAttributeAccessors([
    {name: "label", type: "string"},
    {name: "type", type: "string"},
    {name: "name", type: "string"},
    {name: "rows", type: "number"},
    {name: "cells", type: "number"},
])
class BaseHTMLEMenuItemGroupElement extends HTMLElement implements HTMLEMenuItemGroupElement {
    public name!: string;
    public label!: string;
    public type!: "list" | "grid";
    public rows!: number;
    public cells!: number;
    
    public parentMenu: HTMLEMenuElement | null;
    public items: HTMLEMenuItemElement[];

    private _activeIndex: number;

    constructor() {
        super();

        this.attachShadow({mode: "open"}).append(
            Fragment(/*html*/`
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

                    [part~="separator"] {
                        margin: 6px 0;
                    }

                    :host(:first-child) [part~="separator"] {
                        display: none;
                    }
                    
                    ::slotted(*) {
                        display: block;
                        width: 100%;
                    }
                </style>
                <div part="content">
                    <hr part="separator"/>
                    <li part="li">
                        <span part="label"></span>
                    </li>
                    <slot></slot>
                </div>
            `)
        );

        this._activeIndex = -1;
        this.parentMenu = null;
        this.items = [];
    }

    public get activeIndex(): number {
        return this._activeIndex;
    }

    public get activeItem(): HTMLEMenuItemElement | null {
        return this.items[this.activeIndex] || null;
    }

    public connectedCallback() {
        this.tabIndex = this.tabIndex;

        const slot = this.shadowRoot?.querySelector("slot");
        if (slot) {
            slot.addEventListener("slotchange", () => {
                const items = slot.assignedElements()
                    .filter(item => isTagElement("e-menuitem", item)) as HTMLEMenuItemElement[];
                this.items = items;
                items.forEach((item) => {
                    item.group = this;
                });
            });
        }

        this.addEventListener("mousedown", (event: MouseEvent) => {
            let target = event.target as any;
            if (this.items.includes(target)) {
                target.trigger();
            }
        });

        this.addEventListener("mouseover", (event: MouseEvent) => {
            let target = event.target as any;
            let targetIndex = this.items.indexOf(target);
            if (this === target) {
                this.reset();
                this.focus();
            }
            else if (targetIndex >= 0) {
                this.focusItemAt(this.items.indexOf(target), true);
            }
        });

        this.addEventListener("mouseout", (event: MouseEvent) => {
            let target = event.target as any;
            let thisIntersectsWithMouse = pointIntersectsWithDOMRect(
                event.clientX, event.clientY,
                this.getBoundingClientRect()
            );
            if ((this === target || this.items.includes(target)) && !thisIntersectsWithMouse) {
                this.reset();
                this.focus();
            }
        });

        this.addEventListener("focusin", (event: FocusEvent) => {
            let target = event.target as any;
            this._activeIndex = this.items.findIndex(
                (item) => item.contains(target)
            );
        });

        this.addEventListener("focusout", (event: FocusEvent) => {
            let newTarget = event.relatedTarget as any;
            if (!this.contains(newTarget)) {  
                this.reset();
            }
        });
        
        this.addEventListener("change", (event: Event) => {
            let target = event.target as any;
            if (isTagElement("e-menuitem", target)) {
                let item = target;
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
            }
        });
        
        this.addEventListener("keydown", (event: KeyboardEvent) => {
            switch (event.key) {
                case "ArrowUp":
                    if (this.activeIndex > 0) {
                        this.focusItemAt(this.activeIndex - 1);
                        event.stopPropagation();
                    }
                    break;
                case "ArrowDown":
                    if (this.activeIndex < this.items.length - 1) {
                        this.focusItemAt(this.activeIndex + 1);
                        event.stopPropagation();
                    }
                    break;
                case "Enter":
                    if (this.activeItem) {
                        this.activeItem.trigger();
                        event.stopPropagation();
                    }
                    break;
                case "ArrowRight":
                    if (this.items.includes(event.target as any)) {
                        if (this.activeItem?.childMenu) {
                            this.activeItem.childMenu.focusItemAt(0);
                            event.stopPropagation();
                        }
                    }
                    break;
                case "Home":
                    this.focusItemAt(0);
                    break;
                case "End":
                    this.focusItemAt(this.items.length - 1);
                    break;
                case "Escape":
                    this.reset();
                    break;
            }
        });
    }

    public setData(data: HTMLEMenuItemGroupElementData): void {
        this.name = data.name;
        this.label = data.label;
    }

    public getData(): HTMLEMenuItemGroupElementData {
        return {
            name: this.name,
            label: this.label
        };
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

    public focusItemAt(index: number, childMenu?: boolean): void {
        let item = this.items[index];
        if (item) {
            this._activeIndex = index;
            item.focus();
            if (childMenu && item.childMenu) {
                item.childMenu.focus();
            }
        }
    }

    public reset(): void {
        let item = this.activeItem;
        this._activeIndex = -1;
        if (item?.childMenu) {
            item.childMenu.reset();
        }
    }

    public focusItem(predicate: (item: HTMLEMenuItemElement) => boolean, subitems?: boolean): void {
        let item = this.findItem(predicate, subitems);
        if (item) {
            item.focus();
        }
    }

    public findItem(predicate: (item: HTMLEMenuItemElement) => boolean, subitems?: boolean): HTMLEMenuItemElement | null {
        let foundItem: HTMLEMenuItemElement | null = null;
        for (let idx = 0; idx < this.items.length; idx++) {
            let item = this.items[idx];
            if (predicate(item)) {
                return item;
            }
            if (subitems && item.childMenu) {
                foundItem = item.childMenu.findItem(predicate, subitems);
                if (foundItem) {
                    return foundItem;
                }
            }
        }
        return foundItem;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "e-menuitemgroup": HTMLEMenuItemGroupElement,
    }
}