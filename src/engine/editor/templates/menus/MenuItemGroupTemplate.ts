import { HTMLElementTemplate } from "engine/editor/elements/HTMLElement";
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

const HTMLEMenuItemGroupTemplate: HTMLEMenuItemGroupTemplate = (args: HTMLEMenuItemGroupTemplateDescription) => {
    
    const items = args.items.map((itemArgs) => HTMLEMenuItemTemplate(itemArgs));

    return HTMLElementTemplate(
        'e-menuitemgroup', {
            props: {
                id: args.id,
                className: args.className,
                name: args.name
            },
            children: items
        }
    );
}