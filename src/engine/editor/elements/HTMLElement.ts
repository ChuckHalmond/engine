import { forAllHierarchyElements } from "./Snippets";

export { isTagElement };
export { RegisterCustomHTMLElement };
export { GenerateAttributeAccessors };
export { createTemplate };
export { bindShadowRoot };
export { HTMLElementDescription };
export { setHTMLElementProperties };
export { setHTMLElementAttributes };
export { HTMLElementConstructor };
export { ReactiveHTMLElement };
export { AttributeMutationMixin };
export { AttributeType };
export { areAttributesMatching };
export { BaseAttributeMutationMixin };
export { createMutationObserverCallback };

function isTagElement<K extends keyof HTMLElementTagNameMap>(tagName: K, obj: any): obj is HTMLElementTagNameMap[K] {
    return obj instanceof Node && obj.nodeType === obj.ELEMENT_NODE && (obj as Element).tagName.toLowerCase() == tagName;
}

interface RegisterCustomHTMLElementDecorator {
    (args: {
        name: string;
        observedAttributes?: string[],
        options?: ElementDefinitionOptions
    }): <C extends CustomElementConstructor>(elementCtor: C) => C;
}

const RegisterCustomHTMLElement: RegisterCustomHTMLElementDecorator = function(args: {
    name: string;
    attributes?: string[],
    observedAttributes?: string[],
    options?: ElementDefinitionOptions
}) {
    return <C extends CustomElementConstructor>(
        elementCtor: C
    ) => {
        const { name, observedAttributes, options } = args;

        if (observedAttributes) {
            Object.defineProperty(elementCtor.prototype.constructor, 'observedAttributes', {
                get: () => {
                    return observedAttributes;
                }
            });
        }

        customElements.define(
            name,
            elementCtor,
            options
        );

        return elementCtor;
    }
}
/*
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

    update() {
        this.shadowRoot!.innerHTML = this.render();
    }

    render(): Node {
        return this.shadowRoot!;
    }
}

interface PropertyDecorator {
    (args?: {
        hasChanged?: (oldValue: any, newValue: any) => boolean;
        type?: "string" | "number" | "boolean" | "array" | "object";
        reflect?: boolean;
    }): <E extends HTMLEELement>(elementPrototype: E, propertyKey: string) => void;
}

const Property: PropertyDecorator = function(args?: {
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

class temp extends HTMLEELement {
    @Property()
    myprop: string = "lol";
}


*/
interface GenerateAttributeAccessorsDecorator {
    (attributes: {
        name: string,
        type?: "string" | "number" | "boolean" | "json"
    }[]): <C extends CustomElementConstructor>(elementCtor: C) => C;
}

const GenerateAttributeAccessors: GenerateAttributeAccessorsDecorator = function(attributes: {
    name: string,
    type?: "string" | "number" | "boolean" | "json"
}[]) {
    return <C extends CustomElementConstructor>(
        elementCtor: C
    ) => {
        attributes.forEach((attr: {
            name: string,
            type?: "string" | "number" | "boolean" | "json"
        }) => {
            const { name,  type } = attr;
            switch (type) {
                case "boolean":
                    Object.defineProperty(elementCtor.prototype, name, {
                        get: function(this: HTMLElement) {
                            const val = this.getAttribute(name);
                            return (val === "" || false);
                        },
                        set: function(this: HTMLElement, value) {
                            if (value) {
                                this.setAttribute(name, "");
                            }
                            else {
                                this.removeAttribute(name);
                            }
                        }
                    });
                    break;
                case "json":
                    Object.defineProperty(elementCtor.prototype, name, {
                        get: function(this: HTMLElement) {
                            const val = this.getAttribute(name);
                            return (val !== null) ? JSON.parse(val) : void 0;
                        },
                        set: function(this: HTMLElement, value) {
                            if (value !== null) {
                                this.setAttribute(name, JSON.stringify(value));
                            }
                            else {
                                this.removeAttribute(name);
                            }
                        }
                    });
                    break;
                case "number":
                case "string":
                default:
                    Object.defineProperty(elementCtor.prototype, name, {
                        get: function(this: HTMLElement) {
                            const val = this.getAttribute(name);
                            return val;
                        },
                        set: function(this: HTMLElement, value) {
                            if (value) {
                                this.setAttribute(name, value);
                            }
                            else {
                                this.removeAttribute(name);
                            }
                        }
                    });
                    break;
            }
        });

        return elementCtor;
    }
}

function createTemplate<E extends Element | DocumentFragment>(templateContent?: string): E {
    const template = document.createElement("template");
    if (typeof templateContent !== "undefined") {
        template.innerHTML = templateContent;
    }
    return template.content as E;
}

function bindShadowRoot(element: HTMLElement, templateContent?: string): ShadowRoot {
    const root = element.attachShadow({mode: "open"});
    const template = document.createElement("template");
    if (typeof templateContent !== "undefined") {
        template.innerHTML = templateContent;
    }
    root.appendChild(template.content.cloneNode(true));
    return root;
}

type HTMLElementDescription<K extends keyof HTMLElementTagNameMap> = {
    tagName: K,
    init?: HTMLElementInit<K>
};

type _IfEquals<X, Y, A = X, B = never> =
  (<T>() => T extends X ? 1 : 2) extends
  (<T>() => T extends Y ? 1 : 2) ? A : B;

type WritableKeys<T> = {
    [P in keyof T]-?: _IfEquals<{ [Q in P]: T[P] }, { -readonly [Q in P]: T[P] }, P>
}[keyof T];

interface HTMLElementInit<K extends keyof HTMLElementTagNameMap> {
    options?: ElementCreationOptions,
    properties?: Partial<Pick<HTMLElementTagNameMap[K], WritableKeys<HTMLElementTagNameMap[K]>>>,
    attributes?: {[name: string]: number | string | boolean},
    children?: (HTMLElementDescription<any> | Node | string)[],
    listeners?: {
        [K in keyof HTMLElementEventMap]?: [listener: (event: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions]
    }
}

interface HTMLElementReact<K extends keyof HTMLElementTagNameMap> {
    properties?: Partial<Pick<HTMLElementTagNameMap[K], WritableKeys<HTMLElementTagNameMap[K]>>>,
    attributes?: {[name: string]: number | string | boolean},
}

function HTMLElementConstructor<K extends keyof HTMLElementTagNameMap>(
    tagName: K, init?: HTMLElementInit<K>
    ): HTMLElementTagNameMap[K] {
    const element = document.createElement(tagName, init?.options);
    if (init) {
        if (init.properties) {
            setHTMLElementProperties(element, init.properties);
        }
        if (init.attributes) {
            setHTMLElementAttributes(element, init.attributes);
        }
        if (init.children) {
            setHTMLElementChildren(element, init.children);
        }
        if (init.listeners) {
            setHTMLElementEventListeners(element, init.listeners);
        }
    }
    return element;
};

function ReactiveHTMLElement<K extends keyof HTMLElementTagNameMap>(
    tagName: K,
    react?: HTMLElementReact<K>,
    init?: HTMLElementInit<K>,
): (
        element?: HTMLElementTagNameMap[K]
    ) => HTMLElementTagNameMap[K] {
        return (
            element?: HTMLElementTagNameMap[K]
        ) => {
            if (!element) {
                element = HTMLElementConstructor(tagName, init);
            }
            else {
                if (react) {
                    if (react.properties) {
                        setHTMLElementProperties(element, react.properties);
                    }
                    if (react.attributes) {
                        setHTMLElementAttributes(element, react.attributes);
                    }
                }
            }
            return element;
        }
};

function setHTMLElementEventListeners<K extends keyof HTMLElementTagNameMap>(
    element: HTMLElementTagNameMap[K],
    listeners: {
        [K in keyof HTMLElementEventMap]?: [listener: (event: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions]
    }
): HTMLElementTagNameMap[K] {
    Object.entries(listeners).forEach((entry) => {
        element.addEventListener(entry[0], entry[1][0] as EventListener, entry[1][1]);
    });
    return element;
};

function setHTMLElementChildren<K extends keyof HTMLElementTagNameMap>(
    element: HTMLElementTagNameMap[K],
    children: (HTMLElementDescription<any> | Node | string)[],
): HTMLElementTagNameMap[K] {
    element.innerHTML = "";
    children.forEach((child) => {
        if (typeof child === "string" || child instanceof Node) {
            element.append(child);
        }
        else {
            if (child.init) {
                element.append(
                    HTMLElementConstructor(
                        child.tagName, {
                            options: child.init.options,
                            attributes: child.init.attributes,
                            children: child.init.children
                        }
                    )
                );
            }
        }
    });
    return element;
};

function setHTMLElementProperties<K extends keyof HTMLElementTagNameMap>(
        element: HTMLElementTagNameMap[K],
        properties?: Partial<Pick<HTMLElementTagNameMap[K], WritableKeys<HTMLElementTagNameMap[K]>>>
    ): HTMLElementTagNameMap[K] {
    for (const property in properties) {
        let value = properties[property];
        if (typeof value !== "undefined") {
            element[property] = value!;
        }
    }
    return element;
};

function setHTMLElementAttributes<K extends keyof HTMLElementTagNameMap>(
        element: HTMLElementTagNameMap[K],
        attributes?: {[attrName: string]: number | string | boolean}
    ): HTMLElementTagNameMap[K] {
    for (const key in attributes) {
        const value = attributes[key];
        if (typeof value === "boolean") {
            if (value) {
                element.setAttribute(key, "");
            }
        }
        else {
            element.setAttribute(key, value.toString());
        }
    }
    return element;
};

interface AttributeMutationMixin {
    readonly attributeName: string;
    readonly attributeValue: string;
    readonly attributeType: AttributeType;
    attach(element: Element): void;
    detach(element: Element): void;
}
  
type AttributeType = "string" | "boolean" | "listitem";

function areAttributesMatching(refAttributeType: AttributeType, refAttrName: string, refAttrValue: string, attrName: string, attrValue: string | null): boolean {
    if (refAttrName == attrName) {
        switch (refAttributeType) {
            case "boolean":
                return refAttrValue == "" && attrValue == "";
            case "string":
                return refAttrValue !== "" && (refAttrValue === attrValue);
            case "listitem":
                return (refAttrValue !== "" && attrValue !== null) && new RegExp(`${refAttrValue}\s*?`, "g").test(attrValue);
        }
    }
    return false;
}

abstract class BaseAttributeMutationMixin implements AttributeMutationMixin {
    readonly attributeName: string;
    readonly attributeValue: string;
    readonly attributeType: AttributeType;

    constructor(attributeName: string, attributeType: AttributeType = "boolean", attributeValue: string = "") {
        this.attributeName = attributeName;
        this.attributeType = attributeType;
        this.attributeValue = attributeValue;
    }

    public abstract attach(element: Element): void;
    public abstract detach(element: Element): void;
}

function createMutationObserverCallback(
    mixins: AttributeMutationMixin[]
    ) {
    return (mutationsList: MutationRecord[]) =>  {
        mutationsList.forEach((mutation: MutationRecord) => {
            mutation.addedNodes.forEach((node: Node) => {
                if (node.nodeType === node.ELEMENT_NODE) {
                    let element = node as Element;
                    forAllHierarchyElements(element, (childElement: Element) => {
                        [...childElement.attributes].forEach((attr) => {
                            let matchingMixins = mixins.filter(
                                mixin => areAttributesMatching(
                                    mixin.attributeType, mixin.attributeName, mixin.attributeValue,
                                    attr.name, attr.value
                                )
                            );
                            matchingMixins.forEach((mixin) => {
                                mixin.attach(childElement);
                            });
                        });
                    });
                }
            });
            if (mutation.target.nodeType === Node.ELEMENT_NODE) {
                let targetElement = mutation.target as Element;
                let attrName = mutation.attributeName;
                if (attrName) {
                    let relatedMixins = mixins.filter(mixin => mixin.attributeName === attrName);
                    relatedMixins.forEach((mixin) => {
                        if (areAttributesMatching(
                                mixin.attributeType, mixin.attributeName, mixin.attributeValue,
                                attrName!, targetElement.getAttribute(attrName!)
                            )) {
                                mixin.attach(targetElement);
                        }
                        else {
                            mixin.detach(targetElement);
                        }
                    });
                }
            }
        });
    }
}