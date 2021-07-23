import { forAllHierarchyElements } from "./Snippets";

export { isElement };
export { isTagElement };
export { RegisterCustomHTMLElement };
export { GenerateAttributeAccessors };
export { createTemplate };
export { bindShadowRoot };
export { HTMLElementDescription };
export { HTMLElementConstructor };
export { setElementAttributes };
export { setElementProperties };
export { AttributeMutationMixin };
export { AttributeType };
export { areAttributesMatching };
export { BaseAttributeMutationMixin };
export { createMutationObserverCallback };
export { Property };
export { CustomHTMLElement };
export { HTMLEELement };

function isElement(obj: any): obj is Element {
    return obj instanceof Node && obj.nodeType === obj.ELEMENT_NODE;
}

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

function setElementProperties<E extends Element>(
    element: E,
    props: Partial<Pick<E, keyof E>>
): E {

    const elementProps = element as {[prop: string]: any};
    for (const prop in props) {
        if (typeof elementProps[prop] === typeof props[prop] || typeof elementProps[prop] === "undefined" || elementProps[prop] === null) {
            elementProps[prop] = props[prop];
        }
    }

    return element;
}

function setElementAttributes<E extends Element>(
    element: E,
    attr: {
        [name: string]: number | string | boolean | undefined;
    },
): E {

    const keys = Object.keys(attr);
    keys.forEach((key) => {
        const val = attr[key];
        if (val) {
            element.setAttribute(key, val.toString());
        }
    });

    return element;
}

type HTMLElementDescription<K extends string = any> = (K extends keyof HTMLElementTagNameMap ? {
    tagName: K,
    desc?: {
        options?: ElementCreationOptions,
        props?: Partial<Pick<HTMLElementTagNameMap[K], keyof HTMLElementTagNameMap[K]>>,
        attr?: {[attrName: string]: number | string | boolean | undefined},
        children?: (HTMLElementDescription<keyof HTMLElementTagNameMap> | Node | string)[]
    }
} : {
    tagName: string,
    desc?: {
        options?: ElementCreationOptions,
        props?: Partial<Pick<HTMLElement, keyof HTMLElement>>,
        attr?: {[attrName: string]: number | string | boolean | undefined},
        children?: (HTMLElementDescription<keyof HTMLElementTagNameMap> | Node | string)[]
    }
});

function HTMLElementConstructor<K extends keyof HTMLElementTagNameMap>(
    tagName: K,
    desc?: {
        options?: ElementCreationOptions,
        props?: Partial<Pick<HTMLElementTagNameMap[K], keyof HTMLElementTagNameMap[K]>>,
        attr?: {[attrName: string]: number | string | boolean | undefined},
        children?: (HTMLElementDescription | Node | string)[]
    }): HTMLElementTagNameMap[K];
function HTMLElementConstructor<T extends HTMLElement>(
    tagName: string,
    desc?: {
        options?: ElementCreationOptions,
        props?: Partial<Pick<T, keyof T>>,
        attr?: {[attrName: string]: number | string | boolean | undefined},
        children?: (HTMLElementDescription | Node | string)[]
    }): T;
function HTMLElementConstructor(
    tagName: string,
    desc?: {
        options?: ElementCreationOptions,
        props?: Partial<Pick<HTMLElement, keyof HTMLElement>>,
        attr?: {[attrName: string]: number | string | boolean | undefined},
        children?: (HTMLElementDescription | Node | string)[]
    }): HTMLElement {
    
    const element = document.createElement(tagName, desc?.options);
    if (desc) {
        if (desc.props) {
            setElementProperties(element, desc.props);
        }
        if (desc.attr) {
            setElementAttributes(element, desc.attr);
        }
        if (desc.children && Array.isArray(desc.children)) {
            desc.children.forEach((child) => {
                if (typeof child === "string" || child instanceof Node) {
                    element.append(child);
                }
                else {
                    if (child.desc) {
                        element.append(
                            HTMLElementConstructor(
                                child.tagName, {
                                    options: child.desc.options,
                                    attr: child.desc.attr,
                                    children: child.desc.children
                                }
                            )
                        );
                    }
                }
            })
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
                if (isElement(node)) {
                    let element = node;
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
            const target = mutation.target;
            if (isElement(target)) {
                let attrName = mutation.attributeName;
                if (attrName) {
                    let relatedMixins = mixins.filter(mixin => mixin.attributeName === attrName);
                    relatedMixins.forEach((mixin) => {
                        if (areAttributesMatching(
                                mixin.attributeType, mixin.attributeName, mixin.attributeValue,
                                attrName!, target.getAttribute(attrName!)
                            )) {
                                mixin.attach(target);
                        }
                        else {
                            mixin.detach(target);
                        }
                    });
                }
            }
        });
    }
}