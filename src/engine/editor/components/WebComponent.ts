/*
class WebComponent extends HTMLElement {
    
    constructor() {
        super();
    }

    public connectedCallback(): void {

    }

    public disconnectedCallback(): void {

    }

    public attributeChangedCallback(name: string, oldValue: string, newValue: string): void {

    }

    public beforeUpdate() {
        
    }

    public update(): void  {

    }

    public afterUpdate() {

    }

    public requestUpdate(): void  {

    }

    public render(): void  {

    }
}

interface CustomHTMLElementDecorator {
    (args: {
        name: string;
        options?: ElementDefinitionOptions
    }): <C extends CustomElementConstructor>(elementCtor: C) => C;
}

const CustomHTMLElement: CustomHTMLElementDecorator = function(args: {
    name: string;
    options?: ElementDefinitionOptions
}) {
    return <C extends CustomElementConstructor>(
        elementCtor: C
    ) => {

        customElements.define(
            args.name,
            elementCtor,
            args.options
        );

        return elementCtor;
    }
}

class HTMLEELement extends HTMLElement {

    constructor() {
        super();
        let prototype = (Object.getPrototypeOf(this) as typeof HTMLEELement);
        this.attachShadow({mode: "open"});
    }

    connectedCallback() {
        this.dispatchEvent(new CustomEvent("connected"));
    }

    disconnectedCallback() {
        this.dispatchEvent(new CustomEvent("disconnected"));
    }

    render(): Node {
        return this.shadowRoot!;
    }
}

interface ReactiveDecorator {
    (args?: {
        hasChanged?: (oldValue: any, newValue: any) => boolean;
        type?: "string" | "number" | "boolean" | "array" | "object";
        reflect?: boolean;
    }): <E extends HTMLEELement>(elementPrototype: E, propertyKey: string) => void;
}

const Reactive: ReactiveDecorator = function(args?: {
    hasChanged?: (oldValue: any, newValue: any) => boolean;
    type?: "string" | "number" | "boolean" | "array" | "object";
    reflect?: boolean;
}) {
    return <E extends HTMLEELement>(
        elementPrototype: E, propertyKey: string
    ) => {
        if (args) {
            Object.defineProperty(elementPrototype, propertyKey, {
                set: function(this: E, value) {
                    let propertyHasChanged = true;
                    if (typeof args !== "undefined" && typeof args.hasChanged === "function") {
                        propertyHasChanged = args.hasChanged((this as {[k: string]: any})[propertyKey], value)
                    }
                    else {
                        propertyHasChanged = ((this as {[k: string]: any})[propertyKey] !== value);
                    }
                    (this as {[k: string]: any})[propertyKey] = value;
                    if (args.reflect) {
                        switch (args.type) {
                            case "boolean":
                                if (value) {
                                    this.setAttribute(propertyKey, "");
                                }
                                else {
                                    this.removeAttribute(propertyKey);
                                }
                                break;
                            case "number":
                            case "string":
                                if (typeof value !== "undefined" && value !== null) {
                                    this.setAttribute(propertyKey, value);
                                }
                                else {
                                    this.removeAttribute(propertyKey);
                                }
                                break;
                            case "object":
                            case "array":
                                if (typeof value !== "undefined" && value !== null) {
                                    this.setAttribute(propertyKey, JSON.stringify(value));
                                }
                                else {
                                    this.removeAttribute(propertyKey);
                                }
                                break;
                        }
                    }
                    if (propertyHasChanged) {
                        this.update();
                    }
                }
            });
        }
    }
}

let html = function(parts: TemplateStringsArray, ...expr: any[]) {
    let events: [string, EventListener][] = [];
    let parsedParts = [];
    for (let i = 0; i < parts.length; i++) {
      let part = parts[i];
      let eventAttribute = /@(.*)=/.exec(part);
      if (eventAttribute !== null) {
        if (typeof expr[i] === "function") {
          events.push([eventAttribute[1], expr[i]]);
          parsedParts.push(part.substr(0, part.indexOf("@")).trimRight());
        }
      }
      else {
        parsedParts.push(part);
      }
    }
    const template = document.createElement("template");
    template.innerHTML = parsedParts.join();
    const parsedHTML = new DOMParser().parseFromString(parsedParts.join(), "text/html").body.firstChild;
    if (!parsedHTML) {
      throw new Error();
    }
    if (parsedHTML.nodeType === parsedHTML.ELEMENT_NODE) {
      events.forEach((event) => {
        parsedHTML.addEventListener(event[0], event[1]);
      });
    }
    return parsedHTML;
  }
*/