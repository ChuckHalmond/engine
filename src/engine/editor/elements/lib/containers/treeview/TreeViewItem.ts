import { RegisterCustomHTMLElement, GenerateAttributeAccessors, isTagElement, Fragment, bindShadowRoot } from "engine/editor/elements/HTMLElement";
import { HTMLETreeViewListElement } from "./TreeViewList";

export { HTMLETreeViewItemElement };
export { HTMLETreeViewItemElementBase };

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

    toggle(): void;
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
class HTMLETreeViewItemElementBase extends HTMLElement implements HTMLETreeViewItemElement {

    public name!: string;
    public label!: string;
    public indent!: number;
    public expanded!: boolean;
    public value!: string;
    public icon!: string;
    public active!: boolean;

    public items: HTMLETreeViewItemElement[];
    public parent: HTMLETreeViewItemElement | HTMLETreeViewListElement | null;
    private _toggleArrow: Element;

    constructor() {
        super();

        let collapseArrowUrl = JSON.stringify("../assets/editor/icons/chevron_right_black_18dp.svg");
        let expandArrowUrl = JSON.stringify("../assets/editor/icons/expand_more_black_18dp.svg");

        bindShadowRoot(this, /*template*/`
            <link rel="preload" href=${collapseArrowUrl} as="image" crossorigin>
            <link rel="preload" href=${expandArrowUrl} as="image" crossorigin>
            <style>
                :host {
                    display: inline-block;

                    user-select: none;
                    white-space: nowrap;

                    padding: 0;
                    cursor: pointer;

                    --indent-width: 8px;
                    --collapsed-arrow-url: url(${collapseArrowUrl});
                    --expanded-arrow-url: url(${expandArrowUrl});
                }
                
                :host([active]) [part~="content"],
                [part~="content"]:hover {
                    background-color: gainsboro;
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

                :host(:empty) [part~="toggle_arrow"] {
                    visibility: hidden;
                }

                :host(:empty) [part~="container"] {
                    display: none;
                }

                [part~="toggle_arrow"] {
                    position: relative;
                    width: 18px;
                    height: 18px;
                    padding-right: 8px;
                }

                [part~="toggle_arrow"]::after {
                    content: "";
                    display: inline-block;
                    width: 18px;
                    height: 18px;
                    position: absolute;
                    background-color: dimgray;
                    transform: scale(1.2) translateY(4%);
                }

                :host(:not([expanded])) [part~="toggle_arrow"]::after {
                    -webkit-mask-image: var(--collapsed-arrow-url);
                    mask-image: var(--collapsed-arrow-url);
                }

                :host([expanded]) [part~="toggle_arrow"]::after {
                    -webkit-mask-image: var(--expanded-arrow-url);
                    mask-image: var(--expanded-arrow-url);
                }

                [part~="state"] {
                    flex: none;
                }

                [part~="container"] {
                    display: flex;
                    flex-direction: column;
                    padding: 0;
                    margin: 0;
                }
            </style>
            <li part="li">
                <span part="content">
                    <span part="toggle_arrow"></span>
                    <span part="icon"></span>
                    <span part="label"></span>
                    <span part="state"></span>
                </span>
                <ul part="container">
                    <slot></slot>
                </ul>
            </li>
        `);
        this.items = [];
        this.parent = null;
        this.indent = 0;

        this._toggleArrow = this.shadowRoot!.querySelector("[part~=toggle_arrow]")!;
    }

    public connectedCallback() {
        this.tabIndex = this.tabIndex;

        this.setAttribute("aria-label", this.label);

        const slot = this.shadowRoot?.querySelector<HTMLSlotElement>("slot");
        if (slot) {
            slot.addEventListener("slotchange", () => {
                const items = slot.assignedElements()
                    .filter(item => isTagElement("e-treeviewitem", item)) as HTMLETreeViewItemElement[];
                this.items = items;
                this.items.forEach((item) => {
                    item.parent = this;
                    item.indent = this.indent + 1;
                });
            });
        }

        this.shadowRoot!.addEventListener("mousedown", (event) => {
            let target = event.target as any;
            if (target === this._toggleArrow) {
                this.toggle();
            }
        });
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

    public toggle(): void {
        this.expanded = !this.expanded;
        this.dispatchEvent(new CustomEvent("e-toggle", {bubbles: true}));
    }

    public trigger(): void {
        this.dispatchEvent(new CustomEvent("e-trigger", {bubbles: true}));
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "e-treeviewitem": HTMLETreeViewItemElement,
    }
}

declare global {
    interface HTMLElementEventMap {
        "e-toggle": Event,
    }
}

declare global {
    interface HTMLElementEventMap {
        "e-trigger": Event,
    }
}