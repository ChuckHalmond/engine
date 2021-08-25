import { RegisterCustomHTMLElement, bindShadowRoot, isTagElement } from "engine/editor/elements/HTMLElement";
import { HTMLEBreadcrumbItemElement } from "./BreadcrumbItem";

export { HTMLEBreadcrumbTrailElement };
export { HTMLEBreadcrumbTrailElementBase };

interface HTMLEBreadcrumbTrailElement extends HTMLElement {
    items: HTMLEBreadcrumbItemElement[];
    activateItem(item: HTMLEBreadcrumbItemElement): void;
}

@RegisterCustomHTMLElement({
    name: "e-breadcrumbtrail"
})
class HTMLEBreadcrumbTrailElementBase extends HTMLElement implements HTMLEBreadcrumbTrailElement {

    public items: HTMLEBreadcrumbItemElement[];

    constructor() {
        super();

        bindShadowRoot(this, /*template*/`
            <style>
                :host {
                    display: block;
                }
                
                [part~="ul"] {
                    display: flex;
                    flex-direction: row;
                    list-style-type: none;
                    padding: 0; margin: 0;
                }
            </style>
            <ul part="ul">
                <slot></slot>
            </ul>
        `);

        this.items = [];
    }

    public activateItem(item: HTMLEBreadcrumbItemElement): void {
        let itemIndex = this.items.indexOf(item);
        if (itemIndex > -1) {
            this.items.forEach((item, index) => {
                item.active = (index == itemIndex);
                item.hidden = (index > itemIndex);
            });
            let activeItem = this.items[itemIndex];
            activeItem.dispatchEvent(new CustomEvent("activate"));
        }
    }
    
    public connectedCallback() {
        this.tabIndex = this.tabIndex;
        
        const slot = this.shadowRoot?.querySelector("slot");
        if (slot) {
            slot.addEventListener("slotchange", () => {
                const items = slot.assignedElements().filter(item => isTagElement("e-breadcrumbitem", item)) as HTMLEBreadcrumbItemElement[];
                this.items = items;
                items.forEach((item, index) => {
                    item.active = (index === items.length - 1);
                });
            });
        }

        this.addEventListener("mousedown", (event: MouseEvent) => {
            let target = event.target as any;
            if (isTagElement("e-breadcrumbitem", target)) {
                this.activateItem(target);
            }
        });
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "e-breadcrumbtrail": HTMLEBreadcrumbTrailElement,
    }
}