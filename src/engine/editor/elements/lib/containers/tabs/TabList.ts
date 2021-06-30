import { bindShadowRoot, RegisterCustomHTMLElement } from "engine/editor/elements/HTMLElement";
import { isHTMLETabElement, HTMLETabElement } from "engine/editor/elements/lib/containers/tabs/Tab";

export { HTMLETabListElement };
export { BaseHTMLETabListElement };

interface HTMLETabListElement extends HTMLElement {
    tabs: HTMLETabElement[];
}

@RegisterCustomHTMLElement({
    name: "e-tablist"
})
class BaseHTMLETabListElement extends HTMLElement implements HTMLETabListElement {
    public tabs: HTMLETabElement[];
    
    constructor() {
        super();
        
        bindShadowRoot(this, /*template*/`
            <style>
                :host {
                    display: block;
                }
            </style>
            <slot></slot>
        `);

        this.tabs = [];
        
        const slot = this.shadowRoot!.querySelector("slot")!;
        slot.addEventListener("slotchange", (event: Event) => {
            const tabs = (event.target as HTMLSlotElement).assignedElements().filter(isHTMLETabElement);
            this.tabs = tabs;
        });
        
        this.addEventListener("tabchange", ((event: CustomEvent<{tab: string}>) => {
            this.tabs.forEach((tab) => {
                if ((event.detail.tab === tab.name)) {
                    tab.show();
                }
                else {
                    tab.hide();
                }
            });
        }) as EventListener);
        
        this.addEventListener("click", (event) => {
            let target = event.target as any;
            if (isHTMLETabElement(target)) {
                this.dispatchEvent(new CustomEvent<{tab: string}>("tabchange", {
                    detail: {
                        tab: target.name
                    },
                    bubbles: true
                }));
            }
        });
    }

    public connectedCallback(): void {
        this.tabIndex = this.tabIndex;
    }
}