import { RegisterCustomHTMLElement, GenerateAttributeAccessors, bindShadowRoot } from "engine/editor/elements/HTMLElement";

export { isHTMLEMenuItemGroupElement };
export { HTMLEMenuItemGroupElement };

function isHTMLEMenuItemGroupElement(elem: Element): elem is HTMLEMenuItemGroupElement {
    return elem.tagName.toLowerCase() === "e-menuitemgroup";
}

@RegisterCustomHTMLElement({
    name: "e-menuitemgroup",
    observedAttributes: ["label", "active"]
})
@GenerateAttributeAccessors([
    {name: "active", type: "boolean"},
    {name: "label", type: "string"},
    {name: "type", type: "string"},
    {name: "name", type: "string"},
    {name: "rows", type: "number"},
    {name: "cells", type: "number"},
])
class HTMLEMenuItemGroupElement extends HTMLElement {
}