import { HTMLElementConstructor } from "engine/editor/elements/HTMLElement";
import { HTMLEDraggableElement } from "engine/editor/elements/lib/controls/draggable/Draggable";

export { HTMLDraggableInputTemplateDescription };
export { HTMLDraggableInputTemplate };

type HTMLDraggableInputTemplateDescription =
    & Partial<Pick<HTMLEDraggableElement, 'id' | 'className'>>
    & Partial<Pick<HTMLInputElement, 'name'>>;

interface HTMLDraggableInputTemplate {
    (desc: HTMLDraggableInputTemplateDescription): HTMLEDraggableElement;
}

const HTMLDraggableInputTemplate: HTMLDraggableInputTemplate = (desc: HTMLDraggableInputTemplateDescription) => {
    return HTMLElementConstructor(
        "e-draggable", {
            props: {
                id: desc.id,
                className: desc.className
            },
            children: [
                HTMLElementConstructor("input", {
                    props: {
                        name: desc.name,
                        hidden: true
                    }
                })
            ]
        }
    );
}