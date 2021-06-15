import { HTMLElementTemplate } from "engine/editor/elements/HTMLElement";
import { HTMLEMenuBarElement } from "engine/editor/elements/lib/containers/menus/MenuBar";
import { HTMLEMenuItemTemplate, HTMLEMenuItemTemplateDescription } from "./MenuItemTemplate";

export { HTMLEMenubarTemplateDescription };
export { HTMLEMenubarTemplate };

type HTMLEMenubarTemplateDescription = Partial<Pick<HTMLEMenuBarElement, 'id' | 'className' | 'tabIndex'>> & {
    items: HTMLEMenuItemTemplateDescription[],
}

interface HTMLEMenubarTemplate {
    (args: HTMLEMenubarTemplateDescription): HTMLEMenuBarElement;
}

const HTMLEMenubarTemplate: HTMLEMenubarTemplate = (args: HTMLEMenubarTemplateDescription) => {
    
    const items = args.items.map((itemArgs) => {
        return HTMLEMenuItemTemplate(itemArgs);
    });

    return HTMLElementTemplate(
        'e-menubar', {
            props: {
                id: args.id,
                className: args.className,
                tabIndex: args.tabIndex
            },
            children: items
        }
    );
}