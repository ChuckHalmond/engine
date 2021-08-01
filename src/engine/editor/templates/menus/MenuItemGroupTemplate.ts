import { HTMLElementConstructor } from "engine/editor/elements/HTMLElement";
import { HTMLEMenuItemGroupElement } from "engine/editor/elements/lib/containers/menus/MenuItemGroup";
import { HTMLEMenuItemTemplate, HTMLEMenuItemTemplateDescription } from "./MenuItemTemplate";

export { HTMLEMenuItemGroupTemplateDescription };
export { HTMLEMenuItemGroupTemplate };

type HTMLEMenuItemGroupTemplateDescription = Partial<Pick<HTMLEMenuItemGroupElement, 'id' | 'className' | 'name' | 'label'>> & {
    isGroup: true,
    items: HTMLEMenuItemTemplateDescription[],
}

interface HTMLEMenuItemGroupTemplate {
    (desc: HTMLEMenuItemGroupTemplateDescription): HTMLEMenuItemGroupElement;
}

const HTMLEMenuItemGroupTemplate: HTMLEMenuItemGroupTemplate = (desc: HTMLEMenuItemGroupTemplateDescription) => {
    
    const items = desc.items.map((descArgs) => HTMLEMenuItemTemplate(descArgs));

    return HTMLElementConstructor(
        "e-menuitemgroup", {
            props: {
                id: desc.id,
                className: desc.className,
                name: desc.name
            },
            children: items
        }
    );
}