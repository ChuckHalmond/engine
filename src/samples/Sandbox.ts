import { editor } from "engine/editor/Editor";
import { isHTMLEMenuItemElement } from "engine/editor/elements/lib/containers/menus/MenuItem";
import { forEachDescendent } from "engine/editor/elements/Snippets";
import { start } from "samples/scenes/SimpleScene";

const createCallback = (callbacks: {
  [attr: string]: (elem: HTMLElement) => void
 }) => {
  return (mutationsList: MutationRecord[]) =>  {
    mutationsList.forEach((mutation: MutationRecord) => {
      mutation.addedNodes.forEach((node: Node) => {
        forEachDescendent(node, (node: Node) => {
          if (node.nodeType === 1) {
            const element = node as HTMLElement;
            [...element.attributes].forEach((attr) => {
              const attrName = attr.name;
              if (attrName in callbacks) {
                callbacks[attrName](element);
              }
            });
          }
        });
      });
      if (mutation.target.nodeType === 1) {
        const element = mutation.target as HTMLElement;
        const attr = mutation.attributeName;
        if (attr && attr in callbacks) {
          callbacks[attr](element);
        }
      }
    });
  };
}

const callback: MutationCallback = createCallback({
  "data-command": (elem: HTMLElement) => {
    if (!isHTMLEMenuItemElement(elem)) {
      elem.addEventListener("click", () => {
        const command = elem.dataset.command;
        if (command) {
          editor.executeCommand(command, elem.dataset.commandArgs);
        }
      });
    }
  }
});

const obs = new MutationObserver(callback);

obs.observe(document.body, {
  childList: true,
  subtree: true,
  attributeFilter: ["data-command"]
});

export async function sandbox(): Promise<void> {
  
  start();

    /*const myWindow = window.open("http://localhost:8080/", "MsgWindow", "width=200,height=100");
    if (myWindow) {
    myWindow.document.write("<p>This is 'MsgWindow'. I am 200px wide and 100px tall!</p>");
    myWindow.addEventListener("message", (event) => {
        myWindow.document.body.innerHTML = event.data;
    }, false);
  
    setTimeout(() => {
        myWindow.postMessage("The user is 'bob' and the password is 'secret'", "http://localhost:8080/");
    }, 100);
  }*/
}