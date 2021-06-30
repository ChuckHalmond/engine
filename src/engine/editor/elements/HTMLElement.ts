export { RegisterCustomHTMLElement };
export { GenerateAttributeAccessors };
export { bindShadowRoot };
export { HTMLElementDescription };
export { HTMLElementTemplate };
export { setElementAttributes };
export { setElementProperties };

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

function HTMLElementTemplate<K extends keyof HTMLElementTagNameMap>(
    tagName: K,
    desc?: {
        options?: ElementCreationOptions,
        props?: Partial<Pick<HTMLElementTagNameMap[K], keyof HTMLElementTagNameMap[K]>>,
        attr?: {[attrName: string]: number | string | boolean | undefined},
        children?: (HTMLElementDescription | Node | string)[]
    }): HTMLElementTagNameMap[K];
function HTMLElementTemplate<T extends HTMLElement>(
    tagName: string,
    desc?: {
        options?: ElementCreationOptions,
        props?: Partial<Pick<T, keyof T>>,
        attr?: {[attrName: string]: number | string | boolean | undefined},
        children?: (HTMLElementDescription | Node | string)[]
    }): T;
function HTMLElementTemplate(
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
                            HTMLElementTemplate(
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