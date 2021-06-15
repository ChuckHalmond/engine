import { HTMLElementTemplate } from "engine/editor/elements/HTMLElement";
import { HTMLEMenuElement } from "engine/editor/elements/lib/containers/menus/Menu";
import { HTMLEMenuItemGroupTemplate, HTMLEMenuItemGroupTemplateDescription } from "./MenuItemGroupTemplate";
import { HTMLEMenuItemTemplate, HTMLEMenuItemTemplateDescription } from "./MenuItemTemplate";

export { HTMLEMenuTemplateDescription };
export { HTMLEMenuTemplate };

type HTMLEMenuTemplateDescription = Partial<Pick<HTMLEMenuElement, 'id' | 'className' | 'name'>> & {
    items: (HTMLEMenuItemTemplateDescription | HTMLEMenuItemGroupTemplateDescription)[],
}

interface HTMLEMenuTemplate {
    (desc: HTMLEMenuTemplateDescription): HTMLEMenuElement;
}

const HTMLEMenuTemplate: HTMLEMenuTemplate = (args: HTMLEMenuTemplateDescription) => {
    
    const items = args.items.map((itemArgs) => {
        if ("isGroup" in itemArgs) {
            return HTMLEMenuItemGroupTemplate(itemArgs);
        }
        else {
            return HTMLEMenuItemTemplate(itemArgs);
        }
    });

    return HTMLElementTemplate(
        'e-menu', {
            props: {
                id: args.id,
                className: args.className,
                name: args.name,
            },
            children: items
        }
    );
}