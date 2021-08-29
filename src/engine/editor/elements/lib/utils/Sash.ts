import { bindShadowRoot, GenerateAttributeAccessors, RegisterCustomHTMLElement } from "engine/editor/elements/HTMLElement";
import { EventBase } from "engine/libs/patterns/messaging/events/EventDispatcher";

export { HTMLESashElement };
export { HTMLESashElementBase };

interface HTMLESashElement extends HTMLElement {
    controls: string;
}

@RegisterCustomHTMLElement({
    name: "e-sash"
})
@GenerateAttributeAccessors([
    {name: "controls", type: "string"},
])
class HTMLESashElementBase extends HTMLElement implements HTMLESashElement {

    public controls!: string;
    public target: HTMLElement | null;

    constructor() {
        super();
        
        bindShadowRoot(this, /*template*/`
            <style>
                :host {
                    display: block;

                    width: 4px;
                    background-color: rgb(0, 128, 255);
                    cursor: ew-resize;

                    transition-property: opacity;
                    transition-delay: 0.2s;
                    transition-duration: 0.2s;
                    transition-timing-function: ease-out;
                    opacity: 0;
                }

                :host(:active),
                :host(:hover) {
                    opacity: 1;
                }
            </style>
        `);
        this.target = null;
    }

    public connectedCallback(): void {
        let target = document.getElementById(this.controls);
        if (target) {
            this.target = target;
        }

        this.addEventListener("mousedown", () => {
            let onMouseMove = (event: MouseEvent) => {
                if (this.target) {
                    let directionToTarget = Math.sign(
                        this.getBoundingClientRect().x - this.target.getBoundingClientRect().x 
                    );
                    let lastWidth = parseFloat(
                        window.getComputedStyle(this.target).getPropertyValue("width")
                    );
                    let newWidth = Math.trunc(lastWidth + directionToTarget * event.movementX);
                    this.target.style.setProperty("width", `${newWidth}px`);
                    document.documentElement.style.setProperty("cursor", "ew-resize");
                    document.documentElement.style.setProperty("pointer-events", "none");
                    this.dispatchEvent(new EResizeCustomEventBase({detail: {target: this.target, width: newWidth}}));
                }
            };
            document.addEventListener("mousemove", onMouseMove);
            document.addEventListener("mouseup", () => {
                document.removeEventListener("mousemove", onMouseMove);
                document.documentElement.style.removeProperty("cursor");
                document.documentElement.style.removeProperty("pointer-events");
            }, {once: true});
        });
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "e-sash": HTMLESashElement,
    }
}

class EResizeCustomEventBase extends CustomEvent<{
    target: Element;
    width: number;
}> {
    constructor(eventInitDict?: CustomEventInit<{target: Element,  width: number}>) {
        super("e-resize", eventInitDict);
    }
}

type EResizeCustomEvent = CustomEvent<{
    target: Element;
    width: number;
}>;

declare global {
    interface HTMLElementEventMap {
        "e-resize": EResizeCustomEvent,
    }
}