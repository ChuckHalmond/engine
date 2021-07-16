import { HTMLElementConstructor } from "engine/editor/elements/HTMLElement";
import { HTMLEDraggableElement } from "engine/editor/elements/lib/controls/draggable/Draggable";

export { HTMLDraggableInputTemplateDescription };
export { HTMLDraggableInputTemplate };

type HTMLDraggableInputTemplateDescription =
    Pick<HTMLEDraggableElement, 'ref'>
    & Partial<Pick<HTMLEDraggableElement, 'id' | 'className' | 'ref' | 'type'>>
    & Partial<Pick<HTMLInputElement, 'value' | 'name'>>;

interface HTMLDraggableInputTemplate {
    (desc: HTMLDraggableInputTemplateDescription): HTMLEDraggableElement;
}

const HTMLDraggableInputTemplate: HTMLDraggableInputTemplate = (desc: HTMLDraggableInputTemplateDescription) => {
    return HTMLElementConstructor<HTMLEDraggableElement>(
        "e-draggable", {
            props: {
                id: desc.id,
                className: desc.className,
                ref: desc.ref,
                type: desc.type
            },
            children: [
                HTMLElementConstructor("input", {
                    props: {
                        name: desc.name,
                        hidden: true
                    },
                    attr: {
                        value: desc.value
                    }
                })
            ]
        }
    );
}