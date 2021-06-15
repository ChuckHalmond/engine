import { HTMLEMenuElement } from "./lib/containers/menus/Menu";
import { HTMLEMenuBarElement } from "./lib/containers/menus/MenuBar";
import { HTMLEMenuItemElement } from "./lib/containers/menus/MenuItem";
import { HTMLEMenuItemGroupElement } from "./lib/containers/menus/MenuItemGroup";

export { RegisterCustomHTMLElement };
export { GenerateAttributeAccessors };
export { bindShadowRoot };

export { HTMLElementProperties };
export { HTMLElementAttributes };
export { HTMLElementDescription };
export { HTMLElementTemplate };
export { setHTMLElementAttributes }
export { setHTMLElementProperties };
export { CustomOrBultinHTMLElementTagNameMap };

interface RegisterCustomHTMLElementDecorator {
    (args: {
        name: string;
        observedAttributes?: string[],
        shadowRootContent?: string,
        options?: ElementDefinitionOptions
    }): <C extends CustomElementConstructor>(elementCtor: C) => C;
}

const RegisterCustomHTMLElement: RegisterCustomHTMLElementDecorator = function(args: {
    name: string;
    attributes?: string[],
    observedAttributes?: string[],
    shadowRootContent?: string,
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

type HTMLElementProperties<T extends HTMLElement> = Partial<Pick<T, keyof T>>;

function setHTMLElementProperties<E extends HTMLElement>(
    elem: E,
    props: Partial<Pick<E, keyof E>>
): E {

    const elemProps = elem as {[prop: string]: any};
    for (const prop in props) {
        if (typeof elemProps[prop] === typeof props[prop] || typeof elemProps[prop] === "undefined" || elemProps[prop] === null) {
            elemProps[prop] = props[prop];
        }
    }

    return elem;
}

function setHTMLElementAttributes<E extends HTMLElement>(
    elem: E,
    attr: {
        [name: string]: number | string | boolean | undefined;
    },
): E {

    const keys = Object.keys(attr);
    keys.forEach((key) => {
        const val = attr[key];
        if (val) {
            elem.setAttribute(key, val.toString());
        }
    });

    return elem;
}

interface HTMLElementAttributes {
    [name: string]: number | string | boolean | undefined;
}

type HTMLEElementTagNameMap = {
    "e-menuitem": HTMLEMenuItemElement,
    "e-menu": HTMLEMenuElement,
    "e-menuitemgroup": HTMLEMenuItemGroupElement,
    "e-menubar": HTMLEMenuBarElement
};

type CustomOrBultinHTMLElementTagNameMap = HTMLEElementTagNameMap & HTMLElementTagNameMap;

interface HTMLElementTemplate {
    <K extends keyof CustomOrBultinHTMLElementTagNameMap>(
    tagName: K,
    args?: {
        options?: ElementCreationOptions,
        props?: Partial<Pick<CustomOrBultinHTMLElementTagNameMap[K], keyof CustomOrBultinHTMLElementTagNameMap[K]>>;
        attr?: HTMLElementAttributes,
        children?: (HTMLElementDescription<keyof HTMLElementTagNameMap> | Node | string)[]
    }): CustomOrBultinHTMLElementTagNameMap[K];
}

type HTMLElementDescription<K> = K extends keyof HTMLElementTagNameMap ? {
    tagName: K
    options?: ElementCreationOptions,
    props?: Partial<Pick<CustomOrBultinHTMLElementTagNameMap[K], keyof CustomOrBultinHTMLElementTagNameMap[K]>>,
    attr?: HTMLElementAttributes,
    children?: (HTMLElementDescription<keyof HTMLElementTagNameMap> | Node | string)[]
} : never;

const HTMLElementTemplate: HTMLElementTemplate = function<K extends keyof CustomOrBultinHTMLElementTagNameMap>(
    tagName: K,
    args?: {
        options?: ElementCreationOptions,
        props?: Partial<Pick<CustomOrBultinHTMLElementTagNameMap[K], keyof CustomOrBultinHTMLElementTagNameMap[K]>>,
        attr?: HTMLElementAttributes,
        children?: (HTMLElementDescription<keyof HTMLElementTagNameMap> | Node | string)[]
    }): CustomOrBultinHTMLElementTagNameMap[K] {
    
    const elem = document.createElement(tagName, args?.options) as CustomOrBultinHTMLElementTagNameMap[K];
    if (args) {
        if (args.props) {
            setHTMLElementProperties(elem, args.props);
        }
        if (args.attr) {
            setHTMLElementAttributes(elem, args.attr);
        }
        if (args.children && Array.isArray(args.children)) {
            args.children.forEach((child) => {
                if (typeof child === "string" || child instanceof Node) {
                    elem.append(child);
                }
                else {
                    elem.append(
                        HTMLElementTemplate(
                            child.tagName, {
                                options: child.options,
                                props: child.props,
                                attr: child.attr,
                                children: child.children
                            }
                        )
                    );
                }
            })
        }
    }
    return elem;
}