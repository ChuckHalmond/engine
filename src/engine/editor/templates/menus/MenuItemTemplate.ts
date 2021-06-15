import { HotKey, Key, KeyModifier } from "engine/core/input/Input";
import { HTMLElementTemplate, setHTMLElementAttributes } from "engine/editor/elements/HTMLElement";
import { HTMLEMenuItemElement } from "engine/editor/elements/lib/containers/menus/MenuItem";
import { HTMLEMenuTemplate, HTMLEMenuTemplateDescription } from "./MenuTemplate";

export { HTMLEMenuItemTemplateDescription };
export { HTMLEMenuItemTemplate };

type HTMLEMenuItemTemplateDescription = Pick<HTMLEMenuItemElement, 'name'> & Partial<Pick<HTMLEMenuItemElement, 'id' | 'className' | 'title' | 'type' | 'disabled'>> & {
    label?: string;
    icon?: string;
    command?: string;
    commandArgs?: any;
    hotkey?: {
        key: Key;
        mod1?: KeyModifier;
        mod2?: KeyModifier;
    },
    value?: string,
    checked?: boolean,
    statekey?: string,
    menu?: HTMLEMenuTemplateDescription;
    disabled?: boolean;
}

interface HTMLEMenuItemTemplate {
    (args: HTMLEMenuItemTemplateDescription): HTMLEMenuItemElement;
}

const HTMLEMenuItemTemplate: HTMLEMenuItemTemplate = (args: HTMLEMenuItemTemplateDescription) => {
    let slotted: (Node | string)[] = [];

    if (args.menu) {
        slotted.push(
            setHTMLElementAttributes(
                HTMLEMenuTemplate(
                    args.menu
                ), {
                    slot: 'menu'
                }
            )
        );
    }

    const menuItem = HTMLElementTemplate(
        'e-menuitem', {
            props: {
                id: args.id,
                className: args.className,
                name: args.name,
                title: args.title,
                type: args.type,
                label: args.label,
                disabled: args.disabled,
                icon: args.icon,
                value: args.value,
                checked: args.checked,
                command: args.command,
                commandArgs: args.commandArgs,
                hotkey: args.hotkey ? new HotKey(args.hotkey.key, args.hotkey.mod1, args.hotkey.mod2) : void 0
            },
            children: [
                ...slotted
            ]
        }
    );

    return menuItem;
}