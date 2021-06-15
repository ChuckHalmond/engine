import { bindShadowRoot, GenerateAttributeAccessors, RegisterCustomHTMLElement } from "engine/editor/elements/HTMLElement";
import { isTabElement } from "engine/editor/elements/lib/containers/tabs/Tab";

export { TabListElement };

@RegisterCustomHTMLElement({
    name: "e-tab-list"
})
@GenerateAttributeAccessors([
    {name: "activeTab", type: "string"},
])
class TabListElement extends HTMLElement {

    public activeTab!: string;

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

        const tabsSlot = this.shadowRoot!.getElementById("tabs")!;
        tabsSlot.addEventListener("slotchange", (event: Event) => {

            const slottedTabs = (event.target as HTMLSlotElement).assignedElements();
            slottedTabs.forEach((tab) => {
                if (isTabElement(tab)) {

                    this.addEventListener("tabchange", ((event: CustomEvent<{tab: string}>) => {
                        if ((event.detail.tab === tab.name)) {
                            tab.show();
                        }
                        else {
                            tab.hide();
                        }
                    }) as EventListener);
                    
                    tab.addEventListener("click", () => {
                        this.dispatchEvent(new CustomEvent<{tab: string}>("tabchange", {
                            detail: {
                                tab: tab.name
                            }
                        }));
                    });
                }
            });

            this.addEventListener("tabchange", ((event: CustomEvent<{tab: string}>) => {
                this.activeTab = event.detail.tab;
            }) as EventListener);
        }, {once: true});
    }

    public connectedCallback() {
        this.tabIndex = this.tabIndex;
    }
}