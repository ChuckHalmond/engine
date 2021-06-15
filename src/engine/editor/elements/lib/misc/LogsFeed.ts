import { bindShadowRoot, RegisterCustomHTMLElement } from "engine/editor/elements/HTMLElement";

export { LogsFeedElement };

@RegisterCustomHTMLElement({
    name: 'e-logs-feed',
})
class LogsFeedElement extends HTMLElement {

    constructor() {
        super();
        bindShadowRoot(this, /*template*/`
            <style>
                p {
                    margin: 0;
                    padding: 4px;
                }
            </style>
        
            <div>
                <p id="feed"></p>
            </div>
        `);
    }

    
    public appendLogMessage(message: string): void {
        this._feedParagraph.innerText += message.concat('\n');
    }

    private get _feedParagraph(): HTMLParagraphElement {
        return this.shadowRoot!.querySelector('#feed') as HTMLParagraphElement;
    }
}