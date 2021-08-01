import { AttributeMutationMixin, BaseAttributeMutationMixin, createMutationObserverCallback, isTagElement } from "engine/editor/elements/HTMLElement";
import { HTMLEDropzoneElement, isHTMLEDropzoneElement } from "engine/editor/elements/lib/controls/draggable/Dropzone";
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
    const closestFieldset = select.closest("fieldset");
    let toToggleElement = null;
    if (closestFieldset) {
      Array.from(select.options).forEach((option, index) => {
          toToggleElement = closestFieldset.querySelector<HTMLElement>(`[name=${option.value}]`);
          if (toToggleElement) {
            toToggleElement.hidden = (index !== select.selectedIndex);
          }
      });
    }
  }
}

class DuplicaterInputDataClassMixin extends DataClassMixin {
  public readonly changeEventListener: EventListener;

  constructor() {
    super("duplicater-input");
    
    this.changeEventListener = (event) => {
      let target = event.target;
      if (isTagElement("input", target)) {
        this.handlePostchangeDuplicate(target);
      }
    };
  }

  public attach(element: HTMLInputElement): void {
    element.addEventListener("change", this.changeEventListener);
    this.handlePostchangeDuplicate(element);
  }

  public detach(element: HTMLInputElement): void {
    element.removeEventListener("change", this.changeEventListener);
  }

  public handlePostchangeDuplicate(input: HTMLInputElement) {
    const closestFieldset = input.closest("fieldset");
    const template = input.getAttribute("data-duplicater-template");
    const inputValue = parseInt(input.value);
    if (closestFieldset && template) {
      const duplicateElements = Array.from(closestFieldset.querySelectorAll<HTMLElement>(`[name=${template}]`));
      if (duplicateElements.length > 0) {
        const lastElement = duplicateElements[duplicateElements.length - 1];
        const templateElement = duplicateElements.splice(0, 1)[0]!;
        templateElement.hidden = true;
        while (duplicateElements.length > Math.max(inputValue, 0)) {
          duplicateElements.pop()!.remove();
        }
        while (duplicateElements.length < inputValue) {
          let newDuplicateElement = templateElement.cloneNode(true) as HTMLElement;
          newDuplicateElement.hidden = false;
          let duplicateIndex = newDuplicateElement.querySelector("[data-duplicater-index]");
          if (duplicateIndex) {
            duplicateIndex.textContent = (duplicateElements.length + 1).toString();
          }
          lastElement.insertAdjacentElement("afterend", newDuplicateElement);
          duplicateElements.push(newDuplicateElement);
        }
      }
    }
  }
}

class EnablerInputDataClassMixin extends DataClassMixin {
  public readonly changeEventListener: EventListener;

  constructor() {
    super("enabler-input");
    
    this.changeEventListener = (event) => {
      let target = event.target;
      if (isTagElement("input", target)) {
        this.handlePostchangeDuplicate(target);
      }
    };
  }

  public attach(element: HTMLInputElement): void {
    element.addEventListener("change", this.changeEventListener);
    this.handlePostchangeDuplicate(element);
  }

  public detach(element: HTMLInputElement): void {
    element.removeEventListener("change", this.changeEventListener);
  }

  public handlePostchangeDuplicate(input: HTMLInputElement) {
    const closestFieldset = input.closest("fieldset");
    const template = input.getAttribute("data-duplicater-template");
    const inputValue = parseInt(input.value);
    if (closestFieldset && template) {
      const duplicateElements = Array.from(closestFieldset.querySelectorAll<HTMLElement>(`[name=${template}]`));
      if (duplicateElements.length > 0) {
        const lastDuplicateElement = duplicateElements[duplicateElements.length - 1];
        const templateElement = duplicateElements.splice(0, 1)[0]!;
        templateElement.hidden = true;
        while (duplicateElements.length > Math.max(inputValue, 0)) {
          duplicateElements.pop()!.remove();
        }
        while (duplicateElements.length < inputValue) {
          let newDuplicateElement = templateElement.cloneNode(true) as HTMLElement;
          newDuplicateElement.hidden = false;
          let duplicateIndex = newDuplicateElement.querySelector("[data-duplicater-index]");
          if (duplicateIndex) {
            duplicateIndex.textContent = (duplicateElements.length + 1).toString();
          }
          lastDuplicateElement.insertAdjacentElement("afterend", newDuplicateElement);
          duplicateElements.push(newDuplicateElement);
        }
      }
    }
  }
}

const attributeMutationMixins: AttributeMutationMixin[] = [
  new TestDataClassMixin(),
  new InputDropzoneDataClassMixin(),
  new TogglerSelectDataClassMixin(),
  new DuplicaterInputDataClassMixin()
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

  //await mockup();
  //await start();

  let html = function(parts: TemplateStringsArray, ...expr: any[]) {
    console.log(parts);
    console.log(expr);
  };

  html`${1}Hey${2}`;



  /*editor.registerCommand("test", {
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
