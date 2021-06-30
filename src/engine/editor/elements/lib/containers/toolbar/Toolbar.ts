import { RegisterCustomHTMLElement, GenerateAttributeAccessors, bindShadowRoot } from "engine/editor/elements/HTMLElement";

export { HTMLEMenuBarElement };
export { isHTMLEMenuBarElement };

function isHTMLEMenuBarElement(elem: Element): elem is HTMLEMenuBarElement {
    return elem.tagName.toLowerCase() === "e-menubar";
}

@RegisterCustomHTMLElement({
    name: "e-menubar",
    observedAttributes: ["active"]
})
@GenerateAttributeAccessors([
    {name: "name", type: "string"},
    {name: "active", type: "boolean"},
])
class HTMLEMenuBarElement extends HTMLElement {

   
}