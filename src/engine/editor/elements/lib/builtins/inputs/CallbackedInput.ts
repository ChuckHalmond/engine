import { RegisterCustomHTMLElement } from "engine/editor/elements/HTMLElement";

export { CallbackedInputElement };

@RegisterCustomHTMLElement({
    name: 'callbacked-input',
    options: {
        extends: 'input'
    },
    observedAttributes: ['checked']
})
class CallbackedInputElement extends HTMLInputElement {

    constructor() {
        super();
    }
    
    public attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
        if (name === 'checked') {
            console.log(newValue);
        }
    }

    public set checked(val: boolean) {
        super.checked = val;
        console.log('checked changed');
    }

    public get checked(): boolean {
        return super.checked;
    }
}