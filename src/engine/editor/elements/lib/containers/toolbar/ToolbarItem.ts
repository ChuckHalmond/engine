import { RegisterCustomHTMLElement, GenerateAttributeAccessors, bindShadowRoot } from "engine/editor/elements/HTMLElement";
export { HTMLEMenuItemElement };
export { isHTMLEMenuItemElement };

function isHTMLEMenuItemElement(elem: Element): elem is HTMLEMenuItemElement {
    return elem.tagName.toLowerCase() === "e-menuitem";
}

@RegisterCustomHTMLElement({
    name: "e-menuitem",
    observedAttributes: ["icon", "label", "checked"]
})
@GenerateAttributeAccessors([
    {name: "name", type: "string"},
    {name: "label", type: "string"},
    {name: "icon", type: "string"},
    {name: "type", type: "string"},
    {name: "disabled", type: "boolean"},
    {name: "checked", type: "boolean"},
    {name: "value", type: "string"},
])

class HTMLEMenuItemElement extends HTMLElement {

    
}
