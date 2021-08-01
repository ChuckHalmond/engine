import { isTagElement } from "../HTMLElement";
import { setPropertyFromPath } from "../Snippets";

export { FormDataObject };

class FormDataObject {
    form: HTMLFormElement;

    constructor (form: HTMLFormElement) {
        this.form = form;
    }

    private _resolveElementFullname(element: Element & {name: string}): string {
        let fullname = element.name;
        let parent: Element | null = element.parentElement
        while (parent && parent !== this.form) {
            if (isTagElement("fieldset", parent)) {
                let localname = parent.name;
                if (localname) {
                    fullname = `${localname}.${fullname}`;
                }
            }
            parent = parent?.parentElement;
        }
        return fullname;
    }

    public getData() {
        let elements = Array.from(this.form.elements);
        let data = {};
        console.log(elements);
        elements.forEach((element) => {
            if (isTagElement("input", element) || isTagElement("select", element) || isTagElement("textarea", element)) {
                if (element.name) {
                    let value: any = null;
                    if (isTagElement("input", element)) {
                        if (element.value) {
                            switch (element.type) {
                                case "text":
                                    value = element.value;
                                    break;
                                case "date":
                                case "datetime-local":
                                    value = element.value;
                                    break;
                                case "checkbox":
                                case "radio":
                                    value = (element.value == "on");
                                    break;
                                default:
                                    value = element.value;
                            }
                        }
                    }
                    if (value !== null) {
                        let fullname = this._resolveElementFullname(element);
                        setPropertyFromPath(data, fullname, value);
                    }
                }
            }
        });
        return data;
    }
}