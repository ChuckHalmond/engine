import { RegisterCustomHTMLElement, GenerateAttributeAccessors, isTagElement, Fragment } from "engine/editor/elements/HTMLElement";
import { HTMLETreeViewItemElement } from "./TreeViewItem";

export { HTMLETreeViewListElement };
export { BaseHTMLETreeViewListElement };

interface HTMLETreeViewListElement extends HTMLElement {
    name: string;
    items: HTMLETreeViewItemElement[];
    readonly activeItem: HTMLETreeViewItemElement | null;
}

@RegisterCustomHTMLElement({
    name: "e-treeviewlist"
})
@GenerateAttributeAccessors([
    {name: "active", type: "boolean"},
    {name: "name", type: "string"}
])
class BaseHTMLETreeViewListElement extends HTMLElement implements HTMLETreeViewListElement {

    public active!: boolean;
    public name!: string;
    
    public items: HTMLETreeViewItemElement[];

    private _activeItem: HTMLETreeViewItemElement | null;

    constructor() {
        super();
        
        this.attachShadow({mode: "open"}).append(
            Fragment(/*html*/`
                <style>
                    :host {
                        display: block;
                        position: relative;
                        user-select: none;
                    }

                    [part~="container"] {
                        position: relative;
                        display: flex;
                        flex-direction: column;
                        padding: 2px;
                        margin: 0;
                    }
                </style>
                <ul part="container">
                    <slot></slot>
                </ul>
            `)
        );

        this.items = [];
        this._activeItem = null;
    }

    public get activeItem(): HTMLETreeViewItemElement | null {
        return this._activeItem;
    }

    public connectedCallback() {
        this.tabIndex = this.tabIndex;
        
        const slot = this.shadowRoot?.querySelector("slot");
        if (slot) {
            slot.addEventListener("slotchange", () => {
                const items = slot.assignedElements()
                    .filter(item => isTagElement("e-treeviewitem", item)) as HTMLETreeViewItemElement[];
                this.items = items;
                items.forEach((item) => {
                    item.parent = this;
                    item.indent = 0;
                });
            });
        }
        
        this.addEventListener("keydown", (event: KeyboardEvent) => {
            switch (event.key) {
                case "ArrowLeft":
                    if (this.activeItem) {
                        if (this.activeItem.expanded) {
                            this.activeItem.expanded = false;
                        }
                        else {
                            if (isTagElement("e-treeviewitem", this.activeItem.parent)) {
                                this.activeItem.parent.focus();
                            }
                        }
                    }
                    event.preventDefault();
                    break;
                case "ArrowRight":
                    if (this.activeItem) {
                        if (!this.activeItem.expanded) {
                            this.activeItem.expanded = true;
                        }
                        else {
                            if (this.activeItem.items.length > 0) {
                                this.activeItem.items[0].focus();
                            }
                        }
                    }
                    event.preventDefault();
                    break;
                case "ArrowUp":
                    if (this.activeItem) {
                        this.activeItem.previousVisibleItem().focus();
                    }
                    event.preventDefault();
                    break;
                case "ArrowDown":
                    if (this.activeItem) {
                        this.activeItem.nextVisibleItem().focus();
                    }
                    event.preventDefault();
                    break;
                case "Home":
                    if (this.items.length > 0) {
                        this.items[0].focus({preventScroll: true});
                    }
                    event.preventDefault();
                    break;
                case "End":
                    if (this.items.length > 0) {
                        this.items[this.items.length - 1].deepestVisibleChildItem().focus();
                    }
                    event.preventDefault();
                    break;
                case "Enter":
                    if (this.activeItem) {
                        this.activeItem.trigger();
                    }
                    event.preventDefault();
                    break;
                case "Escape":
                    this.active = false;
                    if (this.activeItem) {
                        this.activeItem.active = false;
                    }
                    this.focus();
                    event.preventDefault();
                    break;
            }
        });

        this.addEventListener("mousedown", (event: MouseEvent) => {
            if (isTagElement("e-treeviewitem", event.target)) {
                event.target.trigger();
            }
        });

        this.addEventListener("focusin", (event: FocusEvent) => {
            let target = event.target as any;
            if (!this.active) {
                this.active = true;
            }
            if (isTagElement("e-treeviewitem", target)) {
                if (this._activeItem) {
                    this._activeItem.active = false;
                }
                this._activeItem = target;
                this._activeItem.active = true;
            }
        });

        this.addEventListener("focusout", (event: FocusEvent) => {
            let relatedTarget = event.relatedTarget as any;
            if (!this.contains(relatedTarget)) {
                this.active = false;
            }
        });
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "e-treeviewlist": HTMLETreeViewListElement,
    }
}
