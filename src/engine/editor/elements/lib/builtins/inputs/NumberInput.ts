import { GenerateAttributeAccessors, RegisterCustomHTMLElement } from "engine/editor/elements/HTMLElement";

export { NumberInputElement };

@RegisterCustomHTMLElement({
    name: 'number-input',
    options: {
        extends: 'input'
    }
})
@GenerateAttributeAccessors([
    {name: 'cache'}
])
class NumberInputElement extends HTMLInputElement {

    public cache!: string;
    
    constructor() {
        super();

        this.addEventListener('input',
            (event) => {
                if (this.value !== '') {
                    if (this.isValueValid(this.value)) {
                        this.cache = this.value;
                    }
                    else {
                        this.value = this.cache;
                    }
                }
            }, {capture: true}
        );
        
        this.addEventListener('focusin',
            (event) => {
                this.select();
            }, {capture: true}
        );

        this.addEventListener('focusout',
            (event) => {
                this.value = this.cache = this.parseValue(this.value);
            }, {capture: true}
        );
    }

    public isValueValid(value: string): boolean {
        let match = value.match(/([+-]?[0-9]*([.][0-9]*)?)|([+-]?[.][0-9]*)/);
        return (match !== null && match[1] === value);
    }

    public parseValue(value: string): string {
        let parsedValue = parseFloat(value);
        return Number.isNaN(parsedValue) ? '0' : parsedValue.toString();
    }

    public connectedCallback() {
        this.cache = this.value = this.parseValue(this.value);
    }
}