function getPropertyFromPath(src: object, path: string): any {
    const props = path.split(".");
    let obj: {[key: string]: any} | undefined  = src;
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
  
function setPropertyFromPath(src: object, path: string, value: any): object {
    const props = path.split(".");
    let obj: {[key: string]: any} = src;
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
                    obj[prop][index] = {}
                }
                obj = obj[prop][index];
            }
        }
        else {
            if (typeof obj[prop] !== "object") {
                obj[prop] = {}
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

class StructuredFormData {
    form: HTMLFormElement;

    constructor(form: HTMLFormElement) {
        this.form = form;
    }

    // data-scope on parent and name change on children + data-scope-indexed ?
    public getScopedData() {
        let structuredData = {};
        let formData = new FormData(this.form);

        let keys = Array.from(formData.keys());
        keys.forEach((key) => {
            setPropertyFromPath(structuredData, key, formData.get(key));
        });

        return structuredData;
    }

    public setFormElementsNameScope(rootElement: Element, scope: string) {
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
        
    }
}