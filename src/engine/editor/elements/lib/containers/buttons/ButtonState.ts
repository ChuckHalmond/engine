import { RegisterCustomHTMLElement, GenerateAttributeAccessors, bindShadowRoot } from "engine/editor/elements/HTMLElement";

export { ButtonStateElement };
export { isStateElement };

function isStateElement(elem: any): elem is ButtonStateElement {
    return !!elem && elem.tagName === 'E-BUTTON-STATE';
}

@RegisterCustomHTMLElement({
    name: 'e-button-state'
})
@GenerateAttributeAccessors([
    {name: 'name', type: 'string'},
    {name: 'next', type: 'string'},
    {name: 'active', type: 'boolean'},
])
class ButtonStateElement extends HTMLElement {

    public name!: string;
    public next!: string;
    public active!: boolean;

    constructor() {
        super();
    }
}