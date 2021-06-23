import { bindShadowRoot, GenerateAttributeAccessors, RegisterCustomHTMLElement } from "engine/editor/elements/HTMLElement";
import { isTabElement, TabElement } from "engine/editor/elements/lib/containers/tabs/Tab";

export { TabListElement };

@RegisterCustomHTMLElement({
    name: "e-tab-list"
})
class TabListElement extends HTMLElement {
    public tabs: TabElement[];
    
    constructor() {
        super();
        
        bindShadowRoot(this, /*template*/`
            <style>
                :host {
                    display: block;
                }
            </style>
            <slot id="tabs"></slot>
        `);

        this.tabs = [];
        
        const tabsSlot = this.shadowRoot!.getElementById("tabs")!;
        tabsSlot.addEventListener("slotchange", (event: Event) => {
            const tabs = (event.target as HTMLSlotElement).assignedElements().filter(isTabElement);
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
            if (isTabElement(target)) {
                this.dispatchEvent(new CustomEvent<{tab: string}>("tabchange", {
                    detail: {
                        tab: target.name
                    },
                    bubbles: true
                }));
            }
        });
    }

    public connectedCallback() {
        this.tabIndex = this.tabIndex;
    }
}