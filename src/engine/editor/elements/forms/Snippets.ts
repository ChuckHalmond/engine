import { isTagElement } from "../HTMLElement";

export { FormState };
export { getFormState };
export { setFormState };

interface FormState {
    [name: string]: ({
        type: "checkbox",
        checked: boolean
    } | {
        type: "radio",
        nodes: [{
            value: string,
            checked: boolean
        }]
    } | {
        value: string
    });
};

const getFormState = (form: HTMLFormElement) => {
    const elements = Array.from(form.elements);
    let state: FormState = {};

    elements.forEach((element) => {
        if (isTagElement("input", element)) {
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
        else if (isTagElement("select", element)) {
            state[element.name] = {
                value: element.value,
            };
        }
        else if (isTagElement("textarea", element)) {
            state[element.name] = {
                value: element.value,
            };
        }
    });

    return state;
}

const setFormState = (form: HTMLFormElement, state: FormState) => {
    const elements = Array.from(form.elements) as (HTMLInputElement | HTMLSelectElement)[];
    const names = Object.keys(state);

    names.forEach((name) => {
        const elemState = state[name];
        if ("type" in elemState) {
            if (elemState.type === "checkbox") {
                let element = elements.find((elem) => (elem as any).name === name);
                if (element && isTagElement("input", element)) {
                    element.checked = elemState.checked;
                }
            }
            else if (elemState.type === "radio") {
                elemState.nodes.forEach((radioNode) => {
                    let element = elements.find((elem) => (elem as any).name === name && (elem as any).value === radioNode.value);
                    if (element && isTagElement("input", element)) {
                        element.checked = radioNode.checked;
                    }
                });
            }
        }
        else {
            let element = elements.find((elem) => (elem as any).name === name);
            if (element && (isTagElement("input", element) || isTagElement("select", element) || isTagElement("textarea", element))) {
                element.value = elemState.value;
            }
        }
    });
}