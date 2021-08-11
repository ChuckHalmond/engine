import { Key, KeyModifier } from "engine/core/input/Input";
import { bindShadowRoot, HTMLElementConstructor, isTagElement, RegisterCustomHTMLElement } from "../elements/HTMLElement";
import { HTMLEMenuElement } from "../elements/lib/containers/menus/Menu";
import { HTMLEMenuBarElement } from "../elements/lib/containers/menus/MenuBar";
import { EMenuItemElementType, HTMLEMenuItemElement } from "../elements/lib/containers/menus/MenuItem";
import { HTMLEMenuItemGroupElement } from "../elements/lib/containers/menus/MenuItemGroup";
import { ItemModel, ItemModelData, ListModel } from "../models/ListModel";

interface MenuItemModel extends ItemModel<{
    isMenuItem: true;
    id?: string;
    type?: EMenuItemElementType;
    name?: string;
    label?: string;
    icon?: string;
    command?: string;
    commandArgs?: any;
    hotkey?: {
        key: Key;
        mod1?: KeyModifier;
        mod2?: KeyModifier;
    };
    value?: string;
    checked?: boolean;
    statekey?: string;
    disabled?: boolean;
    menu?: MenuModel;
}> {};

interface MenuItemGroupModel extends ListModel<MenuItemModel, {
    isMenuItemGroup: true;
    label?: string;
}> {};

interface MenuModel extends ListModel<MenuItemModel | MenuItemGroupModel, {
    isMenu: true;
}> {};

interface MenuBarModel extends ListModel<MenuItemModel, {
    isMenuBar: true;
}> {};

@RegisterCustomHTMLElement({
    name: "v-menubar"
})
class HTMLMenuBarView extends HTMLElement {
    _element: HTMLEMenuBarElement;
    _model: MenuBarModel | null;

    // index()
    // parent
    // parent.items.length

    constructor() {
        super();

        bindShadowRoot(this, /*template*/`<e-menubar></e-menubar>`);
        this._model = null;
        this._element = this.shadowRoot!.querySelector("e-menubar")!;
    }

    /*public getParentNode(index: TreeModelIndex): HTMLEMenuItemGroupElement | HTMLEMenuItemElement | null {
        let parentIndex: ModelIndex | undefined = index;
        let parentElement: HTMLEMenuBarElement | HTMLEMenuItemGroupElement | HTMLEMenuItemElement | null = this.element;
        while (parentIndex && parentIndex.parent) {
            parentIndex = parentIndex.parent;
            parentElement =
                isTagElement("e-menuitem", parentElement) ? parentElement.childMenu!.items[parentIndex.index!] :
                isTagElement("e-menuitemgroup", parentElement) ? parentElement.items[parentIndex.index!] : null;
        }
        return isTagElement("e-menubar", parentElement) ? null : parentElement;
    }*/

    public modelChanged(event: any) {
        switch (event.modification) {
            case "add":
                this._element.findItem((item) => item.parentMenu!.items.indexOf(item) == 1)
                //this.getParentNode(event.index)?.insertAdjacentElement("beforebegin", HTMLElementConstructor("e-menuitem"));
                break;
            case "remove":
                break;
            //event.index.
        }
    }

    public get model(): MenuBarModel | null {
        return this._model;
    }
    
    public bindModel(model: MenuBarModel) {
        if (this._model && this._model !== model) {
            this._model.removeEventListener("datachange", this.modelChanged);
            model.addEventListener("datachange", this.modelChanged);
        }
        this._model = model;
        /*function handleItemsModels() {
            model.items.forEach((item) => {
                if (item.menu) {
                    item.menu.items.forEach((item) => {*
                    };
                }
            });
        }*/
    }
}

class PartialView {
    model: Model;
    element: Element;
}