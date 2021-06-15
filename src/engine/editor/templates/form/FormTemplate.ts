import { CustomOrBultinHTMLElementTagNameMap, HTMLElement, HTMLElementAttributes, HTMLElementDescription } from "engine/editor/elements/HTMLElement";
import { HTMLEMenuItemElement } from "engine/editor/elements/lib/containers/menus/MenuItem";

export { HTMLFormTemplateDescription };
export { HTMLFormTemplate };

type HTMLInputTemplateDescription = Pick<HTMLInputElement, 'name' | 'value' | 'type'> & 
    Partial<Pick<HTMLInputElement, 'id' | 'className' | 'defaultValue' | 'checked' | 'defaultChecked' | 'disabled'>> & {
        label: Pick<HTMLLabelElement, 'textContent'> & {position?: 'after' | 'before'}
        linebreak: boolean,
        
};

type HTMLButtonTemplateDescription = Partial<Pick<HTMLInputElement, 'id' | 'className' | 'type' | 'textContent' | 'name' | 'value' | 'defaultValue' | 'disabled'>>;

type HTMLLegendTemplateDescription = Partial<Pick<HTMLLegendElement, 'id' | 'className' | 'textContent'>>;

type HTMLSelectTemplateDescription = Partial<Pick<HTMLSelectElement, 'id' | 'className' | 'name' | 'value'>> & {
    options: (Pick<HTMLOptionElement, 'value' | 'label'> & Partial<Pick<HTMLOptionElement, 'selected'>>)[]
}

type HTMLFieldSetTemplateDescription = Partial<Pick<HTMLFieldSetElement, 'id' | 'className' | 'name'>> & {
    elements: HTMLElementDescription<keyof HTMLElementTagNameMap>[];
    legend: HTMLLegendTemplateDescription;
}

type HTMLFormTemplateDescription = Partial<Pick<HTMLEMenuItemElement, 'id' | 'className' | 'name' | 'title' | 'type'>> & {
    elements: (
        ({elem: 'fieldset'} & HTMLFieldSetTemplateDescription) | 
        ({elem: 'button'} & HTMLButtonTemplateDescription)
    )[];
}

interface HTMLFormTemplate {
    (props: HTMLFormTemplateDescription): HTMLFormElement;
}

const HTMLFieldSetTemplate = (props: HTMLFieldSetTemplateDescription) => {
    
    let fieldset = HTMLElement('fieldset');

    let label: HTMLLabelElement | null;
    let input: HTMLInputElement | null;
    let select: HTMLSelectElement | null;

    fieldset.append(
        HTMLElement(
            'legend', {
                props: props.legend
            }
        )
    );
    
    props.elements.forEach((elem) => {
        label = null;
        input = null;
        select = null;

        if ('label' in elem) {
            label = HTMLElement(
                'label', {
                    props: {
                        htmlFor: elem.name,
                    }
                }
            );
            switch (elem.elem) {
                case 'input':
                    input = HTMLElement(
                        'input', {
                            props: elem
                        }
                    );
                    label.append(input);
                    break;
                case 'select':
                    select = HTMLElement(
                        'select', {
                            props: {
                                name: elem.name,
                                value: elem.value,
                            },
                            children: elem.options.map((props) => {
                                return HTMLElement(
                                    'option', {
                                        props: props
                                    }
                                );
                            })
                        }
                    );
                    label.append(select);
                    break;
            }

            if (elem.label.pos === 'before') {
                label.prepend(elem.label.textContent);
            }
            else {
                label.append(elem.label.textContent);
            }

            fieldset.append(label);
        }
        else {
            fieldset.append(
                HTMLElement(elem.tagName, {props: elem.props, attr: elem.attr, children: elem.children})
            );
        }
    });

    return fieldset;
}

const HTMLFormTemplate: HTMLFormTemplate = (props: HTMLFormTemplateDescription) => {

    let form = HTMLElement(
        'form', {
            props: {
                id: props.id,
                className: props.className,
                name: props.name,
                title: props.title,
            },
            attr: {
                type: props.type
            }
        }
    );

    let fieldset: HTMLFieldSetElement | null;
    let button: HTMLButtonElement | null;

    props.elements.forEach((elem) => {
        switch (elem.elem) {
            case 'button':
                button = HTMLElement(
                    'button', {
                        props: elem
                    }
                );
                form.append(button);
                break;
            case 'fieldset':
                fieldset = HTMLFieldSetTemplate(elem);
                form.append(fieldset);
                break;
        }
    });

    return form;
}