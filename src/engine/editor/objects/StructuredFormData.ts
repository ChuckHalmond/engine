import { setPropertyFromPath } from "../elements/Snippets";

export { StructuredFormData };

class StructuredFormData {
    form: HTMLFormElement;

    constructor(form: HTMLFormElement) {
        this.form = form;
    }

    public getStructuredFormData(): {} {
        let structuredData = {};

        let formData = new FormData(this.form);
        let keys = Array.from(formData.keys());
        
        keys.forEach((key) => {
            let value = formData.get(key);
            if (value) {
                setPropertyFromPath(structuredData, key, JSON.parse(value.toString()));
            }
        });

        return structuredData;
    }

    /*public setFormElementsNameScope(rootElement: Element, scope: string) {
        let elements = Array.from(rootElement.querySelectorAll<HTMLElement>("*[name]"));
        elements.forEach((element) => {
            let name = element.getAttribute("name");
            element.setAttribute("data-scope", scope);
            element.setAttribute("name", `${scope}.${name}`);
        });
    }

    public resetFormElementsNameScope(rootElement: Element) {
        let elements = Array.from(rootElement.querySelectorAll<HTMLElement>("*[data-scope]"));
        elements.forEach((element) => {
            let name = element.getAttribute("name");
            let scope = element.getAttribute("data-scope") + ".";
            if (name && scope && name.includes(scope)) {
                element.setAttribute("name", name.substring(name.indexOf(scope)));
                element.removeAttribute("data-scope");
            }
        });
    }

    public set() {
        
    }*/
}