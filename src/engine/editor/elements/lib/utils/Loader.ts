import { bindShadowRoot, GenerateAttributeAccessors, RegisterCustomHTMLElement } from "engine/editor/elements/HTMLElement";

export { HTMLELoaderElement };
export { HTMLELoaderElementBase };

type LoaderType = "bar" | "circle";

interface HTMLELoaderElement extends HTMLElement {
    type: LoaderType;
    promise: Promise<any> | null;
}

@RegisterCustomHTMLElement({
    name: "e-loader"
})
@GenerateAttributeAccessors([
    {name: "type", type: "string"}
])
class HTMLELoaderElementBase extends HTMLElement implements HTMLELoaderElement {

    public type!: LoaderType;
    private _promise: Promise<any> | null;

    constructor() {
        super();
        
        bindShadowRoot(this, /*template*/`
            <style>
                :host {
                    display: inline-block;
                }
                
                :host([type="bar"]) {
                    display: inline-block;
                    width: 64px;
                }

                :host([type]:not([type="circle"])) [part~="circle"] {
                    display: none !important;
                }
                
                :host(:not([type="bar"])) [part~="bar"] {
                    display: none !important;
                }

                [part~="circle"] {
                    position: relative;
                    width: 12px;
                    height: 12px;
                    border-top: 4px solid var(--loader-color, rgb(0, 128, 255));
                    border-right: 4px solid var(--loader-color, rgb(0, 128, 255));
                    border-left: 4px solid transparent;
                    border-bottom: 4px solid transparent;
                    border-radius: 50%;
                    animation-duration: 1s;
                    animation-name: circle;
                    animation-timing-function: linear;
                    animation-iteration-count: infinite;
                }

                @keyframes circle {
                    0% {
                        transform: rotate(0);
                    }
                    100% {
                        transform: rotate(360deg);
                    }
                }

                [part~="bar"] {
                    display: block;
                    position: relative;
                    overflow: hidden;
                }

                [part~="slider"] {
                    position: relative;
                    display: flex;
                    will-change: transform;
                    animation-duration: 1s;
                    animation-name: slider;
                    animation-timing-function: linear;
                    animation-iteration-count: infinite;
                }

                [part~="cursor"] {
                    position: relative;
                    display: inline-block;
                    width: 32px;
                    height: 4px;
                    background-color: var(--loader-color, rgb(0, 128, 255));
                    border-radius: 4px;

                    will-change: transform;
                    animation-duration: 1s;
                    animation-name: cursor;
                    animation-timing-function: linear;
                    animation-iteration-count: infinite;
                }

                @keyframes slider {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(100%);
                    }
                }

                @keyframes cursor {
                    0% {
                        transform: translateX(-100%);
                    }
                    100% {
                        transform: translateX(100%);
                    }
                }
            </style>
            <div part="bar">
                <div part="slider">
                    <div part="cursor"></div>
                </div>
            </div>
            <div part="circle"></div>
        `);
        this._promise = null;
    }

    public set promise(promise: Promise<any> | null) {
        if (promise) {
            promise.finally(() => {
                this.remove();
            });
        }
        this._promise = promise;
    }

    public get promise(): Promise<any> | null {
        return this._promise;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "e-loader": HTMLELoaderElement,
    }
}