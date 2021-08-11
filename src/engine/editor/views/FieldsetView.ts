class FieldsetView extends HTMLElement {
    _element: HTMLEMenuBarElement;
    _model: MenuBarModel | null;

    constructor() {
        super();

        bindShadowRoot(this, /*template*/`<e-menubar></e-menubar>`);
        this._model = null;
        this._element = this.shadowRoot!.querySelector("e-menubar")!;
    }

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
    }
}