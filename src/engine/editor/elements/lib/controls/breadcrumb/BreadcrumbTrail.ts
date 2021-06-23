import { RegisterCustomHTMLElement, bindShadowRoot } from "engine/editor/elements/HTMLElement";
import { HTMLEBreadcrumbItemElement, isHTMLEBreadcrumbItemElement } from "./BreadcrumbItem";

export { isHTMLEBreadcrumbTrailElement };
export { HTMLEBreadcrumbTrailElement };

function isHTMLEBreadcrumbTrailElement(obj: any): obj is HTMLEBreadcrumbTrailElement {
    return obj instanceof Node && obj.nodeType === obj.ELEMENT_NODE && (obj as Element).tagName.toLowerCase() === "e-breadcrumbtrail";
}

@RegisterCustomHTMLElement({
    name: "e-breadcrumbtrail"
})
class HTMLEBreadcrumbTrailElement extends HTMLElement {

    public items: HTMLEBreadcrumbItemElement[];

    private activeIndex: number;

    constructor() {
        super();

        bindShadowRoot(this, /*template*/`
            <style>
                [part~="ul"] {
                    display: block;
                    list-style-type: none;
                    padding: 0; margin: 0;
                }
            </style>
            <button id="backward">backward</button>
            <button id="forward">forward</button>
            <ul part="ul">
                <slot></slot>
            </ul>
        `);

        this.items = [];
        this.activeIndex = 0;
    }

    public activateItem(item: HTMLEBreadcrumbItemElement) {
        let itemIndex = this.items.indexOf(item);
        if (itemIndex > -1) {
            this.items.forEach((item, index) => {
                item.active = (index == itemIndex);
                item.hidden = (index > itemIndex);
            });
            this.activeIndex = itemIndex;
            let activeItem = this.items[itemIndex];
            activeItem.dispatchEvent(new CustomEvent("activate"));
        }
    }
    
    public connectedCallback() {
        this.tabIndex = this.tabIndex;
        
        const slot = this.shadowRoot?.querySelector("slot");
        if (slot) {
            slot.addEventListener("slotchange", () => {
                const items = slot.assignedElements().filter(isHTMLEBreadcrumbItemElement) as HTMLEBreadcrumbItemElement[];
                this.items = items;
                items.forEach((item, index) => {
                    item.trail = this;
                    item.active = (index === items.length - 1);
                });
            });
        }

        this.addEventListener("mousedown", (event: MouseEvent) => {
            let target = event.target as any;
            if (isHTMLEBreadcrumbItemElement(target)) {
                this.activateItem(target);
            }
        });
    }
}