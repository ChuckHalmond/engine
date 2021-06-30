import { HTMLEDropzoneElement, isHTMLEDropzoneElement } from "engine/editor/elements/lib/controls/draganddrop/Dropzone";
import { forAllHierarchyElements } from "engine/editor/elements/Snippets";
import { mockup } from "./scenes/Mockup";
import { start } from "./scenes/SimpleScene";

function isElement(obj: any): obj is Element {
  return obj instanceof Node && obj.nodeType === obj.ELEMENT_NODE;
}

function isTagElement<K extends keyof HTMLElementTagNameMap>(tagName: K, obj: any): obj is HTMLElementTagNameMap[K] {
  return obj instanceof Node && obj.nodeType === obj.ELEMENT_NODE && (obj as Element).tagName.toLowerCase() == tagName;
}

const createMutationCallback = (
  mixins: AttributeMutationMixin[]
  ) => {
  return (mutationsList: MutationRecord[]) =>  {
    mutationsList.forEach((mutation: MutationRecord) => {
      mutation.addedNodes.forEach((node: Node) => {
        if (isElement(node)) {
          let element = node;
          forAllHierarchyElements(element, (childElement: Element) => {
            [...childElement.attributes].forEach((attr) => {
              let matchingMixins = mixins.filter(
                mixin => match(
                  mixin.attributeType, mixin.attributeName, mixin.attributeValue,
                  attr.name, attr.value
                )
              );
              matchingMixins.forEach((mixin) => {
                mixin.attach(childElement);
              });
            });
          });
        }
      });
      const target = mutation.target;
      if (isElement(target)) {
        let attrName = mutation.attributeName;
        if (attrName) {
          let relatedMixins = mixins.filter(mixin => mixin.attributeName === attrName);
          relatedMixins.forEach((mixin) => {
            if (match(
                mixin.attributeType, mixin.attributeName, mixin.attributeValue,
                attrName!, target.getAttribute(attrName!)
              )) {
              mixin.attach(target);
            }
            else {
              mixin.detach(target);
            }
          });
        }
      }
    });
  }
}

interface AttributeMutationMixin {
  readonly attributeName: string;
  readonly attributeValue: string;
  readonly attributeType: AttributeType;
  attach(element: Element): void;
  detach(element: Element): void;
}

type AttributeType = "string" | "boolean" | "listitem";

function match(refAttributeType: AttributeType, refAttrName: string, refAttrValue: string, attrName: string, attrValue: string | null): boolean {
  if (refAttrName == attrName) {
    switch (refAttributeType) {
      case "boolean":
        return refAttrValue == "" && attrValue == "";
      case "string":
        return refAttrValue !== "" && (refAttrValue === attrValue);
      case "listitem":
        return (refAttrValue !== "" && attrValue !== null) && new RegExp(`${refAttrValue}\s*?`, "g").test(attrValue);
    }
  }
  return false;
}

abstract class BaseAttributeMutationMixin implements AttributeMutationMixin {
  readonly attributeName: string;
  readonly attributeValue: string;
  readonly attributeType: AttributeType;
  
  constructor(attributeName: string, attributeType: AttributeType = "boolean", attributeValue: string = "") {
    this.attributeName = attributeName;
    this.attributeType = attributeType;
    this.attributeValue = attributeValue;
  }

  public abstract attach(element: Element): void;
  public abstract detach(element: Element): void;
}

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

const attributeMutationMixins = [
  new TestDataClassMixin(),
  new InputDropzoneDataClassMixin(),
  new TogglerSelectDataClassMixin()
];

const mainObserver = new MutationObserver(
  createMutationCallback(attributeMutationMixins)
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