import { bindShadowRoot, isTagElement, RegisterCustomHTMLElement } from "engine/editor/elements/HTMLElement";
import { HTMLETabElement } from "engine/editor/elements/lib/containers/tabs/Tab";

export { TabChangeEvent };
export { HTMLETabListElement };
export { BaseHTMLETabListElement };

interface HTMLETabListElement extends HTMLElement {
    readonly activeTab: HTMLETabElement | null;
    tabs: HTMLETabElement[];
}

type TabChangeEvent = CustomEvent<{
    tab: HTMLETabElement;
}>

@RegisterCustomHTMLElement({
    name: "e-tablist"
})
class BaseHTMLETabListElement extends HTMLElement implements HTMLETabListElement {

    public tabs: HTMLETabElement[];

    private _activeIndex: number;

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
        this._activeIndex = 1;
    }

    public get activeTab(): HTMLETabElement | null {
        return this.tabs[this._activeIndex] || null;
    }

    public connectedCallback(): void {
        this.tabIndex = this.tabIndex;

        const slot = this.shadowRoot!.querySelector("slot");
        if (slot) {
            slot.addEventListener("slotchange", (event: Event) => {
                const tabs = (event.target as HTMLSlotElement)
                    .assignedElements()
                    .filter(tab => isTagElement("e-tab", tab)) as HTMLETabElement[];
                this.tabs = tabs;
                this._activeIndex = this.tabs.findIndex(tab => tab.active);
            });
        }
        
        this.addEventListener("click", (event) => {
            let target = event.target as any;
            if (isTagElement("e-tab", target)) {
                target.active = true;
            }
        });

        this.addEventListener("tabchange", (event: TabChangeEvent) => {
            let targetIndex = this.tabs.indexOf(event.detail.tab);
            this._activeIndex = targetIndex;
            this.tabs.forEach((thisTab, thisTabIndex) => {
                if (thisTabIndex !== targetIndex) {
                    thisTab.active = false;
                }
            });
        });
    }

    public findTab(predicate: (tab: HTMLETabElement) => boolean): HTMLETabElement | null {
        return this.tabs.find(predicate) || null;
    }

    public activateTab(predicate: (tab: HTMLETabElement) => boolean) {
        let tab = this.tabs.find(predicate);
        if (tab) {
            tab.active = true;
        }
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "e-tablist": HTMLETabListElement,
    }
}

declare global {
    interface HTMLElementEventMap {
        "tabchange": TabChangeEvent
    }
}