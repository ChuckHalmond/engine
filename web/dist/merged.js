"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define("engine/editor/elements/Snippets", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.pointIntersectsWithDOMRect = exports.setPropertyFromPath = exports.getPropertyFromPath = exports.forAllHierarchyElements = void 0;
    function forAllHierarchyElements(element, func) {
        func(element);
        Array.from(element.children).forEach((child) => {
            forAllHierarchyElements(child, func);
        });
    }
    exports.forAllHierarchyElements = forAllHierarchyElements;
    /*
    function getPropertyFromPath(src: object, path: string): any {
      const props = path.split(".");
      let obj: {[key: string]: any} | undefined  = src;
      props.forEach((prop) => {
        if (typeof obj === "object" && prop in obj) {
          obj = obj[prop];
        }
        else {
          obj = void 0;
        }
      });
      return obj;
    }
    
    function setPropertyFromPath(src: object, path: string, value: any): object {
      const props = path.split(".");
      let obj: {[key: string]: any} = src;
      let lastPropIdx = props.length - 1;
      props.forEach((prop, idx) => {
        if (idx === lastPropIdx) {
          Object.assign(obj, {
            [prop]: value
          });
        }
        else {
          if (typeof obj[prop] !== "object") {
            Object.assign(obj, {
              [prop]: {}
            });
          }
          obj = obj[prop];
        }
      });
      return src;
    }
    */
    function getPropertyFromPath(src, path) {
        const props = path.split(".");
        let obj = src;
        props.forEach((prop) => {
            if (prop.includes("[")) {
                let index = parseInt(prop.substring(prop.indexOf("[") + 1, prop.indexOf("]")));
                if (Number.isNaN(index)) {
                    console.error(`Wrong indexed path: ${prop}`);
                }
                prop = prop.substring(0, prop.indexOf("["));
                if (typeof obj === "object" && prop in obj && Array.isArray(obj[prop])) {
                    obj = obj[prop][index];
                }
            }
            else if (typeof obj === "object" && prop in obj) {
                obj = obj[prop];
            }
            else {
                obj = void 0;
            }
        });
        return obj;
    }
    exports.getPropertyFromPath = getPropertyFromPath;
    function setPropertyFromPath(src, path, value) {
        const props = path.split(".");
        let obj = src;
        let lastPropIdx = props.length - 1;
        props.forEach((prop, idx) => {
            if (prop.includes("[")) {
                let index = parseInt(prop.substring(prop.indexOf("[") + 1, prop.indexOf("]")));
                if (Number.isNaN(index)) {
                    console.error(`Wrong indexed path: ${prop}`);
                }
                prop = prop.substring(0, prop.indexOf("["));
                if (!Array.isArray(obj[prop])) {
                    obj[prop] = [];
                }
                if (idx === lastPropIdx) {
                    obj[prop][index] = value;
                }
                else {
                    if (typeof obj[prop][index] !== "object") {
                        obj[prop][index] = {};
                    }
                    obj = obj[prop][index];
                }
            }
            else {
                if (typeof obj[prop] !== "object") {
                    obj[prop] = {};
                }
                if (idx === lastPropIdx) {
                    obj[prop] = value;
                }
                else {
                    obj = obj[prop];
                }
            }
        });
        return src;
    }
    exports.setPropertyFromPath = setPropertyFromPath;
    function pointIntersectsWithDOMRect(x, y, rect) {
        return !(rect.left > x ||
            rect.right < x ||
            rect.top > y ||
            rect.bottom < y);
    }
    exports.pointIntersectsWithDOMRect = pointIntersectsWithDOMRect;
});
define("engine/editor/elements/HTMLElement", ["require", "exports", "engine/editor/elements/Snippets"], function (require, exports, Snippets_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createMutationObserverCallback = exports.BaseAttributeMutationMixin = exports.areAttributesMatching = exports.setElementProperties = exports.setElementAttributes = exports.HTMLElementConstructor = exports.bindShadowRoot = exports.createTemplate = exports.GenerateAttributeAccessors = exports.RegisterCustomHTMLElement = exports.isTagElement = exports.isElement = void 0;
    function isElement(obj) {
        return obj instanceof Node && obj.nodeType === obj.ELEMENT_NODE;
    }
    exports.isElement = isElement;
    function isTagElement(tagName, obj) {
        return obj instanceof Node && obj.nodeType === obj.ELEMENT_NODE && obj.tagName.toLowerCase() == tagName;
    }
    exports.isTagElement = isTagElement;
    const RegisterCustomHTMLElement = function (args) {
        return (elementCtor) => {
            const { name, observedAttributes, options } = args;
            if (observedAttributes) {
                Object.defineProperty(elementCtor.prototype.constructor, 'observedAttributes', {
                    get: () => {
                        return observedAttributes;
                    }
                });
            }
            customElements.define(name, elementCtor, options);
            return elementCtor;
        };
    };
    exports.RegisterCustomHTMLElement = RegisterCustomHTMLElement;
    const GenerateAttributeAccessors = function (attributes) {
        return (elementCtor) => {
            attributes.forEach((attr) => {
                const { name, type } = attr;
                switch (type) {
                    case "boolean":
                        Object.defineProperty(elementCtor.prototype, name, {
                            get: function () {
                                const val = this.getAttribute(name);
                                return (val === "" || false);
                            },
                            set: function (value) {
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
                            get: function () {
                                const val = this.getAttribute(name);
                                return (val !== null) ? JSON.parse(val) : void 0;
                            },
                            set: function (value) {
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
                            get: function () {
                                const val = this.getAttribute(name);
                                return val;
                            },
                            set: function (value) {
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
        };
    };
    exports.GenerateAttributeAccessors = GenerateAttributeAccessors;
    function createTemplate(templateContent) {
        const template = document.createElement("template");
        if (typeof templateContent !== "undefined") {
            template.innerHTML = templateContent;
        }
        return template.content;
    }
    exports.createTemplate = createTemplate;
    function bindShadowRoot(element, templateContent) {
        const root = element.attachShadow({ mode: "open" });
        const template = document.createElement("template");
        if (typeof templateContent !== "undefined") {
            template.innerHTML = templateContent;
        }
        root.appendChild(template.content.cloneNode(true));
        return root;
    }
    exports.bindShadowRoot = bindShadowRoot;
    function setElementProperties(element, props) {
        const elementProps = element;
        for (const prop in props) {
            if (typeof elementProps[prop] === typeof props[prop] || typeof elementProps[prop] === "undefined" || elementProps[prop] === null) {
                elementProps[prop] = props[prop];
            }
        }
        return element;
    }
    exports.setElementProperties = setElementProperties;
    function setElementAttributes(element, attr) {
        const keys = Object.keys(attr);
        keys.forEach((key) => {
            const val = attr[key];
            if (val) {
                element.setAttribute(key, val.toString());
            }
        });
        return element;
    }
    exports.setElementAttributes = setElementAttributes;
    function HTMLElementConstructor(tagName, desc) {
        const element = document.createElement(tagName, desc === null || desc === void 0 ? void 0 : desc.options);
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
                            element.append(HTMLElementConstructor(child.tagName, {
                                options: child.desc.options,
                                attr: child.desc.attr,
                                children: child.desc.children
                            }));
                        }
                    }
                });
            }
        }
        return element;
    }
    exports.HTMLElementConstructor = HTMLElementConstructor;
    ;
    function areAttributesMatching(refAttributeType, refAttrName, refAttrValue, attrName, attrValue) {
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
    exports.areAttributesMatching = areAttributesMatching;
    class BaseAttributeMutationMixin {
        constructor(attributeName, attributeType = "boolean", attributeValue = "") {
            this.attributeName = attributeName;
            this.attributeType = attributeType;
            this.attributeValue = attributeValue;
        }
    }
    exports.BaseAttributeMutationMixin = BaseAttributeMutationMixin;
    function createMutationObserverCallback(mixins) {
        return (mutationsList) => {
            mutationsList.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (isElement(node)) {
                        let element = node;
                        Snippets_1.forAllHierarchyElements(element, (childElement) => {
                            [...childElement.attributes].forEach((attr) => {
                                let matchingMixins = mixins.filter(mixin => areAttributesMatching(mixin.attributeType, mixin.attributeName, mixin.attributeValue, attr.name, attr.value));
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
                            if (areAttributesMatching(mixin.attributeType, mixin.attributeName, mixin.attributeValue, attrName, target.getAttribute(attrName))) {
                                mixin.attach(target);
                            }
                            else {
                                mixin.detach(target);
                            }
                        });
                    }
                }
            });
        };
    }
    exports.createMutationObserverCallback = createMutationObserverCallback;
});
define("engine/editor/elements/lib/controls/draggable/Dragzone", ["require", "exports", "engine/editor/elements/HTMLElement", "engine/editor/elements/lib/controls/draggable/Draggable"], function (require, exports, HTMLElement_1, Draggable_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BaseHTMLEDragzoneElement = exports.isHTMLEDragzoneElement = void 0;
    function isHTMLEDragzoneElement(obj) {
        return obj instanceof Node && obj.nodeType === obj.ELEMENT_NODE && obj.tagName.toLowerCase() === "e-dragzone";
    }
    exports.isHTMLEDragzoneElement = isHTMLEDragzoneElement;
    let BaseHTMLEDragzoneElement = /** @class */ (() => {
        let BaseHTMLEDragzoneElement = class BaseHTMLEDragzoneElement extends HTMLElement {
            constructor() {
                super();
                HTMLElement_1.bindShadowRoot(this, /*template*/ `
            <style>
                :host {
                    display: block;
                }
            </style>
            <slot id="draggables">
                <span part="placeholder"/></span>
            </slot>
        `);
                this.draggables = [];
            }
            connectedCallback() {
                var _a;
                this.tabIndex = this.tabIndex;
                const slot = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector("slot");
                if (slot) {
                    slot.addEventListener("slotchange", () => {
                        const draggables = slot.assignedElements().filter(elem => Draggable_1.isHTMLEDraggableElement(elem));
                        this.draggables = draggables;
                    });
                }
                this.addEventListener("dragstart", () => {
                    let thisSelectedDraggables = this.draggables.filter(draggable => draggable.selected);
                    thisSelectedDraggables.forEach((thisSelectedDraggable) => {
                        thisSelectedDraggable.dragged = true;
                    });
                });
                this.addEventListener("dragend", () => {
                    let thisDraggedDraggables = this.draggables.filter(draggable => draggable.dragged);
                    thisDraggedDraggables.forEach((thisDraggedDraggable) => {
                        thisDraggedDraggable.dragged = false;
                    });
                });
                this.addEventListener("focusout", (event) => {
                    let relatedTarget = event.relatedTarget;
                    if (!this.contains(relatedTarget)) {
                        this.draggables.forEach((thisSelectedDraggable) => {
                            thisSelectedDraggable.selected = false;
                        });
                    }
                });
                this.addEventListener("mousedown", (event) => {
                    let target = event.target;
                    if (this.draggables.includes(target)) {
                        if (!event.shiftKey) {
                            if (!target.selected) {
                                this.draggables.forEach((thisDraggable) => {
                                    thisDraggable.selected = (thisDraggable == target);
                                });
                            }
                        }
                        else {
                            target.selected = true;
                        }
                    }
                });
                this.addEventListener("mouseup", (event) => {
                    let target = event.target;
                    if (this.draggables.includes(target)) {
                        if (!event.shiftKey) {
                            this.draggables.forEach((thisDraggable) => {
                                thisDraggable.selected = (thisDraggable == target);
                            });
                        }
                    }
                });
            }
        };
        BaseHTMLEDragzoneElement = __decorate([
            HTMLElement_1.RegisterCustomHTMLElement({
                name: "e-dragzone"
            }),
            HTMLElement_1.GenerateAttributeAccessors([
                { name: "dragovered", type: "boolean" },
                { name: "allowedtypes", type: "string" },
                { name: "multiple", type: "boolean" },
            ])
        ], BaseHTMLEDragzoneElement);
        return BaseHTMLEDragzoneElement;
    })();
    exports.BaseHTMLEDragzoneElement = BaseHTMLEDragzoneElement;
});
define("engine/editor/elements/lib/controls/draggable/Draggable", ["require", "exports", "engine/editor/elements/HTMLElement"], function (require, exports, HTMLElement_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BaseHTMLEDraggableElement = exports.isHTMLEDraggableElement = void 0;
    function isHTMLEDraggableElement(obj) {
        return obj instanceof Node && obj.nodeType === obj.ELEMENT_NODE && obj.tagName.toLowerCase() === "e-draggable";
    }
    exports.isHTMLEDraggableElement = isHTMLEDraggableElement;
    let BaseHTMLEDraggableElement = /** @class */ (() => {
        let BaseHTMLEDraggableElement = class BaseHTMLEDraggableElement extends HTMLElement {
            constructor() {
                super();
                HTMLElement_2.bindShadowRoot(this, /*template*/ `
            <style>
                :host {
                    position: relative;
                    display: block;
                    padding: 2px 4px;
                    border-radius: 4px;
                    border: 1px solid black;
                    margin-top: 6px;
                    cursor: pointer;
                }

                :host([disabled]) {
                    pointer-events: none;
                    color: gray;
                    border-color: gray;
                }

                :host(:focus),
                :host([selected]) {
                    font-weight: bold;
                    outline: none;
                }

                :host([dragovered]) {
                    margin-top: 20px;
                }

                :host([dragovered])::before {
                    content: "";
                    pointer-events: none;
                    display: block;
                    position: absolute;
                    left: 0;
                    top: -11px;
                    width: 100%;
                    border: 1px solid black;
                }

                slot {
                    pointer-events: none;
                    user-select: none;
                }
            </style>
            <slot></slot>
        `);
                this.dragzone = null;
                this.dropzone = null;
            }
            connectedCallback() {
                this.tabIndex = this.tabIndex;
                this.draggable = true;
            }
        };
        BaseHTMLEDraggableElement = __decorate([
            HTMLElement_2.RegisterCustomHTMLElement({
                name: "e-draggable"
            }),
            HTMLElement_2.GenerateAttributeAccessors([
                { name: "selected", type: "boolean" },
                { name: "dragged", type: "boolean" },
                { name: "dragovered", type: "boolean" },
                { name: "disabled", type: "boolean" },
                { name: "ref", type: "string" },
                { name: "type", type: "string" },
                { name: "value", type: "string" },
            ])
        ], BaseHTMLEDraggableElement);
        return BaseHTMLEDraggableElement;
    })();
    exports.BaseHTMLEDraggableElement = BaseHTMLEDraggableElement;
});
define("engine/editor/elements/lib/controls/draggable/Dropzone", ["require", "exports", "engine/editor/elements/HTMLElement", "engine/editor/elements/lib/controls/draggable/Draggable", "engine/editor/elements/lib/controls/draggable/Dragzone"], function (require, exports, HTMLElement_3, Draggable_2, Dragzone_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BaseHTMLEDropzoneElement = exports.isHTMLEDropzoneElement = void 0;
    function isHTMLEDropzoneElement(obj) {
        return obj instanceof Node && obj.nodeType === obj.ELEMENT_NODE && obj.tagName.toLowerCase() === "e-dropzone";
    }
    exports.isHTMLEDropzoneElement = isHTMLEDropzoneElement;
    let BaseHTMLEDropzoneElement = /** @class */ (() => {
        let BaseHTMLEDropzoneElement = class BaseHTMLEDropzoneElement extends Dragzone_1.BaseHTMLEDragzoneElement {
            constructor() {
                var _a, _b;
                super();
                (_a = this.shadowRoot.querySelector("style")) === null || _a === void 0 ? void 0 : _a.insertAdjacentHTML("beforeend", 
                /*css*/ `
                ::slotted([slot="input"]) {
                    display: none;
                }

                :host {
                    position: relative;
                    display: inline-block;
                    border-radius: 4px;
                    min-width: 32px;
                    min-height: 32px;
                    padding: 4px;
                    margin-top: 8px;
                    border: 1px dashed black;
                    outline: 1px solid transparent;
                }

                :host [part~="appendarea"] {
                    position: relative;
                    height: 10px;
                    margin-top: 8px;
                }

                :host([dragovered]) [part~="appendarea"] {
                    margin-top: 20px;
                }

                :host([dragovered]) [part~="appendarea"]::before {
                    content: "";
                    pointer-events: none;
                    display: block;
                    position: absolute;
                    left: 0;
                    top: -11px;
                    width: 100%;
                    border: 1px solid black;
                }
            `);
                (_b = this.shadowRoot.querySelector("slot#draggables")) === null || _b === void 0 ? void 0 : _b.insertAdjacentHTML("afterend", 
                /*template*/ `
                <slot name="input"></slot>
                <div part="appendarea"></div>
            `);
            }
            connectedCallback() {
                super.connectedCallback();
                const inputSlot = this.shadowRoot.querySelector("slot[name='input']");
                if (inputSlot) {
                    inputSlot.addEventListener("slotchange", () => {
                        const input = inputSlot.assignedElements()[0];
                        if (HTMLElement_3.isTagElement("input", input)) {
                            this.addEventListener("datatransfer", (() => {
                                let thisDraggables = Array.from(this.querySelectorAll("e-draggable"));
                                input.value = `[${thisDraggables.map(draggable => (draggable.value)).filter(draggable => draggable !== null).join(", ")}]`;
                            }));
                            this.addEventListener("dataclear", (() => {
                                let thisDraggables = Array.from(this.querySelectorAll("e-draggable"));
                                input.value = `[${thisDraggables.map(draggable => draggable.value).filter(draggable => draggable !== null).join(", ")}]`;
                            }));
                        }
                    });
                }
                this.addEventListener("keydown", (event) => {
                    switch (event.key) {
                        case "Delete":
                            let selectedDraggables = Array.from(document.querySelectorAll("e-draggable[selected]"));
                            this.removeDraggables(selectedDraggables);
                            event.stopPropagation();
                            break;
                    }
                });
                this.addEventListener("dragover", (event) => {
                    event.preventDefault();
                }, { capture: true });
                this.shadowRoot.addEventListener("dragover", (event) => {
                    event.preventDefault();
                }, { capture: true });
                this.addEventListener("dragenter", (event) => {
                    let target = event.target;
                    if (Draggable_2.isHTMLEDraggableElement(target)) {
                        let dragoveredDraggable = this.querySelector("e-draggable[dragovered]");
                        if (dragoveredDraggable) {
                            dragoveredDraggable.dragovered = false;
                        }
                        target.dragovered = true;
                    }
                    else {
                        this.dragovered = true;
                    }
                    event.preventDefault();
                }, { capture: true });
                this.shadowRoot.addEventListener("dragenter", (event) => {
                    let target = event.target;
                    if (!Draggable_2.isHTMLEDraggableElement(target)) {
                        let dragoveredDraggable = this.querySelector("e-draggable[dragovered]");
                        if (dragoveredDraggable) {
                            dragoveredDraggable.dragovered = false;
                        }
                        this.dragovered = true;
                    }
                    event.preventDefault();
                }, { capture: true });
                this.shadowRoot.addEventListener("dragleave", (event) => {
                    event.preventDefault();
                }, { capture: true });
                this.addEventListener("dragleave", (event) => {
                    let relatedTarget = event.relatedTarget;
                    if (!(this.contains(relatedTarget) || this.shadowRoot.contains(relatedTarget))) {
                        let dragoveredDraggable = this.querySelector("e-draggable[dragovered]");
                        if (dragoveredDraggable) {
                            dragoveredDraggable.dragovered = false;
                        }
                    }
                    this.dragovered = false;
                    event.preventDefault();
                }, { capture: true });
                this.addEventListener("drop", () => {
                    let thisDraggables = Array.from(this.children).filter(Draggable_2.isHTMLEDraggableElement);
                    let dragoveredDraggable = this.querySelector("e-draggable[dragovered]");
                    let dragoveredDraggableIndex = thisDraggables.length;
                    if (dragoveredDraggable) {
                        dragoveredDraggable.dragovered = false;
                        dragoveredDraggableIndex = Array.from(thisDraggables).indexOf(dragoveredDraggable);
                    }
                    let selectedDraggables = Array.from(document.querySelectorAll("e-draggable[selected]"));
                    selectedDraggables.forEach((selectedDraggable) => {
                        selectedDraggable.dragged = false;
                        selectedDraggable.selected = false;
                    });
                    this.addDraggables(selectedDraggables, dragoveredDraggableIndex);
                    this.dragovered = false;
                });
            }
            addDraggables(draggables, position) {
                if (draggables.length > 0) {
                    let lastDraggable = draggables[draggables.length - 1];
                    let draggablesTypes = new Set();
                    draggables.forEach((draggable) => {
                        draggablesTypes.add(draggable.type);
                    });
                    let thisAllowedtypes = new Set((this.allowedtypes || "").split(" "));
                    let dataTransferSuccess = thisAllowedtypes.has("*") ||
                        Array.from(draggablesTypes.values()).every(type => thisAllowedtypes.has(type));
                    let insertionIndex = -1;
                    if (dataTransferSuccess) {
                        let thisDraggables = Array.from(this.children).filter(Draggable_2.isHTMLEDraggableElement);
                        let thisLastDraggable = thisDraggables[thisDraggables.length - 1];
                        if (this.multiple) {
                            draggables.forEach((draggable) => {
                                let draggableRef = (this.querySelector(`[ref="${draggable.ref}"]`) || draggable.cloneNode(true));
                                if (position > -1 && position < thisDraggables.length) {
                                    let pivotDraggable = thisDraggables[position];
                                    pivotDraggable.insertAdjacentElement("beforebegin", draggableRef);
                                    insertionIndex = (insertionIndex < 0) ? position : insertionIndex;
                                }
                                else {
                                    this.appendChild(draggableRef);
                                    insertionIndex = (insertionIndex < 0) ? thisDraggables.length - 1 : insertionIndex;
                                }
                            });
                        }
                        else {
                            if (position > -1 && position < thisDraggables.length) {
                                let pivotDraggable = thisDraggables[position];
                                pivotDraggable.insertAdjacentElement("beforebegin", lastDraggable);
                                insertionIndex = position;
                            }
                            else {
                                let ref = (this.querySelector(`[ref="${lastDraggable.ref}"]`) || lastDraggable.cloneNode(true));
                                if (thisLastDraggable) {
                                    this.replaceChild(ref, thisLastDraggable);
                                }
                                else {
                                    this.appendChild(ref);
                                }
                                insertionIndex = 0;
                            }
                        }
                        let dataTransferEvent = new CustomEvent("datatransfer", {
                            bubbles: true,
                            detail: {
                                draggables: draggables,
                                position: insertionIndex,
                                success: dataTransferSuccess,
                            }
                        });
                        this.dispatchEvent(dataTransferEvent);
                    }
                }
            }
            removeDraggables(draggables) {
                let thisDraggables = Array.from(this.children).filter(Draggable_2.isHTMLEDraggableElement);
                thisDraggables.forEach((draggable) => {
                    if (draggables.includes(draggable)) {
                        draggable.remove();
                    }
                });
                this.dispatchEvent(new CustomEvent("dataclear", { bubbles: true }));
            }
        };
        BaseHTMLEDropzoneElement = __decorate([
            HTMLElement_3.RegisterCustomHTMLElement({
                name: "e-dropzone"
            }),
            HTMLElement_3.GenerateAttributeAccessors([
                { name: "dragovered", type: "boolean" },
                { name: "allowedtypes", type: "string" },
                { name: "multiple", type: "boolean" },
            ])
        ], BaseHTMLEDropzoneElement);
        return BaseHTMLEDropzoneElement;
    })();
    exports.BaseHTMLEDropzoneElement = BaseHTMLEDropzoneElement;
});
define("engine/editor/elements/lib/containers/duplicable/Duplicable", ["require", "exports", "engine/editor/elements/HTMLElement"], function (require, exports, HTMLElement_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isHTMLEDuplicableElement = exports.HTMLEDuplicableElementBase = void 0;
    function isHTMLEDuplicableElement(elem) {
        return elem instanceof Node && elem.nodeType === elem.ELEMENT_NODE && elem.tagName.toLowerCase() === "e-duplicable";
    }
    exports.isHTMLEDuplicableElement = isHTMLEDuplicableElement;
    let HTMLEDuplicableElementBase = /** @class */ (() => {
        let HTMLEDuplicableElementBase = class HTMLEDuplicableElementBase extends HTMLElement {
            constructor() {
                super();
                HTMLElement_4.bindShadowRoot(this, /*template*/ `
            <style>
                :host {
                    display: block;
                }

                ::slotted([slot="prototype"]) {
                    display: none;
                }
            </style>
            <slot name="input"></slot>
            <slot name="prototype"></slot>
            <slot name="items"></slot>
        `);
                this.prototype = null;
                this.input = null;
            }
            connectedCallback() {
                var _a, _b;
                this.tabIndex = this.tabIndex;
                const prototypeSlot = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector("slot[name=prototype]");
                if (prototypeSlot) {
                    prototypeSlot.addEventListener("slotchange", () => {
                        const prototype = prototypeSlot.assignedElements()[0];
                        this.prototype = prototype;
                        if (this.input) {
                            this.duplicate(parseInt(this.input.value));
                        }
                    });
                }
                const inputSlot = (_b = this.shadowRoot) === null || _b === void 0 ? void 0 : _b.querySelector("slot[name=input]");
                if (inputSlot) {
                    inputSlot.addEventListener("slotchange", () => {
                        const input = inputSlot.assignedElements()[0];
                        if (HTMLElement_4.isTagElement("input", input)) {
                            input.addEventListener("change", () => {
                                this.duplicate(parseInt(input.value));
                            });
                            this.duplicate(parseInt(input.value));
                            this.input = input;
                        }
                    });
                }
            }
            duplicate(count) {
                if (this.prototype) {
                    let items = this.querySelectorAll("[slot='items']");
                    let itemsCount = items.length;
                    while (itemsCount < count) {
                        let clone = this.prototype.cloneNode(true);
                        clone.slot = "items";
                        this.appendChild(clone);
                        itemsCount++;
                        let index = clone.querySelector("[data-duplicate-index]");
                        if (index) {
                            index.textContent = itemsCount.toString();
                        }
                    }
                    if (count >= 0) {
                        while (itemsCount > count) {
                            items[itemsCount - 1].remove();
                            itemsCount--;
                        }
                    }
                }
            }
        };
        HTMLEDuplicableElementBase = __decorate([
            HTMLElement_4.RegisterCustomHTMLElement({
                name: "e-duplicable"
            })
        ], HTMLEDuplicableElementBase);
        return HTMLEDuplicableElementBase;
    })();
    exports.HTMLEDuplicableElementBase = HTMLEDuplicableElementBase;
});
define("engine/libs/maths/MathError", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MathError = void 0;
    class MathError extends Error {
        constructor() {
            super(...arguments);
            this.name = 'MathError';
        }
    }
    exports.MathError = MathError;
});
define("engine/libs/patterns/injectors/Injector", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Register = exports.Inject = exports.InjectorBase = exports.Injector = void 0;
    class InjectorBase {
        constructor(args) {
            this._defaultCtor = args.defaultCtor;
            this._onDefaultOverride = args.onDefaultOverride;
            this._constructors = new Map();
        }
        get defaultCtor() {
            return this._defaultCtor;
        }
        overrideDefaultCtor(constructor) {
            this._defaultCtor = constructor;
            this._onDefaultOverride(constructor);
        }
        forceQualifier(qualifier) {
            this._forcedQualifier = qualifier;
        }
        unforceQualifier() {
            delete this._forcedQualifier;
        }
        getConstructor(qualifier) {
            const qualifierValue = this._forcedQualifier || qualifier;
            if (typeof qualifierValue === 'undefined') {
                return this._defaultCtor;
            }
            const constructor = this._constructors.get(qualifierValue);
            if (typeof constructor === 'undefined') {
                throw new Error(`No constructor for qualifier ${qualifierValue}`);
            }
            return constructor;
        }
        inject(args) {
            const constructor = this.getConstructor(args === null || args === void 0 ? void 0 : args.qualifier);
            if (args === null || args === void 0 ? void 0 : args.args) {
                const parameters = Array.from(args === null || args === void 0 ? void 0 : args.args);
                return new constructor(...parameters);
            }
            return new constructor();
        }
        register(constructor, qualifier) {
            if (!this._constructors.has(qualifier)) {
                this._constructors.set(qualifier, constructor);
            }
        }
    }
    exports.InjectorBase = InjectorBase;
    const Injector = InjectorBase;
    exports.Injector = Injector;
    const Register = function (injector, qualifier) {
        return (ctor) => {
            if (typeof qualifier !== 'undefined') {
                injector.register(ctor, qualifier);
            }
            injector.register(ctor, ctor.name);
            return ctor;
        };
    };
    exports.Register = Register;
    function Inject(injector, options) {
        return (target, propertyKey) => {
            const instance = injector.inject(options);
            Object.defineProperty(target, propertyKey, {
                value: instance
            });
        };
    }
    exports.Inject = Inject;
});
define("engine/libs/maths/algebra/vectors/Vector2", ["require", "exports", "engine/libs/maths/MathError", "engine/libs/patterns/injectors/Injector"], function (require, exports, MathError_1, Injector_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Vector2Base = exports.Vector2 = exports.Vector2Injector = void 0;
    class Vector2Base {
        constructor(values) {
            this._array = (values) ? [
                values[0], values[1]
            ] : [0, 0];
        }
        get array() {
            return this._array;
        }
        get values() {
            return [
                this._array[0],
                this._array[1]
            ];
        }
        set values(values) {
            this._array[0] = values[0];
            this._array[1] = values[1];
        }
        get x() {
            return this._array[0];
        }
        set x(x) {
            this._array[0] = x;
        }
        get y() {
            return this._array[1];
        }
        set y(y) {
            this._array[1] = y;
        }
        setArray(array) {
            if (array.length < 2) {
                throw new MathError_1.MathError(`Array must be of length 2 at least.`);
            }
            this._array = array;
            return this;
        }
        setValues(v) {
            const o = this._array;
            o[0] = v[0];
            o[1] = v[1];
            return this;
        }
        equals(vec) {
            const v = vec._array;
            const o = this._array;
            return v[0] === o[0]
                && v[1] === o[1];
        }
        copy(vec) {
            const o = this._array;
            const v = vec._array;
            o[0] = v[0];
            o[1] = v[1];
            return this;
        }
        clone() {
            return new Vector2Base(this.values);
        }
        setZeros() {
            const o = this._array;
            o[0] = 0;
            o[1] = 0;
            return this;
        }
        add(vec) {
            const v = vec._array;
            const o = this._array;
            o[0] = o[0] + v[0];
            o[1] = o[1] + v[1];
            return this;
        }
        addScalar(k) {
            const o = this._array;
            o[0] = o[0] + k;
            o[1] = o[1] + k;
            return this;
        }
        sub(vec) {
            const v = vec._array;
            const o = this._array;
            o[0] = o[0] - v[0];
            o[1] = o[1] - v[1];
            return this;
        }
        lerp(vec, t) {
            const v = vec._array;
            const o = this._array;
            o[0] = t * (v[0] - o[0]);
            o[1] = t * (v[1] - o[1]);
            return this;
        }
        clamp(min, max) {
            const o = this._array;
            const l = min._array;
            const g = max._array;
            o[0] = Math.min(g[0], Math.min(o[0], l[0])),
                o[1] = Math.min(g[1], Math.min(o[1], l[1]));
            return this;
        }
        multScalar(k) {
            const o = this._array;
            o[0] = o[0] * k;
            o[1] = o[1] * k;
            return this;
        }
        cross(vec) {
            const a = this._array;
            const b = vec._array;
            return a[0] * b[1] - a[1] * b[0];
        }
        dot(vec) {
            const a = this._array;
            const b = vec._array;
            return (a[0] * b[0]) + (a[1] * b[1]);
        }
        len() {
            const v = this._array;
            return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
        }
        lenSq() {
            const v = this._array;
            return v[0] * v[0] + v[1] * v[1];
        }
        dist(vec) {
            const a = this._array;
            const b = vec._array;
            const dx = a[0] - b[0];
            const dy = a[1] - b[1];
            return Math.sqrt(dx * dx + dy * dy);
        }
        distSq(vec) {
            const a = this._array;
            const b = vec._array;
            const dx = a[0] - b[0];
            const dy = a[1] - b[1];
            return dx * dx + dy * dy;
        }
        normalize() {
            const o = this._array;
            const lenSq = o[0] * o[0] + o[1] * o[1];
            const len = Math.sqrt(lenSq);
            if (len > Number.EPSILON) {
                o[0] = o[0] / len;
                o[1] = o[1] / len;
            }
            else {
                o[0] = 0;
                o[1] = 0;
            }
            return this;
        }
        negate() {
            const o = this._array;
            o[0] = -o[0];
            o[1] = -o[1];
            return this;
        }
        mult(vec) {
            const v = vec._array;
            const o = this._array;
            o[0] = o[0] * v[0];
            o[1] = o[1] * v[1];
            return this;
        }
        addScaled(vec, k) {
            const v = vec._array;
            const o = this._array;
            o[0] = o[0] + v[0] * k;
            o[1] = o[1] + v[1] * k;
            return this;
        }
        writeIntoArray(out, offset = 0) {
            const v = this._array;
            out[offset] = v[0];
            out[offset + 1] = v[1];
        }
        readFromArray(arr, offset = 0) {
            const o = this._array;
            o[0] = arr[offset];
            o[1] = arr[offset + 1];
            return this;
        }
        copyAndSub(vecA, vecB) {
            const o = this._array;
            const a = vecA._array;
            const b = vecB._array;
            o[0] = a[0] - b[0];
            o[1] = a[1] - b[1];
            return this;
        }
    }
    exports.Vector2Base = Vector2Base;
    var Vector2 = Vector2Base;
    exports.Vector2 = Vector2;
    const Vector2Injector = new Injector_1.Injector({
        defaultCtor: Vector2Base,
        onDefaultOverride: (ctor) => {
            exports.Vector2 = Vector2 = ctor;
        }
    });
    exports.Vector2Injector = Vector2Injector;
});
define("engine/core/input/Input", ["require", "exports", "engine/libs/maths/algebra/vectors/Vector2"], function (require, exports, Vector2_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Input = exports.MouseButton = exports.HotKey = exports.KeyModifier = exports.Key = void 0;
    var Key;
    (function (Key) {
        Key["A"] = "a";
        Key["Z"] = "z";
        Key["Q"] = "q";
        Key["S"] = "s";
        Key["D"] = "d";
        Key["V"] = "v";
        Key["ENTER"] = "Enter";
        Key["BACKSPACE"] = "Backspace";
        Key["ARROW_DOWN"] = "ArrowDown";
        Key["ARROW_LEFT"] = "ArrowLeft";
        Key["ARROW_RIGHT"] = "ArrowRight";
        Key["ARROW_UP"] = "ArrowUp";
        Key["SHIFT"] = "Shift";
    })(Key || (Key = {}));
    exports.Key = Key;
    var KeyModifier;
    (function (KeyModifier) {
        KeyModifier["Alt"] = "Alt";
        KeyModifier["Control"] = "Control";
        KeyModifier["Shift"] = "Shift";
    })(KeyModifier || (KeyModifier = {}));
    exports.KeyModifier = KeyModifier;
    var MouseButton;
    (function (MouseButton) {
        MouseButton[MouseButton["LEFT"] = 1] = "LEFT";
        MouseButton[MouseButton["WHEEL"] = 2] = "WHEEL";
        MouseButton[MouseButton["RIGHT"] = 3] = "RIGHT";
        MouseButton[MouseButton["FORWARD"] = 4] = "FORWARD";
        MouseButton[MouseButton["BACK"] = 5] = "BACK";
    })(MouseButton || (MouseButton = {}));
    exports.MouseButton = MouseButton;
    const BUTTONS_MAP = [
        MouseButton.LEFT, MouseButton.WHEEL, MouseButton.RIGHT, MouseButton.BACK, MouseButton.FORWARD
    ];
    const KEYS_INDICES = Object.values(Key).reduce((map, key, index) => {
        map[key] = index;
        return map;
    }, {});
    const INPUT_EVENT = {
        "DOWN": 0,
        "REPEAT": 1,
        "UP": 2
    };
    const testKeyModifier = (mod, event) => {
        switch (mod) {
            case 'Alt':
                return event.altKey;
            case 'Control':
                return event.ctrlKey;
            case 'Shift':
                return event.shiftKey;
            default:
                return () => true;
        }
    };
    class HotKey {
        constructor(key, mod1, mod2) {
            this.key = key;
            this.mod1 = mod1;
            this.mod2 = mod2;
        }
        toString() {
            return `${this.mod1 ? `${this.mod1} + ` : ''}${this.mod2 ? `${this.mod2} + ` : ''}${(this.key.length === 1) ? this.key.toUpperCase() : this.key}`;
        }
        /*public static fromString(str: string): HotKey | null {
            const keys = Object.values(Key);
            const keyModifiers = Object.values(KeyModifier);
    
            let key: Key;
            let mod1: KeyModifier | undefined;
            let mod2: KeyModifier | undefined;
    
            const keysStr = str.split(' + ');
            if (keysStr.length >= 1) {
                key = keysStr[0] as Key;
                if (!keys.indexOf(key)) {
                    return null;
                }
                if (keysStr.length >= 2) {
                    mod1 = keysStr[1] as KeyModifier;
                    if (!keyModifiers.indexOf(mod1)) {
                        return null;
                    }
                }
                if (keysStr.length >= 3) {
                    mod2 = keysStr[2] as KeyModifier;
                    if (!keyModifiers.indexOf(mod2)) {
                        return null;
                    }
                }
                return new HotKey(key, mod1, mod2);
            }
            return null;
        }*/
        test(event) {
            return ((!this.mod1 || testKeyModifier(this.mod1, event)) && (!this.mod2 || testKeyModifier(this.mod2, event)) && event.key === this.key);
        }
    }
    exports.HotKey = HotKey;
    let Input = /** @class */ (() => {
        class Input {
            static clear() {
                this.keyFlags.fill(false);
                // Keeps the INPUT_EVENT.REPEAT section values
                this.mouseFlags.fill(false, INPUT_EVENT.DOWN * this.mouseButtonsCount, INPUT_EVENT.REPEAT * this.mouseButtonsCount);
                this.mouseFlags.fill(false, INPUT_EVENT.UP * this.mouseButtonsCount);
                this.wheelDelta = 0;
            }
            static initializePointerHandlers(element) {
                element.addEventListener('pointerdown', (event) => {
                    this.mouseFlags[INPUT_EVENT.DOWN * this.mouseButtonsCount + BUTTONS_MAP[event.button]] = true;
                    this.mouseFlags[INPUT_EVENT.REPEAT * this.mouseButtonsCount + BUTTONS_MAP[event.button]] = true;
                    /*if (document.activeElement === element) {
                        event.preventDefault();
                    }*/
                });
                element.addEventListener('pointerup', (event) => {
                    this.mouseFlags[INPUT_EVENT.REPEAT * this.mouseButtonsCount + BUTTONS_MAP[event.button]] = false;
                    this.mouseFlags[INPUT_EVENT.UP * this.mouseButtonsCount + BUTTONS_MAP[event.button]] = true;
                });
                element.addEventListener('contextmenu', (event) => {
                    event.preventDefault();
                });
                element.addEventListener('pointermove', (event) => {
                    this.mousePos.setValues([(event.offsetX / element.clientWidth) - 0.5, (event.offsetY / element.clientHeight) - 0.5]);
                });
                element.addEventListener('wheel', (event) => {
                    this.wheelDelta = Math.min(event.deltaY, 1000) / 1000;
                }, { passive: true });
            }
            static initializeKeyboardHandlers(element) {
                element.addEventListener('keydown', (event) => {
                    this.keyFlags[(!event.repeat ? INPUT_EVENT.DOWN : INPUT_EVENT.REPEAT) * this.keysCount + KEYS_INDICES[event.key]] = true;
                });
                element.addEventListener('keyup', (event) => {
                    this.keyFlags[INPUT_EVENT.UP * this.keysCount + KEYS_INDICES[event.key]] = true;
                    this.keyFlags[INPUT_EVENT.DOWN * this.keysCount + KEYS_INDICES[event.key]] = false;
                    this.keyFlags[INPUT_EVENT.REPEAT * this.keysCount + KEYS_INDICES[event.key]] = false;
                });
            }
            static initialize(elem) {
                this.initializePointerHandlers(elem);
                this.initializeKeyboardHandlers(elem);
            }
            /*public static getAxis(axisName: string) {
        
            }
        
            public static getButton(buttonName: string) {
        
            }
        
            public static getButtonUp(buttonName: string) {
        
            }
        
            public static getButtonDown(buttonName: string) {
        
            }*/
            static getKey(key) {
                return this.keyFlags[INPUT_EVENT.REPEAT * this.keysCount + KEYS_INDICES[key]];
            }
            static getKeyUp(key) {
                return this.keyFlags[INPUT_EVENT.UP * this.keysCount + KEYS_INDICES[key]];
            }
            static getKeyDown(key) {
                return this.keyFlags[INPUT_EVENT.DOWN * this.keysCount + KEYS_INDICES[key]];
            }
            static getMouseButton(button) {
                return this.mouseFlags[INPUT_EVENT.REPEAT * this.mouseButtonsCount + button];
            }
            static getMouseButtonPosition() {
                return this.mousePos;
            }
            static getWheelDelta() {
                return this.wheelDelta;
            }
            static getMouseButtonDown(button) {
                return this.mouseFlags[INPUT_EVENT.DOWN * this.mouseButtonsCount + button];
            }
            static getMouseButtonUp(button) {
                return this.mouseFlags[INPUT_EVENT.UP * this.mouseButtonsCount + button];
            }
        }
        Input.keysCount = Object.keys(Key).length;
        Input.mouseButtonsCount = Object.keys(MouseButton).length;
        Input.keyFlags = new Array(Object.keys(INPUT_EVENT).length * Input.keysCount);
        Input.mouseFlags = new Array(Object.keys(INPUT_EVENT).length * Input.mouseButtonsCount);
        Input.mousePos = new Vector2_1.Vector2();
        Input.wheelDelta = 0;
        return Input;
    })();
    exports.Input = Input;
});
define("engine/libs/patterns/commands/Command", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isUndoCommand = exports.isCommand = void 0;
    function isCommand(obj) {
        return (typeof obj.exec === 'function');
    }
    exports.isCommand = isCommand;
    function isUndoCommand(obj) {
        return (typeof obj.exec === 'function')
            && (typeof obj.undo === 'function');
    }
    exports.isUndoCommand = isUndoCommand;
});
define("engine/libs/patterns/messaging/events/EventDispatcher", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.EventDispatcherBase = exports.EventDispatcher = void 0;
    class EventDispatcherBase {
        constructor() {
            this._listeners = new Map();
        }
        addEventListener(event, callback, once) {
            let listeners = this._listeners.get(event);
            let listener = {
                callback: callback,
                once: once
            };
            if (typeof listeners === 'undefined') {
                this._listeners.set(event, [listener]);
            }
            else {
                listeners.push(listener);
            }
            return callback;
        }
        removeEventListener(event, callback, once) {
            let listeners = this._listeners.get(event);
            let listener = {
                callback: callback,
                once: once
            };
            if (typeof listeners === 'undefined') {
                return -1;
            }
            const count = listeners.length;
            const idx = listeners.indexOf(listener);
            if (idx > -1) {
                if (count > 1) {
                    listeners[idx] = listeners.pop();
                    return count - 1;
                }
                else {
                    this._listeners.delete(event);
                    return 0;
                }
            }
            return count;
        }
        dispatchEvent(name, event) {
            let listeners = this._listeners.get(name);
            if (typeof listeners !== 'undefined') {
                listeners = listeners.filter((listener) => {
                    listener.callback(event);
                    return !listener.once;
                });
                if (listeners.length === 0) {
                    this._listeners.delete(name);
                }
            }
        }
    }
    exports.EventDispatcherBase = EventDispatcherBase;
    const EventDispatcher = EventDispatcherBase;
    exports.EventDispatcher = EventDispatcher;
});
define("engine/resources/ResourceError", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RessourceError = void 0;
    class RessourceError extends Error {
        constructor() {
            super(...arguments);
            this.name = 'RessourceError';
        }
    }
    exports.RessourceError = RessourceError;
});
define("engine/resources/ResourceFetcher", ["require", "exports", "engine/resources/ResourceError"], function (require, exports, ResourceError_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ResourceFetcher = void 0;
    const ResourceFetcher = Object.freeze({
        async fetchArrayBuffer(url) {
            return fetch(url).then((resp) => {
                if (resp.ok) {
                    return resp.arrayBuffer();
                }
                else {
                    throw new ResourceError_1.RessourceError(`Array buffer '${url}' not found.`);
                }
            });
        },
        async fetchTextFile(url) {
            return fetch(url).then((resp) => {
                if (resp.ok) {
                    return resp.text();
                }
                else {
                    throw new ResourceError_1.RessourceError(`Text file '${url}' not found.`);
                }
            });
        },
        async fetchJSON(url) {
            return fetch(url).then((resp) => {
                if (resp.ok) {
                    return resp.json();
                }
                else {
                    throw new ResourceError_1.RessourceError(`JSON file '${url}' not found.`);
                }
            });
        },
        async fetchImage(url) {
            return fetch(url).then((resp) => {
                if (resp.ok) {
                    return new Promise((resolve) => {
                        const img = new Image();
                        img.onload = () => {
                            resolve(img);
                        };
                        img.src = url;
                    });
                }
                else {
                    throw new ResourceError_1.RessourceError(`Image '${url}' not found.`);
                }
            });
        }
    });
    exports.ResourceFetcher = ResourceFetcher;
});
define("engine/libs/patterns/messaging/brokers/SingleTopicMessageBroker", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SingleTopicMessageBrokerBase = exports.SingleTopicMessageBroker = void 0;
    ;
    class SingleTopicMessageBrokerBase {
        constructor() {
            this._subscriptions = [];
        }
        hasSubscriptions() {
            return this._subscriptions.length > 0;
        }
        subscribe(subscription) {
            const index = this._subscriptions.indexOf(subscription);
            if (index < 0) {
                this._subscriptions.push(subscription);
            }
            return subscription;
        }
        unsubscribe(subscription) {
            const index = this._subscriptions.indexOf(subscription);
            if (index > -1) {
                this._subscriptions.splice(index, 1);
            }
            return this._subscriptions.length;
        }
        publish(message) {
            for (const subscription of this._subscriptions) {
                subscription(message);
            }
        }
    }
    exports.SingleTopicMessageBrokerBase = SingleTopicMessageBrokerBase;
    const SingleTopicMessageBroker = SingleTopicMessageBrokerBase;
    exports.SingleTopicMessageBroker = SingleTopicMessageBroker;
});
define("engine/core/logger/Logger", ["require", "exports", "engine/libs/patterns/messaging/brokers/SingleTopicMessageBroker"], function (require, exports, SingleTopicMessageBroker_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LoggerBase = exports.Logger = exports.LogLevel = void 0;
    var LogLevel;
    (function (LogLevel) {
        LogLevel[LogLevel["DEBUG"] = 0] = "DEBUG";
        LogLevel[LogLevel["ERROR"] = 1] = "ERROR";
        LogLevel[LogLevel["INFO"] = 2] = "INFO";
        LogLevel[LogLevel["LOG"] = 3] = "LOG";
        LogLevel[LogLevel["WARN"] = 4] = "WARN";
    })(LogLevel || (LogLevel = {}));
    exports.LogLevel = LogLevel;
    class LoggerBase {
        constructor() {
            this._broker = new SingleTopicMessageBroker_1.SingleTopicMessageBroker();
        }
        log(message) {
            const level = LogLevel.LOG;
            message = this.formatMessage(level, message);
            console.log(message);
            this._onLog(level, message);
        }
        info(message) {
            const level = LogLevel.INFO;
            message = this.formatMessage(level, message);
            console.info(message);
            this._onLog(level, message);
        }
        warn(message) {
            const level = LogLevel.WARN;
            message = this.formatMessage(level, message);
            console.warn(message);
            this._onLog(level, message);
        }
        debug(message) {
            const level = LogLevel.DEBUG;
            message = this.formatMessage(level, message);
            console.debug(message);
            this._onLog(level, message);
        }
        error(message) {
            const level = LogLevel.ERROR;
            message = this.formatMessage(level, message);
            console.error(message);
            this._onLog(level, message);
        }
        _onLog(level, message) {
            this._broker.publish({ level: level, message: message });
        }
        subscribe(subscription) {
            return this._broker.subscribe(subscription);
        }
        unsubscribe(subscription) {
            return this._broker.unsubscribe(subscription);
        }
        formatMessage(level, message) {
            const time = this.getTimestamp();
            return `[${time}] ${message}`;
        }
        getTimestamp() {
            return new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric", second: "numeric", hour12: false });
        }
    }
    exports.LoggerBase = LoggerBase;
    const Logger = new LoggerBase();
    exports.Logger = Logger;
});
define("engine/resources/Resources", ["require", "exports", "engine/resources/ResourceFetcher", "engine/core/logger/Logger"], function (require, exports, ResourceFetcher_1, Logger_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Resources = void 0;
    function extractExtension(filename) {
        return filename.substring(filename.lastIndexOf('.') + 1);
    }
    const imageExtensions = ['png', 'jpg'];
    const textExtensions = ['txt', 'md', 'vert', 'frag', 'glsl', 'json', 'html', 'css'];
    class ResourcesBase {
        constructor(folder) {
            this.folder = folder || '';
            this.resources = new Map();
        }
        get(file) {
            const resource = this.resources.get(file);
            if (typeof resource === 'undefined') {
                Logger_1.Logger.error(`Unknown resource '${file}'.`);
                return null;
            }
            return resource;
        }
        toString() {
            return `[\n\t\'${Array.from(this.resources.keys()).join("\',\n\t\'")}\'\n]`;
        }
        async load(path) {
            let url = this.folder.concat(path);
            const fetchResource = async function (path, url, map) {
                const fileExt = extractExtension(path);
                let file;
                try {
                    if (imageExtensions.includes(fileExt)) {
                        file = await ResourceFetcher_1.ResourceFetcher.fetchImage(url);
                    }
                    else if (textExtensions.includes(fileExt)) {
                        file = await ResourceFetcher_1.ResourceFetcher.fetchTextFile(url);
                    }
                }
                catch (e) {
                    Logger_1.Logger.error(`Resource item '${url}' not found.`);
                    return;
                }
                map.set(path, file);
            };
            await fetchResource(path, url, this.resources);
        }
        async loadList(path) {
            let url = this.folder.concat(path);
            let resources;
            try {
                resources = await ResourceFetcher_1.ResourceFetcher.fetchJSON(url);
            }
            catch (e) {
                Logger_1.Logger.error(`Resources list '${url}' not found.`);
                return;
            }
            const fetchResource = async function (resource, folder, map) {
                const fileExt = extractExtension(resource);
                let file;
                try {
                    if (imageExtensions.includes(fileExt)) {
                        file = await ResourceFetcher_1.ResourceFetcher.fetchImage(folder.concat(resource));
                    }
                    else if (textExtensions.includes(fileExt)) {
                        file = await ResourceFetcher_1.ResourceFetcher.fetchTextFile(folder.concat(resource));
                    }
                }
                catch (e) {
                    Logger_1.Logger.error(`Resource item '${url}' not found.`);
                    return;
                }
                map.set(resource, file);
            };
            for (const resource of resources.list) {
                await fetchResource(resource, this.folder, this.resources);
            }
        }
    }
    const Resources = ResourcesBase;
    exports.Resources = Resources;
});
define("engine/editor/elements/lib/containers/menus/MenuBar", ["require", "exports", "engine/editor/elements/HTMLElement", "engine/editor/elements/lib/containers/menus/MenuItem"], function (require, exports, HTMLElement_5, MenuItem_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BaseHTMLEMenuBarElement = exports.isHTMLEMenuBarElement = void 0;
    function isHTMLEMenuBarElement(elem) {
        return elem instanceof Node && elem.nodeType === elem.ELEMENT_NODE && elem.tagName.toLowerCase() === "e-menubar";
    }
    exports.isHTMLEMenuBarElement = isHTMLEMenuBarElement;
    let BaseHTMLEMenuBarElement = /** @class */ (() => {
        let BaseHTMLEMenuBarElement = class BaseHTMLEMenuBarElement extends HTMLElement {
            constructor() {
                super();
                HTMLElement_5.bindShadowRoot(this, /*template*/ `
            <style>
                :host {
                    display: flex;
                    position: relative; 
                    user-select: none;

                    background-color: white;
                }

                :host(:focus) {
                    outline: 1px solid -webkit-focus-ring-color;
                }

                :host(:focus) ::slotted(:first-child),
                :host(:not(:focus-within)) ::slotted(:hover) {
                    color: black;
                    background-color: gainsboro;
                }

                [part~="ul"] {
                    display: block;
                    list-style-type: none;
                    padding: 0; margin: 0;
                }
            </style>
            <ul part="ul">
                <slot></slot>
            </ul>
        `);
                this.items = [];
                this._activeIndex = -1;
            }
            get activeIndex() {
                return this._activeIndex;
            }
            get activeItem() {
                return this.items[this.activeIndex] || null;
            }
            connectedCallback() {
                var _a;
                this.tabIndex = this.tabIndex;
                const slot = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector("slot");
                if (slot) {
                    slot.addEventListener("slotchange", () => {
                        const items = slot.assignedElements()
                            .filter(MenuItem_1.isHTMLEMenuItemElement);
                        this.items = items;
                        items.forEach((item) => {
                            item.parentMenu = this;
                        });
                    });
                }
                this.addEventListener("mouseover", (event) => {
                    let targetIndex = this.items.indexOf(event.target);
                    if (targetIndex >= 0) {
                        if (this.contains(document.activeElement)) {
                            if (this.active) {
                                this.focusItemAt(targetIndex, true);
                            }
                            else {
                                this._activeIndex = targetIndex;
                            }
                        }
                    }
                });
                this.addEventListener("keydown", (event) => {
                    var _a, _b, _c;
                    switch (event.key) {
                        case "ArrowLeft":
                            this.focusItemAt((this.activeIndex <= 0) ? this.items.length - 1 : this.activeIndex - 1);
                            if (this.active && ((_a = this.activeItem) === null || _a === void 0 ? void 0 : _a.childMenu)) {
                                this.activeItem.childMenu.focusItemAt(0);
                            }
                            break;
                        case "ArrowRight":
                            this.focusItemAt((this.activeIndex >= this.items.length - 1) ? 0 : this.activeIndex + 1);
                            if (this.active && ((_b = this.activeItem) === null || _b === void 0 ? void 0 : _b.childMenu)) {
                                this.activeItem.childMenu.focusItemAt(0);
                            }
                            break;
                        case "ArrowDown":
                            this.focusItemAt(this.activeIndex);
                            if (this.active && ((_c = this.activeItem) === null || _c === void 0 ? void 0 : _c.childMenu)) {
                                this.activeItem.childMenu.focusItemAt(0);
                            }
                            break;
                        case "Enter":
                            this.active = true;
                            if (this.activeItem) {
                                this.activeItem.trigger();
                            }
                            break;
                        case "Escape":
                            this.focusItemAt(this.activeIndex);
                            this.active = false;
                            break;
                    }
                });
                this.addEventListener("mousedown", (event) => {
                    let targetIndex = this.items.indexOf(event.target);
                    if (targetIndex >= 0) {
                        if (!this.contains(document.activeElement)) {
                            this.active = true;
                            this.focusItemAt(targetIndex, true);
                        }
                        else {
                            this.active = false;
                            document.body.focus();
                        }
                        event.preventDefault();
                    }
                });
                this.addEventListener("focus", () => {
                    this._activeIndex = 0;
                });
            }
            focusItemAt(index, childMenu) {
                let item = this.items[index];
                if (item) {
                    this._activeIndex = index;
                    item.focus();
                    if (childMenu && item.childMenu) {
                        item.childMenu.focus();
                    }
                }
            }
            focusItem(predicate, subtree) {
                let item = this.findItem(predicate, subtree);
                if (item) {
                    item.focus();
                }
            }
            reset() {
                let item = this.activeItem;
                this._activeIndex = -1;
                if (item === null || item === void 0 ? void 0 : item.childMenu) {
                    item.childMenu.reset();
                }
            }
            findItem(predicate, subtree) {
                let foundItem = null;
                for (let idx = 0; idx < this.items.length; idx++) {
                    let item = this.items[idx];
                    if (predicate(item)) {
                        return item;
                    }
                    if (subtree && item.childMenu) {
                        foundItem = item.childMenu.findItem(predicate, subtree);
                        if (foundItem) {
                            return foundItem;
                        }
                    }
                }
                return foundItem;
            }
        };
        BaseHTMLEMenuBarElement = __decorate([
            HTMLElement_5.RegisterCustomHTMLElement({
                name: "e-menubar"
            }),
            HTMLElement_5.GenerateAttributeAccessors([
                { name: "name", type: "string" },
                { name: "active", type: "boolean" },
            ])
        ], BaseHTMLEMenuBarElement);
        return BaseHTMLEMenuBarElement;
    })();
    exports.BaseHTMLEMenuBarElement = BaseHTMLEMenuBarElement;
});
define("engine/editor/elements/lib/containers/status/StatusItem", ["require", "exports", "engine/editor/Editor", "engine/editor/elements/HTMLElement"], function (require, exports, Editor_1, HTMLElement_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isHTMLEStatusItemElement = exports.HTMLEStatusItemElement = void 0;
    function isHTMLEStatusItemElement(elem) {
        return elem.tagName.toLowerCase() === "e-statusitem";
    }
    exports.isHTMLEStatusItemElement = isHTMLEStatusItemElement;
    let HTMLEStatusItemElement = /** @class */ (() => {
        let HTMLEStatusItemElement = class HTMLEStatusItemElement extends HTMLElement {
            // TODO: Add sync with Promise (icons, etc.)
            constructor() {
                super();
                HTMLElement_6.bindShadowRoot(this, /*template*/ `
            <style>
                :host {
                    position: relative;
                    display: inline-block;

                    user-select: none;
                    white-space: nowrap;

                    padding: 2px 6px;
                    background-color: white;
                }

                :host(:focus-visible) {
                    outline: none;
                }

                :host(:hover),
                :host([active]) {
                    background-color: rgb(180, 180, 180);
                }
                
                li {
                    display: flex;
                    height: 100%;
                    list-style-type: none;
                }
            </style>
            <li>
                <slot></slot>
            </li>
        `);
                this.command = null;
                this._stateMap = null;
            }
            get stateMap() {
                return this._stateMap;
            }
            set stateMap(stateMap) {
                this._stateMap = stateMap;
            }
            update(newValue) {
                const { content } = (typeof this.stateMap === "function") ? this.stateMap(newValue) : newValue;
                this.textContent = content;
            }
            activate() {
                const command = this.command;
                if (command) {
                    Editor_1.editor.executeCommand(command);
                }
                this.dispatchEvent(new CustomEvent("activate"));
            }
            connectedCallback() {
                this.tabIndex = this.tabIndex;
                this.addEventListener("click", (event) => {
                    this.activate();
                    event.stopPropagation();
                });
            }
        };
        HTMLEStatusItemElement = __decorate([
            HTMLElement_6.RegisterCustomHTMLElement({
                name: "e-statusitem",
            }),
            HTMLElement_6.GenerateAttributeAccessors([
                { name: "name", type: "string" },
                { name: "icon", type: "string" },
                { name: "type", type: "string" },
            ])
        ], HTMLEStatusItemElement);
        return HTMLEStatusItemElement;
    })();
    exports.HTMLEStatusItemElement = HTMLEStatusItemElement;
});
define("engine/editor/elements/lib/containers/status/StatusBar", ["require", "exports", "engine/editor/elements/HTMLElement", "engine/editor/elements/lib/containers/status/StatusItem"], function (require, exports, HTMLElement_7, StatusItem_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isHTMLEStatusBarElement = exports.HTMLEStatusBarElement = void 0;
    function isHTMLEStatusBarElement(elem) {
        return elem.tagName.toLowerCase() === "e-statusbar";
    }
    exports.isHTMLEStatusBarElement = isHTMLEStatusBarElement;
    let HTMLEStatusBarElement = /** @class */ (() => {
        let HTMLEStatusBarElement = class HTMLEStatusBarElement extends HTMLElement {
            constructor() {
                super();
                HTMLElement_7.bindShadowRoot(this, /*template*/ `
            <style>
                :host {
                    display: flex;
                    position: relative; 
                    user-select: none;

                    background-color: white;
                }

                ul {
                    display: block;
                    list-style-type: none;
                    padding: 0; margin: 0;
                }
            </style>
            <ul>
                <slot id="items"></slot>
            </ul>
        `);
                this.items = [];
                this._selectedItemIndex = -1;
            }
            connectedCallback() {
                var _a;
                this.tabIndex = this.tabIndex;
                const itemsSlot = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.getElementById("items");
                if (itemsSlot) {
                    itemsSlot.addEventListener("slotchange", (event) => {
                        const items = event.target.assignedElements();
                        items.forEach((item) => {
                            if (StatusItem_1.isHTMLEStatusItemElement(item)) {
                                this.items.push(item);
                            }
                        });
                    }, { once: true });
                }
                const focusInCallback = function (keydownControls) {
                    this.addEventListener("keydown", keydownControls);
                    this.addEventListener("click", () => {
                        this.active = true;
                    }, { capture: true });
                };
                const focusOutCallback = function (keydownControls) {
                    this.removeEventListener("keydown", keydownControls);
                    this.active = false;
                };
                const keydownControls = (event) => {
                    switch (event.key) {
                        case "ArrowLeft":
                            this.selectItem((this.selectedItemIndex <= 0) ? this.items.length - 1 : this.selectedItemIndex - 1);
                            break;
                        case "ArrowRight":
                            this.selectItem((this.selectedItemIndex >= this.items.length - 1) ? 0 : this.selectedItemIndex + 1);
                            break;
                        case "Enter":
                            this.active = true;
                            if (this.selectedItem) {
                                this.selectedItem.activate();
                            }
                            break;
                        case "Home":
                            this.selectItem(0);
                            break;
                        case "End":
                            this.selectItem(this.items.length - 1);
                            break;
                        case "Escape":
                            this.selectItem(this.selectedItemIndex);
                            this.active = false;
                            break;
                    }
                };
                this.addEventListener("focus", () => {
                    this.selectItem(0);
                });
            }
            get selectedItemIndex() {
                return this._selectedItemIndex;
            }
            get selectedItem() {
                return this.items[this.selectedItemIndex] || null;
            }
            insertItem(index, item) {
                index = Math.min(Math.max(index, -this.items.length), this.items.length);
                this.insertBefore(item, this.children[index >= 0 ? index : this.children.length + index]);
                this.items.splice(index, 0, item);
                item.addEventListener("mouseenter", () => {
                    this.selectItem(this.items.indexOf(item));
                });
                item.addEventListener("mouseleave", () => {
                });
            }
            findItem(predicate) {
                const items = this.findItems(predicate);
                if (items.length > 0) {
                    return items[0];
                }
                return null;
            }
            findItems(predicate) {
                const items = [];
                this.items.forEach((item) => {
                    if (predicate(item)) {
                        items.push(item);
                    }
                });
                return items;
            }
            selectItem(index) {
                if (index !== this.selectedItemIndex) {
                    this.clearSelection();
                    let item = this.items[index];
                    if (item) {
                        this._selectedItemIndex = index;
                    }
                }
            }
            clearSelection() {
                let item = this.selectedItem;
                if (item) {
                    this._selectedItemIndex = -1;
                }
            }
        };
        HTMLEStatusBarElement = __decorate([
            HTMLElement_7.RegisterCustomHTMLElement({
                name: "e-statusbar"
            }),
            HTMLElement_7.GenerateAttributeAccessors([
                { name: "name", type: "string" },
                { name: "active", type: "boolean" },
            ])
        ], HTMLEStatusBarElement);
        return HTMLEStatusBarElement;
    })();
    exports.HTMLEStatusBarElement = HTMLEStatusBarElement;
});
define("engine/editor/elements/lib/containers/menus/MenuItemGroup", ["require", "exports", "engine/editor/elements/HTMLElement", "engine/editor/elements/lib/containers/menus/MenuItem", "engine/editor/elements/Snippets"], function (require, exports, HTMLElement_8, MenuItem_2, Snippets_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BaseHTMLEMenuItemGroupElement = exports.isHTMLEMenuItemGroupElement = void 0;
    function isHTMLEMenuItemGroupElement(elem) {
        return elem instanceof Node && elem.nodeType === elem.ELEMENT_NODE && elem.tagName.toLowerCase() === "e-menuitemgroup";
    }
    exports.isHTMLEMenuItemGroupElement = isHTMLEMenuItemGroupElement;
    let BaseHTMLEMenuItemGroupElement = /** @class */ (() => {
        let BaseHTMLEMenuItemGroupElement = class BaseHTMLEMenuItemGroupElement extends HTMLElement {
            constructor() {
                super();
                HTMLElement_8.bindShadowRoot(this, /*template*/ `
            <style>
                :host {
                    display: inline-block;
                    position: relative;
                    user-select: none;
                }

                :host(:focus) {
                    outline: none;
                }
                
                :host(:not([label])) [part~="li"] {
                    display: none;
                }

                [part~="label"] {
                    position: relative;
                    display: inline-block;
                    width: 100%;

                    user-select: none;
                    white-space: nowrap;

                    padding: 2px 6px 6px 6px;
                    font-weight: bold;
                }

                [part~="li"] {
                    display: flex;
                    height: 100%;
                    list-style-type: none;
                }

                [part~="separator"] {
                    margin: 6px 0;
                }

                :host(:first-child) [part~="separator"] {
                    display: none;
                }
                
                ::slotted(*) {
                    display: block;
                    width: 100%;
                }
            </style>
            <div part="content">
                <hr part="separator"/>
                <li part="li">
                    <span part="label"></span>
                </li>
                <slot></slot>
            </div>
        `);
                this._activeIndex = -1;
                this.parentMenu = null;
                this.items = [];
            }
            get activeIndex() {
                return this._activeIndex;
            }
            get activeItem() {
                return this.items[this.activeIndex] || null;
            }
            connectedCallback() {
                var _a;
                this.tabIndex = this.tabIndex;
                const slot = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector("slot");
                if (slot) {
                    slot.addEventListener("slotchange", () => {
                        const items = slot.assignedElements()
                            .filter(MenuItem_2.isHTMLEMenuItemElement);
                        this.items = items;
                        items.forEach((item) => {
                            item.parentMenu = this.parentMenu;
                            item.group = this;
                        });
                    });
                }
                this.addEventListener("mousedown", (event) => {
                    let target = event.target;
                    if (this.items.includes(target)) {
                        target.trigger();
                    }
                });
                this.addEventListener("mouseover", (event) => {
                    let target = event.target;
                    let targetIndex = this.items.indexOf(target);
                    if (this === target) {
                        this.reset();
                        this.focus();
                    }
                    else if (targetIndex >= 0) {
                        this.focusItemAt(this.items.indexOf(target), true);
                    }
                });
                this.addEventListener("mouseout", (event) => {
                    let target = event.target;
                    let thisIntersectsWithMouse = Snippets_2.pointIntersectsWithDOMRect(event.clientX, event.clientY, this.getBoundingClientRect());
                    if ((this === target || this.items.includes(target)) && !thisIntersectsWithMouse) {
                        this.reset();
                        this.focus();
                    }
                });
                this.addEventListener("focusin", (event) => {
                    let target = event.target;
                    this._activeIndex = this.items.findIndex((item) => item.contains(target));
                });
                this.addEventListener("focusout", (event) => {
                    let newTarget = event.relatedTarget;
                    if (!this.contains(newTarget)) {
                        this.reset();
                    }
                });
                this.addEventListener("change", (event) => {
                    let target = event.target;
                    if (MenuItem_2.isHTMLEMenuItemElement(target)) {
                        let item = target;
                        if (item.type === "radio" && item.checked) {
                            let newCheckedRadio = item;
                            let checkedRadio = this.findItem((item) => {
                                return item.type === "radio" && item.checked && item !== newCheckedRadio;
                            });
                            if (checkedRadio) {
                                checkedRadio.checked = false;
                            }
                        }
                    }
                });
                this.addEventListener("keydown", (event) => {
                    var _a;
                    switch (event.key) {
                        case "ArrowUp":
                            if (this.activeIndex > 0) {
                                this.focusItemAt(this.activeIndex - 1);
                                event.stopPropagation();
                            }
                            break;
                        case "ArrowDown":
                            if (this.activeIndex < this.items.length - 1) {
                                this.focusItemAt(this.activeIndex + 1);
                                event.stopPropagation();
                            }
                            break;
                        case "Enter":
                            if (this.activeItem) {
                                this.activeItem.trigger();
                                event.stopPropagation();
                            }
                            break;
                        case "ArrowRight":
                            if (this.items.includes(event.target)) {
                                if ((_a = this.activeItem) === null || _a === void 0 ? void 0 : _a.childMenu) {
                                    this.activeItem.childMenu.focusItemAt(0);
                                    event.stopPropagation();
                                }
                            }
                            break;
                        case "Home":
                            this.focusItemAt(0);
                            break;
                        case "End":
                            this.focusItemAt(this.items.length - 1);
                            break;
                        case "Escape":
                            this.reset();
                            break;
                    }
                });
            }
            attributeChangedCallback(name, oldValue, newValue) {
                var _a;
                if (oldValue !== newValue) {
                    switch (name) {
                        case "label":
                            if (oldValue !== newValue) {
                                const label = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector("[part~=label]");
                                if (label) {
                                    label.textContent = newValue;
                                }
                            }
                    }
                }
            }
            focusItemAt(index, childMenu) {
                let item = this.items[index];
                if (item) {
                    this._activeIndex = index;
                    item.focus();
                    if (childMenu && item.childMenu) {
                        item.childMenu.focus();
                    }
                }
            }
            reset() {
                let item = this.activeItem;
                this._activeIndex = -1;
                if (item === null || item === void 0 ? void 0 : item.childMenu) {
                    item.childMenu.reset();
                }
            }
            focusItem(predicate, subitems) {
                let item = this.findItem(predicate, subitems);
                if (item) {
                    item.focus();
                }
            }
            findItem(predicate, subitems) {
                let foundItem = null;
                for (let idx = 0; idx < this.items.length; idx++) {
                    let item = this.items[idx];
                    if (predicate(item)) {
                        return item;
                    }
                    if (subitems && item.childMenu) {
                        foundItem = item.childMenu.findItem(predicate, subitems);
                        if (foundItem) {
                            return foundItem;
                        }
                    }
                }
                return foundItem;
            }
        };
        BaseHTMLEMenuItemGroupElement = __decorate([
            HTMLElement_8.RegisterCustomHTMLElement({
                name: "e-menuitemgroup",
                observedAttributes: ["label"]
            }),
            HTMLElement_8.GenerateAttributeAccessors([
                { name: "label", type: "string" },
                { name: "type", type: "string" },
                { name: "name", type: "string" },
                { name: "rows", type: "number" },
                { name: "cells", type: "number" },
            ])
        ], BaseHTMLEMenuItemGroupElement);
        return BaseHTMLEMenuItemGroupElement;
    })();
    exports.BaseHTMLEMenuItemGroupElement = BaseHTMLEMenuItemGroupElement;
});
define("engine/editor/templates/menus/MenuItemGroupTemplate", ["require", "exports", "engine/editor/elements/HTMLElement", "engine/editor/templates/menus/MenuItemTemplate"], function (require, exports, HTMLElement_9, MenuItemTemplate_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HTMLEMenuItemGroupTemplate = void 0;
    const HTMLEMenuItemGroupTemplate = (desc) => {
        const items = desc.items.map((descArgs) => MenuItemTemplate_1.HTMLEMenuItemTemplate(descArgs));
        return HTMLElement_9.HTMLElementConstructor("e-menuitemgroup", {
            props: {
                id: desc.id,
                className: desc.className,
                name: desc.name
            },
            children: items
        });
    };
    exports.HTMLEMenuItemGroupTemplate = HTMLEMenuItemGroupTemplate;
});
define("engine/editor/templates/menus/MenuTemplate", ["require", "exports", "engine/editor/elements/HTMLElement", "engine/editor/templates/menus/MenuItemGroupTemplate", "engine/editor/templates/menus/MenuItemTemplate"], function (require, exports, HTMLElement_10, MenuItemGroupTemplate_1, MenuItemTemplate_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HTMLEMenuTemplate = void 0;
    const HTMLEMenuTemplate = (desc) => {
        const items = desc.items.map((itemDesc) => {
            if ("isGroup" in itemDesc) {
                return MenuItemGroupTemplate_1.HTMLEMenuItemGroupTemplate(itemDesc);
            }
            else {
                return MenuItemTemplate_2.HTMLEMenuItemTemplate(itemDesc);
            }
        });
        return HTMLElement_10.HTMLElementConstructor("e-menu", {
            props: {
                id: desc.id,
                className: desc.className,
                name: desc.name,
            },
            children: items
        });
    };
    exports.HTMLEMenuTemplate = HTMLEMenuTemplate;
});
define("engine/editor/templates/menus/MenuItemTemplate", ["require", "exports", "engine/core/input/Input", "engine/editor/elements/HTMLElement", "engine/editor/templates/menus/MenuTemplate"], function (require, exports, Input_1, HTMLElement_11, MenuTemplate_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HTMLEMenuItemTemplate = void 0;
    const HTMLEMenuItemTemplate = (desc) => {
        let slotted = [];
        if (desc.menu) {
            slotted.push(HTMLElement_11.setElementAttributes(MenuTemplate_1.HTMLEMenuTemplate(desc.menu), {
                slot: "menu"
            }));
        }
        const menuItem = HTMLElement_11.HTMLElementConstructor("e-menuitem", {
            props: {
                id: desc.id,
                className: desc.className,
                name: desc.name,
                title: desc.title,
                type: desc.type,
                label: desc.label,
                disabled: desc.disabled,
                icon: desc.icon,
                value: desc.value,
                checked: desc.checked,
                command: desc.command,
                commandArgs: desc.commandArgs,
                hotkey: desc.hotkey ? new Input_1.HotKey(desc.hotkey.key, desc.hotkey.mod1, desc.hotkey.mod2) : void 0
            },
            children: [
                ...slotted
            ]
        });
        return menuItem;
    };
    exports.HTMLEMenuItemTemplate = HTMLEMenuItemTemplate;
});
define("engine/editor/templates/menus/MenubarTemplate", ["require", "exports", "engine/editor/elements/HTMLElement", "engine/editor/templates/menus/MenuItemTemplate"], function (require, exports, HTMLElement_12, MenuItemTemplate_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HTMLEMenubarTemplate = void 0;
    const HTMLEMenubarTemplate = (desc) => {
        const items = desc.items.map((itemDesc) => {
            return MenuItemTemplate_3.HTMLEMenuItemTemplate(itemDesc);
        });
        return HTMLElement_12.HTMLElementConstructor("e-menubar", {
            props: {
                id: desc.id,
                className: desc.className,
                tabIndex: desc.tabIndex
            },
            children: items
        });
    };
    exports.HTMLEMenubarTemplate = HTMLEMenubarTemplate;
});
define("engine/editor/Editor", ["require", "exports", "engine/libs/patterns/commands/Command", "engine/libs/patterns/messaging/events/EventDispatcher", "engine/resources/ResourceFetcher", "engine/editor/elements/Snippets", "engine/editor/templates/menus/MenubarTemplate"], function (require, exports, Command_1, EventDispatcher_1, ResourceFetcher_2, Snippets_3, MenubarTemplate_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.EditorBase = exports.editor = void 0;
    ;
    class EditorBase extends EventDispatcher_1.EventDispatcher {
        /*readonly toolbar: HTMLElement;
        readonly statusbar: HTMLElement;*/
        /*public readonly state: HTMLFormElement;
        */
        constructor() {
            super();
            this._commands = new Map();
            this._context = 'default';
            this._hotkeys = new Map();
            this._undoCommandsCallStack = [];
            this._redoCommandsCallStack = [];
            this.menubar = null;
            this.statusbar = null;
            this._selection = null;
            this._state = {};
            this._stateListeners = new Map();
            this._focusListeners = [];
        }
        get context() {
            return this._context;
        }
        setup() {
            const menubarContainer = document.getElementById("menubar-container");
            this.statusbar = document.body.querySelector("e-statusbar");
            document.addEventListener("keydown", (event) => {
                Array.from(this._hotkeys.keys()).forEach((hotkey) => {
                    if (hotkey.test(event)) {
                        let execs = this._hotkeys.get(hotkey);
                        execs.forEach((exec) => {
                            exec();
                        });
                    }
                });
            });
            return Promise.all([
                new Promise((resolve, reject) => {
                    if (menubarContainer) {
                        ResourceFetcher_2.ResourceFetcher.fetchJSON("assets/editor/editor.json").then((menubarTemplate) => {
                            const menubar = MenubarTemplate_1.HTMLEMenubarTemplate(menubarTemplate);
                            this.menubar = menubar;
                            menubarContainer.append(menubar);
                            resolve();
                        });
                    }
                    else {
                        reject();
                    }
                }),
                new Promise((resolve) => {
                    ResourceFetcher_2.ResourceFetcher.fetchJSON("assets/editor/state.json").then((state) => {
                        const keys = Object.keys(state);
                        keys.forEach((key) => {
                            this.setState(key, state[key]);
                        });
                        resolve();
                    });
                })
            ]);
        }
        reloadState() {
            return new Promise((resolve) => {
                ResourceFetcher_2.ResourceFetcher.fetchJSON("assets/editor/state.json").then((state) => {
                    const keys = Object.keys(state);
                    keys.forEach((key) => {
                        this.setState(key, state[key]);
                    });
                    resolve();
                });
            });
        }
        setContext(context) {
            if (context !== this._context) {
                /*this.dispatchEvent(`${this._context}contextleave`, {data: void 0});
                this.dispatchEvent(`${context}contextenter`, {data: void 0});
                this._context = context;
                if (this.menubar) {
                    this.menubar.findItems((item) => {
                        return !!item.command && (item.command.context === this._context)
                    }).forEach((item) => {
                        item.disabled = true;
                    });
                }*/
            }
        }
        getState(key) {
            return Snippets_3.getPropertyFromPath(this._state, key);
        }
        //TODO: Create a listeners object with the same structure as the state object
        setState(key, value) {
            Snippets_3.setPropertyFromPath(this._state, key, value);
            const listenedStates = Array.from(this._stateListeners.keys());
            listenedStates.filter((state) => {
                return (state.startsWith(key) && (state.charAt(key.length) === "." || state.charAt(key.length) === "")) ||
                    (key.startsWith(state) && (key.charAt(state.length) === "." || key.charAt(state.length) === ""));
            }).forEach((state) => {
                let stateListeners = this._stateListeners.get(state);
                if (stateListeners) {
                    let newStateValue = (state.length === key.length) ? value :
                        (state.length >= key.length) ? Snippets_3.getPropertyFromPath(value, state.substring(key.length + 1)) :
                            Snippets_3.getPropertyFromPath(this._state, state);
                    stateListeners.forEach((stateListener) => {
                        stateListener(newStateValue);
                    });
                }
            });
        }
        addStateListener(statekey, listener) {
            let stateListeners = this._stateListeners.get(statekey);
            if (typeof stateListeners === "undefined") {
                this._stateListeners.set(statekey, [listener]);
                return 0;
            }
            else {
                return stateListeners.push(listener) - 1;
            }
        }
        removeStateListener(statekey, listener) {
            let stateListeners = this._stateListeners.get(statekey);
            if (typeof stateListeners !== "undefined") {
                let index = stateListeners.indexOf(listener);
                if (index >= 0) {
                    stateListeners.splice(index, 1);
                }
                if (stateListeners.length === 0) {
                    this._stateListeners.delete(statekey);
                }
            }
        }
        registerCommand(name, command) {
            this._commands.set(name, command);
        }
        executeCommand(name, args, opts) {
            const command = this._commands.get(name);
            if (command && command.context === this._context) {
                if (opts && opts.undo && Command_1.isUndoCommand(command)) {
                    command.undo(args);
                    this._redoCommandsCallStack.push({ ...command, args: args });
                }
                else {
                    command.exec(args);
                    if (Command_1.isUndoCommand(command)) {
                        this._undoCommandsCallStack.push({ ...command, args: args });
                    }
                }
            }
        }
        undoLastCommand() {
            const lastCommand = this._undoCommandsCallStack.pop();
            if (lastCommand) {
                if (Command_1.isUndoCommand(lastCommand) && lastCommand.context === this._context) {
                    lastCommand.undo();
                    this._redoCommandsCallStack.push(lastCommand);
                }
            }
        }
        redoLastCommand() {
            const lastCommand = this._redoCommandsCallStack.pop();
            if (lastCommand) {
                if (lastCommand.context === this._context) {
                    lastCommand.exec();
                    if (Command_1.isUndoCommand(lastCommand)) {
                        this._undoCommandsCallStack.push(lastCommand);
                    }
                }
            }
        }
        addHotkeyExec(hotkey, exec) {
            let hotkeys = this._hotkeys.get(hotkey);
            if (typeof hotkeys === "undefined") {
                this._hotkeys.set(hotkey, [exec]);
                return 0;
            }
            else {
                return hotkeys.push(exec) - 1;
            }
        }
        removeHotkeyExec(hotkey, exec) {
            let hotkeys = this._hotkeys.get(hotkey);
            if (typeof hotkeys !== "undefined") {
                let index = hotkeys.indexOf(exec);
                if (index >= 0) {
                    hotkeys.splice(index, 1);
                }
                if (hotkeys.length === 0) {
                    this._hotkeys.delete(hotkey);
                }
            }
        }
    }
    exports.EditorBase = EditorBase;
    var editor = new EditorBase();
    exports.editor = editor;
});
define("engine/editor/elements/lib/containers/menus/MenuItem", ["require", "exports", "engine/core/input/Input", "engine/editor/Editor", "engine/editor/elements/HTMLElement", "engine/editor/elements/lib/containers/menus/Menu"], function (require, exports, Input_2, Editor_2, HTMLElement_13, Menu_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BaseHTMLEMenuItemElement = exports.isHTMLEMenuItemElement = void 0;
    function isHTMLEMenuItemElement(obj) {
        return obj instanceof Node && obj.nodeType === obj.ELEMENT_NODE && obj.tagName.toLowerCase() === "e-menuitem";
    }
    exports.isHTMLEMenuItemElement = isHTMLEMenuItemElement;
    let BaseHTMLEMenuItemElement = /** @class */ (() => {
        let BaseHTMLEMenuItemElement = class BaseHTMLEMenuItemElement extends HTMLElement {
            constructor() {
                super();
                HTMLElement_13.bindShadowRoot(this, /*template*/ `
            <style>
                :host {
                    position: relative;
                    display: inline-block;

                    user-select: none;
                    white-space: nowrap;

                    padding: 2px 6px;
                    cursor: pointer;
                }

                :host(:focus) {
                    outline: none;
                }

                :host(:focus-within) {
                    color: white;
                    background-color: dimgray;
                }

                :host(:focus-within) [part~="visual"] {
                    color: white;
                }
                     
                :host([type="menu"]:focus-within),
                :host([type="submenu"]:focus-within) {
                    color: black;
                    background-color: lightgray;
                }

                :host([type="menu"]:focus-within) [part~="arrow"],
                :host([type="submenu"]:focus-within) [part~="arrow"] {
                    color: black;
                }

                :host([disabled]) {
                    color: lightgray;
                }

                :host([type="submenu"]) ::slotted([slot="menu"]),
                :host([type="menu"]) ::slotted([slot="menu"]) {
                    z-index: 1;
                    position: absolute;
                    color: initial;
                }

                :host([type="menu"]) ::slotted([slot="menu"]) {
                    top: 100%;
                    left: 0;
                }

                :host([type="submenu"]) ::slotted([slot="menu"]) {
                    left: 100%;
                    top: -6px;
                }
                
                :host([type="submenu"]) ::slotted([slot="menu"][overflowing]) {
                    right: 100%;
                    left: auto;
                }
                
                :host([type="menu"]) ::slotted([slot="menu"][overflowing]) {
                    right: 0;
                    left: auto;
                }

                :host([type="menu"]) ::slotted([slot="menu"]:not([expanded])),
                :host([type="submenu"]) ::slotted([slot="menu"]:not([expanded])) {
                    opacity: 0;
                    pointer-events: none !important;
                }

                [part~="li"] {
                    display: flex;
                    height: 100%;
                    list-style-type: none;
                }

                [part~="content"] {
                    font-size: 1em;
                    flex: auto;
                    display: flex;
                }

                [part~="icon"] {
                    flex: none;
                    display: none;
                    width: 14px;
                    height: 14px;
                    margin-right: 2px;
                }

                [part~="state"] {
                    flex: none;
                    width: 16px;
                    margin-right: 8px;
                }

                [part~="input"] {
                    flex: none;
                    width: 14px;
                    height: 14px;
                    margin-right: 8px;
                    pointer-events: none;
                }

                [part~="label"] {
                    flex: auto;
                    text-align: left;
                }

                [part~="hotkey"] {
                    flex: none;
                    text-align: right;
                    margin-left: 16px;
                }

                [part~="hotkey"]:empty {
                    display: none !important;
                }

                [part~="arrow"] {
                    flex: none;
                    margin-left: 8px;
                }

                [part~="visual"] {
                    color: dimgray;
                    font-size: 1.6em;
                    line-height: 0.625;
                }

                [part~="visual"]::after {
                    pointer-events: none;
                }

                :host(:not([type="checkbox"]):not([type="radio"])) [part~="input"] {
                    display: none;
                }

                :host(:not([icon])) [part~="icon"],
                :host(:not([type="checkbox"]):not([type="radio"])) [part~="state"] {
                    visibility: hidden;
                }

                :host(:not([type="checkbox"]):not([type="radio"])) [part~="state"] {
                    display: none;
                }

                :host(:not([type="submenu"])) [part~="arrow"] {
                    display: none !important;
                }
                
                :host([type="checkbox"][checked]) [part~="state"]::after {
                    content: "■";
                }

                :host([type="checkbox"]:not([checked])) [part~="state"]::after {
                    content: "□";
                }

                :host([type="radio"][checked]) [part~="state"]::after {
                    content: "●";
                }

                :host([type="radio"]:not([checked])) [part~="state"]::after {
                    content: "○";
                }

                :host([type="submenu"]) [part~="arrow"]::after {
                    content: "›";
                }
            </style>
            <li part="li">
                <span part="content">
                    <span part="visual icon"></span>
                    <!--<span part="visual state"></span>-->
                    <input part="input" type="hidden" tabindex="-1"></input>
                    <span part="label"></span>
                    <span part="hotkey"></span>
                    <span part="description"></span>
                    <span part="visual arrow"></span>
                </span>
                <slot name="menu"></slot>
            </li>
        `);
                this.childMenu = null;
                this.parentMenu = null;
                this.group = null;
                this.command = null;
                this._hotkey = null;
                this._hotkeyExec = null;
            }
            get hotkey() {
                return this._hotkey;
            }
            set hotkey(hotkey) {
                var _a;
                if (this._hotkey !== null && this._hotkeyExec !== null) {
                    Editor_2.editor.removeHotkeyExec(this._hotkey, this._hotkeyExec);
                }
                if (!this._hotkeyExec) {
                    this._hotkeyExec = () => {
                        if (this.command) {
                            Editor_2.editor.executeCommand(this.command, this.commandArgs);
                        }
                    };
                }
                if (hotkey instanceof Input_2.HotKey) {
                    this._hotkey = hotkey;
                    Editor_2.editor.addHotkeyExec(this._hotkey, this._hotkeyExec);
                }
                let hotkeyPart = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector("[part~=hotkey]");
                if (hotkeyPart) {
                    hotkeyPart.textContent = hotkey ? hotkey.toString() : "";
                }
            }
            connectedCallback() {
                var _a;
                this.tabIndex = this.tabIndex;
                this.setAttribute("aria-label", this.label);
                const menuSlot = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector("slot[name=menu]");
                if (menuSlot) {
                    menuSlot.addEventListener("slotchange", () => {
                        const menuElem = menuSlot.assignedElements()[0];
                        if (Menu_1.isHTMLEMenuElement(menuElem)) {
                            this.childMenu = menuElem;
                            menuElem.parentItem = this;
                        }
                    });
                }
            }
            disconnectedCallback() {
                if (this._hotkey !== null && this._hotkeyExec !== null) {
                    Editor_2.editor.removeHotkeyExec(this._hotkey, this._hotkeyExec);
                }
            }
            attributeChangedCallback(name, oldValue, newValue) {
                var _a, _b, _c, _d;
                if (newValue !== oldValue) {
                    switch (name) {
                        case "label":
                            if (oldValue !== newValue) {
                                const labelPart = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector("[part~=label]");
                                if (labelPart) {
                                    labelPart.textContent = newValue;
                                }
                            }
                            break;
                        case "icon":
                            if (oldValue !== newValue) {
                                const iconPart = (_b = this.shadowRoot) === null || _b === void 0 ? void 0 : _b.querySelector("[part~=icon]");
                                if (iconPart) {
                                    iconPart.dataset.value = newValue;
                                }
                            }
                            break;
                        case "checked":
                            if (oldValue !== newValue) {
                                const inputPart = (_c = this.shadowRoot) === null || _c === void 0 ? void 0 : _c.querySelector("[part~=input]");
                                if (inputPart) {
                                    inputPart.checked = (newValue !== null);
                                }
                                switch (this.type) {
                                    case "checkbox":
                                        this.dispatchEvent(new CustomEvent("change", { bubbles: true }));
                                        if (this.command) {
                                            Editor_2.editor.executeCommand(this.command, this.commandArgs, this.checked ? void 0 : { undo: true });
                                        }
                                        break;
                                    case "radio":
                                        this.dispatchEvent(new CustomEvent("change", { bubbles: true }));
                                        if (this.command) {
                                            Editor_2.editor.executeCommand(this.command, this.commandArgs, this.checked ? void 0 : { undo: true });
                                        }
                                        break;
                                }
                            }
                            break;
                        case "type":
                            if (oldValue !== newValue) {
                                const inputPart = (_d = this.shadowRoot) === null || _d === void 0 ? void 0 : _d.querySelector("[part~=input]");
                                if (inputPart) {
                                    switch (this.type) {
                                        case "button":
                                            inputPart.type = "button";
                                        case "checkbox":
                                            inputPart.type = "checkbox";
                                            break;
                                        case "radio":
                                            inputPart.type = "radio";
                                            break;
                                        default:
                                            inputPart.type = "hidden";
                                            break;
                                    }
                                }
                            }
                    }
                }
            }
            trigger() {
                if (!this.disabled) {
                    switch (this.type) {
                        case "button":
                        default:
                            if (this.command) {
                                Editor_2.editor.executeCommand(this.command, this.commandArgs);
                            }
                            break;
                        case "checkbox":
                            this.checked = !this.checked;
                            break;
                        case "radio":
                            this.checked = true;
                            break;
                        case "menu":
                            if (this.childMenu) {
                                this.childMenu.focusItemAt(0);
                            }
                            break;
                    }
                    this.dispatchEvent(new CustomEvent("trigger", { bubbles: true }));
                }
            }
        };
        BaseHTMLEMenuItemElement = __decorate([
            HTMLElement_13.RegisterCustomHTMLElement({
                name: "e-menuitem",
                observedAttributes: ["icon", "label", "checked", "type"]
            }),
            HTMLElement_13.GenerateAttributeAccessors([
                { name: "name", type: "string" },
                { name: "label", type: "string" },
                { name: "icon", type: "string" },
                { name: "type", type: "string" },
                { name: "disabled", type: "boolean" },
                { name: "checked", type: "boolean" },
            ])
        ], BaseHTMLEMenuItemElement);
        return BaseHTMLEMenuItemElement;
    })();
    exports.BaseHTMLEMenuItemElement = BaseHTMLEMenuItemElement;
});
define("engine/editor/elements/lib/containers/menus/Menu", ["require", "exports", "engine/editor/elements/HTMLElement", "engine/editor/elements/lib/containers/menus/MenuItem", "engine/editor/elements/Snippets", "engine/editor/elements/lib/containers/menus/MenuItemGroup"], function (require, exports, HTMLElement_14, MenuItem_3, Snippets_4, MenuItemGroup_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BaseHTMLEMenuElement = exports.isHTMLEMenuElement = void 0;
    function isHTMLEMenuElement(elem) {
        return elem instanceof Node && elem.nodeType === elem.ELEMENT_NODE && elem.tagName.toLowerCase() === "e-menu";
    }
    exports.isHTMLEMenuElement = isHTMLEMenuElement;
    let BaseHTMLEMenuElement = /** @class */ (() => {
        let BaseHTMLEMenuElement = class BaseHTMLEMenuElement extends HTMLElement {
            constructor() {
                super();
                HTMLElement_14.bindShadowRoot(this, /*template*/ `
            <style>
                :host {
                    display: block;
                    position: relative;
                    user-select: none;

                    padding: 6px 0;
                    background-color: white;
                    cursor: initial;

                    -webkit-box-shadow: 1px 1px 2px 0px rgba(0,0,0,0.75);
                    -moz-box-shadow: 1px 1px 2px 0px rgba(0,0,0,0.75);
                    box-shadow: 1px 1px 2px 0px rgba(0,0,0,0.75);
                }
                
                :host(:focus) {
                    outline: none;
                }

                [part~="ul"] {
                    display: block;
                    list-style-type: none;
                    padding: 0; margin: 0;
                }

                ::slotted(*) {
                    display: block;
                    width: 100%;
                }

                ::slotted(hr) {
                    margin: 6px 0;
                }
            </style>
            <ul part="ul">
                <slot></slot>
            </ul>
        `);
                this.parentItem = null;
                this.items = [];
                this._activeIndex = -1;
            }
            get activeIndex() {
                return this._activeIndex;
            }
            get activeItem() {
                return this.items[this.activeIndex] || null;
            }
            connectedCallback() {
                var _a;
                this.tabIndex = this.tabIndex;
                const slot = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector("slot");
                if (slot) {
                    slot.addEventListener("slotchange", () => {
                        const items = slot.assignedElements().filter(elem => MenuItem_3.isHTMLEMenuItemElement(elem) || MenuItemGroup_1.isHTMLEMenuItemGroupElement(elem));
                        this.items = items;
                        items.forEach((item) => {
                            item.parentMenu = this;
                        });
                    });
                }
                this.addEventListener("mousedown", (event) => {
                    let target = event.target;
                    if (MenuItem_3.isHTMLEMenuItemElement(target)) {
                        let thisIncludesTarget = this.items.includes(target);
                        if (thisIncludesTarget) {
                            target.trigger();
                        }
                    }
                });
                this.addEventListener("mouseover", (event) => {
                    let target = event.target;
                    let targetIndex = this.items.indexOf(target);
                    if (this === target) {
                        this.reset();
                        this.focus();
                    }
                    else if (targetIndex >= 0) {
                        if (MenuItem_3.isHTMLEMenuItemElement(target)) {
                            this.focusItemAt(targetIndex, true);
                        }
                        else {
                            this._activeIndex = targetIndex;
                        }
                    }
                });
                this.addEventListener("mouseout", (event) => {
                    let target = event.target;
                    let thisIntersectsWithMouse = Snippets_4.pointIntersectsWithDOMRect(event.clientX, event.clientY, this.getBoundingClientRect());
                    if ((this === target || this.items.includes(target)) && !thisIntersectsWithMouse) {
                        this.reset();
                        this.focus();
                    }
                });
                this.addEventListener("focusin", (event) => {
                    let target = event.target;
                    this._activeIndex = this.items.findIndex((item) => item.contains(target));
                    this.expanded = true;
                });
                this.addEventListener("focusout", (event) => {
                    let newTarget = event.relatedTarget;
                    if (!this.contains(newTarget)) {
                        this.reset();
                        this.expanded = false;
                    }
                });
                this.addEventListener("keydown", (event) => {
                    switch (event.key) {
                        case "ArrowUp":
                            this.focusItemAt((this.activeIndex <= 0) ? this.items.length - 1 : this.activeIndex - 1);
                            if (MenuItemGroup_1.isHTMLEMenuItemGroupElement(this.activeItem)) {
                                this.activeItem.focusItemAt(this.activeItem.items.length - 1);
                            }
                            event.stopPropagation();
                            break;
                        case "ArrowDown":
                            this.focusItemAt((this.activeIndex >= this.items.length - 1) ? 0 : this.activeIndex + 1);
                            if (MenuItemGroup_1.isHTMLEMenuItemGroupElement(this.activeItem)) {
                                this.activeItem.focusItemAt(0);
                            }
                            event.stopPropagation();
                            break;
                        case "Home":
                            this.focusItemAt(0);
                            if (MenuItemGroup_1.isHTMLEMenuItemGroupElement(this.activeItem)) {
                                this.activeItem.focusItemAt(0);
                            }
                            event.stopPropagation();
                            break;
                        case "End":
                            this.focusItemAt(this.items.length - 1);
                            if (MenuItemGroup_1.isHTMLEMenuItemGroupElement(this.activeItem)) {
                                this.activeItem.focusItemAt(this.activeItem.items.length - 1);
                            }
                            event.stopPropagation();
                            break;
                        case "Enter":
                            if (MenuItem_3.isHTMLEMenuItemElement(this.activeItem)) {
                                this.activeItem.trigger();
                                event.stopPropagation();
                            }
                            break;
                        case "Escape":
                            this.reset();
                            break;
                        case "ArrowLeft":
                            if (this.parentItem) {
                                let parentGroup = this.parentItem.group;
                                let parentMenu = this.parentItem.parentMenu;
                                if (isHTMLEMenuElement(parentMenu)) {
                                    if (parentGroup) {
                                        parentGroup.focusItemAt(parentGroup.activeIndex);
                                    }
                                    else {
                                        parentMenu.focusItemAt(parentMenu.activeIndex);
                                    }
                                    this.reset();
                                    event.stopPropagation();
                                }
                            }
                            break;
                        case "ArrowRight":
                            if (this.items.includes(event.target)) {
                                if (MenuItem_3.isHTMLEMenuItemElement(this.activeItem) && this.activeItem.childMenu) {
                                    this.activeItem.childMenu.focusItemAt(0);
                                    event.stopPropagation();
                                }
                            }
                            break;
                    }
                });
            }
            attributeChangedCallback(name, oldValue, newValue) {
                if (newValue !== oldValue) {
                    switch (name) {
                        case "expanded":
                            if (newValue != null) {
                                let thisRect = this.getBoundingClientRect();
                                let thisIsOverflowing = thisRect.right > document.body.clientWidth;
                                if (thisIsOverflowing) {
                                    this.overflowing = true;
                                }
                            }
                            else {
                                this.overflowing = false;
                            }
                            break;
                    }
                }
            }
            focusItemAt(index, childMenu) {
                let item = this.items[index];
                if (item) {
                    this._activeIndex = index;
                    item.focus();
                    if (MenuItem_3.isHTMLEMenuItemElement(item)) {
                        if (childMenu && item.childMenu) {
                            item.childMenu.focus();
                        }
                    }
                    else {
                        item.focusItemAt(0);
                    }
                }
            }
            focusItem(predicate, subitems) {
                let item = this.findItem(predicate, subitems);
                if (item) {
                    item.focus();
                }
            }
            reset() {
                let item = this.activeItem;
                this._activeIndex = -1;
                if (MenuItem_3.isHTMLEMenuItemElement(item) && item.childMenu) {
                    item.childMenu.reset();
                }
            }
            findItem(predicate, subitems) {
                let foundItem = null;
                for (let idx = 0; idx < this.items.length; idx++) {
                    let item = this.items[idx];
                    if (MenuItem_3.isHTMLEMenuItemElement(item)) {
                        if (predicate(item)) {
                            return item;
                        }
                        if (subitems && item.childMenu) {
                            foundItem = item.childMenu.findItem(predicate, subitems);
                            if (foundItem) {
                                return foundItem;
                            }
                        }
                    }
                    else if (MenuItemGroup_1.isHTMLEMenuItemGroupElement(item)) {
                        foundItem = item.findItem(predicate, subitems);
                        if (foundItem) {
                            return foundItem;
                        }
                    }
                }
                return foundItem;
            }
        };
        BaseHTMLEMenuElement = __decorate([
            HTMLElement_14.RegisterCustomHTMLElement({
                name: "e-menu",
                observedAttributes: ["expanded"]
            }),
            HTMLElement_14.GenerateAttributeAccessors([
                { name: "name", type: "string" },
                { name: "expanded", type: "boolean" },
                { name: "overflowing", type: "boolean" }
            ])
        ], BaseHTMLEMenuElement);
        return BaseHTMLEMenuElement;
    })();
    exports.BaseHTMLEMenuElement = BaseHTMLEMenuElement;
});
define("engine/editor/elements/lib/containers/tabs/TabPanel", ["require", "exports", "engine/editor/elements/HTMLElement"], function (require, exports, HTMLElement_15) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BaseHTMLETabPanelElement = void 0;
    let BaseHTMLETabPanelElement = /** @class */ (() => {
        let BaseHTMLETabPanelElement = class BaseHTMLETabPanelElement extends HTMLElement {
            constructor() {
                super();
                HTMLElement_15.bindShadowRoot(this, /*template*/ `
            <style>
                :host {
                    display: block;
                }

                :host([hidden]) {
                    display: none;
                }
            </style>
            <slot></slot>
        `);
            }
            connectedCallback() {
                this.tabIndex = this.tabIndex;
                this.dispatchEvent(new CustomEvent("connected"));
            }
        };
        BaseHTMLETabPanelElement = __decorate([
            HTMLElement_15.RegisterCustomHTMLElement({
                name: "e-tabpanel"
            }),
            HTMLElement_15.GenerateAttributeAccessors([
                { name: "name", type: "string" }
            ])
        ], BaseHTMLETabPanelElement);
        return BaseHTMLETabPanelElement;
    })();
    exports.BaseHTMLETabPanelElement = BaseHTMLETabPanelElement;
});
define("engine/editor/elements/lib/containers/tabs/Tab", ["require", "exports", "engine/editor/elements/HTMLElement"], function (require, exports, HTMLElement_16) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BaseHTMLETabElement = exports.isHTMLETabElement = void 0;
    function isHTMLETabElement(obj) {
        return obj instanceof Node && obj.nodeType === obj.ELEMENT_NODE && obj.tagName.toLowerCase() === "e-tab";
    }
    exports.isHTMLETabElement = isHTMLETabElement;
    let BaseHTMLETabElement = /** @class */ (() => {
        let BaseHTMLETabElement = class BaseHTMLETabElement extends HTMLElement {
            constructor() {
                super();
                HTMLElement_16.bindShadowRoot(this, /*template*/ `
            <style>
                :host {
                    display: block;
                    user-select: none;
                    white-space: nowrap;
                    padding: 2px 6px;
                    border-left: 4px solid transparent;
                    cursor: pointer;
                }

                :host([disabled]) {
                    color: grey;
                }

                :host(:hover:not([active])) {
                    font-weight: bold;
                    border-left: 4px solid lightgrey;
                }

                :host([active]) {
                    font-weight: bold;
                    border-left: 4px solid dimgray;
                }
            </style>
            <slot></slot>
        `);
                this.panel = null;
            }
            connectedCallback() {
                this.tabIndex = this.tabIndex;
                this.panel = document.querySelector(`#${this.controls}`);
                if (this.panel !== null) {
                    this.panel.addEventListener("connected", (event) => {
                        let panel = event.target;
                        panel.hidden = !this.active;
                    }, { once: true });
                }
            }
            attributeChangedCallback(name, oldValue, newValue) {
                switch (name) {
                    case "controls":
                        if (oldValue !== newValue) {
                            this.panel = document.querySelector(`#${newValue}`);
                        }
                        break;
                    case "active":
                        if (this.panel) {
                            this.panel.hidden = !this.active;
                        }
                        break;
                }
            }
            show() {
                this.active = true;
            }
            hide() {
                this.active = false;
            }
        };
        BaseHTMLETabElement = __decorate([
            HTMLElement_16.RegisterCustomHTMLElement({
                name: "e-tab",
                observedAttributes: ["active", "controls"]
            }),
            HTMLElement_16.GenerateAttributeAccessors([
                { name: "name", type: "string" },
                { name: "active", type: "boolean" },
                { name: "controls", type: "string" },
            ])
        ], BaseHTMLETabElement);
        return BaseHTMLETabElement;
    })();
    exports.BaseHTMLETabElement = BaseHTMLETabElement;
});
define("engine/editor/elements/lib/containers/tabs/TabList", ["require", "exports", "engine/editor/elements/HTMLElement", "engine/editor/elements/lib/containers/tabs/Tab"], function (require, exports, HTMLElement_17, Tab_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BaseHTMLETabListElement = void 0;
    let BaseHTMLETabListElement = /** @class */ (() => {
        let BaseHTMLETabListElement = class BaseHTMLETabListElement extends HTMLElement {
            constructor() {
                super();
                HTMLElement_17.bindShadowRoot(this, /*template*/ `
            <style>
                :host {
                    display: block;
                }
            </style>
            <slot></slot>
        `);
                this.tabs = [];
                const slot = this.shadowRoot.querySelector("slot");
                slot.addEventListener("slotchange", (event) => {
                    const tabs = event.target.assignedElements().filter(Tab_1.isHTMLETabElement);
                    this.tabs = tabs;
                });
                this.addEventListener("tabchange", ((event) => {
                    this.tabs.forEach((tab) => {
                        if ((event.detail.tab === tab.name)) {
                            tab.show();
                        }
                        else {
                            tab.hide();
                        }
                    });
                }));
                this.addEventListener("click", (event) => {
                    let target = event.target;
                    if (Tab_1.isHTMLETabElement(target)) {
                        this.dispatchEvent(new CustomEvent("tabchange", {
                            detail: {
                                tab: target.name
                            },
                            bubbles: true
                        }));
                    }
                });
            }
            connectedCallback() {
                this.tabIndex = this.tabIndex;
            }
        };
        BaseHTMLETabListElement = __decorate([
            HTMLElement_17.RegisterCustomHTMLElement({
                name: "e-tablist"
            })
        ], BaseHTMLETabListElement);
        return BaseHTMLETabListElement;
    })();
    exports.BaseHTMLETabListElement = BaseHTMLETabListElement;
});
define("engine/editor/objects/StructuredFormData", ["require", "exports", "engine/editor/elements/Snippets"], function (require, exports, Snippets_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.StructuredFormData = void 0;
    class StructuredFormData {
        constructor(form) {
            this.form = form;
        }
        getStructuredFormData() {
            let structuredData = {};
            let formData = new FormData(this.form);
            let keys = Array.from(formData.keys());
            keys.forEach((key) => {
                let value = formData.get(key);
                if (value) {
                    Snippets_5.setPropertyFromPath(structuredData, key, JSON.parse(value.toString()));
                }
            });
            return structuredData;
        }
    }
    exports.StructuredFormData = StructuredFormData;
});
define("engine/editor/templates/other/DraggableInputTemplate", ["require", "exports", "engine/editor/elements/HTMLElement"], function (require, exports, HTMLElement_18) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HTMLDraggableInputTemplate = void 0;
    const HTMLDraggableInputTemplate = (desc) => {
        return HTMLElement_18.HTMLElementConstructor("e-draggable", {
            props: {
                id: desc.id,
                className: desc.className,
                ref: desc.ref,
                type: desc.type
            },
            children: [
                HTMLElement_18.HTMLElementConstructor("input", {
                    props: {
                        name: desc.name,
                        hidden: true
                    },
                    attr: {
                        value: desc.value
                    }
                })
            ]
        });
    };
    exports.HTMLDraggableInputTemplate = HTMLDraggableInputTemplate;
});
define("samples/scenes/Mockup", ["require", "exports", "engine/editor/elements/lib/containers/duplicable/Duplicable", "engine/editor/elements/lib/containers/menus/Menu", "engine/editor/elements/lib/containers/menus/MenuBar", "engine/editor/elements/lib/containers/menus/MenuItem", "engine/editor/elements/lib/containers/menus/MenuItemGroup", "engine/editor/elements/lib/containers/tabs/Tab", "engine/editor/elements/lib/containers/tabs/TabList", "engine/editor/elements/lib/containers/tabs/TabPanel", "engine/editor/elements/lib/controls/draggable/Draggable", "engine/editor/elements/lib/controls/draggable/Dragzone", "engine/editor/elements/lib/controls/draggable/Dropzone", "engine/editor/objects/StructuredFormData", "engine/editor/templates/other/DraggableInputTemplate"], function (require, exports, Duplicable_1, Menu_2, MenuBar_1, MenuItem_4, MenuItemGroup_2, Tab_2, TabList_1, TabPanel_1, Draggable_3, Dragzone_2, Dropzone_1, StructuredFormData_1, DraggableInputTemplate_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.mockup = void 0;
    Tab_2.BaseHTMLETabElement;
    TabList_1.BaseHTMLETabListElement;
    TabPanel_1.BaseHTMLETabPanelElement;
    Draggable_3.BaseHTMLEDraggableElement;
    Dropzone_1.BaseHTMLEDropzoneElement;
    Dragzone_2.BaseHTMLEDragzoneElement;
    MenuBar_1.BaseHTMLEMenuBarElement;
    Menu_2.BaseHTMLEMenuElement;
    MenuItemGroup_2.BaseHTMLEMenuItemGroupElement;
    MenuItem_4.BaseHTMLEMenuItemElement;
    Duplicable_1.HTMLEDuplicableElementBase;
    const body = /*template*/ `
    <link rel="stylesheet" href="../css/mockup.css"/>
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
    <div id="root" class="flex-rows">
        <header class="flex-cols flex-none padded">
            <!--<e-menubar tabindex="0">
                <e-menuitem name="canvas-menu-item" type="menu" label="Canvas" tabindex="-1" aria-label="Canvas">
                    <e-menu slot="menu" tabindex="-1">
                        <e-menuitemgroup tabindex="-1">
                            <e-menuitem name="canvas-play-item" type="button" label="Play" icon="play_arrow" value="play"
                                tabindex="-1" aria-label="Play"></e-menuitem>
                            <e-menuitem name="canvas-pause-item" type="button" label="Pause" icon="pause" value="pause"
                                tabindex="-1" aria-label="Pause"></e-menuitem>
                        </e-menuitemgroup>
                        <e-menuitemgroup tabindex="-1">
                            <e-menuitem name="show-fps-item" type="checkbox" label="Show FPS" icon="60fps" tabindex="-1"
                                aria-label="Show FPS"></e-menuitem>
                        </e-menuitemgroup>
                        <e-menuitemgroup name="submenus" tabindex="-1">
                            <e-menuitem name="letters-menu" type="submenu" label="Letters" tabindex="-1" aria-label="Letters">
                                <e-menu slot="menu" tabindex="-1">
                                    <e-menuitemgroup name="favorite-letter" label="Favorite letter" tabindex="-1">
                                        <e-menuitem name="a-item" type="radio" label="Letter A" value="a" tabindex="-1"
                                            aria-label="Letter A" checked=""></e-menuitem>
                                        <e-menuitem name="b-item" type="radio" label="Letter B" value="b" tabindex="-1"
                                            aria-label="Letter B"></e-menuitem>
                                    </e-menuitemgroup>
                                </e-menu>
                            </e-menuitem>
                        </e-menuitemgroup>
                    </e-menu>
                </e-menuitem>
            </e-menubar>-->
        </header>
        <main class="flex-cols flex-auto padded">
            <div id="tabs-col" class="flex-none">
                <e-tablist id="tablist">
                    <e-tab name="extract" controls="extract-panel">Extract</e-tab>
                    <e-tab name="transform" controls="transform-panel" active>Transform</e-tab>
                    <e-tab name="export" controls="export-panel">Export</e-tab>
                </e-tablist>
            </div>
            <div id="data-col" class="flex-none padded">
                <details class="indented" open>
                    <summary>Dataset 1</summary>
                    <e-dragzone>
                        <e-draggable id="draggableA" tabindex="-1" type="column" ref="D1A">Column A</e-draggable>
                        <e-draggable id="draggableB" tabindex="-1" type="column" ref="D1B">Column B</e-draggable>
                        <e-draggable id="draggableC" tabindex="-1" type="column" ref="D1C">Column C</e-draggable>
                        <e-draggable id="draggableD" tabindex="-1" type="column" ref="D1D">Column D</e-draggable>
                    </e-dragzone>
                </details>
            </div>
            <div id ="panels-col" class="flex-auto padded">
                <e-tabpanel id="extract-panel">
                    <details class="indented" open>
                        <summary>
                            Extractor
                            <!--<select data-class="toggler-select">
                                <option value="aggregate" selected>Transformer</option>
                                <option value="median_imputer">Median imputer</option>
                            </select>-->
                            <select data-class="toggler-select">
                                <option value="netezza" selected>Netezza</option>
                                <option value="csv">CSV</option>
                            </select>
                        </summary>
                        <fieldset id="netezza">
                        </fieldset>
                        <fieldset id="csv">
                            <label for="filepath">Filepath</label><br/>
                            <input name="filepath" type="file"/>
                        </fieldset>
                    </details>

                    <!--<label for="file">Choose a data file</label><br/>
                    <input name="file" type="file"/>-->

                    <!--<e-duplicable>
                        <input slot="input" type="number" value="1" min="0"></input>
                        <div slot="prototype">
                            <label>Item <span data-duplicate-index></span></label>
                            <input type="number"/>
                        </div>
                    </e-duplicable>-->

                </e-tabpanel>
                <e-tabpanel id="transform-panel">
                    <form>
                        <details class="indented" open>
                            <summary>
                                Transformer
                                <select data-class="toggler-select">
                                    <option value="aggregate" selected>Aggregate</option>
                                    <option value="median_imputer">Median imputer</option>
                                </select>
                            </summary>
                            <fieldset id="aggregate">
                                <label>Columns</label><br/>
                                <e-dropzone allowedtypes="*" multiple>
                                    <input slot="input" type="text" name="columns"></input>
                                </e-dropzone>
                            </fieldset>
                            <fieldset id="median_imputer">
                                <label>Median</label>
                                <input name="median" type="number" value="1" min="0" max="100"></input>
                            </fieldset>
                        </details>
                    </form>
                </e-tabpanel>
                <e-tabpanel id="export-panel">
                    <button id="download-btn">Download</button>
                </e-tab-panel>
            </div>
            <div id="doc-col" class="flex-none padded"></div>
        </main>
        <footer class="flex-cols flex-none padded">
        </footer>
    </div>
`;
    async function mockup() {
        const bodyTemplate = document.createElement("template");
        bodyTemplate.innerHTML = body;
        document.body.insertBefore(bodyTemplate.content, document.body.firstChild);
        /*const docCol = document.getElementById("doc-col");
        if (docCol) {
            docCol.innerText = marked('# Marked in the browser\n\nRendered by **marked**.');
        }*/
        const dragA = document.querySelector("e-draggable#draggableA");
        if (dragA) {
            dragA.value = JSON.stringify({
                value: "dragA"
            });
        }
        const dragB = document.querySelector("e-draggable#draggableB");
        if (dragB) {
            dragB.value = JSON.stringify({
                lol: "lol"
            });
        }
        // let columns = await fetch("json/columns.json").then((resp) => {
        //     if (resp.ok) {
        //         return resp.json();
        //     }
        // });
        // columns.forEach((col) => {
        // });
        console.log(DraggableInputTemplate_1.HTMLDraggableInputTemplate({
            id: "draggableD",
            type: "column",
            ref: "D2D",
            name: "D2D",
            value: "Column_D2D"
        }));
        let downloadBtn = document.getElementById("download-btn");
        if (downloadBtn) {
            downloadBtn.addEventListener("click", () => {
                let form = document.querySelector("form");
                if (form) {
                    let structuredFormData = new StructuredFormData_1.StructuredFormData(form).getStructuredFormData();
                    console.log(structuredFormData);
                    return;
                    let dataBlob = new Blob([JSON.stringify(structuredFormData, null, 4)], { type: "application/json" });
                    let donwloadAnchor = document.createElement("a");
                    donwloadAnchor.href = URL.createObjectURL(dataBlob);
                    donwloadAnchor.download = "config.json";
                    donwloadAnchor.click();
                }
            });
        }
    }
    exports.mockup = mockup;
});
define("engine/libs/maths/Snippets", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.floorPowerOfTwo = exports.ceilPowerOfTwo = exports.isPowerOfTwo = exports.radToDeg = exports.degToRad = exports.randFloatSpread = exports.randFloat = exports.randInt = exports.smootherstep = exports.smoothstep = exports.lerp = exports.clamp = exports.inRange = exports.pow2 = exports.qSqrt = exports.rad2Deg = exports.deg2Rad = void 0;
    const DEG2RAD = Math.PI / 180;
    const RAD2DEG = 180 / Math.PI;
    const deg2Rad = function (deg) {
        return DEG2RAD * deg;
    };
    exports.deg2Rad = deg2Rad;
    const rad2Deg = function (rad) {
        return RAD2DEG / rad;
    };
    exports.rad2Deg = rad2Deg;
    const _bytes = new ArrayBuffer(Float32Array.BYTES_PER_ELEMENT);
    const _floatView = new Float32Array(_bytes);
    const _intView = new Uint32Array(_bytes);
    const qSqrt = function (x) {
        const halfx = x * 0.5;
        _floatView[0] = x;
        _intView[0] = 0x5f3759df - (_intView[0] >> 1);
        let y = _floatView[0];
        y = y * (1.5 - (halfx * y * y));
        return y;
    };
    exports.qSqrt = qSqrt;
    const pow2 = function (k) {
        return 1 << k;
    };
    exports.pow2 = pow2;
    const inRange = function (x, min, max) {
        return (min <= x) && (x <= max);
    };
    exports.inRange = inRange;
    const clamp = function (value, min, max) {
        return Math.max(min, Math.min(max, value));
    };
    exports.clamp = clamp;
    const lerp = function (x, y, t) {
        return (1 - t) * x + t * y;
    };
    exports.lerp = lerp;
    const smoothstep = function (x, min, max) {
        if (x <= min)
            return 0;
        if (x >= max)
            return 1;
        x = (x - min) / (max - min);
        return x * x * (3 - 2 * x);
    };
    exports.smoothstep = smoothstep;
    const smootherstep = function (x, min, max) {
        if (x <= min)
            return 0;
        if (x >= max)
            return 1;
        x = (x - min) / (max - min);
        return x * x * x * (x * (x * 6 - 15) + 10);
    };
    exports.smootherstep = smootherstep;
    const randInt = function (low, high) {
        return low + Math.floor(Math.random() * (high - low + 1));
    };
    exports.randInt = randInt;
    const randFloat = function (low, high) {
        return low + Math.random() * (high - low);
    };
    exports.randFloat = randFloat;
    const randFloatSpread = function (range) {
        return range * (0.5 - Math.random());
    };
    exports.randFloatSpread = randFloatSpread;
    const degToRad = function (degrees) {
        return degrees * DEG2RAD;
    };
    exports.degToRad = degToRad;
    const radToDeg = function (radians) {
        return radians * RAD2DEG;
    };
    exports.radToDeg = radToDeg;
    const isPowerOfTwo = function (value) {
        return (value & (value - 1)) === 0 && value !== 0;
    };
    exports.isPowerOfTwo = isPowerOfTwo;
    const ceilPowerOfTwo = function (value) {
        return Math.pow(2, Math.ceil(Math.log(value) / Math.LN2));
    };
    exports.ceilPowerOfTwo = ceilPowerOfTwo;
    const floorPowerOfTwo = function (value) {
        return Math.pow(2, Math.floor(Math.log(value) / Math.LN2));
    };
    exports.floorPowerOfTwo = floorPowerOfTwo;
});
define("engine/libs/maths/algebra/vectors/Vector3", ["require", "exports", "engine/libs/maths/MathError", "engine/libs/patterns/injectors/Injector"], function (require, exports, MathError_2, Injector_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Vector3Injector = exports.Vector3Base = exports.Vector3 = void 0;
    class Vector3Base {
        constructor(values) {
            this._array = (values) ? [
                values[0], values[1], values[2]
            ] : [0, 0, 0];
        }
        get array() {
            return this._array;
        }
        get values() {
            return [
                this._array[0],
                this._array[1],
                this._array[2]
            ];
        }
        set values(values) {
            this._array[0] = values[0];
            this._array[1] = values[1];
            this._array[2] = values[2];
        }
        get x() {
            return this._array[0];
        }
        set x(x) {
            this._array[0] = x;
        }
        get y() {
            return this._array[1];
        }
        set y(y) {
            this._array[1] = y;
        }
        get z() {
            return this._array[2];
        }
        set z(z) {
            this._array[2] = z;
        }
        setArray(array) {
            if (array.length < 3) {
                throw new MathError_2.MathError(`Array must be of length 3 at least.`);
            }
            this._array = array;
            return this;
        }
        setValues(v) {
            const o = this._array;
            o[0] = v[0];
            o[1] = v[1];
            o[2] = v[2];
            return this;
        }
        copy(vec) {
            const o = this._array;
            const v = vec.array;
            o[0] = v[0];
            o[1] = v[1];
            o[2] = v[2];
            return this;
        }
        clone() {
            return new Vector3Base(this.values);
        }
        equals(vec) {
            const o = this._array;
            const v = vec.array;
            return v[0] === o[0]
                && v[1] === o[1]
                && v[2] === o[2];
        }
        setZeros() {
            const o = this._array;
            o[0] = 0;
            o[1] = 0;
            o[2] = 0;
            return this;
        }
        add(vec) {
            const o = this._array;
            const v = vec.array;
            o[0] = o[0] + v[0];
            o[1] = o[1] + v[1];
            o[2] = o[2] + v[2];
            return this;
        }
        addScalar(k) {
            const o = this._array;
            o[0] = o[0] + k;
            o[1] = o[1] + k;
            o[2] = o[2] + k;
            return this;
        }
        sub(vec) {
            const o = this._array;
            const v = vec.array;
            o[0] = o[0] - v[0];
            o[1] = o[1] - v[1];
            o[2] = o[2] - v[2];
            return this;
        }
        lerp(vec, t) {
            const o = this._array;
            const v = vec.array;
            o[0] = t * (v[0] - o[0]);
            o[1] = t * (v[1] - o[1]);
            o[2] = t * (v[2] - o[2]);
            return this;
        }
        max(vecB) {
            const o = this._array;
            const b = vecB.array;
            o[0] = Math.max(o[0], b[0]);
            o[1] = Math.max(o[1], b[1]);
            o[2] = Math.max(o[2], b[2]);
            return this;
        }
        min(vecB) {
            const o = this._array;
            const b = vecB.array;
            o[0] = Math.min(o[0], b[0]);
            o[1] = Math.min(o[1], b[1]);
            o[2] = Math.min(o[2], b[2]);
            return this;
        }
        clamp(min, max) {
            const o = this._array;
            const l = min.array;
            const g = max.array;
            o[0] = Math.min(g[0], Math.max(o[0], l[0]));
            o[1] = Math.min(g[1], Math.max(o[1], l[1]));
            o[2] = Math.min(g[2], Math.max(o[2], l[2]));
            return this;
        }
        multScalar(k) {
            const o = this._array;
            o[0] = o[0] * k;
            o[1] = o[1] * k;
            o[2] = o[2] * k;
            return this;
        }
        cross(vec) {
            const o = this._array;
            const v = vec.array;
            const t0 = o[1] * v[2] - o[2] * v[1];
            const t1 = o[2] * v[0] - o[0] * v[2];
            const t2 = o[0] * v[1] - o[1] * v[0];
            o[0] = t0;
            o[1] = t1;
            o[2] = t2;
            return this;
        }
        dot(vec) {
            const a = this._array;
            const b = vec.array;
            return (a[0] * b[0]) + (a[1] * b[1]) + (a[2] * b[2]);
        }
        len() {
            const a = this._array;
            return Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2]);
        }
        lenSq() {
            const a = this._array;
            return a[0] * a[0] + a[1] * a[1] + a[2] * a[2];
        }
        dist(vec) {
            const a = this._array;
            const b = vec.array;
            const dx = a[0] - b[0];
            const dy = a[1] - b[1];
            const dz = a[2] - b[2];
            return Math.sqrt(dx * dx + dy * dy + dz * dz);
        }
        distSq(vec) {
            const a = this._array;
            const b = vec.array;
            const dx = a[0] - b[0];
            const dy = a[1] - b[1];
            const dz = a[2] - b[2];
            return dx * dx + dy * dy + dz * dz;
        }
        normalize() {
            const o = this._array;
            const len = this.len();
            if (len > Number.EPSILON) {
                o[0] = o[0] / len;
                o[1] = o[1] / len;
                o[2] = o[2] / len;
            }
            else {
                o[0] = 0;
                o[1] = 0;
                o[2] = 0;
            }
            return this;
        }
        negate() {
            const o = this._array;
            o[0] = -o[0];
            o[1] = -o[1];
            o[2] = -o[2];
            return this;
        }
        mult(vec) {
            const o = this._array;
            const v = vec.array;
            o[0] = o[0] * v[0];
            o[1] = o[1] * v[1];
            o[2] = o[2] * v[2];
            return this;
        }
        writeIntoArray(out, offset = 0) {
            const v = this._array;
            out[offset] = v[0];
            out[offset + 1] = v[1];
            out[offset + 2] = v[2];
        }
        readFromArray(arr, offset = 0) {
            const o = this._array;
            o[0] = arr[offset];
            o[1] = arr[offset + 1];
            o[2] = arr[offset + 2];
            return this;
        }
        addScaled(vec, k) {
            const o = this._array;
            const v = vec.array;
            o[0] = o[0] + v[0] * k;
            o[1] = o[1] + v[1] * k;
            o[2] = o[2] + v[2] * k;
            return this;
        }
        copyAndSub(vecA, vecB) {
            const o = this._array;
            const a = vecA.array;
            const b = vecB.array;
            o[0] = a[0] - b[0];
            o[1] = a[1] - b[1];
            o[2] = a[2] - b[2];
            return this;
        }
        copyAndCross(vecA, vecB) {
            const o = this._array;
            const a = vecA.array;
            const b = vecB.array;
            const t0 = a[1] * b[2] - a[2] * b[1];
            const t1 = a[2] * b[0] - a[0] * b[2];
            const t2 = a[0] * b[1] - a[1] * b[0];
            o[0] = t0;
            o[1] = t1;
            o[2] = t2;
            return this;
        }
    }
    exports.Vector3Base = Vector3Base;
    var Vector3 = Vector3Base;
    exports.Vector3 = Vector3;
    const Vector3Injector = new Injector_2.Injector({
        defaultCtor: Vector3Base,
        onDefaultOverride: (ctor) => {
            exports.Vector3 = Vector3 = ctor;
        }
    });
    exports.Vector3Injector = Vector3Injector;
});
define("engine/libs/maths/algebra/matrices/Matrix3", ["require", "exports", "engine/libs/patterns/injectors/Injector", "engine/libs/maths/MathError"], function (require, exports, Injector_3, MathError_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Matrix3Base = exports.Matrix3Injector = exports.Matrix3 = void 0;
    class Matrix3Base {
        constructor(values) {
            this._array = (values) ? [
                values[0], values[1], values[2],
                values[3], values[4], values[5],
                values[6], values[7], values[8]
            ] : [
                0, 0, 0,
                0, 0, 0,
                0, 0, 0
            ];
        }
        get array() {
            return this._array;
        }
        get values() {
            return [
                this._array[0], this._array[1], this._array[2],
                this._array[3], this._array[4], this._array[5],
                this._array[6], this._array[7], this._array[8]
            ];
        }
        set values(values) {
            this._array[0] = values[0];
            this._array[1] = values[1];
            this._array[2] = values[2];
            this._array[3] = values[3];
            this._array[4] = values[4];
            this._array[5] = values[5];
            this._array[6] = values[6];
            this._array[7] = values[7];
            this._array[8] = values[8];
        }
        get row1() {
            return [
                this._array[0],
                this._array[1],
                this._array[2]
            ];
        }
        set row1(row1) {
            this._array[0] = row1[0];
            this._array[1] = row1[1];
            this._array[2] = row1[2];
        }
        get row2() {
            return [
                this._array[3],
                this._array[4],
                this._array[5]
            ];
        }
        set row2(row2) {
            this._array[3] = row2[0];
            this._array[4] = row2[1];
            this._array[5] = row2[2];
        }
        get row3() {
            return [
                this._array[6],
                this._array[7],
                this._array[8]
            ];
        }
        set row3(row3) {
            this._array[6] = row3[0];
            this._array[7] = row3[1];
            this._array[8] = row3[2];
        }
        get col1() {
            return [
                this._array[0],
                this._array[3],
                this._array[6]
            ];
        }
        set col1(col1) {
            this._array[0] = col1[0];
            this._array[3] = col1[1];
            this._array[6] = col1[2];
        }
        get col2() {
            return [
                this._array[1],
                this._array[4],
                this._array[7]
            ];
        }
        set col2(col2) {
            this._array[1] = col2[0];
            this._array[4] = col2[1];
            this._array[7] = col2[2];
        }
        get col3() {
            return [
                this._array[2],
                this._array[5],
                this._array[8]
            ];
        }
        set col3(col3) {
            this._array[2] = col3[0];
            this._array[5] = col3[1];
            this._array[8] = col3[2];
        }
        get m11() {
            return this._array[0];
        }
        set m11(m11) {
            this._array[0] = m11;
        }
        get m12() {
            return this._array[1];
        }
        set m12(m12) {
            this._array[1] = m12;
        }
        get m13() {
            return this._array[2];
        }
        set m13(m13) {
            this._array[2] = m13;
        }
        get m21() {
            return this._array[4];
        }
        set m21(m21) {
            this._array[4] = m21;
        }
        get m22() {
            return this._array[5];
        }
        set m22(m22) {
            this._array[5] = m22;
        }
        get m23() {
            return this._array[6];
        }
        set m23(m23) {
            this._array[6] = m23;
        }
        get m31() {
            return this._array[8];
        }
        set m31(m31) {
            this._array[8] = m31;
        }
        get m32() {
            return this._array[9];
        }
        set m32(m32) {
            this._array[9] = m32;
        }
        get m33() {
            return this._array[10];
        }
        set m33(m33) {
            this._array[10] = m33;
        }
        setArray(array) {
            if (array.length < 16) {
                throw new MathError_3.MathError(`Array must be of length 16 at least.`);
            }
            this._array = array;
            return this;
        }
        setValues(m) {
            const o = this._array;
            o[0] = m[0];
            o[1] = m[1];
            o[2] = m[2];
            o[3] = m[3];
            o[4] = m[4];
            o[5] = m[5];
            o[6] = m[6];
            o[7] = m[7];
            o[8] = m[8];
            return this;
        }
        getRow(idx) {
            const m = this._array;
            const offset = idx * 3;
            return [
                m[offset],
                m[offset + 1],
                m[offset + 2]
            ];
        }
        setRow(idx, row) {
            const o = this._array;
            const offset = idx * 3;
            o[offset] = row[0];
            o[offset + 1] = row[1];
            o[offset + 2] = row[2];
            return this;
        }
        setCol(idx, col) {
            const o = this._array;
            o[idx] = col[0];
            o[3 + idx] = col[1];
            o[6 + idx] = col[2];
            return this;
        }
        getCol(idx) {
            const m = this._array;
            return [
                m[idx],
                m[3 + idx],
                m[6 + idx]
            ];
        }
        getAt(idx) {
            return this._array[idx];
        }
        setAt(idx, val) {
            this._array[idx] = val;
            return this;
        }
        getEntry(row, col) {
            return this._array[3 * row + col];
        }
        setEntry(row, col, val) {
            this._array[3 * row + col] = val;
            return this;
        }
        equals(mat) {
            const o = this._array;
            const m = mat.array;
            return o[0] === m[0]
                && o[1] === m[1]
                && o[2] === m[2]
                && o[3] === m[3]
                && o[4] === m[4]
                && o[5] === m[5]
                && o[6] === m[6]
                && o[7] === m[7]
                && o[8] === m[8];
        }
        copy(mat) {
            const o = this._array;
            const m = mat.array;
            o[0] = m[0];
            o[1] = m[1];
            o[2] = m[2];
            o[3] = m[3];
            o[4] = m[4];
            o[5] = m[5];
            o[6] = m[6];
            o[7] = m[7];
            o[8] = m[8];
            return this;
        }
        clone() {
            return new Matrix3Base(this.values);
        }
        setIdentity() {
            const o = this._array;
            o[0] = 1;
            o[1] = 0;
            o[2] = 0;
            o[3] = 0;
            o[4] = 1;
            o[5] = 0;
            o[6] = 0;
            o[7] = 0;
            o[8] = 1;
            return this;
        }
        setZeros() {
            const o = this._array;
            o[0] = 0;
            o[1] = 0;
            o[2] = 0;
            o[3] = 0;
            o[4] = 0;
            o[5] = 0;
            o[6] = 0;
            o[7] = 0;
            o[8] = 0;
            return this;
        }
        det() {
            const o = this._array;
            const x = o[0] * ((o[4] * o[8]) - (o[5] * o[7]));
            const y = o[1] * ((o[3] * o[8]) - (o[5] * o[6]));
            const z = o[2] * ((o[3] * o[7]) - (o[4] * o[6]));
            return x - y + z;
        }
        trace() {
            const o = this._array;
            return o[0] + o[4] + o[8];
        }
        negate() {
            const o = this._array;
            o[0] = -o[0];
            o[1] = -o[1];
            o[2] = -o[2];
            o[3] = -o[3];
            o[4] = -o[4];
            o[5] = -o[5];
            o[6] = -o[6];
            o[7] = -o[7];
            o[8] = -o[8];
            return this;
        }
        transpose() {
            const o = this._array;
            let t;
            t = o[1];
            o[1] = o[3];
            o[3] = t;
            t = o[2];
            o[2] = o[6];
            o[6] = t;
            t = o[5];
            o[5] = o[7];
            o[7] = t;
            return this;
        }
        invert() {
            const o = this._array;
            const t11 = o[1 * 3 + 1] * o[2 * 3 + 2] - o[1 * 3 + 2] * o[2 * 3 + 1];
            const t12 = o[0 * 3 + 1] * o[2 * 3 + 2] - o[0 * 3 + 2] * o[2 * 3 + 1];
            const t13 = o[0 * 3 + 1] * o[1 * 3 + 2] - o[0 * 3 + 2] * o[1 * 3 + 1];
            const t21 = o[1 * 3 + 0] * o[2 * 3 + 2] - o[1 * 3 + 2] * o[2 * 3 + 0];
            const t22 = o[0 * 3 + 0] * o[2 * 3 + 2] - o[0 * 3 + 2] * o[2 * 3 + 0];
            const t23 = o[0 * 3 + 0] * o[1 * 3 + 2] - o[0 * 3 + 2] * o[1 * 3 + 0];
            const t31 = o[1 * 3 + 0] * o[2 * 3 + 1] - o[1 * 3 + 1] * o[2 * 3 + 0];
            const t32 = o[0 * 3 + 0] * o[2 * 3 + 1] - o[0 * 3 + 1] * o[2 * 3 + 0];
            const t33 = o[0 * 3 + 0] * o[1 * 3 + 1] - o[0 * 3 + 1] * o[1 * 3 + 0];
            const d = 1.0 / (o[0 * 3 + 0] * t11 - o[1 * 3 + 0] * t12 + o[2 * 3 + 0] * t13);
            if (d == 0) {
                throw new MathError_3.MathError(`Matrix is not invertible.`);
            }
            o[0] = d * t11;
            o[1] = -d * t12;
            o[2] = d * t13;
            o[3] = -d * t21;
            o[4] = d * t22;
            o[5] = -d * t23;
            o[6] = d * t31;
            o[7] = -d * t32;
            o[8] = d * t33;
            return this;
        }
        add(mat) {
            const o = this._array;
            const m = mat.array;
            o[0] = o[0] + m[0];
            o[1] = o[1] + m[1];
            o[2] = o[2] + m[2];
            o[3] = o[3] + m[3];
            o[4] = o[4] + m[4];
            o[5] = o[5] + m[5];
            o[6] = o[6] + m[6];
            o[7] = o[7] + m[7];
            o[8] = o[8] + m[8];
            return this;
        }
        sub(mat) {
            const o = this._array;
            const m = mat._array;
            o[0] = o[0] - m[0];
            o[1] = o[1] - m[1];
            o[2] = o[2] - m[2];
            o[3] = o[3] - m[3];
            o[4] = o[4] - m[4];
            o[5] = o[5] - m[5];
            o[6] = o[6] - m[6];
            o[7] = o[7] - m[7];
            o[8] = o[8] - m[8];
            return this;
        }
        mult(mat) {
            const o = this._array;
            const m = mat.array;
            const a11 = o[0 * 3 + 0];
            const a12 = o[0 * 3 + 1];
            const a13 = o[0 * 3 + 2];
            const a21 = o[1 * 3 + 0];
            const a22 = o[1 * 3 + 1];
            const a23 = o[1 * 3 + 2];
            const a31 = o[2 * 3 + 0];
            const a32 = o[2 * 3 + 1];
            const a33 = o[2 * 3 + 2];
            const b11 = m[0 * 3 + 0];
            const b12 = m[0 * 3 + 1];
            const b13 = m[0 * 3 + 2];
            const b21 = m[1 * 3 + 0];
            const b22 = m[1 * 3 + 1];
            const b23 = m[1 * 3 + 2];
            const b31 = m[2 * 3 + 0];
            const b32 = m[2 * 3 + 1];
            const b33 = m[2 * 3 + 2];
            o[0] = b11 * a11 + b12 * a21 + b13 * a31;
            o[1] = b11 * a12 + b12 * a22 + b13 * a32;
            o[2] = b11 * a13 + b12 * a23 + b13 * a33;
            o[3] = b21 * a11 + b22 * a21 + b23 * a31;
            o[4] = b21 * a12 + b22 * a22 + b23 * a32;
            o[5] = b21 * a13 + b22 * a23 + b23 * a33;
            o[6] = b31 * a11 + b32 * a21 + b33 * a31;
            o[7] = b31 * a12 + b32 * a22 + b33 * a32;
            o[8] = b31 * a13 + b32 * a23 + b33 * a33;
            return this;
        }
        multScalar(k) {
            const o = this._array;
            o[0] = o[0] * k;
            o[1] = o[1] * k;
            o[2] = o[2] * k;
            o[3] = o[3] * k;
            o[4] = o[4] * k;
            o[5] = o[5] * k;
            o[6] = o[6] * k;
            o[7] = o[7] * k;
            o[8] = o[8] * k;
            return this;
        }
        writeIntoArray(out, offset = 0) {
            const m = this._array;
            out[offset] = m[0];
            out[offset + 1] = m[1];
            out[offset + 2] = m[2];
            out[offset + 3] = m[3];
            out[offset + 4] = m[4];
            out[offset + 5] = m[5];
            out[offset + 6] = m[6];
            out[offset + 7] = m[7];
            out[offset + 8] = m[8];
        }
        readFromArray(arr, offset = 0) {
            const o = this._array;
            o[0] = arr[offset];
            o[1] = arr[offset + 1];
            o[2] = arr[offset + 2];
            o[3] = arr[offset + 3];
            o[4] = arr[offset + 4];
            o[5] = arr[offset + 5];
            o[6] = arr[offset + 6];
            o[7] = arr[offset + 7];
            o[8] = arr[offset + 8];
        }
        solve(vecB) {
            const a = this._array;
            const a11 = a[0];
            const a12 = a[1];
            const a13 = a[2];
            const a21 = a[3];
            const a22 = a[4];
            const a23 = a[5];
            const a31 = a[6];
            const a32 = a[7];
            const a33 = a[8];
            const bx = vecB.x - a[12];
            const by = vecB.y - a[13];
            const bz = vecB.z - a[14];
            let rx = a22 * a33 - a23 * a32;
            let ry = a23 * a31 - a21 * a33;
            let rz = a21 * a32 - a22 * a31;
            let det = a11 * rx + a12 * ry + a13 * rz;
            if (det != 0.0) {
                det = 1.0 / det;
            }
            const x = det * (bx * rx + by * ry + bz * rz);
            rx = -(a32 * bz - a33 * by);
            ry = -(a33 * bx - a31 * bz);
            rz = -(a31 * by - a32 * bx);
            const y = det * (a11 * rx + a12 * ry + a13 * rz);
            rx = -(by * a23 - bz * a22);
            ry = -(bz * a21 - bx * a23);
            rz = -(bx * a22 - by * a21);
            const z = det * (a11 * rx + a12 * ry + a13 * rz);
            return [
                x, y, z
            ];
        }
        solve2(vecB) {
            const a = this._array;
            const a11 = a[0];
            const a12 = a[1];
            const a21 = a[3];
            const a22 = a[4];
            const bx = vecB.x - a[4];
            const by = vecB.y - a[7];
            let det = a11 * a22 - a12 * a21;
            if (det != 0.0) {
                det = 1.0 / det;
            }
            const x = det * (a22 * bx - a12 * by);
            const y = det * (a11 * by - a21 * bx);
            return [
                x, y
            ];
        }
    }
    exports.Matrix3Base = Matrix3Base;
    var Matrix3 = Matrix3Base;
    exports.Matrix3 = Matrix3;
    const Matrix3Injector = new Injector_3.Injector({
        defaultCtor: Matrix3Base,
        onDefaultOverride: (ctor) => {
            exports.Matrix3 = Matrix3 = ctor;
        }
    });
    exports.Matrix3Injector = Matrix3Injector;
});
define("engine/libs/maths/algebra/vectors/Vector4", ["require", "exports", "engine/libs/maths/MathError", "engine/libs/patterns/injectors/Injector"], function (require, exports, MathError_4, Injector_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Vector4Base = exports.Vector4Injector = exports.Vector4 = void 0;
    class Vector4Base {
        constructor(values) {
            this._array = (values) ? [
                values[0], values[1], values[2], values[3]
            ] : [0, 0, 0, 0];
        }
        get array() {
            return this._array;
        }
        get values() {
            return [
                this._array[0],
                this._array[1],
                this._array[2],
                this._array[3]
            ];
        }
        set values(values) {
            this._array[0] = values[0];
            this._array[1] = values[1];
            this._array[2] = values[2];
            this._array[3] = values[3];
        }
        get x() {
            return this._array[0];
        }
        set x(x) {
            this._array[0] = x;
        }
        get y() {
            return this._array[1];
        }
        set y(y) {
            this._array[1] = y;
        }
        get z() {
            return this._array[2];
        }
        set z(z) {
            this._array[2] = z;
        }
        get w() {
            return this._array[3];
        }
        set w(w) {
            this._array[3] = w;
        }
        setArray(array) {
            if (array.length < 4) {
                throw new MathError_4.MathError(`Array must be of length 4 at least.`);
            }
            this._array = array;
            return this;
        }
        setValues(v) {
            const o = this._array;
            o[0] = v[0];
            o[1] = v[1];
            o[2] = v[2];
            o[3] = v[3];
            return this;
        }
        copy(vec) {
            const o = this._array;
            const v = vec.array;
            o[0] = v[0];
            o[1] = v[1];
            o[2] = v[2];
            o[3] = v[3];
            return this;
        }
        clone() {
            return new Vector4Base(this.values);
        }
        equals(vec) {
            const o = this._array;
            const v = vec.array;
            return v[0] === o[0]
                && v[1] === o[1]
                && v[2] === o[2]
                && v[3] === o[3];
        }
        setZeros() {
            const o = this._array;
            o[0] = 0;
            o[1] = 0;
            o[2] = 0;
            o[3] = 0;
            return this;
        }
        add(vec) {
            const o = this._array;
            const v = vec.array;
            o[0] = o[0] + v[0];
            o[1] = o[1] + v[1];
            o[2] = o[2] + v[2];
            o[3] = o[3] + v[3];
            return this;
        }
        addScalar(k) {
            const o = this._array;
            o[0] = o[0] + k;
            o[1] = o[1] + k;
            o[2] = o[2] + k;
            o[3] = o[3] + k;
            return this;
        }
        sub(vec) {
            const v = vec.array;
            const o = this._array;
            o[0] = o[0] - v[0];
            o[1] = o[1] - v[1];
            o[2] = o[2] - v[2];
            o[3] = o[3] - v[3];
            return this;
        }
        lerp(vec, t) {
            const o = this._array;
            const v = vec.array;
            o[0] = t * (v[0] - o[0]);
            o[1] = t * (v[1] - o[1]);
            o[2] = t * (v[2] - o[2]);
            o[3] = t * (v[3] - o[3]);
            return this;
        }
        clamp(min, max) {
            const o = this._array;
            const l = min.array;
            const g = max.array;
            o[0] = Math.min(g[0], Math.max(l[0], o[0]));
            o[1] = Math.min(g[1], Math.max(l[0], o[1]));
            o[2] = Math.min(g[2], Math.max(l[0], o[2]));
            o[3] = Math.min(g[3], Math.max(l[0], o[3]));
            return this;
        }
        multScalar(k) {
            const o = this._array;
            o[0] = o[0] * k;
            o[1] = o[1] * k;
            o[2] = o[2] * k;
            o[3] = o[3] * k;
            return this;
        }
        dot(vec) {
            const a = this._array;
            const b = vec.array;
            return (a[0] * b[0]) + (a[1] * b[1]) + (a[2] * b[2]) + (a[3] * b[3]);
        }
        len() {
            const v = this._array;
            return Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2] + v[3] * v[3]);
        }
        lenSq() {
            const v = this._array;
            return v[0] * v[0] + v[1] * v[1] + v[2] * v[2] + v[3] * v[3];
        }
        dist(vec) {
            const a = this._array;
            const b = vec.array;
            const dx = a[0] - b[0];
            const dy = a[1] - b[1];
            const dz = a[2] - b[2];
            const dw = a[3] - b[3];
            return Math.sqrt(dx * dx + dy * dy + dz * dz + dw * dw);
        }
        distSq(vec) {
            const a = this._array;
            const b = vec.array;
            const dx = a[0] - b[0];
            const dy = a[1] - b[1];
            const dz = a[2] - b[2];
            const dw = a[3] - b[3];
            return dx * dx + dy * dy + dz * dz + dw * dw;
        }
        normalize() {
            const o = this._array;
            const lenSq = o[0] * o[0] + o[1] * o[1] + o[2] * o[2] + o[3] * o[3];
            const len = Math.sqrt(lenSq);
            if (len > Number.EPSILON) {
                o[0] = o[0] / len;
                o[1] = o[1] / len;
                o[2] = o[2] / len;
                o[3] = o[3] / len;
            }
            else {
                o[0] = 0;
                o[1] = 0;
                o[2] = 0;
                o[3] = 0;
            }
            return this;
        }
        negate() {
            const o = this._array;
            o[0] = -o[0];
            o[1] = -o[1];
            o[2] = -o[2];
            o[3] = -o[3];
            return this;
        }
        mult(vec) {
            const o = this._array;
            const v = vec.array;
            o[0] = o[0] * v[0];
            o[1] = o[1] * v[1];
            o[2] = o[2] * v[2];
            o[3] = o[3] * v[3];
            return this;
        }
        addScaled(vec, k) {
            const v = vec.array;
            const o = this._array;
            o[0] = o[0] + v[0] * k;
            o[1] = o[1] + v[1] * k;
            o[2] = o[2] + v[2] * k;
            o[3] = o[3] + v[3] * k;
            return this;
        }
        writeIntoArray(out, offset = 0) {
            const v = this._array;
            out[offset] = v[0];
            out[offset + 1] = v[1];
            out[offset + 2] = v[2];
            out[offset + 3] = v[3];
        }
        readFromArray(arr, offset = 0) {
            const o = this._array;
            o[0] = arr[offset];
            o[1] = arr[offset + 1];
            o[2] = arr[offset + 2];
            o[3] = arr[offset + 3];
            return this;
        }
    }
    exports.Vector4Base = Vector4Base;
    var Vector4 = Vector4Base;
    exports.Vector4 = Vector4;
    const Vector4Injector = new Injector_4.Injector({
        defaultCtor: Vector4Base,
        onDefaultOverride: (ctor) => {
            exports.Vector4 = Vector4 = ctor;
        }
    });
    exports.Vector4Injector = Vector4Injector;
});
define("engine/libs/maths/algebra/matrices/Matrix4", ["require", "exports", "engine/libs/patterns/injectors/Injector", "engine/libs/maths/MathError"], function (require, exports, Injector_5, MathError_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Matrix4Base = exports.Matrix4Injector = exports.Matrix4 = void 0;
    class Matrix4Base {
        constructor(values) {
            this._array = (values) ? [
                values[0], values[1], values[2], values[3],
                values[4], values[5], values[6], values[7],
                values[8], values[9], values[10], values[11],
                values[12], values[13], values[14], values[15]
            ] : [
                0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0
            ];
        }
        get array() {
            return this._array;
        }
        get values() {
            return [
                this._array[0], this._array[1], this._array[2], this._array[3],
                this._array[4], this._array[5], this._array[6], this._array[7],
                this._array[8], this._array[9], this._array[10], this._array[11],
                this._array[12], this._array[13], this._array[14], this._array[15]
            ];
        }
        set values(values) {
            this._array[0] = values[0];
            this._array[1] = values[1];
            this._array[2] = values[2];
            this._array[3] = values[3];
            this._array[4] = values[4];
            this._array[5] = values[5];
            this._array[6] = values[6];
            this._array[7] = values[7];
            this._array[8] = values[8];
            this._array[9] = values[9];
            this._array[10] = values[10];
            this._array[11] = values[11];
            this._array[12] = values[12];
            this._array[13] = values[13];
            this._array[14] = values[14];
            this._array[15] = values[15];
        }
        get row1() {
            return [
                this._array[0],
                this._array[1],
                this._array[2],
                this._array[3]
            ];
        }
        set row1(row1) {
            this._array[0] = row1[0];
            this._array[1] = row1[1];
            this._array[2] = row1[2];
            this._array[3] = row1[3];
        }
        get row2() {
            return [
                this._array[4],
                this._array[5],
                this._array[6],
                this._array[7]
            ];
        }
        set row2(row2) {
            this._array[4] = row2[0];
            this._array[5] = row2[1];
            this._array[6] = row2[2];
            this._array[7] = row2[3];
        }
        get row3() {
            return [
                this._array[8],
                this._array[9],
                this._array[10],
                this._array[11]
            ];
        }
        set row3(row3) {
            this._array[8] = row3[0];
            this._array[9] = row3[1];
            this._array[10] = row3[2];
            this._array[11] = row3[3];
        }
        get row4() {
            return [
                this._array[12],
                this._array[13],
                this._array[14],
                this._array[15]
            ];
        }
        set row4(row4) {
            this._array[12] = row4[0];
            this._array[13] = row4[1];
            this._array[14] = row4[2];
            this._array[15] = row4[3];
        }
        get col1() {
            return [
                this._array[0],
                this._array[4],
                this._array[8],
                this._array[12]
            ];
        }
        set col1(col1) {
            this._array[0] = col1[0];
            this._array[4] = col1[1];
            this._array[8] = col1[2];
            this._array[12] = col1[3];
        }
        get col2() {
            return [
                this._array[1],
                this._array[5],
                this._array[9],
                this._array[13]
            ];
        }
        set col2(col2) {
            this._array[1] = col2[0];
            this._array[5] = col2[1];
            this._array[9] = col2[2];
            this._array[13] = col2[3];
        }
        get col3() {
            return [
                this._array[2],
                this._array[6],
                this._array[10],
                this._array[14]
            ];
        }
        set col3(col3) {
            this._array[2] = col3[0];
            this._array[6] = col3[1];
            this._array[10] = col3[2];
            this._array[14] = col3[3];
        }
        get col4() {
            return [
                this._array[3],
                this._array[7],
                this._array[11],
                this._array[15]
            ];
        }
        set col4(col4) {
            this._array[3] = col4[0];
            this._array[7] = col4[1];
            this._array[11] = col4[2];
            this._array[15] = col4[3];
        }
        get m11() {
            return this._array[0];
        }
        set m11(m11) {
            this._array[0] = m11;
        }
        get m12() {
            return this._array[1];
        }
        set m12(m12) {
            this._array[1] = m12;
        }
        get m13() {
            return this._array[2];
        }
        set m13(m13) {
            this._array[2] = m13;
        }
        get m14() {
            return this._array[3];
        }
        set m14(m14) {
            this._array[3] = m14;
        }
        get m21() {
            return this._array[4];
        }
        set m21(m21) {
            this._array[4] = m21;
        }
        get m22() {
            return this._array[5];
        }
        set m22(m22) {
            this._array[5] = m22;
        }
        get m23() {
            return this._array[6];
        }
        set m23(m23) {
            this._array[6] = m23;
        }
        get m24() {
            return this._array[7];
        }
        set m24(m24) {
            this._array[7] = m24;
        }
        get m31() {
            return this._array[8];
        }
        set m31(m31) {
            this._array[8] = m31;
        }
        get m32() {
            return this._array[9];
        }
        set m32(m32) {
            this._array[9] = m32;
        }
        get m33() {
            return this._array[10];
        }
        set m33(m33) {
            this._array[10] = m33;
        }
        get m34() {
            return this._array[11];
        }
        set m34(m34) {
            this._array[11] = m34;
        }
        get m41() {
            return this._array[12];
        }
        set m41(m41) {
            this._array[12] = m41;
        }
        get m42() {
            return this._array[13];
        }
        set m42(m42) {
            this._array[13] = m42;
        }
        get m43() {
            return this._array[14];
        }
        set m43(m43) {
            this._array[14] = m43;
        }
        get m44() {
            return this._array[15];
        }
        set m44(m44) {
            this._array[15] = m44;
        }
        setArray(array) {
            if (array.length < 16) {
                throw new MathError_5.MathError(`Array must be of length 16 at least.`);
            }
            this._array = array;
            return this;
        }
        setValues(m) {
            const o = this._array;
            o[0] = m[0];
            o[1] = m[1];
            o[2] = m[2];
            o[3] = m[3];
            o[4] = m[4];
            o[5] = m[5];
            o[6] = m[6];
            o[7] = m[7];
            o[8] = m[8];
            o[9] = m[9];
            o[10] = m[10];
            o[11] = m[11];
            o[12] = m[12];
            o[13] = m[13];
            o[14] = m[14];
            o[15] = m[15];
            return this;
        }
        getUpper33() {
            const m = this._array;
            return [
                m[0], m[1], m[2],
                m[4], m[5], m[6],
                m[8], m[9], m[10]
            ];
        }
        setUpper33(m) {
            const o = this._array;
            o[0] = m[0];
            o[1] = m[1];
            o[2] = m[2];
            o[4] = m[4];
            o[5] = m[5];
            o[6] = m[6];
            o[8] = m[8];
            return this;
        }
        getUpper34() {
            const m = this._array;
            return [
                m[0], m[1], m[2], m[3],
                m[4], m[5], m[6], m[7],
                m[8], m[9], m[10], m[11]
            ];
        }
        setUpper34(m) {
            const o = this._array;
            o[0] = m[0];
            o[1] = m[1];
            o[2] = m[2];
            o[3] = m[3];
            o[4] = m[4];
            o[5] = m[5];
            o[6] = m[6];
            o[7] = m[7];
            o[8] = m[8];
            o[9] = m[9];
            o[10] = m[10];
            o[11] = m[11];
            return this;
        }
        getRow(idx) {
            const m = this._array;
            const offset = idx * 4;
            return [
                m[offset],
                m[offset + 1],
                m[offset + 2],
                m[offset + 3]
            ];
        }
        setRow(idx, row) {
            const o = this._array;
            const offset = idx * 4;
            o[offset] = row[0];
            o[offset + 1] = row[1];
            o[offset + 2] = row[2];
            o[offset + 3] = row[3];
            return this;
        }
        setCol(idx, col) {
            const o = this._array;
            o[idx] = col[0];
            o[4 + idx] = col[1];
            o[8 + idx] = col[2];
            o[12 + idx] = col[3];
            return this;
        }
        getCol(idx) {
            const m = this._array;
            return [
                m[idx],
                m[4 + idx],
                m[8 + idx],
                m[12 + idx]
            ];
        }
        getAt(idx) {
            return this._array[idx];
        }
        setAt(idx, val) {
            this._array[idx] = val;
            return this;
        }
        getEntry(row, col) {
            return this._array[4 * row + col];
        }
        setEntry(row, col, val) {
            this._array[4 * row + col] = val;
            return this;
        }
        equals(mat) {
            const o = this._array;
            const m = mat.array;
            return o[0] === m[0]
                && o[1] === m[1]
                && o[2] === m[2]
                && o[3] === m[3]
                && o[4] === m[4]
                && o[5] === m[5]
                && o[6] === m[6]
                && o[7] === m[7]
                && o[8] === m[8]
                && o[9] === m[9]
                && o[10] === m[10]
                && o[11] === m[11]
                && o[12] === m[12]
                && o[13] === m[13]
                && o[14] === m[14]
                && o[15] === m[15];
        }
        copy(mat) {
            const o = this._array;
            const m = mat.array;
            o[0] = m[0];
            o[1] = m[1];
            o[2] = m[2];
            o[3] = m[3];
            o[4] = m[4];
            o[5] = m[5];
            o[6] = m[6];
            o[7] = m[7];
            o[8] = m[8];
            o[9] = m[9];
            o[10] = m[10];
            o[11] = m[11];
            o[12] = m[12];
            o[13] = m[13];
            o[14] = m[14];
            o[15] = m[15];
            return this;
        }
        clone() {
            return new Matrix4Base(this.values);
        }
        setIdentity() {
            const o = this._array;
            o[0] = 1;
            o[1] = 0;
            o[2] = 0;
            o[3] = 0;
            o[4] = 0;
            o[5] = 1;
            o[6] = 0;
            o[7] = 0;
            o[8] = 0;
            o[9] = 0;
            o[10] = 1;
            o[11] = 0;
            o[12] = 0;
            o[13] = 0;
            o[14] = 0;
            o[15] = 1;
            return this;
        }
        setZeros() {
            const o = this._array;
            o[0] = 0;
            o[1] = 0;
            o[2] = 0;
            o[3] = 0;
            o[4] = 0;
            o[5] = 0;
            o[6] = 0;
            o[7] = 0;
            o[8] = 0;
            o[9] = 0;
            o[10] = 0;
            o[11] = 0;
            o[12] = 0;
            o[13] = 0;
            o[14] = 0;
            o[15] = 0;
            return this;
        }
        det() {
            const o = this._array;
            const det2_01_01 = o[0] * o[5] - o[1] * o[4];
            const det2_01_02 = o[0] * o[6] - o[2] * o[4];
            const det2_01_03 = o[0] * o[7] - o[3] * o[4];
            const det2_01_12 = o[1] * o[6] - o[2] * o[5];
            const det2_01_13 = o[1] * o[7] - o[3] * o[5];
            const det2_01_23 = o[2] * o[7] - o[3] * o[6];
            const det3_201_012 = o[8] * det2_01_12 - o[9] * det2_01_02 + o[10] * det2_01_01;
            const det3_201_013 = o[8] * det2_01_13 - o[9] * det2_01_03 + o[11] * det2_01_01;
            const det3_201_023 = o[8] * det2_01_23 - o[10] * det2_01_03 + o[11] * det2_01_02;
            const det3_201_123 = o[9] * det2_01_23 - o[10] * det2_01_13 + o[11] * det2_01_12;
            return -det3_201_123 * o[12] + det3_201_023 * o[13]
                - det3_201_013 * o[14] + det3_201_012 * o[15];
        }
        trace() {
            const o = this._array;
            return o[0] + o[5] + o[10] + o[15];
        }
        negate() {
            const o = this._array;
            const m = this._array;
            o[0] = -m[0];
            o[1] = -m[1];
            o[2] = -m[2];
            o[3] = -m[3];
            o[4] = -m[4];
            o[5] = -m[5];
            o[6] = -m[6];
            o[7] = -m[7];
            o[8] = -m[8];
            o[9] = -m[9];
            o[10] = -m[10];
            o[11] = -m[11];
            o[12] = -m[12];
            o[13] = -m[13];
            o[14] = -m[14];
            o[15] = -m[15];
            return this;
        }
        transpose() {
            const m = this._array;
            const o = this._array;
            o[0] = m[0];
            o[1] = m[4];
            o[2] = m[8];
            o[3] = m[12];
            o[4] = m[1];
            o[5] = m[5];
            o[6] = m[9];
            o[7] = m[13];
            o[8] = m[2];
            o[9] = m[6];
            o[10] = m[10];
            o[11] = m[14];
            o[12] = m[3];
            o[13] = m[7];
            o[14] = m[11];
            o[15] = m[15];
            return this;
        }
        invert() {
            const o = this._array;
            const o00 = o[0];
            const o01 = o[1];
            const o02 = o[2];
            const o03 = o[3];
            const o10 = o[4];
            const o11 = o[5];
            const o12 = o[6];
            const o13 = o[7];
            const o20 = o[8];
            const o21 = o[9];
            const o22 = o[10];
            const o23 = o[11];
            const o30 = o[12];
            const o31 = o[13];
            const o32 = o[14];
            const o33 = o[15];
            const t00 = o00 * o11 - o01 * o10;
            const t01 = o00 * o12 - o02 * o10;
            const t02 = o00 * o13 - o03 * o10;
            const t03 = o01 * o12 - o02 * o11;
            const t04 = o01 * o13 - o03 * o11;
            const t05 = o02 * o13 - o03 * o12;
            const t06 = o20 * o31 - o21 * o30;
            const t07 = o20 * o32 - o22 * o30;
            const t08 = o20 * o33 - o23 * o30;
            const t09 = o21 * o32 - o22 * o31;
            const t10 = o21 * o33 - o23 * o31;
            const t11 = o22 * o33 - o23 * o32;
            const d = (t00 * t11 - t01 * t10 + t02 * t09 + t03 * t08 - t04 * t07 + t05 * t06);
            if (d == 0) {
                throw new MathError_5.MathError(`Matrix is not invertible.`);
            }
            const invDet = 1.0 / d;
            o[0] = (o11 * t11 - o12 * t10 + o13 * t09) * invDet;
            o[1] = (-o01 * t11 + o02 * t10 - o03 * t09) * invDet;
            o[2] = (o31 * t05 - o32 * t04 + o33 * t03) * invDet;
            o[3] = (-o21 * t05 + o22 * t04 - o23 * t03) * invDet;
            o[4] = (-o10 * t11 + o12 * t08 - o13 * t07) * invDet;
            o[5] = (o00 * t11 - o02 * t08 + o03 * t07) * invDet;
            o[6] = (-o30 * t05 + o32 * t02 - o33 * t01) * invDet;
            o[7] = (o20 * t05 - o22 * t02 + o23 * t01) * invDet;
            o[8] = (o10 * t10 - o11 * t08 + o13 * t06) * invDet;
            o[9] = (-o00 * t10 + o01 * t08 - o03 * t06) * invDet;
            o[10] = (o30 * t04 - o31 * t02 + o33 * t00) * invDet;
            o[11] = (-o20 * t04 + o21 * t02 - o23 * t00) * invDet;
            o[12] = (-o10 * t09 + o11 * t07 - o12 * t06) * invDet;
            o[13] = (o00 * t09 - o01 * t07 + o02 * t06) * invDet;
            o[14] = (-o30 * t03 + o31 * t01 - o32 * t00) * invDet;
            o[15] = (o20 * t03 - o21 * t01 + o22 * t00) * invDet;
            return this;
        }
        inverseTranspose() {
            const o = this._array;
            const o00 = o[0];
            const o01 = o[1];
            const o02 = o[2];
            const o03 = o[3];
            const o10 = o[4];
            const o11 = o[5];
            const o12 = o[6];
            const o13 = o[7];
            const o20 = o[8];
            const o21 = o[9];
            const o22 = o[10];
            const o23 = o[11];
            const o30 = o[12];
            const o31 = o[13];
            const o32 = o[14];
            const o33 = o[15];
            const t00 = o00 * o11 - o01 * o10;
            const t01 = o00 * o12 - o02 * o10;
            const t02 = o00 * o13 - o03 * o10;
            const t03 = o01 * o12 - o02 * o11;
            const t04 = o01 * o13 - o03 * o11;
            const t05 = o02 * o13 - o03 * o12;
            const t06 = o20 * o31 - o21 * o30;
            const t07 = o20 * o32 - o22 * o30;
            const t08 = o20 * o33 - o23 * o30;
            const t09 = o21 * o32 - o22 * o31;
            const t10 = o21 * o33 - o23 * o31;
            const t11 = o22 * o33 - o23 * o32;
            const d = (t00 * t11 - t01 * t10 + t02 * t09 + t03 * t08 - t04 * t07 + t05 * t06);
            if (d == 0) {
                throw new MathError_5.MathError(`Matrix is not inversible.`);
            }
            const invDet = 1.0 / d;
            const m11 = (o11 * t11 - o12 * t10 + o13 * t09) * invDet;
            const m12 = (-o01 * t11 + o02 * t10 - o03 * t09) * invDet;
            const m13 = (o31 * t05 - o32 * t04 + o33 * t03) * invDet;
            const m14 = (-o21 * t05 + o22 * t04 - o23 * t03) * invDet;
            const m21 = (-o10 * t11 + o12 * t08 - o13 * t07) * invDet;
            const m22 = (o00 * t11 - o02 * t08 + o03 * t07) * invDet;
            const m23 = (-o30 * t05 + o32 * t02 - o33 * t01) * invDet;
            const m24 = (o20 * t05 - o22 * t02 + o23 * t01) * invDet;
            const m31 = (o10 * t10 - o11 * t08 + o13 * t06) * invDet;
            const m32 = (-o00 * t10 + o01 * t08 - o03 * t06) * invDet;
            const m33 = (o30 * t04 - o31 * t02 + o33 * t00) * invDet;
            const m34 = (-o20 * t04 + o21 * t02 - o23 * t00) * invDet;
            const m41 = (-o10 * t09 + o11 * t07 - o12 * t06) * invDet;
            const m42 = (o00 * t09 - o01 * t07 + o02 * t06) * invDet;
            const m43 = (-o30 * t03 + o31 * t01 - o32 * t00) * invDet;
            const m44 = (o20 * t03 - o21 * t01 + o22 * t00) * invDet;
            o[0] = m11;
            o[1] = m12;
            o[2] = m13;
            o[3] = m14;
            o[4] = m21;
            o[5] = m22;
            o[6] = m23;
            o[7] = m24;
            o[8] = m31;
            o[9] = m32;
            o[10] = m33;
            o[11] = m34;
            o[12] = m41;
            o[13] = m42;
            o[14] = m43;
            o[15] = m44;
            return this;
        }
        add(mat) {
            const o = this._array;
            const m = mat.array;
            o[0] = o[0] + m[0];
            o[1] = o[1] + m[1];
            o[2] = o[2] + m[2];
            o[3] = o[3] + m[3];
            o[4] = o[4] + m[4];
            o[5] = o[5] + m[5];
            o[6] = o[6] + m[6];
            o[7] = o[7] + m[7];
            o[8] = o[8] + m[8];
            o[9] = o[9] + m[9];
            o[10] = o[10] + m[10];
            o[11] = o[11] + m[11];
            o[12] = o[12] + m[12];
            o[13] = o[13] + m[13];
            o[14] = o[14] + m[14];
            o[15] = o[15] + m[15];
            return this;
        }
        sub(mat) {
            const o = this._array;
            const m = mat.array;
            o[0] = o[0] - m[0];
            o[1] = o[1] - m[1];
            o[2] = o[2] - m[2];
            o[3] = o[3] - m[3];
            o[4] = o[4] - m[4];
            o[5] = o[5] - m[5];
            o[6] = o[6] - m[6];
            o[7] = o[7] - m[7];
            o[8] = o[8] - m[8];
            o[9] = o[9] - m[9];
            o[10] = o[10] - m[10];
            o[11] = o[11] - m[11];
            o[12] = o[12] - m[12];
            o[13] = o[13] - m[13];
            o[14] = o[14] - m[14];
            o[15] = o[15] - m[15];
            return this;
        }
        mult(mat) {
            const o = this._array;
            const m = mat.array;
            const a11 = o[0];
            const a12 = o[1];
            const a13 = o[2];
            const a14 = o[3];
            const a21 = o[4 + 0];
            const a22 = o[4 + 1];
            const a23 = o[4 + 2];
            const a24 = o[4 + 3];
            const a31 = o[8 + 0];
            const a32 = o[8 + 1];
            const a33 = o[8 + 2];
            const a34 = o[8 + 3];
            const a41 = o[12 + 0];
            const a42 = o[12 + 1];
            const a43 = o[12 + 2];
            const a44 = o[12 + 3];
            const b11 = m[0];
            const b12 = m[1];
            const b13 = m[2];
            const b14 = m[3];
            const b21 = m[4 + 0];
            const b22 = m[4 + 1];
            const b23 = m[4 + 2];
            const b24 = m[4 + 3];
            const b31 = m[8 + 0];
            const b32 = m[8 + 1];
            const b33 = m[8 + 2];
            const b34 = m[8 + 3];
            const b41 = m[12 + 0];
            const b42 = m[12 + 1];
            const b43 = m[12 + 2];
            const b44 = m[12 + 3];
            o[0] = a11 * b11 + a21 * b12 + a31 * b13 + a41 * b14;
            o[1] = a12 * b11 + a22 * b12 + a32 * b13 + a42 * b14;
            o[2] = a13 * b11 + a23 * b12 + a33 * b13 + a43 * b14;
            o[3] = a14 * b11 + a24 * b12 + a34 * b13 + a44 * b14;
            o[4] = a11 * b21 + a21 * b22 + a31 * b23 + a41 * b24;
            o[5] = a12 * b21 + a22 * b22 + a32 * b23 + a42 * b24;
            o[6] = a13 * b21 + a23 * b22 + a33 * b23 + a43 * b24;
            o[7] = a14 * b21 + a24 * b22 + a34 * b23 + a44 * b24;
            o[8] = a11 * b31 + a21 * b32 + a31 * b33 + a41 * b34;
            o[9] = a12 * b31 + a22 * b32 + a32 * b33 + a42 * b34;
            o[10] = a13 * b31 + a23 * b32 + a33 * b33 + a43 * b34;
            o[11] = a14 * b31 + a24 * b32 + a34 * b33 + a44 * b34;
            o[12] = a11 * b41 + a21 * b42 + a31 * b43 + a41 * b44;
            o[13] = a12 * b41 + a22 * b42 + a32 * b43 + a42 * b44;
            o[14] = a13 * b41 + a23 * b42 + a33 * b43 + a43 * b44;
            o[15] = a14 * b41 + a24 * b42 + a34 * b43 + a44 * b44;
            return this;
        }
        multScalar(k) {
            const o = this._array;
            o[0] = o[0] * k;
            o[1] = o[1] * k;
            o[2] = o[2] * k;
            o[3] = o[3] * k;
            o[4] = o[4] * k;
            o[5] = o[5] * k;
            o[6] = o[6] * k;
            o[7] = o[7] * k;
            o[8] = o[8] * k;
            o[9] = o[9] * k;
            o[10] = o[10] * k;
            o[11] = o[11] * k;
            o[12] = o[12] * k;
            o[13] = o[13] * k;
            o[14] = o[14] * k;
            o[15] = o[15] * k;
            return this;
        }
        getMaxScaleOnAxis() {
            const o = this._array;
            const scaleXSq = o[0] * o[0] + o[1] * o[1] + o[2] * o[2];
            const scaleYSq = o[4] * o[4] + o[5] * o[5] + o[6] * o[6];
            const scaleZSq = o[8] * o[8] + o[9] * o[9] + o[10] * o[10];
            return Math.sqrt(Math.max(scaleXSq, scaleYSq, scaleZSq));
        }
        writeIntoArray(out, offset = 0) {
            const m = this._array;
            out[offset] = m[0];
            out[offset + 1] = m[1];
            out[offset + 2] = m[2];
            out[offset + 3] = m[3];
            out[offset + 4] = m[4];
            out[offset + 5] = m[5];
            out[offset + 6] = m[6];
            out[offset + 7] = m[7];
            out[offset + 8] = m[8];
            out[offset + 9] = m[9];
            out[offset + 10] = m[10];
            out[offset + 11] = m[11];
            out[offset + 12] = m[12];
            out[offset + 13] = m[13];
            out[offset + 14] = m[14];
            out[offset + 15] = m[15];
        }
        readFromArray(arr, offset = 0) {
            const o = this._array;
            o[0] = arr[offset];
            o[1] = arr[offset + 1];
            o[2] = arr[offset + 2];
            o[3] = arr[offset + 3];
            o[4] = arr[offset + 4];
            o[5] = arr[offset + 5];
            o[6] = arr[offset + 6];
            o[7] = arr[offset + 7];
            o[8] = arr[offset + 8];
            o[9] = arr[offset + 9];
            o[10] = arr[offset + 10];
            o[11] = arr[offset + 11];
            o[12] = arr[offset + 12];
            o[13] = arr[offset + 13];
            o[14] = arr[offset + 14];
            o[15] = arr[offset + 15];
            return this;
        }
        solve(vecB) {
            const a = this._array;
            const a11 = a[0];
            const a12 = a[1];
            const a13 = a[2];
            const a14 = a[3];
            const a21 = a[4];
            const a22 = a[5];
            const a23 = a[6];
            const a24 = a[7];
            const a31 = a[8];
            const a32 = a[9];
            const a33 = a[10];
            const a34 = a[11];
            const a41 = a[12];
            const a42 = a[13];
            const a43 = a[14];
            const a44 = a[15];
            const b00 = a11 * a22 - a12 * a21;
            const b01 = a11 * a23 - a13 * a21;
            const b02 = a11 * a24 - a14 * a21;
            const b03 = a12 * a23 - a13 * a22;
            const b04 = a12 * a24 - a14 * a22;
            const b05 = a13 * a24 - a14 * a23;
            const b06 = a31 * a42 - a32 * a41;
            const b07 = a31 * a43 - a33 * a41;
            const b08 = a31 * a44 - a34 * a41;
            const b09 = a32 * a43 - a33 * a42;
            const b10 = a32 * a44 - a34 * a42;
            const b11 = a33 * a44 - a34 * a43;
            const bX = vecB.x;
            const bY = vecB.y;
            const bZ = vecB.z;
            const bW = vecB.w;
            let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
            if (det != 0.0) {
                det = 1.0 / det;
            }
            const x = det *
                ((a22 * b11 - a23 * b10 + a24 * b09) * bX -
                    (a21 * b11 - a23 * b08 + a24 * b07) * bY +
                    (a21 * b10 - a22 * b08 + a24 * b06) * bZ -
                    (a21 * b09 - a22 * b07 + a23 * b06) * bW);
            const y = det *
                -((a12 * b11 - a13 * b10 + a14 * b09) * bX -
                    (a11 * b11 - a13 * b08 + a14 * b07) * bY +
                    (a11 * b10 - a12 * b08 + a14 * b06) * bZ -
                    (a11 * b09 - a12 * b07 + a13 * b06) * bW);
            const z = det *
                ((a42 * b05 - a43 * b04 + a44 * b03) * bX -
                    (a41 * b05 - a43 * b02 + a44 * b01) * bY +
                    (a41 * b04 - a42 * b02 + a44 * b00) * bZ -
                    (a41 * b03 - a42 * b01 + a43 * b00) * bW);
            const w = det *
                -((a32 * b05 - a33 * b04 + a34 * b03) * bX -
                    (a31 * b05 - a33 * b02 + a34 * b01) * bY +
                    (a31 * b04 - a32 * b02 + a34 * b00) * bZ -
                    (a31 * b03 - a32 * b01 + a33 * b00) * bW);
            return [
                x, y, z, w
            ];
        }
        solve2(vecB) {
            const a = this._array;
            const a11 = a[0];
            const a12 = a[1];
            const a21 = a[4];
            const a22 = a[5];
            const bx = vecB.x - a[8];
            const by = vecB.y - a[9];
            let det = a11 * a22 - a12 * a21;
            if (det != 0.0) {
                det = 1.0 / det;
            }
            const x = det * (a22 * bx - a12 * by);
            const y = det * (a11 * by - a21 * bx);
            return [
                x, y
            ];
        }
        solve3(vecB) {
            const a = this._array;
            const a11 = a[0];
            const a12 = a[1];
            const a13 = a[2];
            const a21 = a[4];
            const a22 = a[5];
            const a23 = a[6];
            const a31 = a[8];
            const a32 = a[9];
            const a33 = a[10];
            const bx = vecB.x - a[12];
            const by = vecB.y - a[13];
            const bz = vecB.z - a[14];
            let rx = a22 * a33 - a23 * a32;
            let ry = a23 * a31 - a21 * a33;
            let rz = a21 * a32 - a22 * a31;
            let det = a11 * rx + a12 * ry + a13 * rz;
            if (det != 0.0) {
                det = 1.0 / det;
            }
            const x = det * (bx * rx + by * ry + bz * rz);
            rx = -(a32 * bz - a33 * by);
            ry = -(a33 * bx - a31 * bz);
            rz = -(a31 * by - a32 * bx);
            const y = det * (a11 * rx + a12 * ry + a13 * rz);
            rx = -(by * a23 - bz * a22);
            ry = -(bz * a21 - bx * a23);
            rz = -(bx * a22 - by * a21);
            const z = det * (a11 * rx + a12 * ry + a13 * rz);
            return [
                x, y, z
            ];
        }
        setTranslation(vec) {
            const o = this._array;
            const x = vec.x;
            const y = vec.y;
            const z = vec.z;
            o[0] = 1;
            o[1] = 0;
            o[2] = 0;
            o[3] = 0;
            o[4] = 0;
            o[5] = 1;
            o[6] = 0;
            o[7] = 0;
            o[8] = 0;
            o[9] = 0;
            o[10] = 1;
            o[11] = 0;
            o[12] = x;
            o[13] = y;
            o[14] = z;
            o[15] = 1;
            return this;
        }
        translate(vec) {
            const o = this._array;
            const m11 = o[0];
            const m12 = o[1];
            const m13 = o[2];
            const m14 = o[3];
            const m21 = o[4];
            const m22 = o[5];
            const m23 = o[6];
            const m24 = o[7];
            const m31 = o[8];
            const m32 = o[9];
            const m33 = o[10];
            const m34 = o[11];
            const m41 = o[12];
            const m42 = o[13];
            const m43 = o[14];
            const m44 = o[15];
            const x = vec.x;
            const y = vec.y;
            const z = vec.z;
            o[12] = m11 * x + m21 * y + m31 * z + m41;
            o[13] = m12 * x + m22 * y + m32 * z + m42;
            o[14] = m13 * x + m23 * y + m33 * z + m43;
            o[15] = m14 * x + m24 * y + m34 * z + m44;
            return this;
        }
        setRotationX(angleInRadians) {
            const o = this._array;
            const c = Math.cos(angleInRadians);
            const s = Math.sin(angleInRadians);
            o[0] = 1;
            o[1] = 0;
            o[2] = 0;
            o[3] = 0;
            o[4] = 0;
            o[5] = c;
            o[6] = s;
            o[7] = 0;
            o[8] = 0;
            o[9] = -s;
            o[10] = -c;
            o[11] = 0;
            o[12] = 0;
            o[13] = 0;
            o[14] = 0;
            o[15] = 1;
            return this;
        }
        rotateX(angleInRadians) {
            const o = this._array;
            const m21 = o[4];
            const m22 = o[5];
            const m23 = o[6];
            const m24 = o[7];
            const m31 = o[8];
            const m32 = o[9];
            const m33 = o[10];
            const m34 = o[11];
            const c = Math.cos(angleInRadians);
            const s = Math.sin(angleInRadians);
            o[8] = c * m21 + s * m31;
            o[9] = c * m22 + s * m32;
            o[10] = c * m23 + s * m33;
            o[11] = c * m24 + s * m34;
            o[12] = c * m31 - s * m21;
            o[13] = c * m32 - s * m22;
            o[14] = c * m33 - s * m23;
            o[15] = c * m34 - s * m24;
            return this;
        }
        setRotationY(angleInRadians) {
            const c = Math.cos(angleInRadians);
            const s = Math.sin(angleInRadians);
            const o = this._array;
            o[0] = c;
            o[1] = 0;
            o[2] = -s;
            o[3] = 0;
            o[4] = 0;
            o[5] = 1;
            o[6] = 0;
            o[7] = 0;
            o[8] = s;
            o[9] = 0;
            o[10] = c;
            o[11] = 0;
            o[12] = 0;
            o[13] = 0;
            o[14] = 0;
            o[15] = 1;
            return this;
        }
        rotateY(angleInRadians) {
            const o = this._array;
            const m11 = o[0];
            const m12 = o[1];
            const m13 = o[2];
            const m14 = o[3];
            const m31 = o[8];
            const m32 = o[9];
            const m33 = o[10];
            const m34 = o[11];
            const c = Math.cos(angleInRadians);
            const s = Math.sin(angleInRadians);
            o[0] = c * m11 - s * m31;
            o[1] = c * m12 - s * m32;
            o[2] = c * m13 - s * m33;
            o[3] = c * m14 - s * m34;
            o[12] = c * m31 + s * m11;
            o[13] = c * m32 + s * m12;
            o[14] = c * m33 + s * m13;
            o[15] = c * m34 + s * m14;
            return this;
        }
        setRotationZ(angleInRadians) {
            const c = Math.cos(angleInRadians);
            const s = Math.sin(angleInRadians);
            const o = this._array;
            o[0] = c;
            o[1] = s;
            o[2] = 0;
            o[3] = 0;
            o[4] = -s;
            o[5] = c;
            o[6] = 0;
            o[7] = 0;
            o[8] = 0;
            o[9] = 0;
            o[10] = 1;
            o[11] = 0;
            o[12] = 0;
            o[13] = 0;
            o[14] = 0;
            o[15] = 1;
            return this;
        }
        rotateZ(angleInRadians) {
            const o = this._array;
            const m11 = o[0];
            const m12 = o[1];
            const m13 = o[2];
            const m14 = o[3];
            const m21 = o[4];
            const m22 = o[5];
            const m23 = o[6];
            const m24 = o[7];
            const c = Math.cos(angleInRadians);
            const s = Math.sin(angleInRadians);
            o[4] = c * m11 + s * m21;
            o[5] = c * m12 + s * m22;
            o[6] = c * m13 + s * m23;
            o[7] = c * m14 + s * m24;
            o[8] = c * m21 - s * m11;
            o[9] = c * m22 - s * m12;
            o[10] = c * m23 - s * m13;
            o[11] = c * m24 - s * m14;
            return this;
        }
        rotate(x, y, z) {
            this.rotateX(x);
            this.rotateY(y);
            this.rotateZ(z);
            return this;
        }
        axisRotation(axis, angleInRadians) {
            let x = axis.x;
            let y = axis.y;
            let z = axis.z;
            const n = Math.sqrt(x * x + y * y + z * z);
            x /= n;
            y /= n;
            z /= n;
            const xx = x * x;
            const yy = y * y;
            const zz = z * z;
            const c = Math.cos(angleInRadians);
            const s = Math.sin(angleInRadians);
            const oneMinusCosine = 1 - c;
            const o = this._array;
            o[0] = xx + (1 - xx) * c;
            o[1] = x * y * oneMinusCosine + z * s;
            o[2] = x * z * oneMinusCosine - y * s;
            o[3] = 0;
            o[4] = x * y * oneMinusCosine - z * s;
            o[5] = yy + (1 - yy) * c;
            o[6] = y * z * oneMinusCosine + x * s;
            o[7] = 0;
            o[8] = x * z * oneMinusCosine + y * s;
            o[9] = y * z * oneMinusCosine - x * s;
            o[10] = zz + (1 - zz) * c;
            o[11] = 0;
            o[12] = 0;
            o[13] = 0;
            o[14] = 0;
            o[15] = 1;
            return this;
        }
        rotateAxis(axis, angleInRadians) {
            const o = this._array;
            let x = axis.x;
            let y = axis.y;
            let z = axis.z;
            const n = Math.sqrt(x * x + y * y + z * z);
            x /= n;
            y /= n;
            z /= n;
            const xx = x * x;
            const yy = y * y;
            const zz = z * z;
            const c = Math.cos(angleInRadians);
            const s = Math.sin(angleInRadians);
            const oneMinusCosine = 1 - c;
            const r11 = xx + (1 - xx) * c;
            const r12 = x * y * oneMinusCosine + z * s;
            const r13 = x * z * oneMinusCosine - y * s;
            const r21 = x * y * oneMinusCosine - z * s;
            const r22 = yy + (1 - yy) * c;
            const r23 = y * z * oneMinusCosine + x * s;
            const r31 = x * z * oneMinusCosine + y * s;
            const r32 = y * z * oneMinusCosine - x * s;
            const r33 = zz + (1 - zz) * c;
            const m11 = o[0];
            const m12 = o[1];
            const m13 = o[2];
            const m14 = o[3];
            const m21 = o[4];
            const m22 = o[5];
            const m23 = o[6];
            const m24 = o[7];
            const m31 = o[8];
            const m32 = o[9];
            const m33 = o[10];
            const m34 = o[11];
            o[0] = r11 * m11 + r12 * m21 + r13 * m31;
            o[1] = r11 * m12 + r12 * m22 + r13 * m32;
            o[2] = r11 * m13 + r12 * m23 + r13 * m33;
            o[3] = r11 * m14 + r12 * m24 + r13 * m34;
            o[4] = r21 * m11 + r22 * m21 + r23 * m31;
            o[5] = r21 * m12 + r22 * m22 + r23 * m32;
            o[6] = r21 * m13 + r22 * m23 + r23 * m33;
            o[7] = r21 * m14 + r22 * m24 + r23 * m34;
            o[8] = r31 * m11 + r32 * m21 + r33 * m31;
            o[9] = r31 * m12 + r32 * m22 + r33 * m32;
            o[10] = r31 * m13 + r32 * m23 + r33 * m33;
            o[11] = r31 * m14 + r32 * m24 + r33 * m34;
            return this;
        }
        setScaling(vec) {
            const x = vec.x;
            const y = vec.y;
            const z = vec.z;
            const o = this._array;
            o[0] = x;
            o[1] = 0;
            o[2] = 0;
            o[3] = 0;
            o[4] = 0;
            o[5] = y;
            o[6] = 0;
            o[7] = 0;
            o[8] = 0;
            o[9] = 0;
            o[10] = z;
            o[11] = 0;
            o[12] = 0;
            o[13] = 0;
            o[14] = 0;
            o[15] = 1;
            return this;
        }
        scale(vec) {
            const o = this._array;
            const x = vec.x;
            const y = vec.y;
            const z = vec.z;
            o[0] = x * o[0];
            o[1] = x * o[1];
            o[2] = x * o[2];
            o[3] = x * o[3];
            o[4] = y * o[4];
            o[5] = y * o[5];
            o[6] = y * o[6];
            o[7] = y * o[7];
            o[8] = z * o[8];
            o[9] = z * o[9];
            o[10] = z * o[10];
            o[11] = z * o[11];
            return this;
        }
        scaleScalar(k) {
            const o = this._array;
            o[0] = k * o[0];
            o[1] = k * o[1];
            o[2] = k * o[2];
            o[3] = k * o[3];
            o[4] = k * o[4];
            o[5] = k * o[5];
            o[6] = k * o[6];
            o[7] = k * o[7];
            o[8] = k * o[8];
            o[9] = k * o[9];
            o[10] = k * o[10];
            o[11] = k * o[11];
            return this;
        }
        lookAt(eye, target, up) {
            const o = this._array;
            const e = eye.array;
            const e0 = e[0];
            const e1 = e[1];
            const e2 = e[2];
            const t = target.array;
            const t0 = t[0];
            const t1 = t[1];
            const t2 = t[2];
            const u = up.array;
            const u0 = u[0];
            const u1 = u[1];
            const u2 = u[2];
            let z0 = e0 - t0;
            let z1 = e1 - t1;
            let z2 = e2 - t2;
            const zLen = Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
            if (zLen > Number.EPSILON) {
                z0 = z0 / zLen;
                z1 = z1 / zLen;
                z2 = z2 / zLen;
            }
            else {
                z0 = 0;
                z1 = 0;
                z2 = 0;
            }
            let x0 = u1 * z2 - u2 * z1;
            let x1 = u2 * z0 - u0 * z2;
            let x2 = u0 * z1 - u1 * z0;
            const xLen = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
            if (xLen > Number.EPSILON) {
                x0 = x0 / xLen;
                x1 = x1 / xLen;
                x2 = x2 / xLen;
            }
            else {
                x0 = 0;
                x1 = 0;
                x2 = 0;
            }
            let y0 = z1 * x2 - z2 * x1;
            let y1 = z2 * x0 - z0 * x2;
            let y2 = z0 * x1 - z1 * x0;
            const yLen = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
            if (yLen > Number.EPSILON) {
                y0 = y0 / yLen;
                y1 = y1 / yLen;
                y2 = y2 / yLen;
            }
            else {
                y0 = 0;
                y1 = 0;
                y2 = 0;
            }
            o[0] = x0;
            o[1] = x1;
            o[2] = x2;
            o[3] = 0;
            o[4] = y0;
            o[5] = y1;
            o[6] = y2;
            o[7] = 0;
            o[8] = z0;
            o[9] = z1;
            o[10] = z2;
            o[11] = 0;
            o[12] = e0;
            o[13] = e1;
            o[14] = e2;
            o[15] = 1;
            return this;
        }
        transformPoint(vec) {
            const m = this._array;
            const x = vec.x;
            const y = vec.y;
            const z = vec.z;
            const d = x * m[3] + y * m[7] + z * m[11] + m[15];
            return [
                (x * m[0] + y * m[4] + z * m[8] + m[12]) / d,
                (x * m[1] + y * m[5] + z * m[9] + m[13]) / d,
                (x * m[2] + y * m[6] + z * m[10] + m[14]) / d
            ];
        }
        transformDirection(vec) {
            const m = this._array;
            const x = vec.x;
            const y = vec.y;
            const z = vec.z;
            return [
                x * m[0] + y * m[4] + z * m[8],
                x * m[1] + y * m[5] + z * m[9],
                x * m[2] + y * m[6] + z * m[10]
            ];
        }
        transformNormal(vec) {
            let out;
            const backup = this.values;
            const m = this.invert().array;
            const x = vec.x;
            const y = vec.y;
            const z = vec.z;
            out = [
                x * m[0] + y * m[4] + z * m[8],
                x * m[1] + y * m[5] + z * m[9],
                x * m[2] + y * m[6] + z * m[10]
            ];
            this.values = backup;
            return out;
        }
        asPerspective(fieldOfViewYInRadians, aspect, zNear, zFar) {
            const f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewYInRadians);
            const rangeInv = 1.0 / (zNear - zFar);
            const o = this._array;
            o[0] = f / aspect;
            o[1] = 0;
            o[2] = 0;
            o[3] = 0;
            o[4] = 0;
            o[5] = f;
            o[6] = 0;
            o[7] = 0;
            o[8] = 0;
            o[9] = 0;
            o[10] = (zNear + zFar) * rangeInv;
            o[11] = -1;
            o[12] = 0;
            o[13] = 0;
            o[14] = zNear * zFar * rangeInv * 2;
            o[15] = 0;
            return this;
        }
        asOrthographic(left, right, bottom, top, near, far) {
            const o = this._array;
            o[0] = 2 / (right - left);
            o[1] = 0;
            o[2] = 0;
            o[3] = 0;
            o[4] = 0;
            o[5] = 2 / (top - bottom);
            o[6] = 0;
            o[7] = 0;
            o[8] = 0;
            o[9] = 0;
            o[10] = 2 / (near - far);
            o[11] = 0;
            o[12] = (right + left) / (left - right);
            o[13] = (top + bottom) / (bottom - top);
            o[14] = (far + near) / (near - far);
            o[15] = 1;
            return this;
        }
    }
    exports.Matrix4Base = Matrix4Base;
    var Matrix4 = Matrix4Base;
    exports.Matrix4 = Matrix4;
    const Matrix4Injector = new Injector_5.Injector({
        defaultCtor: Matrix4Base,
        onDefaultOverride: (ctor) => {
            exports.Matrix4 = Matrix4 = ctor;
        }
    });
    exports.Matrix4Injector = Matrix4Injector;
});
define("engine/libs/patterns/pools/Pool", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PoolBase = exports.PoolAutoExtendPolicy = void 0;
    var PoolAutoExtendPolicy;
    (function (PoolAutoExtendPolicy) {
        PoolAutoExtendPolicy[PoolAutoExtendPolicy["NO_AUTO_EXTEND"] = 0] = "NO_AUTO_EXTEND";
        PoolAutoExtendPolicy[PoolAutoExtendPolicy["AUTO_EXTEND_ONE"] = 1] = "AUTO_EXTEND_ONE";
        PoolAutoExtendPolicy[PoolAutoExtendPolicy["AUTO_EXTEND_POW2"] = 2] = "AUTO_EXTEND_POW2";
    })(PoolAutoExtendPolicy || (PoolAutoExtendPolicy = {}));
    exports.PoolAutoExtendPolicy = PoolAutoExtendPolicy;
    class PoolBase {
        constructor(constructor, policy) {
            this._ctor = constructor;
            this._autoExtendPolicy = policy || PoolAutoExtendPolicy.AUTO_EXTEND_ONE;
            this._autoExtendTicks = 0;
            this._autoExtend = this.getAutoExtendFunction(this._autoExtendPolicy);
        }
        get ctor() {
            return this._ctor;
        }
        get autoExtendPolicy() {
            return this._autoExtendPolicy;
        }
        setAutoExtendPolicy(autoExtendPolicy) {
            this._autoExtendPolicy = autoExtendPolicy;
            this._autoExtend = this.getAutoExtendFunction(this._autoExtendPolicy);
        }
        getAutoExtendFunction(autoExtdPolicy) {
            switch (autoExtdPolicy) {
                case PoolAutoExtendPolicy.NO_AUTO_EXTEND:
                    return () => {
                        this._autoExtendTicks++;
                        return;
                    };
                case PoolAutoExtendPolicy.AUTO_EXTEND_ONE:
                    return () => {
                        this.extend(1);
                        this._autoExtendTicks++;
                    };
                case PoolAutoExtendPolicy.AUTO_EXTEND_POW2:
                    return () => {
                        this.extend(Math.pow(2, this._autoExtendTicks));
                        this._autoExtendTicks++;
                    };
            }
        }
    }
    exports.PoolBase = PoolBase;
});
define("engine/libs/patterns/pools/StackPool", ["require", "exports", "engine/libs/patterns/pools/Pool"], function (require, exports, Pool_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.StackPoolBase = exports.StackPool = void 0;
    class StackPoolBase extends Pool_1.PoolBase {
        constructor(constructor, options) {
            super(constructor, options === null || options === void 0 ? void 0 : options.policy);
            this._objects = Array((options === null || options === void 0 ? void 0 : options.size) || 0).fill(0).map(() => {
                return new this.ctor(options === null || options === void 0 ? void 0 : options.args);
            });
            this._top = 0;
        }
        acquireTemp(n, func) {
            const top = this._top;
            const target = top + n;
            const obj = this._objects;
            while (obj.length < target) {
                this._autoExtend();
            }
            this._top = target;
            switch (n) {
                case 1:
                    func(obj[top]);
                    break;
                case 2:
                    func(obj[top], obj[top + 1]);
                    break;
                case 3:
                    func(obj[top], obj[top + 1], obj[top + 2]);
                    break;
                case 4:
                    func(obj[top], obj[top + 1], obj[top + 2], obj[top + 3]);
                    break;
                case 5:
                    func(obj[top], obj[top + 1], obj[top + 2], obj[top + 3], obj[top + 4]);
                    break;
                case 6:
                    func(obj[top], obj[top + 1], obj[top + 2], obj[top + 3], obj[top + 4], obj[top + 5]);
                    break;
                case 7:
                    func(obj[top], obj[top + 1], obj[top + 2], obj[top + 3], obj[top + 4], obj[top + 5], obj[top + 6]);
                    break;
                case 8:
                    func(obj[top], obj[top + 1], obj[top + 2], obj[top + 3], obj[top + 4], obj[top + 5], obj[top + 6], obj[top + 7]);
                    break;
                default:
                    func(...obj.slice(top, top + n));
                    break;
            }
            ;
            this._top = top;
        }
        acquire() {
            if (this._top + 1 > this._objects.length) {
                this._autoExtend();
            }
            return this._objects[this._top++];
        }
        release(n) {
            const target = this._top - n;
            if (target > 0) {
                this._top = target;
            }
            else {
                this._top = 0;
            }
        }
        extend(n) {
            this._objects.push(...Array(n).fill(0).map(() => {
                return new this.ctor();
            }));
        }
        clear() {
            this._objects = [];
            this._top = 0;
            this._autoExtendTicks = 0;
        }
    }
    exports.StackPoolBase = StackPoolBase;
    const StackPool = StackPoolBase;
    exports.StackPool = StackPool;
});
define("engine/libs/maths/algebra/quaternions/Quaternion", ["require", "exports", "engine/libs/patterns/injectors/Injector", "engine/libs/maths/Snippets", "engine/libs/patterns/pools/StackPool", "engine/libs/maths/MathError"], function (require, exports, Injector_6, Snippets_6, StackPool_1, MathError_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.QuaternionPool = exports.QuaternionBase = exports.QuaternionInjector = exports.Quaternion = void 0;
    class QuaternionBase {
        constructor(values) {
            this._array = (values) ? [
                values[0], values[1], values[2], values[3]
            ] : [0, 0, 0, 0];
        }
        get array() {
            return this._array;
        }
        get values() {
            return [
                this._array[0],
                this._array[1],
                this._array[2],
                this._array[3]
            ];
        }
        set values(values) {
            this._array[0] = values[0];
            this._array[1] = values[1];
            this._array[2] = values[2];
            this._array[3] = values[3];
        }
        get _x() {
            return this._array[0];
        }
        set _x(x) {
            this._array[0] = x;
        }
        get _y() {
            return this._array[1];
        }
        set _y(y) {
            this._array[1] = y;
        }
        set _z(z) {
            this._array[2] = z;
        }
        get _z() {
            return this._array[2];
        }
        set _w(w) {
            this._array[3] = w;
        }
        get _w() {
            return this._array[3];
        }
        get x() {
            return this._array[0];
        }
        set x(x) {
            this._array[0] = x;
        }
        get y() {
            return this._array[1];
        }
        set y(y) {
            this._array[1] = y;
        }
        set z(z) {
            this._array[2] = z;
        }
        get z() {
            return this._array[2];
        }
        set w(w) {
            this._array[3] = w;
        }
        get w() {
            return this._array[3];
        }
        setArray(array) {
            if (array.length < 4) {
                throw new MathError_6.MathError(`Array must be of length 4 at least.`);
            }
            this._array = array;
            return this;
        }
        copy(quat) {
            const o = this._array;
            const q = quat.array;
            o[0] = q[0];
            o[1] = q[1];
            o[2] = q[2];
            o[3] = q[3];
            return this;
        }
        setValues(v) {
            const o = this._array;
            o[0] = v[0];
            o[1] = v[1];
            o[2] = v[2];
            o[3] = v[3];
            return this;
        }
        clone() {
            return new QuaternionBase(this.values);
        }
        equals(quat) {
            const o = this._array;
            const q = quat.array;
            return (o[0] === q[0])
                && (o[1] === q[1])
                && (o[2] === q[2])
                && (o[3] === q[3]);
        }
        getAxis(out) {
            const den = 1.0 - (this._w * this._w);
            if (den < Number.EPSILON) {
                return out.setZeros();
            }
            const scale = Snippets_6.qSqrt(den);
            out.setValues([this._x * scale, this._y * scale, this._z * scale]);
            return out;
        }
        asMatrix33() {
            const d = this.len();
            const s = 2.0 / d;
            const x = this._x;
            const y = this._y;
            const z = this._z;
            const w = this._w;
            const xs = x * s;
            const ys = y * s;
            const zs = z * s;
            const wx = w * xs;
            const wy = w * ys;
            const wz = w * zs;
            const xx = x * xs;
            const xy = x * ys;
            const xz = x * zs;
            const yy = y * ys;
            const yz = y * zs;
            const zz = z * zs;
            return [
                1 - (yy + zz), xy + wz, xz - wy,
                xy - wz, 1 - (xx + zz), yz + wx,
                xz + wy, yz - wx, 1 - (xx + yy)
            ];
        }
        asRotationMatrix(out) {
            const d = this.len();
            const s = 2.0 / d;
            const x = this._x;
            const y = this._y;
            const z = this._z;
            const w = this._w;
            const xs = x * s;
            const ys = y * s;
            const zs = z * s;
            const wx = w * xs;
            const wy = w * ys;
            const wz = w * zs;
            const xx = x * xs;
            const xy = x * ys;
            const xz = x * zs;
            const yy = y * ys;
            const yz = y * zs;
            const zz = z * zs;
            out.setValues([
                1 - (yy + zz), xy + wz, xz - wy,
                xy - wz, 1 - (xx + zz), yz + wx,
                xz + wy, yz - wx, 1 - (xx + yy)
            ]);
            return out;
        }
        rotate(vec) {
            const vx = vec.x;
            const vy = vec.y;
            const vz = vec.z;
            const qx = this._x;
            const qy = this._y;
            const qz = this._z;
            const qw = this._w;
            const tx = qw * vx + -qx * 0.0 + -qy * vz + qz * vy;
            const ty = qw * vy + -qy * 0.0 + -qz * vx + qx * vz;
            const tz = qw * vz + -qz * 0.0 + -qx * vy + qy * vx;
            const tw = qx * vx + qw * 0.0 + qy * vy + qz * vz;
            vec.setValues([
                tw * qz + tz * qw + tx * qy - ty * qx,
                tw * qy + ty * qw + tz * qx - tx * qz,
                tw * qx + tx * qw + ty * qz - tz * qy
            ]);
            return vec;
        }
        setEuler(yaw, pitch, roll) {
            const halfYaw = yaw * 0.5;
            const halfPitch = pitch * 0.5;
            const halfRoll = roll * 0.5;
            const cosYaw = Math.cos(halfYaw);
            const sinYaw = Math.sin(halfYaw);
            const cosPitch = Math.cos(halfPitch);
            const sinPitch = Math.sin(halfPitch);
            const cosRoll = Math.cos(halfRoll);
            const sinRoll = Math.sin(halfRoll);
            this.x = cosRoll * sinPitch * cosYaw + sinRoll * cosPitch * sinYaw;
            this.y = cosRoll * cosPitch * sinYaw - sinRoll * sinPitch * cosYaw;
            this.z = sinRoll * cosPitch * cosYaw - cosRoll * sinPitch * sinYaw;
            this.w = cosRoll * cosPitch * cosYaw + sinRoll * sinPitch * sinYaw;
            return this;
        }
        setFromAxisAngle(axis, angle) {
            const halfAngle = angle / 2, s = Math.sin(halfAngle);
            this._x = axis.x * s;
            this._y = axis.y * s;
            this._z = axis.z * s;
            this._w = Math.cos(halfAngle);
            return this;
        }
        setFromTransformMatrix(mat) {
            const m = mat.values;
            const m11 = m[0], m12 = m[4], m13 = m[8], m21 = m[1], m22 = m[5], m23 = m[9], m31 = m[2], m32 = m[6], m33 = m[10];
            const trace = m11 + m22 + m33;
            if (trace > 0) {
                const s = 0.5 / Math.sqrt(trace + 1.0);
                this._w = 0.25 / s;
                this._x = (m32 - m23) * s;
                this._y = (m13 - m31) * s;
                this._z = (m21 - m12) * s;
            }
            else if (m11 > m22 && m11 > m33) {
                const s = 2.0 * Math.sqrt(1.0 + m11 - m22 - m33);
                this._w = (m32 - m23) / s;
                this._x = 0.25 * s;
                this._y = (m12 + m21) / s;
                this._z = (m13 + m31) / s;
            }
            else if (m22 > m33) {
                const s = 2.0 * Math.sqrt(1.0 + m22 - m11 - m33);
                this._w = (m13 - m31) / s;
                this._x = (m12 + m21) / s;
                this._y = 0.25 * s;
                this._z = (m23 + m32) / s;
            }
            else {
                const s = 2.0 * Math.sqrt(1.0 + m33 - m11 - m22);
                this._w = (m21 - m12) / s;
                this._x = (m13 + m31) / s;
                this._y = (m23 + m32) / s;
                this._z = 0.25 * s;
            }
            return this;
        }
        setFromVectors(from, to) {
            let r = from.dot(to) + 1;
            if (r < Number.EPSILON) {
                r = 0;
                if (Math.abs(from.x) > Math.abs(from.z)) {
                    this._x = -from.y;
                    this._y = from.x;
                    this._z = 0;
                    this._w = r;
                }
                else {
                    this._x = 0;
                    this._y = -from.z;
                    this._z = from.y;
                    this._w = r;
                }
            }
            else {
                this._x = from.y * to.z - from.z * to.y;
                this._y = from.z * to.x - from.x * to.z;
                this._z = from.x * to.y - from.y * to.x;
                this._w = r;
            }
            return this.normalize();
        }
        dot(quat) {
            return this._x * quat.x + this._y * quat.y + this._z * quat.z + this._w * quat.w;
        }
        lenSq() {
            return this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w;
        }
        len() {
            return Math.sqrt(this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w);
        }
        angleTo(quat) {
            return 2 * Math.acos(Math.abs(Math.max(-1, Math.min(1, this.dot(quat)))));
        }
        rotateTowards(quat) {
            const angle = this.angleTo(quat);
            if (angle === 0) {
                return this;
            }
            const t = Math.min(1, angle);
            this.slerp(quat, t);
            return this;
        }
        invert() {
            return this.conjugate();
        }
        conjugate() {
            this._x *= -1;
            this._y *= -1;
            this._z *= -1;
            return this;
        }
        normalize() {
            let l = this.len();
            if (l === 0) {
                this._x = 0;
                this._y = 0;
                this._z = 0;
                this._w = 1;
            }
            else {
                l = 1 / l;
                this._x = this._x * l;
                this._y = this._y * l;
                this._z = this._z * l;
                this._w = this._w * l;
            }
            return this;
        }
        add(quat) {
            const q = quat.array;
            this._x = this._x + q[0];
            this._y = this._y + q[1];
            this._z = this._z + q[2];
            this._w = this._w + q[3];
            return this;
        }
        sub(quat) {
            const q = quat.array;
            this._x = this._x - q[0];
            this._y = this._y - q[1];
            this._z = this._z - q[2];
            this._w = this._w - q[3];
            return this;
        }
        mult(quat) {
            const ax = this._x, ay = this._y, az = this._z, aw = this._w;
            const bx = quat.x, by = quat.y, bz = quat.z, bw = quat.w;
            this._x = ax * bw + aw * bx + ay * bz - az * by;
            this._y = ay * bw + aw * by + az * bx - ax * bz;
            this._z = az * bw + aw * bz + ax * by - ay * bx;
            this._w = aw * bw - ax * bx - ay * by - az * bz;
            return this;
        }
        slerp(quat, t) {
            if (t === 0)
                return this;
            if (t === 1)
                return this.copy(quat);
            const x = this._x, y = this._y, z = this._z, w = this._w;
            let cosHalfTheta = w * quat.w + x * quat.x + y * quat.y + z * quat.z;
            if (cosHalfTheta < 0) {
                this._w = -quat.w;
                this._x = -quat.x;
                this._y = -quat.y;
                this._z = -quat.z;
                cosHalfTheta = -cosHalfTheta;
            }
            else {
                this.copy(quat);
            }
            if (cosHalfTheta >= 1.0) {
                this._w = w;
                this._x = x;
                this._y = y;
                this._z = z;
                return this;
            }
            const sqSinHalfTheta = 1.0 - cosHalfTheta * cosHalfTheta;
            if (sqSinHalfTheta <= Number.EPSILON) {
                const s = 1 - t;
                this._w = s * w + t * this._w;
                this._x = s * x + t * this._x;
                this._y = s * y + t * this._y;
                this._z = s * z + t * this._z;
                this.normalize();
                return this;
            }
            const sinHalfTheta = Math.sqrt(sqSinHalfTheta);
            const halfTheta = Math.atan2(sinHalfTheta, cosHalfTheta);
            const ratioA = Math.sin((1 - t) * halfTheta) / sinHalfTheta, ratioB = Math.sin(t * halfTheta) / sinHalfTheta;
            this._w = (w * ratioA + this._w * ratioB);
            this._x = (x * ratioA + this._x * ratioB);
            this._y = (y * ratioA + this._y * ratioB);
            this._z = (z * ratioA + this._z * ratioB);
            return this;
        }
        copyIntoArray(out, offset = 0) {
            const v = this._array;
            out[offset] = v[0];
            out[offset + 1] = v[1];
            out[offset + 2] = v[2];
            out[offset + 3] = v[3];
        }
        readFromArray(arr, offset = 0) {
            const o = this._array;
            o[0] = arr[offset];
            o[1] = arr[offset + 1];
            o[2] = arr[offset + 2];
            o[3] = arr[offset + 3];
        }
    }
    exports.QuaternionBase = QuaternionBase;
    var Quaternion = QuaternionBase;
    exports.Quaternion = Quaternion;
    const QuaternionPool = new StackPool_1.StackPool(QuaternionBase);
    exports.QuaternionPool = QuaternionPool;
    const QuaternionInjector = new Injector_6.Injector({
        defaultCtor: QuaternionBase,
        onDefaultOverride: (ctor) => {
            exports.Quaternion = Quaternion = ctor;
        }
    });
    exports.QuaternionInjector = QuaternionInjector;
});
define("engine/libs/maths/statistics/random/UUIDGenerator", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.UUIDGenerator = exports.UUIDGeneratorBase = void 0;
    class UUIDGeneratorBase {
        constructor() {
            this._count = 0;
        }
        newUUID() {
            return (++this._count).toString(16);
        }
    }
    exports.UUIDGeneratorBase = UUIDGeneratorBase;
    const UUIDGenerator = new UUIDGeneratorBase();
    exports.UUIDGenerator = UUIDGenerator;
});
define("engine/core/rendering/scenes/objects/Object3D", ["require", "exports", "engine/core/general/Transform"], function (require, exports, Transform_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Object3DBase = exports.isObject3D = void 0;
    function isObject3D(obj) {
        return obj.isObject3D;
    }
    exports.isObject3D = isObject3D;
    class Object3DBase {
        constructor() {
            this.isObject3D = true;
            this.transform = new Transform_1.TransformBase(this);
        }
    }
    exports.Object3DBase = Object3DBase;
});
define("engine/libs/structures/trees/Node", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NodeBase = void 0;
    class NodeBase {
        constructor(parent) {
            this._parent = null;
            this._children = [];
        }
        set parent(parent) {
            if (this._parent != null) {
                this._parent._removeChild(this);
            }
            if (parent != null) {
                this._parent = parent;
                this._parent.children.push(this);
            }
        }
        get parent() {
            return this._parent;
        }
        get children() {
            return this._children;
        }
        _removeChild(child) {
            const childIdx = this._children.indexOf(child);
            if (childIdx > -1) {
                const last = this._children.pop();
                if (last !== undefined) {
                    this._children[childIdx] = last;
                }
            }
        }
        traverse(func) {
            func(this, this.parent);
            for (const child of this._children) {
                child.traverse(func);
            }
        }
    }
    exports.NodeBase = NodeBase;
});
define("engine/core/general/Transform", ["require", "exports", "engine/libs/maths/algebra/quaternions/Quaternion", "engine/libs/maths/algebra/matrices/Matrix4", "engine/libs/maths/algebra/vectors/Vector3", "engine/libs/maths/statistics/random/UUIDGenerator", "engine/libs/structures/trees/Node"], function (require, exports, Quaternion_1, Matrix4_1, Vector3_1, UUIDGenerator_1, Node_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TransformBase = exports.isTransform = exports.Transform = void 0;
    function isTransform(obj) {
        return obj.isTransform;
    }
    exports.isTransform = isTransform;
    class TransformBase extends Node_1.NodeBase {
        constructor(owner) {
            super();
            this.isTransform = true;
            this.uuid = UUIDGenerator_1.UUIDGenerator.newUUID();
            this.owner = owner || null;
            this._localMatrixArray = new Float32Array(16);
            this._globalMatrixArray = new Float32Array(16);
            this._localMatrix = new Matrix4_1.Matrix4().setArray(this._localMatrixArray).setIdentity();
            this._globalMatrix = new Matrix4_1.Matrix4().setArray(this._globalMatrixArray).setIdentity();
            const localPosLength = 3;
            const globalPosLength = 3;
            const rotationLength = 4;
            const localScaleLength = 3;
            const upLength = 3;
            const leftLength = 3;
            const forwardLength = 3;
            this._array = new Float64Array(localPosLength + globalPosLength + rotationLength + localScaleLength +
                upLength + leftLength + forwardLength);
            let storageIdx = 0;
            this._localPosition = new Vector3_1.Vector3().setArray(this._array.subarray(storageIdx, storageIdx += localPosLength));
            this._globalPosition = new Vector3_1.Vector3().setArray(this._array.subarray(storageIdx, storageIdx += globalPosLength));
            this._rotation = new Quaternion_1.Quaternion().setArray(this._array.subarray(storageIdx, storageIdx += rotationLength));
            this._localScale = new Vector3_1.Vector3().setArray(this._array.subarray(storageIdx, storageIdx += localScaleLength));
            this._up = new Vector3_1.Vector3().setArray(this._array.subarray(storageIdx, storageIdx += upLength));
            this._left = new Vector3_1.Vector3().setArray(this._array.subarray(storageIdx, storageIdx += leftLength));
            this._forward = new Vector3_1.Vector3().setArray(this._array.subarray(storageIdx, storageIdx += forwardLength));
            this._hasChanged = true;
        }
        get localMatrix() {
            return this._localMatrix;
        }
        get localPosition() {
            return this._localPosition.setValues([
                this._localMatrixArray[12], this._localMatrixArray[13], this._localMatrixArray[14]
            ]);
        }
        get globalMatrix() {
            return this._globalMatrix;
        }
        set localPosition(position) {
            this._localMatrixArray[12] = position.x;
            this._localMatrixArray[13] = position.y;
            this._localMatrixArray[14] = position.z;
            this._hasChanged = true;
        }
        get globalPosition() {
            return this._globalPosition.setValues([
                this._localMatrixArray[12], this._localMatrixArray[13], this._localMatrixArray[14]
            ]);
        }
        set globalPosition(position) {
            this._globalMatrixArray[12] = position.x;
            this._globalMatrixArray[13] = position.y;
            this._globalMatrixArray[14] = position.z;
            this._hasChanged = true;
        }
        get rotation() {
            return this._rotation.setFromTransformMatrix(this._localMatrix);
        }
        set rotation(rotation) {
            this._localMatrix.setUpper33(rotation.asMatrix33());
            this._hasChanged = true;
        }
        get localScale() {
            return this._localScale.setValues([
                this._localMatrixArray[0], this._localMatrixArray[5], this._localMatrixArray[10]
            ]);
        }
        set localScale(scale) {
            this._globalMatrixArray[0] = scale.x;
            this._globalMatrixArray[5] = scale.y;
            this._globalMatrixArray[10] = scale.z;
            this._hasChanged = true;
        }
        get left() {
            const g = this._globalMatrix.array;
            return this._left.setValues([
                g[0], g[4], g[8]
            ]);
        }
        get up() {
            const g = this._globalMatrix.array;
            return this._up.setValues([
                g[1], g[5], g[9]
            ]);
        }
        get forward() {
            const g = this._globalMatrix.array;
            return this._forward.setValues([
                g[2], g[6], g[10]
            ]);
        }
        root() {
            while (this._parent !== null) {
                return this._parent.root();
            }
            return this;
        }
        get hasChanged() {
            return this._hasChanged;
        }
        translate(vec) {
            this._globalMatrix.translate(vec);
            return this;
        }
        scale(vec) {
            this._globalMatrix.scale(vec);
            return this;
        }
        rotate(quat) {
            this._globalMatrix.setUpper33(quat.asMatrix33());
            return this;
        }
        lookAt(target, up) {
            this._globalMatrix.lookAt(this.globalPosition, target, up);
            return this;
        }
        _bottomUpRecursiveMatrixUpdate() {
            if (this.parent == null) {
                return this._localMatrix;
            }
            else if (this.parent._hasChanged) {
                return this._localMatrix.mult(this.parent._bottomUpRecursiveMatrixUpdate());
            }
            else {
                return this._localMatrix.mult(this.parent._globalMatrix);
            }
        }
        _topDownRecursiveFlagUpdate() {
            for (const child of this.children) {
                child._hasChanged = true;
                child._topDownRecursiveFlagUpdate();
            }
        }
    }
    exports.TransformBase = TransformBase;
    const Transform = TransformBase;
    exports.Transform = Transform;
});
define("engine/libs/maths/extensions/pools/Vector3Pools", ["require", "exports", "engine/libs/maths/algebra/vectors/Vector3", "engine/libs/patterns/pools/StackPool"], function (require, exports, Vector3_2, StackPool_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Vector3Pool = void 0;
    const Vector3Pool = new StackPool_2.StackPool(Vector3_2.Vector3Base);
    exports.Vector3Pool = Vector3Pool;
});
define("engine/libs/maths/geometry/primitives/Plane", ["require", "exports", "engine/libs/maths/algebra/vectors/Vector3", "engine/libs/maths/extensions/pools/Vector3Pools", "engine/libs/patterns/injectors/Injector"], function (require, exports, Vector3_3, Vector3Pools_1, Injector_7) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PlaneBase = exports.PlaneInjector = exports.Plane = void 0;
    class PlaneBase {
        constructor(normal, constant) {
            this._normal = normal || new Vector3_3.Vector3([0, 0, 0]);
            this._constant = constant || 0;
        }
        static fromNormalAndConstant(normal, constant) {
            return new PlaneBase().setFromNormalAndConstant(normal, constant);
        }
        static fromNormalAndCoplanarPoint(normal, point) {
            return new PlaneBase().setFromNormalAndCoplanarPoint(normal, point);
        }
        static fromCoplanarPoints(a, b, c) {
            return new PlaneBase().setFromCoplanarPoints(a, b, c);
        }
        get normal() {
            return this._normal;
        }
        set normal(normal) {
            this._normal = normal;
        }
        get constant() {
            return this._constant;
        }
        set constant(constant) {
            this._constant = constant;
        }
        copy(plane) {
            this._normal = plane._normal.clone();
            this._constant = plane._constant;
            return this;
        }
        set(x, y, z, constant) {
            this._normal.setValues([x, y, z]);
            this._constant = constant;
            return this;
        }
        setFromNormalAndConstant(normal, constant) {
            this._normal.copy(normal);
            this._constant = constant;
            return this;
        }
        setFromNormalAndCoplanarPoint(normal, point) {
            this._normal.copy(normal);
            this._constant = -point.dot(this._normal);
            return this;
        }
        setFromCoplanarPoints(point1, point2, point3) {
            const normal = point3.clone();
            Vector3Pools_1.Vector3Pool.acquireTemp(1, (temp) => {
                temp.copy(point1);
                normal.sub(point2).cross(temp.sub(point2)).normalize();
                this.setFromNormalAndCoplanarPoint(normal, point1);
            });
            return this;
        }
        distanceToPoint(point) {
            return this._normal.dot(point) + this._constant;
        }
        normalized() {
            const inverseNormalLength = 1.0 / this._normal.len();
            this._normal.multScalar(inverseNormalLength);
            this._constant *= inverseNormalLength;
            return this;
        }
    }
    exports.PlaneBase = PlaneBase;
    var Plane = PlaneBase;
    exports.Plane = Plane;
    const PlaneInjector = new Injector_7.Injector({
        defaultCtor: PlaneBase,
        onDefaultOverride: (ctor) => {
            exports.Plane = Plane = ctor;
        }
    });
    exports.PlaneInjector = PlaneInjector;
});
define("engine/libs/maths/geometry/primitives/Triangle", ["require", "exports", "engine/libs/maths/algebra/vectors/Vector3", "engine/libs/patterns/pools/StackPool", "engine/libs/patterns/injectors/Injector", "engine/libs/maths/extensions/pools/Vector3Pools"], function (require, exports, Vector3_4, StackPool_3, Injector_8, Vector3Pools_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TrianglePool = exports.TriangleBase = exports.TriangleInjector = exports.Triangle = void 0;
    class TriangleBase {
        constructor(point1, point2, point3) {
            this._point1 = point1 || new Vector3_4.Vector3();
            this._point2 = point2 || new Vector3_4.Vector3();
            this._point3 = point3 || new Vector3_4.Vector3();
        }
        get point1() {
            return this._point1;
        }
        set point1(point1) {
            this._point1 = point1;
        }
        get point2() {
            return this._point2;
        }
        set point2(point2) {
            this._point2 = point2;
        }
        get point3() {
            return this._point3;
        }
        set point3(point3) {
            this._point3 = point3;
        }
        getValues() {
            const point1 = this._point1, point2 = this._point2, point3 = this._point3;
            return [
                point1.x, point1.y, point1.z,
                point2.x, point2.y, point2.z,
                point3.x, point3.y, point3.z
            ];
        }
        set(point1, point2, point3) {
            this._point1.copy(point1);
            this._point2.copy(point2);
            this._point3.copy(point3);
            return this;
        }
        setValues(values) {
            this._point1.setValues([values[0], values[1], values[2]]);
            this._point2.setValues([values[3], values[4], values[5]]);
            this._point3.setValues([values[6], values[7], values[8]]);
            return this;
        }
        clone() {
            return new TriangleBase().copy(this);
        }
        copy(triangle) {
            this._point1 = triangle._point1;
            this._point2 = triangle._point2;
            this._point3 = triangle._point3;
            return this;
        }
        getNormal(out) {
            Vector3Pools_2.Vector3Pool.acquireTemp(1, (temp) => {
                out.copyAndSub(this._point2, this.point1);
                temp.copyAndSub(this._point3, this.point1);
                out.cross(temp).normalize();
            });
            return out;
        }
        getBarycentricCoordinates(point, out) {
            Vector3Pools_2.Vector3Pool.acquireTemp(3, (v1, v2, vp) => {
                v1.copyAndSub(this._point2, this._point1),
                    v2.copyAndSub(this._point3, this._point1),
                    vp.copyAndSub(point, this._point1);
                const dotxx = v1.dot(v1);
                const dotxy = v1.dot(v2);
                const dotxz = v1.dot(vp);
                const dotyy = v2.dot(v2);
                const dotyz = v2.dot(vp);
                const denom = (dotxx * dotyy - dotxy * dotxy);
                if (denom === 0) {
                    // TODO: Handle ?
                    out.setValues([-2, -1, -1]);
                    return;
                }
                const invDenom = 1 / denom;
                const u = (dotyy * dotxz - dotxy * dotyz) * invDenom;
                const v = (dotxx * dotyz - dotxy * dotxz) * invDenom;
                out.setValues([1 - u - v, v, u]);
            });
            return out;
        }
        *sharedPointsWith(triangle) {
            if (this._point1.equals(triangle._point1) || this._point1.equals(triangle._point2) || this._point1.equals(triangle._point3))
                yield this._point1;
            if (this._point2.equals(triangle._point1) || this._point2.equals(triangle._point2) || this._point2.equals(triangle._point3))
                yield this._point2;
            if (this._point3.equals(triangle._point1) || this._point3.equals(triangle._point2) || this._point3.equals(triangle._point3))
                yield this._point3;
        }
        indexOfPoint(point) {
            return (point.equals(this._point1)) ? 0 :
                (point.equals(this._point2)) ? 1 :
                    (point.equals(this._point3)) ? 2 : -1;
        }
        containsPoint(point) {
            let contains = false;
            Vector3Pools_2.Vector3Pool.acquireTemp(1, (pointCoords) => {
                this.getBarycentricCoordinates(point, pointCoords);
                contains = (pointCoords.x >= 0) && (pointCoords.y >= 0) && ((pointCoords.x + pointCoords.y) <= 1);
            });
            return contains;
        }
        getUV(point, uv1, uv2, uv3, out) {
            Vector3Pools_2.Vector3Pool.acquireTemp(1, (pointCoords) => {
                this.getBarycentricCoordinates(point, pointCoords);
                out.setZeros();
                out.addScaled(uv1, pointCoords.x);
                out.addScaled(uv2, pointCoords.y);
                out.addScaled(uv3, pointCoords.z);
            });
            return out;
        }
        isFrontFacing(direction) {
            let result = false;
            Vector3Pools_2.Vector3Pool.acquireTemp(2, (v1, v2) => {
                v1.copyAndSub(this._point2, this._point1),
                    v2.copyAndSub(this._point3, this._point1);
                result = (v1.cross(v2).dot(direction) < 0);
            });
            return result;
        }
        getArea() {
            let area = 0;
            Vector3Pools_2.Vector3Pool.acquireTemp(2, (v1, v2) => {
                v1.copyAndSub(this._point2, this._point1),
                    v2.copyAndSub(this._point3, this._point1);
                area = v1.cross(v2).len() * 0.5;
            });
            return area;
        }
        getMidpoint(out) {
            return out.copy(this._point1).add(this._point2).add(this._point3).multScalar(1 / 3);
        }
        getPlane(out) {
            throw Error('Not implemented yet.');
        }
        closestPointToPoint(point, out) {
            const point1 = this._point1, point2 = this._point2, point3 = this._point3;
            let v, w;
            Vector3Pools_2.Vector3Pool.acquireTemp(4, (vb, vc, vp, vbp) => {
                vb.copyAndSub(point2, point1),
                    vc.copyAndSub(point3, point1),
                    vp.copyAndSub(point, point1);
                const d1 = vb.dot(vp);
                const d2 = vc.dot(vp);
                if (d1 <= 0 && d2 <= 0) {
                    return out.copy(point1);
                }
                vbp.copyAndSub(point, point2);
                const d3 = point1.dot(vbp);
                const d4 = vc.dot(vbp);
                if (d3 >= 0 && d4 <= d3) {
                    return out.copy(point2);
                }
                const dc = d1 * d4 - d3 * d2;
                if (dc <= 0 && d1 >= 0 && d3 <= 0) {
                    v = d1 / (d1 - d3);
                    return out.copy(point1).addScaled(vb, v);
                }
                vp.copyAndSub(point, point3);
                const d5 = vb.dot(vp);
                const d6 = vc.dot(vp);
                if (d6 >= 0 && d5 <= d6) {
                    return out.copy(point3);
                }
                const db = d5 * d2 - d1 * d6;
                if (db <= 0 && d2 >= 0 && d6 <= 0) {
                    w = d2 / (d2 - d6);
                    return out.copy(point1).addScaled(vc, w);
                }
                const da = d3 * d6 - d5 * d4;
                if (da <= 0 && (d4 - d3) >= 0 && (d5 - d6) >= 0) {
                    vc.copyAndSub(point3, point2);
                    w = (d4 - d3) / ((d4 - d3) + (d5 - d6));
                    return out.copy(point2).addScaled(vc, w);
                }
                const denom = 1 / (da + db + dc);
                v = db * denom;
                w = dc * denom;
                out.copy(point1).addScaled(vb, v).addScaled(vc, w);
            });
            return out;
        }
        equals(triangle) {
            return triangle._point1.equals(this._point1)
                && triangle._point2.equals(this._point2)
                && triangle._point3.equals(this._point3);
        }
        translate(vec) {
            this._point1.add(vec);
            this._point2.add(vec);
            this._point3.add(vec);
        }
        transform(mat) {
            this._point1.setValues(mat.transformDirection(this._point1));
            this._point2.setValues(mat.transformDirection(this._point2));
            this._point3.setValues(mat.transformDirection(this._point3));
        }
        readFromArray(arr, offset) {
            this.point1.readFromArray(arr, offset);
            this.point2.readFromArray(arr, offset + 3);
            this.point3.readFromArray(arr, offset + 6);
            return this;
        }
        writeIntoArray(arr, offset) {
            this.point1.writeIntoArray(arr, offset);
            this.point2.writeIntoArray(arr, offset + 3);
            this.point3.writeIntoArray(arr, offset + 6);
        }
    }
    exports.TriangleBase = TriangleBase;
    var Triangle = TriangleBase;
    exports.Triangle = Triangle;
    const TriangleInjector = new Injector_8.Injector({
        defaultCtor: TriangleBase,
        onDefaultOverride: (ctor) => {
            exports.Triangle = Triangle = ctor;
        }
    });
    exports.TriangleInjector = TriangleInjector;
    const TrianglePool = new StackPool_3.StackPool(TriangleBase);
    exports.TrianglePool = TrianglePool;
});
define("engine/libs/maths/extensions/lists/TriangleList", ["require", "exports", "engine/libs/maths/geometry/primitives/Triangle", "engine/libs/maths/Snippets"], function (require, exports, Triangle_1, Snippets_7) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TriangleListBase = exports.TriangleList = void 0;
    class TriangleListBase {
        constructor(array) {
            this._array = array || [];
        }
        get array() {
            return this._array;
        }
        get count() {
            return Math.floor(this._array.length / 9);
        }
        setArray(array) {
            this._array = array;
            return this;
        }
        get(idx, tri) {
            if (idx >= this.count) {
                throw new Error(`Index ${idx} out of bounds.`);
            }
            return tri.readFromArray(this._array, idx * 9);
        }
        set(idx, tri) {
            if (idx >= this.count) {
                throw new Error(`Index ${idx} out of bounds.`);
            }
            tri.writeIntoArray(this._array, idx * 9);
        }
        indexOf(tri) {
            const count = this.count;
            let idxBuf = 0, idxObj = 0, indexOf = -1;
            const tempTri = Triangle_1.TrianglePool.acquire();
            {
                while (idxBuf < count) {
                    tempTri.readFromArray(this._array, idxBuf);
                    if (tri.equals(tempTri)) {
                        indexOf = idxObj;
                        idxObj += 1;
                        break;
                    }
                    idxObj += 1;
                    idxBuf += 9;
                }
            }
            Triangle_1.TrianglePool.release(1);
            return indexOf;
        }
        forEach(func, options = { idxTo: this.count, idxFrom: 0 }) {
            const idxTo = Snippets_7.clamp(options.idxTo, 0, this.count);
            const idxFrom = Snippets_7.clamp(options.idxFrom, 0, idxTo);
            let idxObj = idxFrom;
            const tempTri = Triangle_1.TrianglePool.acquire();
            {
                while (idxObj < idxTo) {
                    this.get(idxObj, tempTri);
                    func(tempTri, idxObj);
                    idxObj += 1;
                }
            }
            Triangle_1.TrianglePool.release(1);
        }
        getIndexedPoints(indices, tri) {
            tri.point1.readFromArray(this._array, indices[0]);
            tri.point2.readFromArray(this._array, indices[1]);
            tri.point3.readFromArray(this._array, indices[2]);
        }
        forIndexedPoints(func, indices, options = { idxTo: indices.length / 3, idxFrom: 0 }) {
            const idxTo = Snippets_7.clamp(options.idxTo, 0, indices.length / 3);
            const idxFrom = Snippets_7.clamp(options.idxFrom, 0, idxTo);
            let idxBuf = idxFrom * 3;
            const tempTri = Triangle_1.TrianglePool.acquire();
            {
                const pointsIndices = [0, 0, 0];
                for (let idxObj = idxFrom; idxObj < idxTo; idxObj++) {
                    pointsIndices[0] = indices[idxBuf];
                    pointsIndices[1] = indices[idxBuf + 1];
                    pointsIndices[2] = indices[idxBuf + 2];
                    tempTri.point1.readFromArray(this._array, pointsIndices[0] * 3);
                    tempTri.point2.readFromArray(this._array, pointsIndices[1] * 3);
                    tempTri.point3.readFromArray(this._array, pointsIndices[2] * 3);
                    func(tempTri, idxObj, pointsIndices);
                    idxBuf += 3;
                }
            }
            Triangle_1.TrianglePool.release(1);
        }
    }
    exports.TriangleListBase = TriangleListBase;
    const TriangleList = TriangleListBase;
    exports.TriangleList = TriangleList;
});
define("engine/libs/maths/extensions/lists/Vector3List", ["require", "exports", "engine/libs/maths/extensions/pools/Vector3Pools", "engine/libs/maths/Snippets"], function (require, exports, Vector3Pools_3, Snippets_8) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Vector3ListBase = exports.Vector3List = void 0;
    class Vector3ListBase {
        constructor(array) {
            this._array = array || [];
        }
        get array() {
            return this._array;
        }
        get count() {
            return Math.floor(this._array.length / 3);
        }
        setArray(array) {
            this._array = array;
            return this;
        }
        forEach(func, options = { idxTo: this.count, idxFrom: 0 }) {
            const count = this.count;
            const idxTo = Snippets_8.clamp(options.idxTo, 0, count);
            const idxFrom = Snippets_8.clamp(options.idxFrom, 0, idxTo);
            let idxObj = idxFrom;
            const tempVec = Vector3Pools_3.Vector3Pool.acquire();
            {
                while (idxObj < count) {
                    this.get(idxObj, tempVec);
                    func(tempVec, idxObj);
                    idxObj += 1;
                }
            }
            Vector3Pools_3.Vector3Pool.release(1);
        }
        forEachFromIndices(func, indices, options = { idxTo: indices.length / 3, idxFrom: 0 }) {
            const idxTo = Snippets_8.clamp(options.idxTo, 0, indices.length / 3);
            const idxFrom = Snippets_8.clamp(options.idxFrom, 0, idxTo);
            let idxBuf = idxFrom * 3;
            const tempVec = Vector3Pools_3.Vector3Pool.acquire();
            {
                for (let idxObj = idxFrom; idxObj < idxTo; idxObj++) {
                    const indice = indices[idxBuf];
                    this.get(indice, tempVec);
                    func(tempVec, idxObj, indice);
                }
            }
            Vector3Pools_3.Vector3Pool.release(1);
        }
        indexOf(vec) {
            const count = this.count;
            let idxBuf = 0, idxObj = 0, indexOf = -1;
            const tempVec = Vector3Pools_3.Vector3Pool.acquire();
            {
                while (idxBuf < count) {
                    tempVec.readFromArray(this._array, idxBuf);
                    if (vec.equals(tempVec)) {
                        indexOf = idxObj;
                        break;
                    }
                    idxObj += 1;
                    idxBuf += 3;
                }
            }
            Vector3Pools_3.Vector3Pool.release(1);
            return indexOf;
        }
        get(idx, vec) {
            if (idx >= this.count) {
                throw new Error(`Index ${idx} out of bounds.`);
            }
            return vec.readFromArray(this._array, idx * 3);
        }
        set(idx, vec) {
            if (idx >= this.count) {
                throw new Error(`Index ${idx} out of bounds.`);
            }
            vec.writeIntoArray(this._array, idx * 3);
        }
    }
    exports.Vector3ListBase = Vector3ListBase;
    const Vector3List = Vector3ListBase;
    exports.Vector3List = Vector3List;
});
define("engine/libs/maths/extensions/pools/lists/TriangleListPools", ["require", "exports", "engine/libs/maths/extensions/lists/TriangleList", "engine/libs/patterns/pools/StackPool"], function (require, exports, TriangleList_1, StackPool_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TriangleListPool = void 0;
    const TriangleListPool = new StackPool_4.StackPool(TriangleList_1.TriangleListBase);
    exports.TriangleListPool = TriangleListPool;
});
define("engine/libs/maths/extensions/pools/lists/Vector3ListPools", ["require", "exports", "engine/libs/maths/extensions/lists/Vector3List", "engine/libs/patterns/pools/StackPool"], function (require, exports, Vector3List_1, StackPool_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Vector3ListPool = void 0;
    const Vector3ListPool = new StackPool_5.StackPool(Vector3List_1.Vector3ListBase);
    exports.Vector3ListPool = Vector3ListPool;
});
define("engine/core/rendering/scenes/geometries/GeometryUtils", ["require", "exports", "engine/libs/maths/extensions/pools/Vector3Pools", "engine/libs/maths/extensions/pools/lists/TriangleListPools", "engine/libs/maths/extensions/pools/lists/Vector3ListPools"], function (require, exports, Vector3Pools_4, TriangleListPools_1, Vector3ListPools_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.GeometryUtils = void 0;
    class GeometryUtils {
        static computeTangentsAndBitangents(verticesArray, uvsArray, indicesArray, type) {
            const tangentsArray = new type(verticesArray.length);
            const bitangentsArray = new type(verticesArray.length);
            for (let i = 0; i < verticesArray.length; i += 3) {
                const vertStride = 3;
                const p1x = verticesArray[indicesArray[i] * vertStride], p1y = verticesArray[indicesArray[i] * vertStride + 1], p1z = verticesArray[indicesArray[i] * vertStride + 2], p2x = verticesArray[indicesArray[i + 1] * vertStride], p2y = verticesArray[indicesArray[i + 1] * vertStride + 1], p2z = verticesArray[indicesArray[i + 1] * vertStride + 2], p3x = verticesArray[indicesArray[i + 2] * vertStride], p3y = verticesArray[indicesArray[i + 2] * vertStride + 1], p3z = verticesArray[indicesArray[i + 2] * vertStride + 2];
                const edge1x = p2x - p1x, edge1y = p2y - p1y, edge1z = p2z - p1z;
                const edge2x = p3x - p1x, edge2y = p3y - p1y, edge2z = p3z - p1z;
                const uvStride = 2;
                const deltaUV1x = uvsArray[indicesArray[i + 1] * uvStride] - uvsArray[indicesArray[i] * uvStride], deltaUV1y = uvsArray[indicesArray[i + 1] * uvStride + 1] - uvsArray[indicesArray[i] * uvStride + 1], deltaUV2x = uvsArray[indicesArray[i + 2] * uvStride] - uvsArray[indicesArray[i] * uvStride], deltaUV2y = uvsArray[indicesArray[i + 2] * uvStride + 1] - uvsArray[indicesArray[i] * uvStride + 1];
                const r = 1.0 / (deltaUV1x * deltaUV2y - deltaUV1y * deltaUV2x);
                const tx = (edge1x * deltaUV2y - edge2x * deltaUV1y) * r;
                const ty = (edge1y * deltaUV2y - edge2y * deltaUV1y) * r;
                const tz = (edge1z * deltaUV2y - edge2z * deltaUV1y) * r;
                const btx = (edge2x * deltaUV1x - edge1x * deltaUV2x) * r;
                const bty = (edge2y * deltaUV1x - edge1y * deltaUV2x) * r;
                const btz = (edge2z * deltaUV1x - edge1z * deltaUV2x) * r;
                tangentsArray[indicesArray[i] * vertStride] = tx;
                tangentsArray[indicesArray[i] * vertStride + 1] = ty;
                tangentsArray[indicesArray[i] * vertStride + 2] = tz;
                tangentsArray[indicesArray[i + 1] * vertStride] = tx;
                tangentsArray[indicesArray[i + 1] * vertStride + 1] = ty;
                tangentsArray[indicesArray[i + 1] * vertStride + 2] = tz;
                tangentsArray[indicesArray[i + 2] * vertStride] = tx;
                tangentsArray[indicesArray[i + 2] * vertStride + 1] = ty;
                tangentsArray[indicesArray[i + 2] * vertStride + 2] = tz;
                bitangentsArray[indicesArray[i] * vertStride] = btx;
                bitangentsArray[indicesArray[i] * vertStride + 1] = bty;
                bitangentsArray[indicesArray[i] * vertStride + 2] = btz;
                bitangentsArray[indicesArray[i + 1] * vertStride] = btx;
                bitangentsArray[indicesArray[i + 1] * vertStride + 1] = bty;
                bitangentsArray[indicesArray[i + 1] * vertStride + 2] = btz;
                bitangentsArray[indicesArray[i + 2] * vertStride] = btx;
                bitangentsArray[indicesArray[i + 2] * vertStride + 1] = bty;
                bitangentsArray[indicesArray[i + 2] * vertStride + 2] = btz;
            }
            return {
                tangentsArray: tangentsArray,
                bitangentsArray: bitangentsArray,
            };
        }
        static computeFacesNormals(verticesArray, indicesArray, type) {
            const facesNormalsArray = new type(indicesArray.length);
            let faces = TriangleListPools_1.TriangleListPool.acquire().setArray(verticesArray);
            let facesNormals = Vector3ListPools_1.Vector3ListPool.acquire().setArray(facesNormalsArray);
            let normal = Vector3Pools_4.Vector3Pool.acquire();
            faces.forIndexedPoints((face, idx) => {
                face.getNormal(normal);
                facesNormals.set(idx, normal);
            }, indicesArray);
            Vector3Pools_4.Vector3Pool.release(1);
            Vector3ListPools_1.Vector3ListPool.release(1);
            TriangleListPools_1.TriangleListPool.release(1);
            return facesNormalsArray;
        }
        static computeVerticesNormals(verticesArray, indicesArray, weighted, type, facesNormalsArray) {
            const verticesNormalsArray = new type(verticesArray.length);
            let verticesNormals = Vector3ListPools_1.Vector3ListPool.acquire().setArray(verticesNormalsArray);
            let vertices = Vector3ListPools_1.Vector3ListPool.acquire().setArray(verticesArray);
            let faces = TriangleListPools_1.TriangleListPool.acquire().setArray(verticesArray);
            let facesNormals = Vector3ListPools_1.Vector3ListPool.acquire().setArray(facesNormalsArray ? facesNormalsArray : this.computeFacesNormals(verticesArray, indicesArray, type));
            Vector3Pools_4.Vector3Pool.acquireTemp(2, (vertexNormalsSum, faceNormal) => {
                if (weighted) {
                    vertices.forEach((vert, vertIdx) => {
                        verticesNormals.get(vertIdx, vertexNormalsSum);
                        faces.forIndexedPoints((face, faceIdx) => {
                            if (face.indexOfPoint(vert) > -1) {
                                facesNormals.get(faceIdx, faceNormal);
                                vertexNormalsSum.add(faceNormal.multScalar(face.getArea()));
                            }
                        }, indicesArray);
                        vertexNormalsSum.normalize();
                        verticesNormals.set(vertIdx, vertexNormalsSum);
                    });
                }
                else {
                    faces.forIndexedPoints((face, faceIdx, pointsIndices) => {
                        face.getNormal(faceNormal);
                        verticesNormals.set(pointsIndices[0], faceNormal);
                        verticesNormals.set(pointsIndices[1], faceNormal);
                        verticesNormals.set(pointsIndices[2], faceNormal);
                    }, indicesArray);
                }
            });
            return verticesNormalsArray;
        }
    }
    exports.GeometryUtils = GeometryUtils;
});
define("engine/libs/maths/extensions/pools/Vector2Pools", ["require", "exports", "engine/libs/maths/algebra/vectors/Vector2", "engine/libs/patterns/pools/StackPool"], function (require, exports, Vector2_2, StackPool_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Vector2Pool = void 0;
    const Vector2Pool = new StackPool_6.StackPool(Vector2_2.Vector2Base);
    exports.Vector2Pool = Vector2Pool;
});
define("engine/libs/maths/extensions/lists/Vector2List", ["require", "exports", "engine/libs/maths/extensions/pools/Vector2Pools", "engine/libs/maths/Snippets"], function (require, exports, Vector2Pools_1, Snippets_9) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Vector2ListBase = exports.Vector2List = void 0;
    class Vector2ListBase {
        constructor(array) {
            this._array = array || [];
        }
        get array() {
            return this._array;
        }
        get count() {
            return Math.floor(this._array.length / 2);
        }
        setArray(array) {
            this._array = array;
            return this;
        }
        forEach(func, options = { idxTo: this.count, idxFrom: 0 }) {
            const count = this.count;
            const idxTo = Snippets_9.clamp(options.idxTo, 0, count);
            const idxFrom = Snippets_9.clamp(options.idxFrom, 0, idxTo);
            let idxObj = idxFrom;
            Vector2Pools_1.Vector2Pool.acquireTemp(1, (vector) => {
                while (idxObj < count) {
                    this.get(idxObj, vector);
                    func(vector, idxObj);
                    idxObj += 1;
                }
            });
        }
        indexOf(vec) {
            const count = this.count;
            let idxBuf = 0, idxObj = 0, indexOf = -1;
            Vector2Pools_1.Vector2Pool.acquireTemp(1, (vector) => {
                while (idxBuf < count) {
                    vector.readFromArray(this._array, idxBuf);
                    if (vector.equals(vec)) {
                        indexOf = idxObj;
                        break;
                    }
                    idxObj += 1;
                    idxBuf += 2;
                }
            });
            return indexOf;
        }
        get(idx, vec) {
            if (idx >= this.count) {
                throw new Error(`Index ${idx} out of bounds.`);
            }
            return vec.readFromArray(this._array, idx * 2);
        }
        set(idx, vec) {
            if (idx >= this.count) {
                throw new Error(`Index ${idx} out of bounds.`);
            }
            vec.readFromArray(this._array, idx * 2);
        }
    }
    exports.Vector2ListBase = Vector2ListBase;
    const Vector2List = Vector2ListBase;
    exports.Vector2List = Vector2List;
});
define("engine/libs/physics/collisions/BoundingSphere", ["require", "exports", "engine/libs/maths/algebra/vectors/Vector3", "engine/libs/physics/collisions/BoundingBox", "engine/libs/patterns/injectors/Injector"], function (require, exports, Vector3_5, BoundingBox_1, Injector_9) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BoundingSphereBase = exports.BoundingSphereInjector = exports.BoundingSphere = void 0;
    class BoundingSphereBase {
        constructor() {
            this._center = new Vector3_5.Vector3([-Infinity, -Infinity, -Infinity]);
            this._radius = 0;
        }
        get center() {
            return this._center;
        }
        set center(center) {
            this._center = center;
        }
        get radius() {
            return this._radius;
        }
        set radius(radius) {
            this._radius = radius;
        }
        set(center, radius) {
            this._center.copy(center);
            this._radius = radius;
            return this;
        }
        copy(sphere) {
            this._center.copy(sphere._center);
            this._radius = sphere._radius;
            return this;
        }
        clone() {
            return new BoundingSphereBase().copy(this);
        }
        setFromPoints(points, center) {
            if (center !== undefined) {
                this._center.copy(center);
            }
            else {
                BoundingBox_1.BoundingBoxPool.acquireTemp(1, (box) => {
                    box.setFromPoints(points).getCenter(this._center);
                });
            }
            let maxRadiusSq = 0;
            points.forEach((point) => {
                maxRadiusSq = Math.max(maxRadiusSq, this._center.distSq(point));
            });
            this._radius = Math.sqrt(maxRadiusSq);
            return this;
        }
        isEmpty() {
            return (this._radius < 0);
        }
        makeEmpty() {
            this._center.setZeros();
            this._radius = -1;
            return this;
        }
        containsPoint(point) {
            return (point.distSq(this._center) <= (this._radius * this._radius));
        }
        dist(point) {
            return (point.dist(this._center) - this._radius);
        }
        distToPlane(plane) {
            return plane.distanceToPoint(this._center) - this._radius;
        }
        intersectsSphere(sphere) {
            const radiusSum = this._radius + sphere._radius;
            return this._center.distSq(sphere._center) <= (radiusSum * radiusSum);
        }
        intersectsBox(box) {
            return box.intersectsSphere(this);
        }
        intersectsPlane(plane) {
            return Math.abs(plane.distanceToPoint(this._center)) <= this._radius;
        }
        clampPoint(point, out) {
            const deltaLenSq = this._center.distSq(point);
            out.copy(point);
            if (deltaLenSq > (this._radius * this._radius)) {
                out.sub(this._center).normalize();
                out.multScalar(this._radius).add(this._center);
            }
            return out;
        }
        getBoundingBox(out) {
            if (this.isEmpty()) {
                out.makeEmpty();
                return out;
            }
            out.set(this._center, this._center);
            out.expandByScalar(this._radius);
            return out;
        }
        transform(mat) {
            this._center.setValues(mat.transformPoint(this._center));
            this._radius = this._radius * mat.getMaxScaleOnAxis();
        }
        translate(offset) {
            this._center.add(offset);
        }
    }
    exports.BoundingSphereBase = BoundingSphereBase;
    var BoundingSphere = BoundingSphereBase;
    exports.BoundingSphere = BoundingSphere;
    const BoundingSphereInjector = new Injector_9.Injector({
        defaultCtor: BoundingSphereBase,
        onDefaultOverride: (ctor) => {
            exports.BoundingSphere = BoundingSphere = ctor;
        }
    });
    exports.BoundingSphereInjector = BoundingSphereInjector;
});
define("engine/libs/physics/collisions/BoundingBox", ["require", "exports", "engine/libs/maths/algebra/vectors/Vector3", "engine/libs/patterns/injectors/Injector", "engine/libs/patterns/pools/StackPool", "engine/libs/maths/extensions/pools/Vector3Pools"], function (require, exports, Vector3_6, Injector_10, StackPool_7, Vector3Pools_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BoundingBoxPool = exports.BoundingBoxBase = exports.BoundingBoxInjector = exports.BoundingBox = void 0;
    class BoundingBoxBase {
        constructor() {
            this._min = new Vector3_6.Vector3([-Infinity, -Infinity, -Infinity]);
            this._max = new Vector3_6.Vector3([+Infinity, +Infinity, +Infinity]);
        }
        get min() {
            return this._min;
        }
        set min(min) {
            this._min = min;
        }
        get max() {
            return this._max;
        }
        set max(max) {
            this._max = max;
        }
        set(min, max) {
            this._min.copy(min);
            this._max.copy(max);
        }
        copy(box) {
            this._min = box._min;
            this._max = box._max;
            return this;
        }
        clone(box) {
            return new BoundingBoxBase().copy(box);
        }
        makeEmpty() {
            this._min.setValues([Infinity, Infinity, Infinity]);
            this._max.setValues([+Infinity, +Infinity, +Infinity]);
        }
        isEmpty() {
            return (this._max.x < this._min.x) || (this._max.y < this._min.y) || (this._max.z < this._min.z);
        }
        getCenter(out) {
            this.isEmpty() ? out.setValues([0, 0, 0]) : out.copy(this._min).add(this._max).multScalar(0.5);
            return out;
        }
        getSize(out) {
            this.isEmpty() ? out.setValues([0, 0, 0]) : out.copy(this._max).sub(this._min);
            return out;
        }
        setFromLengths(center, length, width, height) {
            this._min.setValues([center.x - length / 2, center.y - width / 2, center.z - height / 2]);
            this._max.setValues([center.x + length / 2, center.y + width / 2, center.z + height / 2]);
            return this;
        }
        setFromPoints(points) {
            this.makeEmpty();
            points.forEach((vec) => {
                this.expandByPoint(vec);
            });
            return this;
        }
        expandByPoint(point) {
            this._min.min(point);
            this._max.min(point);
            return this;
        }
        expandByVector(vector) {
            this._min.sub(vector);
            this._max.add(vector);
            return this;
        }
        expandByScalar(k) {
            this._min.addScalar(-k);
            this._max.addScalar(k);
            return this;
        }
        clampPoint(point, out) {
            return out.copy(point).clamp(this._min, this._max);
        }
        distanceToPoint(point) {
            let dist = 0;
            Vector3Pools_5.Vector3Pool.acquireTemp(1, (temp) => {
                const clampedPoint = temp.copy(point).clamp(this._min, this._max);
                dist = clampedPoint.sub(point).len();
            });
            return dist;
        }
        intersectsPlane(plane) {
            let min = 0, max = 0;
            if (plane.normal.x > 0) {
                min = plane.normal.x * this._min.x;
                max = plane.normal.x * this._max.x;
            }
            else {
                min = plane.normal.x * this._max.x;
                max = plane.normal.x * this._min.x;
            }
            if (plane.normal.y > 0) {
                min += plane.normal.y * this._min.y;
                max += plane.normal.y * this._max.y;
            }
            else {
                min += plane.normal.y * this._max.y;
                max += plane.normal.y * this._min.y;
            }
            if (plane.normal.z > 0) {
                min += plane.normal.z * this._min.z;
                max += plane.normal.z * this._max.z;
            }
            else {
                min += plane.normal.z * this._max.z;
                max += plane.normal.z * this._min.z;
            }
            return (min <= -plane.constant && max >= -plane.constant);
        }
        intersectsSphere(sphere) {
            let intersects = false;
            Vector3Pools_5.Vector3Pool.acquireTemp(1, (clamped) => {
                this.clampPoint(sphere.center, clamped);
                intersects = clamped.distSq(sphere.center) <= (sphere.radius * sphere.radius);
            });
            return intersects;
        }
        intersectsBox(box) {
            return !(box._max.x < this._min.x || box._min.x > this._max.x ||
                box._max.y < this._min.y || box._min.y > this._max.y ||
                box._max.z < this._min.z || box._min.z > this._max.z);
        }
        getBoundingSphere(out) {
            out.radius = this.getSize(out.center).len() * 0.5;
            this.getCenter(out.center);
            return out;
        }
        intersectsTriangle(triangle) {
            if (this.isEmpty()) {
                return false;
            }
            const point1 = triangle.point1, point2 = triangle.point2, point3 = triangle.point3;
            let intersects = false;
            Vector3Pools_5.Vector3Pool.acquireTemp(8, (center, extents, v1, v2, v3, edge1, edge2, edge3) => {
                this.getCenter(center);
                extents.copyAndSub(this._max, center),
                    v1.copyAndSub(point1, center),
                    v2.copyAndSub(point2, center),
                    v3.copyAndSub(point3, center),
                    edge1.copyAndSub(point2, point1),
                    edge2.copyAndSub(point3, point2),
                    edge3.copyAndSub(point1, point3);
                let axes = new Float32Array([
                    0, -edge1.z, edge1.y,
                    0, -edge2.z, edge2.y,
                    0, -edge3.z, edge3.y,
                    edge1.z, 0, -edge1.x,
                    edge2.z, 0, -edge2.x,
                    edge3.z, 0, -edge3.x,
                    -edge1.y, edge1.x, 0,
                    -edge2.y, edge2.x, 0,
                    -edge3.y, edge3.x, 0
                ]);
                if (!this.satForAxes(axes, v1, v2, v3, extents)) {
                    intersects = false;
                    return;
                }
                axes = new Float32Array([
                    1, 0, 0,
                    0, 1, 0,
                    0, 0, 1
                ]);
                if (!this.satForAxes(axes, v1, v2, v3, extents)) {
                    intersects = false;
                    return;
                }
                const triangleNormal = center.copyAndCross(edge1, edge2);
                intersects = this.satForAxes(triangleNormal.values, v1, v2, v3, extents);
            });
            return intersects;
        }
        satForAxes(axes, v1, v2, v3, extents) {
            let sat = true;
            Vector3Pools_5.Vector3Pool.acquireTemp(1, (axis) => {
                for (let i = 0, j = axes.length - 3; i <= j; i += 3) {
                    axis.x = axes[i];
                    axis.y = axes[i + 1];
                    axis.z = axes[i + 2];
                    const r = extents.x * Math.abs(axis.x) + extents.y * Math.abs(axis.y) + extents.z * Math.abs(axis.z);
                    const p1 = v1.dot(axis);
                    const p2 = v2.dot(axis);
                    const p3 = v3.dot(axis);
                    if (Math.max(-Math.max(p1, p2, p3), Math.min(p1, p2, p3)) > r) {
                        sat = false;
                    }
                }
            });
            return sat;
        }
    }
    exports.BoundingBoxBase = BoundingBoxBase;
    var BoundingBox = BoundingBoxBase;
    exports.BoundingBox = BoundingBox;
    const BoundingBoxInjector = new Injector_10.Injector({
        defaultCtor: BoundingBoxBase,
        onDefaultOverride: (ctor) => {
            exports.BoundingBox = BoundingBox = ctor;
        }
    });
    exports.BoundingBoxInjector = BoundingBoxInjector;
    const BoundingBoxPool = new StackPool_7.StackPool(BoundingBoxBase);
    exports.BoundingBoxPool = BoundingBoxPool;
});
// Vertices : counter clock-wise ordered
define("engine/core/rendering/scenes/geometries/Geometry", ["require", "exports", "engine/core/rendering/scenes/geometries/GeometryUtils", "engine/libs/maths/extensions/lists/TriangleList", "engine/libs/maths/extensions/lists/Vector2List", "engine/libs/maths/extensions/lists/Vector3List", "engine/libs/maths/statistics/random/UUIDGenerator", "engine/libs/physics/collisions/BoundingBox", "engine/libs/physics/collisions/BoundingSphere"], function (require, exports, GeometryUtils_1, TriangleList_2, Vector2List_1, Vector3List_2, UUIDGenerator_2, BoundingBox_2, BoundingSphere_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.GeometryBase = exports.isGeometry = exports.GeometryPropertyKeys = void 0;
    var GeometryPropertyKeys;
    (function (GeometryPropertyKeys) {
        GeometryPropertyKeys[GeometryPropertyKeys["vertices"] = 0] = "vertices";
        GeometryPropertyKeys[GeometryPropertyKeys["indices"] = 1] = "indices";
        GeometryPropertyKeys[GeometryPropertyKeys["uvs"] = 2] = "uvs";
        GeometryPropertyKeys[GeometryPropertyKeys["facesNormals"] = 3] = "facesNormals";
        GeometryPropertyKeys[GeometryPropertyKeys["verticesNormals"] = 4] = "verticesNormals";
        GeometryPropertyKeys[GeometryPropertyKeys["tangents"] = 5] = "tangents";
        GeometryPropertyKeys[GeometryPropertyKeys["bitangents"] = 6] = "bitangents";
    })(GeometryPropertyKeys || (GeometryPropertyKeys = {}));
    exports.GeometryPropertyKeys = GeometryPropertyKeys;
    function isGeometry(obj) {
        return obj.isGeometry;
    }
    exports.isGeometry = isGeometry;
    class GeometryBase {
        constructor(desc) {
            this.uuid = UUIDGenerator_2.UUIDGenerator.newUUID();
            this.isGeometry = true;
            this._verticesArray = desc.vertices;
            this._vertices = new Vector3List_2.Vector3List(this._verticesArray);
            this._faces = new TriangleList_2.TriangleList(this._verticesArray);
            this._indicesArray = desc.indices;
            this._uvsArray = desc.uvs;
            this._uvs = new Vector2List_1.Vector2List(this._uvsArray);
            this._weightedVerticesNormals = desc.weightedVerticesNormals || false;
            this._facesNormalsArray = GeometryUtils_1.GeometryUtils.computeFacesNormals(this._verticesArray, this._indicesArray, Float32Array);
            this._facesNormals = new Vector3List_2.Vector3List(this._facesNormalsArray);
            this._verticesNormalsArray = GeometryUtils_1.GeometryUtils.computeVerticesNormals(this._verticesArray, this._indicesArray, this._weightedVerticesNormals, Float32Array, this._facesNormalsArray);
            this._verticesNormals = new Vector3List_2.Vector3List(this._verticesNormalsArray);
            const { tangentsArray, bitangentsArray } = GeometryUtils_1.GeometryUtils.computeTangentsAndBitangents(this._verticesArray, this._uvsArray, this._indicesArray, Float32Array);
            this._tangentsArray = tangentsArray;
            this._bitangentsArray = bitangentsArray;
            this._tangents = new Vector3List_2.Vector3List(this._tangentsArray);
            this._bitangents = new Vector3List_2.Vector3List(this._bitangentsArray);
        }
        /*public builder(): GeometryBuilder {
            return new GeometryBuilderBase(this);
        }*/
        get indices() {
            return this._indicesArray;
        }
        get vertices() {
            return this._vertices;
        }
        get uvs() {
            return this._uvs;
        }
        get faces() {
            return this._faces;
        }
        get facesNormals() {
            return this._facesNormals;
        }
        get verticesNormals() {
            return this._verticesNormals;
        }
        get tangents() {
            return this._tangents;
        }
        get bitangents() {
            return this._bitangents;
        }
        get boundingBox() {
            return this._boundingBox;
        }
        get boundingSphere() {
            return this._boundingSphere;
        }
        /*public copy(geometry: GeometryBase): GeometryBase {
            this._verticesArray = geometry._verticesArray.slice();
            this._indicesArray = geometry._indicesArray.slice();
            this._uvsArray = geometry._uvsArray.slice();
            this._facesNormalsArray = geometry._facesNormalsArray.slice();
            this._verticesNormalsArray = geometry._verticesNormalsArray.slice();
            this._tangentsArray = geometry._tangentsArray.slice();
            this._bitangentsArray = geometry._bitangentsArray.slice();
    
            if (typeof geometry._boundingBox !== 'undefined') {
                this.computeBoundingBox();
            }
    
            if (typeof geometry._boundingSphere !== 'undefined') {
                this.computeBoundingSphere();
            }
    
            return this;
        }
    
        public updateVertices(vertices: TypedArray, offset: number = 0): GeometryBase {
            const idxFrom = offset;
            const idxTo = offset + vertices.length;
            this._verticesArray.set(vertices, offset);
            this._updateFacesNormals({idxFrom, idxTo});
            this._updateVerticesNormals(this._weightedVerticesNormals, {idxFrom, idxTo});
            //this._changes.publish({prop: GeometryPropertyKeys.vertices, section: [idxFrom, idxTo]});
            return this;
        }
    
        public updateUvs(uvs: TypedArray, offset: number = 0): GeometryBase {
            const idxFrom = offset;
            const idxTo = offset + uvs.length;
            this._uvsArray.set(uvs, offset);
            if (typeof this._tangents !== 'undefined') {
                this._updateTangentsAndBitangents({idxFrom, idxTo});
            }
            //this._changes.publish({prop: GeometryPropertyKeys.uvs, section: [idxFrom, idxTo]});
            return this;
        }
    
        public clone(): GeometryBase {
            return new GeometryBase({
                vertices: this._verticesArray.slice(),
                indices: this._indicesArray.slice(),
                uvs: this._uvsArray.slice()
            }).copy(this);
        }
    
        private _updateFacesNormals(options?: {
            idxFrom: number;
            idxTo: number;
        }): GeometryBase {
            GeometryUtils.computeFacesNormals(this._faces,  this._indicesArray, this._facesNormals, options);
            //this._changes.publish({prop: GeometryPropertyKeys.facesNormals, section: [options?.idxFrom || 0, options?.idxTo || this._facesNormals.buffer.length]});
            return this;
        }
    
        private _updateVerticesNormals(weighted: boolean = false, options?: {
            idxFrom: number;
            idxTo: number;
        }): GeometryBase {
            this._weightedVerticesNormals = weighted;
            if (typeof this.facesNormals === 'undefined') {
                this._updateFacesNormals();
            }
            GeometryUtils.computeVerticesNormals(this._vertices, this._faces, this._indicesArray, this._facesNormals!, this._verticesNormals, weighted, options);
            //this._changes.publish({prop: GeometryPropertyKeys.verticesNormals, section: [options?.idxFrom || 0, options?.idxTo || this._verticesNormals.buffer.length]});
            return this;
        }
    
        private _updateTangentsAndBitangents(options?: {
            idxFrom: number;
            idxTo: number;
        }): GeometryBase {
            //this._changes.publish({prop: GeometryPropertyKeys.tangents, section: [options?.idxFrom || 0, options?.idxTo || this._tangents.buffer.length]});
            //this._changes.publish({prop: GeometryPropertyKeys.bitangents, section: [options?.idxFrom || 0, options?.idxTo || this._bitangents.buffer.length]});
            GeometryUtils.computeTangentsAndBitangents(this._verticesArray, this._uvsArray, this._indicesArray, this._tangentsArray, this._bitangentsArray, options);
            return this;
        }*/
        computeBoundingBox() {
            if (this._boundingBox === undefined) {
                this._boundingBox = new BoundingBox_2.BoundingBox().setFromPoints(this._vertices);
            }
            else {
                this._boundingBox.setFromPoints(this._vertices);
            }
            return this._boundingBox;
        }
        computeBoundingSphere() {
            if (this._boundingSphere === undefined) {
                this._boundingSphere = new BoundingSphere_1.BoundingSphere().setFromPoints(this._vertices);
            }
            else {
                this._boundingSphere.setFromPoints(this._vertices);
            }
            return this._boundingSphere;
        }
    }
    exports.GeometryBase = GeometryBase;
});
define("engine/core/rendering/scenes/materials/Material", ["require", "exports", "engine/libs/maths/statistics/random/UUIDGenerator"], function (require, exports, UUIDGenerator_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MaterialBase = exports.isMaterial = void 0;
    function isMaterial(obj) {
        return obj.isMaterial;
    }
    exports.isMaterial = isMaterial;
    class MaterialBase {
        constructor(name) {
            this.isMaterial = true;
            this.uuid = UUIDGenerator_3.UUIDGenerator.newUUID();
            this.name = name;
        }
    }
    exports.MaterialBase = MaterialBase;
});
define("engine/core/rendering/scenes/objects/meshes/Mesh", ["require", "exports", "engine/core/rendering/scenes/objects/Object3D"], function (require, exports, Object3D_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MeshBase = exports.isMesh = void 0;
    function isMesh(obj) {
        return obj.isMesh;
    }
    exports.isMesh = isMesh;
    class MeshBase extends Object3D_1.Object3DBase {
        constructor(geometry, material) {
            super();
            this.isMesh = true;
            this.geometry = geometry;
            this.material = material;
        }
    }
    exports.MeshBase = MeshBase;
});
define("engine/libs/physics/collisions/Frustrum", ["require", "exports", "engine/libs/maths/geometry/primitives/Plane", "engine/libs/patterns/injectors/Injector", "engine/libs/maths/extensions/pools/Vector3Pools"], function (require, exports, Plane_1, Injector_11, Vector3Pools_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FrustrumBase = exports.FrustrumInjector = exports.Frustrum = void 0;
    class FrustrumBase {
        constructor() {
            const planeCtor = Plane_1.PlaneInjector.defaultCtor;
            this._nearPlane = new planeCtor();
            this._farPlane = new planeCtor();
            this._topPlane = new planeCtor();
            this._bottomPlane = new planeCtor();
            this._leftPlane = new planeCtor();
            this._rightPlane = new planeCtor();
        }
        get nearPlane() {
            return this._nearPlane;
        }
        set nearPlane(nearPlane) {
            this._nearPlane = nearPlane;
        }
        get farPlane() {
            return this._farPlane;
        }
        set farPlane(farPlane) {
            this._farPlane = farPlane;
        }
        get topPlane() {
            return this._topPlane;
        }
        set topPlane(topPlane) {
            this._topPlane = topPlane;
        }
        get bottomPlane() {
            return this._bottomPlane;
        }
        set bottomPlane(bottomPlane) {
            this._bottomPlane = bottomPlane;
        }
        get leftPlane() {
            return this._leftPlane;
        }
        set leftPlane(leftPlane) {
            this._leftPlane = leftPlane;
        }
        get rightPlane() {
            return this._rightPlane;
        }
        set rightPlane(rightPlane) {
            this._rightPlane = rightPlane;
        }
        set(nearPlane, farPlane, topPlane, bottomPlane, leftPlane, rightPlane) {
            this._nearPlane.copy(nearPlane);
            this._farPlane.copy(farPlane);
            this._topPlane.copy(topPlane);
            this._bottomPlane.copy(bottomPlane);
            this._leftPlane.copy(leftPlane);
            this._rightPlane.copy(rightPlane);
            return this;
        }
        copy(frustrum) {
            this.set(frustrum._nearPlane, frustrum._farPlane, frustrum._topPlane, frustrum._bottomPlane, frustrum._leftPlane, frustrum._rightPlane);
            return this;
        }
        clone() {
            return new FrustrumBase().copy(this);
        }
        setFromPerspectiveMatrix(mat) {
            const m = mat.values;
            const m11 = m[0];
            const m12 = m[1];
            const m13 = m[2];
            const m14 = m[3];
            const m21 = m[4];
            const m22 = m[5];
            const m23 = m[6];
            const m24 = m[7];
            const m31 = m[8];
            const m32 = m[9];
            const m33 = m[10];
            const m34 = m[11];
            const m41 = m[12];
            const m42 = m[13];
            const m43 = m[14];
            const m44 = m[15];
            this._nearPlane.set(m31 + m41, m32 + m42, m33 + m43, m34 + m44).normalized();
            this._farPlane.set(-m31 + m41, -m32 + m42, -m33 + m43, -m34 + m44).normalized();
            this._bottomPlane.set(m21 + m41, m22 + m42, m23 + m43, m24 + m44).normalized();
            this._topPlane.set(-m21 + m41, -m22 + m42, -m23 + m43, -m24 + m44).normalized();
            this._leftPlane.set(m11 + m41, m12 + m42, m13 + m43, m14 + m44).normalized();
            this._rightPlane.set(-m11 + m41, -m12 + m42, -m13 + m43, -m14 + m44).normalized();
            return this;
        }
        intersectsSphere(sphere) {
            const center = sphere.center;
            const radius = sphere.radius;
            return center.dot(this._nearPlane.normal) + this._nearPlane.constant + radius <= 0 ||
                center.dot(this._farPlane.normal) + this._farPlane.constant + radius <= 0 ||
                center.dot(this._bottomPlane.normal) + this._bottomPlane.constant + radius <= 0 ||
                center.dot(this._topPlane.normal) + this._topPlane.constant + radius <= 0 ||
                center.dot(this._leftPlane.normal) + this._leftPlane.constant + radius <= 0 ||
                center.dot(this._rightPlane.normal) + this._rightPlane.constant + radius <= 0;
        }
        intersectsBox(box) {
            let intersects = true;
            const boxMax = box.max;
            const boxMin = box.min;
            const temp = Vector3Pools_6.Vector3Pool.acquire();
            {
                intersects =
                    this._nearPlane.distanceToPoint(temp.setValues([
                        this._nearPlane.normal.x > 0 ? boxMax.x : boxMin.x,
                        this._nearPlane.normal.y > 0 ? boxMax.y : boxMin.y,
                        this._nearPlane.normal.z > 0 ? boxMax.z : boxMin.z
                    ])) >= 0 &&
                        this._farPlane.distanceToPoint(temp.setValues([
                            this._farPlane.normal.x > 0 ? boxMax.x : boxMin.x,
                            this._farPlane.normal.y > 0 ? boxMax.y : boxMin.y,
                            this._farPlane.normal.z > 0 ? boxMax.z : boxMin.z
                        ])) >= 0 &&
                        this._bottomPlane.distanceToPoint(temp.setValues([
                            this._bottomPlane.normal.x > 0 ? boxMax.x : boxMin.x,
                            this._bottomPlane.normal.y > 0 ? boxMax.y : boxMin.y,
                            this._bottomPlane.normal.z > 0 ? boxMax.z : boxMin.z
                        ])) >= 0 &&
                        this._topPlane.distanceToPoint(temp.setValues([
                            this._topPlane.normal.x > 0 ? boxMax.x : boxMin.x,
                            this._topPlane.normal.y > 0 ? boxMax.y : boxMin.y,
                            this._topPlane.normal.z > 0 ? boxMax.z : boxMin.z
                        ])) >= 0 &&
                        this._leftPlane.distanceToPoint(temp.setValues([
                            this._leftPlane.normal.x > 0 ? boxMax.x : boxMin.x,
                            this._leftPlane.normal.y > 0 ? boxMax.y : boxMin.y,
                            this._leftPlane.normal.z > 0 ? boxMax.z : boxMin.z
                        ])) >= 0 &&
                        this._rightPlane.distanceToPoint(temp.setValues([
                            this._rightPlane.normal.x > 0 ? boxMax.x : boxMin.x,
                            this._rightPlane.normal.y > 0 ? boxMax.y : boxMin.y,
                            this._rightPlane.normal.z > 0 ? boxMax.z : boxMin.z
                        ])) >= 0;
            }
            Vector3Pools_6.Vector3Pool.release(1);
            return intersects;
        }
        containsPoint(point) {
            return this._nearPlane.distanceToPoint(point) >= 0 &&
                this._farPlane.distanceToPoint(point) >= 0 &&
                this._bottomPlane.distanceToPoint(point) >= 0 &&
                this._topPlane.distanceToPoint(point) >= 0 &&
                this._leftPlane.distanceToPoint(point) >= 0 &&
                this._rightPlane.distanceToPoint(point) >= 0;
        }
    }
    exports.FrustrumBase = FrustrumBase;
    var Frustrum = FrustrumBase;
    exports.Frustrum = Frustrum;
    const FrustrumInjector = new Injector_11.Injector({
        defaultCtor: FrustrumBase,
        onDefaultOverride: (ctor) => {
            exports.Frustrum = Frustrum = ctor;
        }
    });
    exports.FrustrumInjector = FrustrumInjector;
});
define("engine/core/rendering/scenes/cameras/Camera", ["require", "exports", "engine/core/rendering/scenes/objects/Object3D", "engine/libs/physics/collisions/Frustrum", "engine/libs/maths/algebra/matrices/Matrix4", "engine/libs/maths/statistics/random/UUIDGenerator"], function (require, exports, Object3D_2, Frustrum_1, Matrix4_2, UUIDGenerator_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CameraBase = void 0;
    class CameraBase extends Object3D_2.Object3DBase {
        constructor(projection) {
            super();
            this.uuid = UUIDGenerator_4.UUIDGenerator.newUUID();
            this._projection = projection || new Matrix4_2.Matrix4();
            this._frustrum = new Frustrum_1.Frustrum().setFromPerspectiveMatrix(this._projection);
        }
        get projection() {
            return this._projection;
        }
        getProjection(mat) {
            return mat.copy(this._projection);
        }
        isViewing(mesh) {
            if (typeof mesh.geometry.boundingBox === 'undefined') {
                const boundingBox = mesh.geometry.computeBoundingBox();
                return this._frustrum.intersectsBox(boundingBox);
            }
            return this._frustrum.intersectsBox(mesh.geometry.boundingBox);
        }
        updateFrustrum() {
            this._frustrum.setFromPerspectiveMatrix(this._projection);
        }
    }
    exports.CameraBase = CameraBase;
});
define("engine/core/rendering/scenes/cameras/PerspectiveCamera", ["require", "exports", "engine/libs/maths/algebra/matrices/Matrix4", "engine/core/rendering/scenes/cameras/Camera"], function (require, exports, Matrix4_3, Camera_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PerspectiveCamera = void 0;
    class PerspectiveCamera extends Camera_1.CameraBase {
        constructor(fieldOfViewYInRadians = Math.PI, aspect = 1, zNear = 400, zFar = -400) {
            super(new Matrix4_3.Matrix4().asPerspective(fieldOfViewYInRadians, aspect, zNear, zFar));
        }
        setValues(fieldOfViewYInRadians = Math.PI, aspect = 1, zNear = 400, zFar = -400) {
            this._projection.asPerspective(fieldOfViewYInRadians, aspect, zNear, zFar);
            this.updateFrustrum();
            return this;
        }
    }
    exports.PerspectiveCamera = PerspectiveCamera;
});
define("engine/utils/Snippets", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.safeQuerySelector = exports.buildArrayFromIndexedArrays = exports.hasFunctionMember = exports.isOfPrototype = exports.hasMemberOfPrototype = exports.crashIfNull = exports.isNotNull = void 0;
    function isNotNull(obj) {
        return !(obj === null);
    }
    exports.isNotNull = isNotNull;
    function crashIfNull(obj) {
        if (isNotNull(obj)) {
            return obj;
        }
        throw new TypeError(`Argument is null.`);
    }
    exports.crashIfNull = crashIfNull;
    function hasMemberOfPrototype(obj, key, ctor) {
        return !!obj && (obj[key]).constructor.prototype === ctor.prototype;
    }
    exports.hasMemberOfPrototype = hasMemberOfPrototype;
    function isOfPrototype(obj, ctor) {
        return obj.constructor.prototype === ctor.prototype;
    }
    exports.isOfPrototype = isOfPrototype;
    function hasFunctionMember(obj, key) {
        return (typeof obj[key] === 'function');
    }
    exports.hasFunctionMember = hasFunctionMember;
    function buildArrayFromIndexedArrays(arrays, indexes) {
        const len = indexes.length;
        const array = [];
        let i = -1;
        while (++i < len) {
            array.push(...arrays[indexes[i]]);
        }
        return array;
    }
    exports.buildArrayFromIndexedArrays = buildArrayFromIndexedArrays;
    function safeQuerySelector(parent, query) {
        const element = parent.querySelector(query);
        if (isNotNull(element)) {
            return element;
        }
        throw new Error(`Query '${query}' returned no result.`);
    }
    exports.safeQuerySelector = safeQuerySelector;
});
define("engine/core/rendering/scenes/geometries/lib/polyhedron/CubeGeometry", ["require", "exports", "engine/core/rendering/scenes/geometries/Geometry", "engine/utils/Snippets"], function (require, exports, geometry_1, Snippets_10) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CubeGeometry = void 0;
    class CubeGeometry extends geometry_1.GeometryBase {
        constructor() {
            super({
                vertices: new Float32Array(cubeVertices),
                indices: new Uint8Array(cubeIndices),
                uvs: new Float32Array(cubeUVS),
            });
        }
    }
    exports.CubeGeometry = CubeGeometry;
    /**
     *     y axis
     * 	      ^   z axis
     *     UP |   ^  FORWARD
     *        | /
     *        +------> x axis
     *         RIGHT
     *
     *  left-handed coordinates system
     *
     */
    /**
    *      v0       v1
    * 		+_______+      o   ^
    * 	    \      /\     /     \
    *       \   /   \    \     /
    *        \/      \    \ _ /
    *        +--------+
    *       v2         v3
    *
    *  counter-clockwise winding order:
    * 		v0 -> v2 -> v1
    * 		v1 -> v2 -> v3
    */
    /**
     *              v0_______v1
     *              |\        |
     *              |  \   f1 |
     *              |    \    |
     *              |  f0  \  |
     *    v0________v2_______\v3________v1
     *    |\        |\        |\        |
     *    |  \  f3  |  \  f5  |  \  f7  |
     *    |    \    |    \    |    \    |
     *    | f2   \  | f4   \  | f6   \  |
     *    v4_______\v5_______\v6_______\v7
     *              |\        |
     *              |  \   f9 |
     *              |    \    |
     *              |  f8  \  |
     *              v4_______\v7
     *              |\        |
     *              |  \  f11 |
     *              |    \    |
     *              | f10  \  |
     *              v0_______\v1
     *
     * v0 = [-1, +1, -1]
     * v1 = [+1, +1, -1]
     * v2 = [-1, +1, +1]
     * v3 = [+1, +1, +1]
     * v4 = [-1, -1, -1]
     * v5 = [-1, -1, +1]
     * v6 = [+1, -1, +1]
     * v7 = [+1, -1, -1]
     */
    /**
     * 	texture mappings
     *
     *
     *    uv0_____uv1
     *    | \       |
     *    |   \     |
     *    |     \   |
     *    |       \ |
     *    uv2_____uv3
     *
     *
     * uv0 = [0,0]
     * uv1 = [1,0]
     * uv2 = [0,1]
     * uv3 = [1,1]
     */
    const cubeVerticesSet = [
        [-1, +1, -1],
        [+1, +1, -1],
        [-1, +1, +1],
        [+1, +1, +1],
        [-1, -1, -1],
        [-1, -1, +1],
        [+1, -1, +1],
        [+1, -1, -1],
    ];
    const cubeVertices = Snippets_10.buildArrayFromIndexedArrays(cubeVerticesSet, [
        0, 2, 3, 1,
        0, 4, 5, 2,
        2, 5, 6, 3,
        3, 6, 7, 1,
        5, 4, 7, 6,
        4, 0, 1, 7,
    ]);
    const cubeUVsSet = [
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
    ];
    const cubeUVS = Snippets_10.buildArrayFromIndexedArrays(cubeUVsSet, [
        0, 1, 3, 2,
        0, 1, 3, 2,
        0, 1, 3, 2,
        0, 1, 3, 2,
        0, 1, 3, 2,
        0, 1, 3, 2,
    ]);
    const cubeIndices = [
        0, 1, 2,
        0, 2, 3,
        4, 5, 6,
        4, 6, 7,
        8, 9, 10,
        8, 10, 11,
        12, 13, 14,
        12, 14, 15,
        16, 17, 18,
        16, 18, 19,
        20, 21, 22,
        20, 22, 23,
    ];
});
define("engine/libs/maths/geometry/GeometryConstants", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.GOLDEN_RATIO = void 0;
    const GOLDEN_RATIO = 1.6180;
    exports.GOLDEN_RATIO = GOLDEN_RATIO;
});
define("engine/core/rendering/scenes/geometries/lib/polyhedron/IcosahedronGeometry", ["require", "exports", "engine/core/rendering/scenes/geometries/Geometry", "engine/libs/maths/geometry/GeometryConstants", "engine/utils/Snippets"], function (require, exports, geometry_2, GeometryConstants_1, Snippets_11) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.IcosahedronGeometry = void 0;
    class IcosahedronGeometry extends geometry_2.GeometryBase {
        constructor() {
            super({
                vertices: new Float32Array(icosahedronVertices),
                uvs: new Float32Array(icosahedronUVS),
                indices: new Uint8Array(icosahedronIndices)
            });
        }
    }
    exports.IcosahedronGeometry = IcosahedronGeometry;
    /**
     *
     *      v0        v0        v0        v0        v0
     *     / \       / \       / \       / \       / \
     *    /   \     /   \     /   \     /   \     /   \
     *   /     \   /     \   /     \   /     \   /     \
     *  /  f0   \ /  f1   \ /  f2   \ /  f3   \ /  f4   \
     * v1--------v2--------v3--------v4--------v5--------v1
     *  \        /\        /\        /\        /\        /\
     *   \  f5  /  \  f7  /  \  f9  /  \  11  /  \ f13  /  \
     *    \    /    \    /    \    /    \    /    \    /    \
     *     \  /  f6  \  /  f8  \  / f10  \  / f12  \  / f14  \
     *      v6--------v7--------v8--------v9--------v10-------v6
     *       \        /\        /\        /\        /\        /
     * 	      \ f15  /  \ f16  /  \ f17  /  \ f18  /  \ f19  /
     *         \    /    \    /    \    /    \    /    \    /
     *          \  /      \  /      \  /      \  /      \  /
     *           v11       v11       v11       v11       v11
     *
     * v0  = [ 0, +p, +h]
     * v1  = [+h,  0, +p]
     * v2  = [+p, +h,  0]
     * v3  = [ 0, +p, -h]
     * v4  = [-p, +h,  0]
     * v5  = [-h,  0, +p]
     * v6  = [+p, -h,  0]
     * v7  = [+h,  0, -p]
     * v8  = [-h,  0, -p]
     * v9  = [-p, -h,  0]
     * v10 = [ 0, -p, +h]
     * v11 = [ 0, -p, -h]
     *
     */
    const icosahedronVerticesSet = [
        [0, +GeometryConstants_1.GOLDEN_RATIO, +1],
        [+1, 0, +GeometryConstants_1.GOLDEN_RATIO],
        [+GeometryConstants_1.GOLDEN_RATIO, +1, 0],
        [0, +GeometryConstants_1.GOLDEN_RATIO, -1],
        [-GeometryConstants_1.GOLDEN_RATIO, +1, 0],
        [-1, 0, +GeometryConstants_1.GOLDEN_RATIO],
        [+GeometryConstants_1.GOLDEN_RATIO, -1, 0],
        [+1, 0, -GeometryConstants_1.GOLDEN_RATIO],
        [-1, 0, -GeometryConstants_1.GOLDEN_RATIO],
        [-GeometryConstants_1.GOLDEN_RATIO, -1, 0],
        [0, -GeometryConstants_1.GOLDEN_RATIO, +1],
        [0, -GeometryConstants_1.GOLDEN_RATIO, -1],
    ];
    const IcosahedronUVsSet = [
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
    ];
    const icosahedronVertices = Snippets_11.buildArrayFromIndexedArrays(icosahedronVerticesSet, [
        0, 1, 2,
        0, 2, 3,
        0, 3, 4,
        0, 4, 5,
        0, 5, 1,
        1, 6, 2,
        2, 6, 7,
        2, 7, 3,
        3, 7, 8,
        3, 8, 4,
        4, 8, 9,
        4, 9, 5,
        5, 9, 10,
        5, 10, 1,
        1, 10, 6,
        6, 11, 7,
        7, 11, 8,
        8, 11, 9,
        9, 11, 10,
        10, 11, 6,
    ]);
    const icosahedronUVS = Snippets_11.buildArrayFromIndexedArrays(IcosahedronUVsSet, [
        1, 2, 0,
        1, 2, 0,
        1, 2, 0,
        1, 2, 0,
        1, 2, 0,
        1, 2, 0,
        1, 2, 0,
        1, 2, 0,
        1, 2, 0,
        1, 2, 0,
        1, 2, 0,
        1, 2, 0,
        1, 2, 0,
        1, 2, 0,
        1, 2, 0,
        1, 2, 0,
        1, 2, 0,
        1, 2, 0,
        1, 2, 0,
        1, 2, 0,
    ]);
    const icosahedronIndices = [
        0, 1, 2,
        3, 4, 5,
        6, 7, 8,
        9, 10, 11,
        12, 13, 14,
        15, 16, 17,
        18, 19, 20,
        21, 22, 23,
        24, 25, 26,
        27, 28, 29,
        30, 31, 32,
        33, 34, 35,
        36, 37, 38,
        39, 40, 41,
        42, 43, 44,
        45, 46, 47,
        48, 49, 50,
        51, 52, 53,
        54, 55, 56,
        57, 58, 59,
    ];
});
define("engine/core/rendering/scenes/geometries/lib/QuadGeometry", ["require", "exports", "engine/core/rendering/scenes/geometries/Geometry", "engine/utils/Snippets"], function (require, exports, geometry_3, Snippets_12) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.QuadGeometry = void 0;
    class QuadGeometry extends geometry_3.GeometryBase {
        constructor() {
            super({
                vertices: new Float32Array(quadVertices),
                uvs: new Float32Array(quadUVS),
                indices: new Uint8Array(quadIndices)
            });
        }
    }
    exports.QuadGeometry = QuadGeometry;
    /**
     *     y axis
     * 	      ^   z axis
     *     UP |   ^  FORWARD
     *        | /
     *        +------> x axis
     *         RIGHT
     *
     *  left-handed coordinates system
     *
     */
    /**
    *      v0       v1
    * 		+_______+      o   ^
    * 	    \      /\     /     \
    *       \   /   \    \     /
    *        \/      \    \ _ /
    *        +--------+
    *       v2         v3
    *
    *  counter-clockwise winding order:
    * 		v0 -> v2 -> v1
    * 		v1 -> v2 -> v3
    */
    /**
     *     v0_______v1
     *     |\        |
     *     |  \   f1 |
     *     |    \    |
     *     |  f0  \  |
     *    v2_______\v3
     *
     * v0 = [-1, +1, -1]
     * v1 = [+1, +1, -1]
     * v2 = [-1, +1, +1]
     * v3 = [+1, +1, +1]
     */
    /**
     * 	texture mappings
     *
     *
     *    uv0_____uv1
     *    | \       |
     *    |   \     |
     *    |     \   |
     *    |       \ |
     *    uv2_____uv3
     *
     *
     * uv0 = [0,0]
     * uv1 = [1,0]
     * uv2 = [0,1]
     * uv3 = [1,1]
     */
    const quadVerticesSet = [
        [-1, +1, 1],
        [+1, +1, 1],
        [-1, -1, 1],
        [+1, -1, 1],
    ];
    const quadUVsSet = [
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1]
    ];
    const quadVertices = Snippets_12.buildArrayFromIndexedArrays(quadVerticesSet, [
        0, 2, 3, 1,
    ]);
    const quadUVS = Snippets_12.buildArrayFromIndexedArrays(quadUVsSet, [
        0, 2, 3, 1,
    ]);
    const quadIndices = [
        0, 1, 2,
        0, 2, 3,
    ];
});
define("engine/core/rendering/webgl/WebGLConstants", ["require", "exports", "engine/utils/Snippets"], function (require, exports, Snippets_13) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.VertexAttribute = exports.UniformType = exports.UniformQuery = exports.TextureWrapMode = exports.TextureMinFilter = exports.TextureMagFilter = exports.TextureTarget = exports.TextureParameter = exports.TextureUnits = exports.TestFunction = exports.StencilAction = exports.ShaderPrecision = exports.ShaderType = exports.Shader = exports.RenderbufferTarget = exports.PixelType = exports.PixelStorageMode = exports.PixelFormat = exports.Parameter = exports.HintMode = exports.HintTarget = exports.FrontFace = exports.FramebufferTextureTarget = exports.FramebufferTarget = exports.FramebufferAttachmentParameter = exports.FramebufferAttachment = exports.Error = exports.DataType = exports.DrawMode = exports.CullFaceMode = exports.Capabilities = exports.BufferTarget = exports.BufferInterpolation = exports.BufferIndexType = exports.BufferBindingPoint = exports.BufferMaskBit = exports.BufferMask = exports.BufferDataUsage = exports.BlendingEquation = exports.BlendingMode = void 0;
    const gl = Snippets_13.crashIfNull(document.createElement('canvas').getContext('webgl2'));
    var BlendingMode;
    (function (BlendingMode) {
        BlendingMode[BlendingMode["ZERO"] = gl.ZERO] = "ZERO";
        BlendingMode[BlendingMode["ONE"] = gl.ONE] = "ONE";
        BlendingMode[BlendingMode["SRC_COLOR"] = gl.SRC_COLOR] = "SRC_COLOR";
        BlendingMode[BlendingMode["ONE_MINUS_SRC_COLOR"] = gl.ONE_MINUS_SRC_COLOR] = "ONE_MINUS_SRC_COLOR";
        BlendingMode[BlendingMode["DST_COLOR"] = gl.DST_COLOR] = "DST_COLOR";
        BlendingMode[BlendingMode["ONE_MINUS_DST_COLOR"] = gl.ONE_MINUS_DST_COLOR] = "ONE_MINUS_DST_COLOR";
        BlendingMode[BlendingMode["SRC_ALPHA"] = gl.SRC_ALPHA] = "SRC_ALPHA";
        BlendingMode[BlendingMode["ONE_MINUS_SRC_ALPHA"] = gl.ONE_MINUS_SRC_ALPHA] = "ONE_MINUS_SRC_ALPHA";
        BlendingMode[BlendingMode["ONE_MINUS_DST_ALPHA"] = gl.ONE_MINUS_DST_ALPHA] = "ONE_MINUS_DST_ALPHA";
        BlendingMode[BlendingMode["CONSTANT_COLOR"] = gl.CONSTANT_COLOR] = "CONSTANT_COLOR";
        BlendingMode[BlendingMode["ONE_MINUS_CONSTANT_COLOR"] = gl.ONE_MINUS_CONSTANT_COLOR] = "ONE_MINUS_CONSTANT_COLOR";
        BlendingMode[BlendingMode["CONSTANT_ALPHA"] = gl.CONSTANT_ALPHA] = "CONSTANT_ALPHA";
        BlendingMode[BlendingMode["ONE_MINUS_CONSTANT_ALPHA"] = gl.ONE_MINUS_CONSTANT_ALPHA] = "ONE_MINUS_CONSTANT_ALPHA";
        BlendingMode[BlendingMode["SRC_ALPHA_SATURATE"] = gl.SRC_ALPHA_SATURATE] = "SRC_ALPHA_SATURATE";
    })(BlendingMode || (BlendingMode = {}));
    exports.BlendingMode = BlendingMode;
    var BlendingEquation;
    (function (BlendingEquation) {
        BlendingEquation[BlendingEquation["FUNC_ADD"] = gl.FUNC_ADD] = "FUNC_ADD";
        BlendingEquation[BlendingEquation["FUNC_SUBTRACT"] = gl.FUNC_SUBTRACT] = "FUNC_SUBTRACT";
        BlendingEquation[BlendingEquation["FUNC_REVERSE_SUBTRACT"] = gl.FUNC_REVERSE_SUBTRACT] = "FUNC_REVERSE_SUBTRACT";
        BlendingEquation[BlendingEquation["MIN"] = gl.MIN] = "MIN";
        BlendingEquation[BlendingEquation["MAX"] = gl.MAX] = "MAX";
    })(BlendingEquation || (BlendingEquation = {}));
    exports.BlendingEquation = BlendingEquation;
    var BufferMaskBit;
    (function (BufferMaskBit) {
        BufferMaskBit[BufferMaskBit["DEPTH_BUFFER_BIT"] = gl.DEPTH_BUFFER_BIT] = "DEPTH_BUFFER_BIT";
        BufferMaskBit[BufferMaskBit["STENCIL_BUFFER_BIT"] = gl.STENCIL_BUFFER_BIT] = "STENCIL_BUFFER_BIT";
        BufferMaskBit[BufferMaskBit["COLOR_BUFFER_BIT"] = gl.COLOR_BUFFER_BIT] = "COLOR_BUFFER_BIT";
    })(BufferMaskBit || (BufferMaskBit = {}));
    exports.BufferMaskBit = BufferMaskBit;
    var BufferMask;
    (function (BufferMask) {
        BufferMask[BufferMask["DEPTH"] = gl.DEPTH] = "DEPTH";
        BufferMask[BufferMask["STENCIL"] = gl.STENCIL] = "STENCIL";
        BufferMask[BufferMask["COLOR"] = gl.COLOR] = "COLOR";
        BufferMask[BufferMask["DEPTH_STENCIL"] = gl.DEPTH_STENCIL] = "DEPTH_STENCIL";
    })(BufferMask || (BufferMask = {}));
    exports.BufferMask = BufferMask;
    var BufferDataUsage;
    (function (BufferDataUsage) {
        BufferDataUsage[BufferDataUsage["STATIC_DRAW"] = gl.STATIC_DRAW] = "STATIC_DRAW";
        BufferDataUsage[BufferDataUsage["DYNAMIC_DRAW"] = gl.DYNAMIC_DRAW] = "DYNAMIC_DRAW";
        BufferDataUsage[BufferDataUsage["STREAM_DRAW"] = gl.STREAM_DRAW] = "STREAM_DRAW";
        BufferDataUsage[BufferDataUsage["STATIC_READ"] = gl.STATIC_READ] = "STATIC_READ";
        BufferDataUsage[BufferDataUsage["DYNAMIC_READ"] = gl.DYNAMIC_READ] = "DYNAMIC_READ";
        BufferDataUsage[BufferDataUsage["STREAM_READ"] = gl.STREAM_READ] = "STREAM_READ";
        BufferDataUsage[BufferDataUsage["STATIC_COPY"] = gl.STATIC_COPY] = "STATIC_COPY";
        BufferDataUsage[BufferDataUsage["DYNAMIC_COPY"] = gl.DYNAMIC_COPY] = "DYNAMIC_COPY";
        BufferDataUsage[BufferDataUsage["STREAM_COPY"] = gl.STREAM_COPY] = "STREAM_COPY";
    })(BufferDataUsage || (BufferDataUsage = {}));
    exports.BufferDataUsage = BufferDataUsage;
    var BufferBindingPoint;
    (function (BufferBindingPoint) {
        BufferBindingPoint[BufferBindingPoint["ARRAY_BUFFER"] = gl.ARRAY_BUFFER] = "ARRAY_BUFFER";
        BufferBindingPoint[BufferBindingPoint["ELEMENT_ARRAY_BUFFER"] = gl.ELEMENT_ARRAY_BUFFER] = "ELEMENT_ARRAY_BUFFER";
        BufferBindingPoint[BufferBindingPoint["COPY_READ_BUFFER"] = gl.COPY_READ_BUFFER] = "COPY_READ_BUFFER";
        BufferBindingPoint[BufferBindingPoint["COPY_WRITE_BUFFER"] = gl.COPY_WRITE_BUFFER] = "COPY_WRITE_BUFFER";
        BufferBindingPoint[BufferBindingPoint["TRANSFORM_FEEDBACK_BUFFER"] = gl.TRANSFORM_FEEDBACK_BUFFER] = "TRANSFORM_FEEDBACK_BUFFER";
        BufferBindingPoint[BufferBindingPoint["UNIFORM_BUFFER"] = gl.UNIFORM_BUFFER] = "UNIFORM_BUFFER";
        BufferBindingPoint[BufferBindingPoint["PIXEL_PACK_BUFFER"] = gl.PIXEL_PACK_BUFFER] = "PIXEL_PACK_BUFFER";
        BufferBindingPoint[BufferBindingPoint["PIXEL_UNPACK_BUFFER"] = gl.PIXEL_UNPACK_BUFFER] = "PIXEL_UNPACK_BUFFER";
    })(BufferBindingPoint || (BufferBindingPoint = {}));
    exports.BufferBindingPoint = BufferBindingPoint;
    var BufferIndexType;
    (function (BufferIndexType) {
        BufferIndexType[BufferIndexType["UNSIGNED_BYTE"] = gl.UNSIGNED_BYTE] = "UNSIGNED_BYTE";
        BufferIndexType[BufferIndexType["UNSIGNED_SHORT"] = gl.UNSIGNED_SHORT] = "UNSIGNED_SHORT";
        BufferIndexType[BufferIndexType["UNSIGNED_INT"] = gl.UNSIGNED_INT] = "UNSIGNED_INT";
    })(BufferIndexType || (BufferIndexType = {}));
    exports.BufferIndexType = BufferIndexType;
    var BufferInterpolation;
    (function (BufferInterpolation) {
        BufferInterpolation[BufferInterpolation["LINEAR"] = gl.LINEAR] = "LINEAR";
        BufferInterpolation[BufferInterpolation["NEAREST"] = gl.NEAREST] = "NEAREST";
    })(BufferInterpolation || (BufferInterpolation = {}));
    exports.BufferInterpolation = BufferInterpolation;
    var BufferTarget;
    (function (BufferTarget) {
        BufferTarget[BufferTarget["ARRAY_BUFFER"] = gl.ARRAY_BUFFER] = "ARRAY_BUFFER";
        BufferTarget[BufferTarget["ELEMENT_ARRAY_BUFFER"] = gl.ELEMENT_ARRAY_BUFFER] = "ELEMENT_ARRAY_BUFFER";
        BufferTarget[BufferTarget["COPY_READ_BUFFER"] = gl.COPY_READ_BUFFER] = "COPY_READ_BUFFER";
        BufferTarget[BufferTarget["COPY_WRITE_BUFFER"] = gl.COPY_WRITE_BUFFER] = "COPY_WRITE_BUFFER";
        BufferTarget[BufferTarget["TRANSFORM_FEEDBACK_BUFFER"] = gl.TRANSFORM_FEEDBACK_BUFFER] = "TRANSFORM_FEEDBACK_BUFFER";
        BufferTarget[BufferTarget["UNIFORM_BUFFER"] = gl.UNIFORM_BUFFER] = "UNIFORM_BUFFER";
        BufferTarget[BufferTarget["PIXEL_PACK_BUFFER"] = gl.PIXEL_PACK_BUFFER] = "PIXEL_PACK_BUFFER";
        BufferTarget[BufferTarget["PIXEL_UNPACK_BUFFER"] = gl.PIXEL_UNPACK_BUFFER] = "PIXEL_UNPACK_BUFFER";
    })(BufferTarget || (BufferTarget = {}));
    exports.BufferTarget = BufferTarget;
    var Capabilities;
    (function (Capabilities) {
        Capabilities[Capabilities["BLEND"] = gl.BLEND] = "BLEND";
        Capabilities[Capabilities["CULL_FACE"] = gl.CULL_FACE] = "CULL_FACE";
        Capabilities[Capabilities["DEPTH_TEST"] = gl.DEPTH_TEST] = "DEPTH_TEST";
        Capabilities[Capabilities["DITHER"] = gl.DITHER] = "DITHER";
        Capabilities[Capabilities["POLYGON_OFFSET_FILL"] = gl.POLYGON_OFFSET_FILL] = "POLYGON_OFFSET_FILL";
        Capabilities[Capabilities["SAMPLE_ALPHA_TO_COVERAGE"] = gl.SAMPLE_ALPHA_TO_COVERAGE] = "SAMPLE_ALPHA_TO_COVERAGE";
        Capabilities[Capabilities["SAMPLE_COVERAGE"] = gl.SAMPLE_COVERAGE] = "SAMPLE_COVERAGE";
        Capabilities[Capabilities["SCISSOR_TEST"] = gl.SCISSOR_TEST] = "SCISSOR_TEST";
        Capabilities[Capabilities["STENCIL_TEST"] = gl.STENCIL_TEST] = "STENCIL_TEST";
        Capabilities[Capabilities["RASTERIZER_DISCARD"] = gl.RASTERIZER_DISCARD] = "RASTERIZER_DISCARD";
    })(Capabilities || (Capabilities = {}));
    exports.Capabilities = Capabilities;
    var CullFaceMode;
    (function (CullFaceMode) {
        CullFaceMode[CullFaceMode["FRONT"] = gl.FRONT] = "FRONT";
        CullFaceMode[CullFaceMode["BACK"] = gl.BACK] = "BACK";
        CullFaceMode[CullFaceMode["FRONT_AND_BACK"] = gl.FRONT_AND_BACK] = "FRONT_AND_BACK";
    })(CullFaceMode || (CullFaceMode = {}));
    exports.CullFaceMode = CullFaceMode;
    var DrawMode;
    (function (DrawMode) {
        DrawMode[DrawMode["POINTS"] = gl.POINTS] = "POINTS";
        DrawMode[DrawMode["LINE_STRIP"] = gl.LINE_STRIP] = "LINE_STRIP";
        DrawMode[DrawMode["LINE_LOOP"] = gl.LINE_LOOP] = "LINE_LOOP";
        DrawMode[DrawMode["LINES"] = gl.LINES] = "LINES";
        DrawMode[DrawMode["TRIANGLE_STRIP"] = gl.TRIANGLE_STRIP] = "TRIANGLE_STRIP";
        DrawMode[DrawMode["TRIANGLE_FAN"] = gl.TRIANGLE_FAN] = "TRIANGLE_FAN";
        DrawMode[DrawMode["TRIANGLES"] = gl.TRIANGLES] = "TRIANGLES";
    })(DrawMode || (DrawMode = {}));
    exports.DrawMode = DrawMode;
    var DataType;
    (function (DataType) {
        DataType[DataType["BYTE"] = gl.BYTE] = "BYTE";
        DataType[DataType["SHORT"] = gl.SHORT] = "SHORT";
        DataType[DataType["UNSIGNED_BYTE"] = gl.UNSIGNED_BYTE] = "UNSIGNED_BYTE";
        DataType[DataType["UNSIGNED_SHORT"] = gl.UNSIGNED_SHORT] = "UNSIGNED_SHORT";
        DataType[DataType["FLOAT"] = gl.FLOAT] = "FLOAT";
        DataType[DataType["HALF_FLOAT"] = gl.HALF_FLOAT] = "HALF_FLOAT";
    })(DataType || (DataType = {}));
    exports.DataType = DataType;
    var Error;
    (function (Error) {
        Error[Error["NO_ERROR"] = gl.NO_ERROR] = "NO_ERROR";
        Error[Error["INVALID_ENUM"] = gl.INVALID_ENUM] = "INVALID_ENUM";
        Error[Error["INVALID_OPERATION"] = gl.INVALID_OPERATION] = "INVALID_OPERATION";
        Error[Error["OUT_OF_MEMORY"] = gl.OUT_OF_MEMORY] = "OUT_OF_MEMORY";
        Error[Error["CONTEXT_LOST_WEBGL"] = gl.CONTEXT_LOST_WEBGL] = "CONTEXT_LOST_WEBGL";
    })(Error || (Error = {}));
    exports.Error = Error;
    var FramebufferAttachment;
    (function (FramebufferAttachment) {
        FramebufferAttachment[FramebufferAttachment["COLOR_ATTACHMENT0"] = gl.COLOR_ATTACHMENT0] = "COLOR_ATTACHMENT0";
        FramebufferAttachment[FramebufferAttachment["COLOR_ATTACHMENT1"] = gl.COLOR_ATTACHMENT1] = "COLOR_ATTACHMENT1";
        FramebufferAttachment[FramebufferAttachment["COLOR_ATTACHMENT2"] = gl.COLOR_ATTACHMENT2] = "COLOR_ATTACHMENT2";
        FramebufferAttachment[FramebufferAttachment["COLOR_ATTACHMENT3"] = gl.COLOR_ATTACHMENT3] = "COLOR_ATTACHMENT3";
        FramebufferAttachment[FramebufferAttachment["COLOR_ATTACHMENT4"] = gl.COLOR_ATTACHMENT4] = "COLOR_ATTACHMENT4";
        FramebufferAttachment[FramebufferAttachment["COLOR_ATTACHMENT5"] = gl.COLOR_ATTACHMENT5] = "COLOR_ATTACHMENT5";
        FramebufferAttachment[FramebufferAttachment["COLOR_ATTACHMENT6"] = gl.COLOR_ATTACHMENT6] = "COLOR_ATTACHMENT6";
        FramebufferAttachment[FramebufferAttachment["COLOR_ATTACHMENT7"] = gl.COLOR_ATTACHMENT7] = "COLOR_ATTACHMENT7";
        FramebufferAttachment[FramebufferAttachment["COLOR_ATTACHMENT8"] = gl.COLOR_ATTACHMENT8] = "COLOR_ATTACHMENT8";
        FramebufferAttachment[FramebufferAttachment["COLOR_ATTACHMENT9"] = gl.COLOR_ATTACHMENT9] = "COLOR_ATTACHMENT9";
        FramebufferAttachment[FramebufferAttachment["COLOR_ATTACHMENT10"] = gl.COLOR_ATTACHMENT10] = "COLOR_ATTACHMENT10";
        FramebufferAttachment[FramebufferAttachment["COLOR_ATTACHMENT11"] = gl.COLOR_ATTACHMENT11] = "COLOR_ATTACHMENT11";
        FramebufferAttachment[FramebufferAttachment["COLOR_ATTACHMENT12"] = gl.COLOR_ATTACHMENT12] = "COLOR_ATTACHMENT12";
        FramebufferAttachment[FramebufferAttachment["COLOR_ATTACHMENT13"] = gl.COLOR_ATTACHMENT13] = "COLOR_ATTACHMENT13";
        FramebufferAttachment[FramebufferAttachment["COLOR_ATTACHMENT14"] = gl.COLOR_ATTACHMENT14] = "COLOR_ATTACHMENT14";
        FramebufferAttachment[FramebufferAttachment["COLOR_ATTACHMENT15"] = gl.COLOR_ATTACHMENT15] = "COLOR_ATTACHMENT15";
        FramebufferAttachment[FramebufferAttachment["DEPTH_ATTACHMENT"] = gl.DEPTH_ATTACHMENT] = "DEPTH_ATTACHMENT";
        FramebufferAttachment[FramebufferAttachment["STENCIL_ATTACHMENT"] = gl.STENCIL_ATTACHMENT] = "STENCIL_ATTACHMENT";
        FramebufferAttachment[FramebufferAttachment["DEPTH_STENCIL_ATTACHMENT"] = gl.DEPTH_STENCIL_ATTACHMENT] = "DEPTH_STENCIL_ATTACHMENT";
    })(FramebufferAttachment || (FramebufferAttachment = {}));
    exports.FramebufferAttachment = FramebufferAttachment;
    var FramebufferAttachmentParameter;
    (function (FramebufferAttachmentParameter) {
        FramebufferAttachmentParameter[FramebufferAttachmentParameter["FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE"] = gl.FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE] = "FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE";
        FramebufferAttachmentParameter[FramebufferAttachmentParameter["FRAMEBUFFER_ATTACHMENT_OBJECT_NAME"] = gl.FRAMEBUFFER_ATTACHMENT_OBJECT_NAME] = "FRAMEBUFFER_ATTACHMENT_OBJECT_NAME";
        FramebufferAttachmentParameter[FramebufferAttachmentParameter["FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL"] = gl.FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL] = "FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL";
        FramebufferAttachmentParameter[FramebufferAttachmentParameter["FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE"] = gl.FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE] = "FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE";
        FramebufferAttachmentParameter[FramebufferAttachmentParameter["FRAMEBUFFER_ATTACHMENT_ALPHA_SIZE"] = gl.FRAMEBUFFER_ATTACHMENT_ALPHA_SIZE] = "FRAMEBUFFER_ATTACHMENT_ALPHA_SIZE";
        FramebufferAttachmentParameter[FramebufferAttachmentParameter["FRAMEBUFFER_ATTACHMENT_BLUE_SIZE"] = gl.FRAMEBUFFER_ATTACHMENT_BLUE_SIZE] = "FRAMEBUFFER_ATTACHMENT_BLUE_SIZE";
        FramebufferAttachmentParameter[FramebufferAttachmentParameter["FRAMEBUFFER_ATTACHMENT_COLOR_ENCODING"] = gl.FRAMEBUFFER_ATTACHMENT_COLOR_ENCODING] = "FRAMEBUFFER_ATTACHMENT_COLOR_ENCODING";
        FramebufferAttachmentParameter[FramebufferAttachmentParameter["FRAMEBUFFER_ATTACHMENT_COMPONENT_TYPE"] = gl.FRAMEBUFFER_ATTACHMENT_COMPONENT_TYPE] = "FRAMEBUFFER_ATTACHMENT_COMPONENT_TYPE";
        FramebufferAttachmentParameter[FramebufferAttachmentParameter["FRAMEBUFFER_ATTACHMENT_DEPTH_SIZE"] = gl.FRAMEBUFFER_ATTACHMENT_DEPTH_SIZE] = "FRAMEBUFFER_ATTACHMENT_DEPTH_SIZE";
        FramebufferAttachmentParameter[FramebufferAttachmentParameter["FRAMEBUFFER_ATTACHMENT_GREEN_SIZE"] = gl.FRAMEBUFFER_ATTACHMENT_GREEN_SIZE] = "FRAMEBUFFER_ATTACHMENT_GREEN_SIZE";
        FramebufferAttachmentParameter[FramebufferAttachmentParameter["FRAMEBUFFER_ATTACHMENT_RED_SIZE"] = gl.FRAMEBUFFER_ATTACHMENT_RED_SIZE] = "FRAMEBUFFER_ATTACHMENT_RED_SIZE";
        FramebufferAttachmentParameter[FramebufferAttachmentParameter["FRAMEBUFFER_ATTACHMENT_STENCIL_SIZE"] = gl.FRAMEBUFFER_ATTACHMENT_STENCIL_SIZE] = "FRAMEBUFFER_ATTACHMENT_STENCIL_SIZE";
        FramebufferAttachmentParameter[FramebufferAttachmentParameter["FRAMEBUFFER_ATTACHMENT_TEXTURE_LAYER"] = gl.FRAMEBUFFER_ATTACHMENT_TEXTURE_LAYER] = "FRAMEBUFFER_ATTACHMENT_TEXTURE_LAYER";
    })(FramebufferAttachmentParameter || (FramebufferAttachmentParameter = {}));
    exports.FramebufferAttachmentParameter = FramebufferAttachmentParameter;
    var FramebufferTarget;
    (function (FramebufferTarget) {
        FramebufferTarget[FramebufferTarget["FRAMEBUFFER"] = gl.FRAMEBUFFER] = "FRAMEBUFFER";
        FramebufferTarget[FramebufferTarget["DRAW_FRAMEBUFFER"] = gl.DRAW_FRAMEBUFFER] = "DRAW_FRAMEBUFFER";
        FramebufferTarget[FramebufferTarget["READ_FRAMEBUFFER"] = gl.READ_FRAMEBUFFER] = "READ_FRAMEBUFFER";
    })(FramebufferTarget || (FramebufferTarget = {}));
    exports.FramebufferTarget = FramebufferTarget;
    var FramebufferTextureTarget;
    (function (FramebufferTextureTarget) {
        FramebufferTextureTarget[FramebufferTextureTarget["TEXTURE_2D"] = gl.TEXTURE_2D] = "TEXTURE_2D";
        FramebufferTextureTarget[FramebufferTextureTarget["TEXTURE_CUBE_MAP_POSITIVE_X"] = gl.TEXTURE_CUBE_MAP_POSITIVE_X] = "TEXTURE_CUBE_MAP_POSITIVE_X";
        FramebufferTextureTarget[FramebufferTextureTarget["TEXTURE_CUBE_MAP_NEGATIVE_X"] = gl.TEXTURE_CUBE_MAP_NEGATIVE_X] = "TEXTURE_CUBE_MAP_NEGATIVE_X";
        FramebufferTextureTarget[FramebufferTextureTarget["TEXTURE_CUBE_MAP_POSITIVE_Y"] = gl.TEXTURE_CUBE_MAP_POSITIVE_Y] = "TEXTURE_CUBE_MAP_POSITIVE_Y";
        FramebufferTextureTarget[FramebufferTextureTarget["TEXTURE_CUBE_MAP_NEGATIVE_Y"] = gl.TEXTURE_CUBE_MAP_NEGATIVE_Y] = "TEXTURE_CUBE_MAP_NEGATIVE_Y";
        FramebufferTextureTarget[FramebufferTextureTarget["TEXTURE_CUBE_MAP_POSITIVE_Z"] = gl.TEXTURE_CUBE_MAP_POSITIVE_Z] = "TEXTURE_CUBE_MAP_POSITIVE_Z";
        FramebufferTextureTarget[FramebufferTextureTarget["TEXTURE_CUBE_MAP_NEGATIVE_Z"] = gl.TEXTURE_CUBE_MAP_NEGATIVE_Z] = "TEXTURE_CUBE_MAP_NEGATIVE_Z";
    })(FramebufferTextureTarget || (FramebufferTextureTarget = {}));
    exports.FramebufferTextureTarget = FramebufferTextureTarget;
    var FrontFace;
    (function (FrontFace) {
        FrontFace[FrontFace["CW"] = gl.CW] = "CW";
        FrontFace[FrontFace["CCW"] = gl.CCW] = "CCW";
    })(FrontFace || (FrontFace = {}));
    exports.FrontFace = FrontFace;
    var HintTarget;
    (function (HintTarget) {
        HintTarget[HintTarget["GENERATE_MIPMAP_HINT"] = gl.GENERATE_MIPMAP_HINT] = "GENERATE_MIPMAP_HINT";
        HintTarget[HintTarget["FRAGMENT_SHADER_DERIVATIVE_HINT"] = gl.FRAGMENT_SHADER_DERIVATIVE_HINT] = "FRAGMENT_SHADER_DERIVATIVE_HINT";
    })(HintTarget || (HintTarget = {}));
    exports.HintTarget = HintTarget;
    var HintMode;
    (function (HintMode) {
        HintMode[HintMode["FASTEST"] = gl.FASTEST] = "FASTEST";
        HintMode[HintMode["NICEST"] = gl.NICEST] = "NICEST";
        HintMode[HintMode["DONT_CARE"] = gl.DONT_CARE] = "DONT_CARE";
    })(HintMode || (HintMode = {}));
    exports.HintMode = HintMode;
    var Parameter;
    (function (Parameter) {
        Parameter[Parameter["ACTIVE_TEXTURE"] = gl.ACTIVE_TEXTURE] = "ACTIVE_TEXTURE";
        Parameter[Parameter["ALIASED_LINE_WIDTH_RANGE"] = gl.ALIASED_LINE_WIDTH_RANGE] = "ALIASED_LINE_WIDTH_RANGE";
        Parameter[Parameter["ALIASED_POINT_SIZE_RANGE"] = gl.ALIASED_POINT_SIZE_RANGE] = "ALIASED_POINT_SIZE_RANGE";
        Parameter[Parameter["ALPHA_BITS"] = gl.ALPHA_BITS] = "ALPHA_BITS";
        Parameter[Parameter["ARRAY_BUFFER_BINDING"] = gl.ARRAY_BUFFER_BINDING] = "ARRAY_BUFFER_BINDING";
        Parameter[Parameter["BLEND"] = gl.BLEND] = "BLEND";
        Parameter[Parameter["BLEND_COLOR"] = gl.BLEND_COLOR] = "BLEND_COLOR";
        Parameter[Parameter["BLEND_DST_ALPHA"] = gl.BLEND_DST_ALPHA] = "BLEND_DST_ALPHA";
        Parameter[Parameter["BLEND_DST_RGB"] = gl.BLEND_DST_RGB] = "BLEND_DST_RGB";
        Parameter[Parameter["BLEND_EQUATION"] = gl.BLEND_EQUATION] = "BLEND_EQUATION";
        Parameter[Parameter["BLEND_EQUATION_ALPHA"] = gl.BLEND_EQUATION_ALPHA] = "BLEND_EQUATION_ALPHA";
        Parameter[Parameter["BLEND_EQUATION_RGB"] = gl.BLEND_EQUATION_RGB] = "BLEND_EQUATION_RGB";
        Parameter[Parameter["BLEND_SRC_ALPHA"] = gl.BLEND_SRC_ALPHA] = "BLEND_SRC_ALPHA";
        Parameter[Parameter["BLEND_SRC_RGB"] = gl.BLEND_SRC_RGB] = "BLEND_SRC_RGB";
        Parameter[Parameter["BLUE_BITS"] = gl.BLUE_BITS] = "BLUE_BITS";
        Parameter[Parameter["COLOR_CLEAR_VALUE"] = gl.COLOR_CLEAR_VALUE] = "COLOR_CLEAR_VALUE";
        Parameter[Parameter["COLOR_WRITEMASK"] = gl.COLOR_WRITEMASK] = "COLOR_WRITEMASK";
        Parameter[Parameter["COMPRESSED_TEXTURE_FORMATS"] = gl.COMPRESSED_TEXTURE_FORMATS] = "COMPRESSED_TEXTURE_FORMATS";
        Parameter[Parameter["CULL_FACE"] = gl.CULL_FACE] = "CULL_FACE";
        Parameter[Parameter["CULL_FACE_MODE"] = gl.CULL_FACE_MODE] = "CULL_FACE_MODE";
        Parameter[Parameter["CURRENT_PROGRAM"] = gl.CURRENT_PROGRAM] = "CURRENT_PROGRAM";
        Parameter[Parameter["DEPTH_BITS"] = gl.DEPTH_BITS] = "DEPTH_BITS";
        Parameter[Parameter["DEPTH_CLEAR_VALUE"] = gl.DEPTH_CLEAR_VALUE] = "DEPTH_CLEAR_VALUE";
        Parameter[Parameter["DEPTH_FUNC"] = gl.DEPTH_FUNC] = "DEPTH_FUNC";
        Parameter[Parameter["DEPTH_RANGE"] = gl.DEPTH_RANGE] = "DEPTH_RANGE";
        Parameter[Parameter["DEPTH_TEST"] = gl.DEPTH_TEST] = "DEPTH_TEST";
        Parameter[Parameter["DEPTH_WRITEMASK"] = gl.DEPTH_WRITEMASK] = "DEPTH_WRITEMASK";
        Parameter[Parameter["DITHER"] = gl.DITHER] = "DITHER";
        Parameter[Parameter["ELEMENT_ARRAY_BUFFER_BINDING"] = gl.ELEMENT_ARRAY_BUFFER_BINDING] = "ELEMENT_ARRAY_BUFFER_BINDING";
        Parameter[Parameter["FRAMEBUFFER_BINDING"] = gl.FRAMEBUFFER_BINDING] = "FRAMEBUFFER_BINDING";
        Parameter[Parameter["FRONT_FACE"] = gl.FRONT_FACE] = "FRONT_FACE";
        Parameter[Parameter["GENERATE_MIPMAP_HINT"] = gl.GENERATE_MIPMAP_HINT] = "GENERATE_MIPMAP_HINT";
        Parameter[Parameter["GREEN_BITS"] = gl.GREEN_BITS] = "GREEN_BITS";
        Parameter[Parameter["IMPLEMENTATION_COLOR_READ_FORMAT"] = gl.IMPLEMENTATION_COLOR_READ_FORMAT] = "IMPLEMENTATION_COLOR_READ_FORMAT";
        Parameter[Parameter["IMPLEMENTATION_COLOR_READ_TYPE"] = gl.IMPLEMENTATION_COLOR_READ_TYPE] = "IMPLEMENTATION_COLOR_READ_TYPE";
        Parameter[Parameter["LINE_WIDTH"] = gl.LINE_WIDTH] = "LINE_WIDTH";
        Parameter[Parameter["MAX_COMBINED_TEXTURE_IMAGE_UNITS"] = gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS] = "MAX_COMBINED_TEXTURE_IMAGE_UNITS";
        Parameter[Parameter["MAX_CUBE_MAP_TEXTURE_SIZE"] = gl.MAX_CUBE_MAP_TEXTURE_SIZE] = "MAX_CUBE_MAP_TEXTURE_SIZE";
        Parameter[Parameter["MAX_FRAGMENT_UNIFORM_VECTORS"] = gl.MAX_FRAGMENT_UNIFORM_VECTORS] = "MAX_FRAGMENT_UNIFORM_VECTORS";
        Parameter[Parameter["MAX_RENDERBUFFER_SIZE"] = gl.MAX_RENDERBUFFER_SIZE] = "MAX_RENDERBUFFER_SIZE";
        Parameter[Parameter["MAX_TEXTURE_IMAGE_UNITS"] = gl.MAX_TEXTURE_IMAGE_UNITS] = "MAX_TEXTURE_IMAGE_UNITS";
        Parameter[Parameter["MAX_TEXTURE_SIZE"] = gl.MAX_TEXTURE_SIZE] = "MAX_TEXTURE_SIZE";
        Parameter[Parameter["MAX_VARYING_VECTORS"] = gl.MAX_VARYING_VECTORS] = "MAX_VARYING_VECTORS";
        Parameter[Parameter["MAX_VERTEX_ATTRIBS"] = gl.MAX_VERTEX_ATTRIBS] = "MAX_VERTEX_ATTRIBS";
        Parameter[Parameter["MAX_VERTEX_UNIFORM_VECTORS"] = gl.MAX_VERTEX_UNIFORM_VECTORS] = "MAX_VERTEX_UNIFORM_VECTORS";
        Parameter[Parameter["MAX_VIEWPORT_DIMS"] = gl.MAX_VIEWPORT_DIMS] = "MAX_VIEWPORT_DIMS";
        Parameter[Parameter["PACK_ALIGNMENT"] = gl.PACK_ALIGNMENT] = "PACK_ALIGNMENT";
        Parameter[Parameter["POLYGON_OFFSET_FACTOR"] = gl.POLYGON_OFFSET_FACTOR] = "POLYGON_OFFSET_FACTOR";
        Parameter[Parameter["POLYGON_OFFSET_FILL"] = gl.POLYGON_OFFSET_FILL] = "POLYGON_OFFSET_FILL";
        Parameter[Parameter["POLYGON_OFFSET_UNITS"] = gl.POLYGON_OFFSET_UNITS] = "POLYGON_OFFSET_UNITS";
        Parameter[Parameter["RED_BITS"] = gl.RED_BITS] = "RED_BITS";
        Parameter[Parameter["RENDERBUFFER_BINDING"] = gl.RENDERBUFFER_BINDING] = "RENDERBUFFER_BINDING";
        Parameter[Parameter["RENDERER"] = gl.RENDERER] = "RENDERER";
        Parameter[Parameter["SAMPLE_BUFFERS"] = gl.SAMPLE_BUFFERS] = "SAMPLE_BUFFERS";
        Parameter[Parameter["SAMPLE_COVERAGE_INVERT"] = gl.SAMPLE_COVERAGE_INVERT] = "SAMPLE_COVERAGE_INVERT";
        Parameter[Parameter["SAMPLE_COVERAGE_VALUE"] = gl.SAMPLE_COVERAGE_VALUE] = "SAMPLE_COVERAGE_VALUE";
        Parameter[Parameter["SAMPLES"] = gl.SAMPLES] = "SAMPLES";
        Parameter[Parameter["SCISSOR_BOX"] = gl.SCISSOR_BOX] = "SCISSOR_BOX";
        Parameter[Parameter["SCISSOR_TEST"] = gl.SCISSOR_TEST] = "SCISSOR_TEST";
        Parameter[Parameter["SHADING_LANGUAGE_VERSION"] = gl.SHADING_LANGUAGE_VERSION] = "SHADING_LANGUAGE_VERSION";
        Parameter[Parameter["STENCIL_BACK_FAIL"] = gl.STENCIL_BACK_FAIL] = "STENCIL_BACK_FAIL";
        Parameter[Parameter["STENCIL_BACK_FUNC"] = gl.STENCIL_BACK_FUNC] = "STENCIL_BACK_FUNC";
        Parameter[Parameter["STENCIL_BACK_PASS_DEPTH_FAIL"] = gl.STENCIL_BACK_PASS_DEPTH_FAIL] = "STENCIL_BACK_PASS_DEPTH_FAIL";
        Parameter[Parameter["STENCIL_BACK_PASS_DEPTH_PASS"] = gl.STENCIL_BACK_PASS_DEPTH_PASS] = "STENCIL_BACK_PASS_DEPTH_PASS";
        Parameter[Parameter["STENCIL_BACK_REF"] = gl.STENCIL_BACK_REF] = "STENCIL_BACK_REF";
        Parameter[Parameter["STENCIL_BACK_VALUE_MASK"] = gl.STENCIL_BACK_VALUE_MASK] = "STENCIL_BACK_VALUE_MASK";
        Parameter[Parameter["STENCIL_BACK_WRITEMASK"] = gl.STENCIL_BACK_WRITEMASK] = "STENCIL_BACK_WRITEMASK";
        Parameter[Parameter["STENCIL_BITS"] = gl.STENCIL_BITS] = "STENCIL_BITS";
        Parameter[Parameter["STENCIL_CLEAR_VALUE"] = gl.STENCIL_CLEAR_VALUE] = "STENCIL_CLEAR_VALUE";
        Parameter[Parameter["STENCIL_FAIL"] = gl.STENCIL_FAIL] = "STENCIL_FAIL";
        Parameter[Parameter["STENCIL_FUNC"] = gl.STENCIL_FUNC] = "STENCIL_FUNC";
        Parameter[Parameter["STENCIL_PASS_DEPTH_FAIL"] = gl.STENCIL_PASS_DEPTH_FAIL] = "STENCIL_PASS_DEPTH_FAIL";
        Parameter[Parameter["STENCIL_PASS_DEPTH_PASS"] = gl.STENCIL_PASS_DEPTH_PASS] = "STENCIL_PASS_DEPTH_PASS";
        Parameter[Parameter["STENCIL_REF"] = gl.STENCIL_REF] = "STENCIL_REF";
        Parameter[Parameter["STENCIL_TEST"] = gl.STENCIL_TEST] = "STENCIL_TEST";
        Parameter[Parameter["STENCIL_VALUE_MASK"] = gl.STENCIL_VALUE_MASK] = "STENCIL_VALUE_MASK";
        Parameter[Parameter["STENCIL_WRITEMASK"] = gl.STENCIL_WRITEMASK] = "STENCIL_WRITEMASK";
        Parameter[Parameter["SUBPIXEL_BITS"] = gl.SUBPIXEL_BITS] = "SUBPIXEL_BITS";
        Parameter[Parameter["TEXTURE_BINDING_2D"] = gl.TEXTURE_BINDING_2D] = "TEXTURE_BINDING_2D";
        Parameter[Parameter["TEXTURE_BINDING_CUBE_MAP"] = gl.TEXTURE_BINDING_CUBE_MAP] = "TEXTURE_BINDING_CUBE_MAP";
        Parameter[Parameter["UNPACK_ALIGNMENT"] = gl.UNPACK_ALIGNMENT] = "UNPACK_ALIGNMENT";
        Parameter[Parameter["UNPACK_COLORSPACE_CONVERSION_WEBGL"] = gl.UNPACK_COLORSPACE_CONVERSION_WEBGL] = "UNPACK_COLORSPACE_CONVERSION_WEBGL";
        Parameter[Parameter["UNPACK_FLIP_Y_WEBGL"] = gl.UNPACK_FLIP_Y_WEBGL] = "UNPACK_FLIP_Y_WEBGL";
        Parameter[Parameter["UNPACK_PREMULTIPLY_ALPHA_WEBGL"] = gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL] = "UNPACK_PREMULTIPLY_ALPHA_WEBGL";
        Parameter[Parameter["VENDOR"] = gl.VENDOR] = "VENDOR";
        Parameter[Parameter["VERSION"] = gl.VERSION] = "VERSION";
        Parameter[Parameter["VIEWPORT"] = gl.VIEWPORT] = "VIEWPORT";
        Parameter[Parameter["COPY_READ_BUFFER_BINDING"] = gl.COPY_READ_BUFFER_BINDING] = "COPY_READ_BUFFER_BINDING";
        Parameter[Parameter["COPY_WRITE_BUFFER_BINDING"] = gl.COPY_WRITE_BUFFER_BINDING] = "COPY_WRITE_BUFFER_BINDING";
        Parameter[Parameter["DRAW_FRAMEBUFFER_BINDING"] = gl.DRAW_FRAMEBUFFER_BINDING] = "DRAW_FRAMEBUFFER_BINDING";
        Parameter[Parameter["FRAGMENT_SHADER_DERIVATIVE_HINT"] = gl.FRAGMENT_SHADER_DERIVATIVE_HINT] = "FRAGMENT_SHADER_DERIVATIVE_HINT";
        Parameter[Parameter["MAX_3D_TEXTURE_SIZE"] = gl.MAX_3D_TEXTURE_SIZE] = "MAX_3D_TEXTURE_SIZE";
        Parameter[Parameter["MAX_ARRAY_TEXTURE_LAYERS"] = gl.MAX_ARRAY_TEXTURE_LAYERS] = "MAX_ARRAY_TEXTURE_LAYERS";
        Parameter[Parameter["MAX_CLIENT_WAIT_TIMEOUT_WEBGL"] = gl.MAX_CLIENT_WAIT_TIMEOUT_WEBGL] = "MAX_CLIENT_WAIT_TIMEOUT_WEBGL";
        Parameter[Parameter["MAX_COLOR_ATTACHMENTS"] = gl.MAX_COLOR_ATTACHMENTS] = "MAX_COLOR_ATTACHMENTS";
        Parameter[Parameter["MAX_COMBINED_FRAGMENT_UNIFORM_COMPONENTS"] = gl.MAX_COMBINED_FRAGMENT_UNIFORM_COMPONENTS] = "MAX_COMBINED_FRAGMENT_UNIFORM_COMPONENTS";
        Parameter[Parameter["MAX_COMBINED_UNIFORM_BLOCKS"] = gl.MAX_COMBINED_UNIFORM_BLOCKS] = "MAX_COMBINED_UNIFORM_BLOCKS";
        Parameter[Parameter["MAX_COMBINED_VERTEX_UNIFORM_COMPONENTS"] = gl.MAX_COMBINED_VERTEX_UNIFORM_COMPONENTS] = "MAX_COMBINED_VERTEX_UNIFORM_COMPONENTS";
        Parameter[Parameter["MAX_DRAW_BUFFERS"] = gl.MAX_DRAW_BUFFERS] = "MAX_DRAW_BUFFERS";
        Parameter[Parameter["MAX_ELEMENT_INDEX"] = gl.MAX_ELEMENT_INDEX] = "MAX_ELEMENT_INDEX";
        Parameter[Parameter["MAX_ELEMENTS_INDICES"] = gl.MAX_ELEMENTS_INDICES] = "MAX_ELEMENTS_INDICES";
        Parameter[Parameter["MAX_ELEMENTS_VERTICES"] = gl.MAX_ELEMENTS_VERTICES] = "MAX_ELEMENTS_VERTICES";
        Parameter[Parameter["MAX_FRAGMENT_INPUT_COMPONENTS"] = gl.MAX_FRAGMENT_INPUT_COMPONENTS] = "MAX_FRAGMENT_INPUT_COMPONENTS";
        Parameter[Parameter["MAX_FRAGMENT_UNIFORM_BLOCKS"] = gl.MAX_FRAGMENT_UNIFORM_BLOCKS] = "MAX_FRAGMENT_UNIFORM_BLOCKS";
        Parameter[Parameter["MAX_FRAGMENT_UNIFORM_COMPONENTS"] = gl.MAX_FRAGMENT_UNIFORM_COMPONENTS] = "MAX_FRAGMENT_UNIFORM_COMPONENTS";
        Parameter[Parameter["MAX_PROGRAM_TEXEL_OFFSET"] = gl.MAX_PROGRAM_TEXEL_OFFSET] = "MAX_PROGRAM_TEXEL_OFFSET";
        Parameter[Parameter["MAX_SAMPLES"] = gl.MAX_SAMPLES] = "MAX_SAMPLES";
        Parameter[Parameter["MAX_SERVER_WAIT_TIMEOUT"] = gl.MAX_SERVER_WAIT_TIMEOUT] = "MAX_SERVER_WAIT_TIMEOUT";
        Parameter[Parameter["MAX_TEXTURE_LOD_BIAS"] = gl.MAX_TEXTURE_LOD_BIAS] = "MAX_TEXTURE_LOD_BIAS";
        Parameter[Parameter["MAX_TRANSFORM_FEEDBACK_INTERLEAVED_COMPONENTS"] = gl.MAX_TRANSFORM_FEEDBACK_INTERLEAVED_COMPONENTS] = "MAX_TRANSFORM_FEEDBACK_INTERLEAVED_COMPONENTS";
        Parameter[Parameter["MAX_TRANSFORM_FEEDBACK_SEPARATE_ATTRIBS"] = gl.MAX_TRANSFORM_FEEDBACK_SEPARATE_ATTRIBS] = "MAX_TRANSFORM_FEEDBACK_SEPARATE_ATTRIBS";
        Parameter[Parameter["MAX_TRANSFORM_FEEDBACK_SEPARATE_COMPONENTS"] = gl.MAX_TRANSFORM_FEEDBACK_SEPARATE_COMPONENTS] = "MAX_TRANSFORM_FEEDBACK_SEPARATE_COMPONENTS";
        Parameter[Parameter["MAX_UNIFORM_BLOCK_SIZE"] = gl.MAX_UNIFORM_BLOCK_SIZE] = "MAX_UNIFORM_BLOCK_SIZE";
        Parameter[Parameter["MAX_UNIFORM_BUFFER_BINDINGS"] = gl.MAX_UNIFORM_BUFFER_BINDINGS] = "MAX_UNIFORM_BUFFER_BINDINGS";
        Parameter[Parameter["MAX_VARYING_COMPONENTS"] = gl.MAX_VARYING_COMPONENTS] = "MAX_VARYING_COMPONENTS";
        Parameter[Parameter["MAX_VERTEX_OUTPUT_COMPONENTS"] = gl.MAX_VERTEX_OUTPUT_COMPONENTS] = "MAX_VERTEX_OUTPUT_COMPONENTS";
        Parameter[Parameter["MAX_VERTEX_UNIFORM_BLOCKS"] = gl.MAX_VERTEX_UNIFORM_BLOCKS] = "MAX_VERTEX_UNIFORM_BLOCKS";
        Parameter[Parameter["MAX_VERTEX_UNIFORM_COMPONENTS"] = gl.MAX_VERTEX_UNIFORM_COMPONENTS] = "MAX_VERTEX_UNIFORM_COMPONENTS";
        Parameter[Parameter["MIN_PROGRAM_TEXEL_OFFSET"] = gl.MIN_PROGRAM_TEXEL_OFFSET] = "MIN_PROGRAM_TEXEL_OFFSET";
        Parameter[Parameter["PACK_ROW_LENGTH"] = gl.PACK_ROW_LENGTH] = "PACK_ROW_LENGTH";
        Parameter[Parameter["PACK_SKIP_PIXELS"] = gl.PACK_SKIP_PIXELS] = "PACK_SKIP_PIXELS";
        Parameter[Parameter["PACK_SKIP_ROWS"] = gl.PACK_SKIP_ROWS] = "PACK_SKIP_ROWS";
        Parameter[Parameter["PIXEL_PACK_BUFFER_BINDING"] = gl.PIXEL_PACK_BUFFER_BINDING] = "PIXEL_PACK_BUFFER_BINDING";
        Parameter[Parameter["PIXEL_UNPACK_BUFFER_BINDING"] = gl.PIXEL_UNPACK_BUFFER_BINDING] = "PIXEL_UNPACK_BUFFER_BINDING";
        Parameter[Parameter["RASTERIZER_DISCARD"] = gl.RASTERIZER_DISCARD] = "RASTERIZER_DISCARD";
        Parameter[Parameter["READ_BUFFER"] = gl.READ_BUFFER] = "READ_BUFFER";
        Parameter[Parameter["READ_FRAMEBUFFER_BINDING"] = gl.READ_FRAMEBUFFER_BINDING] = "READ_FRAMEBUFFER_BINDING";
        Parameter[Parameter["SAMPLE_ALPHA_TO_COVERAGE"] = gl.SAMPLE_ALPHA_TO_COVERAGE] = "SAMPLE_ALPHA_TO_COVERAGE";
        Parameter[Parameter["SAMPLE_COVERAGE"] = gl.SAMPLE_COVERAGE] = "SAMPLE_COVERAGE";
        Parameter[Parameter["SAMPLER_BINDING"] = gl.SAMPLER_BINDING] = "SAMPLER_BINDING";
        Parameter[Parameter["TEXTURE_BINDING_2D_ARRAY"] = gl.TEXTURE_BINDING_2D_ARRAY] = "TEXTURE_BINDING_2D_ARRAY";
        Parameter[Parameter["TEXTURE_BINDING_3D"] = gl.TEXTURE_BINDING_3D] = "TEXTURE_BINDING_3D";
        Parameter[Parameter["TRANSFORM_FEEDBACK_ACTIVE"] = gl.TRANSFORM_FEEDBACK_ACTIVE] = "TRANSFORM_FEEDBACK_ACTIVE";
        Parameter[Parameter["TRANSFORM_FEEDBACK_BINDING"] = gl.TRANSFORM_FEEDBACK_BINDING] = "TRANSFORM_FEEDBACK_BINDING";
        Parameter[Parameter["TRANSFORM_FEEDBACK_BUFFER_BINDING"] = gl.TRANSFORM_FEEDBACK_BUFFER_BINDING] = "TRANSFORM_FEEDBACK_BUFFER_BINDING";
        Parameter[Parameter["TRANSFORM_FEEDBACK_PAUSED"] = gl.TRANSFORM_FEEDBACK_PAUSED] = "TRANSFORM_FEEDBACK_PAUSED";
        Parameter[Parameter["UNIFORM_BUFFER_BINDING"] = gl.UNIFORM_BUFFER_BINDING] = "UNIFORM_BUFFER_BINDING";
        Parameter[Parameter["UNIFORM_BUFFER_OFFSET_ALIGNMENT"] = gl.UNIFORM_BUFFER_OFFSET_ALIGNMENT] = "UNIFORM_BUFFER_OFFSET_ALIGNMENT";
        Parameter[Parameter["UNPACK_IMAGE_HEIGHT"] = gl.UNPACK_IMAGE_HEIGHT] = "UNPACK_IMAGE_HEIGHT";
        Parameter[Parameter["UNPACK_ROW_LENGTH"] = gl.UNPACK_ROW_LENGTH] = "UNPACK_ROW_LENGTH";
        Parameter[Parameter["UNPACK_SKIP_IMAGES"] = gl.UNPACK_SKIP_IMAGES] = "UNPACK_SKIP_IMAGES";
        Parameter[Parameter["UNPACK_SKIP_PIXELS"] = gl.UNPACK_SKIP_PIXELS] = "UNPACK_SKIP_PIXELS";
        Parameter[Parameter["UNPACK_SKIP_ROWS"] = gl.UNPACK_SKIP_ROWS] = "UNPACK_SKIP_ROWS";
        Parameter[Parameter["VERTEX_ARRAY_BINDING"] = gl.VERTEX_ARRAY_BINDING] = "VERTEX_ARRAY_BINDING";
    })(Parameter || (Parameter = {}));
    exports.Parameter = Parameter;
    var PixelFormat;
    (function (PixelFormat) {
        PixelFormat[PixelFormat["ALPHA"] = gl.ALPHA] = "ALPHA";
        PixelFormat[PixelFormat["LUMINANCE"] = gl.LUMINANCE] = "LUMINANCE";
        PixelFormat[PixelFormat["LUMINANCE_ALPHA"] = gl.LUMINANCE_ALPHA] = "LUMINANCE_ALPHA";
        PixelFormat[PixelFormat["RGB"] = gl.RGB] = "RGB";
        PixelFormat[PixelFormat["RGBA"] = gl.RGBA] = "RGBA";
        PixelFormat[PixelFormat["RGBA4"] = gl.RGBA4] = "RGBA4";
        PixelFormat[PixelFormat["RGB565"] = gl.RGB565] = "RGB565";
        PixelFormat[PixelFormat["RGB5_A1"] = gl.RGB5_A1] = "RGB5_A1";
        PixelFormat[PixelFormat["DEPTH_COMPONENT"] = gl.DEPTH_COMPONENT] = "DEPTH_COMPONENT";
        PixelFormat[PixelFormat["DEPTH_STENCIL"] = gl.DEPTH_STENCIL] = "DEPTH_STENCIL";
        PixelFormat[PixelFormat["STENCIL_INDEX8"] = gl.STENCIL_INDEX8] = "STENCIL_INDEX8";
        PixelFormat[PixelFormat["R8"] = gl.R8] = "R8";
        PixelFormat[PixelFormat["R8UI"] = gl.R8UI] = "R8UI";
        PixelFormat[PixelFormat["R8I"] = gl.R8I] = "R8I";
        PixelFormat[PixelFormat["R16UI"] = gl.R16UI] = "R16UI";
        PixelFormat[PixelFormat["R16I"] = gl.R16I] = "R16I";
        PixelFormat[PixelFormat["R32UI"] = gl.R32UI] = "R32UI";
        PixelFormat[PixelFormat["R32I"] = gl.R32I] = "R32I";
        PixelFormat[PixelFormat["RG8"] = gl.RG8] = "RG8";
        PixelFormat[PixelFormat["RG8UI"] = gl.RG8UI] = "RG8UI";
        PixelFormat[PixelFormat["RG8I"] = gl.RG8I] = "RG8I";
        PixelFormat[PixelFormat["RG16UI"] = gl.RG16UI] = "RG16UI";
        PixelFormat[PixelFormat["RG16I"] = gl.RG16I] = "RG16I";
        PixelFormat[PixelFormat["RG32UI"] = gl.RG32UI] = "RG32UI";
        PixelFormat[PixelFormat["RG32I"] = gl.RG32I] = "RG32I";
        PixelFormat[PixelFormat["RGB8"] = gl.RGB8] = "RGB8";
        PixelFormat[PixelFormat["RGBA8"] = gl.RGBA8] = "RGBA8";
        PixelFormat[PixelFormat["SRGB8_ALPHA8"] = gl.SRGB8_ALPHA8] = "SRGB8_ALPHA8";
        PixelFormat[PixelFormat["RGB10_A2"] = gl.RGB10_A2] = "RGB10_A2";
        PixelFormat[PixelFormat["RGBA8UI"] = gl.RGBA8UI] = "RGBA8UI";
        PixelFormat[PixelFormat["RGBA8I"] = gl.RGBA8I] = "RGBA8I";
        PixelFormat[PixelFormat["RGB10_A2UI"] = gl.RGB10_A2UI] = "RGB10_A2UI";
        PixelFormat[PixelFormat["RGBA16UI"] = gl.RGBA16UI] = "RGBA16UI";
        PixelFormat[PixelFormat["RGBA16I"] = gl.RGBA16I] = "RGBA16I";
        PixelFormat[PixelFormat["RGBA32I"] = gl.RGBA32I] = "RGBA32I";
        PixelFormat[PixelFormat["RGBA32UI"] = gl.RGBA32UI] = "RGBA32UI";
        PixelFormat[PixelFormat["DEPTH_COMPONENT24"] = gl.DEPTH_COMPONENT24] = "DEPTH_COMPONENT24";
        PixelFormat[PixelFormat["DEPTH_COMPONENT32F"] = gl.DEPTH_COMPONENT32F] = "DEPTH_COMPONENT32F";
        PixelFormat[PixelFormat["DEPTH24_STENCIL8"] = gl.DEPTH24_STENCIL8] = "DEPTH24_STENCIL8";
        PixelFormat[PixelFormat["DEPTH32F_STENCIL8"] = gl.DEPTH32F_STENCIL8] = "DEPTH32F_STENCIL8";
    })(PixelFormat || (PixelFormat = {}));
    exports.PixelFormat = PixelFormat;
    var PixelStorageMode;
    (function (PixelStorageMode) {
        PixelStorageMode[PixelStorageMode["UNPACK_FLIP_Y_WEBGL"] = gl.UNPACK_FLIP_Y_WEBGL] = "UNPACK_FLIP_Y_WEBGL";
        PixelStorageMode[PixelStorageMode["UNPACK_PREMULTIPLY_ALPHA_WEBGL"] = gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL] = "UNPACK_PREMULTIPLY_ALPHA_WEBGL";
        PixelStorageMode[PixelStorageMode["UNPACK_COLORSPACE_CONVERSION_WEBGL"] = gl.UNPACK_COLORSPACE_CONVERSION_WEBGL] = "UNPACK_COLORSPACE_CONVERSION_WEBGL";
    })(PixelStorageMode || (PixelStorageMode = {}));
    exports.PixelStorageMode = PixelStorageMode;
    var PixelType;
    (function (PixelType) {
        PixelType[PixelType["BYTE"] = gl.BYTE] = "BYTE";
        PixelType[PixelType["FLOAT"] = gl.FLOAT] = "FLOAT";
        PixelType[PixelType["FLOAT_32_UNSIGNED_INT_24_8_REV"] = gl.FLOAT_32_UNSIGNED_INT_24_8_REV] = "FLOAT_32_UNSIGNED_INT_24_8_REV";
        PixelType[PixelType["HALF_FLOAT"] = gl.HALF_FLOAT] = "HALF_FLOAT";
        PixelType[PixelType["INT"] = gl.INT] = "INT";
        PixelType[PixelType["SHORT"] = gl.SHORT] = "SHORT";
        PixelType[PixelType["UNSIGNED_BYTE"] = gl.UNSIGNED_BYTE] = "UNSIGNED_BYTE";
        PixelType[PixelType["UNSIGNED_INT"] = gl.UNSIGNED_INT] = "UNSIGNED_INT";
        PixelType[PixelType["UNSIGNED_INT_2_10_10_10_REV"] = gl.UNSIGNED_INT_2_10_10_10_REV] = "UNSIGNED_INT_2_10_10_10_REV";
        PixelType[PixelType["UNSIGNED_INT_10F_11F_11F_REV"] = gl.UNSIGNED_INT_10F_11F_11F_REV] = "UNSIGNED_INT_10F_11F_11F_REV";
        PixelType[PixelType["UNSIGNED_INT_5_9_9_9_REV"] = gl.UNSIGNED_INT_5_9_9_9_REV] = "UNSIGNED_INT_5_9_9_9_REV";
        PixelType[PixelType["UNSIGNED_INT_24_8"] = gl.UNSIGNED_INT_24_8] = "UNSIGNED_INT_24_8";
        PixelType[PixelType["UNSIGNED_SHORT"] = gl.UNSIGNED_SHORT] = "UNSIGNED_SHORT";
        PixelType[PixelType["UNSIGNED_SHORT_5_6_5"] = gl.UNSIGNED_SHORT_5_6_5] = "UNSIGNED_SHORT_5_6_5";
        PixelType[PixelType["UNSIGNED_SHORT_4_4_4_4"] = gl.UNSIGNED_SHORT_4_4_4_4] = "UNSIGNED_SHORT_4_4_4_4";
        PixelType[PixelType["UNSIGNED_SHORT_5_5_5_1"] = gl.UNSIGNED_SHORT_5_5_5_1] = "UNSIGNED_SHORT_5_5_5_1";
    })(PixelType || (PixelType = {}));
    exports.PixelType = PixelType;
    var RenderbufferTarget;
    (function (RenderbufferTarget) {
        RenderbufferTarget[RenderbufferTarget["RENDERBUFFER"] = gl.RENDERBUFFER] = "RENDERBUFFER";
    })(RenderbufferTarget || (RenderbufferTarget = {}));
    exports.RenderbufferTarget = RenderbufferTarget;
    var Shader;
    (function (Shader) {
        Shader[Shader["FRAGMENT_SHADER"] = gl.FRAGMENT_SHADER] = "FRAGMENT_SHADER";
        Shader[Shader["VERTEX_SHADER"] = gl.VERTEX_SHADER] = "VERTEX_SHADER";
        Shader[Shader["COMPILE_STATUS"] = gl.COMPILE_STATUS] = "COMPILE_STATUS";
        Shader[Shader["DELETE_STATUS"] = gl.DELETE_STATUS] = "DELETE_STATUS";
        Shader[Shader["LINK_STATUS"] = gl.LINK_STATUS] = "LINK_STATUS";
        Shader[Shader["VALIDATE_STATUS"] = gl.VALIDATE_STATUS] = "VALIDATE_STATUS";
        Shader[Shader["ATTACHED_SHADERS"] = gl.ATTACHED_SHADERS] = "ATTACHED_SHADERS";
        Shader[Shader["ACTIVE_ATTRIBUTES"] = gl.ACTIVE_ATTRIBUTES] = "ACTIVE_ATTRIBUTES";
        Shader[Shader["ACTIVE_UNIFORMS"] = gl.ACTIVE_UNIFORMS] = "ACTIVE_UNIFORMS";
        Shader[Shader["MAX_VERTEX_ATTRIBS"] = gl.MAX_VERTEX_ATTRIBS] = "MAX_VERTEX_ATTRIBS";
        Shader[Shader["MAX_VERTEX_UNIFORM_VECTORS"] = gl.MAX_VERTEX_UNIFORM_VECTORS] = "MAX_VERTEX_UNIFORM_VECTORS";
        Shader[Shader["MAX_VARYING_VECTORS"] = gl.MAX_VARYING_VECTORS] = "MAX_VARYING_VECTORS";
        Shader[Shader["MAX_COMBINED_TEXTURE_IMAGE_UNITS"] = gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS] = "MAX_COMBINED_TEXTURE_IMAGE_UNITS";
        Shader[Shader["MAX_VERTEX_TEXTURE_IMAGE_UNITS"] = gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS] = "MAX_VERTEX_TEXTURE_IMAGE_UNITS";
        Shader[Shader["MAX_TEXTURE_IMAGE_UNITS"] = gl.MAX_TEXTURE_IMAGE_UNITS] = "MAX_TEXTURE_IMAGE_UNITS";
        Shader[Shader["MAX_FRAGMENT_UNIFORM_VECTORS"] = gl.MAX_FRAGMENT_UNIFORM_VECTORS] = "MAX_FRAGMENT_UNIFORM_VECTORS";
        Shader[Shader["SHADER_TYPE"] = gl.SHADER_TYPE] = "SHADER_TYPE";
        Shader[Shader["SHADING_LANGUAGE_VERSION"] = gl.SHADING_LANGUAGE_VERSION] = "SHADING_LANGUAGE_VERSION";
        Shader[Shader["CURRENT_PROGRAM"] = gl.CURRENT_PROGRAM] = "CURRENT_PROGRAM";
    })(Shader || (Shader = {}));
    exports.Shader = Shader;
    var ShaderType;
    (function (ShaderType) {
        ShaderType[ShaderType["FRAGMENT_SHADER"] = gl.FRAGMENT_SHADER] = "FRAGMENT_SHADER";
        ShaderType[ShaderType["VERTEX_SHADER"] = gl.VERTEX_SHADER] = "VERTEX_SHADER";
    })(ShaderType || (ShaderType = {}));
    exports.ShaderType = ShaderType;
    var ShaderPrecision;
    (function (ShaderPrecision) {
        ShaderPrecision[ShaderPrecision["LOW_FLOAT"] = gl.LOW_FLOAT] = "LOW_FLOAT";
        ShaderPrecision[ShaderPrecision["MEDIUM_FLOAT"] = gl.MEDIUM_FLOAT] = "MEDIUM_FLOAT";
        ShaderPrecision[ShaderPrecision["HIGH_FLOAT"] = gl.HIGH_FLOAT] = "HIGH_FLOAT";
        ShaderPrecision[ShaderPrecision["LOW_INT"] = gl.LOW_INT] = "LOW_INT";
        ShaderPrecision[ShaderPrecision["MEDIUM_INT"] = gl.MEDIUM_INT] = "MEDIUM_INT";
        ShaderPrecision[ShaderPrecision["HIGH_INT"] = gl.HIGH_INT] = "HIGH_INT";
    })(ShaderPrecision || (ShaderPrecision = {}));
    exports.ShaderPrecision = ShaderPrecision;
    var StencilAction;
    (function (StencilAction) {
        StencilAction[StencilAction["KEEP"] = gl.KEEP] = "KEEP";
        StencilAction[StencilAction["REPLACE"] = gl.REPLACE] = "REPLACE";
        StencilAction[StencilAction["INCR"] = gl.INCR] = "INCR";
        StencilAction[StencilAction["DECR"] = gl.DECR] = "DECR";
        StencilAction[StencilAction["INVERT"] = gl.INVERT] = "INVERT";
        StencilAction[StencilAction["INCR_WRAP"] = gl.INCR_WRAP] = "INCR_WRAP";
        StencilAction[StencilAction["DECR_WRAP"] = gl.DECR_WRAP] = "DECR_WRAP";
    })(StencilAction || (StencilAction = {}));
    exports.StencilAction = StencilAction;
    var TestFunction;
    (function (TestFunction) {
        TestFunction[TestFunction["NEVER"] = gl.NEVER] = "NEVER";
        TestFunction[TestFunction["LESS"] = gl.LESS] = "LESS";
        TestFunction[TestFunction["EQUAL"] = gl.EQUAL] = "EQUAL";
        TestFunction[TestFunction["LEQUAL"] = gl.LEQUAL] = "LEQUAL";
        TestFunction[TestFunction["GREATER"] = gl.GREATER] = "GREATER";
        TestFunction[TestFunction["NOTEQUAL"] = gl.NOTEQUAL] = "NOTEQUAL";
        TestFunction[TestFunction["GEQUAL"] = gl.GEQUAL] = "GEQUAL";
        TestFunction[TestFunction["ALWAYS"] = gl.ALWAYS] = "ALWAYS";
    })(TestFunction || (TestFunction = {}));
    exports.TestFunction = TestFunction;
    var TextureUnits;
    (function (TextureUnits) {
        TextureUnits[TextureUnits["TEXTURE"] = gl.TEXTURE] = "TEXTURE";
        TextureUnits[TextureUnits["TEXTURE0"] = gl.TEXTURE0] = "TEXTURE0";
    })(TextureUnits || (TextureUnits = {}));
    exports.TextureUnits = TextureUnits;
    var TextureParameter;
    (function (TextureParameter) {
        TextureParameter[TextureParameter["TEXTURE_MAG_FILTER"] = gl.TEXTURE_MAG_FILTER] = "TEXTURE_MAG_FILTER";
        TextureParameter[TextureParameter["TEXTURE_MIN_FILTER"] = gl.TEXTURE_MIN_FILTER] = "TEXTURE_MIN_FILTER";
        TextureParameter[TextureParameter["TEXTURE_WRAP_S"] = gl.TEXTURE_WRAP_S] = "TEXTURE_WRAP_S";
        TextureParameter[TextureParameter["TEXTURE_WRAP_T"] = gl.TEXTURE_WRAP_T] = "TEXTURE_WRAP_T";
        TextureParameter[TextureParameter["TEXTURE_BASE_LEVEL"] = gl.TEXTURE_BASE_LEVEL] = "TEXTURE_BASE_LEVEL";
        TextureParameter[TextureParameter["TEXTURE_MAX_LEVEL"] = gl.TEXTURE_MAX_LEVEL] = "TEXTURE_MAX_LEVEL";
        TextureParameter[TextureParameter["TEXTURE_MAX_LOD"] = gl.TEXTURE_MAX_LOD] = "TEXTURE_MAX_LOD";
        TextureParameter[TextureParameter["TEXTURE_MIN_LOD"] = gl.TEXTURE_MIN_LOD] = "TEXTURE_MIN_LOD";
        TextureParameter[TextureParameter["TEXTURE_WRAP_R"] = gl.TEXTURE_WRAP_R] = "TEXTURE_WRAP_R";
    })(TextureParameter || (TextureParameter = {}));
    exports.TextureParameter = TextureParameter;
    var TextureTarget;
    (function (TextureTarget) {
        TextureTarget[TextureTarget["TEXTURE_2D"] = gl.TEXTURE_2D] = "TEXTURE_2D";
        TextureTarget[TextureTarget["TEXTURE_CUBE_MAP"] = gl.TEXTURE_CUBE_MAP] = "TEXTURE_CUBE_MAP";
        TextureTarget[TextureTarget["TEXTURE_3D"] = gl.TEXTURE_3D] = "TEXTURE_3D";
        TextureTarget[TextureTarget["TEXTURE_2D_ARRAY"] = gl.TEXTURE_2D_ARRAY] = "TEXTURE_2D_ARRAY";
        TextureTarget[TextureTarget["TEXTURE_CUBE_MAP_POSITIVE_X"] = gl.TEXTURE_CUBE_MAP_POSITIVE_X] = "TEXTURE_CUBE_MAP_POSITIVE_X";
        TextureTarget[TextureTarget["TEXTURE_CUBE_MAP_NEGATIVE_X"] = gl.TEXTURE_CUBE_MAP_NEGATIVE_X] = "TEXTURE_CUBE_MAP_NEGATIVE_X";
        TextureTarget[TextureTarget["TEXTURE_CUBE_MAP_POSITIVE_Y"] = gl.TEXTURE_CUBE_MAP_POSITIVE_Y] = "TEXTURE_CUBE_MAP_POSITIVE_Y";
        TextureTarget[TextureTarget["TEXTURE_CUBE_MAP_NEGATIVE_Y"] = gl.TEXTURE_CUBE_MAP_NEGATIVE_Y] = "TEXTURE_CUBE_MAP_NEGATIVE_Y";
        TextureTarget[TextureTarget["TEXTURE_CUBE_MAP_POSITIVE_Z"] = gl.TEXTURE_CUBE_MAP_POSITIVE_Z] = "TEXTURE_CUBE_MAP_POSITIVE_Z";
        TextureTarget[TextureTarget["TEXTURE_CUBE_MAP_NEGATIVE_Z"] = gl.TEXTURE_CUBE_MAP_NEGATIVE_Z] = "TEXTURE_CUBE_MAP_NEGATIVE_Z";
    })(TextureTarget || (TextureTarget = {}));
    exports.TextureTarget = TextureTarget;
    var TextureMagFilter;
    (function (TextureMagFilter) {
        TextureMagFilter[TextureMagFilter["LINEAR"] = gl.LINEAR] = "LINEAR";
        TextureMagFilter[TextureMagFilter["NEAREST"] = gl.NEAREST] = "NEAREST";
    })(TextureMagFilter || (TextureMagFilter = {}));
    exports.TextureMagFilter = TextureMagFilter;
    var TextureMinFilter;
    (function (TextureMinFilter) {
        TextureMinFilter[TextureMinFilter["LINEAR"] = gl.LINEAR] = "LINEAR";
        TextureMinFilter[TextureMinFilter["NEAREST"] = gl.NEAREST] = "NEAREST";
        TextureMinFilter[TextureMinFilter["NEAREST_MIPMAP_NEAREST"] = gl.NEAREST_MIPMAP_NEAREST] = "NEAREST_MIPMAP_NEAREST";
        TextureMinFilter[TextureMinFilter["LINEAR_MIPMAP_NEAREST"] = gl.LINEAR_MIPMAP_NEAREST] = "LINEAR_MIPMAP_NEAREST";
        TextureMinFilter[TextureMinFilter["NEAREST_MIPMAP_LINEAR"] = gl.NEAREST_MIPMAP_LINEAR] = "NEAREST_MIPMAP_LINEAR";
        TextureMinFilter[TextureMinFilter["LINEAR_MIPMAP_LINEAR"] = gl.LINEAR_MIPMAP_LINEAR] = "LINEAR_MIPMAP_LINEAR";
    })(TextureMinFilter || (TextureMinFilter = {}));
    exports.TextureMinFilter = TextureMinFilter;
    var TextureWrapMode;
    (function (TextureWrapMode) {
        TextureWrapMode[TextureWrapMode["REPEAT"] = gl.REPEAT] = "REPEAT";
        TextureWrapMode[TextureWrapMode["CLAMP_TO_EDGE"] = gl.CLAMP_TO_EDGE] = "CLAMP_TO_EDGE";
        TextureWrapMode[TextureWrapMode["MIRRORED_REPEAT"] = gl.MIRRORED_REPEAT] = "MIRRORED_REPEAT";
    })(TextureWrapMode || (TextureWrapMode = {}));
    exports.TextureWrapMode = TextureWrapMode;
    var UniformQuery;
    (function (UniformQuery) {
        UniformQuery[UniformQuery["UNIFORM_TYPE"] = gl.UNIFORM_TYPE] = "UNIFORM_TYPE";
        UniformQuery[UniformQuery["UNIFORM_SIZE"] = gl.UNIFORM_SIZE] = "UNIFORM_SIZE";
        UniformQuery[UniformQuery["UNIFORM_BLOCK_INDEX"] = gl.UNIFORM_BLOCK_INDEX] = "UNIFORM_BLOCK_INDEX";
        UniformQuery[UniformQuery["UNIFORM_OFFSET"] = gl.UNIFORM_OFFSET] = "UNIFORM_OFFSET";
        UniformQuery[UniformQuery["UNIFORM_ARRAY_STRIDE"] = gl.UNIFORM_ARRAY_STRIDE] = "UNIFORM_ARRAY_STRIDE";
        UniformQuery[UniformQuery["UNIFORM_MATRIX_STRIDE"] = gl.UNIFORM_MATRIX_STRIDE] = "UNIFORM_MATRIX_STRIDE";
        UniformQuery[UniformQuery["UNIFORM_IS_ROW_MAJOR"] = gl.UNIFORM_IS_ROW_MAJOR] = "UNIFORM_IS_ROW_MAJOR";
    })(UniformQuery || (UniformQuery = {}));
    exports.UniformQuery = UniformQuery;
    var UniformType;
    (function (UniformType) {
        UniformType[UniformType["BOOL"] = gl.BOOL] = "BOOL";
        UniformType[UniformType["BOOL_VEC2"] = gl.BOOL_VEC2] = "BOOL_VEC2";
        UniformType[UniformType["BOOL_VEC3"] = gl.BOOL_VEC3] = "BOOL_VEC3";
        UniformType[UniformType["BOOL_VEC4"] = gl.BOOL_VEC4] = "BOOL_VEC4";
        UniformType[UniformType["INT"] = gl.INT] = "INT";
        UniformType[UniformType["INT_VEC2"] = gl.INT_VEC2] = "INT_VEC2";
        UniformType[UniformType["INT_VEC3"] = gl.INT_VEC3] = "INT_VEC3";
        UniformType[UniformType["INT_VEC4"] = gl.INT_VEC4] = "INT_VEC4";
        UniformType[UniformType["INT_SAMPLER_2D"] = gl.INT_SAMPLER_2D] = "INT_SAMPLER_2D";
        UniformType[UniformType["INT_SAMPLER_3D"] = gl.INT_SAMPLER_3D] = "INT_SAMPLER_3D";
        UniformType[UniformType["INT_SAMPLER_CUBE"] = gl.INT_SAMPLER_CUBE] = "INT_SAMPLER_CUBE";
        UniformType[UniformType["INT_SAMPLER_2D_ARRAY"] = gl.INT_SAMPLER_2D_ARRAY] = "INT_SAMPLER_2D_ARRAY";
        UniformType[UniformType["UNSIGNED_INT_SAMPLER_2D"] = gl.UNSIGNED_INT_SAMPLER_2D] = "UNSIGNED_INT_SAMPLER_2D";
        UniformType[UniformType["UNSIGNED_INT_SAMPLER_3D"] = gl.UNSIGNED_INT_SAMPLER_3D] = "UNSIGNED_INT_SAMPLER_3D";
        UniformType[UniformType["UNSIGNED_INT_SAMPLER_CUBE"] = gl.UNSIGNED_INT_SAMPLER_CUBE] = "UNSIGNED_INT_SAMPLER_CUBE";
        UniformType[UniformType["UNSIGNED_INT_SAMPLER_2D_ARRAY"] = gl.UNSIGNED_INT_SAMPLER_2D_ARRAY] = "UNSIGNED_INT_SAMPLER_2D_ARRAY";
        UniformType[UniformType["UNSIGNED_INT"] = gl.UNSIGNED_INT] = "UNSIGNED_INT";
        UniformType[UniformType["UNSIGNED_INT_VEC2"] = gl.UNSIGNED_INT_VEC2] = "UNSIGNED_INT_VEC2";
        UniformType[UniformType["UNSIGNED_INT_VEC3"] = gl.UNSIGNED_INT_VEC3] = "UNSIGNED_INT_VEC3";
        UniformType[UniformType["UNSIGNED_INT_VEC4"] = gl.UNSIGNED_INT_VEC4] = "UNSIGNED_INT_VEC4";
        UniformType[UniformType["FLOAT"] = gl.FLOAT] = "FLOAT";
        UniformType[UniformType["FLOAT_VEC2"] = gl.FLOAT_VEC2] = "FLOAT_VEC2";
        UniformType[UniformType["FLOAT_VEC3"] = gl.FLOAT_VEC3] = "FLOAT_VEC3";
        UniformType[UniformType["FLOAT_VEC4"] = gl.FLOAT_VEC4] = "FLOAT_VEC4";
        UniformType[UniformType["FLOAT_MAT2"] = gl.FLOAT_MAT2] = "FLOAT_MAT2";
        UniformType[UniformType["FLOAT_MAT3"] = gl.FLOAT_MAT3] = "FLOAT_MAT3";
        UniformType[UniformType["FLOAT_MAT4"] = gl.FLOAT_MAT4] = "FLOAT_MAT4";
        UniformType[UniformType["FLOAT_MAT2x3"] = gl.FLOAT_MAT2x3] = "FLOAT_MAT2x3";
        UniformType[UniformType["FLOAT_MAT2x4"] = gl.FLOAT_MAT2x4] = "FLOAT_MAT2x4";
        UniformType[UniformType["FLOAT_MAT3x2"] = gl.FLOAT_MAT3x2] = "FLOAT_MAT3x2";
        UniformType[UniformType["FLOAT_MAT3x4"] = gl.FLOAT_MAT3x4] = "FLOAT_MAT3x4";
        UniformType[UniformType["FLOAT_MAT4x2"] = gl.FLOAT_MAT4x2] = "FLOAT_MAT4x2";
        UniformType[UniformType["FLOAT_MAT4x3"] = gl.FLOAT_MAT4x3] = "FLOAT_MAT4x3";
        UniformType[UniformType["SAMPLER_2D"] = gl.SAMPLER_2D] = "SAMPLER_2D";
        UniformType[UniformType["SAMPLER_3D"] = gl.SAMPLER_3D] = "SAMPLER_3D";
        UniformType[UniformType["SAMPLER_CUBE"] = gl.SAMPLER_CUBE] = "SAMPLER_CUBE";
        UniformType[UniformType["SAMPLER_2D_SHADOW"] = gl.SAMPLER_2D_SHADOW] = "SAMPLER_2D_SHADOW";
        UniformType[UniformType["SAMPLER_2D_ARRAY"] = gl.SAMPLER_2D_ARRAY] = "SAMPLER_2D_ARRAY";
        UniformType[UniformType["SAMPLER_2D_ARRAY_SHADOW"] = gl.SAMPLER_2D_ARRAY_SHADOW] = "SAMPLER_2D_ARRAY_SHADOW";
        UniformType[UniformType["SAMPLER_CUBE_SHADOW"] = gl.SAMPLER_CUBE_SHADOW] = "SAMPLER_CUBE_SHADOW";
    })(UniformType || (UniformType = {}));
    exports.UniformType = UniformType;
    var VertexAttribute;
    (function (VertexAttribute) {
        VertexAttribute[VertexAttribute["CURRENT_VERTEX_ATTRIB"] = gl.CURRENT_VERTEX_ATTRIB] = "CURRENT_VERTEX_ATTRIB";
        VertexAttribute[VertexAttribute["VERTEX_ATTRIB_ARRAY_ENABLED"] = gl.VERTEX_ATTRIB_ARRAY_ENABLED] = "VERTEX_ATTRIB_ARRAY_ENABLED";
        VertexAttribute[VertexAttribute["VERTEX_ATTRIB_ARRAY_SIZE"] = gl.VERTEX_ATTRIB_ARRAY_SIZE] = "VERTEX_ATTRIB_ARRAY_SIZE";
        VertexAttribute[VertexAttribute["VERTEX_ATTRIB_ARRAY_STRIDE"] = gl.VERTEX_ATTRIB_ARRAY_STRIDE] = "VERTEX_ATTRIB_ARRAY_STRIDE";
        VertexAttribute[VertexAttribute["VERTEX_ATTRIB_ARRAY_TYPE"] = gl.VERTEX_ATTRIB_ARRAY_TYPE] = "VERTEX_ATTRIB_ARRAY_TYPE";
        VertexAttribute[VertexAttribute["VERTEX_ATTRIB_ARRAY_NORMALIZED"] = gl.VERTEX_ATTRIB_ARRAY_NORMALIZED] = "VERTEX_ATTRIB_ARRAY_NORMALIZED";
        VertexAttribute[VertexAttribute["VERTEX_ATTRIB_ARRAY_POINTER"] = gl.VERTEX_ATTRIB_ARRAY_POINTER] = "VERTEX_ATTRIB_ARRAY_POINTER";
        VertexAttribute[VertexAttribute["VERTEX_ATTRIB_ARRAY_BUFFER_BINDING"] = gl.VERTEX_ATTRIB_ARRAY_BUFFER_BINDING] = "VERTEX_ATTRIB_ARRAY_BUFFER_BINDING";
    })(VertexAttribute || (VertexAttribute = {}));
    exports.VertexAttribute = VertexAttribute;
});
define("engine/core/rendering/webgl/WebGLFramebufferUtilities", ["require", "exports", "engine/core/rendering/webgl/WebGLConstants"], function (require, exports, WebGLConstants_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WebGLFramebufferUtilities = void 0;
    class WebGLFramebufferUtilities {
        constructor() { }
        static createFramebuffer(gl) {
            const glFb = gl.createFramebuffer();
            if (glFb === null) {
                console.error(`Could not create WebGLFramebuffer.`);
                return null;
            }
            return {
                glFb: glFb
            };
        }
        static attachTexture(gl, fb, props) {
            const target = WebGLConstants_1.FramebufferTarget.FRAMEBUFFER;
            gl.bindFramebuffer(target, fb.glFb);
            gl.framebufferTexture2D(target, props.attachment, props.texTarget, props.glTex, 0);
            gl.bindFramebuffer(target, null);
            return {
                ...props,
                ...fb
            };
        }
        static attachTextures(gl, fb, props) {
            const target = gl.FRAMEBUFFER;
            gl.bindFramebuffer(target, fb.glFb);
            const attachments = props.map((props) => {
                gl.framebufferTexture2D(target, props.attachment, props.texTarget, props.glTex, 0);
                return {
                    ...props,
                    ...fb
                };
            });
            gl.bindFramebuffer(target, null);
            return attachments;
        }
        static attachRenderbuffers(gl, fb, props) {
            const target = gl.FRAMEBUFFER;
            gl.bindFramebuffer(target, fb.glFb);
            const attachments = props.map((props) => {
                gl.framebufferRenderbuffer(target, props.attachment, gl.RENDERBUFFER, props.glRb);
                return {
                    ...props,
                    ...fb
                };
            });
            gl.bindFramebuffer(target, null);
            return attachments;
        }
        static attachRenderbuffer(gl, fb, props) {
            const target = gl.FRAMEBUFFER;
            gl.bindFramebuffer(target, fb.glFb);
            gl.framebufferRenderbuffer(target, props.attachment, gl.RENDERBUFFER, props.glRb);
            gl.bindFramebuffer(target, null);
            return {
                ...props,
                ...fb
            };
        }
        static blit(gl, readFb, drawFb, readRec, drawRec, mask, filter) {
            gl.bindFramebuffer(gl.READ_FRAMEBUFFER, (readFb !== null) ? readFb.glFb : null);
            gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, (drawFb !== null) ? drawFb.glFb : null);
            gl.blitFramebuffer(readRec[0], readRec[1], readRec[2], readRec[3], drawRec[0], drawRec[1], drawRec[2], drawRec[3], mask, filter);
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        }
        static clearColor(gl, fb, buff, offset = 0) {
            gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, fb.glFb);
            gl.clearBufferfv(gl.COLOR, 0, buff, offset);
        }
        static clearDepthStencil(gl, fb, depth, stencil) {
            gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, fb.glFb);
            gl.clearBufferfi(gl.DEPTH_STENCIL, 0, depth, stencil);
        }
        static checkFramebufferStatus(gl) {
            return gl.checkFramebufferStatus(gl.FRAMEBUFFER);
        }
        static deleteFramebuffer(gl, fb) {
            const glFb = fb.glFb;
            if (gl.isFramebuffer(glFb)) {
                gl.deleteFramebuffer(glFb);
            }
        }
        static bindFramebuffer(gl, fb) {
            gl.bindFramebuffer(gl.FRAMEBUFFER, fb.glFb);
        }
        static unbindFramebuffer(gl) {
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        }
    }
    exports.WebGLFramebufferUtilities = WebGLFramebufferUtilities;
});
define("engine/core/rendering/webgl/WebGLBufferUtilities", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WebGLBufferUtilities = void 0;
    class WebGLBufferUtilities {
        static createBuffer(gl) {
            const glBuff = gl.createBuffer();
            if (glBuff == null) {
                console.error('Could not create WebGLBuffer.');
            }
            return glBuff;
        }
    }
    exports.WebGLBufferUtilities = WebGLBufferUtilities;
});
define("engine/core/rendering/webgl/WebGLVertexArrayUtilities", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WebGLVertexArrayUtilities = void 0;
    class WebGLVertexArrayUtilities {
        constructor() { }
        static createVertexArray(gl) {
            const glVao = gl.createVertexArray();
            if (glVao === null) {
                console.error('Could not create WebGLVertexArrayObject.');
            }
            return glVao;
        }
    }
    exports.WebGLVertexArrayUtilities = WebGLVertexArrayUtilities;
});
define("engine/core/rendering/webgl/WebGLAttributeUtilities", ["require", "exports", "engine/core/rendering/webgl/WebGLConstants", "engine/core/rendering/webgl/WebGLBufferUtilities", "engine/core/rendering/webgl/WebGLVertexArrayUtilities"], function (require, exports, WebGLConstants_2, WebGLBufferUtilities_1, WebGLVertexArrayUtilities_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WebGLAttributeUtilities = void 0;
    class WebGLAttributeUtilities {
        static getAttributesListSetter(gl, glProg, list) {
            const glVao = WebGLVertexArrayUtilities_1.WebGLVertexArrayUtilities.createVertexArray(gl);
            if (glVao === null) {
                return null;
            }
            const glBuffer = WebGLBufferUtilities_1.WebGLBufferUtilities.createBuffer(gl);
            if (glBuffer === null) {
                return null;
            }
            const glIndicesBuffer = WebGLBufferUtilities_1.WebGLBufferUtilities.createBuffer(gl);
            if (glIndicesBuffer === null) {
                return null;
            }
            const attributes = list.list;
            const props = list.props;
            const instanced = (props === null || props === void 0 ? void 0 : props.instanced) || false;
            const divisor = (props === null || props === void 0 ? void 0 : props.divisor) || 1;
            const target = (props === null || props === void 0 ? void 0 : props.target) || WebGLConstants_2.BufferTarget.ARRAY_BUFFER;
            const usage = (props === null || props === void 0 ? void 0 : props.usage) || WebGLConstants_2.BufferDataUsage.STATIC_DRAW;
            const attributesNames = Object.keys(attributes);
            const attributesValues = attributesNames.map((attributeName) => {
                return attributes[attributeName];
            });
            const numElements = (typeof list.indices !== 'undefined') ? list.indices.length : this.getAttributesListNumElements(list);
            const indexType = (typeof list.indices !== 'undefined') ? this.getAttributeIndicesBufferType(list.indices) : WebGLConstants_2.BufferIndexType.UNSIGNED_SHORT;
            const settersList = {
                setters: {}
            };
            let bufferByteLength = 0;
            attributesValues.forEach((attr) => {
                bufferByteLength += attr.array.byteLength + (32 - attr.array.byteLength % 32) % 32;
            });
            let bufferBytesOffset = 0;
            gl.bindVertexArray(glVao);
            gl.bindBuffer(target, glBuffer);
            gl.bufferData(target, bufferByteLength, usage);
            for (const name of attributesNames) {
                const attribute = attributes[name];
                const props = attribute.props;
                const location = gl.getAttribLocation(glProg, name);
                if (location == -1) {
                    console.warn(`Attribute ${name} could not be located.`);
                    continue;
                }
                gl.enableVertexAttribArray(location);
                const type = this.getAttributeArrayDataType(attribute.array);
                const normalized = (typeof props.normalized === 'undefined') ? false : props.normalized;
                gl.vertexAttribPointer(location, props.numComponents, type, normalized, 0, bufferBytesOffset);
                if (instanced) {
                    gl.vertexAttribDivisor(location, divisor);
                }
                settersList.setters[name] = {
                    location: location,
                    bufferBytesOffset: bufferBytesOffset
                };
                bufferBytesOffset += attribute.array.byteLength + (32 - attribute.array.byteLength % 32) % 32;
            }
            let hasIndices = false;
            if (typeof list.indices !== 'undefined') {
                hasIndices = true;
                gl.bindBuffer(WebGLConstants_2.BufferTarget.ELEMENT_ARRAY_BUFFER, glIndicesBuffer);
                gl.bufferData(WebGLConstants_2.BufferTarget.ELEMENT_ARRAY_BUFFER, list.indices.byteLength, WebGLConstants_2.BufferDataUsage.STATIC_READ);
            }
            gl.bindVertexArray(null);
            settersList.glBuffer = glBuffer;
            settersList.glIndicesBuffer = glIndicesBuffer;
            settersList.glProg = glProg;
            settersList.glVao = glVao;
            settersList.props = {
                instanced: instanced,
                divisor: divisor,
                target: target,
                usage: usage
            };
            settersList.bufferByteLength = bufferByteLength;
            settersList.numElements = numElements;
            settersList.indexType = indexType;
            settersList.hasIndices = hasIndices;
            return settersList;
        }
        static setAttributesListValues(gl, settersList, list) {
            const attributes = list.list;
            gl.bindVertexArray(settersList.glVao);
            gl.bindBuffer(settersList.props.target, settersList.glBuffer);
            for (const name in attributes) {
                const attribute = attributes[name];
                const setter = settersList.setters[name];
                const srcOffset = (typeof attribute.props.srcOffset === 'undefined') ? 0 : attribute.props.srcOffset;
                const srcLength = (typeof attribute.props.srcLength === 'undefined') ? attribute.array.length : attribute.props.srcLength;
                if (typeof setter !== 'undefined') {
                    gl.bufferSubData(settersList.props.target, setter.bufferBytesOffset, attribute.array, srcOffset, srcLength);
                }
                else {
                    console.warn(`Attribute ${name} does not exist in the setters.`);
                }
            }
            if (typeof list.indices !== 'undefined') {
                gl.bindBuffer(WebGLConstants_2.BufferTarget.ELEMENT_ARRAY_BUFFER, settersList.glIndicesBuffer);
                gl.bufferSubData(WebGLConstants_2.BufferTarget.ELEMENT_ARRAY_BUFFER, 0, list.indices);
            }
            gl.bindVertexArray(null);
        }
        static bindAttributesList(gl, settersList) {
            gl.bindVertexArray(settersList.glVao);
        }
        static unbindAttributesList(gl) {
            gl.bindVertexArray(null);
        }
        static getAttributeArrayDataType(array) {
            if (array instanceof Float32Array || array instanceof Int32Array || array instanceof Uint32Array) {
                return WebGLConstants_2.DataType.FLOAT;
            }
            else if (array instanceof Int16Array) {
                return WebGLConstants_2.DataType.SHORT;
            }
            else if (array instanceof Uint16Array) {
                return WebGLConstants_2.DataType.UNSIGNED_SHORT;
            }
            else if (array instanceof Int8Array) {
                return WebGLConstants_2.DataType.BYTE;
            }
            else if (array instanceof Uint8Array) {
                return WebGLConstants_2.DataType.UNSIGNED_BYTE;
            }
            console.error(`Unsupported attribute array ${array}.`);
            return -1;
        }
        static getDataTypeByteLength(dataType) {
            switch (dataType) {
                case WebGLConstants_2.DataType.FLOAT:
                    return 4;
                case WebGLConstants_2.DataType.SHORT:
                case WebGLConstants_2.DataType.UNSIGNED_SHORT:
                    return 2;
                case WebGLConstants_2.DataType.BYTE:
                case WebGLConstants_2.DataType.UNSIGNED_BYTE:
                    return 1;
            }
            console.error(`Unsupported data type ${WebGLConstants_2.DataType[dataType]}.`);
            return -1;
        }
        static getAttributeIndicesBufferType(indices) {
            if (indices instanceof Uint8Array) {
                return WebGLConstants_2.BufferIndexType.UNSIGNED_BYTE;
            }
            else if (indices instanceof Uint16Array) {
                return WebGLConstants_2.BufferIndexType.UNSIGNED_SHORT;
            }
            else {
                return WebGLConstants_2.BufferIndexType.UNSIGNED_INT;
            }
        }
        static getAttributesListNumElements(list) {
            const attributes = list.list;
            const attributesNames = Object.keys(attributes);
            let numElements = 0;
            for (const name of attributesNames) {
                const attribute = attributes[name];
                if (numElements == 0) {
                    numElements = Math.floor(attribute.array.length / attribute.props.numComponents);
                }
                else if (Math.floor(attribute.array.length / attribute.props.numComponents) !== numElements) {
                    console.error(`Attribute ${name} should have ${numElements} elements.`);
                }
            }
            return numElements;
        }
    }
    exports.WebGLAttributeUtilities = WebGLAttributeUtilities;
});
define("engine/core/rendering/webgl/WebGLTextureUtilities", ["require", "exports", "engine/core/rendering/webgl/WebGLConstants"], function (require, exports, WebGLConstants_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WebGLTextureUtilities = void 0;
    class WebGLTextureUtilities {
        constructor() { }
        static createBindingsContext(gl) {
            const maxTextureUnits = gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS);
            const registeredTextureUnits = new Array(maxTextureUnits);
            return {
                maxTextureUnits: maxTextureUnits,
                registeredTextureUnits: registeredTextureUnits
            };
        }
        static createTexture(gl, ctx, props) {
            const glTex = gl.createTexture();
            if (glTex === null) {
                console.error(`Could not create WebGLTexture.`);
                return null;
            }
            const unit = this._allocateTextureUnit(ctx);
            if (unit < 0) {
                console.error(`Could not allocate another texture unit.`);
                return null;
            }
            const tex = {
                ...props,
                unit: unit,
                glTex: glTex
            };
            this.setTexture(gl, tex);
            return tex;
        }
        static deleteTexture(gl, ctx, tex) {
            gl.deleteTexture(tex.glTex);
            this._freeTextureUnit(ctx, tex.unit);
        }
        static setTexture(gl, tex) {
            gl.activeTexture(WebGLConstants_3.TextureUnits.TEXTURE0 + tex.unit);
            gl.bindTexture(tex.target, tex.glTex);
            this.setTextureParameters(gl, tex);
            const pixels = tex.pixels;
            const internalFormat = tex.internalFormat || tex.format;
            if (pixels == null) {
                gl.texImage2D(tex.target, tex.lod, internalFormat, tex.width, tex.height, 0, tex.format, tex.type, null);
            }
            else {
                if ('xPos' in pixels) {
                    gl.texImage2D(WebGLConstants_3.TextureTarget.TEXTURE_CUBE_MAP_POSITIVE_X, tex.lod, internalFormat, tex.width, tex.height, 0, tex.format, tex.type, pixels.xPos);
                    gl.texImage2D(WebGLConstants_3.TextureTarget.TEXTURE_CUBE_MAP_NEGATIVE_X, tex.lod, internalFormat, tex.width, tex.height, 0, tex.format, tex.type, pixels.xNeg);
                    gl.texImage2D(WebGLConstants_3.TextureTarget.TEXTURE_CUBE_MAP_POSITIVE_Y, tex.lod, internalFormat, tex.width, tex.height, 0, tex.format, tex.type, pixels.yPos);
                    gl.texImage2D(WebGLConstants_3.TextureTarget.TEXTURE_CUBE_MAP_NEGATIVE_Y, tex.lod, internalFormat, tex.width, tex.height, 0, tex.format, tex.type, pixels.yNeg);
                    gl.texImage2D(WebGLConstants_3.TextureTarget.TEXTURE_CUBE_MAP_POSITIVE_Z, tex.lod, internalFormat, tex.width, tex.height, 0, tex.format, tex.type, pixels.zPos);
                    gl.texImage2D(WebGLConstants_3.TextureTarget.TEXTURE_CUBE_MAP_NEGATIVE_Z, tex.lod, internalFormat, tex.width, tex.height, 0, tex.format, tex.type, pixels.zNeg);
                }
                else {
                    if (typeof tex.subimage !== 'undefined') {
                        gl.texImage2D(tex.target, tex.lod, internalFormat, tex.width, tex.height, 0, tex.format, tex.type, tex.pixels);
                        gl.texSubImage2D(tex.target, tex.lod, tex.subimage.xoffset, tex.subimage.yoffset, tex.subimage.width, tex.subimage.height, tex.format, tex.type, tex.pixels);
                    }
                    else {
                        gl.texImage2D(tex.target, tex.lod, internalFormat, tex.width, tex.height, 0, tex.format, tex.type, tex.pixels);
                    }
                }
                gl.generateMipmap(tex.target);
            }
        }
        static setTextureParameters(gl, tex) {
            gl.activeTexture(WebGLConstants_3.TextureUnits.TEXTURE0 + tex.unit);
            gl.bindTexture(tex.target, tex.glTex);
            if (typeof tex.min !== 'undefined')
                gl.texParameteri(tex.target, WebGLConstants_3.TextureParameter.TEXTURE_MIN_FILTER, tex.min);
            if (typeof tex.mag !== 'undefined')
                gl.texParameteri(tex.target, WebGLConstants_3.TextureParameter.TEXTURE_MAG_FILTER, tex.mag);
            if (typeof tex.wrapS !== 'undefined')
                gl.texParameteri(tex.target, WebGLConstants_3.TextureParameter.TEXTURE_WRAP_S, tex.wrapS);
            if (typeof tex.wrapT !== 'undefined')
                gl.texParameteri(tex.target, WebGLConstants_3.TextureParameter.TEXTURE_WRAP_T, tex.wrapT);
            if (typeof tex.wrapR !== 'undefined')
                gl.texParameteri(tex.target, WebGLConstants_3.TextureParameter.TEXTURE_WRAP_R, tex.wrapR);
            if (typeof tex.baseLod !== 'undefined')
                gl.texParameteri(tex.target, WebGLConstants_3.TextureParameter.TEXTURE_BASE_LEVEL, tex.baseLod);
            if (typeof tex.maxLod !== 'undefined')
                gl.texParameteri(tex.target, WebGLConstants_3.TextureParameter.TEXTURE_MAX_LEVEL, tex.maxLod);
        }
        static bindTexture(gl, tex) {
            gl.bindTexture(tex.target, tex.glTex);
        }
        static guessTextureProperties(tex) {
            if (typeof tex.target === 'undefined')
                tex.target = WebGLConstants_3.TextureTarget.TEXTURE_2D;
            if (typeof tex.format === 'undefined')
                tex.format = WebGLConstants_3.PixelFormat.RGBA;
            if (typeof tex.type === 'undefined')
                tex.type = WebGLConstants_3.PixelType.UNSIGNED_BYTE;
            if (typeof tex.lod === 'undefined')
                tex.lod = 0;
            if (typeof tex.pixels === 'undefined')
                tex.pixels = null;
            const pixels = tex.pixels;
            if (pixels !== null) {
                if ('xPos' in pixels) {
                    tex.target = WebGLConstants_3.TextureTarget.TEXTURE_CUBE_MAP;
                    tex.width = pixels.xPos.width;
                    tex.height = pixels.xPos.height;
                }
                else {
                    tex.target = WebGLConstants_3.TextureTarget.TEXTURE_2D;
                    if ('width' in pixels) {
                        tex.width = pixels.width;
                        tex.height = pixels.height;
                    }
                    else {
                        let length = 0;
                        if (pixels instanceof Uint8Array || Array.isArray(pixels)) {
                            tex.type = WebGLConstants_3.PixelType.UNSIGNED_BYTE;
                            length = pixels.length;
                        }
                        else if (pixels instanceof Uint16Array) {
                            tex.type = WebGLConstants_3.PixelType.UNSIGNED_SHORT_4_4_4_4;
                            length = pixels.length;
                        }
                        else if (pixels instanceof Uint32Array) {
                            tex.type = WebGLConstants_3.PixelType.UNSIGNED_INT;
                            length = pixels.length;
                        }
                        else if (pixels instanceof Float32Array) {
                            tex.type = WebGLConstants_3.PixelType.FLOAT;
                            length = pixels.length;
                        }
                        const channels = this.getNumChannelsFromPixelFormat(tex.format);
                        const numPixels = length / channels;
                        const texSize = Math.sqrt(numPixels);
                        tex.width = texSize;
                        tex.height = texSize;
                    }
                }
            }
            return tex;
        }
        static getNumBytesFromPixelTypeAndFormat(type, format) {
            switch (format) {
                case WebGLConstants_3.PixelFormat.LUMINANCE:
                case WebGLConstants_3.PixelFormat.ALPHA:
                    return 1;
                case WebGLConstants_3.PixelFormat.LUMINANCE_ALPHA:
                    return 2;
                case WebGLConstants_3.PixelFormat.RGB:
                    switch (type) {
                        case WebGLConstants_3.PixelType.UNSIGNED_BYTE:
                            return 3;
                        case WebGLConstants_3.PixelType.UNSIGNED_SHORT_5_6_5:
                            return 2;
                    }
                case WebGLConstants_3.PixelFormat.RGBA:
                    switch (type) {
                        case WebGLConstants_3.PixelType.UNSIGNED_BYTE:
                            return 4;
                        case WebGLConstants_3.PixelType.UNSIGNED_SHORT_4_4_4_4:
                        case WebGLConstants_3.PixelType.UNSIGNED_SHORT_5_5_5_1:
                            return 2;
                    }
                default:
                    return 4;
            }
        }
        static getNumChannelsFromPixelFormat(format) {
            switch (format) {
                case WebGLConstants_3.PixelFormat.LUMINANCE:
                case WebGLConstants_3.PixelFormat.ALPHA:
                    return 1;
                case WebGLConstants_3.PixelFormat.LUMINANCE_ALPHA:
                    return 2;
                case WebGLConstants_3.PixelFormat.RGB:
                    return 3;
                case WebGLConstants_3.PixelFormat.RGBA:
                    return 4;
                default:
                    return 4;
            }
        }
        static _allocateTextureUnit(ctx) {
            for (let unit = 0; unit < ctx.maxTextureUnits; unit++) {
                if (!ctx.registeredTextureUnits[unit]) {
                    ctx.registeredTextureUnits[unit] = true;
                    return unit;
                }
            }
            return -1;
        }
        static _freeTextureUnit(ctx, unit) {
            ctx.registeredTextureUnits[unit] = false;
        }
    }
    exports.WebGLTextureUtilities = WebGLTextureUtilities;
});
define("engine/core/rendering/webgl/WebGLUniformUtilities", ["require", "exports", "engine/core/rendering/webgl/WebGLConstants"], function (require, exports, WebGLConstants_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WebGLUniformUtilities = void 0;
    class WebGLUniformUtilities {
        constructor() { }
        static getUniformValueArrayBufferView(uniformValue) {
            if (typeof uniformValue === 'number') {
                return new Float32Array([uniformValue]);
            }
            else if ('unit' in uniformValue) {
                return new Float32Array(uniformValue.unit);
            }
            else if (Array.isArray(uniformValue)) {
                return new Float32Array(uniformValue);
            }
            else {
                return uniformValue;
            }
        }
        static getUniformsListSetter(gl, glProg, list) {
            let settersList = {
                setters: {}
            };
            for (const name in list) {
                const uniform = list[name];
                const setter = this.getUniformSetter(gl, glProg, name, uniform);
                settersList.setters[name] = setter;
            }
            settersList.glProg = glProg;
            return settersList;
        }
        static setUniformsListValues(gl, settersList, list) {
            for (const name in list) {
                const uniform = list[name];
                const setter = settersList.setters[name];
                if (setter == null) {
                    continue;
                }
                if (typeof setter !== 'undefined') {
                    setter.func(uniform.value);
                }
                else {
                    console.warn(`Uniform ${name} does not match with the given setters.`);
                }
            }
        }
        static isTexture(uniformValue) {
            return (typeof uniformValue !== 'number' && 'unit' in uniformValue);
        }
        static getUniformSetter(gl, glProg, uniformName, uniform) {
            const location = gl.getUniformLocation(glProg, uniformName);
            if (location == null) {
                console.error(`Uniform ${uniformName} could not be located.`);
                return null;
            }
            const uniformIndices = gl.getUniformIndices(glProg, [uniformName]);
            if (uniformIndices == null) {
                console.error(`Uniform ${uniformName} could not be found.`);
                return null;
            }
            const uniformType = gl.getActiveUniforms(glProg, uniformIndices, WebGLConstants_4.UniformQuery.UNIFORM_TYPE)[0];
            const value = uniform.value;
            const props = (typeof uniform.props === 'undefined') ? {
                srcOffset: undefined,
                srcLength: undefined,
                transpose: false
            } : {
                srcOffset: uniform.props.srcOffset || undefined,
                srcLength: uniform.props.srcLength || undefined,
                transpose: uniform.props.transpose || false
            };
            const uniformTypeWarning = (uniformType, valueType) => {
                console.warn(`Uniform ${uniformName} of type ${WebGLConstants_4.UniformType[uniformType]} should have a value of type ${valueType}`);
            };
            switch (uniformType) {
                case WebGLConstants_4.UniformType.FLOAT:
                    if (typeof value === 'number') {
                        return {
                            type: uniformType,
                            func: (num) => {
                                gl.uniform1f(location, num);
                            }
                        };
                    }
                    else {
                        uniformTypeWarning(uniformType, 'number');
                    }
                    break;
                case WebGLConstants_4.UniformType.UNSIGNED_INT:
                    if (typeof value === 'number') {
                        return {
                            type: uniformType,
                            func: (num) => {
                                gl.uniform1ui(location, num);
                            }
                        };
                    }
                    else {
                        uniformTypeWarning(uniformType, 'number');
                    }
                    break;
                case WebGLConstants_4.UniformType.BOOL:
                case WebGLConstants_4.UniformType.INT:
                    if (typeof value === 'number') {
                        return {
                            type: uniformType,
                            func: (num) => {
                                gl.uniform1i(location, num);
                            }
                        };
                    }
                    else {
                        uniformTypeWarning(uniformType, 'number');
                    }
                    break;
                case WebGLConstants_4.UniformType.INT_SAMPLER_2D:
                case WebGLConstants_4.UniformType.INT_SAMPLER_2D_ARRAY:
                case WebGLConstants_4.UniformType.INT_SAMPLER_3D:
                case WebGLConstants_4.UniformType.INT_SAMPLER_CUBE:
                case WebGLConstants_4.UniformType.SAMPLER_2D:
                case WebGLConstants_4.UniformType.SAMPLER_3D:
                case WebGLConstants_4.UniformType.SAMPLER_CUBE:
                case WebGLConstants_4.UniformType.SAMPLER_2D_SHADOW:
                case WebGLConstants_4.UniformType.SAMPLER_2D_ARRAY:
                case WebGLConstants_4.UniformType.SAMPLER_2D_ARRAY_SHADOW:
                case WebGLConstants_4.UniformType.SAMPLER_CUBE_SHADOW:
                case WebGLConstants_4.UniformType.UNSIGNED_INT_SAMPLER_2D:
                case WebGLConstants_4.UniformType.UNSIGNED_INT_SAMPLER_3D:
                case WebGLConstants_4.UniformType.UNSIGNED_INT_SAMPLER_CUBE:
                case WebGLConstants_4.UniformType.UNSIGNED_INT_SAMPLER_2D_ARRAY:
                    if (typeof value !== 'number' && 'unit' in value) {
                        return {
                            type: uniformType,
                            func: (tex) => {
                                gl.activeTexture(WebGLConstants_4.TextureUnits.TEXTURE0 + tex.unit);
                                gl.bindTexture(tex.target, tex.glTex);
                                gl.uniform1i(location, tex.unit);
                            }
                        };
                    }
                    else {
                        uniformTypeWarning(uniformType, 'TextureSetter');
                    }
                    break;
                case WebGLConstants_4.UniformType.FLOAT_VEC2:
                    if (value instanceof Float32Array || Array.isArray(value)) {
                        return {
                            type: uniformType,
                            func: (vec) => {
                                gl.uniform2fv(location, vec, props.srcOffset, props.srcLength);
                            }
                        };
                    }
                    else {
                        uniformTypeWarning(uniformType, 'Float32List');
                    }
                    break;
                case WebGLConstants_4.UniformType.BOOL_VEC2:
                case WebGLConstants_4.UniformType.INT_VEC2:
                    if (value instanceof Int32Array || Array.isArray(value)) {
                        return {
                            type: uniformType,
                            func: (vec) => {
                                gl.uniform2iv(location, vec);
                            }
                        };
                    }
                    else {
                        uniformTypeWarning(uniformType, 'Int32List');
                    }
                    break;
                case WebGLConstants_4.UniformType.UNSIGNED_INT_VEC2:
                    if (value instanceof Uint32Array || Array.isArray(value)) {
                        return {
                            type: uniformType,
                            func: (vec) => {
                                gl.uniform2uiv(location, vec, props.srcOffset, props.srcLength);
                            }
                        };
                    }
                    else {
                        uniformTypeWarning(uniformType, 'Uint32List');
                    }
                    break;
                case WebGLConstants_4.UniformType.FLOAT_VEC3:
                    if (value instanceof Float32Array || Array.isArray(value)) {
                        return {
                            type: uniformType,
                            func: (vec) => {
                                gl.uniform3fv(location, vec, props.srcOffset, props.srcLength);
                            }
                        };
                    }
                    else {
                        uniformTypeWarning(uniformType, 'Float32List');
                    }
                    break;
                case WebGLConstants_4.UniformType.BOOL_VEC3:
                case WebGLConstants_4.UniformType.INT_VEC3:
                    if (value instanceof Int32Array || Array.isArray(value)) {
                        return {
                            type: uniformType,
                            func: (vec) => {
                                gl.uniform3iv(location, vec, props.srcOffset, props.srcLength);
                            }
                        };
                    }
                    else {
                        uniformTypeWarning(uniformType, 'Int32List');
                    }
                    break;
                case WebGLConstants_4.UniformType.UNSIGNED_INT_VEC3:
                    if (value instanceof Uint32Array || Array.isArray(value)) {
                        return {
                            type: uniformType,
                            func: (vec) => {
                                gl.uniform3uiv(location, vec, props.srcOffset, props.srcLength);
                            }
                        };
                    }
                    else {
                        uniformTypeWarning(uniformType, 'Uint32List');
                    }
                    break;
                case WebGLConstants_4.UniformType.FLOAT_VEC4:
                    if (value instanceof Float32Array || Array.isArray(value)) {
                        return {
                            type: uniformType,
                            func: (vec) => {
                                gl.uniform4fv(location, vec, props.srcOffset, props.srcLength);
                            }
                        };
                    }
                    else {
                        uniformTypeWarning(uniformType, 'Float32List');
                    }
                    break;
                case WebGLConstants_4.UniformType.BOOL_VEC4:
                case WebGLConstants_4.UniformType.INT_VEC4:
                    if (value instanceof Int32Array || Array.isArray(value)) {
                        return {
                            type: uniformType,
                            func: (vec) => {
                                gl.uniform4iv(location, vec, props.srcOffset, props.srcLength);
                            }
                        };
                    }
                    else {
                        uniformTypeWarning(uniformType, 'Int32List');
                    }
                    break;
                case WebGLConstants_4.UniformType.UNSIGNED_INT_VEC4:
                    if (value instanceof Uint32Array || Array.isArray(value)) {
                        return {
                            type: uniformType,
                            func: (vec) => {
                                gl.uniform4uiv(location, vec, props.srcOffset, props.srcLength);
                            }
                        };
                    }
                    else {
                        uniformTypeWarning(uniformType, 'Uint32List');
                    }
                    break;
                case WebGLConstants_4.UniformType.FLOAT_MAT2:
                    if (value instanceof Float32Array || Array.isArray(value)) {
                        return {
                            type: uniformType,
                            func: (mat) => {
                                gl.uniformMatrix2fv(location, props.transpose, mat, props.srcOffset, props.srcLength);
                            }
                        };
                    }
                    else {
                        uniformTypeWarning(uniformType, 'Float32List');
                    }
                    break;
                case WebGLConstants_4.UniformType.FLOAT_MAT3:
                    if (value instanceof Float32Array || Array.isArray(value)) {
                        return {
                            type: uniformType,
                            func: (mat) => {
                                gl.uniformMatrix3fv(location, props.transpose, mat, props.srcOffset, props.srcLength);
                            }
                        };
                    }
                    else {
                        uniformTypeWarning(uniformType, 'Float32List');
                    }
                    break;
                case WebGLConstants_4.UniformType.FLOAT_MAT4:
                    if (value instanceof Float32Array || Array.isArray(value)) {
                        return {
                            type: uniformType,
                            func: (mat) => {
                                gl.uniformMatrix4fv(location, props.transpose, mat);
                            }
                        };
                    }
                    else {
                        uniformTypeWarning(uniformType, 'Float32List');
                    }
                    break;
                case WebGLConstants_4.UniformType.FLOAT_MAT2x3:
                    if (value instanceof Float32Array || Array.isArray(value)) {
                        return {
                            type: uniformType,
                            func: (mat) => {
                                gl.uniformMatrix2x3fv(location, props.transpose, mat, props.srcOffset, props.srcLength);
                            }
                        };
                    }
                    else {
                        uniformTypeWarning(uniformType, 'Float32List');
                    }
                    break;
                case WebGLConstants_4.UniformType.FLOAT_MAT2x4:
                    if (value instanceof Float32Array || Array.isArray(value)) {
                        return {
                            type: uniformType,
                            func: (mat) => {
                                gl.uniformMatrix2x4fv(location, props.transpose, mat, props.srcOffset, props.srcLength);
                            }
                        };
                    }
                    else {
                        uniformTypeWarning(uniformType, 'Float32List');
                    }
                    break;
                case WebGLConstants_4.UniformType.FLOAT_MAT3x2:
                    if (value instanceof Float32Array || Array.isArray(value)) {
                        return {
                            type: uniformType,
                            func: (mat) => {
                                gl.uniformMatrix3x2fv(location, props.transpose, mat, props.srcOffset, props.srcLength);
                            }
                        };
                    }
                    else {
                        uniformTypeWarning(uniformType, 'Float32List');
                    }
                    break;
                case WebGLConstants_4.UniformType.FLOAT_MAT3x4:
                    if (value instanceof Float32Array || Array.isArray(value)) {
                        return {
                            type: uniformType,
                            func: (mat) => {
                                gl.uniformMatrix3x4fv(location, props.transpose, mat, props.srcOffset, props.srcLength);
                            }
                        };
                    }
                    else {
                        uniformTypeWarning(uniformType, 'Float32List');
                    }
                    break;
                case WebGLConstants_4.UniformType.FLOAT_MAT4x2:
                    if (value instanceof Float32Array || Array.isArray(value)) {
                        return {
                            type: uniformType,
                            func: (mat) => {
                                gl.uniformMatrix4x2fv(location, props.transpose, mat, props.srcOffset, props.srcLength);
                            }
                        };
                    }
                    else {
                        uniformTypeWarning(uniformType, 'Float32List');
                    }
                    break;
                case WebGLConstants_4.UniformType.FLOAT_MAT4x3:
                    if (value instanceof Float32Array || Array.isArray(value)) {
                        return {
                            type: uniformType,
                            func: (mat) => {
                                gl.uniformMatrix4x3fv(location, props.transpose, mat, props.srcOffset, props.srcLength);
                            }
                        };
                    }
                    else {
                        uniformTypeWarning(uniformType, 'Float32List');
                    }
                    break;
            }
            console.error(`Uniform ${uniformName} has an unknown type.`);
            return null;
        }
    }
    exports.WebGLUniformUtilities = WebGLUniformUtilities;
});
define("engine/core/rendering/webgl/WebGLUniformBlockUtilities", ["require", "exports", "engine/core/rendering/webgl/WebGLBufferUtilities", "engine/core/rendering/webgl/WebGLUniformUtilities", "engine/core/rendering/webgl/WebGLConstants"], function (require, exports, WebGLBufferUtilities_2, WebGLUniformUtilities_1, WebGLConstants_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WebGLUniformBlockUtilities = void 0;
    class WebGLUniformBlockUtilities {
        constructor() { }
        static createBindingsContext(gl) {
            const maxBindingPoints = gl.MAX_UNIFORM_BUFFER_BINDINGS;
            const registeredBindingPoints = new Array(maxBindingPoints);
            return {
                maxBindingPoints: maxBindingPoints,
                registeredBindingPoints: registeredBindingPoints
            };
        }
        static createUniformBlock(gl, ctx, name) {
            const glBuffer = WebGLBufferUtilities_2.WebGLBufferUtilities.createBuffer(gl);
            if (glBuffer === null) {
                return null;
            }
            const bindingPoint = this._allocateBindingPoint(ctx);
            if (bindingPoint === null) {
                console.error(`Could not allocate another binding point.`);
                return null;
            }
            return {
                name: name,
                bindingPoint: bindingPoint,
                glBuffer: glBuffer,
            };
        }
        static getUniformBlockSetter(gl, glProg, block) {
            gl.bindBuffer(WebGLConstants_5.BufferTarget.UNIFORM_BUFFER, block.glBuffer);
            const blockIndex = gl.getUniformBlockIndex(glProg, block.name);
            if (blockIndex === gl.INVALID_INDEX) {
                console.error(`Block '${block.name}' does not identify a valid uniform block.`);
                return null;
            }
            const usage = (typeof block.usage === 'undefined') ? gl.DYNAMIC_DRAW : block.usage;
            const bindingPoint = block.bindingPoint;
            gl.uniformBlockBinding(glProg, blockIndex, bindingPoint);
            const blockSize = gl.getActiveUniformBlockParameter(glProg, blockIndex, gl.UNIFORM_BLOCK_DATA_SIZE);
            gl.bufferData(gl.UNIFORM_BUFFER, blockSize, usage);
            const uniforms = {};
            const blockUniformsIndices = gl.getActiveUniformBlockParameter(glProg, blockIndex, gl.UNIFORM_BLOCK_ACTIVE_UNIFORM_INDICES);
            gl.getActiveUniforms(glProg, blockUniformsIndices, gl.UNIFORM_OFFSET).forEach((uniformOffset, idx) => {
                const uniformIndex = blockUniformsIndices[idx];
                const uniformInfo = gl.getActiveUniform(glProg, uniformIndex);
                if (uniformInfo !== null) {
                    const uniformName = uniformInfo.name;
                    uniforms[uniformName] = {
                        offset: uniformOffset
                    };
                }
            });
            return {
                name: block.name,
                usage: usage,
                bindingPoint: bindingPoint,
                index: blockIndex,
                uniforms: uniforms,
                bufferByteLength: blockSize,
                glBuffer: block.glBuffer,
                glProg: glProg
            };
        }
        static setUniformBlockValues(gl, setter, uniforms) {
            const blockUniformsNames = Object.keys(setter.uniforms);
            const matchingUniformsNames = Object.keys(uniforms).filter((name) => {
                return blockUniformsNames.includes(name);
            });
            gl.bindBuffer(gl.UNIFORM_BUFFER, setter.glBuffer);
            gl.bindBufferRange(gl.UNIFORM_BUFFER, setter.bindingPoint, setter.glBuffer, 0, setter.bufferByteLength);
            for (const uniformName of matchingUniformsNames) {
                const uniform = setter.uniforms[uniformName];
                const newUniformValue = WebGLUniformUtilities_1.WebGLUniformUtilities.getUniformValueArrayBufferView(uniforms[uniformName].value);
                gl.bufferSubData(gl.UNIFORM_BUFFER, uniform.offset, newUniformValue);
            }
        }
        static bindUniformBlock(gl, setter) {
            gl.bindBufferBase(WebGLConstants_5.BufferTarget.UNIFORM_BUFFER, setter.bindingPoint, setter.glBuffer);
        }
        static _allocateBindingPoint(ctx) {
            for (let unit = 0; unit < ctx.maxBindingPoints; unit++) {
                if (!ctx.registeredBindingPoints[unit]) {
                    ctx.registeredBindingPoints[unit] = true;
                    return unit;
                }
            }
            return null;
        }
        static _freeBindingPoint(ctx, bindingPoint) {
            ctx.registeredBindingPoints[bindingPoint] = false;
        }
    }
    exports.WebGLUniformBlockUtilities = WebGLUniformBlockUtilities;
});
define("engine/core/rendering/webgl/WebGLDrawUtilities", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WebGLDrawUtilities = void 0;
    class WebGLDrawUtilities {
        constructor() { }
        static drawElements(gl, mode, indexType, count, offset) {
            gl.drawElements(mode, count, indexType, offset);
        }
        static drawElementsInstanced(gl, mode, indexType, count, offset, instanceCount) {
            gl.drawElementsInstanced(mode, count, indexType, offset, instanceCount);
        }
        static drawRangeElements(gl, mode, start, end, count, indexType, offset) {
            gl.drawRangeElements(mode, start, end, count, indexType, offset);
        }
        static drawArrays(gl, mode, first, count) {
            gl.drawArrays(mode, first, count);
        }
        static drawArraysInstanced(gl, mode, first, count, instances) {
            gl.drawArraysInstanced(mode, first, count, instances);
        }
    }
    exports.WebGLDrawUtilities = WebGLDrawUtilities;
});
define("engine/core/rendering/webgl/WebGLPacketUtilities", ["require", "exports", "engine/core/rendering/webgl/WebGLAttributeUtilities", "engine/core/rendering/webgl/WebGLTextureUtilities", "engine/core/rendering/webgl/WebGLUniformBlockUtilities", "engine/core/rendering/webgl/WebGLUniformUtilities", "engine/core/rendering/webgl/WebGLConstants", "engine/core/rendering/webgl/WebGLDrawUtilities"], function (require, exports, WebGLAttributeUtilities_1, WebGLTextureUtilities_1, WebGLUniformBlockUtilities_1, WebGLUniformUtilities_2, WebGLConstants_6, WebGLDrawUtilities_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WebGLPacketUtilities = void 0;
    class WebGLPacketUtilities {
        constructor() { }
        static createPacketBindings(gl, props) {
            let textures = {};
            let blocks = {};
            let texturesCtx = props.texturesCtx;
            let blocksCtx = props.blocksCtx;
            const texturesProps = props.texturesProps;
            const blocksProps = props.blocksProps;
            if (typeof texturesProps !== 'undefined') {
                texturesCtx = texturesCtx || WebGLTextureUtilities_1.WebGLTextureUtilities.createBindingsContext(gl);
                const texturesNames = Object.keys(texturesProps);
                for (const textureName of texturesNames) {
                    const textureProps = texturesProps[textureName];
                    const texture = WebGLTextureUtilities_1.WebGLTextureUtilities.createTexture(gl, texturesCtx, textureProps);
                    if (texture == null) {
                        return null;
                    }
                    textures[textureName] = texture;
                }
            }
            if (typeof blocksProps !== 'undefined') {
                blocksCtx = blocksCtx || WebGLUniformBlockUtilities_1.WebGLUniformBlockUtilities.createBindingsContext(gl);
                const blockNames = Object.keys(blocksProps);
                for (const blockName of blockNames) {
                    const blockProp = blocksProps[blockName];
                    const block = WebGLUniformBlockUtilities_1.WebGLUniformBlockUtilities.createUniformBlock(gl, blocksCtx, blockProp.name);
                    if (block == null) {
                        return null;
                    }
                    blocks[blockName] = block;
                }
                ;
            }
            return {
                textures: textures,
                blocks: blocks,
                texturesCtx: texturesCtx,
                blocksCtx: blocksCtx
            };
        }
        static getPacketSetter(gl, glProg, packet) {
            const attributes = packet.attributes;
            const uniforms = packet.uniforms;
            const uniformBlocks = packet.uniformBlocks;
            const props = packet.props;
            const drawMode = (typeof props === 'undefined' || typeof props.drawMode === 'undefined') ? WebGLConstants_6.DrawMode.TRIANGLES : props.drawMode;
            const instanced = (typeof props === 'undefined' || typeof props.instanced === 'undefined') ? false : props.instanced;
            const instanceCount = (typeof props === 'undefined' || typeof props.instanceCount === 'undefined') ? 0 : props.instanceCount;
            let attributesSetter;
            if (typeof attributes !== 'undefined') {
                attributesSetter = WebGLAttributeUtilities_1.WebGLAttributeUtilities.getAttributesListSetter(gl, glProg, attributes);
                if (attributesSetter == null) {
                    return null;
                }
            }
            let uniformBlockSetters;
            if (typeof uniformBlocks !== 'undefined') {
                const blockNames = Object.keys(uniformBlocks);
                uniformBlockSetters = {};
                for (const blockName of blockNames) {
                    const uniformBlock = uniformBlocks[blockName];
                    const uniformBlockSetter = WebGLUniformBlockUtilities_1.WebGLUniformBlockUtilities.getUniformBlockSetter(gl, glProg, uniformBlock.block);
                    if (uniformBlockSetter == null) {
                        return null;
                    }
                    uniformBlockSetters[blockName] = uniformBlockSetter;
                }
            }
            let uniformsSetter;
            if (typeof uniforms !== 'undefined') {
                uniformsSetter = WebGLUniformUtilities_2.WebGLUniformUtilities.getUniformsListSetter(gl, glProg, uniforms);
                if (uniformsSetter == null) {
                    return null;
                }
            }
            return {
                attributesSetter: attributesSetter,
                uniformsSetter: uniformsSetter,
                uniformBlockSetters: uniformBlockSetters,
                drawMode: drawMode,
                instanced: instanced,
                instanceCount: instanceCount
            };
        }
        static setPacketValues(gl, setter, packet) {
            const attributes = packet.attributes;
            const uniforms = packet.uniforms;
            const uniformBlocks = packet.uniformBlocks;
            const attributeSetter = setter.attributesSetter;
            const uniformsSetter = setter.uniformsSetter;
            const uniformBlockSetters = setter.uniformBlockSetters;
            if (typeof attributes !== 'undefined' && attributeSetter) {
                WebGLAttributeUtilities_1.WebGLAttributeUtilities.setAttributesListValues(gl, attributeSetter, attributes);
            }
            if (typeof uniforms !== 'undefined' && uniformsSetter) {
                WebGLUniformUtilities_2.WebGLUniformUtilities.setUniformsListValues(gl, uniformsSetter, uniforms);
            }
            if (typeof uniformBlocks !== 'undefined') {
                if (typeof uniformBlockSetters !== 'undefined') {
                    const blockNames = Object.keys(uniformBlocks);
                    for (const blockName of blockNames) {
                        const uniformBlockSetter = uniformBlockSetters[blockName];
                        const uniformBlock = uniformBlocks[blockName];
                        if (uniformBlockSetter) {
                            WebGLUniformBlockUtilities_1.WebGLUniformBlockUtilities.setUniformBlockValues(gl, uniformBlockSetter, uniformBlock.list);
                        }
                    }
                }
            }
        }
        static drawPacket(gl, setter) {
            const attributeSetter = setter.attributesSetter;
            if (typeof attributeSetter !== 'undefined') {
                WebGLAttributeUtilities_1.WebGLAttributeUtilities.bindAttributesList(gl, attributeSetter);
                if (attributeSetter.hasIndices) {
                    if (setter.instanced) {
                        WebGLDrawUtilities_1.WebGLDrawUtilities.drawElementsInstanced(gl, setter.drawMode, attributeSetter.indexType, attributeSetter.numElements, 0, setter.instanceCount);
                    }
                    else {
                        WebGLDrawUtilities_1.WebGLDrawUtilities.drawElements(gl, setter.drawMode, attributeSetter.indexType, attributeSetter.numElements, 0);
                    }
                }
                else {
                    if (setter.instanced) {
                        WebGLDrawUtilities_1.WebGLDrawUtilities.drawArraysInstanced(gl, setter.drawMode, 0, attributeSetter.numElements, setter.instanceCount);
                    }
                    else {
                        WebGLDrawUtilities_1.WebGLDrawUtilities.drawArrays(gl, setter.drawMode, 0, attributeSetter.numElements);
                    }
                }
                WebGLAttributeUtilities_1.WebGLAttributeUtilities.unbindAttributesList(gl);
            }
            else {
                console.error(`No attributes to draw.`);
            }
        }
    }
    exports.WebGLPacketUtilities = WebGLPacketUtilities;
});
define("engine/core/rendering/webgl/WebGLShaderUtilities", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WebGLShaderUtilities = void 0;
    class WebGLShaderUtilities {
        constructor() { }
        static createShader(gl, type, source) {
            const glShader = gl.createShader(type);
            if (glShader == null) {
                return null;
            }
            gl.shaderSource(glShader, source);
            gl.compileShader(glShader);
            const success = gl.getShaderParameter(glShader, gl.COMPILE_STATUS);
            if (success) {
                return glShader;
            }
            const shaderInfoLog = gl.getShaderInfoLog(glShader);
            if (shaderInfoLog !== null) {
                console.warn(shaderInfoLog);
            }
            gl.deleteShader(glShader);
            return null;
        }
        static deleteShader(gl, glShader) {
            gl.deleteShader(glShader);
        }
    }
    exports.WebGLShaderUtilities = WebGLShaderUtilities;
});
define("engine/core/rendering/webgl/WebGLProgramUtilities", ["require", "exports", "engine/core/rendering/webgl/WebGLConstants", "engine/core/rendering/webgl/WebGLShaderUtilities"], function (require, exports, WebGLConstants_7, WebGLShaderUtilities_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WebGLProgramUtilties = void 0;
    class WebGLProgramUtilties {
        constructor() { }
        static createProgramFromSources(gl, vertexSource, fragmentSource) {
            const vertexShader = WebGLShaderUtilities_1.WebGLShaderUtilities.createShader(gl, WebGLConstants_7.ShaderType.VERTEX_SHADER, vertexSource);
            if (vertexShader == null) {
                return null;
            }
            const fragmentShader = WebGLShaderUtilities_1.WebGLShaderUtilities.createShader(gl, WebGLConstants_7.ShaderType.FRAGMENT_SHADER, fragmentSource);
            if (fragmentShader == null) {
                return null;
            }
            return this.createProgram(gl, vertexShader, fragmentShader);
        }
        static createProgram(gl, vertexShader, fragmentShader) {
            const glProg = gl.createProgram();
            if (glProg == null) {
                return null;
            }
            gl.attachShader(glProg, vertexShader);
            gl.attachShader(glProg, fragmentShader);
            gl.linkProgram(glProg);
            const success = gl.getProgramParameter(glProg, gl.LINK_STATUS);
            if (success) {
                return glProg;
            }
            const programInfoLog = gl.getProgramInfoLog(glProg);
            if (programInfoLog !== null) {
                console.warn(programInfoLog);
            }
            gl.deleteProgram(glProg);
            return null;
        }
        static deleteProgram(gl, glProg) {
            gl.deleteProgram(glProg);
        }
        static useProgram(gl, glProg) {
            gl.useProgram(glProg);
        }
    }
    exports.WebGLProgramUtilties = WebGLProgramUtilties;
});
define("engine/core/rendering/webgl/WebGLRenderbuffersUtilities", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WebGLRenderbufferUtilities = void 0;
    class WebGLRenderbufferUtilities {
        constructor() { }
        static createRenderbuffer(gl, props) {
            const glRb = gl.createRenderbuffer();
            if (glRb === null) {
                console.error('Could not create WebGLRenderbuffer.');
                return null;
            }
            gl.bindRenderbuffer(gl.RENDERBUFFER, glRb);
            if (typeof props.samples !== 'undefined') {
                gl.renderbufferStorageMultisample(gl.RENDERBUFFER, props.samples, props.internalFormat, props.width, props.height);
            }
            else {
                gl.renderbufferStorage(gl.RENDERBUFFER, props.internalFormat, props.width, props.height);
            }
            gl.bindRenderbuffer(gl.RENDERBUFFER, null);
            return {
                ...props,
                glRb: glRb
            };
        }
    }
    exports.WebGLRenderbufferUtilities = WebGLRenderbufferUtilities;
});
define("engine/core/rendering/webgl/WebGLRendererUtilities", ["require", "exports", "engine/core/rendering/webgl/WebGLConstants"], function (require, exports, WebGLConstants_8) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WebGLRendererUtilities = void 0;
    class WebGLRendererUtilities {
        constructor() { }
        static setScissor(gl, x, y, width, height) {
            gl.scissor(x, y, width, height);
        }
        static setViewport(gl, x, y, width, height) {
            gl.viewport(x, y, width, height);
        }
        static getViewport(gl) {
            return gl.getParameter(WebGLConstants_8.Parameter.VIEWPORT);
        }
        static getScissorBox(gl) {
            return gl.getParameter(WebGLConstants_8.Parameter.SCISSOR_BOX);
        }
        static getParameter(gl, param) {
            return gl.getParameter(param);
        }
        static enable(gl, cap) {
            gl.enable(cap);
        }
        static depthFunc(gl, func) {
            gl.depthFunc(func);
        }
        static stencilFunc(gl, func, ref, mask) {
            gl.stencilFunc(func, ref, mask);
        }
        static clear(gl, buff) {
            gl.clear(buff);
        }
        static clearRgba(gl, red, green, blue, alpha) {
            gl.clearColor(red, green, blue, alpha);
        }
        static clearColor(gl, color) {
            gl.clearColor(color[0], color[1], color[2], color[3]);
        }
    }
    exports.WebGLRendererUtilities = WebGLRendererUtilities;
});
define("engine/editor/elements/lib/containers/buttons/ButtonState", ["require", "exports", "engine/editor/elements/HTMLElement"], function (require, exports, HTMLElement_19) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isStateElement = exports.ButtonStateElement = void 0;
    function isStateElement(elem) {
        return !!elem && elem.tagName === 'E-BUTTON-STATE';
    }
    exports.isStateElement = isStateElement;
    let ButtonStateElement = /** @class */ (() => {
        let ButtonStateElement = class ButtonStateElement extends HTMLElement {
            constructor() {
                super();
            }
        };
        ButtonStateElement = __decorate([
            HTMLElement_19.RegisterCustomHTMLElement({
                name: 'e-button-state'
            }),
            HTMLElement_19.GenerateAttributeAccessors([
                { name: 'name', type: 'string' },
                { name: 'next', type: 'string' },
                { name: 'active', type: 'boolean' },
            ])
        ], ButtonStateElement);
        return ButtonStateElement;
    })();
    exports.ButtonStateElement = ButtonStateElement;
});
define("engine/editor/elements/lib/containers/buttons/StatefulButton", ["require", "exports", "engine/editor/elements/HTMLElement", "engine/editor/elements/lib/containers/buttons/ButtonState"], function (require, exports, HTMLElement_20, ButtonState_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.StatefulButtonElement = void 0;
    let StatefulButtonElement = /** @class */ (() => {
        let StatefulButtonElement = class StatefulButtonElement extends HTMLElement {
            constructor() {
                super();
                HTMLElement_20.bindShadowRoot(this, /*template*/ `
            <style>
                :host {
                    display: block;
                }

                ::slotted([active]) {
                    display: flex;
                }

                ::slotted(:not([active])) {
                    display: none;
                }
            </style>
            <slot id="states"></slot>
        `);
                const statesSlot = this.shadowRoot.getElementById('states');
                statesSlot.addEventListener('slotchange', (event) => {
                    const slottedStates = event.target.assignedElements();
                    slottedStates.forEach((state) => {
                        if (ButtonState_1.isStateElement(state)) {
                            this.addEventListener('statechange', ((event) => {
                                state.active = (event.detail.state === state.name);
                                this.state = state.name;
                            }));
                            state.addEventListener('click', () => {
                                this.dispatchEvent(new CustomEvent('statechange', {
                                    detail: {
                                        state: state.next
                                    }
                                }));
                            });
                            if (state.active) {
                                this.state = state.name;
                            }
                        }
                    });
                }, { once: true });
            }
            connectedCallback() {
                this.tabIndex = this.tabIndex;
            }
        };
        StatefulButtonElement = __decorate([
            HTMLElement_20.RegisterCustomHTMLElement({
                name: 'e-stateful-button'
            }),
            HTMLElement_20.GenerateAttributeAccessors([
                { name: 'state', type: 'string' },
            ])
        ], StatefulButtonElement);
        return StatefulButtonElement;
    })();
    exports.StatefulButtonElement = StatefulButtonElement;
});
define("engine/editor/elements/lib/containers/panels/Panel", ["require", "exports", "engine/editor/elements/HTMLElement"], function (require, exports, HTMLElement_21) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PanelElement = void 0;
    let PanelElement = /** @class */ (() => {
        let PanelElement = class PanelElement extends HTMLElement {
            constructor() {
                super();
                HTMLElement_21.bindShadowRoot(this, /*template*/ `
            <style>
                :host {
                    display: block;
                }

                :host([state='closed']) #label,
                :host([state='closed']) #content {
                    display: none;
                }

                :host([state='closed']) #header {
                    padding: 0;
                }

                :host([state='closed']) #arrow {
                    display: inherit;
                }
                
                :host([state='opened']) #label,
                :host([state='opened']) #content {
                    display: inherit;
                }

                :host([state='opened']) #arrow {
                    display: none;
                }

                #content {
                    padding: var(--content-padding, inherit);
                }

                #header {
                    color: var(--header-color, inherit);
                    text-align: center;
                    padding-top: 0;

                    user-select: none;
                }

                #header:hover {
                    --color: var(--header-hover-color, var(--header-color));
                    color: var(--header-hover-color, var(--header-color));
                    font-weight: var(--header-hover-font-weight);
                }
            </style>
            <div>
                <div id="header">
                    <span id="arrow"></span>
                    <span id="label"></span>
                </div>
                <div id="content">
                    <slot></slot>
                </div>
            </div>
        `);
                const header = this.shadowRoot.getElementById('header');
                header.addEventListener('click', () => {
                    this.state = (this.state === 'opened') ? 'closed' : 'opened';
                });
            }
            async render() {
                const label = this.shadowRoot.getElementById('label');
                const arrow = this.shadowRoot.getElementById('arrow');
                let rect = this.getBoundingClientRect();
                const arr = (rect.left < window.innerWidth / 2) ? '>' : '<';
                arrow.innerHTML = arr;
                label.innerHTML = this.label || '';
            }
            connectedCallback() {
                this.label = this.label || 'label';
                this.state = this.state || 'opened';
                this.render();
            }
        };
        PanelElement = __decorate([
            HTMLElement_21.RegisterCustomHTMLElement({
                name: 'e-panel',
                observedAttributes: ['state']
            }),
            HTMLElement_21.GenerateAttributeAccessors([
                { name: 'label', type: 'string' },
                { name: 'state', type: 'string' },
            ])
        ], PanelElement);
        return PanelElement;
    })();
    exports.PanelElement = PanelElement;
});
define("engine/editor/elements/lib/containers/panels/PanelGroup", ["require", "exports", "engine/editor/elements/HTMLElement"], function (require, exports, HTMLElement_22) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PanelGroupElement = void 0;
    let PanelGroupElement = /** @class */ (() => {
        let PanelGroupElement = class PanelGroupElement extends HTMLElement {
            constructor() {
                super();
                HTMLElement_22.bindShadowRoot(this, /*template*/ `
            <link rel="stylesheet" href="css/theme.css"/>
            <style>
                :host {
                    display: block;
                }

                :host([state='closed']) #content {
                    display: none;
                }

                :host([state='closed']) #less {
                    display: none;
                }

                :host([state='opened']) #more {
                    display: none;
                }

                #toggler {
                    display: flex;
                }

                #toggler:hover {
                    font-weight: 500;
                    color: var(--label-on-hover-color);
                }

                #label {
                    flex: 1;
                }
            </style>
            <div>
                <div id="toggler">
                    <span id="arrow"><!--<icon #less><icon #more>--></span>
                    <span id="label"></span>
                </div>
                <div id="content">
                    <slot></slot>
                </div>
            </div>
        `);
                this.state = this.state || 'closed';
            }
            connectedCallback() {
                const toggler = this.shadowRoot.querySelector('#toggler');
                const arrow = this.shadowRoot.querySelector('#arrow');
                const label = this.shadowRoot.querySelector('#label');
                toggler.addEventListener('click', () => {
                    if (this.state === 'opened') {
                        this.state = 'closed';
                    }
                    else if (this.state === 'closed') {
                        this.state = 'opened';
                    }
                });
                label.innerHTML = this.label;
            }
        };
        PanelGroupElement.observedAttributes = ['state'];
        PanelGroupElement = __decorate([
            HTMLElement_22.RegisterCustomHTMLElement({
                name: 'e-panel-group'
            }),
            HTMLElement_22.GenerateAttributeAccessors([
                { name: 'label', type: 'string' },
                { name: 'state', type: 'string' },
            ])
        ], PanelGroupElement);
        return PanelGroupElement;
    })();
    exports.PanelGroupElement = PanelGroupElement;
});
define("engine/editor/elements/lib/controls/Range", ["require", "exports", "engine/editor/elements/HTMLElement"], function (require, exports, HTMLElement_23) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RangeElement = void 0;
    let RangeElement = /** @class */ (() => {
        let RangeElement = class RangeElement extends HTMLElement {
            constructor() {
                super();
                HTMLElement_23.bindShadowRoot(this, /*template*/ `
            <link rel="stylesheet" href="css/default.css"/>
            <style>
                :host {
                    display: block;
                }

                ::slotted([slot='input']) {
                    -webkit-appearance: none;
                }
            </style>
            <slot id="input" name="input"></slot>
        `);
            }
            connectedCallback() {
                this.tabIndex = this.tabIndex;
            }
        };
        RangeElement = __decorate([
            HTMLElement_23.RegisterCustomHTMLElement({
                name: 'e-range'
            }),
            HTMLElement_23.GenerateAttributeAccessors([
                { name: 'value', type: 'number' },
            ])
        ], RangeElement);
        return RangeElement;
    })();
    exports.RangeElement = RangeElement;
});
define("engine/editor/elements/lib/utils/Import", ["require", "exports", "engine/editor/elements/HTMLElement"], function (require, exports, HTMLElement_24) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ImportElement = void 0;
    let ImportElement = /** @class */ (() => {
        let ImportElement = class ImportElement extends HTMLElement {
            constructor() {
                super();
            }
            connectedCallback() {
                const importRequest = async (src) => {
                    this.innerHTML = new DOMParser().parseFromString(await fetch(src).then((response) => {
                        if (response.ok) {
                            return response.text();
                        }
                        else {
                            throw new Error(response.statusText);
                        }
                    }), "text/html").body.innerHTML;
                    this.dispatchEvent(new Event('loaded'));
                };
                if (this.src) {
                    importRequest(this.src);
                }
            }
        };
        ImportElement = __decorate([
            HTMLElement_24.RegisterCustomHTMLElement({
                name: 'e-import'
            }),
            HTMLElement_24.GenerateAttributeAccessors([
                { name: 'src', type: 'string' }
            ])
        ], ImportElement);
        return ImportElement;
    })();
    exports.ImportElement = ImportElement;
});
define("engine/libs/graphics/colors/Color", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ColorBase = exports.Color = void 0;
    let ColorBase = /** @class */ (() => {
        class ColorBase {
            constructor(type) {
                this._array = new (type || Uint8Array)(9);
            }
            static rgb(r, g, b) {
                const color = new ColorBase();
                color.setValues([r, g, b, 255]);
                return color;
            }
            static rgba(r, g, b, a) {
                const color = new ColorBase();
                color.setValues([r, g, b, a]);
                return color;
            }
            static array(...colors) {
                const a = new Array(colors.length * 4);
                let c;
                let i = 0;
                for (const color of colors) {
                    c = color._array;
                    a[i + 0] = c[0];
                    a[i + 1] = c[1];
                    a[i + 2] = c[2];
                    a[i + 3] = c[3];
                    i += 4;
                }
                return a;
            }
            get array() {
                return this._array;
            }
            get r() {
                return this._array[0];
            }
            set r(r) {
                this._array[0] = r;
            }
            get g() {
                return this._array[1];
            }
            set g(g) {
                this._array[1] = g;
            }
            get b() {
                return this._array[2];
            }
            set b(b) {
                this._array[2] = b;
            }
            get a() {
                return this._array[3];
            }
            set a(a) {
                this._array[3] = a;
            }
            setValues(c) {
                const o = this._array;
                o[0] = c[0];
                o[1] = c[1];
                o[2] = c[2];
                o[3] = c[3];
                return this;
            }
            getValues() {
                const c = this._array;
                return [
                    c[0], c[1], c[2], c[3]
                ];
            }
            copy(color) {
                const o = this._array;
                o[0] = color.r;
                o[1] = color.g;
                o[2] = color.b;
                o[3] = color.a;
                return this;
            }
            clone() {
                return new ColorBase().copy(this);
            }
            lerp(color, t) {
                const o = this._array;
                const c = color._array;
                o[0] = t * (c[0] - o[0]);
                o[1] = t * (c[1] - o[1]);
                o[2] = t * (c[2] - o[2]);
                o[3] = t * (c[3] - o[3]);
                return this;
            }
            valuesNormalized() {
                return [this.r / 255, this.g / 255, this.b / 255, this.a / 255];
            }
        }
        ColorBase.BLACK = ColorBase.rgb(0, 0, 0);
        ColorBase.RED = ColorBase.rgb(255, 0, 0);
        ColorBase.GREEN = ColorBase.rgb(0, 255, 0);
        ColorBase.BLUE = ColorBase.rgb(0, 0, 255);
        ColorBase.WHITE = ColorBase.rgb(255, 255, 255);
        return ColorBase;
    })();
    exports.ColorBase = ColorBase;
    const Color = ColorBase;
    exports.Color = Color;
});
define("engine/editor/elements/lib/containers/dropdown/Dropdown", ["require", "exports", "engine/editor/elements/HTMLElement"], function (require, exports, HTMLElement_25) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isDropdownElement = exports.HTMLEDropdownElement = void 0;
    function isDropdownElement(elem) {
        return elem.tagName.toLowerCase() === 'e-dropdown';
    }
    exports.isDropdownElement = isDropdownElement;
    let HTMLEDropdownElement = /** @class */ (() => {
        let HTMLEDropdownElement = class HTMLEDropdownElement extends HTMLElement {
            constructor() {
                super();
                HTMLElement_25.bindShadowRoot(this, /*template*/ `
            <style>
                :host {
                    display: block;
                    position: relative;
                    user-select: none;
                    white-space: nowrap;
                }

                :host(:not([expanded])) ::slotted([slot="content"]) {
                    display: none;
                }

                :host ::slotted([slot="content"]) {
                    display: flex;
                    z-index: 1;
                    position: absolute;

                    left: 0;
                    top: 100%;

                    padding: 8px 0;
                    background-color: white;
                    border: 1px solid grey;
                }
            </style>
            <slot id="button" name="button"></slot>
            <slot id="content" name="content"></slot>
        `);
                this.button = null;
                this.content = null;
            }
            connectedCallback() {
                var _a, _b;
                const buttonSlot = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.getElementById('button');
                if (buttonSlot) {
                    buttonSlot.addEventListener('slotchange', (event) => {
                        const button = event.target.assignedElements()[0];
                        this.button = button;
                        button.addEventListener('click', () => {
                            if (!this.expanded) {
                                this.expanded = true;
                                setTimeout(() => {
                                    document.addEventListener('click', clickOutListener);
                                });
                            }
                            else {
                                this.expanded = false;
                                document.removeEventListener('click', clickOutListener);
                            }
                        });
                        const clickOutListener = (event) => {
                            if (!this.contains(event.currentTarget)) {
                                this.expanded = false;
                                document.removeEventListener('click', clickOutListener);
                            }
                        };
                    });
                }
                const contentSlot = (_b = this.shadowRoot) === null || _b === void 0 ? void 0 : _b.getElementById('content');
                if (contentSlot) {
                    contentSlot.addEventListener('slotchange', (event) => {
                        const contentElem = event.target.assignedElements()[0];
                        this.content = contentElem;
                        this.content.addEventListener('click', (event) => {
                            event.stopImmediatePropagation();
                        });
                    });
                }
            }
        };
        HTMLEDropdownElement = __decorate([
            HTMLElement_25.RegisterCustomHTMLElement({
                name: 'e-dropdown'
            }),
            HTMLElement_25.GenerateAttributeAccessors([
                { name: 'expanded', type: 'boolean' },
            ])
        ], HTMLEDropdownElement);
        return HTMLEDropdownElement;
    })();
    exports.HTMLEDropdownElement = HTMLEDropdownElement;
});
define("engine/editor/elements/lib/containers/menus/MenuButton", ["require", "exports", "engine/editor/elements/HTMLElement", "engine/editor/elements/lib/containers/menus/Menu"], function (require, exports, HTMLElement_26, Menu_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BaseHTMLEMenuButtonElement = exports.isHTMLEMenuButtonElement = void 0;
    function isHTMLEMenuButtonElement(elem) {
        return elem.tagName.toLowerCase() === "e-menubutton";
    }
    exports.isHTMLEMenuButtonElement = isHTMLEMenuButtonElement;
    let BaseHTMLEMenuButtonElement = /** @class */ (() => {
        let BaseHTMLEMenuButtonElement = class BaseHTMLEMenuButtonElement extends HTMLElement {
            constructor() {
                super();
                HTMLElement_26.bindShadowRoot(this, /*template*/ `
            <style>
                :host {
                    position: relative;
                    display: inline-block;

                    user-select: none;
                    white-space: nowrap;

                    padding: 3px 6px;
                    background-color: white;

                    cursor: pointer;
                }

                :host(:focus) {
                    outline: 1px solid -webkit-focus-ring-color;
                }

                :host(:hover),
                :host(:focus-within) {
                    color: white;
                    background-color: rgb(92, 92, 92);
                }

                :host([disabled]) {
                    color: rgb(180, 180, 180);
                }

                :host(:hover) [part~="visual"],
                :host(:focus) [part~="visual"],
                :host(:focus-within) [part~="visual"] {
                    color: inherit;
                }

                :host(:focus) ::slotted([slot="menu"]),
                :host(:focus-within) ::slotted([slot="menu"]) {
                    color: initial;
                }

                :host(:focus[disabled]),
                :host(:focus-within[disabled]) {
                    background-color: rgb(220, 220, 220);
                }

                :host ::slotted([slot="menu"]) {
                    z-index: 1;
                    position: absolute;
                    
                    top: 100%;
                    left: 0;
                }

                :host ::slotted([slot="menu"]:not(:focus-within)) {
                    max-width: 0;
                    max-height: 0;
                    padding: 0;
                    overflow: clip;
                }

                [part~="li"] {
                    display: flex;
                    height: 100%;
                    list-style-type: none;
                }

                [part~="content"] {
                    font-size: 1em;
                    flex: auto;
                    display: flex;
                }

                [part~="icon"] {
                    flex: none;
                    display: none;
                    width: 16px;
                    margin-right: 2px;
                }

                [part~="label"] {
                    flex: auto;
                    text-align: left;
                }

                [part~="arrow"] {
                    flex: none;
                    margin-left: 8px;
                    transform: rotate(90deg);
                }

                [part~="visual"] {
                    color: rgb(92, 92, 92);
                    font-size: 1.6em;
                    line-height: 0.625;
                }

                [part~="visual"]::after {
                    pointer-events: none;
                }

                :host(:not([icon])) [part~="icon"] {
                    visibility: hidden;
                }

                :host [part~="arrow"]::after {
                    content: "»";
                }
            </style>
            <li part="li">
                <span part="content">
                    <span part="visual icon"></span>
                    <span part="label"></span>
                    <span part="visual arrow"></span>
                </span>
                <slot name="menu" part="menu"></slot>
            </li>
        `);
                this.childMenu = null;
                this.addEventListener("keydown", (event) => {
                    switch (event.key) {
                        case "Enter":
                            if (!this.active) {
                                this.active = true;
                                if (this.childMenu) {
                                    this.childMenu.focusItemAt(0);
                                }
                            }
                            break;
                        case "Escape":
                            this.focus();
                            this.active = false;
                            break;
                    }
                });
                this.addEventListener("click", () => {
                    this.trigger();
                });
                this.addEventListener("blur", (event) => {
                    let containsNewFocus = (event.relatedTarget !== null) && this.contains(event.relatedTarget);
                    if (!containsNewFocus) {
                        this.active = false;
                    }
                }, { capture: true });
            }
            trigger() {
                if (!this.active) {
                    this.active = true;
                    if (this.childMenu) {
                        this.childMenu.focus();
                    }
                }
                else {
                    this.active = false;
                }
            }
            attributeChangedCallback(name, oldValue, newValue) {
                var _a, _b;
                if (newValue !== oldValue) {
                    switch (name) {
                        case "label":
                            if (oldValue !== newValue) {
                                const labelPart = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector("[part~=label]");
                                if (labelPart) {
                                    labelPart.textContent = newValue;
                                }
                            }
                            break;
                        case "icon":
                            if (oldValue !== newValue) {
                                const iconPart = (_b = this.shadowRoot) === null || _b === void 0 ? void 0 : _b.querySelector("[part~=icon]");
                                if (iconPart) {
                                    iconPart.textContent = newValue;
                                }
                            }
                            break;
                    }
                }
            }
            connectedCallback() {
                var _a;
                this.tabIndex = this.tabIndex;
                const menuSlot = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector("slot[name=menu]");
                if (menuSlot) {
                    menuSlot.addEventListener("slotchange", () => {
                        const menuElem = menuSlot.assignedElements()[0];
                        if (Menu_3.isHTMLEMenuElement(menuElem)) {
                            this.childMenu = menuElem;
                        }
                    });
                }
            }
        };
        BaseHTMLEMenuButtonElement = __decorate([
            HTMLElement_26.RegisterCustomHTMLElement({
                name: "e-menubutton",
                observedAttributes: ["icon", "label", "checked"]
            }),
            HTMLElement_26.GenerateAttributeAccessors([
                { name: "name", type: "string" },
                { name: "active", type: "boolean" },
                { name: "label", type: "string" },
                { name: "icon", type: "string" },
                { name: "type", type: "string" },
                { name: "disabled", type: "boolean" },
            ])
        ], BaseHTMLEMenuButtonElement);
        return BaseHTMLEMenuButtonElement;
    })();
    exports.BaseHTMLEMenuButtonElement = BaseHTMLEMenuButtonElement;
});
define("engine/editor/elements/lib/misc/Palette", ["require", "exports", "engine/editor/elements/HTMLElement"], function (require, exports, HTMLElement_27) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PaletteElement = void 0;
    let PaletteElement = /** @class */ (() => {
        let PaletteElement = class PaletteElement extends HTMLElement {
            constructor() {
                super();
                HTMLElement_27.bindShadowRoot(this, /*template*/ `
            <style>
                :host {
                    display: block;
                    content: contains;
                }

               :host #container {
                    display: grid;
                    grid-template-cols: repeat(5, 1fr);
                    grid-auto-rows: 16px;
                }
            </style>
            <div id="container">
            </div>
        `);
            }
            connectedCallback() {
                const colors = this.colors;
                if (colors.length > 0) {
                    this.shadowRoot.querySelector('#container').append(...colors.map((color) => {
                        const div = document.createElement('div');
                        div.setAttribute('style', `background-color: ${color}`);
                        return div;
                    }));
                }
            }
        };
        PaletteElement = __decorate([
            HTMLElement_27.RegisterCustomHTMLElement({
                name: 'e-palette'
            }),
            HTMLElement_27.GenerateAttributeAccessors([{ name: 'colors', type: 'json' }])
        ], PaletteElement);
        return PaletteElement;
    })();
    exports.PaletteElement = PaletteElement;
});
define("engine/editor/elements/lib/controls/breadcrumb/BreadcrumbItem", ["require", "exports", "engine/editor/elements/HTMLElement"], function (require, exports, HTMLElement_28) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HTMLEBreadcrumbItemElement = exports.isHTMLEBreadcrumbItemElement = void 0;
    function isHTMLEBreadcrumbItemElement(obj) {
        return obj instanceof Node && obj.nodeType === obj.ELEMENT_NODE && obj.tagName.toLowerCase() === "e-breadcrumbitem";
    }
    exports.isHTMLEBreadcrumbItemElement = isHTMLEBreadcrumbItemElement;
    let HTMLEBreadcrumbItemElement = /** @class */ (() => {
        let HTMLEBreadcrumbItemElement = class HTMLEBreadcrumbItemElement extends HTMLElement {
            constructor() {
                super();
                HTMLElement_28.bindShadowRoot(this, /*template*/ `
            <style>
                :host {
                    display: inline-block;
                    cursor: pointer;
                }

                :host([active]) {
                    font-weight: bold;
                }

                :host(:not([active]))::after {
                    content: ">";
                    display: inline-block;
                }

                :host([hidden]) {
                    display: none;
                }

                [part~="li"] {
                    display: inline-block;
                    list-style-type: none;
                }
            </style>
            <li part="li">
                <span part="label"></span>
            </li>
        `);
                this.trail = null;
            }
            connectedCallback() {
                this.tabIndex = this.tabIndex;
            }
            attributeChangedCallback(name, oldValue, newValue) {
                var _a;
                if (newValue !== oldValue) {
                    switch (name) {
                        case "label":
                            if (oldValue !== newValue) {
                                const labelPart = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector("[part~=label]");
                                if (labelPart) {
                                    labelPart.textContent = newValue;
                                }
                            }
                            break;
                    }
                }
            }
        };
        HTMLEBreadcrumbItemElement = __decorate([
            HTMLElement_28.RegisterCustomHTMLElement({
                name: "e-breadcrumbitem",
                observedAttributes: ["label"]
            }),
            HTMLElement_28.GenerateAttributeAccessors([
                { name: "label", type: "string" },
                { name: "active", type: "boolean" }
            ])
        ], HTMLEBreadcrumbItemElement);
        return HTMLEBreadcrumbItemElement;
    })();
    exports.HTMLEBreadcrumbItemElement = HTMLEBreadcrumbItemElement;
});
define("engine/editor/elements/lib/controls/breadcrumb/BreadcrumbTrail", ["require", "exports", "engine/editor/elements/HTMLElement", "engine/editor/elements/lib/controls/breadcrumb/BreadcrumbItem"], function (require, exports, HTMLElement_29, BreadcrumbItem_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HTMLEBreadcrumbTrailElement = exports.isHTMLEBreadcrumbTrailElement = void 0;
    function isHTMLEBreadcrumbTrailElement(obj) {
        return obj instanceof Node && obj.nodeType === obj.ELEMENT_NODE && obj.tagName.toLowerCase() === "e-breadcrumbtrail";
    }
    exports.isHTMLEBreadcrumbTrailElement = isHTMLEBreadcrumbTrailElement;
    let HTMLEBreadcrumbTrailElement = /** @class */ (() => {
        let HTMLEBreadcrumbTrailElement = class HTMLEBreadcrumbTrailElement extends HTMLElement {
            constructor() {
                super();
                HTMLElement_29.bindShadowRoot(this, /*template*/ `
            <style>
                [part~="ul"] {
                    display: block;
                    list-style-type: none;
                    padding: 0; margin: 0;
                }
            </style>
            <button id="backward">backward</button>
            <button id="forward">forward</button>
            <ul part="ul">
                <slot></slot>
            </ul>
        `);
                this.items = [];
                this.activeIndex = 0;
            }
            activateItem(item) {
                let itemIndex = this.items.indexOf(item);
                if (itemIndex > -1) {
                    this.items.forEach((item, index) => {
                        item.active = (index == itemIndex);
                        item.hidden = (index > itemIndex);
                    });
                    this.activeIndex = itemIndex;
                    let activeItem = this.items[itemIndex];
                    activeItem.dispatchEvent(new CustomEvent("activate"));
                }
            }
            connectedCallback() {
                var _a;
                this.tabIndex = this.tabIndex;
                const slot = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector("slot");
                if (slot) {
                    slot.addEventListener("slotchange", () => {
                        const items = slot.assignedElements().filter(BreadcrumbItem_1.isHTMLEBreadcrumbItemElement);
                        this.items = items;
                        items.forEach((item, index) => {
                            item.trail = this;
                            item.active = (index === items.length - 1);
                        });
                    });
                }
                this.addEventListener("mousedown", (event) => {
                    let target = event.target;
                    if (BreadcrumbItem_1.isHTMLEBreadcrumbItemElement(target)) {
                        this.activateItem(target);
                    }
                });
            }
        };
        HTMLEBreadcrumbTrailElement = __decorate([
            HTMLElement_29.RegisterCustomHTMLElement({
                name: "e-breadcrumbtrail"
            })
        ], HTMLEBreadcrumbTrailElement);
        return HTMLEBreadcrumbTrailElement;
    })();
    exports.HTMLEBreadcrumbTrailElement = HTMLEBreadcrumbTrailElement;
});
define("samples/scenes/SimpleScene", ["require", "exports", "engine/core/general/Transform", "engine/core/input/Input", "engine/core/rendering/scenes/cameras/PerspectiveCamera", "engine/core/rendering/scenes/geometries/lib/polyhedron/CubeGeometry", "engine/core/rendering/scenes/geometries/lib/polyhedron/IcosahedronGeometry", "engine/core/rendering/scenes/geometries/lib/QuadGeometry", "engine/core/rendering/webgl/WebGLConstants", "engine/core/rendering/webgl/WebGLFramebufferUtilities", "engine/core/rendering/webgl/WebGLPacketUtilities", "engine/core/rendering/webgl/WebGLProgramUtilities", "engine/core/rendering/webgl/WebGLRenderbuffersUtilities", "engine/core/rendering/webgl/WebGLRendererUtilities", "engine/core/rendering/webgl/WebGLTextureUtilities", "engine/editor/Editor", "engine/editor/elements/lib/containers/buttons/ButtonState", "engine/editor/elements/lib/containers/buttons/StatefulButton", "engine/editor/elements/lib/containers/menus/Menu", "engine/editor/elements/lib/containers/menus/MenuBar", "engine/editor/elements/lib/containers/menus/MenuItem", "engine/editor/elements/lib/containers/panels/Panel", "engine/editor/elements/lib/containers/panels/PanelGroup", "engine/editor/elements/lib/containers/tabs/Tab", "engine/editor/elements/lib/containers/tabs/TabList", "engine/editor/elements/lib/containers/tabs/TabPanel", "engine/editor/elements/lib/controls/Range", "engine/editor/elements/lib/utils/Import", "engine/libs/graphics/colors/Color", "engine/libs/maths/algebra/matrices/Matrix4", "engine/libs/maths/algebra/vectors/Vector2", "engine/libs/maths/algebra/vectors/Vector3", "engine/libs/maths/Snippets", "engine/resources/Resources", "engine/editor/elements/lib/containers/status/StatusBar", "engine/editor/elements/lib/containers/dropdown/Dropdown", "engine/editor/elements/lib/containers/status/StatusItem", "engine/editor/elements/lib/containers/menus/MenuItemGroup", "engine/editor/elements/lib/containers/menus/MenuButton", "engine/editor/elements/lib/misc/Palette", "engine/editor/elements/lib/controls/breadcrumb/BreadcrumbTrail", "engine/editor/elements/lib/controls/breadcrumb/BreadcrumbItem", "engine/editor/elements/lib/controls/draggable/Draggable", "engine/editor/elements/lib/controls/draggable/Dropzone"], function (require, exports, Transform_2, Input_3, PerspectiveCamera_1, CubeGeometry_1, IcosahedronGeometry_1, QuadGeometry_1, WebGLConstants_9, WebGLFramebufferUtilities_1, WebGLPacketUtilities_1, WebGLProgramUtilities_1, WebGLRenderbuffersUtilities_1, WebGLRendererUtilities_1, WebGLTextureUtilities_2, Editor_3, ButtonState_2, StatefulButton_1, Menu_4, MenuBar_2, MenuItem_5, Panel_1, PanelGroup_1, Tab_3, TabList_2, TabPanel_2, Range_1, Import_1, Color_1, Matrix4_4, Vector2_3, Vector3_7, Snippets_14, Resources_1, StatusBar_1, Dropdown_1, StatusItem_2, MenuItemGroup_3, MenuButton_1, Palette_1, BreadcrumbTrail_1, BreadcrumbItem_2, Draggable_4, Dropzone_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.launchScene = exports.start = void 0;
    StatusBar_1.HTMLEStatusBarElement;
    StatusItem_2.HTMLEStatusItemElement;
    Import_1.ImportElement;
    Panel_1.PanelElement;
    PanelGroup_1.PanelGroupElement;
    Tab_3.BaseHTMLETabElement;
    TabList_2.BaseHTMLETabListElement;
    TabPanel_2.BaseHTMLETabPanelElement;
    Range_1.RangeElement;
    StatefulButton_1.StatefulButtonElement;
    ButtonState_2.ButtonStateElement;
    Dropdown_1.HTMLEDropdownElement;
    BreadcrumbTrail_1.HTMLEBreadcrumbTrailElement;
    BreadcrumbItem_2.HTMLEBreadcrumbItemElement;
    Palette_1.PaletteElement;
    Draggable_4.BaseHTMLEDraggableElement;
    MenuBar_2.BaseHTMLEMenuBarElement;
    MenuButton_1.BaseHTMLEMenuButtonElement;
    Menu_4.BaseHTMLEMenuElement;
    MenuItem_5.BaseHTMLEMenuItemElement;
    Dropzone_2.BaseHTMLEDropzoneElement;
    MenuItemGroup_3.BaseHTMLEMenuItemGroupElement;
    MenuItem_5.BaseHTMLEMenuItemElement;
    const simpleSceneDOM = /*template*/ `
<link rel="stylesheet" href="../css/main.css"/>
  <div>

    <div class="flex-rows">

      <!--<e-import src="html/samples/menus.html"></e-import>-->
      <nav class="flex-cols">
          <div id="menubar-container"></div>
        <!--<button data-command="get">get</button>
        <button data-command="set">set</button>-->
      </nav>

      <div class="flex-auto flex-cols">

        <!--<e-window title="My window">-->
<!--

        </e-window>-->

        <e-panel id="panel-1" class="flex-rows flex-none" state="opened" label="L.Panel">

            <e-tab-list id="list">
              <e-tab name="play" controls="play-panel">Play tab</e-tab>
              <e-tab name="pause" controls="pause-panel" active>Pause Tab</e-tab>
            </e-tab-list>
            <e-tab-panel id="play-panel">assets/editor/icons/play.svg</e-tab-panel>
            <e-tab-panel id="pause-panel">
              <!--<e-palette cols="5" colors='[
                "var(--theme-color-50)",
                "var(--theme-color-100)",
                "var(--theme-color-200)",
                "var(--theme-color-300)",
                "var(--theme-color-400)",
                "var(--theme-color-500)",
                "var(--theme-color-600)",
                "var(--theme-color-700)",
                "var(--theme-color-800)",
                "var(--theme-color-900)",
                "var(--theme-palette-color-1)",
                "var(--theme-palette-color-2)",
                "var(--theme-palette-color-3)"
              ]'></e-palette>-->
              <e-breadcrumbtrail>
                <e-breadcrumbitem label="label 1"></e-breadcrumbitem>
                <e-breadcrumbitem label="label 2"></e-breadcrumbitem>
              </e-breadcrumbtrail>
              <e-draggable id="draggableA" tabindex="-1" type="df_column" ref="A">
                A<input name="text" value="A" hidden></input>
              </e-draggable>
              <e-draggable id="draggableB" tabindex="-1" type="df_column" ref="B">B<input name="text" value="B" hidden></input></e-draggable>
              <e-draggable id="draggableC" tabindex="-1" type="df_column" ref="C">C<input name="text" value="C" hidden></input></e-draggable>
              <e-draggable id="draggableD" tabindex="-1" type="df_column" ref="D">D<input name="text" value="D" hidden></input></e-draggable>
              <e-dropzone id="dropzone1" tabindex="-1" allowedtypes="df_column" multiple></e-dropzone>
              <!--<details>
                <summary>Summary..</summary>
                <fieldset>
                  <label>My label</label><input value="My input"></input>
                  <details>
                    <summary><label>aggregates</label><input value="1" type="number"></input></summary>
                    <fieldset>
                    <label>My internal label</label><input value="My internal input"></input>
                  </details>
                </fieldset>
                </fieldset>
              </details>-->
              <input type="number" name="temp-radio" value="1"></input>
              <e-dropzone data-class="input-dropzone" data-name="test" allowedtypes="df_column" multiple></e-dropzone>
            </e-tab-panel>
              
            <section>
              <form id="test-form" novalidate>
                <input name="number-input" type="number" value="10"></input><br/>
                <input type="text" name="text-input"  value="Test"></input><br/>
                <select>
                  <option>Kek</option>
                  <option>Kikou</option>
                </select>
                <input type="range" name="range-input" min="10" max="20" step="5"></input>
                <progress id="file" max="100" value="70"> 70% </progress>
                <br/>
                <input type="radio" name="temp-radio" value="1"></input>
                <input type="radio" name="temp-radio" value="2"></input><br/>
                <textarea name="textarea-input">This is my tyext area.</textarea>
                <a href="#">Follow this link</a>
              </form>
              <e-dropdown>
                <button slot="button">My button</button>
                <div slot="content">
                  <ul>
                    <li>1</li>
                    <li>2</li>
                  </ul>
                  <input id="range" type="range" min="10" max="20" step="5"></input>
                </div>
              </e-dropdown>

              <button data-button-role="dropdown" data-button-dropdown-target="dropdown">My button</button>
              <div slot="content">
                <ul>
                  <li>1</li>
                  <li>2</li>
                </ul>
                <input id="range" type="range" min="10" max="20" step="5"></input>
              </div>
              <!--<details>
                <summary>Sum</summary>
                <p>Requires a computer running an operating system.</p>
              </details>-->
            </section>
        </e-panel>

        <main class="flex-rows flex-auto">
            <header class="centered">Toolbar</header>
            <section class="centered padded">
    
              <div id="ui" class="flex-cols">
                <div class="flex-auto"><span class="blue">"RigidBuddy FTW!"</span> <span class="yellow">:-)</span></div>
                <div class="flex-none">FPS: <span id="canvas-fps">-.-</span></div>
              </div>

              <canvas id="canvas" tabindex="0" tooltip="mon-canvas"></canvas>
              <e-logs-feed></e-logs-feed>

            </section>

            <footer class="centered">
              <p id="status-bar"></p>
            </footer>
        </main>
        
        <e-panel id="panel-3" class="flex-rows flex-none" style="margin-left: 6px;" state="closed" label="R.Panel">
            <section>
              <e-panel-group label="My group" state="closed">
                <div>My content</div>
              </e-panel-group>
            </section>
        </e-panel>
      </div>

      <e-statusbar>
        <e-statusitem name="show-fps-status"></e-statusitem>
        <e-statusitem name="letter-status"></e-statusitem>
        <!--<output>125</output>
        <output>Kek</output>
        <button id="play" data-lol="" data-kek="kek">Play</button>
        <button id="pause" data-command-lol="pause-canvas">Pause</button>
        <progress max="100" value="100" style="height: 100%">100%</progress>-->
        <!--<e-dropdown class="statusbar-dropdown">
          <button slot="button">My button</button>
          <div slot="content">
            <ul>
              <li>1</li>
              <li>2</li>
            </ul>
            <input id="range" type="range" min="10" max="20" step="5"></input>
          </div>
        </e-dropdown>-->
      </e-statusbar>
    </div>
  </div>`;
    async function start() {
        const template = document.createElement('template');
        template.innerHTML = simpleSceneDOM;
        document.body.insertBefore(template.content, document.body.firstChild);
        const imports = Array.from(document.getElementsByTagName('e-import'));
        Promise.all(imports.map((imp) => {
            return new Promise((resolve) => {
                imp.addEventListener('loaded', () => {
                    resolve(true);
                }, { once: true });
            });
        })).then(function () {
            Editor_3.editor.setup().then(() => {
                launchScene();
            });
        });
    }
    exports.start = start;
    /*
    function test() {
      const data = [
        {
          name: 'John Doe',
          age: 25
        },
        {
          name: 'Jane Doe',
          age: 24
        }
      ];
    
      const table = HTMLTableTemplate({
        headerCells: Object.keys(data[0]),
        bodyCells: data.map(data => {
          return [{type: 'header', content: data.name}, data.age.toString()];
        }),
        footerCells: [
          {type: 'header', content: 'Total age'},
          data.reduce((acc, curr) => {
            return (acc + curr.age);
          }, 0).toString()
        ]
      });
    
      document.querySelector('#play-panel')!.append(table);
    }*/
    window["editor"] = Editor_3.editor;
    async function launchScene() {
        var _a, _b, _c;
        let frameRequest;
        let render;
        let fps = 0;
        Editor_3.editor.registerCommand("play-canvas", {
            exec() {
                cancelAnimationFrame(frameRequest);
                frameRequest = requestAnimationFrame(render);
                canvas.focus();
            },
            context: 'default'
        });
        Editor_3.editor.registerCommand("pause-canvas", {
            exec() {
                cancelAnimationFrame(frameRequest);
                canvas.focus();
            },
            context: 'default'
        });
        const showFpsMenuItem = (_a = Editor_3.editor.menubar) === null || _a === void 0 ? void 0 : _a.findItem((item) => item.name === "show-fps-item");
        const canvasFPS = document.getElementById("canvas-fps");
        if (showFpsMenuItem) {
            showFpsMenuItem.command = "toggle-show-fps";
            Editor_3.editor.addStateListener("show-fps", (showFps) => {
                showFpsMenuItem.checked = showFps;
            });
        }
        if (canvasFPS) {
            Editor_3.editor.registerCommand('toggle-show-fps', {
                exec() {
                    Editor_3.editor.setState("show-fps", true);
                    canvasFPS.parentElement.classList.remove('hidden');
                },
                undo() {
                    Editor_3.editor.setState("show-fps", false);
                    canvasFPS.parentElement.classList.add('hidden');
                },
                context: 'default'
            });
        }
        const showFpsStatusItem = (_b = Editor_3.editor.statusbar) === null || _b === void 0 ? void 0 : _b.findItem((item) => item.name === "show-fps-status");
        if (showFpsStatusItem) {
            showFpsStatusItem.stateMap = (showFps) => {
                return {
                    content: `${showFps ? "FPS" : "--"}`
                };
            };
            //showFpsStatusItem.update(editor.getState("show-fps"));
            Editor_3.editor.addStateListener("show-fps", (showFps) => {
                showFpsStatusItem.update(showFps);
            });
            showFpsStatusItem.command = "toggle-show-fps";
        }
        Editor_3.editor.registerCommand('change-favorite-letter', {
            exec(value) {
                Editor_3.editor.setState("favorite-letter", value);
            },
            undo(value) {
            },
            context: 'default'
        });
        const radiosGroup = document.querySelector("e-menuitemgroup[name='favorite-letter']");
        if (radiosGroup) {
            Editor_3.editor.addStateListener("favorite-letter", (favoriteLetter) => {
                let radioToCheck = radiosGroup.items.find((item) => item.type === "radio" && item.value === favoriteLetter);
                if (radioToCheck) {
                    radioToCheck.checked = true;
                }
            });
            radiosGroup.items.filter(item => item.type === "radio").forEach((item) => {
                item.command = "change-favorite-letter";
                item.commandArgs = item.value;
            });
        }
        const letterStatus = (_c = Editor_3.editor.statusbar) === null || _c === void 0 ? void 0 : _c.findItem((item) => item.name === "letter-status");
        if (letterStatus) {
            letterStatus.stateMap = (letter) => {
                return {
                    content: `U like ${letter.toUpperCase()}`
                };
            };
            //letterStatus.update(editor.getState("favorite-letter"));
            Editor_3.editor.addStateListener("favorite-letter", (favoriteLetter) => {
                letterStatus.update(favoriteLetter);
            });
        }
        await Editor_3.editor.reloadState();
        /*const showFPSAction = (showFPS: boolean) => {
          if (showFPS) {
            canvasFPS.parentElement!.classList.remove('hidden');
          }
          else {
            canvasFPS.parentElement!.classList.add('hidden');
          }
        };*/
        /*showFPSAction(showFpsCheckbox.checked);
      
        if (showFpsCheckbox && canvasFPS) {
          showFpsCheckbox.addEventListener('click', () => {
            showFPSAction(showFpsCheckbox.checked);
          });
        }*/
        /*const dropzone1 = document.querySelector<HTMLEDropzoneElement>("e-dropzone#dropzone1");
        dropzone1?.addEventListener("datatransfer", ((event: EDataTransferEvent) => {
          console.log(event.detail.data);
          console.log(event.detail.success);
          console.log(event.detail.position);
        }) as EventListener);*/
        /*
        const draggableA = document.querySelector<HTMLEDraggableElement>("e-draggable#draggableA");
        if (draggableA) {
          draggableA.data = "A";
          
        }
      
        const draggableB = document.querySelector<HTMLEDraggableElement>("e-draggable#draggableB");
        if (draggableB) {
          draggableB.data = "B";
        }*/
        const canvas = document.getElementById('canvas');
        if (!canvas) {
            return;
        }
        canvas.width = 1200;
        canvas.height = 800;
        const gl = canvas.getContext('webgl2', { antialias: true });
        const assets = new Resources_1.Resources('assets/engine/');
        await assets.loadList('resources.json');
        // Shaders
        const phongVert = assets.get('shaders/common/phong.vert');
        const phongFrag = assets.get('shaders/common/phong.frag');
        const skyboxVert = assets.get('shaders/common/skybox.vert');
        const skyboxFrag = assets.get('shaders/common/skybox.frag');
        const textureVert = assets.get('shaders/common/texture.vert');
        const textureFrag = assets.get('shaders/common/texture.frag');
        const primitiveVert = assets.get('shaders/common/primitive.vert');
        const primitiveFrag = assets.get('shaders/common/primitive.frag');
        // Images
        const albedoMapImg = assets.get('img/brickwall.jpg');
        const normalMapImg = assets.get('img/brickwall_normal.jpg');
        const skyboxXPosImg = assets.get('img/skybox_x_pos.png');
        const skyboxXNegImg = assets.get('img/skybox_x_neg.png');
        const skyboxYPosImg = assets.get('img/skybox_y_pos.png');
        const skyboxYNegImg = assets.get('img/skybox_y_neg.png');
        const skyboxZPosImg = assets.get('img/skybox_z_pos.png');
        const skyboxZNegImg = assets.get('img/skybox_z_neg.png');
        const wavesNormalImg = assets.get('img/waves_normal.png');
        const phongGlProg = WebGLProgramUtilities_1.WebGLProgramUtilties.createProgramFromSources(gl, phongVert, phongFrag);
        const skyboxGlProg = WebGLProgramUtilities_1.WebGLProgramUtilties.createProgramFromSources(gl, skyboxVert, skyboxFrag);
        const texGlProg = WebGLProgramUtilities_1.WebGLProgramUtilties.createProgramFromSources(gl, textureVert, textureFrag);
        const primitiveGlProg = WebGLProgramUtilities_1.WebGLProgramUtilties.createProgramFromSources(gl, primitiveVert, primitiveFrag);
        const cube = new CubeGeometry_1.CubeGeometry();
        const icosahedron = new IcosahedronGeometry_1.IcosahedronGeometry();
        const quad = new QuadGeometry_1.QuadGeometry();
        const packetBindings = WebGLPacketUtilities_1.WebGLPacketUtilities.createPacketBindings(gl, {
            texturesProps: {
                albedoMap: WebGLTextureUtilities_2.WebGLTextureUtilities.guessTextureProperties({ pixels: albedoMapImg }),
                normalMap: WebGLTextureUtilities_2.WebGLTextureUtilities.guessTextureProperties({ pixels: normalMapImg }),
                skybox: WebGLTextureUtilities_2.WebGLTextureUtilities.guessTextureProperties({
                    pixels: {
                        xPos: skyboxXPosImg, xNeg: skyboxXNegImg,
                        yPos: skyboxYPosImg, yNeg: skyboxYNegImg,
                        zPos: skyboxZPosImg, zNeg: skyboxZNegImg
                    },
                    wrapS: WebGLConstants_9.TextureWrapMode.CLAMP_TO_EDGE,
                    wrapT: WebGLConstants_9.TextureWrapMode.CLAMP_TO_EDGE,
                    wrapR: WebGLConstants_9.TextureWrapMode.CLAMP_TO_EDGE,
                    mag: WebGLConstants_9.TextureMagFilter.LINEAR,
                    min: WebGLConstants_9.TextureMinFilter.LINEAR
                }),
                fbColorTex: WebGLTextureUtilities_2.WebGLTextureUtilities.guessTextureProperties({
                    width: canvas.width, height: canvas.height, pixels: null,
                    wrapS: WebGLConstants_9.TextureWrapMode.CLAMP_TO_EDGE,
                    wrapT: WebGLConstants_9.TextureWrapMode.CLAMP_TO_EDGE,
                    wrapR: WebGLConstants_9.TextureWrapMode.CLAMP_TO_EDGE,
                    mag: WebGLConstants_9.TextureMagFilter.LINEAR,
                    min: WebGLConstants_9.TextureMinFilter.LINEAR
                }),
            },
            blocksProps: {
                worldViewBlock: { name: 'WorldViewBlock', usage: WebGLConstants_9.BufferDataUsage.DYNAMIC_COPY },
                lightsBlock: { name: 'LightsBlock', usage: WebGLConstants_9.BufferDataUsage.STATIC_READ },
                phongBlock: { name: 'PhongBlock', usage: WebGLConstants_9.BufferDataUsage.STATIC_READ }
            }
        });
        const worldViewBlock = packetBindings.blocks.worldViewBlock;
        const lightsBlock = packetBindings.blocks.lightsBlock;
        const phongBlock = packetBindings.blocks.phongBlock;
        const albedoMap = packetBindings.textures.albedoMap;
        const normalMap = packetBindings.textures.normalMap;
        const skybox = packetBindings.textures.skybox;
        const fbColorTex = packetBindings.textures.fbColorTex;
        const fov = 30 * Math.PI / 180;
        const aspect = gl.canvas.width / gl.canvas.height;
        const zNear = 1;
        const zFar = 100;
        const projection = new Matrix4_4.Matrix4().asPerspective(fov, aspect, zNear, zFar);
        const cam = new PerspectiveCamera_1.PerspectiveCamera(fov, aspect, zNear, zFar);
        const eye = new Vector3_7.Vector3([3, 3, 0]);
        const target = new Vector3_7.Vector3([0, 0, 0]);
        const up = new Vector3_7.Vector3([0, 1, 0]);
        const camera = new Matrix4_4.Matrix4().lookAt(eye, target, up);
        const viewInverse = camera.clone();
        const view = camera.clone().invert();
        const viewProjection = projection.clone().mult(view);
        const viewProjectionInverse = viewProjection.clone().invert();
        const cubeTransform = new Transform_2.Transform();
        const quadTransform = new Transform_2.Transform();
        const cubeWorldArr = new Float32Array(16);
        const cubeWorld = new Matrix4_4.Matrix4().setArray(cubeWorldArr).setIdentity().scaleScalar(0.5);
        const quadWorld = new Matrix4_4.Matrix4().setIdentity().scaleScalar(2);
        /*const vectorInput = document.createElement('e-vector3-input') as Vector3InputElement;
        vectorInput.vector.setArray(cubeWorldArr.subarray(12, 15));
        
        document.querySelector('#panel-3 section')!.append(vectorInput);*/
        const phongCubePacketValues = {
            attributes: {
                list: {
                    a_position: { array: new Float32Array(cube.vertices.array), props: { numComponents: 3 } },
                    a_normal: { array: new Float32Array(cube.verticesNormals.array), props: { numComponents: 3 } },
                    a_tangent: { array: new Float32Array(cube.tangents.array), props: { numComponents: 3 } },
                    a_bitangent: { array: new Float32Array(cube.bitangents.array), props: { numComponents: 3 } },
                    a_color: { array: new Float32Array(Color_1.Color.array(...Array(cube.indices.length).fill(Color_1.Color.BLUE))), props: { numComponents: 4, normalized: true }
                    },
                    a_uv: { array: new Float32Array(cube.uvs.array), props: { numComponents: 2 } },
                },
                indices: new Uint16Array(cube.indices),
            },
            uniformBlocks: {
                worldViewBlock: {
                    block: worldViewBlock,
                    list: {
                        u_world: { value: new Float32Array(cubeWorld.array) },
                        u_viewInverse: { value: new Float32Array(camera.array) },
                        u_worldInverseTranspose: { value: new Float32Array(cubeWorld.clone().invert().transpose().array) },
                        u_worldViewProjection: { value: new Float32Array(viewProjection.clone().mult(cubeWorld).array) }
                    }
                },
                lightsBlock: {
                    block: lightsBlock,
                    list: {
                        u_lightWorldPos: { value: [1, 6, -6] },
                        u_lightColor: { value: [1, 0.8, 0.8, 1] },
                        u_ambient: { value: [0, 0, 0, 1] },
                    }
                },
                phongBlock: {
                    block: phongBlock,
                    list: {
                        u_specular: { value: [1, 1, 1, 1] },
                        u_shininess: { value: 50 },
                        u_specularFactor: { value: 1 }
                    }
                }
            },
            uniforms: {
                u_diffuseMap: { value: albedoMap },
                u_normalMap: { value: normalMap }
            }
        };
        const skyboxPacketValues = {
            attributes: {
                list: {
                    a_position: { array: new Float32Array(quad.vertices.array), props: { numComponents: 3 } },
                },
                indices: new Uint16Array(quad.indices),
            },
            uniforms: {
                u_world: { value: new Float32Array(quadWorld.array) },
                u_viewDirectionProjectionInverse: { value: new Float32Array(viewProjectionInverse.array) },
                u_skybox: { value: skybox },
            }
        };
        const texPacketValues = {
            attributes: {
                list: {
                    a_position: { array: new Float32Array(quad.vertices.array), props: { numComponents: 3 } },
                    a_uv: { array: new Float32Array(quad.uvs.array), props: { numComponents: 2 } },
                },
                indices: new Uint16Array(quad.indices),
            },
            uniforms: {
                u_world: { value: new Float32Array(new Matrix4_4.Matrix4().setIdentity().values) },
                u_tex: { value: fbColorTex }
            }
        };
        WebGLProgramUtilities_1.WebGLProgramUtilties.useProgram(gl, phongGlProg);
        const phongCubePacketSetter = WebGLPacketUtilities_1.WebGLPacketUtilities.getPacketSetter(gl, phongGlProg, phongCubePacketValues);
        WebGLPacketUtilities_1.WebGLPacketUtilities.setPacketValues(gl, phongCubePacketSetter, phongCubePacketValues);
        WebGLProgramUtilities_1.WebGLProgramUtilties.useProgram(gl, skyboxGlProg);
        const skyboxPacketSetter = WebGLPacketUtilities_1.WebGLPacketUtilities.getPacketSetter(gl, skyboxGlProg, skyboxPacketValues);
        WebGLPacketUtilities_1.WebGLPacketUtilities.setPacketValues(gl, skyboxPacketSetter, skyboxPacketValues);
        const fb = WebGLFramebufferUtilities_1.WebGLFramebufferUtilities.createFramebuffer(gl);
        WebGLFramebufferUtilities_1.WebGLFramebufferUtilities.attachTexture(gl, fb, {
            texTarget: WebGLConstants_9.FramebufferTextureTarget.TEXTURE_2D,
            glTex: fbColorTex.glTex,
            attachment: WebGLConstants_9.FramebufferAttachment.COLOR_ATTACHMENT0
        });
        const maxSamples = WebGLRendererUtilities_1.WebGLRendererUtilities.getParameter(gl, WebGLConstants_9.Parameter.MAX_SAMPLES);
        const stencilRb = WebGLRenderbuffersUtilities_1.WebGLRenderbufferUtilities.createRenderbuffer(gl, {
            internalFormat: WebGLConstants_9.PixelFormat.DEPTH24_STENCIL8,
            width: canvas.width,
            height: canvas.height,
            samples: maxSamples
        });
        const antialiasRb = WebGLRenderbuffersUtilities_1.WebGLRenderbufferUtilities.createRenderbuffer(gl, {
            internalFormat: WebGLConstants_9.PixelFormat.RGBA8,
            width: canvas.width,
            height: canvas.height,
            samples: maxSamples
        });
        WebGLFramebufferUtilities_1.WebGLFramebufferUtilities.attachRenderbuffers(gl, fb, [{
                glRb: stencilRb.glRb,
                attachment: WebGLConstants_9.FramebufferAttachment.DEPTH_STENCIL_ATTACHMENT
            },
            {
                glRb: antialiasRb.glRb,
                attachment: WebGLConstants_9.FramebufferAttachment.COLOR_ATTACHMENT0,
            }]);
        const postFb = WebGLFramebufferUtilities_1.WebGLFramebufferUtilities.createFramebuffer(gl);
        WebGLFramebufferUtilities_1.WebGLFramebufferUtilities.attachTexture(gl, postFb, {
            texTarget: WebGLConstants_9.FramebufferTextureTarget.TEXTURE_2D,
            glTex: fbColorTex.glTex,
            attachment: WebGLConstants_9.FramebufferAttachment.COLOR_ATTACHMENT0
        });
        WebGLProgramUtilities_1.WebGLProgramUtilties.useProgram(gl, texGlProg);
        const texPacketSetter = WebGLPacketUtilities_1.WebGLPacketUtilities.getPacketSetter(gl, texGlProg, texPacketValues);
        WebGLPacketUtilities_1.WebGLPacketUtilities.setPacketValues(gl, texPacketSetter, texPacketValues);
        WebGLRendererUtilities_1.WebGLRendererUtilities.setViewport(gl, 0, 0, gl.canvas.width, gl.canvas.height);
        WebGLRendererUtilities_1.WebGLRendererUtilities.enable(gl, WebGLConstants_9.Capabilities.DEPTH_TEST);
        WebGLRendererUtilities_1.WebGLRendererUtilities.enable(gl, WebGLConstants_9.Capabilities.CULL_FACE);
        let lastFrameTime = 0;
        let deltaTime = 0;
        let lastPos = new Vector2_3.Vector2();
        await Input_3.Input.initialize(canvas);
        render = function (frameTime) {
            frameTime *= 0.001;
            deltaTime = frameTime - lastFrameTime;
            lastFrameTime = frameTime;
            fps = 1 / deltaTime;
            canvasFPS.innerHTML = fps.toFixed(2);
            WebGLRendererUtilities_1.WebGLRendererUtilities.clearColor(gl, Color_1.Color.GREEN.valuesNormalized());
            WebGLRendererUtilities_1.WebGLRendererUtilities.clear(gl, WebGLConstants_9.BufferMaskBit.COLOR_BUFFER_BIT | WebGLConstants_9.BufferMaskBit.DEPTH_BUFFER_BIT);
            if (Input_3.Input.getMouseButtonDown(Input_3.MouseButton.RIGHT)) {
                lastPos.copy(Input_3.Input.getMouseButtonPosition());
            }
            if (Input_3.Input.getMouseButton(Input_3.MouseButton.RIGHT)) {
                const newPos = Input_3.Input.getMouseButtonPosition();
                if (!newPos.equals(lastPos)) {
                    const cameraPos = new Vector3_7.Vector3().setValues([camera.getAt(12), camera.getAt(13), camera.getAt(14)]);
                    //console.log(`cameraPos ${cameraPos.x.toFixed(4)} ${cameraPos.y.toFixed(4)} ${cameraPos.z.toFixed(4)}`);
                    const cameraTarget = target.clone();
                    const deltaX = lastPos.y - newPos.y;
                    const deltaY = newPos.x - lastPos.x;
                    const deltaPhi = (Math.PI / canvas.clientWidth) * deltaX * 1000;
                    const deltaTheta = (Math.PI / canvas.clientHeight) * deltaY * 1000;
                    const cameraToTarget = cameraPos.clone().sub(cameraTarget);
                    const radius = cameraToTarget.len();
                    //console.log(`cameraToTarget ${cameraToTarget.x.toFixed(4)} ${cameraToTarget.y.toFixed(4)} ${cameraToTarget.z.toFixed(4)}`);
                    let theta = Math.acos(cameraToTarget.z / radius);
                    let phi = Math.atan2(cameraToTarget.y, cameraToTarget.x);
                    theta = Snippets_14.clamp(theta - deltaTheta, 0, Math.PI);
                    phi -= deltaPhi;
                    //console.log(`theta ${theta.toFixed(4)} phi ${phi.toFixed(4)}`);
                    // Turn back into Cartesian coordinates
                    const newCameraPos = new Vector3_7.Vector3([
                        radius * Math.sin(theta) * Math.cos(phi),
                        radius * Math.sin(theta) * Math.sin(phi),
                        radius * Math.cos(theta)
                    ]);
                    camera.setAt(12, newCameraPos.x);
                    camera.setAt(13, newCameraPos.y);
                    camera.setAt(14, newCameraPos.z);
                    //console.log(`newCameraPos ${newCameraPos.x.toFixed(4)} ${newCameraPos.y.toFixed(4)} ${newCameraPos.z.toFixed(4)}`);
                    camera.lookAt(newCameraPos, target, up);
                    lastPos.copy(newPos);
                }
            }
            viewInverse.copy(camera);
            view.copy(viewInverse).invert();
            viewProjection.copy(projection).mult(view);
            viewProjectionInverse.copy(viewProjection).invert();
            //cubeWorld.rotateY(deltaTime);
            //viewProjectionInverse.rotateY(deltaTime / 2);
            //viewProjectionInverse.rotateX(deltaTime);
            WebGLFramebufferUtilities_1.WebGLFramebufferUtilities.bindFramebuffer(gl, fb);
            WebGLRendererUtilities_1.WebGLRendererUtilities.clear(gl, WebGLConstants_9.BufferMaskBit.COLOR_BUFFER_BIT | WebGLConstants_9.BufferMaskBit.DEPTH_BUFFER_BIT);
            WebGLProgramUtilities_1.WebGLProgramUtilties.useProgram(gl, phongGlProg);
            WebGLPacketUtilities_1.WebGLPacketUtilities.setPacketValues(gl, phongCubePacketSetter, {
                uniformBlocks: {
                    worldViewBlock: {
                        block: worldViewBlock,
                        list: {
                            u_world: { value: new Float32Array(cubeWorld.array) },
                            u_viewInverse: { value: new Float32Array(viewInverse.array) },
                            u_worldInverseTranspose: { value: new Float32Array(cubeWorld.clone().invert().transpose().array) },
                            u_worldViewProjection: { value: new Float32Array(viewProjection.clone().mult(cubeWorld).array) }
                        }
                    }
                }
            });
            WebGLRendererUtilities_1.WebGLRendererUtilities.depthFunc(gl, WebGLConstants_9.TestFunction.LESS);
            WebGLPacketUtilities_1.WebGLPacketUtilities.drawPacket(gl, phongCubePacketSetter);
            WebGLProgramUtilities_1.WebGLProgramUtilties.useProgram(gl, skyboxGlProg);
            WebGLPacketUtilities_1.WebGLPacketUtilities.setPacketValues(gl, skyboxPacketSetter, {
                uniforms: {
                    u_world: { value: new Float32Array(quadWorld.array) },
                    u_viewDirectionProjectionInverse: { value: new Float32Array(viewProjectionInverse.array) }
                }
            });
            WebGLRendererUtilities_1.WebGLRendererUtilities.depthFunc(gl, WebGLConstants_9.TestFunction.LEQUAL);
            WebGLPacketUtilities_1.WebGLPacketUtilities.drawPacket(gl, skyboxPacketSetter);
            //WebGLFramebufferUtilities.unbindFramebuffer(gl, stencilFb);
            WebGLFramebufferUtilities_1.WebGLFramebufferUtilities.blit(gl, fb, postFb, [0, 0, canvas.width, canvas.height], [0, 0, canvas.width, canvas.height], WebGLConstants_9.BufferMaskBit.COLOR_BUFFER_BIT, WebGLConstants_9.TextureMagFilter.LINEAR);
            //WebGLFramebufferUtilities.clearColor(gl, fb, [1, 1, 1, 1]);
            WebGLFramebufferUtilities_1.WebGLFramebufferUtilities.unbindFramebuffer(gl);
            /*WebGLFramebufferUtilities.blit(gl, postFb, null,
              [0, 0, canvas.width, canvas.height],
              [0, 0, canvas.width, canvas.height],
              BufferMaskBit.COLOR_BUFFER_BIT,
              TextureMagFilter.LINEAR
            );*/
            //WebGLFramebufferUtilities.clearColor(gl, postFb, [1, 1, 1, 1]);
            WebGLProgramUtilities_1.WebGLProgramUtilties.useProgram(gl, texGlProg);
            WebGLRendererUtilities_1.WebGLRendererUtilities.depthFunc(gl, WebGLConstants_9.TestFunction.LEQUAL);
            WebGLPacketUtilities_1.WebGLPacketUtilities.drawPacket(gl, texPacketSetter);
            Input_3.Input.clear();
            frameRequest = requestAnimationFrame(render);
        };
    }
    exports.launchScene = launchScene;
});
define("samples/Sandbox", ["require", "exports", "engine/editor/elements/HTMLElement", "engine/editor/elements/lib/controls/draggable/Dropzone", "samples/scenes/Mockup"], function (require, exports, HTMLElement_30, Dropzone_3, Mockup_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.sandbox = void 0;
    class DataClassMixin extends HTMLElement_30.BaseAttributeMutationMixin {
        constructor(attributeValue) {
            super("data-class", "listitem", attributeValue);
        }
    }
    let TestDataClassMixin = /** @class */ (() => {
        class TestDataClassMixin extends DataClassMixin {
            constructor() {
                super("test");
            }
            attach(element) {
                element.addEventListener("click", TestDataClassMixin._clickEventListener);
            }
            detach(element) {
                element.removeEventListener("click", TestDataClassMixin._clickEventListener);
            }
        }
        TestDataClassMixin._clickEventListener = () => {
            alert("data-class test");
        };
        return TestDataClassMixin;
    })();
    class InputDropzoneDataClassMixin extends DataClassMixin {
        constructor() {
            super("input-dropzone");
            this.datatransferEventListener = (event) => {
                let target = event.target;
                if (Dropzone_3.isHTMLEDropzoneElement(target)) {
                    this.handlePostdatatransferInputNaming(target);
                }
            };
        }
        attach(element) {
            if (Dropzone_3.isHTMLEDropzoneElement(element)) {
                this.handlePostdatatransferInputNaming(element);
            }
            element.addEventListener("datatransfer", this.datatransferEventListener);
        }
        detach(element) {
            element.removeEventListener("datatransfer", this.datatransferEventListener);
        }
        handlePostdatatransferInputNaming(dropzone) {
            let name = dropzone.getAttribute("data-input-dropzone-name");
            if (name) {
                if (dropzone.multiple) {
                    let inputs = Array.from(dropzone.querySelectorAll("input"));
                    inputs.forEach((input, index) => {
                        input.name = `${name}[${index}]`;
                    });
                }
                else {
                    let input = dropzone.querySelector("input");
                    if (input) {
                        input.name = name;
                    }
                }
            }
        }
    }
    class TogglerSelectDataClassMixin extends DataClassMixin {
        constructor() {
            super("toggler-select");
            this.changeEventListener = (event) => {
                let target = event.target;
                if (HTMLElement_30.isTagElement("select", target)) {
                    this.handlePostchangeToggle(target);
                }
            };
        }
        attach(element) {
            element.addEventListener("change", this.changeEventListener);
            this.handlePostchangeToggle(element);
        }
        detach(element) {
            element.removeEventListener("change", this.changeEventListener);
        }
        handlePostchangeToggle(select) {
            let fieldsetElement = null;
            Array.from(select.options).forEach((option, index) => {
                fieldsetElement = document.getElementById(option.value);
                if (fieldsetElement) {
                    fieldsetElement.hidden = (index !== select.selectedIndex);
                }
            });
        }
    }
    const attributeMutationMixins = [
        new TestDataClassMixin(),
        new InputDropzoneDataClassMixin(),
        new TogglerSelectDataClassMixin()
    ];
    const mainObserver = new MutationObserver(HTMLElement_30.createMutationObserverCallback(attributeMutationMixins));
    mainObserver.observe(document.body, {
        childList: true,
        subtree: true,
        attributeFilter: attributeMutationMixins.map((mixin => mixin.attributeName))
    });
    async function sandbox() {
        await Mockup_1.mockup();
        //await start();
        /*
        editor.registerCommand("test", {
          exec: () => {
            alert("test");
          },
          context: "default"
        });*/
        /*window.addEventListener("blur", () => {
          document.body.focus();
        });*/
        /*const myWindow = window.open("http://localhost:8080/", "MsgWindow", "width=200,height=100");
        if (myWindow) {
        myWindow.document.write("<p>This is 'MsgWindow'. I am 200px wide and 100px tall!</p>");
        myWindow.addEventListener("message", (event) => {
            myWindow.document.body.innerHTML = event.data;
        }, false);
      
        setTimeout(() => {
            myWindow.postMessage("The user is 'bob' and the password is 'secret'", "http://localhost:8080/");
        }, 100);
      }*/
    }
    exports.sandbox = sandbox;
});
define("boot", ["require", "exports", "samples/Sandbox"], function (require, exports, Sandbox_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.boot = void 0;
    async function boot() {
        await Sandbox_1.sandbox();
    }
    exports.boot = boot;
});
define("engine/Engine", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Engine = void 0;
    class Engine {
        async boot() {
            this.run();
        }
        run() {
        }
    }
    exports.Engine = Engine;
});
define("engine/config/Configuration", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SConfiguration = void 0;
    class SConfiguration {
        constructor() {
            this.options = {
                renderingCanvasId: 'canvas'
            };
        }
        static get instance() {
            if (this._instance === undefined) {
                this._instance = new SConfiguration();
            }
            return this._instance;
        }
    }
    exports.SConfiguration = SConfiguration;
});
define("engine/core/general/ComponentsRegistry", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ComponentsRegistry = void 0;
    class ComponentsRegistry {
        constructor() {
            this._dictionary = new Map();
        }
        static get instance() {
            if (this._instance === undefined) {
                this._instance = new ComponentsRegistry();
            }
            return this._instance;
        }
        register(name, type) {
            if (!this._dictionary.has(name)) {
                this._dictionary.set(name, type);
            }
        }
        create(name, owner, desc) {
            const ctor = this._dictionary.get(name);
            if (ctor !== undefined) {
                return new ctor(owner, desc);
            }
            return undefined;
        }
    }
    exports.ComponentsRegistry = ComponentsRegistry;
});
define("engine/core/general/Entity", ["require", "exports", "engine/libs/maths/statistics/random/UUIDGenerator", "engine/core/general/ComponentsRegistry", "engine/core/general/Transform"], function (require, exports, UUIDGenerator_5, ComponentsRegistry_1, Transform_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.EntityBase = exports.Entity = void 0;
    class EntityBase {
        constructor(name, parent) {
            this.uuid = UUIDGenerator_5.UUIDGenerator.newUUID();
            this.desc = {};
            this.name = name;
            this.active = false;
            this.parent = parent;
            this.children = [];
            this.components = new Map();
            this.transform = new Transform_3.Transform();
        }
        setup(desc) {
            this.desc = desc;
        }
        getComponent(name) {
            return this.components.get(name);
        }
        addComponent(name, desc) {
            const component = ComponentsRegistry_1.ComponentsRegistry.instance.create(name, this, desc);
            this.components.set(name, component);
            return component;
        }
    }
    exports.EntityBase = EntityBase;
    const Entity = EntityBase;
    exports.Entity = Entity;
});
define("engine/core/general/Component", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AbstractComponent = void 0;
    class AbstractComponent {
        constructor(owner, desc) {
            this.type = this.constructor.name;
            this.owner = owner;
            this.desc = desc;
            this.enabled = false;
        }
    }
    exports.AbstractComponent = AbstractComponent;
});
define("engine/core/general/System", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.System = void 0;
    class System {
    }
    exports.System = System;
});
define("engine/core/audio/AudioSystem", ["require", "exports", "engine/core/general/System"], function (require, exports, System_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AudioSystem = exports.GAudioContext = void 0;
    exports.GAudioContext = new AudioContext();
    class AudioSystem extends System_1.System {
    }
    exports.AudioSystem = AudioSystem;
});
define("engine/core/components/rendering/MeshComponent", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MeshComponent = void 0;
    class MeshComponent {
        setup() {
        }
        cleanup() {
        }
        render() { }
    }
    exports.MeshComponent = MeshComponent;
});
define("engine/core/general/Clock", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Clock = void 0;
    class Clock {
        constructor() {
            this.deltaTime = 0;
        }
    }
    exports.Clock = Clock;
});
define("engine/core/general/Scene", ["require", "exports", "engine/core/general/Entity", "engine/libs/maths/statistics/random/UUIDGenerator"], function (require, exports, Entity_1, UUIDGenerator_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SceneBase = exports.Scene = void 0;
    class SceneBase {
        constructor() {
            this.uuid = UUIDGenerator_6.UUIDGenerator.newUUID();
            this.root = new Entity_1.EntityBase('root', undefined);
        }
        parseEntityRecursive(name, desc, parent) {
            const entity = new Entity_1.EntityBase(name, parent);
            // Parsing children
            if (desc.children !== undefined) {
                for (const childName in desc.children) {
                    const childDesc = desc.children[childName];
                    const childEntity = this.parseEntityRecursive(childName, childDesc, entity);
                    childEntity.parent = entity;
                    entity.children.push(childEntity);
                }
            }
            // Parsing components
            if (desc.components !== undefined) {
                for (const componentName in desc.components) {
                    const component = entity.addComponent(componentName, desc.components[componentName]);
                }
            }
            return entity;
        }
        build(desc, root) {
            if (root === undefined) {
                root = this.root;
            }
            for (const key in desc) {
                const entity = this.parseEntityRecursive(key, desc[key], this.root);
                root.children.push(entity);
            }
        }
    }
    exports.SceneBase = SceneBase;
    const Scene = SceneBase;
    exports.Scene = Scene;
});
define("engine/core/rendering/pipelines/RenderingPipeline", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RenderingPipeline = void 0;
    class RenderingPipeline {
        addPass() {
        }
    }
    exports.RenderingPipeline = RenderingPipeline;
});
define("engine/core/rendering/renderers/MeshRenderer", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MeshRenderer = void 0;
    class MeshRenderer {
    }
    exports.MeshRenderer = MeshRenderer;
});
define("engine/core/rendering/shaders/lib/PhongShader", ["require", "exports", "engine/core/rendering/shaders/Shader"], function (require, exports, Shader_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PhongShader = void 0;
    const name = 'Phong';
    const vertex = `#version 330 es
    uniform Model {
        uniform mat4 u_model;
        uniform mat4 u_modelInverseTranspose;
    } model;

    uniform View {
        uniform mat4 u_viewInverse;
    } view;

    uniform mat4 u_modelViewProjection;

    uniform mat4 u_viewInverse;

    #define LIGHTS_COUNT 1

    uniform Lights {
        vec3 u_lightWorldPos;
        vec4 u_lightColor;
    } lights[LIGHTS_COUNT];

    //in Geometry {
        in vec4 a_position;
        in vec3 a_normal;    
    //} geometry;

    out SurfacesToLights {
        vec3 v_surfaceToLight;
    } surfacesToLights;

    out vec4 v_position;
    out vec3 v_normal;
    out vec3 v_surfaceToLight[LIGHTS_COUNT];
    out vec3 v_surfaceToView;

    //include<empty>

    void main() {

        #ifdef USE_HEIGHTMAP
            lolcccc
            cdvdv
            kiii
            u_lightWorldPos = 'lol'
        #endif

        #pragma unroll_loop_start
        for (int i = 0; i < LIGHTS_COUNT; i++)
        {
            
        }
        #pragma unroll_loop_end

        //v_position = u_modelViewProjection * a_position;
        //v_normal = (u_modelInverseTranspose * vec4(a_normal, 0)).xyz;
        //v_surfaceToLight = u_lightWorldPos - (u_model * a_position).xyz;
        //v_surfaceToView = (u_viewInverse[3] - (u_model * a_position)).xyz;
        gl_Position = v_position;
}`;
    const fragment = `#version 330 es

    precision mediump float;

    uniform MeshBasicMaterial {
        uniform vec3 u_albedo;
        uniform vec4 u_ambient;
    } meshBasicMaterial;

    uniform MeshPhongMaterial {
        uniform vec4 u_specular;
        uniform float u_shininess;
        uniform float u_specularFactor;
    } meshPhongMaterial;

    in vec4 v_position;
    in vec3 v_normal;
    in vec3 v_color;
    in vec3 v_surfaceToLight;
    in vec3 v_surfaceToView;

    out vec4 outColor;

    vec4 lit(float l ,float h, float m) {
    return vec4(1.0,
                max(l, 0.0),
                (l > 0.0) ? pow(max(0.0, h), m) : 0.0,
                1.0);
    }

    void main() {
        vec4 diffuseColor = vec4(u_albedo, 1);
        vec3 a_normal = normalize(v_normal);
        vec3 surfaceToLight = normalize(v_surfaceToLight);
        vec3 surfaceToView = normalize(v_surfaceToView);
        vec3 halfVector = normalize(surfaceToLight + surfaceToView);
        vec4 litR = lit(dot(a_normal, surfaceToLight),
                            dot(a_normal, halfVector), u_shininess);
        vec4 outColor = vec4((
        u_lightColor * (diffuseColor * litR.y + diffuseColor * u_ambient +
                        u_specular * litR.z * u_specularFactor)).rgb,
            diffuseColor.a);
}`;
    class PhongShader extends Shader_1.Shader {
        constructor() {
            super({
                name: name,
                vertex: vertex,
                fragment: fragment
            });
        }
    }
    exports.PhongShader = PhongShader;
});
define("engine/core/rendering/shaders/ShadersLib", ["require", "exports", "engine/core/rendering/shaders/lib/PhongShader"], function (require, exports, PhongShader_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ShadersLib = void 0;
    const ShadersLib = Object.freeze({
        shaders: {
            Phong: PhongShader_1.PhongShader
        },
        chunks: new Map([
            ['empty', 'empty.glsl'],
        ])
    });
    exports.ShadersLib = ShadersLib;
});
define("engine/core/rendering/shaders/Shader", ["require", "exports", "engine/core/logger/Logger", "engine/core/rendering/shaders/ShadersLib"], function (require, exports, Logger_2, ShadersLib_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Shader = exports.ShaderType = void 0;
    var ShaderType;
    (function (ShaderType) {
        ShaderType[ShaderType["FRAGMENT_SHADER"] = 0] = "FRAGMENT_SHADER";
        ShaderType[ShaderType["VERTEX_SHADER"] = 1] = "VERTEX_SHADER";
    })(ShaderType || (ShaderType = {}));
    exports.ShaderType = ShaderType;
    let DefaultShader = /** @class */ (() => {
        class DefaultShader {
            constructor(args) {
                this.name = args.name;
                this._vertex = this.__vertex = args.vertex;
                this._fragment = this.__fragment = args.fragment;
                DefaultShader._dictionnary.set(this.name, this);
            }
            get vertex() {
                return this._vertex;
            }
            get fragment() {
                return this._fragment;
            }
            static get(name) {
                return DefaultShader._dictionnary.get(name);
            }
            setDefinition(shader, sourceType, definitionName, definitionValue) {
                const definitionPattern = new RegExp(`#define ${definitionName} (.*?)\n`, 'gms');
                const shaderSource = shader.getSource(sourceType);
                let match;
                if ((match = definitionPattern.exec(shaderSource)) !== null) {
                    let definitionValueMatch = match[1];
                    this.replaceInSource(shader, sourceType, definitionValueMatch, definitionValue.toString());
                }
                else {
                    this.prependToSource(shader, sourceType, `#define ${definitionName} ${definitionValue}\n`);
                }
                return this;
            }
            resolveIncludes(shader, sourceType, resources) {
                const includePattern = new RegExp('\/\/include+<(.*)+>', 'gm');
                const shaderSource = shader.getSource(sourceType);
                let match;
                while ((match = includePattern.exec(shaderSource)) !== null) {
                    let patternMatch = match[0];
                    let includeMatch = match[1];
                    let chunk = ShadersLib_1.ShadersLib.chunks.get(includeMatch);
                    if (chunk !== undefined) {
                        const chunkSource = resources.get(chunk);
                        if (chunkSource) {
                            this.replaceInSource(shader, sourceType, patternMatch, chunkSource);
                        }
                    }
                    else {
                        Logger_2.Logger.info(`Shader chunk '${includeMatch}' is unknown!`);
                    }
                }
            }
            getUniformBlockIndex(shader, sourceType, blockName) {
                const uniformBlockPattern = new RegExp(`uniform ${blockName}`, 'gms');
                const shaderSource = shader.getSource(sourceType);
                let match;
                if ((match = uniformBlockPattern.exec(shaderSource)) !== null) {
                    return match.index;
                }
                Logger_2.Logger.info(`Block '${blockName}' is not present in shader '${shader.name}' !`);
                return null;
            }
            replaceInSource(shader, sourceType, oldStr, newStr) {
                const shaderSource = shader.getSource(sourceType);
                shader._setSource(sourceType, shaderSource.replace(oldStr, newStr));
            }
            prependToSource(shader, sourceType, str) {
                const shaderSource = shader.getSource(sourceType);
                shader._setSource(sourceType, str.concat(shaderSource));
            }
            getSource(type) {
                if (type == ShaderType.VERTEX_SHADER) {
                    return this._vertex;
                }
                else {
                    return this._fragment;
                }
            }
            _setSource(type, value) {
                if (type == ShaderType.VERTEX_SHADER) {
                    this._vertex = value;
                }
                else {
                    this._fragment = value;
                }
            }
        }
        DefaultShader._dictionnary = new Map();
        return DefaultShader;
    })();
    const Shader = DefaultShader;
    exports.Shader = Shader;
});
define("engine/core/rendering/renderers/RenderPacket", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RenderPacket = void 0;
    class RenderPacket {
        //TODO: Setters common to all instances (for example MeshPhong)
        // but arrays/values specific per instance
        constructor(shader) {
            this.shader = shader;
            this.attributes = new Map();
            this.uniforms = new Map();
        }
    }
    exports.RenderPacket = RenderPacket;
});
define("engine/core/rendering/renderers/RenderPipeline", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RenderPipeline = void 0;
    class RenderPipeline {
    }
    exports.RenderPipeline = RenderPipeline;
});
define("engine/core/rendering/scenes/objects/lights/Light", ["require", "exports", "engine/core/rendering/scenes/objects/Object3D"], function (require, exports, Object3D_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LightBase = exports.isLight = exports.LightProperties = void 0;
    var LightProperties;
    (function (LightProperties) {
        LightProperties[LightProperties["color"] = 0] = "color";
    })(LightProperties || (LightProperties = {}));
    exports.LightProperties = LightProperties;
    function isLight(obj) {
        const light = obj;
        return light.isObject3D && light.isLight;
    }
    exports.isLight = isLight;
    class LightBase extends Object3D_3.Object3DBase {
        constructor(color) {
            super();
            this.isLight = true;
            this._color = color.clone();
        }
        get color() {
            return this._color;
        }
        set color(color) {
            this._color = color;
        }
    }
    exports.LightBase = LightBase;
});
define("engine/core/rendering/scenes/objects/meshes/Submesh", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BaseSubmesh = void 0;
    class BaseSubmesh {
        constructor(composite, indexStart, indexCount, material) {
            this.composite = composite;
            this.indexStart = indexStart;
            this.indexCount = indexCount;
            this.material = material;
        }
    }
    exports.BaseSubmesh = BaseSubmesh;
});
define("engine/core/rendering/scenes/objects/meshes/CompositeMesh", ["require", "exports", "engine/core/rendering/scenes/objects/Object3D"], function (require, exports, Object3D_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CompositeMeshBase = void 0;
    class CompositeMeshBase extends Object3D_4.Object3DBase {
        constructor(geometry, ...submeshes) {
            super();
            this.geometry = geometry;
            this.submeshes = submeshes;
        }
    }
    exports.CompositeMeshBase = CompositeMeshBase;
});
define("engine/core/rendering/scenes/Scene", ["require", "exports", "engine/core/rendering/scenes/objects/lights/Light", "engine/core/rendering/scenes/objects/meshes/Mesh", "engine/core/general/Transform"], function (require, exports, Light_1, Mesh_1, Transform_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BaseScene = void 0;
    class BaseScene {
        //background: Background;
        constructor() {
            this.root = new Transform_4.TransformBase();
            this.meshes = [];
            this.compositeMeshes = [];
            this.lights = [];
            this.layers = [];
        }
        parseObjectRecursive(transform) {
            for (const child of transform.children) {
                this.parseObjectRecursive(child);
            }
            if (transform.owner !== undefined) {
                if (Mesh_1.isMesh(transform.owner)) {
                    this.meshes.push(transform.owner);
                }
                if (Light_1.isLight(transform.owner)) {
                    this.lights.push(transform.owner);
                }
            }
        }
        *lightsOn(mesh) {
            for (const light of this.lights) {
                if (light.isLightingOn(mesh)) {
                    yield light;
                }
            }
        }
    }
    exports.BaseScene = BaseScene;
});
define("engine/core/rendering/renderers/Renderer", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Renderer = void 0;
    class Renderer {
        // compiling scene to memory
        // i.e.
        // from Uniforms and Attributes (shaders)
        // to Programs, Buffers, Textures, and Framebuffers (webgl)
        // render loop :
        //  culling
        //  rendering passes
        // TODO:
        // - use uniform buffers (instanced), uniform blocks, instanced attributes, buffer subdata
        // - 
        constructor(context) {
            this.context = context;
            this.programs = new Map();
            this.packets = new Array();
            this.textures = [];
        }
        compile(scene) {
        }
        clear() {
        }
        dispose() {
        }
        prepare() {
        }
        prerender(scene) {
            this.packets = [];
            /*for (const mesh of scene.meshes) {
                //this.packets.push(new MeshRenderPacket(this.getProgramFor(mesh.material), mesh, scene));
            }
    
            for (const compositeMesh of scene.compositeMeshes) {
                for (const submesh of compositeMesh.submeshes) {
                    //this.packets.push(new SubmeshRenderPacket(this.getProgramFor(submesh.material), submesh, scene));
                }
            }
    
            for (const program of this.programs.values()) {
                //program.compile(this.context);
            }*/
        }
        render(scene, camera) {
            // Culling (octree, etc.)
            // Sorting
            for (const packet of this.packets) {
                //this.context.useProgram(packet.program);
            }
        }
    }
    exports.Renderer = Renderer;
});
define("engine/core/rendering/scenes/cameras/OrthographicCamera", ["require", "exports", "engine/libs/maths/algebra/matrices/Matrix4", "engine/core/rendering/scenes/cameras/Camera"], function (require, exports, Matrix4_5, Camera_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.OrthographicCamera = void 0;
    class OrthographicCamera extends Camera_2.CameraBase {
        constructor(left = 0, width = 0, height = 400, top = 400, near = 400, far = -400) {
            super(new Matrix4_5.Matrix4().asOrthographic(left, left + width, top + height, top, near, far));
        }
        setValues(left = 0, width = 0, height = 400, top = 400, near = 400, far = -400) {
            this._projection.asOrthographic(left, left + width, top + height, top, near, far);
            this.updateFrustrum();
            return this;
        }
    }
    exports.OrthographicCamera = OrthographicCamera;
});
define("engine/core/rendering/scenes/cameras/controls/OrbitingControls", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.OrbitingControls = void 0;
    class OrbitingControls {
    }
    exports.OrbitingControls = OrbitingControls;
});
define("engine/core/rendering/scenes/environment/fog/Fog", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Fog = void 0;
    class Fog {
    }
    exports.Fog = Fog;
});
define("engine/core/rendering/scenes/geometries/GeometryBuilder", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.GeometryBuilderBase = void 0;
    ;
    class GeometryBuilderBase {
        constructor(geometry) {
            this.geometry = geometry;
        }
        attribute(name, array, container) {
            this.geometry = Object.assign(this.geometry, {
                [name]: new container(array)
            });
            return this;
        }
        /*public vertices(vertices: TypedArray): GeometryBuilder<G & GeometryVertices> {
            this.geometry.vertices = new Vector3List(vertices);
            this.geometry.faces = new TriangleList(vertices);
    
            return this as GeometryBuilder<G & GeometryVertices>;
        }*/
        /*public indices(indices: TypedArray): GeometryBuilder<G & GeometryIndices> {
            this.geometry = Object.assign(this.geometry, {
                indices: indices
            });
    
            return this;
        }
    
        public uvs(uvs: TypedArray): GeometryBuilder<G & GeometryUvs> {
            this.geometry.uvs = new Vector2List(uvs);
    
            return this as GeometryBuilder<G & GeometryUvs>;
        }*/
        /*public facesNormals(): GeometryBuilder<G & GeometryFacesNormals> {
            if (!this.geometry.indices || !this.geometry.faces) {
                throw new Error();
            }
    
            const facesNormals = new Vector3List(new Float32Array(this.geometry.indices));
            this.geometry.facesNormals = GeometryUtils.computeFacesNormals(this.geometry.faces, this.geometry.indices, facesNormals);
    
            return this as GeometryBuilder<G & GeometryFacesNormals>;
        }
    
        public verticesNormals(weighted: boolean = false): GeometryBuilder<G & GeometryVerticesNormals> {
            if (!this.geometry.indices || !this.geometry.faces || !this.geometry.vertices) {
                throw new Error();
            }
            const verticesNormals = new Vector3List(new Float32Array(this.geometry.indices.length));
            this.geometry.verticesNormals = GeometryUtils.computeVerticesNormals(
                this.geometry.vertices, this.geometry.faces, this.geometry.indices, this.geometry.facesNormals!, verticesNormals, weighted
            );
    
            return this as GeometryBuilder<G & GeometryVerticesNormals>;
        }
    
        public tangentsAndBitangents(): GeometryBuilder<G & GeometryTangentsAndBitangents> {
            if (!this.geometry.indices || !this.geometry.uvs || !this.geometry.vertices) {
                throw new Error();
            }
    
            const tangents = new Vector3List(new Float32Array(this.geometry.indices.length));
            const bitangents = new Vector3List(new Float32Array(this.geometry.indices.length));
            
            GeometryUtils.computeTangentsAndBitangents(
                this.geometry.vertices, this.geometry.uvs, this.geometry.indices, tangents, bitangents
            );
    
            this.geometry.tangents = tangents;
            this.geometry.bitangents = bitangents;
            
            return this as GeometryBuilder<G & GeometryTangentsAndBitangents>;
        }*/
        build() {
            return this.geometry;
        }
    }
    exports.GeometryBuilderBase = GeometryBuilderBase;
});
//new GeometryBuilderBase(new GeometryBase()).attribute('indices', new Float32Array(), Vector2List).build().indices
define("engine/core/rendering/scenes/geometries/MorphTargetGeometry", ["require", "exports", "engine/core/rendering/scenes/geometries/Geometry"], function (require, exports, Geometry_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MorphTargetGeometry = void 0;
    class MorphTargetGeometry extends Geometry_1.GeometryBase {
    }
    exports.MorphTargetGeometry = MorphTargetGeometry;
});
define("engine/core/rendering/scenes/geometries/PhongGeometry", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("engine/core/rendering/scenes/geometries/lib/SphereGeometry", ["require", "exports", "engine/core/rendering/scenes/geometries/Geometry", "engine/utils/Snippets"], function (require, exports, geometry_4, Snippets_15) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SphereGeometry = void 0;
    class SphereGeometry extends geometry_4.GeometryBase {
        constructor() {
            super({
                vertices: new Float32Array(sphereVertices),
                uvs: new Float32Array(sphereUVS),
                indices: new Uint8Array(sphereIndices)
            });
        }
    }
    exports.SphereGeometry = SphereGeometry;
    /**
     *     y axis
     * 	      ^   z axis
     *     UP |   ^  FORWARD
     *        | /
     *        +------> x axis
     *         RIGHT
     *
     *  left-handed coordinates system
     *
     */
    /**
    *      v0       v1
    * 		+_______+      o   ^
    * 	    \      /\     /     \
    *       \   /   \    \     /
    *        \/      \    \ _ /
    *        +--------+
    *       v2         v3
    *
    *  counter-clockwise winding order:
    * 		v0 -> v2 -> v1
    * 		v1 -> v2 -> v3
    */
    /**
     *     v0_______v1
     *     |\        |
     *     |  \   f1 |
     *     |    \    |
     *     |  f0  \  |
     *    v2_______\v3
     *
     * v0 = [-1, +1, -1]
     * v1 = [+1, +1, -1]
     * v2 = [-1, +1, +1]
     * v3 = [+1, +1, +1]
     */
    /**
     * 	texture mappings
     *
     *
     *    uv0_____uv1
     *    | \       |
     *    |   \     |
     *    |     \   |
     *    |       \ |
     *    uv2_____uv3
     *
     *
     * uv0 = [0,0]
     * uv1 = [1,0]
     * uv2 = [0,1]
     * uv3 = [1,1]
     */
    const sphereVerticesSet = [
        [-1, +1, 1],
        [+1, +1, 1],
        [-1, -1, 1],
        [+1, -1, 1],
    ];
    const sphereUVsSet = [
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1]
    ];
    const sphereVertices = Snippets_15.buildArrayFromIndexedArrays(sphereVerticesSet, [
        0, 2, 3, 1,
    ]);
    const sphereUVS = Snippets_15.buildArrayFromIndexedArrays(sphereUVsSet, [
        0, 2, 3, 1,
    ]);
    const sphereIndices = [
        0, 1, 2,
        0, 2, 3,
    ];
});
/**
 *
 *           v0_ _ _v1    v1_ _ _v2                      _-v24-_
 *          /        \    /        \                    -         -
 *        v2          \  /          v5               v23          v25
 *         -_        _ v3 _        _-         _v12_   \            /   _-v25-_
 *           -_    _-      - _   _-        _-       -_ \          / _-         -_
 *    v6_ _ _ _ v4             v6_ _ _ _v10           v22_ _ _ _v23              v26
 *    /          \             /         \            /           \              /
 *   /            \           /           \          /             \            /
 *  v12            \         /            v11_ _ _ _v15            v21_ _ _ _ v27
 *   \         _ -v8_ _ _ _v9- _        /        _-  - _         _-   -_
 *     v14 _ -    /         \     - _v12        _-        -_   _-        -_
 *               /           \               v20            v16            v32
 *             v16            v13              \             / \            |
 *               -_         _-                  \           /   \           |
 *                  -_    _-                     v40_ _ _ _v33   v30_ _ _ _v31
 *                     v14
 *
 */ 
define("engine/core/rendering/scenes/geometries/lib/polyhedron/TetrahedronGeometry", ["require", "exports", "engine/core/rendering/scenes/geometries/Geometry", "engine/utils/Snippets"], function (require, exports, geometry_5, Snippets_16) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TetrahedronGeometry = void 0;
    class TetrahedronGeometry extends geometry_5.GeometryBase {
        constructor() {
            super({
                vertices: new Float32Array(tetrahedronVertices),
                uvs: new Float32Array(tetrahedronUVS),
                indices: new Uint8Array(tetrahedronIndices)
            });
        }
    }
    exports.TetrahedronGeometry = TetrahedronGeometry;
    /**
     *          v0
     *         / \
     *        /   \
     *       /     \
     *      /  f0   \
     *     v1--------v2
     *     /\        /\
     * 	  /  \  f2  /  \
     *   /    \    /    \
     *  /  f1  \  /  f3  \
     * v0-------v3--------v0
     *
     * v0 = [+1,-1,+1]
     * v1 = [-1,+1,+1]
     * v2 = [+1,+1,-1]
     * v3 = [+1,+1,+1]
     *
     */
    const tetrahedronVerticesSet = [
        [+1, -1, +1],
        [-1, +1, +1],
        [+1, +1, -1],
        [+1, +1, +1],
    ];
    const tetrahedronUVsSet = [
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
    ];
    const tetrahedronVertices = Snippets_16.buildArrayFromIndexedArrays(tetrahedronVerticesSet, [
        0, 1, 2,
        1, 0, 3,
        1, 3, 2,
        2, 3, 0,
    ]);
    const tetrahedronUVS = Snippets_16.buildArrayFromIndexedArrays(tetrahedronUVsSet, [
        1, 2, 0,
        1, 3, 0,
        2, 3, 0,
        1, 2, 3,
    ]);
    const tetrahedronIndices = [
        0, 1, 2,
        3, 4, 5,
        6, 7, 8,
        9, 10, 11,
    ];
});
define("engine/core/rendering/shaders/textures/Texture", ["require", "exports", "engine/libs/maths/statistics/random/UUIDGenerator"], function (require, exports, UUIDGenerator_7) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ObservableTexture = exports.TextureWrapper = exports.BaseTexture = void 0;
    var TexturePropertyKeys;
    (function (TexturePropertyKeys) {
        TexturePropertyKeys[TexturePropertyKeys["target"] = 0] = "target";
        TexturePropertyKeys[TexturePropertyKeys["lod"] = 1] = "lod";
        TexturePropertyKeys[TexturePropertyKeys["width"] = 2] = "width";
        TexturePropertyKeys[TexturePropertyKeys["height"] = 3] = "height";
        TexturePropertyKeys[TexturePropertyKeys["pixels"] = 4] = "pixels";
        TexturePropertyKeys[TexturePropertyKeys["format"] = 5] = "format";
        TexturePropertyKeys[TexturePropertyKeys["type"] = 6] = "type";
        TexturePropertyKeys[TexturePropertyKeys["min"] = 7] = "min";
        TexturePropertyKeys[TexturePropertyKeys["mag"] = 8] = "mag";
        TexturePropertyKeys[TexturePropertyKeys["wrapS"] = 9] = "wrapS";
        TexturePropertyKeys[TexturePropertyKeys["wrapT"] = 10] = "wrapT";
        TexturePropertyKeys[TexturePropertyKeys["wrapR"] = 11] = "wrapR";
        TexturePropertyKeys[TexturePropertyKeys["tiling"] = 12] = "tiling";
        TexturePropertyKeys[TexturePropertyKeys["offset"] = 13] = "offset";
        TexturePropertyKeys[TexturePropertyKeys["baseLod"] = 14] = "baseLod";
        TexturePropertyKeys[TexturePropertyKeys["maxLod"] = 15] = "maxLod";
        TexturePropertyKeys[TexturePropertyKeys["unpackAlignment"] = 16] = "unpackAlignment";
        TexturePropertyKeys[TexturePropertyKeys["anisotropy"] = 17] = "anisotropy";
        TexturePropertyKeys[TexturePropertyKeys["flipY"] = 18] = "flipY";
    })(TexturePropertyKeys || (TexturePropertyKeys = {}));
    ;
    class BaseTexture {
        constructor(props) {
            this.uuid = UUIDGenerator_7.UUIDGenerator.newUUID();
            this.target = props.target;
            this.lod = props.lod;
            this.width = props.width;
            this.height = props.height;
            this.pixels = props.pixels;
            this.format = props.format;
            this.type = props.type;
            this.min = props.min;
            this.mag = props.mag;
            this.wrapS = props.wrapS;
            this.wrapT = props.wrapT;
            this.wrapR = props.wrapR;
            /*this._tiling = props.tiling;
            this._offset = props.offset;*/
            this.baseLod = props.baseLod;
            this.maxLod = props.maxLod;
        }
    }
    exports.BaseTexture = BaseTexture;
    class TextureWrapper {
        constructor(internal) {
            this.internal = internal;
        }
        get uuid() {
            return this.internal.uuid;
        }
        get target() {
            return this.internal.target;
        }
        set target(target) {
            this.internal.target = target;
        }
        get lod() {
            return this.internal.lod;
        }
        set lod(lod) {
            this.internal.lod = lod;
        }
        get width() {
            return this.internal.width;
        }
        set width(width) {
            this.internal.width = width;
        }
        get height() {
            return this.internal.height;
        }
        set height(height) {
            this.internal.height = height;
        }
        get pixels() {
            return this.internal.pixels;
        }
        set pixels(pixels) {
            this.internal.pixels = pixels;
        }
        get format() {
            return this.internal.format;
        }
        set format(format) {
            this.internal.format = format;
        }
        get type() {
            return this.internal.type;
        }
        set type(type) {
            this.internal.type = type;
        }
        get min() {
            return this.internal.min;
        }
        set min(min) {
            this.internal.min = min;
        }
        get mag() {
            return this.internal.mag;
        }
        set mag(mag) {
            this.internal.mag = mag;
        }
        get wrapS() {
            return this.internal.wrapS;
        }
        set wrapS(wrapS) {
            this.internal.wrapS = wrapS;
        }
        get wrapT() {
            return this.internal.wrapT;
        }
        set wrapT(wrapT) {
            this.internal.wrapT = wrapT;
        }
        get wrapR() {
            return this.internal.wrapR;
        }
        set wrapR(wrapR) {
            this.internal.wrapR = wrapR;
        }
        get tiling() {
            return this.internal.tiling;
        }
        set tiling(tiling) {
            this.internal.tiling = tiling;
        }
        get offset() {
            return this.internal.offset;
        }
        set offset(offset) {
            this.internal.offset = offset;
        }
        get baseLod() {
            return this.internal.baseLod;
        }
        set baseLod(baseLod) {
            this.internal.baseLod = baseLod;
        }
        get maxLod() {
            return this.internal.maxLod;
        }
        set maxLod(maxLod) {
            this.internal.maxLod = maxLod;
        }
        get unpackAlignment() {
            return this.internal.unpackAlignment;
        }
        set unpackAlignment(unpackAlignment) {
            this.internal.unpackAlignment = unpackAlignment;
        }
        get anisotropy() {
            return this.internal.anisotropy;
        }
        set anisotropy(anisotropy) {
            this.internal.anisotropy = anisotropy;
        }
        get flipY() {
            return this.internal.flipY;
        }
        set flipY(flipY) {
            this.internal.flipY = flipY;
        }
    }
    exports.TextureWrapper = TextureWrapper;
    class ObservableTexture extends TextureWrapper {
        constructor(internal, broker) {
            super(internal);
            this.changes = broker;
        }
        set target(target) {
            this.internal.target = target;
            this.changes.publish(TexturePropertyKeys.target);
        }
        set lod(lod) {
            this.internal.lod = lod;
            this.changes.publish(TexturePropertyKeys.lod);
        }
        set width(width) {
            this.internal.width = width;
            this.changes.publish(TexturePropertyKeys.width);
        }
        set height(height) {
            this.internal.height = height;
            this.changes.publish(TexturePropertyKeys.height);
        }
        set pixels(pixels) {
            this.internal.pixels = pixels;
            this.changes.publish(TexturePropertyKeys.pixels);
        }
        set format(format) {
            this.internal.format = format;
            this.changes.publish(TexturePropertyKeys.format);
        }
        set type(type) {
            this.internal.type = type;
            this.changes.publish(TexturePropertyKeys.type);
        }
        set min(min) {
            this.internal.min = min;
            this.changes.publish(TexturePropertyKeys.min);
        }
        set mag(mag) {
            this.internal.mag = mag;
            this.changes.publish(TexturePropertyKeys.mag);
        }
        set wrapS(wrapS) {
            this.internal.wrapS = wrapS;
            this.changes.publish(TexturePropertyKeys.wrapS);
        }
        set wrapT(wrapT) {
            this.internal.wrapT = wrapT;
            this.changes.publish(TexturePropertyKeys.wrapT);
        }
        set wrapR(wrapR) {
            this.internal.wrapR = wrapR;
            this.changes.publish(TexturePropertyKeys.wrapR);
        }
        set tiling(tiling) {
            this.internal.tiling = tiling;
            this.changes.publish(TexturePropertyKeys.tiling);
        }
        set offset(offset) {
            this.internal.offset = offset;
            this.changes.publish(TexturePropertyKeys.offset);
        }
        set baseLod(baseLod) {
            this.internal.baseLod = baseLod;
            this.changes.publish(TexturePropertyKeys.baseLod);
        }
        set maxLod(maxLod) {
            this.internal.maxLod = maxLod;
            this.changes.publish(TexturePropertyKeys.maxLod);
        }
        set unpackAlignment(unpackAlignment) {
            this.internal.unpackAlignment = unpackAlignment;
            this.changes.publish(TexturePropertyKeys.unpackAlignment);
        }
        set anisotropy(anisotropy) {
            this.internal.anisotropy = anisotropy;
            this.changes.publish(TexturePropertyKeys.anisotropy);
        }
        set flipY(flipY) {
            this.internal.flipY = flipY;
            this.changes.publish(TexturePropertyKeys.flipY);
        }
    }
    exports.ObservableTexture = ObservableTexture;
});
define("engine/core/rendering/scenes/materials/lib/PhongMaterial", ["require", "exports", "engine/core/rendering/scenes/materials/Material", "engine/libs/patterns/messaging/brokers/SingleTopicMessageBroker"], function (require, exports, Material_1, SingleTopicMessageBroker_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PhongMaterialBase = exports.PhongMaterialPropertyKeys = void 0;
    var PhongMaterialPropertyKeys;
    (function (PhongMaterialPropertyKeys) {
        PhongMaterialPropertyKeys[PhongMaterialPropertyKeys["albedo"] = 0] = "albedo";
        PhongMaterialPropertyKeys[PhongMaterialPropertyKeys["albedoMap"] = 1] = "albedoMap";
        PhongMaterialPropertyKeys[PhongMaterialPropertyKeys["alpha"] = 2] = "alpha";
        PhongMaterialPropertyKeys[PhongMaterialPropertyKeys["alphaMap"] = 3] = "alphaMap";
        PhongMaterialPropertyKeys[PhongMaterialPropertyKeys["displacementMap"] = 4] = "displacementMap";
        PhongMaterialPropertyKeys[PhongMaterialPropertyKeys["emissionMap"] = 5] = "emissionMap";
        PhongMaterialPropertyKeys[PhongMaterialPropertyKeys["normalMap"] = 6] = "normalMap";
        PhongMaterialPropertyKeys[PhongMaterialPropertyKeys["occlusionMap"] = 7] = "occlusionMap";
        PhongMaterialPropertyKeys[PhongMaterialPropertyKeys["reflexionMap"] = 8] = "reflexionMap";
        PhongMaterialPropertyKeys[PhongMaterialPropertyKeys["shininess"] = 9] = "shininess";
        PhongMaterialPropertyKeys[PhongMaterialPropertyKeys["lightMap"] = 10] = "lightMap";
        PhongMaterialPropertyKeys[PhongMaterialPropertyKeys["specular"] = 11] = "specular";
        PhongMaterialPropertyKeys[PhongMaterialPropertyKeys["specularMap"] = 12] = "specularMap";
        PhongMaterialPropertyKeys[PhongMaterialPropertyKeys["specularFactor"] = 13] = "specularFactor";
    })(PhongMaterialPropertyKeys || (PhongMaterialPropertyKeys = {}));
    exports.PhongMaterialPropertyKeys = PhongMaterialPropertyKeys;
    let PhongMaterialBase = /** @class */ (() => {
        class PhongMaterialBase extends Material_1.MaterialBase {
            constructor(props) {
                super(PhongMaterialBase._name);
                this._albedo = props.albedo;
                this._albedoMap = props.albedoMap;
                this._alpha = props.alpha;
                this._alphaMap = props.alphaMap;
                this._displacementMap = props.displacementMap;
                this._emissionMap = props.emissionMap;
                this._lightMap = props.lightMap;
                this._normalMap = props.normalMap;
                this._occlusionMap = props.occlusionMap;
                this._reflexionMap = props.reflexionMap;
                this._shininess = props.shininess;
                this._specular = props.specular;
                this._specularMap = props.specularMap;
                this._specularFactor = props.specularFactor;
                this._changes = new SingleTopicMessageBroker_2.SingleTopicMessageBroker();
                this._subscriptions = new Array(Object.keys(PhongMaterialPropertyKeys).length);
            }
            get changes() {
                return this._changes;
            }
            get albedo() {
                return this._albedo;
            }
            updateAlbedo(albedo) {
                if (typeof albedo !== 'undefined') {
                    if (typeof this._albedo !== 'undefined') {
                        this._albedo.setValues(albedo);
                    }
                    else {
                        delete this._albedo;
                    }
                }
                this._changes.publish(PhongMaterialPropertyKeys.albedo);
            }
            get albedoMap() {
                return this._albedoMap;
            }
            updateAlbedoMap(albedoMap) {
                if (typeof albedoMap !== 'undefined') {
                    if (typeof this._albedoMap !== 'undefined') {
                        //this._albedoMap.set(albedoMap);
                    }
                    else {
                        delete this._albedoMap;
                    }
                }
                else {
                    this._changes.unsubscribe(this._subscriptions[PhongMaterialPropertyKeys.albedoMap]);
                }
                this._changes.publish(PhongMaterialPropertyKeys.albedoMap);
            }
            get alpha() {
                return this._alpha;
            }
            set alpha(alpha) {
                this._alpha = alpha;
            }
            get alphaMap() {
                return this._alphaMap;
            }
            set alphaMap(alphaMap) {
                this._alphaMap = alphaMap;
            }
            get displacementMap() {
                return this._displacementMap;
            }
            set displacementMap(displacementMap) {
                this._displacementMap = displacementMap;
            }
            get emissionMap() {
                return this._emissionMap;
            }
            set emissionMap(emissionMap) {
                this._emissionMap = emissionMap;
            }
            get lightMap() {
                return this._lightMap;
            }
            set lightMap(lightMap) {
                this._lightMap = lightMap;
            }
            get normalMap() {
                return this._normalMap;
            }
            set normalMap(normalMap) {
                this._normalMap = normalMap;
            }
            get occlusionMap() {
                return this._occlusionMap;
            }
            set occlusionMap(occlusionMap) {
                this._occlusionMap = occlusionMap;
            }
            get reflexionMap() {
                return this._reflexionMap;
            }
            set reflexionMap(reflexionMap) {
                this._reflexionMap = reflexionMap;
            }
            get shininess() {
                return this._shininess;
            }
            set shininess(shininess) {
                this._shininess = shininess;
            }
            get specular() {
                return this._specular;
            }
            set specular(specular) {
                this._specular = specular;
            }
            get specularMap() {
                return this._specularMap;
            }
            set specularMap(specularMap) {
                this._specularMap = specularMap;
            }
            get specularFactor() {
                return this._specularFactor;
            }
            set specularFactor(specularFactor) {
                this._specularFactor = specularFactor;
            }
            copy(material) {
                this._albedo = material._albedo;
                this._albedoMap = material._albedoMap;
                this._alpha = material._alpha;
                this._alphaMap = material._alphaMap;
                this._displacementMap = material._displacementMap;
                this._emissionMap = material._emissionMap;
                this._lightMap = material._lightMap;
                this._normalMap = material._normalMap;
                this._occlusionMap = material._occlusionMap;
                this._reflexionMap = material._reflexionMap;
                this._shininess = material._shininess;
                this._specular = material._specular;
                this._specularMap = material._specularMap;
                this._specularFactor = material._specularFactor;
                return this;
            }
            clone() {
                return new PhongMaterialBase(this);
            }
        }
        PhongMaterialBase._name = 'Phong';
        return PhongMaterialBase;
    })();
    exports.PhongMaterialBase = PhongMaterialBase;
});
define("engine/core/rendering/scenes/objects/groups/Group", ["require", "exports", "engine/core/rendering/scenes/objects/Object3D"], function (require, exports, Object3D_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.GroupBase = void 0;
    class GroupBase extends Object3D_5.Object3DBase {
        constructor() {
            super();
            this.objects = [];
        }
        add(object) {
            this.objects.push(object);
            return this;
        }
    }
    exports.GroupBase = GroupBase;
});
define("engine/core/rendering/scenes/objects/lights/AmbientLight", ["require", "exports", "engine/core/rendering/scenes/objects/lights/Light"], function (require, exports, Light_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AmbientLight = void 0;
    class AmbientLight extends Light_2.LightBase {
        isLightingOn(mesh) {
            return false;
        }
    }
    exports.AmbientLight = AmbientLight;
});
define("engine/core/rendering/scenes/objects/lights/DirectionalLight", ["require", "exports", "engine/core/rendering/scenes/objects/lights/Light"], function (require, exports, Light_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DirectionalLight = void 0;
    class DirectionalLight extends Light_3.LightBase {
        isLightingOn(mesh) {
            return false;
        }
    }
    exports.DirectionalLight = DirectionalLight;
});
define("engine/core/rendering/scenes/objects/lights/HemisphereLight", ["require", "exports", "engine/core/rendering/scenes/objects/lights/Light"], function (require, exports, Light_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HemisphereLight = void 0;
    class HemisphereLight extends Light_4.LightBase {
        isLightingOn(mesh) {
            return false;
        }
    }
    exports.HemisphereLight = HemisphereLight;
});
define("engine/core/rendering/scenes/objects/lights/PointLight", ["require", "exports", "engine/core/rendering/scenes/objects/lights/Light"], function (require, exports, Light_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PointLight = void 0;
    class PointLight extends Light_5.LightBase {
        isLightingOn(mesh) {
            return false;
        }
    }
    exports.PointLight = PointLight;
});
define("engine/core/rendering/scenes/objects/lights/SpotLight", ["require", "exports", "engine/core/rendering/scenes/objects/lights/Light"], function (require, exports, Light_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SpotLight = void 0;
    class SpotLight extends Light_6.LightBase {
        isLightingOn(mesh) {
            return false;
        }
    }
    exports.SpotLight = SpotLight;
});
define("engine/core/rendering/scenes/objects/meshes/PhongMesh", ["require", "exports", "engine/core/rendering/scenes/objects/meshes/Mesh"], function (require, exports, Mesh_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PhongMeshBase = void 0;
    class PhongMeshBase extends Mesh_2.MeshBase {
        constructor(geometry, material) {
            super(geometry, material);
        }
    }
    exports.PhongMeshBase = PhongMeshBase;
});
define("engine/core/rendering/scenes/rigs/Joint", ["require", "exports", "engine/core/rendering/scenes/objects/Object3D"], function (require, exports, Object3D_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.JointBase = void 0;
    class JointBase extends Object3D_6.Object3DBase {
        constructor() {
            super();
        }
    }
    exports.JointBase = JointBase;
});
define("engine/core/rendering/scenes/objects/meshes/SkinnedMesh", ["require", "exports", "engine/core/rendering/scenes/objects/meshes/Mesh", "engine/core/rendering/scenes/rigs/Joint"], function (require, exports, Mesh_3, Joint_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SkinnedMeshBase = void 0;
    class SkinnedMeshBase extends Mesh_3.MeshBase {
        constructor(geometry, material) {
            super(geometry, material);
            this.bonesIndices = new Uint16Array(0);
            this.bonesWeights = new Uint8Array(0);
            this.hipsJoint = new Joint_1.JointBase();
            this.hipsJoint.transform.parent = this.transform;
        }
    }
    exports.SkinnedMeshBase = SkinnedMeshBase;
});
define("engine/core/rendering/scenes/rigs/Pose", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Pose = void 0;
    class Pose {
    }
    exports.Pose = Pose;
});
define("engine/core/rendering/scenes/rigs/Rig", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Rig = void 0;
    class Rig {
    }
    exports.Rig = Rig;
});
define("engine/core/rendering/shaders/packets/Packet", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AbstractPacket = void 0;
    class AbstractPacket {
    }
    exports.AbstractPacket = AbstractPacket;
});
define("engine/libs/patterns/flags/Flags", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FlagsBase = exports.Flags = void 0;
    class FlagsBase {
        constructor() {
            this._bits = 0;
        }
        get bits() {
            return this._bits;
        }
        getThenUnset(flag) {
            const value = !!(this._bits & flag);
            this._bits |= flag;
            return value;
        }
        get(flag) {
            return !!(this._bits & flag);
        }
        set(flag) {
            this._bits |= flag;
        }
        unset(flag) {
            this._bits &= ~flag;
        }
        setAll() {
            this._bits = (1 << 30) - 1;
        }
        unsetAll() {
            this._bits = 0;
        }
    }
    exports.FlagsBase = FlagsBase;
    const Flags = FlagsBase;
    exports.Flags = Flags;
});
define("engine/core/rendering/shaders/ubos/UBO", ["require", "exports", "engine/libs/maths/statistics/random/UUIDGenerator"], function (require, exports, UUIDGenerator_8) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.UBOBase = void 0;
    let UBOBase = /** @class */ (() => {
        class UBOBase {
            constructor(name, references) {
                this.name = name;
                this._references = references;
                this.uuid = UUIDGenerator_8.UUIDGenerator.newUUID();
            }
            static getReferencesHash(references) {
                return Object.keys(references).reduce((prev, curr) => {
                    return references[prev].uuid + references[curr].uuid;
                });
            }
            static getConcreteInstance(ctor, references) {
                const hash = UBOBase.getReferencesHash(references);
                let ref = UBOBase._dictionary.get(hash);
                if (typeof ref === 'undefined') {
                    ref = new ctor(references);
                    UBOBase._dictionary.set(hash, ref);
                }
                return ref;
            }
        }
        UBOBase._dictionary = new Map();
        return UBOBase;
    })();
    exports.UBOBase = UBOBase;
});
define("engine/core/rendering/shaders/ubos/lib/PhongUBO", ["require", "exports", "engine/core/rendering/scenes/materials/lib/PhongMaterial", "engine/libs/patterns/flags/Flags", "engine/core/rendering/shaders/ubos/UBO"], function (require, exports, PhongMaterial_1, Flags_1, UBO_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PhongUBO = exports.PhongUBOIndices = void 0;
    var PhongUBOIndices;
    (function (PhongUBOIndices) {
        PhongUBOIndices[PhongUBOIndices["shininess"] = 0] = "shininess";
        PhongUBOIndices[PhongUBOIndices["specular"] = 1] = "specular";
        PhongUBOIndices[PhongUBOIndices["specularFactor"] = 2] = "specularFactor";
    })(PhongUBOIndices || (PhongUBOIndices = {}));
    exports.PhongUBOIndices = PhongUBOIndices;
    class PhongUBO extends UBO_1.UBOBase {
        constructor(references) {
            super('PhongUBO', references);
        }
        static getInstance(references) {
            return UBO_1.UBOBase.getConcreteInstance(PhongUBO, references);
        }
        subscribeReferences() {
            const deltaFlags = this._deltaFlags = new Flags_1.Flags();
            const subscriptions = this._subscriptions = new Array(1);
            subscriptions[0] = this._references.material.changes.subscribe((message) => {
                switch (message) {
                    case PhongMaterial_1.PhongMaterialPropertyKeys.shininess:
                        return deltaFlags.set(PhongUBOIndices.shininess);
                    case PhongMaterial_1.PhongMaterialPropertyKeys.specular:
                        return deltaFlags.set(PhongUBOIndices.specular);
                    case PhongMaterial_1.PhongMaterialPropertyKeys.specularFactor:
                        return deltaFlags.set(PhongUBOIndices.specularFactor);
                    default:
                        return;
                }
            });
        }
        unsubscribeReferences() {
            if (typeof this._subscriptions !== 'undefined') {
                this._references.material.changes.unsubscribe(this._subscriptions[0]);
            }
        }
        getUniformValues() {
            const material = this._references.material;
            let values = {};
            if (typeof material.shininess !== 'undefined') {
                values.u_shininess = { value: material.shininess };
            }
            if (typeof material.specular !== 'undefined') {
                values.u_specular = { value: new Uint32Array(material.specular.array) };
            }
            if (typeof material.specularFactor !== 'undefined') {
                values.u_specularFactor = { value: material.specularFactor };
            }
            return values;
        }
        getDeltaUniformValues() {
            let hasValues = false;
            const material = this._references.material;
            let uniforms = {};
            const deltaFlags = this._deltaFlags;
            if (typeof deltaFlags !== 'undefined') {
                if (typeof material.shininess !== 'undefined') {
                    if (deltaFlags.getThenUnset(PhongUBOIndices.shininess)) {
                        uniforms.u_shininess = { value: material.shininess };
                        if (!hasValues)
                            hasValues = true;
                    }
                }
                if (typeof material.specular !== 'undefined') {
                    if (deltaFlags.getThenUnset(PhongUBOIndices.specular)) {
                        uniforms.u_specular = { value: new Uint32Array(material.specular.array) };
                        if (!hasValues)
                            hasValues = true;
                    }
                }
                if (typeof material.specularFactor !== 'undefined') {
                    if (deltaFlags.getThenUnset(PhongUBOIndices.specularFactor)) {
                        uniforms.u_specularFactor = { value: material.specularFactor };
                        if (!hasValues)
                            hasValues = true;
                    }
                }
            }
            return (hasValues) ? uniforms : null;
        }
    }
    exports.PhongUBO = PhongUBO;
});
define("engine/libs/structures/arrays/ArraySection", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ArraySectionsBase = exports.ArraySections = void 0;
    class ArraySectionsBase {
        constructor(count, maxLength) {
            const length = 2 * count;
            if (maxLength < 256) {
                this._sections = new Uint8Array(length);
                this._maxLength = 256;
            }
            else {
                this._sections = new Uint16Array(length);
                this._maxLength = 65535;
            }
            this._sections = new Uint16Array(length);
            for (let index = 0; index < length; index += 2) {
                this._sections[index] = this._maxLength;
                this._sections[index + 1] = 0;
            }
        }
        get(index) {
            return [this._sections[index], this._sections[index + 1]];
        }
        getThenSetEmpty(index) {
            const section = [this._sections[index], this._sections[index + 1]];
            this._sections[index] = this._maxLength;
            this._sections[index + 1] = 0;
            return section;
        }
        isEmpty(index) {
            return this._sections[index] <= this._sections[index + 1];
        }
        setEmpty(index) {
            this._sections[index] = this._maxLength;
            this._sections[index + 1] = 0;
        }
        extend(index, section) {
            this._sections[index] = Math.min(this._sections[index], section[0], this._maxLength);
            this._sections[index + 1] = Math.max(this._sections[index + 1], section[1], 0);
        }
    }
    exports.ArraySectionsBase = ArraySectionsBase;
    const ArraySections = ArraySectionsBase;
    exports.ArraySections = ArraySections;
});
define("engine/core/rendering/shaders/vaos/VAO", ["require", "exports", "engine/libs/maths/statistics/random/UUIDGenerator"], function (require, exports, UUIDGenerator_9) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.VAOBase = void 0;
    let VAOBase = /** @class */ (() => {
        class VAOBase {
            constructor(name, references) {
                this.uuid = UUIDGenerator_9.UUIDGenerator.newUUID();
                this.name = name;
                this._references = references;
                this._values = {};
            }
            static getReferencesHash(references) {
                return Object.keys(references).reduce((prev, curr) => {
                    return references[prev].uuid + references[curr].uuid;
                });
            }
            static getConcreteInstance(ctor, references) {
                const hash = VAOBase.getReferencesHash(references);
                let ref = VAOBase._dictionary.get(hash);
                if (typeof ref === 'undefined') {
                    ref = new ctor(references);
                    VAOBase._dictionary.set(hash, ref);
                }
                return ref;
            }
        }
        VAOBase._dictionary = new Map();
        return VAOBase;
    })();
    exports.VAOBase = VAOBase;
});
define("engine/core/rendering/shaders/vaos/lib/PhongVAO", ["require", "exports", "engine/core/rendering/scenes/geometries/Geometry", "engine/core/rendering/shaders/vaos/VAO", "engine/libs/structures/arrays/ArraySection"], function (require, exports, Geometry_2, VAO_1, ArraySection_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PhongVAO = void 0;
    var PhongVAOBufferSections;
    (function (PhongVAOBufferSections) {
        PhongVAOBufferSections[PhongVAOBufferSections["a_position"] = 0] = "a_position";
        PhongVAOBufferSections[PhongVAOBufferSections["a_normal"] = 1] = "a_normal";
        PhongVAOBufferSections[PhongVAOBufferSections["a_tangent"] = 2] = "a_tangent";
        PhongVAOBufferSections[PhongVAOBufferSections["a_bitangent"] = 3] = "a_bitangent";
        PhongVAOBufferSections[PhongVAOBufferSections["a_uv"] = 4] = "a_uv";
    })(PhongVAOBufferSections || (PhongVAOBufferSections = {}));
    class PhongVAO extends VAO_1.VAOBase {
        constructor(references) {
            super('PhongVAO', references);
            const geometry = this._references.geometry;
            this.buffersAttributes = [
                ['a_position', geometry.vertices.array, { numComponents: 3 }],
                ['a_normal', geometry.verticesNormals.array, { numComponents: 3 }],
                ['a_tangent', geometry.tangents.array, { numComponents: 3 }],
                ['a_bitangent', geometry.bitangents.array, { numComponents: 3 }],
                ['a_uv', geometry.uvs.array, { numComponents: 3 }]
            ];
        }
        static getInstance(references) {
            return VAO_1.VAOBase.getConcreteInstance(PhongVAO, references);
        }
        getAttributeValues() {
            const geometry = this._references.geometry;
            this._values = {
                list: this.buffersAttributes.reduce((result, item) => {
                    return {
                        ...result,
                        [item[0]]: { array: item[1], props: item[2] },
                    };
                }, {}),
                indices: new Uint8Array(geometry.indices.buffer),
            };
            return this._values;
        }
        enableDeltaSubscriptions() {
            const geometry = this._references.geometry;
            const subscriptions = this._deltaSubscriptions = new Array(1);
            const sections = this._deltaSections = new ArraySection_1.ArraySections(6, Math.max(...this.buffersAttributes.map(([_, buffer, ___]) => { return buffer.length; })));
            subscriptions[0] = geometry.changes.subscribe((message) => {
                switch (message.prop) {
                    case Geometry_2.GeometryPropertyKeys.vertices:
                        sections.extend(Geometry_2.GeometryPropertyKeys.vertices, message.section);
                    case Geometry_2.GeometryPropertyKeys.uvs:
                        sections.extend(Geometry_2.GeometryPropertyKeys.uvs, message.section);
                }
            });
        }
        disableDeltaSubscriptions() {
            const geometry = this._references.geometry;
            if (typeof this._deltaSubscriptions !== 'undefined') {
                geometry.changes.unsubscribe(this._deltaSubscriptions[0]);
            }
        }
        getDeltaAttributeValues() {
            let hasValues = false;
            let deltaValues = {
                list: {}
            };
            const sections = this._deltaSections;
            if (typeof sections !== 'undefined') {
                if (!sections.isEmpty(PhongVAOBufferSections.a_position)) {
                    const section = sections.getThenSetEmpty(PhongVAOBufferSections.a_position);
                    deltaValues.list.a_position = {
                        array: this._values.list.a_position.array,
                        props: {
                            numComponents: 3,
                            srcOffset: section[0],
                            srcLength: section[1] - section[0]
                        }
                    };
                    if (!hasValues)
                        hasValues = true;
                }
            }
            return (hasValues) ? deltaValues : null;
        }
    }
    exports.PhongVAO = PhongVAO;
});
define("engine/core/rendering/shaders/textures/TextureReference", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TextureReference = void 0;
    let TextureReference = /** @class */ (() => {
        class TextureReference {
            constructor(texture) {
                this.texture = texture;
            }
            static getInstance(texture) {
                let reference = TextureReference._instances.get(texture.uuid);
                if (typeof reference !== 'undefined') {
                    return reference;
                }
                else {
                    const instance = new TextureReference(texture);
                    TextureReference._instances.set(texture.uuid, instance);
                    return instance;
                }
            }
        }
        TextureReference._instances = new Map();
        return TextureReference;
    })();
    exports.TextureReference = TextureReference;
});
define("engine/libs/maths/extensions/pools/Matrix4Pools", ["require", "exports", "engine/libs/maths/algebra/matrices/Matrix4", "engine/libs/patterns/pools/StackPool"], function (require, exports, Matrix4_6, StackPool_8) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Matrix4Pool = void 0;
    const Matrix4Pool = new StackPool_8.StackPool(Matrix4_6.Matrix4Base);
    exports.Matrix4Pool = Matrix4Pool;
});
define("engine/core/rendering/shaders/ubos/lib/WorldViewUBO", ["require", "exports", "engine/libs/maths/extensions/pools/Matrix4Pools", "engine/core/rendering/shaders/ubos/UBO"], function (require, exports, Matrix4Pools_1, UBO_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WorldViewUBO = void 0;
    class WorldViewUBO extends UBO_2.UBOBase {
        constructor(references) {
            super('WorldViewUBO', references);
        }
        static getInstance(references) {
            return UBO_2.UBOBase.getConcreteInstance(WorldViewUBO, references);
        }
        subscribeReferences() {
            throw new Error("Method not implemented.");
        }
        unsubscribeReferences() {
            throw new Error("Method not implemented.");
        }
        getUniformValues() {
            let values = {};
            Matrix4Pools_1.Matrix4Pool.acquireTemp(4, (worldInverseTranspose, worldViewProjection, cameraWorld, meshWorld) => {
                cameraWorld.copy(this._references.camera.transform.globalMatrix);
                meshWorld.copy(this._references.meshTransform.globalMatrix);
                worldInverseTranspose.copy(meshWorld).invert().transpose();
                this._references.camera.getProjection(worldViewProjection).mult(cameraWorld).mult(meshWorld);
                values = {
                    u_world: { value: new Float32Array(meshWorld.array) },
                    u_worldInverseTranspose: { value: new Float32Array(worldInverseTranspose.array) },
                    u_viewInverse: { value: new Float32Array(cameraWorld.array) },
                    u_worldViewProjection: { value: new Float32Array(worldViewProjection.array) }
                };
            });
            return values;
        }
        getDeltaUniformValues() {
            throw new Error("Method not implemented.");
        }
    }
    exports.WorldViewUBO = WorldViewUBO;
});
define("engine/core/rendering/shaders/ubos/lib/LightsUBO", ["require", "exports", "engine/core/rendering/shaders/ubos/UBO"], function (require, exports, UBO_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LightsUBO = void 0;
    class LightsUBO extends UBO_3.UBOBase {
        constructor(references) {
            super('LightsUBO', references);
        }
        static getInstance(references) {
            return UBO_3.UBOBase.getConcreteInstance(LightsUBO, references);
        }
        subscribeReferences() {
            throw new Error("Method not implemented.");
        }
        unsubscribeReferences() {
            throw new Error("Method not implemented.");
        }
        getUniformValues() {
            throw new Error("Method not implemented.");
        }
        getDeltaUniformValues() {
            throw new Error("Method not implemented.");
        }
    }
    exports.LightsUBO = LightsUBO;
});
define("engine/core/rendering/shaders/packets/lib/MeshPhongPacket", ["require", "exports", "engine/core/rendering/shaders/packets/Packet", "engine/core/rendering/shaders/ubos/lib/PhongUBO", "engine/core/rendering/shaders/vaos/lib/PhongVAO", "engine/core/rendering/shaders/textures/TextureReference", "engine/core/rendering/shaders/ubos/lib/WorldViewUBO", "engine/core/rendering/shaders/ubos/lib/LightsUBO"], function (require, exports, Packet_1, PhongUBO_1, PhongVAO_1, TextureReference_1, WorldViewUBO_1, LightsUBO_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MeshPhongPacket = void 0;
    class MeshPhongPacket extends Packet_1.AbstractPacket {
        constructor(references) {
            super();
            this.references = references;
            this.textures = {};
            const mesh = references.mesh;
            const geometry = mesh.geometry;
            const material = mesh.material;
            const camera = references.camera;
            const scene = references.scene;
            this.phongVAO = PhongVAO_1.PhongVAO.getInstance({ geometry: geometry });
            this.phongUBO = PhongUBO_1.PhongUBO.getInstance({ material: material });
            this.worldViewUBO = WorldViewUBO_1.WorldViewUBO.getInstance({ meshTransform: mesh.transform, camera: camera });
            this.lightsUBO = LightsUBO_1.LightsUBO.getInstance({ scene: scene });
            if (material.albedoMap) {
                this.textures.albedoMap = TextureReference_1.TextureReference.getInstance(material.albedoMap);
            }
            if (material.normalMap) {
                this.textures.normalMap = TextureReference_1.TextureReference.getInstance(material.normalMap);
            }
        }
        getPacketBindingsProperties() {
            const packetBindingsProps = {
                texturesProps: {},
                blocksProps: {
                    worldViewBlock: { name: this.worldViewUBO.name },
                    lightsBlock: { name: this.lightsUBO.name },
                    phongBlock: { name: this.phongUBO.name }
                }
            };
            if (this.textures.albedoMap) {
                packetBindingsProps.texturesProps.albedoMap = this.textures.albedoMap;
            }
            if (this.textures.normalMap) {
                packetBindingsProps.texturesProps.normalMap = this.textures.normalMap;
            }
            return packetBindingsProps;
        }
        getPacketValues(bindings) {
            const packetValues = {
                attributes: this.phongVAO.getAttributeValues(),
                uniformBlocks: {
                    worldViewBlock: {
                        block: bindings.blocks.worldViewBlock,
                        list: this.worldViewUBO.getUniformValues()
                    },
                    lightsBlock: {
                        block: bindings.blocks.lightsBlock,
                        list: this.lightsUBO.getUniformValues()
                    },
                    phongBlock: {
                        block: bindings.blocks.phongBlock,
                        list: this.phongUBO.getUniformValues()
                    }
                },
                uniforms: {
                    u_diffuseMap: { value: bindings.textures.albedoMap },
                    u_normalMap: { value: bindings.textures.normalMap }
                }
            };
            return packetValues;
        }
        enableDelta() {
            throw new Error("Method not implemented.");
        }
        disableDelta() {
            throw new Error("Method not implemented.");
        }
        getDeltaPacketValues(bindings) {
            const phongAttributesDelta = this.phongVAO.getDeltaAttributeValues();
            const worldViewDelta = this.worldViewUBO.getDeltaUniformValues();
            const lightsDelta = this.lightsUBO.getDeltaUniformValues();
            const phongDelta = this.phongUBO.getDeltaUniformValues();
            let packetValues = {
                uniformBlocks: {},
                uniforms: {}
            };
            if (phongAttributesDelta) {
                packetValues.attributes = phongAttributesDelta;
            }
            //packetValues.uniformBlocks = {};
            if (worldViewDelta) {
                //packetValues.uniformBlocks = packetValues.uniformBlocks || {};
                packetValues.uniformBlocks.worldViewBlock = {
                    block: bindings.blocks.worldViewBlock,
                    list: worldViewDelta
                };
            }
            if (lightsDelta) {
                //packetValues.uniformBlocks = packetValues.uniformBlocks || {};
                packetValues.uniformBlocks.lightsBlock = {
                    block: bindings.blocks.lightsBlock,
                    list: lightsDelta
                };
            }
            if (phongDelta) {
                //packetValues.uniformBlocks = packetValues.uniformBlocks || {};
                packetValues.uniformBlocks.phongBlock = {
                    block: bindings.blocks.phongBlock,
                    list: phongDelta
                };
            }
            return packetValues;
        }
    }
    exports.MeshPhongPacket = MeshPhongPacket;
});
define("engine/core/systems/RenderingSystem", ["require", "exports", "engine/core/general/System"], function (require, exports, System_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RenderingSystem = void 0;
    class RenderingSystem extends System_2.System {
    }
    exports.RenderingSystem = RenderingSystem;
});
define("engine/editor/attributes/Tooltip", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TooltipAttributeExtension = void 0;
    const statusBarMouseenterListenerKey = '__statusBarMouseenterListener';
    const statusBarMouseleaveListenerKey = '__statusBarMouseleaveListener';
    const TooltipAttributeExtension = {
        attributeName: 'tooltip',
        enable: function (element) {
            const tooltip = element.getAttribute(TooltipAttributeExtension.attributeName);
            const colliderId = element.getAttribute('tooltip-collider');
            const collider = document.getElementById(`#${colliderId}`) || element;
            if (tooltip) {
                const mouseenterListener = () => {
                    if (TooltipAttributeExtension.__statusBar) {
                        TooltipAttributeExtension.__statusBar.innerHTML = tooltip;
                    }
                };
                const mouseleaveListener = () => {
                    if (TooltipAttributeExtension.__statusBar) {
                        TooltipAttributeExtension.__statusBar.innerHTML = '';
                    }
                };
                collider.addEventListener('mouseenter', mouseenterListener, { capture: true });
                collider.addEventListener('mouseleave', mouseleaveListener, { capture: true });
                Object.assign(element, {
                    [statusBarMouseenterListenerKey]: mouseenterListener,
                    [statusBarMouseleaveListenerKey]: mouseleaveListener
                });
            }
        },
        disable: function (element, collider) {
            element.removeAttribute(TooltipAttributeExtension.attributeName);
            if (typeof element[statusBarMouseenterListenerKey] !== 'undefined') {
                collider.removeEventListener('mouseenter', element[statusBarMouseenterListenerKey]);
            }
            if (typeof element[statusBarMouseleaveListenerKey] !== 'undefined') {
                collider.removeEventListener('mouseleave', element[statusBarMouseleaveListenerKey]);
            }
        },
        setStatusBar(statusBar) {
            TooltipAttributeExtension.__statusBar = statusBar;
        },
        __statusBar: null
    };
    exports.TooltipAttributeExtension = TooltipAttributeExtension;
});
define("engine/editor/elements/forms/Snippets", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isSelectElement = exports.isInputElement = exports.setFormState = exports.getFormState = void 0;
    ;
    const getFormState = (form) => {
        const elements = Array.from(form.elements);
        let state = {};
        elements.forEach((element) => {
            if (isInputElement(element)) {
                if (element.type === "radio") {
                    if (!(element.name in state)) {
                        state[element.name] = {
                            type: "radio",
                            nodes: [{
                                    value: element.value,
                                    checked: element.checked
                                }]
                        };
                    }
                    else {
                        const elem = state[element.name];
                        if ("nodes" in elem) {
                            elem.nodes.push({
                                value: element.value,
                                checked: element.checked
                            });
                        }
                    }
                }
                else if (element.type === "checkbox") {
                    state[element.name] = {
                        type: "checkbox",
                        checked: element.checked
                    };
                }
                else {
                    state[element.name] = {
                        value: element.value,
                    };
                }
            }
            else if (isSelectElement(element)) {
                state[element.name] = {
                    value: element.value,
                };
            }
            else if (isTextAreaElement(element)) {
                state[element.name] = {
                    value: element.value,
                };
            }
        });
        return state;
    };
    exports.getFormState = getFormState;
    const setFormState = (form, state) => {
        const elements = Array.from(form.elements);
        const names = Object.keys(state);
        names.forEach((name) => {
            const elemState = state[name];
            if ("type" in elemState) {
                if (elemState.type === "checkbox") {
                    let element = elements.find((elem) => elem.name === name);
                    if (element && isInputElement(element)) {
                        element.checked = elemState.checked;
                    }
                }
                else if (elemState.type === "radio") {
                    elemState.nodes.forEach((radioNode) => {
                        let element = elements.find((elem) => elem.name === name && elem.value === radioNode.value);
                        if (element && isInputElement(element)) {
                            element.checked = radioNode.checked;
                        }
                    });
                }
            }
            else {
                let element = elements.find((elem) => elem.name === name);
                if (element && (isInputElement(element) || isSelectElement(element) || isTextAreaElement(element))) {
                    element.value = elemState.value;
                }
            }
        });
    };
    exports.setFormState = setFormState;
    function isInputElement(elem) {
        return elem.tagName.toLowerCase() === "input";
    }
    exports.isInputElement = isInputElement;
    function isTextAreaElement(elem) {
        return elem.tagName.toLowerCase() === "textarea";
    }
    function isSelectElement(elem) {
        return elem.tagName.toLowerCase() === "select";
    }
    exports.isSelectElement = isSelectElement;
});
define("engine/editor/elements/lib/builtins/inputs/CallbackedInput", ["require", "exports", "engine/editor/elements/HTMLElement"], function (require, exports, HTMLElement_31) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CallbackedInputElement = void 0;
    let CallbackedInputElement = /** @class */ (() => {
        let CallbackedInputElement = class CallbackedInputElement extends HTMLInputElement {
            constructor() {
                super();
            }
            attributeChangedCallback(name, oldValue, newValue) {
                if (name === 'checked') {
                    console.log(newValue);
                }
            }
            set checked(val) {
                super.checked = val;
                console.log('checked changed');
            }
            get checked() {
                return super.checked;
            }
        };
        CallbackedInputElement = __decorate([
            HTMLElement_31.RegisterCustomHTMLElement({
                name: 'callbacked-input',
                options: {
                    extends: 'input'
                },
                observedAttributes: ['checked']
            })
        ], CallbackedInputElement);
        return CallbackedInputElement;
    })();
    exports.CallbackedInputElement = CallbackedInputElement;
});
define("engine/editor/elements/lib/builtins/inputs/NumberInput", ["require", "exports", "engine/editor/elements/HTMLElement"], function (require, exports, HTMLElement_32) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NumberInputElement = void 0;
    let NumberInputElement = /** @class */ (() => {
        let NumberInputElement = class NumberInputElement extends HTMLInputElement {
            constructor() {
                super();
                this.addEventListener('input', (event) => {
                    if (this.value !== '') {
                        if (this.isValueValid(this.value)) {
                            this.cache = this.value;
                        }
                        else {
                            this.value = this.cache;
                        }
                    }
                }, { capture: true });
                this.addEventListener('focusin', (event) => {
                    this.select();
                }, { capture: true });
                this.addEventListener('focusout', (event) => {
                    this.value = this.cache = this.parseValue(this.value);
                }, { capture: true });
            }
            isValueValid(value) {
                let match = value.match(/([+-]?[0-9]*([.][0-9]*)?)|([+-]?[.][0-9]*)/);
                return (match !== null && match[1] === value);
            }
            parseValue(value) {
                let parsedValue = parseFloat(value);
                return Number.isNaN(parsedValue) ? '0' : parsedValue.toString();
            }
            connectedCallback() {
                this.cache = this.value = this.parseValue(this.value);
            }
        };
        NumberInputElement = __decorate([
            HTMLElement_32.RegisterCustomHTMLElement({
                name: 'number-input',
                options: {
                    extends: 'input'
                }
            }),
            HTMLElement_32.GenerateAttributeAccessors([
                { name: 'cache' }
            ])
        ], NumberInputElement);
        return NumberInputElement;
    })();
    exports.NumberInputElement = NumberInputElement;
});
define("engine/editor/elements/lib/containers/toolbar/Toolbar", ["require", "exports", "engine/editor/elements/HTMLElement"], function (require, exports, HTMLElement_33) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isHTMLEMenuBarElement = exports.HTMLEMenuBarElement = void 0;
    function isHTMLEMenuBarElement(elem) {
        return elem.tagName.toLowerCase() === "e-menubar";
    }
    exports.isHTMLEMenuBarElement = isHTMLEMenuBarElement;
    let HTMLEMenuBarElement = /** @class */ (() => {
        let HTMLEMenuBarElement = class HTMLEMenuBarElement extends HTMLElement {
        };
        HTMLEMenuBarElement = __decorate([
            HTMLElement_33.RegisterCustomHTMLElement({
                name: "e-menubar",
                observedAttributes: ["active"]
            }),
            HTMLElement_33.GenerateAttributeAccessors([
                { name: "name", type: "string" },
                { name: "active", type: "boolean" },
            ])
        ], HTMLEMenuBarElement);
        return HTMLEMenuBarElement;
    })();
    exports.HTMLEMenuBarElement = HTMLEMenuBarElement;
});
define("engine/editor/elements/lib/containers/toolbar/ToolbarItem", ["require", "exports", "engine/editor/elements/HTMLElement"], function (require, exports, HTMLElement_34) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isHTMLEMenuItemElement = exports.HTMLEMenuItemElement = void 0;
    function isHTMLEMenuItemElement(elem) {
        return elem.tagName.toLowerCase() === "e-menuitem";
    }
    exports.isHTMLEMenuItemElement = isHTMLEMenuItemElement;
    let HTMLEMenuItemElement = /** @class */ (() => {
        let HTMLEMenuItemElement = class HTMLEMenuItemElement extends HTMLElement {
        };
        HTMLEMenuItemElement = __decorate([
            HTMLElement_34.RegisterCustomHTMLElement({
                name: "e-menuitem",
                observedAttributes: ["icon", "label", "checked"]
            }),
            HTMLElement_34.GenerateAttributeAccessors([
                { name: "name", type: "string" },
                { name: "label", type: "string" },
                { name: "icon", type: "string" },
                { name: "type", type: "string" },
                { name: "disabled", type: "boolean" },
                { name: "checked", type: "boolean" },
                { name: "value", type: "string" },
            ])
        ], HTMLEMenuItemElement);
        return HTMLEMenuItemElement;
    })();
    exports.HTMLEMenuItemElement = HTMLEMenuItemElement;
});
define("engine/editor/elements/lib/containers/toolbar/ToolbarItemGroup", ["require", "exports", "engine/editor/elements/HTMLElement"], function (require, exports, HTMLElement_35) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HTMLEMenuItemGroupElement = exports.isHTMLEMenuItemGroupElement = void 0;
    function isHTMLEMenuItemGroupElement(elem) {
        return elem.tagName.toLowerCase() === "e-menuitemgroup";
    }
    exports.isHTMLEMenuItemGroupElement = isHTMLEMenuItemGroupElement;
    let HTMLEMenuItemGroupElement = /** @class */ (() => {
        let HTMLEMenuItemGroupElement = class HTMLEMenuItemGroupElement extends HTMLElement {
        };
        HTMLEMenuItemGroupElement = __decorate([
            HTMLElement_35.RegisterCustomHTMLElement({
                name: "e-menuitemgroup",
                observedAttributes: ["label", "active"]
            }),
            HTMLElement_35.GenerateAttributeAccessors([
                { name: "active", type: "boolean" },
                { name: "label", type: "string" },
                { name: "type", type: "string" },
                { name: "name", type: "string" },
                { name: "rows", type: "number" },
                { name: "cells", type: "number" },
            ])
        ], HTMLEMenuItemGroupElement);
        return HTMLEMenuItemGroupElement;
    })();
    exports.HTMLEMenuItemGroupElement = HTMLEMenuItemGroupElement;
});
define("engine/editor/elements/lib/containers/windows/Window", ["require", "exports", "engine/editor/elements/HTMLElement"], function (require, exports, HTMLElement_36) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WindowElement = void 0;
    let WindowElement = /** @class */ (() => {
        let WindowElement = class WindowElement extends HTMLElement {
            constructor() {
                super();
                HTMLElement_36.bindShadowRoot(this, /*template*/ `
            <link rel="stylesheet" href="css/default.css"/>
            <style>
                :host {
                    position: absolute;
                    display: block;
                    contain: content;
                    z-index: 10;

                    width: auto;
                    height: auto;

                    box-shadow: 0 2px 4px -1px rgba(0, 0, 0, .2), 0 4px 5px 0 rgba(0, 0, 0, .14), 0 1px 10px 0 rgba(0, 0, 0, .12);
                }

                #header {
                    display: flex;
                    flex-wrap: nowrap;
                }

                #title {
                    flex: 1;
                    display: inline-block;
                }

                #header > *:not(#title) {
                    flex: 0;
                }

                #content {
                    border-top: 1px solid white;
                }

                :host([toggled]) #content {
                    display: none;
                }
            </style>
            <div>
                <div id="header">
                    <span id="title"></span>
                    <e-stateful-button id="toggle">
                        <e-button-state name='minimize' icon='assets/editor/icons/material/rounded/24dp/remove.svg' next='maximize' initial></e-button-state>
                        <e-button-state name='maximize' icon='assets/editor/icons/material/rounded/24dp/add.svg' next='minimize'></e-button-state>
                    </e-stateful-button>
                    <e-stateful-button id="close">
                        <e-button-state name='close' icon='assets/editor/icons/material/rounded/24dp/close.svg' initial></e-button-state>
                    </e-stateful-button>
                </div>
                <div id="content">
                    <slot></slot>
                </div>
            </div>
        `);
                const header = this.shadowRoot.getElementById('header');
                header.addEventListener('pointerdown', () => {
                    document.addEventListener('pointermove', onPointerMouve);
                });
                const onPointerMouve = (event) => {
                    const pos = this.getBoundingClientRect();
                    this.style.top = `${pos.y + event.movementY}px`;
                    this.style.left = `${pos.x + event.movementX}px`;
                };
                header.addEventListener('pointerup', () => {
                    document.removeEventListener('pointermove', onPointerMouve);
                });
                this.shadowRoot.getElementById('close').addEventListener('click', () => {
                    this.parentElement.removeChild(this);
                });
                this.shadowRoot.getElementById('toggle').addEventListener('click', () => {
                    this.toggled = !this.toggled;
                });
            }
            connectedCallback() {
                this.shadowRoot.getElementById('title').innerHTML = this.title;
            }
        };
        WindowElement = __decorate([
            HTMLElement_36.RegisterCustomHTMLElement({
                name: 'e-window'
            }),
            HTMLElement_36.GenerateAttributeAccessors([
                { name: 'title', type: 'string' },
                { name: 'tooltip', type: 'string' },
                { name: 'toggled', type: 'boolean' }
            ])
        ], WindowElement);
        return WindowElement;
    })();
    exports.WindowElement = WindowElement;
});
define("engine/editor/elements/lib/controls/ComboBox", ["require", "exports", "engine/editor/elements/HTMLElement"], function (require, exports, HTMLElement_37) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ComboBoxElement = void 0;
    let ComboBoxElement = /** @class */ (() => {
        let ComboBoxElement = class ComboBoxElement extends HTMLElement {
            constructor() {
                super();
                HTMLElement_37.bindShadowRoot(this, /*template*/ `
            <link rel="stylesheet" href="css/default.css"/>
            <style>
                :host {
                    display: block;
                }

                ::slotted([slot='select']) {
                    -webkit-appearance: none;
                }
            </style>
            <slot id="select" name="select"></slot>
        `);
            }
            connectedCallback() {
                this.tabIndex = this.tabIndex;
            }
        };
        ComboBoxElement = __decorate([
            HTMLElement_37.RegisterCustomHTMLElement({
                name: 'e-combobox'
            }),
            HTMLElement_37.GenerateAttributeAccessors([
                { name: 'value', type: 'number' },
            ])
        ], ComboBoxElement);
        return ComboBoxElement;
    })();
    exports.ComboBoxElement = ComboBoxElement;
});
define("engine/editor/elements/lib/math/Vector3Input", ["require", "exports", "engine/editor/elements/HTMLElement", "engine/libs/maths/algebra/vectors/Vector3", "engine/editor/attributes/Tooltip"], function (require, exports, HTMLElement_38, Vector3_8, Tooltip_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Vector3InputElement = void 0;
    let Vector3InputElement = /** @class */ (() => {
        let Vector3InputElement = class Vector3InputElement extends HTMLElement {
            constructor() {
                super();
                HTMLElement_38.bindShadowRoot(this, /*template*/ `
            <link rel="stylesheet" href="css/theme.css"/>
            <style>
                :host {
                    /*font-size: 1em;*/
                }

                input {
                    padding: var(--container-padding);
                    border-radius: var(--container-border-radius);
        
                    color: var(--theme-on-color);
                    caret-color: var(--theme-on-color);
                    text-align: center;
                    background-color: var(--theme-color-600);
                    width: 32px;
                    border: 1px solid transparent;
                    outline: 0;
                }
        
                input::selection {
                    background-color: var(--theme-color-200);
                }
                
                input:focus {
                    border: 1px solid var(--theme-on-color);
                }
            </style>
        
            <span id="label"></span> 
            X <input id="x" is="number-input" type="text" spellcheck="false" value="0"/>
            Y <input id="y" is="number-input" type="text" spellcheck="false" value="0"/>
            Z <input id="z" is="number-input" type="text" spellcheck="false" value="0"/>
        `);
                this.vector = new Vector3_8.Vector3();
                this.shadowRoot.getElementById('x').addEventListener('input', (event) => {
                    this.vector.x = parseFloat(event.target.value) || 0;
                });
                this.shadowRoot.getElementById('y').addEventListener('input', (event) => {
                    this.vector.y = parseFloat(event.target.value) || 0;
                });
                this.shadowRoot.getElementById('z').addEventListener('input', (event) => {
                    this.vector.z = parseFloat(event.target.value) || 0;
                });
                this.shadowRoot.getElementById('label').innerText = this.label;
                this.tooltip = this.label;
                Tooltip_1.TooltipAttributeExtension.enable(this);
            }
            refresh() {
                this.shadowRoot.getElementById('x').value = this.vector.x.toString();
                this.shadowRoot.getElementById('y').value = this.vector.y.toString();
                this.shadowRoot.getElementById('z').value = this.vector.z.toString();
            }
            connectedCallback() {
                this.refresh();
            }
        };
        Vector3InputElement = __decorate([
            HTMLElement_38.RegisterCustomHTMLElement({
                name: 'e-vector3-input'
            }),
            HTMLElement_38.GenerateAttributeAccessors([{ name: 'label' }, { name: 'tooltip' }])
        ], Vector3InputElement);
        return Vector3InputElement;
    })();
    exports.Vector3InputElement = Vector3InputElement;
});
define("engine/editor/elements/lib/misc/LogsFeed", ["require", "exports", "engine/editor/elements/HTMLElement"], function (require, exports, HTMLElement_39) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LogsFeedElement = void 0;
    let LogsFeedElement = /** @class */ (() => {
        let LogsFeedElement = class LogsFeedElement extends HTMLElement {
            constructor() {
                super();
                HTMLElement_39.bindShadowRoot(this, /*template*/ `
            <style>
                p {
                    margin: 0;
                    padding: 4px;
                }
            </style>
        
            <div>
                <p id="feed"></p>
            </div>
        `);
            }
            appendLogMessage(message) {
                this._feedParagraph.innerText += message.concat('\n');
            }
            get _feedParagraph() {
                return this.shadowRoot.querySelector('#feed');
            }
        };
        LogsFeedElement = __decorate([
            HTMLElement_39.RegisterCustomHTMLElement({
                name: 'e-logs-feed',
            })
        ], LogsFeedElement);
        return LogsFeedElement;
    })();
    exports.LogsFeedElement = LogsFeedElement;
});
define("engine/editor/templates/table/TableTemplate", ["require", "exports", "engine/editor/elements/HTMLElement"], function (require, exports, HTMLElement_40) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HTMLTableTemplate = void 0;
    const HTMLTableTemplate = (desc) => {
        const thead = HTMLElement_40.HTMLElementConstructor("thead", {
            children: [
                HTMLElement_40.HTMLElementConstructor("tr", {
                    props: {
                        id: desc.id,
                        className: desc.className,
                    },
                    children: desc.headerCells.map((cell) => {
                        return HTMLElement_40.HTMLElementConstructor("th", {
                            props: {
                                scope: "col"
                            },
                            children: [
                                cell
                            ]
                        });
                    })
                })
            ]
        });
        const tbody = HTMLElement_40.HTMLElementConstructor("tbody", {
            children: desc.bodyCells.map((row) => {
                return HTMLElement_40.HTMLElementConstructor("tr", {
                    props: {
                        id: desc.id,
                        className: desc.className,
                    },
                    children: row.map((cell) => {
                        if ((typeof cell === "object") && !(cell instanceof Node) && ("type" in cell)) {
                            switch (cell.type) {
                                case "data":
                                default:
                                    return HTMLElement_40.HTMLElementConstructor("td", {
                                        children: [
                                            cell.content
                                        ]
                                    });
                                case "header":
                                    return HTMLElement_40.HTMLElementConstructor("th", {
                                        props: {
                                            scope: "row"
                                        },
                                        children: [
                                            cell.content
                                        ]
                                    });
                            }
                        }
                        else {
                            return HTMLElement_40.HTMLElementConstructor("td", {
                                children: [
                                    cell
                                ]
                            });
                        }
                    })
                });
            })
        });
        const tfoot = HTMLElement_40.HTMLElementConstructor("tfoot", {
            children: [
                HTMLElement_40.HTMLElementConstructor("tr", {
                    props: {
                        id: desc.id,
                        className: desc.className,
                    },
                    children: desc.footerCells.map((cell) => {
                        if ((typeof cell === "object") && !(cell instanceof Node) && ("type" in cell)) {
                            switch (cell.type) {
                                case "data":
                                default:
                                    return HTMLElement_40.HTMLElementConstructor("td", {
                                        children: [
                                            cell.content
                                        ]
                                    });
                                case "header":
                                    return HTMLElement_40.HTMLElementConstructor("th", {
                                        props: {
                                            scope: "row"
                                        },
                                        children: [
                                            cell.content
                                        ]
                                    });
                            }
                        }
                        else {
                            return HTMLElement_40.HTMLElementConstructor("td", {
                                children: [
                                    cell
                                ]
                            });
                        }
                    })
                })
            ]
        });
        const table = HTMLElement_40.HTMLElementConstructor("table", {
            props: {
                id: desc.id,
                className: desc.className,
            },
            children: [
                thead,
                tbody,
                tfoot
            ]
        });
        return table;
    };
    exports.HTMLTableTemplate = HTMLTableTemplate;
});
define("engine/extras/profiler/Profiler", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Profiler = void 0;
    class Profiler {
    }
    exports.Profiler = Profiler;
});
define("engine/libs/maths/algebra/matrices/Matrix2", ["require", "exports", "engine/libs/maths/MathError", "engine/libs/patterns/injectors/Injector", "engine/libs/patterns/pools/StackPool"], function (require, exports, MathError_7, Injector_12, StackPool_9) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Matrix2Pool = exports.Matrix2Injector = exports.Matrix2Base = exports.Matrix2 = void 0;
    class Matrix2Base {
        constructor(values) {
            this._array = (values) ? [
                values[0], values[1],
                values[2], values[3],
            ] : [
                0, 0,
                0, 0
            ];
        }
        get array() {
            return this._array;
        }
        get values() {
            return [
                this._array[0], this._array[1],
                this._array[2], this._array[3]
            ];
        }
        set values(values) {
            this._array[0] = values[0];
            this._array[1] = values[1];
            this._array[2] = values[2];
            this._array[3] = values[3];
        }
        get row1() {
            return [
                this._array[0],
                this._array[1]
            ];
        }
        set row1(row1) {
            this._array[0] = row1[0];
            this._array[1] = row1[1];
        }
        get row2() {
            return [
                this._array[2],
                this._array[3]
            ];
        }
        set row2(row2) {
            this._array[2] = row2[0];
            this._array[3] = row2[1];
        }
        get col1() {
            return [
                this._array[0],
                this._array[2]
            ];
        }
        set col1(col1) {
            this._array[0] = col1[0];
            this._array[2] = col1[1];
        }
        get col2() {
            return [
                this._array[1],
                this._array[3]
            ];
        }
        set col2(col2) {
            this._array[1] = col2[0];
            this._array[3] = col2[1];
        }
        get m11() {
            return this._array[0];
        }
        set m11(m11) {
            this._array[0] = m11;
        }
        get m12() {
            return this._array[1];
        }
        set m12(m12) {
            this._array[1] = m12;
        }
        get m21() {
            return this._array[4];
        }
        set m21(m21) {
            this._array[4] = m21;
        }
        get m22() {
            return this._array[5];
        }
        set m22(m22) {
            this._array[5] = m22;
        }
        setArray(array) {
            if (array.length < 16) {
                throw new MathError_7.MathError(`Array must be of length 16 at least.`);
            }
            this._array = array;
            return this;
        }
        setValues(m) {
            const o = this._array;
            o[0] = m[0];
            o[1] = m[1];
            o[2] = m[2];
            o[3] = m[3];
            return this;
        }
        getRow(idx) {
            const m = this._array;
            const offset = idx * 2;
            return [
                m[offset],
                m[offset + 1]
            ];
        }
        setRow(idx, row) {
            const o = this._array;
            const offset = idx * 2;
            o[offset] = row[0];
            o[offset + 1] = row[1];
            return this;
        }
        setCol(idx, col) {
            const o = this._array;
            o[idx] = col[0];
            o[2 + idx] = col[1];
            return this;
        }
        getCol(idx) {
            const m = this._array;
            return [
                m[idx],
                m[2 + idx]
            ];
        }
        getAt(idx) {
            return this._array[idx];
        }
        setAt(idx, val) {
            this._array[idx] = val;
            return this;
        }
        getEntry(row, col) {
            return this._array[2 * row + col];
        }
        setEntry(row, col, val) {
            this._array[2 * row + col] = val;
            return this;
        }
        equals(mat) {
            const o = this._array;
            const m = mat.array;
            return o[0] === m[0]
                && o[1] === m[1]
                && o[2] === m[2]
                && o[3] === m[3];
        }
        getValues() {
            const m = this._array;
            return [
                m[0], m[1],
                m[2], m[3]
            ];
        }
        copy(mat) {
            const o = this._array;
            const m = mat.array;
            o[0] = m[0];
            o[1] = m[1];
            o[2] = m[2];
            o[3] = m[3];
            return this;
        }
        clone() {
            return new Matrix2Base(this.values);
        }
        det() {
            const o = this._array;
            return o[0] * o[3] - o[1] * o[2];
        }
        trace() {
            const o = this._array;
            return o[0] + o[3];
        }
        setIdentity() {
            const o = this._array;
            o[0] = 1;
            o[1] = 0;
            o[2] = 0;
            o[3] = 1;
            return this;
        }
        setZeros() {
            const o = this._array;
            o[0] = 0;
            o[1] = 0;
            o[2] = 0;
            o[3] = 0;
            return this;
        }
        negate() {
            const o = this._array;
            o[0] = -o[0];
            o[1] = -o[1];
            o[2] = -o[2];
            o[3] = -o[3];
            return this;
        }
        transpose() {
            const o = this._array;
            let t;
            t = o[1];
            o[1] = o[3];
            o[3] = t;
            return this;
        }
        invert() {
            const o = this._array;
            const d = 1.0 / (o[0] * o[3] - o[1] * o[2]);
            if (d == 0) {
                throw new MathError_7.MathError(`Matrix is not invertible.`);
            }
            o[0] = d * o[2];
            o[1] = -d * o[1];
            o[2] = -d * o[3];
            o[3] = d * o[0];
            return this;
        }
        add(mat) {
            const o = this._array;
            const m = mat.array;
            o[0] = o[0] + m[0];
            o[1] = o[1] + m[1];
            o[2] = o[2] + m[2];
            o[3] = o[3] + m[3];
            return this;
        }
        sub(mat) {
            const o = this._array;
            const m = mat.array;
            o[0] = o[0] - m[0];
            o[1] = o[1] - m[1];
            o[2] = o[2] - m[2];
            o[3] = o[3] - m[3];
            return this;
        }
        mult(mat) {
            const o = this._array;
            const m = mat.array;
            const a00 = o[0 * 3 + 0];
            const a01 = o[0 * 3 + 1];
            const a10 = o[1 * 3 + 0];
            const a11 = o[1 * 3 + 1];
            const b00 = m[0 * 3 + 0];
            const b01 = m[0 * 3 + 1];
            const b10 = m[1 * 3 + 0];
            const b11 = m[1 * 3 + 1];
            o[0] = b00 * a00 + b01 * a10;
            o[1] = b00 * a01 + b01 * a11;
            o[3] = b10 * a00 + b11 * a10;
            o[4] = b10 * a01 + b11 * a11;
            return this;
        }
        multScalar(k) {
            const o = this._array;
            o[0] = o[0] * k;
            o[1] = o[1] * k;
            o[2] = o[2] * k;
            o[3] = o[3] * k;
            return this;
        }
        writeIntoArray(out, offset = 0) {
            const m = this._array;
            out[offset] = m[0];
            out[offset + 1] = m[1];
            out[offset + 2] = m[2];
            out[offset + 3] = m[3];
        }
        readFromArray(arr, offset = 0) {
            const o = this._array;
            o[0] = arr[offset];
            o[1] = arr[offset + 1];
            o[2] = arr[offset + 2];
            o[3] = arr[offset + 3];
            return this;
        }
        solve(vecB) {
            const a = this._array;
            const a11 = a[0];
            const a12 = a[1];
            const a21 = a[2];
            const a22 = a[3];
            const bx = vecB.x;
            const by = vecB.y;
            let det = a11 * a22 - a12 * a21;
            if (det != 0.0) {
                det = 1.0 / det;
            }
            const x = det * (a22 * bx - a12 * by);
            const y = det * (a11 * by - a21 * bx);
            return [
                x, y
            ];
        }
    }
    exports.Matrix2Base = Matrix2Base;
    var Matrix2 = Matrix2Base;
    exports.Matrix2 = Matrix2;
    const Matrix2Pool = new StackPool_9.StackPool(Matrix2Base);
    exports.Matrix2Pool = Matrix2Pool;
    const Matrix2Injector = new Injector_12.Injector({
        defaultCtor: Matrix2Base,
        onDefaultOverride: (ctor) => {
            exports.Matrix2 = Matrix2 = ctor;
        }
    });
    exports.Matrix2Injector = Matrix2Injector;
});
define("engine/libs/maths/calculus/interpolation/Interpolant", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Interpolant = void 0;
    class Interpolant {
    }
    exports.Interpolant = Interpolant;
});
define("engine/libs/maths/extensions/observables/ObservableVector4", ["require", "exports", "engine/libs/patterns/messaging/brokers/SingleTopicMessageBroker"], function (require, exports, SingleTopicMessageBroker_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ObservableVector4Base = exports.ObservableVector4 = void 0;
    class ObservableVector4Base {
        constructor(internal, broker) {
            this.internal = internal;
            this.changes = Object.assign(broker || new SingleTopicMessageBroker_3.SingleTopicMessageBroker(), {
                enabled: false
            });
        }
        get array() {
            return this.internal.array;
        }
        get values() {
            return this.internal.values;
        }
        set values(values) {
            this.internal.values = values;
            if (this.changes.enabled) {
                this.changes.publish();
            }
        }
        get x() {
            return this.internal.x;
        }
        set x(x) {
            this.internal.x = x;
            if (this.changes.enabled) {
                this.changes.publish();
            }
        }
        get y() {
            return this.internal.y;
        }
        set y(y) {
            this.internal.y = y;
            if (this.changes.enabled) {
                this.changes.publish();
            }
        }
        get z() {
            return this.internal.z;
        }
        set z(z) {
            this.internal.z = z;
            if (this.changes.enabled) {
                this.changes.publish();
            }
        }
        get w() {
            return this.internal.w;
        }
        set w(w) {
            this.internal.w = w;
            if (this.changes.enabled) {
                this.changes.publish();
            }
        }
        setArray(array) {
            this.internal.setArray(array);
            return this;
        }
        setValues(v) {
            this.internal.setValues(v);
            return this;
        }
        copy(vec) {
            this.internal.copy(vec);
            return this;
        }
        clone() {
            return new ObservableVector4(this.internal.clone());
        }
        equals(vec) {
            return this.internal.equals(vec);
        }
        setZeros() {
            return this.internal.setZeros();
        }
        add(vec) {
            return this.internal.add(vec);
        }
        addScalar(k) {
            return this.internal.addScalar(k);
        }
        sub(vec) {
            return this.internal.sub(vec);
        }
        lerp(vec, t) {
            return this.internal.lerp(vec, t);
        }
        clamp(min, max) {
            return this.internal.clamp(min, max);
        }
        multScalar(k) {
            return this.internal.multScalar(k);
        }
        dot(vec) {
            return this.internal.dot(vec);
        }
        len() {
            return this.internal.len();
        }
        lenSq() {
            return this.internal.lenSq();
        }
        dist(vec) {
            return this.internal.dist(vec);
        }
        distSq(vec) {
            return this.internal.distSq(vec);
        }
        normalize() {
            return this.internal.normalize();
        }
        negate() {
            return this.internal.negate();
        }
        mult(vec) {
            return this.internal.mult(vec);
        }
        addScaled(vec, k) {
            return this.internal.addScaled(vec, k);
        }
        writeIntoArray(out, offset = 0) {
            return this.internal.writeIntoArray(out, offset);
        }
        readFromArray(arr, offset = 0) {
            return this.internal.readFromArray(arr, offset);
        }
    }
    exports.ObservableVector4Base = ObservableVector4Base;
    const ObservableVector4 = ObservableVector4Base;
    exports.ObservableVector4 = ObservableVector4;
});
define("engine/libs/maths/extensions/pools/Matrix3Pools", ["require", "exports", "engine/libs/maths/algebra/matrices/Matrix3", "engine/libs/patterns/pools/StackPool"], function (require, exports, Matrix3_1, StackPool_10) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Matrix3Pool = void 0;
    const Matrix3Pool = new StackPool_10.StackPool(Matrix3_1.Matrix3Base);
    exports.Matrix3Pool = Matrix3Pool;
});
define("engine/libs/maths/extensions/pools/Vector4Pools", ["require", "exports", "engine/libs/maths/algebra/vectors/Vector4", "engine/libs/patterns/pools/StackPool"], function (require, exports, Vector4_1, StackPool_11) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Vector4Pool = void 0;
    const Vector4Pool = new StackPool_11.StackPool(Vector4_1.Vector4Base);
    exports.Vector4Pool = Vector4Pool;
});
define("engine/libs/maths/extensions/pools/lists/Vector2LisPools", ["require", "exports", "engine/libs/maths/extensions/lists/Vector2List", "engine/libs/patterns/pools/StackPool"], function (require, exports, Vector2List_2, StackPool_12) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Vector2ListPool = void 0;
    const Vector2ListPool = new StackPool_12.StackPool(Vector2List_2.Vector2ListBase);
    exports.Vector2ListPool = Vector2ListPool;
});
define("engine/libs/maths/extensions/typed/TypedMatrix4", ["require", "exports", "engine/libs/maths/algebra/matrices/Matrix4", "engine/libs/maths/MathError"], function (require, exports, Matrix4_7, MathError_8) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TypedMatrix4Base = exports.TypedMatrix4 = void 0;
    class TypedMatrix4Base extends Matrix4_7.Matrix4Base {
        constructor(type, values) {
            super();
            const ctor = (type || Float64Array);
            this._array = values ? new ctor(values) : new ctor(16);
        }
        get array() {
            return this._array;
        }
        setArray(typedArray) {
            if (typedArray.length < 16) {
                throw new MathError_8.MathError(`Array must be of length 16 at least.`);
            }
            this._array = typedArray;
            return this;
        }
    }
    exports.TypedMatrix4Base = TypedMatrix4Base;
    const TypedMatrix4 = TypedMatrix4Base;
    exports.TypedMatrix4 = TypedMatrix4;
});
define("engine/libs/maths/extensions/typed/TypedVector3", ["require", "exports", "engine/libs/maths/algebra/vectors/Vector3", "engine/libs/maths/MathError"], function (require, exports, Vector3_9, MathError_9) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TypedVector3Base = exports.TypedVector3 = void 0;
    class TypedVector3Base extends Vector3_9.Vector3Base {
        constructor(type, values) {
            super();
            const ctor = (type || Float64Array);
            this._array = values ? new ctor(values) : new ctor(3);
        }
        get array() {
            return this._array;
        }
        setArray(typedArray) {
            if (typedArray.length < 3) {
                throw new MathError_9.MathError(`Array must be of length 3 at least.`);
            }
            this._array = typedArray;
            return this;
        }
    }
    exports.TypedVector3Base = TypedVector3Base;
    const TypedVector3 = TypedVector3Base;
    exports.TypedVector3 = TypedVector3;
});
define("engine/libs/maths/geometry/primitives/Quad", ["require", "exports", "engine/libs/maths/algebra/vectors/Vector3", "engine/libs/patterns/injectors/Injector"], function (require, exports, Vector3_10, Injector_13) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.QuadBase = exports.QuadInjector = exports.Quad = void 0;
    class QuadBase {
        constructor(point1, point2, point3, point4) {
            this._point1 = point1 || new Vector3_10.Vector3([0, 0, 0]);
            this._point2 = point2 || new Vector3_10.Vector3([0, 0, 0]);
            this._point3 = point3 || new Vector3_10.Vector3([0, 0, 0]);
            this._point4 = point4 || new Vector3_10.Vector3([0, 0, 0]);
        }
        get point1() {
            return this._point1;
        }
        set point1(point1) {
            this._point1 = point1;
        }
        get point2() {
            return this._point2;
        }
        set point2(point2) {
            this._point2 = point2;
        }
        get point3() {
            return this._point3;
        }
        set point3(point3) {
            this._point3 = point3;
        }
        get point4() {
            return this._point4;
        }
        set point4(point4) {
            this._point4 = point4;
        }
        set(point1, point2, point3, point4) {
            this._point1.copy(point1);
            this._point2.copy(point2);
            this._point3.copy(point3);
            this._point4.copy(point4);
            return this;
        }
        clone() {
            return new QuadBase().copy(this);
        }
        copy(quad) {
            this._point1 = quad._point1;
            this._point2 = quad._point2;
            this._point3 = quad._point3;
            this._point4 = quad._point4;
            return this;
        }
        translate(vec) {
            this._point1.add(vec);
            this._point2.add(vec);
            this._point3.add(vec);
            this._point4.add(vec);
        }
        transform(mat) {
            this._point1.setValues(mat.transformDirection(this._point1));
            this._point2.setValues(mat.transformDirection(this._point2));
            this._point3.setValues(mat.transformDirection(this._point3));
            this._point4.setValues(mat.transformDirection(this._point4));
        }
        copyTriangles(triangle1, triangle2) {
            triangle1.set(this._point1, this._point2, this._point3);
            triangle2.set(this._point1, this._point4, this._point3);
        }
    }
    exports.QuadBase = QuadBase;
    var Quad = QuadBase;
    exports.Quad = Quad;
    const QuadInjector = new Injector_13.Injector({
        defaultCtor: QuadBase,
        onDefaultOverride: (ctor) => {
            exports.Quad = Quad = ctor;
        }
    });
    exports.QuadInjector = QuadInjector;
});
define("engine/libs/maths/geometry/primitives/Ray", ["require", "exports", "engine/libs/maths/algebra/vectors/Vector3", "engine/libs/patterns/injectors/Injector", "engine/libs/maths/extensions/pools/Vector3Pools"], function (require, exports, Vector3_11, Injector_14, Vector3Pools_7) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RayBase = exports.RayInjector = exports.Ray = void 0;
    class RayBase {
        constructor(origin, direction) {
            this._origin = origin || new Vector3_11.Vector3([0, 0, 0]);
            this._direction = direction || new Vector3_11.Vector3([0, 0, 0]);
        }
        get origin() {
            return this._origin;
        }
        set origin(origin) {
            this._origin = origin;
        }
        get direction() {
            return this._direction;
        }
        set direction(direction) {
            this._direction = direction;
        }
        set(origin, direction) {
            this._origin.copy(origin);
            this._direction.copy(direction);
            return this;
        }
        equals(ray) {
            return ray._origin.equals(this._origin) && ray._direction.equals(this._direction);
        }
        copy(ray) {
            this._origin.copy(ray._origin);
            this._direction.copy(ray._direction);
            return this;
        }
        clone() {
            return new RayBase().set(this._origin, this._direction);
        }
        pointAt(dist, out) {
            return out.copy(this._direction).multScalar(dist).add(this._origin);
        }
        lookAt(vec) {
            this._direction.copy(vec).sub(this._origin).normalize();
            return this;
        }
        closestPointTo(point, out) {
            out.copy(point).sub(this._origin);
            const directionDist = out.dot(this._direction);
            if (directionDist < 0) {
                return out.copy(this._origin);
            }
            return out.copy(this._direction).multScalar(directionDist).add(this._origin);
        }
        distToPoint(point) {
            return Math.sqrt(this.distSqToPoint(point));
        }
        distSqToPoint(point) {
            let distSq = 0;
            Vector3Pools_7.Vector3Pool.acquireTemp(1, (temp) => {
                const directionDist = temp.copy(point).sub(this._origin).dot(this._direction);
                if (directionDist < 0) {
                    distSq = this._origin.distSq(point);
                }
                else {
                    temp.copy(this._direction).multScalar(directionDist).add(this._origin);
                    distSq = temp.distSq(point);
                }
            });
            return distSq;
        }
        distToPlane(plane) {
            const denominator = plane.normal.dot(this._direction);
            if (denominator === 0) {
                if (plane.distanceToPoint(this._origin) === 0) {
                    return 0;
                }
                return null;
            }
            const dist = -(this._origin.dot(plane.normal) + plane.constant) / denominator;
            return dist >= 0 ? dist : null;
        }
        intersectsWithSphere(sphere) {
            return this.distSqToPoint(sphere.center) <= (sphere.radius * sphere.radius);
        }
        intersectsWithQuad(quad) {
            let intersects = null;
            Vector3Pools_7.Vector3Pool.acquireTemp(4, (edge1, edge2, q, s) => {
                edge1.copyAndSub(quad.point2, quad.point1);
                edge2.copyAndSub(quad.point3, quad.point1);
                q.copyAndCross(this._direction, edge2);
                let a, f, v, u;
                a = edge1.dot(q);
                if (!(a > -Number.EPSILON && a < Number.EPSILON)) {
                    f = 1 / a;
                    s.copyAndSub(this._origin, quad.point1);
                    u = f * (s.dot(q));
                    if (u >= 0.0) {
                        q.copyAndCross(s, edge1);
                        v = f * (this._direction.dot(q));
                        if (!(v < -Number.EPSILON || u + v > 1.0 + Number.EPSILON)) {
                            intersects = f * (edge2.dot(q));
                            return;
                        }
                    }
                }
                edge1.copyAndSub(quad.point1, quad.point4);
                edge2.copyAndSub(quad.point3, quad.point4);
                q.copyAndCross(this._direction, edge2);
                a = edge1.dot(q);
                if (!(a > -Number.EPSILON && a < Number.EPSILON)) {
                    f = 1 / a;
                    s.copy(this._origin).sub(quad.point4);
                    u = f * (s.dot(q));
                    if (u >= 0.0) {
                        q.copyAndCross(s, edge1);
                        v = f * (this._direction.dot(q));
                        if (!(v < -Number.EPSILON || u + v > 1.0 + Number.EPSILON)) {
                            intersects = f * (edge2.dot(q));
                            return;
                        }
                    }
                }
            });
            return intersects;
        }
        /**
         * Möller–Trumbore intersection algorithm
         */
        intersectsWithTriangle(triangle) {
            let intersects = null;
            Vector3Pools_7.Vector3Pool.acquireTemp(4, (edge1, edge2, q, s) => {
                edge1.copyAndSub(triangle.point2, triangle.point1);
                edge2.copyAndSub(triangle.point3, triangle.point1);
                q.copyAndCross(this._direction, edge2);
                let a, f, u, v;
                a = edge2.dot(q);
                if (a > -Number.EPSILON && a < Number.EPSILON) {
                    return;
                }
                f = 1 / a;
                s.copyAndSub(this._origin, triangle.point1);
                u = f * (s.dot(q));
                if (u < 0.0) {
                    return;
                }
                q.copyAndCross(s, edge1);
                v = f * (this._direction.dot(q));
                if (v < -Number.EPSILON || u + v > 1.0 + Number.EPSILON) {
                    return;
                }
                intersects = f * (edge2.dot(q));
            });
            return intersects;
        }
        intersectsWithPlane(plane) {
            const distToPoint = plane.distanceToPoint(this._origin);
            if (distToPoint === 0) {
                return true;
            }
            const denominator = plane.normal.dot(this._direction);
            if (denominator * distToPoint < 0) {
                return true;
            }
            return false;
        }
        intersectsWithBox(box) {
            let intersects = false;
            Vector3Pools_7.Vector3Pool.acquireTemp(1, (temp) => {
                intersects = this.intersectionWithBox(box, temp) !== null;
            });
            return intersects;
        }
        intersectionWithSphere(sphere, out) {
            out.copyAndSub(sphere.center, this._origin);
            const tca = out.dot(this._direction);
            const d2 = out.dot(out) - tca * tca;
            const radius2 = sphere.radius * sphere.radius;
            if (d2 > radius2)
                return null;
            const thc = Math.sqrt(radius2 - d2);
            const t0 = tca - thc;
            const t1 = tca + thc;
            if (t0 < 0 && t1 < 0)
                return null;
            if (t0 < 0)
                return this.pointAt(t1, out);
            return this.pointAt(t0, out);
        }
        intersectionWithPlane(plane, out) {
            const dist = this.distToPlane(plane);
            if (dist === null) {
                return null;
            }
            return this.pointAt(dist, out);
        }
        intersectionWithBox(box, out) {
            let distMinX, distMaxX, distMinY, distMaxY, distMinZ, distMaxZ;
            const invDirX = 1 / this._direction.x, invDirY = 1 / this._direction.y, invDirZ = 1 / this._direction.z;
            const origin = this._origin;
            if (invDirX >= 0) {
                distMinX = (box.min.x - origin.x) * invDirX;
                distMaxX = (box.max.x - origin.x) * invDirX;
            }
            else {
                distMinX = (box.max.x - origin.x) * invDirX;
                distMaxX = (box.min.x - origin.x) * invDirX;
            }
            if (invDirY >= 0) {
                distMinY = (box.min.y - origin.y) * invDirY;
                distMaxY = (box.max.y - origin.y) * invDirY;
            }
            else {
                distMinY = (box.max.y - origin.y) * invDirY;
                distMaxY = (box.min.y - origin.y) * invDirY;
            }
            if ((distMinX > distMaxY) || (distMinY > distMaxX))
                return null;
            if (distMinY > distMinX || distMinX !== distMinX)
                distMinX = distMinY;
            if (distMaxY < distMaxX || distMaxX !== distMaxX)
                distMaxX = distMaxY;
            if (invDirZ >= 0) {
                distMinZ = (box.min.z - origin.z) * invDirZ;
                distMaxZ = (box.max.z - origin.z) * invDirZ;
            }
            else {
                distMinZ = (box.max.z - origin.z) * invDirZ;
                distMaxZ = (box.min.z - origin.z) * invDirZ;
            }
            if ((distMinX > distMaxZ) || (distMinZ > distMaxX))
                return null;
            if (distMinX > distMinX || distMinX !== distMinX)
                distMinX = distMinZ;
            if (distMaxX < distMaxX || distMaxX !== distMaxX)
                distMaxX = distMaxZ;
            if (distMaxX < 0)
                return null;
            return this.pointAt(distMinX >= 0 ? distMinX : distMaxX, out);
        }
        transform(mat) {
            this._origin.setValues(mat.transformPoint(this._origin));
            this._direction.setValues(mat.transformDirection(this._direction));
        }
    }
    exports.RayBase = RayBase;
    var Ray = RayBase;
    exports.Ray = Ray;
    const RayInjector = new Injector_14.Injector({
        defaultCtor: RayBase,
        onDefaultOverride: (ctor) => {
            exports.Ray = Ray = ctor;
        }
    });
    exports.RayInjector = RayInjector;
});
define("engine/libs/maths/geometry/space/Space", ["require", "exports", "engine/libs/maths/extensions/typed/TypedVector3"], function (require, exports, TypedVector3_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Space = void 0;
    let Space = /** @class */ (() => {
        class Space {
            constructor() { }
            ;
        }
        Space.xAxis = new TypedVector3_1.TypedVector3(Uint8Array, [1, 0, 0]);
        Space.yAxis = new TypedVector3_1.TypedVector3(Uint8Array, [0, 1, 0]);
        Space.zAxis = new TypedVector3_1.TypedVector3(Uint8Array, [0, 0, 1]);
        Space.right = new TypedVector3_1.TypedVector3(Uint8Array, [1, 0, 0]);
        Space.left = new TypedVector3_1.TypedVector3(Uint8Array, [-1, 0, 0]);
        Space.up = new TypedVector3_1.TypedVector3(Uint8Array, [0, 1, 0]);
        Space.down = new TypedVector3_1.TypedVector3(Uint8Array, [0, -1, 0]);
        Space.forward = new TypedVector3_1.TypedVector3(Uint8Array, [0, 0, 1]);
        Space.backward = new TypedVector3_1.TypedVector3(Uint8Array, [0, 0, -1]);
        return Space;
    })();
    exports.Space = Space;
});
define("engine/libs/maths/statistics/random/RandomNumberGenerator", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RandomNumberGenerator = void 0;
    class RandomNumberGenerator {
        constructor(seed = 12, m = Math.pow(2, 64), a = 6364136223846793005, c = 1442695040888963407) {
            this.m = m;
            this.a = a;
            this.c = c;
            this.xi = this.seed = seed;
            this.i = 0;
        }
        reset() {
            this.xi = this.seed;
            this.i = this.i + 1;
        }
        random() {
            this.xi = (this.a * this.xi + this.c) % this.m;
            this.i = this.i + 1;
            const normalizedXi = this.xi / this.m;
            return normalizedXi;
        }
        randomInRange(min, max) {
            return this.random() * (max - min) + min;
        }
    }
    exports.RandomNumberGenerator = RandomNumberGenerator;
});
define("engine/libs/patterns/flags/options/Options", ["require", "exports", "engine/libs/patterns/flags/Flags"], function (require, exports, Flags_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SimpleOptionsBase = exports.AdvancedOptionsBase = void 0;
    class AdvancedOptionsBase {
        constructor(flags) {
            this._flags = new Flags_2.Flags();
            if (flags) {
                this.set(flags);
            }
        }
        get bits() {
            return this._flags.bits;
        }
        set(options) {
            this._flags.set(options);
            this.handleSet(options);
        }
        unset(options) {
            const isSet = this._flags.get(options);
            this._flags.unset(options);
            this.handleUnset(options);
            return isSet;
        }
        get(options) {
            return this._flags.get(options);
        }
    }
    exports.AdvancedOptionsBase = AdvancedOptionsBase;
    class SimpleOptionsBase {
        constructor(flags) {
            this._flags = new Flags_2.Flags();
            if (flags) {
                this.set(flags);
            }
        }
        get bits() {
            return this._flags.bits;
        }
        set(options) {
            this._flags.set(options);
        }
        unset(options) {
            const isSet = this._flags.get(options);
            this._flags.unset(options);
            return isSet;
        }
        get(options) {
            return this._flags.get(options);
        }
    }
    exports.SimpleOptionsBase = SimpleOptionsBase;
});
define("engine/libs/patterns/messaging/brokers/MessageBroker", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MessageBrokerBase = exports.MessageBroker = void 0;
    ;
    class MessageBrokerBase {
        constructor() {
            this._subscriptions = new Map();
        }
        hasSubscriptions() {
            return this._subscriptions.size > 0;
        }
        subscribe(topic, subscription) {
            let subscriptions = this._subscriptions.get(topic);
            if (typeof subscriptions === 'undefined') {
                this._subscriptions.set(topic, [subscription]);
            }
            else if (subscriptions.indexOf(subscription) < 0) {
                subscriptions.push(subscription);
            }
            return subscription;
        }
        unsubscribe(topic, subscription) {
            let subscriptions = this._subscriptions.get(topic);
            if (typeof subscriptions === 'undefined') {
                return -1;
            }
            const count = subscriptions.length;
            const idx = subscriptions.indexOf(subscription);
            if (idx > -1) {
                if (count > 1) {
                    subscriptions[idx] = subscriptions.pop();
                    return count - 1;
                }
                else {
                    this._subscriptions.delete(topic);
                    return 0;
                }
            }
            return count;
        }
        publish(topic, message) {
            let subscriptions = this._subscriptions.get(topic);
            if (typeof subscriptions !== 'undefined') {
                for (const subscription of subscriptions) {
                    subscription(message);
                }
            }
        }
    }
    exports.MessageBrokerBase = MessageBrokerBase;
    const MessageBroker = MessageBrokerBase;
    exports.MessageBroker = MessageBroker;
});
define("engine/libs/patterns/messaging/brokers/SingleSubscriptionMessageBroker", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SingleSubscriptionMessageBrokerBase = exports.SingleSubscriptionMessageBroker = void 0;
    ;
    class SingleSubscriptionMessageBrokerBase {
        hasSubscription() {
            return (typeof this._subscription !== 'undefined');
        }
        subscribe(subscription) {
            this._subscription = subscription;
            return subscription;
        }
        unsubscribe(subscription) {
            if (this._subscription === subscription) {
                delete this._subscription;
                return 0;
            }
            return -1;
        }
        publish(message) {
            if (typeof this._subscription !== 'undefined') {
                this._subscription(message);
            }
        }
    }
    exports.SingleSubscriptionMessageBrokerBase = SingleSubscriptionMessageBrokerBase;
    const SingleSubscriptionMessageBroker = SingleSubscriptionMessageBrokerBase;
    exports.SingleSubscriptionMessageBroker = SingleSubscriptionMessageBroker;
});
define("engine/libs/structures/trees/Tree", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BaseTree = void 0;
    class BaseTree {
        constructor(root) {
            this.root = root;
        }
        traverse(func) {
            this.root.traverse(func);
        }
    }
    exports.BaseTree = BaseTree;
});
if (!Object.entries) {
    Object.entries = function (obj) {
        var ownProps = Object.keys(obj), i = ownProps.length, resArray = new Array(i); // preallocate the Array
        while (i--)
            resArray[i] = [ownProps[i], obj[ownProps[i]]];
        return resArray;
    };
}
//# sourceMappingURL=merged.js.map