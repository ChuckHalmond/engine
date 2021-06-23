import { RegisterCustomHTMLElement, GenerateAttributeAccessors, bindShadowRoot } from "engine/editor/elements/HTMLElement";
import { TabPanelElement } from "engine/editor/elements/lib/containers/tabs/TabPanel";

export { TabElement };
export { isTabElement };

function isTabElement(elem: Element): elem is TabElement {
    return elem.tagName === "E-TAB";
}

@RegisterCustomHTMLElement({
    name: "e-tab",
    observedAttributes: ["active", "controls"]
})
@GenerateAttributeAccessors([
    {name: "name", type: "string"},
    {name: "active", type: "boolean"},
    {name: "controls", type: "string"},
])
class TabElement extends HTMLElement {

    public name!: string;
    public active!: boolean;
    public controls!: string;

    public panel: TabPanelElement | null;

    constructor() {
        super();


        bindShadowRoot(this, /*template*/`
            <style>
                :host {
                    display: inline-block;
                    user-select: none;
                    white-space: nowrap;
                    padding: 2px 6px;
                    border-bottom: 4px solid transparent;
                    cursor: pointer;
                }

                :host([disabled]) {
                    color: grey;
                }

                :host([active]) {
                    font-weight: bold;
                    border-bottom: 4px solid rgb(92, 92, 92);
                }
            </style>
            <slot></slot>
        `);

        this.panel = null;
    }

    public connectedCallback() {

        this.tabIndex = this.tabIndex;
        
        this.panel = document.getElementById(this.controls) as TabPanelElement | null;
        if (this.panel) {
            this.panel.addEventListener("connected", () => {
                if (this.active) {
                    this.show();
                }
                else {
                    this.hide();
                }
            }, {once: true});
        }
    }

    public show() {
        this.active = true;
    }

    public hide() {
        this.active = false;
    }

    public attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
        switch (name) {
            case "controls":
                if (oldValue !== newValue) {
                    this.panel = document.getElementById(newValue) as TabPanelElement | null;
                }
                break;
            case "active":
                if (this.panel) {
                    if (this.active) {
                        this.panel.show();
                    }
                    else {
                        this.panel.hide();
                    }
                }
                break;
        }
    }
}