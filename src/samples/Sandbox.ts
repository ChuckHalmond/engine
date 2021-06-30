import { AttributeMutationMixin, BaseAttributeMutationMixin, createMutationObserverCallback, isTagElement } from "engine/editor/elements/HTMLElement";
import { HTMLEDropzoneElement, isHTMLEDropzoneElement } from "engine/editor/elements/lib/controls/draganddrop/Dropzone";
import { mockup } from "./scenes/Mockup";
import { start } from "./scenes/SimpleScene";

abstract class DataClassMixin extends BaseAttributeMutationMixin {
  constructor(attributeValue: string) {
    super("data-class", "listitem", attributeValue);
  }
}

class TestDataClassMixin extends DataClassMixin {

  constructor() {
    super("test");
  }

  public attach(element: Element): void {
    element.addEventListener("click", TestDataClassMixin._clickEventListener);
  }

  public detach(element: Element): void {
    element.removeEventListener("click", TestDataClassMixin._clickEventListener);
  }

  private static _clickEventListener: EventListener = () => {
    alert("data-class test");
  };
}

class InputDropzoneDataClassMixin extends DataClassMixin {
  public readonly datatransferEventListener: EventListener;

  constructor() {
    super("input-dropzone");

    this.datatransferEventListener = (event) => {
      let target = event.target;
        if (isHTMLEDropzoneElement(target)) {
          this.handlePostdatatransferInputNaming(target)
        }
    };
  }

  public attach(element: Element): void {
    if (isHTMLEDropzoneElement(element)) {
      this.handlePostdatatransferInputNaming(element)
    }
    element.addEventListener("datatransfer", this.datatransferEventListener);
  }

  public detach(element: Element): void {
    element.removeEventListener("datatransfer", this.datatransferEventListener);
  }

  public handlePostdatatransferInputNaming(dropzone: HTMLEDropzoneElement) {
    let name = dropzone.getAttribute("data-input-dropzone-name");
    if (name) {
      if (dropzone.multiple) {
          let inputs = Array.from(dropzone.querySelectorAll<HTMLInputElement>("input"));
          inputs.forEach((input, index) => {
              input.name = `${name}[${index}]`;
          });
      }
      else {
          let input = dropzone.querySelector<HTMLInputElement>("input");
          if (input) {
            input.name = name;
          }
      }
    }
  }
}

class TogglerSelectDataClassMixin extends DataClassMixin {
  public readonly changeEventListener: EventListener;

  constructor() {
    super("toggler-select");

    this.changeEventListener = (event) => {
      let target = event.target;
      if (isTagElement("select", target)) {
        this.handlePostchangeToggle(target);
      }
    };
  }

  public attach(element: HTMLSelectElement): void {
    element.addEventListener("change", this.changeEventListener);
    this.handlePostchangeToggle(element);
  }

  public detach(element: HTMLSelectElement): void {
    element.removeEventListener("change", this.changeEventListener);
  }

  public handlePostchangeToggle(select: HTMLSelectElement) {
    let fieldsetElement = null;
    Array.from(select.options).forEach((option, index) => {
      fieldsetElement = document.getElementById(option.value);
      if (fieldsetElement) {
        fieldsetElement.hidden = (index !== select.selectedIndex);
      }
    });
  }
}

const attributeMutationMixins: AttributeMutationMixin[] = [
  new TestDataClassMixin(),
  new InputDropzoneDataClassMixin(),
  new TogglerSelectDataClassMixin()
];

const mainObserver = new MutationObserver(
  createMutationObserverCallback(attributeMutationMixins)
);

mainObserver.observe(document.body, {
  childList: true,
  subtree: true,
  attributeFilter: attributeMutationMixins.map((mixin => mixin.attributeName))
});

export async function sandbox(): Promise<void> {

  await mockup();
  //await start();
  
  /*
  editor.registerCommand("test", {
    exec: () => {
      alert("test");
    },
    context: "default"
  });*/

  /*window.addEventListener("blur", () => {
    document.body.focus();
  });*/

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