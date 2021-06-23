export { handleTabIndexes };
export { isHTMLInputElement };
export { forEachDescendent };
export { addFocusChangeListener };
export { getPropertyFromPath };
export { setPropertyFromPath };
export { findDescendents };
export { pointIntersectsWithDOMRect };

function handleTabIndexes() {
  const tabIndexedElements: Array<HTMLElement> = [];
  let idx = 0;

  const elements = document.getElementsByTagName('*') as HTMLCollectionOf<HTMLElement>;
  for (let i = 0; i < elements.length; i++) {
    const elem = elements[i];
    if (elem.tabIndex === 0) {
      tabIndexedElements.push(elem);
    }
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Tab') {
      if (!event.shiftKey) {
        tabIndexedElements[(++idx % tabIndexedElements.length)].focus();
      }
      else {
        tabIndexedElements[(--idx % tabIndexedElements.length)].focus();
      }
      event.preventDefault();
    }
  });
}

function isHTMLInputElement(elem: Element): elem is HTMLInputElement {
  return elem.tagName.toLowerCase() === 'input';
}

function forEachDescendent(node: Node, func: (node: Node) => void) {
  node.childNodes.forEach((child) => {
    forEachDescendent(child, func);
  });
  func(node);
}

function findDescendents<T extends Node>(node: Node, filter: (node: Node) => node is T): T[] {
  const descendants: Array<T> = [];
  node.childNodes.forEach((child) => {
    if (filter(child)) {
      descendants.push(child);
    }
    descendants.push(...findDescendents(child, filter));
  });
  return descendants;
}

function addFocusChangeListener<E extends HTMLElement>(elem: E, listener: () => void) {

  const focusOutListener = () => {
    if (!elem.contains(document.activeElement)) {
      listener();
      document.removeEventListener("focusin", focusOutListener);
      addFocusInListener();
    }
  };

  const addFocusInListener = () => {
    elem.addEventListener("focusin", () => {
      document.addEventListener("focusin", focusOutListener);
    }, {once: true});
  };

  addFocusInListener();
}

function getPropertyFromPath(src: object, path: string): any {
  const props = path.split(".");
  let obj: {[key: string]: any} | undefined  = src;
  props.forEach((prop) => {
    if (typeof obj === "object" && prop in obj) {
      obj = obj[prop];
    }
    else {
      obj = void 0;
    }
  });
  return obj;
}

function setPropertyFromPath(src: object, path: string, value: any): object {
  const props = path.split(".");
  let obj: {[key: string]: any} = src;
  let lastPropIdx = props.length - 1;
  props.forEach((prop, idx) => {
    if (idx === lastPropIdx) {
      Object.assign(obj, {
        [prop]: value
      });
    }
    else {
      if (typeof obj[prop] !== "object") {
        Object.assign(obj, {
          [prop]: {}
        });
      }
      obj = obj[prop];
    }
  });
  return src;
}


function pointIntersectsWithDOMRect(x: number, y: number, rect: DOMRect) {
  return !(rect.left > x || 
      rect.right < x || 
      rect.top > y ||
      rect.bottom < y);
}