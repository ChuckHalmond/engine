import { isParentNode, isNode, isReactiveParentNode, isReactiveNode } from "../HTMLElement";
import { forAllSubtreeNodes } from "../Snippets";

export { HTMLEViewElement };
export { HTMLEViewElementBase };

interface HTMLEViewElement<M extends object> {
    readonly model: M;
    setModel(model: M): void;
    render(): Node | (Node | string)[];
    connectedCallback(): void;
    disconnectedCallback(): void;
}

abstract class HTMLEViewElementBase<M extends object> extends HTMLElement implements HTMLEViewElement<M> {
    _model: M;
    _observer: MutationObserver;

    constructor(model: M) {
        super();
        this._model = model;

        this._observer = new MutationObserver((mutations: MutationRecord[]) => {
            mutations.forEach((record: MutationRecord) => {
                Array.from(record.removedNodes).map((node) => {
                    this._removeReactiveListeners(node);
                    if (isParentNode(node)) {
                        forAllSubtreeNodes(node, (childNode) => {
                            this._removeReactiveListeners(childNode);
                        });
                    }
                });
                Array.from(record.addedNodes).map((node) => {
                    this._addReactiveListeners(node);
                    if (isParentNode(node)) {
                        forAllSubtreeNodes(node, (childNode) => {
                            this._addReactiveListeners(childNode);
                        });
                    }
                });
            });
        });

        let content = this.render();
        if (isNode(content)) {
            this.append(content);
        }
        else {
            this.append(...content);
        }

        this._observer.observe(this, {
            subtree: true,
            childList: true
        });

        this._addReactiveListeners(this);
    }

    public get model(): M {
        return this._model;
    }

    public setModel(model: M): void {
        this._model = model;
        this.innerHTML = "";
        let content = this.render();
        if (isNode(content)) {
            this.append(content);
        }
        else {
            this.append(...content);
        }
    }

    public abstract render(): Node | (Node | string)[];

    public connectedCallback(): void {
        Array.from(this.childNodes).map((node) => {
            this._addReactiveListeners(node);
            if (isParentNode(node)) {
                forAllSubtreeNodes(node, (childNode) => {
                    this._addReactiveListeners(childNode);
                });
            }
        });
    }

    public disconnectedCallback(): void {
        Array.from(this.childNodes).map((node) => {
            this._removeReactiveListeners(node);
            if (isParentNode(node)) {
                forAllSubtreeNodes(node, (childNode) => {
                    this._removeReactiveListeners(childNode);
                });
            }
        });
    }

    private _addReactiveListeners(node: Node): void {
        if (isReactiveParentNode(node)) {
            const { _reactModel, _reactEvent, _reactListener } = node._reactAttributes; 
            _reactModel.addEventListener(_reactEvent, _reactListener);
        }
        else if (isReactiveNode(node)) {
            const { _reactModel, _reactEvent, _reactListener } = node._reactAttributes; 
            _reactModel.addEventListener(_reactEvent, _reactListener);
        }
    }

    private _removeReactiveListeners(node: Node): void {
        if (isReactiveParentNode(node)) {
            const { _reactModel, _reactEvent, _reactListener } = node._reactAttributes; 
            _reactModel.removeEventListener(_reactEvent, _reactListener);
        }
        else if (isReactiveNode(node)) {
            const { _reactModel, _reactEvent, _reactListener } = node._reactAttributes; 
            _reactModel.removeEventListener(_reactEvent, _reactListener);
        }
    }
}