import { editor } from "engine/editor/Editor";
import { isHTMLEMenuItemElement } from "engine/editor/elements/lib/containers/menus/MenuItem";
import { forEachDescendent } from "engine/editor/elements/Snippets";
import { start } from "samples/scenes/SimpleScene";

function isElement(obj: any): obj is Element {
  return obj instanceof Node && obj.nodeType === obj.ELEMENT_NODE;
}

class AttributeMutationHandler {
  setCallback: (element: Element) => void;
  removeCallback: (element: Element) => void;
  eventListener: EventListener;

  constructor(eventListener: EventListener,
    setCallback: (element: Element) => void,
    removeCallback: (element: Element) => void) {
      this.eventListener = eventListener;
      this.setCallback = setCallback;
      this.removeCallback = removeCallback;
  }
}

const createCallback = (mutationHandlers: {
  [attr: string]: AttributeMutationHandler
 }) => {
  return (mutationsList: MutationRecord[]) =>  {
    mutationsList.forEach((mutation: MutationRecord) => {
      mutation.addedNodes.forEach((node: Node) => {
        forEachDescendent(node, (node: Node) => {
          if (isElement(node)) {
            [...node.attributes].forEach((attr) => {
              const attrName = attr.name;
              if (attrName in mutationHandlers) {
                let handler = mutationHandlers[attrName];
                handler.setCallback.call(handler, node);
              }
            });
          }
        });
      });
      if (mutation.target.nodeType === 1) {
        let node = mutation.target;
        if (isElement(node)) {
          const attrName = mutation.attributeName;
          if (attrName && attrName in mutationHandlers) {
            if (node.hasAttribute(attrName)) {
              let handler = mutationHandlers[attrName];
              mutationHandlers[attrName].setCallback.call(handler, node);
            }
            else {
              let handler = mutationHandlers[attrName];
              mutationHandlers[attrName].removeCallback.call(handler, node);
            }
          }
        }
      }
    });
  }
}

const dataChangeAttributeMutationHandler = new AttributeMutationHandler(
  (event: Event) => {
    let target = event.target;
    if (isElement(target)) {
      const changeValue = target.getAttribute("change");
      if (changeValue !== null) {
        editor.executeCommand(changeValue);
      }
    }
  },
  function(this: AttributeMutationHandler, element: Element)  {
    element.addEventListener("change", this.eventListener);
  },
  function(this: AttributeMutationHandler, element: Element) {
    element.removeEventListener("change", this.eventListener);
  }
);

const dataCommandAttributeMutationHandler = new AttributeMutationHandler(
  (event: Event) => {
    let target = event.target;
    if (isElement(target)) {
      const changeValue = target.getAttribute("command");
      if (changeValue !== null) {
        editor.executeCommand(changeValue);
      }
    }
  },
  function(this: AttributeMutationHandler, element: Element)  {
    element.addEventListener("click", this.eventListener);
  },
  function(this: AttributeMutationHandler, element: Element) {
    element.removeEventListener("click", this.eventListener);
  }
);

const callback: MutationCallback = createCallback({
  "data-command": dataCommandAttributeMutationHandler,
  "data-change": dataChangeAttributeMutationHandler
});

const obs = new MutationObserver(callback);

obs.observe(document.body, {
  childList: true,
  subtree: true,
  attributeFilter: ["data-command", "data-change"]
});

export async function sandbox(): Promise<void> {

  await start();

  editor.registerCommand("test", {
    exec: () => {
      alert("test");
    },
    context: "default"
  });

  const inputDropzone = document.querySelector<HTMLFormElement>("#input-dropzone");
  if (inputDropzone) {
    inputDropzone.addEventListener("datatransfer", () => {
      let name = inputDropzone.dataset.name;
      if (name) {
        if (inputDropzone.multiple) {
            let inputs = Array.from(inputDropzone.querySelectorAll<HTMLInputElement>("input"));
            inputs.forEach((input, index) => {
                input.name = `${name}[${index}]`;
            });
        }
        else {
            let input = inputDropzone.querySelector<HTMLInputElement>("input");
            if (input) {
              input.name = name;
            }
        }
      }
    });
  
  }

  window.addEventListener("blur", () => {
    document.body.focus();
  });

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