import { RegisterCustomHTMLElement, GenerateAttributeAccessors, isTagElement, Fragment } from "engine/editor/elements/HTMLElement";
import { HTMLETreeViewListElement } from "./TreeViewList";

export { HTMLETreeViewItemElement };
export { BaseHTMLETreeViewItemElement };

interface HTMLETreeViewItemElement extends HTMLElement {
    name: string;
    label: string;
    expanded: boolean;
    indent: number;
    icon: string;
    active: boolean;

    items: HTMLETreeViewItemElement[];
    parent: HTMLETreeViewItemElement | HTMLETreeViewListElement | null;

    deepestVisibleChildItem(): HTMLETreeViewItemElement;
    previousVisibleItem(): HTMLETreeViewItemElement;
    nextVisibleItem(): HTMLETreeViewItemElement;
    nearestParentItem(): HTMLETreeViewItemElement;

    trigger(): void;
}

@RegisterCustomHTMLElement({
    name: "e-treeviewitem",
    observedAttributes: ["icon", "label", "expanded", "indent"]
})
@GenerateAttributeAccessors([
    {name: "name", type: "string"},
    {name: "label", type: "string"},
    {name: "icon", type: "string"},
    {name: "indent", type: "number"},
    {name: "active", type: "boolean"},
    {name: "expanded", type: "boolean"}
])
class BaseHTMLETreeViewItemElement extends HTMLElement implements HTMLETreeViewItemElement {

    public name!: string;
    public label!: string;
    public indent!: number;
    public expanded!: boolean;
    public value!: string;
    public icon!: string;
    public active!: boolean;

    public items: HTMLETreeViewItemElement[];
    public parent: HTMLETreeViewItemElement | HTMLETreeViewListElement | null;

    constructor() {
        super();

        this.attachShadow({mode: "open"}).append(
            Fragment(/*html*/`
                <style>
                    :host {
                        position: relative;
                        display: inline-block;

                        user-select: none;
                        white-space: nowrap;

                        padding: 0;
                        cursor: pointer;

                        --indent-width: 8px;
                    }

                    :host(:focus) {
                        outline: none;
                    }

                    [part~="content"]:hover {
                        background-color: gainsboro;
                    }

                    :host([active]) [part~="content"] {
                        background-color: gainsboro;
                    }

                    :host([active]) [part~="content"]::after {
                        z-index: 1;
                        content: "";
                        position: absolute;
                        top: 0;
                        left: 0;
                        display: block;
                        width: 100%;
                        height: 100%;
                        outline: 1px solid black;
                        pointer-events: none;
                    }

                    :host(:not([expanded])) [part~="container"] {
                        display: none;
                    }

                    [part~="li"] {
                        display: block;
                        height: 100%;
                        list-style-type: none;
                    }

                    [part~="content"] {
                        position: relative;
                        font-size: 1em;
                        display: flex;
                        padding-left: calc(var(--tree-indent) * var(--indent-width));
                    }

                    [part~="label"] {
                        display: block;
                        width: 100%;

                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                    }

                    :host(:empty) [part~="expand_arrow"] {
                        visibility: hidden;
                    }

                    :host(:empty) [part~="container"] {
                        display: none;
                    }

                    [part~="expand_arrow"] {
                        color: dimgray;
                        padding-right: 4px;
                    }

                    :host(:not([expanded])) [part~="expand_arrow"]::after {
                        content: "►";
                    }

                    :host([expanded]) [part~="expand_arrow"]::after {
                        content: "▼";
                    }

                    [part~="state"] {
                        flex: none;
                    }

                    [part~="container"] {
                        position: relative;
                        display: flex;
                        flex-direction: column;
                        padding: 0;
                        margin: 0;
                    }

                    [part~="container"]::after {
                        content: "";
                        position: absolute;
                        left: calc(var(--tree-indent) * var(--indent-width));
                        height: 100%;
                        width: 1px; 
                        border-left: 1px solid black;
                    }
                </style>
                <li part="li">
                    <span part="content">
                        <span part="expand_arrow"></span>
                        <span part="icon"></span>
                        <span part="label"></span>
                        <span part="state"></span>
                    </span>
                    <ul part="container">
                        <slot></slot>
                    </ul>
                </li>
            `)
        );
        this.items = [];
        this.parent = null;
        this.indent = 0;
    }

    public connectedCallback() {
        this.tabIndex = this.tabIndex;

        this.setAttribute("aria-label", this.label);

        const itemsSlot = this.shadowRoot?.querySelector<HTMLSlotElement>("slot");
        if (itemsSlot) {
            itemsSlot.addEventListener("slotchange", () => {
                const items = itemsSlot.assignedElements()
                    .filter(item => isTagElement("e-treeviewitem", item)) as HTMLETreeViewItemElement[];
                this.items = items;
                this.items.forEach((item) => {
                    item.parent = this;
                    item.indent = this.indent + 1;
                });
            });
        }
    }

    public attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
        if (newValue !== oldValue) {
            switch (name) {
                case "label":
                    if (oldValue !== newValue) {
                        const labelPart = this.shadowRoot?.querySelector("[part~=label]");
                        if (labelPart) {
                            labelPart.textContent = newValue;
                        }
                    }
                    break;
                case "icon":
                    if (oldValue !== newValue) {
                        const iconPart = this.shadowRoot?.querySelector<HTMLElement>("[part~=icon]");
                        if (iconPart) {
                            iconPart.dataset.value = newValue;
                        }
                    }
                    break;
                case "indent":
                    if (oldValue !== newValue) {
                        this.style.setProperty("--tree-indent", newValue);
                    }
                    break;
            }
        }
    }

    public deepestVisibleChildItem(): HTMLETreeViewItemElement {
        if (this.expanded && this.items.length > 0) {
            let lastChildItem = this.items[this.items.length - 1];
            return lastChildItem.deepestVisibleChildItem();
        }
        return this;
    }

    public previousVisibleItem(): HTMLETreeViewItemElement {
        if (this.parent) {
            let indexOfThis = this.parent.items.indexOf(this);
            if (indexOfThis > 0) {
                let previousItem = this.parent.items[indexOfThis - 1];
                return previousItem.deepestVisibleChildItem();
            }
            return isTagElement("e-treeviewitem", this.parent) ? this.parent : this;
        }
        return this;
    }

    public nextVisibleItem(): HTMLETreeViewItemElement {
        if (this.expanded && this.items.length > 0) {
            return this.items[0];
        }
        let nearestItem = this.nearestParentItem();
        if (nearestItem.parent) {
            let indexOfNearest = nearestItem.parent.items.indexOf(nearestItem);
            if (indexOfNearest < nearestItem.parent.items.length - 1) {
                return nearestItem.parent.items[indexOfNearest + 1];
            }
        }
        return this;
    }

    public nearestParentItem(): HTMLETreeViewItemElement {
        if (isTagElement("e-treeviewitem", this.parent)) {
            let indexOfThis = this.parent.items.indexOf(this);
            if (indexOfThis === this.parent.items.length - 1) {
                return this.parent.nearestParentItem();
            }
        }
        return this;
    }

    public trigger(): void {
        this.expanded = !this.expanded;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "e-treeviewitem": HTMLETreeViewItemElement,
    }
}