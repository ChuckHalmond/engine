declare module "engine/editor/elements/Snippets" {
    export { forAllHierarchyElements };
    export { getPropertyFromPath };
    export { setPropertyFromPath };
    export { pointIntersectsWithDOMRect };
    function forAllHierarchyElements(element: Element, func: (element: Element) => void): void;
    function getPropertyFromPath(src: object, path: string): any;
    function setPropertyFromPath(src: object, path: string, value: any): object;
    function pointIntersectsWithDOMRect(x: number, y: number, rect: DOMRect): boolean;
}
declare module "engine/editor/elements/HTMLElement" {
    export { isElement };
    export { isTagElement };
    export { RegisterCustomHTMLElement };
    export { GenerateAttributeAccessors };
    export { createTemplate };
    export { bindShadowRoot };
    export { HTMLElementDescription };
    export { HTMLElementConstructor };
    export { setElementAttributes };
    export { setElementProperties };
    export { AttributeMutationMixin };
    export { AttributeType };
    export { areAttributesMatching };
    export { BaseAttributeMutationMixin };
    export { createMutationObserverCallback };
    function isElement(obj: any): obj is Element;
    function isTagElement<K extends keyof HTMLElementTagNameMap>(tagName: K, obj: any): obj is HTMLElementTagNameMap[K];
    interface RegisterCustomHTMLElementDecorator {
        (args: {
            name: string;
            observedAttributes?: string[];
            options?: ElementDefinitionOptions;
        }): <C extends CustomElementConstructor>(elementCtor: C) => C;
    }
    const RegisterCustomHTMLElement: RegisterCustomHTMLElementDecorator;
    interface GenerateAttributeAccessorsDecorator {
        (attributes: {
            name: string;
            type?: "string" | "number" | "boolean" | "json";
        }[]): <C extends CustomElementConstructor>(elementCtor: C) => C;
    }
    const GenerateAttributeAccessors: GenerateAttributeAccessorsDecorator;
    function createTemplate<E extends Element | DocumentFragment>(templateContent?: string): E;
    function bindShadowRoot(element: HTMLElement, templateContent?: string): ShadowRoot;
    function setElementProperties<E extends Element>(element: E, props: Partial<Pick<E, keyof E>>): E;
    function setElementAttributes<E extends Element>(element: E, attr: {
        [name: string]: number | string | boolean | undefined;
    }): E;
    type HTMLElementDescription<K extends string = any> = (K extends keyof HTMLElementTagNameMap ? {
        tagName: K;
        desc?: {
            options?: ElementCreationOptions;
            props?: Partial<Pick<HTMLElementTagNameMap[K], keyof HTMLElementTagNameMap[K]>>;
            attr?: {
                [attrName: string]: number | string | boolean | undefined;
            };
            children?: (HTMLElementDescription<keyof HTMLElementTagNameMap> | Node | string)[];
        };
    } : {
        tagName: string;
        desc?: {
            options?: ElementCreationOptions;
            props?: Partial<Pick<HTMLElement, keyof HTMLElement>>;
            attr?: {
                [attrName: string]: number | string | boolean | undefined;
            };
            children?: (HTMLElementDescription<keyof HTMLElementTagNameMap> | Node | string)[];
        };
    });
    function HTMLElementConstructor<K extends keyof HTMLElementTagNameMap>(tagName: K, desc?: {
        options?: ElementCreationOptions;
        props?: Partial<Pick<HTMLElementTagNameMap[K], keyof HTMLElementTagNameMap[K]>>;
        attr?: {
            [attrName: string]: number | string | boolean | undefined;
        };
        children?: (HTMLElementDescription | Node | string)[];
    }): HTMLElementTagNameMap[K];
    function HTMLElementConstructor<T extends HTMLElement>(tagName: string, desc?: {
        options?: ElementCreationOptions;
        props?: Partial<Pick<T, keyof T>>;
        attr?: {
            [attrName: string]: number | string | boolean | undefined;
        };
        children?: (HTMLElementDescription | Node | string)[];
    }): T;
    interface AttributeMutationMixin {
        readonly attributeName: string;
        readonly attributeValue: string;
        readonly attributeType: AttributeType;
        attach(element: Element): void;
        detach(element: Element): void;
    }
    type AttributeType = "string" | "boolean" | "listitem";
    function areAttributesMatching(refAttributeType: AttributeType, refAttrName: string, refAttrValue: string, attrName: string, attrValue: string | null): boolean;
    abstract class BaseAttributeMutationMixin implements AttributeMutationMixin {
        readonly attributeName: string;
        readonly attributeValue: string;
        readonly attributeType: AttributeType;
        constructor(attributeName: string, attributeType?: AttributeType, attributeValue?: string);
        abstract attach(element: Element): void;
        abstract detach(element: Element): void;
    }
    function createMutationObserverCallback(mixins: AttributeMutationMixin[]): (mutationsList: MutationRecord[]) => void;
}
declare module "engine/editor/elements/lib/controls/draggable/Dragzone" {
    import { HTMLEDraggableElement } from "engine/editor/elements/lib/controls/draggable/Draggable";
    export { isHTMLEDragzoneElement };
    export { HTMLEDragzoneElement };
    export { BaseHTMLEDragzoneElement };
    function isHTMLEDragzoneElement(obj: any): obj is HTMLEDragzoneElement;
    interface HTMLEDragzoneElement extends HTMLElement {
        draggables: HTMLEDraggableElement[];
        selectedDraggables: HTMLEDraggableElement[];
        label: string;
    }
    class BaseHTMLEDragzoneElement extends HTMLElement implements HTMLEDragzoneElement {
        label: string;
        draggables: HTMLEDraggableElement[];
        constructor();
        get selectedDraggables(): HTMLEDraggableElement[];
        connectedCallback(): void;
    }
    global {
        interface HTMLElementTagNameMap {
            "e-dragzone": HTMLEDragzoneElement;
        }
    }
}
declare module "engine/editor/elements/lib/controls/draggable/Draggable" {
    export { isHTMLEDraggableElement };
    export { HTMLEDraggableElement };
    export { BaseHTMLEDraggableElement };
    function isHTMLEDraggableElement(obj: any): obj is HTMLEDraggableElement;
    interface HTMLEDraggableElement extends HTMLElement {
        selected: boolean;
        dragged: boolean;
        type: string;
        dragovered: boolean;
    }
    class BaseHTMLEDraggableElement extends HTMLElement implements HTMLEDraggableElement {
        selected: boolean;
        dragovered: boolean;
        dragged: boolean;
        disabled: boolean;
        type: string;
        constructor();
        connectedCallback(): void;
    }
    global {
        interface HTMLElementTagNameMap {
            "e-draggable": HTMLEDraggableElement;
        }
    }
}
declare module "engine/editor/elements/lib/controls/draggable/Dropzone" {
    import { HTMLEDraggableElement } from "engine/editor/elements/lib/controls/draggable/Draggable";
    export { DataTransferEvent };
    export { isHTMLEDropzoneElement };
    export { HTMLEDropzoneElement };
    export { BaseHTMLEDropzoneElement };
    function isHTMLEDropzoneElement(obj: any): obj is HTMLEDropzoneElement;
    interface HTMLEDropzoneElement extends HTMLElement {
        selectedDraggables: HTMLEDraggableElement[];
        draggables: HTMLEDraggableElement[];
        dragovered: DropzoneDragoveredType | null;
        multiple: boolean;
        disabled: boolean;
        droptest: ((draggables: HTMLEDraggableElement[]) => void) | null;
        addDraggables(draggables: HTMLEDraggableElement[], position: number): void;
        removeDraggables(draggables: HTMLEDraggableElement[]): void;
    }
    type DropzoneDragoveredType = "self" | "draggable" | "appendarea";
    type DataTransferEvent = CustomEvent<{
        draggables: HTMLEDraggableElement[];
        position: number;
        success: boolean;
        statusText: string;
    }>;
    class BaseHTMLEDropzoneElement extends HTMLElement implements HTMLEDropzoneElement {
        dragovered: DropzoneDragoveredType | null;
        placeholder: string;
        multiple: boolean;
        disabled: boolean;
        droptest: ((draggables: HTMLEDraggableElement[]) => void) | null;
        value: any;
        draggables: HTMLEDraggableElement[];
        constructor();
        get selectedDraggables(): HTMLEDraggableElement[];
        connectedCallback(): void;
        attributeChangedCallback(name: string, oldValue: string, newValue: string): void;
        addDraggables(draggables: HTMLEDraggableElement[], position: number): HTMLEDraggableElement[] | null;
        removeDraggables(draggables: HTMLEDraggableElement[]): void;
    }
    global {
        interface HTMLElementTagNameMap {
            "e-dropzone": HTMLEDropzoneElement;
        }
    }
    global {
        interface HTMLElementEventMap {
            "datatransfer": DataTransferEvent;
            "dataclear": Event;
        }
    }
}
declare module "engine/editor/elements/lib/containers/duplicable/Duplicable" {
    export { HTMLEDuplicableElementBase };
    export { HTMLEDuplicableElement };
    export { isHTMLEDuplicableElement };
    function isHTMLEDuplicableElement(elem: any): elem is HTMLEDuplicableElement;
    interface HTMLEDuplicableElement {
        duplicate(count: number): void;
    }
    class HTMLEDuplicableElementBase extends HTMLElement implements HTMLEDuplicableElement {
        name: string;
        prototype: Element | null;
        input: HTMLInputElement | null;
        constructor();
        connectedCallback(): void;
        duplicate(count: number): void;
    }
}
declare module "engine/libs/maths/MathError" {
    export class MathError extends Error {
        name: string;
    }
}
declare module "engine/libs/patterns/injectors/Injector" {
    export { Injector };
    export { InjectorBase };
    export { Inject };
    export { Register };
    interface InjectorConstructor {
        readonly prototype: Injector;
        new <C extends Constructor<any>>(args: {
            defaultCtor: C;
            onDefaultOverride: (constructor: C) => void;
        }): Injector<C>;
    }
    interface Injector<C extends Constructor<any> = Constructor<any>> {
        readonly defaultCtor: C;
        overrideDefaultCtor(constructor: C): void;
        forceQualifier(qualifier: string): void;
        unforceQualifier(): void;
        getConstructor(qualifier?: string): C;
        inject(args?: {
            qualifier?: string;
            args?: ConstructorParameters<C>;
        }): InstanceType<C>;
        register(constructor: C, qualifier: string): void;
    }
    class InjectorBase<C extends Constructor<any> = Constructor<any>> implements Injector<C> {
        private _forcedQualifier?;
        private _constructors;
        private _defaultCtor;
        private _onDefaultOverride;
        get defaultCtor(): C;
        overrideDefaultCtor(constructor: C): void;
        constructor(args: {
            defaultCtor: C;
            onDefaultOverride: (constructor: C) => void;
        });
        forceQualifier(qualifier: string): void;
        unforceQualifier(): void;
        getConstructor(qualifier?: string): C;
        inject(args?: {
            qualifier?: string;
            args?: ConstructorParameters<C>;
        }): InstanceType<C>;
        register(constructor: C, qualifier: string): void;
    }
    const Injector: InjectorConstructor;
    type UnwrappedInjectorConstructor<I> = I extends Injector<infer C> ? C : never;
    interface RegisterDecorator {
        <I extends Injector>(injector: I, qualifier?: string): <C extends UnwrappedInjectorConstructor<I>>(ctor: C) => C;
    }
    const Register: RegisterDecorator;
    function Inject<I extends Injector, P extends ConstructorParameters<UnwrappedInjectorConstructor<I>>>(injector: I, options?: {
        qualifier?: string;
        args?: P;
    }): any;
}
declare module "engine/libs/maths/algebra/vectors/Vector2" {
    import { Injector } from "engine/libs/patterns/injectors/Injector";
    export { Vector2Values };
    export { Vector2Injector };
    export { Vector2 };
    export { Vector2Base };
    type Vector2Values = [number, ...number[]] & {
        length: 2;
    };
    interface Vector2Constructor {
        readonly prototype: Vector2;
        new (): Vector2;
        new (values: Vector2Values): Vector2;
        new (values?: Vector2Values): Vector2;
    }
    interface Vector2 {
        readonly array: ArrayLike<number>;
        values: Vector2Values;
        x: number;
        y: number;
        setValues(v: Vector2Values): this;
        setArray(array: WritableArrayLike<number>): this;
        copy(vec: Vector2): this;
        clone(): this;
        equals(vec: Vector2): boolean;
        setZeros(): this;
        add(vec: Vector2): this;
        addScalar(k: number): this;
        sub(vec: Vector2): this;
        lerp(vec: Vector2, t: number): this;
        clamp(min: Vector2, max: Vector2): this;
        multScalar(k: number): this;
        cross(vec: Vector2): number;
        dot(vec: Vector2): number;
        len(): number;
        lenSq(): number;
        dist(vec: Vector2): number;
        distSq(vec: Vector2): number;
        normalize(): this;
        negate(): this;
        mult(vec: Vector2): this;
        addScaled(vec: Vector2, k: number): this;
        copyAndSub(vecA: Vector2, vecB: Vector2): this;
        writeIntoArray(out: WritableArrayLike<number>, offset?: number): void;
        readFromArray(arr: ArrayLike<number>, offset?: number): this;
    }
    class Vector2Base {
        protected _array: WritableArrayLike<number>;
        constructor();
        constructor(values: Vector2Values);
        get array(): ArrayLike<number>;
        get values(): Vector2Values;
        set values(values: Vector2Values);
        get x(): number;
        set x(x: number);
        get y(): number;
        set y(y: number);
        setArray(array: WritableArrayLike<number>): this;
        setValues(v: Vector2Values): this;
        equals(vec: Vector2Base): boolean;
        copy(vec: Vector2Base): this;
        clone(): this;
        setZeros(): this;
        add(vec: Vector2Base): this;
        addScalar(k: number): this;
        sub(vec: Vector2Base): this;
        lerp(vec: Vector2Base, t: number): this;
        clamp(min: Vector2Base, max: Vector2Base): this;
        multScalar(k: number): this;
        cross(vec: Vector2Base): number;
        dot(vec: Vector2Base): number;
        len(): number;
        lenSq(): number;
        dist(vec: Vector2Base): number;
        distSq(vec: Vector2Base): number;
        normalize(): this;
        negate(): this;
        mult(vec: Vector2Base): this;
        addScaled(vec: Vector2Base, k: number): this;
        writeIntoArray(out: WritableArrayLike<number>, offset?: number): void;
        readFromArray(arr: ArrayLike<number>, offset?: number): this;
        copyAndSub(vecA: Vector2Base, vecB: Vector2Base): this;
    }
    var Vector2: Vector2Constructor;
    const Vector2Injector: Injector<Vector2Constructor>;
}
declare module "engine/core/input/Input" {
    import { Vector2 } from "engine/libs/maths/algebra/vectors/Vector2";
    export { Key };
    export { KeyModifier };
    export { HotKey };
    export { MouseButton };
    export { Input };
    enum Key {
        A = "a",
        Z = "z",
        Q = "q",
        S = "s",
        D = "d",
        V = "v",
        ENTER = "Enter",
        BACKSPACE = "Backspace",
        ARROW_DOWN = "ArrowDown",
        ARROW_LEFT = "ArrowLeft",
        ARROW_RIGHT = "ArrowRight",
        ARROW_UP = "ArrowUp",
        SHIFT = "Shift"
    }
    enum KeyModifier {
        Alt = "Alt",
        Control = "Control",
        Shift = "Shift"
    }
    enum MouseButton {
        LEFT = 1,
        WHEEL = 2,
        RIGHT = 3,
        FORWARD = 4,
        BACK = 5
    }
    class HotKey {
        readonly key: Key;
        readonly mod1?: KeyModifier;
        readonly mod2?: KeyModifier;
        constructor(key: Key, mod1?: KeyModifier, mod2?: KeyModifier);
        toString(): string;
        test(event: KeyboardEvent): boolean;
    }
    class Input {
        private static readonly keysCount;
        private static readonly mouseButtonsCount;
        private static readonly keyFlags;
        private static readonly mouseFlags;
        private static readonly mousePos;
        private static wheelDelta;
        static clear(): void;
        private static initializePointerHandlers;
        private static initializeKeyboardHandlers;
        static initialize(elem: HTMLElement): void;
        static getKey(key: Key): boolean;
        static getKeyUp(key: Key): boolean;
        static getKeyDown(key: Key): boolean;
        static getMouseButton(button: MouseButton): boolean;
        static getMouseButtonPosition(): Vector2;
        static getWheelDelta(): number;
        static getMouseButtonDown(button: MouseButton): boolean;
        static getMouseButtonUp(button: MouseButton): boolean;
    }
}
declare module "engine/libs/patterns/commands/Command" {
    export { isCommand };
    export { isUndoCommand };
    export { Command };
    export { UndoCommand };
    function isCommand(obj: any): obj is Command;
    function isUndoCommand(obj: any): obj is UndoCommand;
    interface Command {
        exec: (args?: any) => void;
        undo?: (args?: any) => void;
    }
    interface UndoCommand {
        exec: (args?: any) => void;
        undo: (args?: any) => void;
    }
}
declare module "engine/libs/patterns/messaging/events/EventDispatcher" {
    export { Event };
    export { EventDispatcher };
    export { EventDispatcherBase };
    export { EventsMap };
    type Event = {
        data: any;
    };
    type EventsMap = {
        [key: string]: Event;
    };
    interface EventDispatcher<M> {
        addEventListener<K extends keyof M & string>(event: K, callback: (event: M[K]) => void, once?: boolean): (event: M[K]) => void;
        addEventListener(event: string, callback: (event: Event) => void, once?: boolean): (event: Event) => void;
        removeEventListener<K extends keyof M & string>(event: K, callback: (event: M[K]) => void): number;
        removeEventListener(event: string, callback: (event: Event) => void): number;
        dispatchEvent<K extends keyof M & string>(name: K, event: M[K]): void;
        dispatchEvent(name: string, event: Event): void;
    }
    interface EventDispatcherConstructor {
        readonly prototype: EventDispatcher<EventsMap>;
        new <M = EventsMap>(): EventDispatcher<M>;
    }
    class EventDispatcherBase<M> implements EventDispatcher<M> {
        private _listeners;
        constructor();
        addEventListener(event: string, callback: (event: any) => void, once?: boolean): (event: Event) => void;
        addEventListener<K extends keyof M>(event: K, callback: (event: M[K]) => void, once?: boolean): (event: M[K]) => void;
        removeEventListener(event: string, callback: (event: any) => void, once?: boolean): number;
        removeEventListener<K extends keyof M>(event: K, callback: (event: M[K]) => void, once?: boolean): number;
        dispatchEvent(name: string, event: any): void;
        dispatchEvent<K extends keyof M>(name: K, event: M[K]): void;
    }
    const EventDispatcher: EventDispatcherConstructor;
}
declare module "engine/resources/ResourceError" {
    export class RessourceError extends Error {
        name: string;
    }
}
declare module "engine/resources/ResourceFetcher" {
    export { ResourceFetcher };
    const ResourceFetcher: Readonly<{
        fetchArrayBuffer(url: string): Promise<ArrayBuffer>;
        fetchTextFile(url: string): Promise<string>;
        fetchJSON<T>(url: string): Promise<T>;
        fetchImage(url: string): Promise<HTMLImageElement>;
    }>;
}
declare module "engine/editor/elements/lib/containers/menus/MenuBar" {
    import { HTMLEMenuItemElement } from "engine/editor/elements/lib/containers/menus/MenuItem";
    export { isHTMLEMenuBarElement };
    export { HTMLEMenuBarElement };
    export { BaseHTMLEMenuBarElement };
    function isHTMLEMenuBarElement(elem: any): elem is HTMLEMenuBarElement;
    interface HTMLEMenuBarElement extends HTMLElement {
        name: string;
        active: boolean;
        items: HTMLEMenuItemElement[];
        readonly activeIndex: number;
        readonly activeItem: HTMLEMenuItemElement | null;
        focusItemAt(index: number, childMenu?: boolean): void;
        focusItem(predicate: (item: HTMLEMenuItemElement) => boolean, subtree?: boolean): void;
        reset(): void;
        findItem(predicate: (item: HTMLEMenuItemElement) => boolean, subtree?: boolean): HTMLEMenuItemElement | null;
    }
    class BaseHTMLEMenuBarElement extends HTMLElement implements HTMLEMenuBarElement {
        name: string;
        active: boolean;
        items: HTMLEMenuItemElement[];
        private _activeIndex;
        constructor();
        get activeIndex(): number;
        get activeItem(): HTMLEMenuItemElement | null;
        connectedCallback(): void;
        focusItemAt(index: number, childMenu?: boolean): void;
        focusItem(predicate: (item: HTMLEMenuItemElement) => boolean, subtree?: boolean): void;
        reset(): void;
        findItem(predicate: (item: HTMLEMenuItemElement) => boolean, subtree?: boolean): HTMLEMenuItemElement | null;
    }
    global {
        interface HTMLElementTagNameMap {
            "e-menubar": HTMLEMenuBarElement;
        }
    }
}
declare module "engine/editor/elements/lib/containers/status/StatusItem" {
    export { HTMLEStatusItemElement };
    export { isHTMLEStatusItemElement };
    type EStatusElementType = "button" | "widget";
    function isHTMLEStatusItemElement(elem: Element): elem is HTMLEStatusItemElement;
    class HTMLEStatusItemElement extends HTMLElement {
        name: string;
        type: EStatusElementType;
        icon: string;
        command: string | null;
        private _stateMap;
        get stateMap(): ((state: any) => {
            content: string;
        }) | null;
        set stateMap(stateMap: ((state: any) => {
            content: string;
        }) | null);
        update(newValue: any): void;
        constructor();
        activate(): void;
        connectedCallback(): void;
    }
}
declare module "engine/editor/elements/lib/containers/status/StatusBar" {
    import { HTMLEStatusItemElement } from "engine/editor/elements/lib/containers/status/StatusItem";
    export { HTMLEStatusBarElement };
    export { isHTMLEStatusBarElement };
    function isHTMLEStatusBarElement(elem: Element): elem is HTMLEStatusBarElement;
    class HTMLEStatusBarElement extends HTMLElement {
        name: string;
        active: boolean;
        items: HTMLEStatusItemElement[];
        _selectedItemIndex: number;
        constructor();
        connectedCallback(): void;
        get selectedItemIndex(): number;
        get selectedItem(): HTMLEStatusItemElement | null;
        insertItem(index: number, item: HTMLEStatusItemElement): void;
        findItem(predicate: (item: HTMLEStatusItemElement) => boolean): HTMLEStatusItemElement | null;
        findItems(predicate: (item: HTMLEStatusItemElement) => boolean): HTMLEStatusItemElement[];
        selectItem(index: number): void;
        clearSelection(): void;
    }
}
declare module "engine/editor/elements/lib/containers/menus/MenuItemGroup" {
    import { HTMLEMenuItemElement } from "engine/editor/elements/lib/containers/menus/MenuItem";
    import { HTMLEMenuElement } from "engine/editor/elements/lib/containers/menus/Menu";
    export { isHTMLEMenuItemGroupElement };
    export { HTMLEMenuItemGroupElement };
    export { BaseHTMLEMenuItemGroupElement };
    function isHTMLEMenuItemGroupElement(elem: any): elem is HTMLEMenuItemGroupElement;
    interface HTMLEMenuItemGroupElement extends HTMLElement {
        name: string;
        label: string;
        type: "list" | "grid";
        rows: number;
        cells: number;
        parentMenu: HTMLEMenuElement | null;
        items: HTMLEMenuItemElement[];
        readonly activeIndex: number;
        readonly activeItem: HTMLEMenuItemElement | null;
        focusItemAt(index: number, childMenu?: boolean): void;
        reset(): void;
        focusItem(predicate: (item: HTMLEMenuItemElement) => boolean, subitems?: boolean): void;
        findItem(predicate: (item: HTMLEMenuItemElement) => boolean, subitems?: boolean): HTMLEMenuItemElement | null;
    }
    class BaseHTMLEMenuItemGroupElement extends HTMLElement implements HTMLEMenuItemGroupElement {
        name: string;
        label: string;
        type: "list" | "grid";
        rows: number;
        cells: number;
        parentMenu: HTMLEMenuElement | null;
        items: HTMLEMenuItemElement[];
        private _activeIndex;
        constructor();
        get activeIndex(): number;
        get activeItem(): HTMLEMenuItemElement | null;
        connectedCallback(): void;
        attributeChangedCallback(name: string, oldValue: string, newValue: string): void;
        focusItemAt(index: number, childMenu?: boolean): void;
        reset(): void;
        focusItem(predicate: (item: HTMLEMenuItemElement) => boolean, subitems?: boolean): void;
        findItem(predicate: (item: HTMLEMenuItemElement) => boolean, subitems?: boolean): HTMLEMenuItemElement | null;
    }
    global {
        interface HTMLElementTagNameMap {
            "e-menuitemgroup": HTMLEMenuItemGroupElement;
        }
    }
}
declare module "engine/editor/templates/menus/MenuItemGroupTemplate" {
    import { HTMLEMenuItemGroupElement } from "engine/editor/elements/lib/containers/menus/MenuItemGroup";
    import { HTMLEMenuItemTemplateDescription } from "engine/editor/templates/menus/MenuItemTemplate";
    export { HTMLEMenuItemGroupTemplateDescription };
    export { HTMLEMenuItemGroupTemplate };
    type HTMLEMenuItemGroupTemplateDescription = Partial<Pick<HTMLEMenuItemGroupElement, 'id' | 'className' | 'name' | 'label'>> & {
        isGroup: true;
        items: HTMLEMenuItemTemplateDescription[];
    };
    interface HTMLEMenuItemGroupTemplate {
        (desc: HTMLEMenuItemGroupTemplateDescription): HTMLEMenuItemGroupElement;
    }
    const HTMLEMenuItemGroupTemplate: HTMLEMenuItemGroupTemplate;
}
declare module "engine/editor/templates/menus/MenuTemplate" {
    import { HTMLEMenuElement } from "engine/editor/elements/lib/containers/menus/Menu";
    import { HTMLEMenuItemGroupTemplateDescription } from "engine/editor/templates/menus/MenuItemGroupTemplate";
    import { HTMLEMenuItemTemplateDescription } from "engine/editor/templates/menus/MenuItemTemplate";
    export { HTMLEMenuTemplateDescription };
    export { HTMLEMenuTemplate };
    type HTMLEMenuTemplateDescription = Partial<Pick<HTMLEMenuElement, 'id' | 'className' | 'name'>> & {
        items: (HTMLEMenuItemTemplateDescription | HTMLEMenuItemGroupTemplateDescription)[];
    };
    interface HTMLEMenuTemplate {
        (desc: HTMLEMenuTemplateDescription): HTMLEMenuElement;
    }
    const HTMLEMenuTemplate: HTMLEMenuTemplate;
}
declare module "engine/editor/templates/menus/MenuItemTemplate" {
    import { Key, KeyModifier } from "engine/core/input/Input";
    import { HTMLEMenuItemElement } from "engine/editor/elements/lib/containers/menus/MenuItem";
    import { HTMLEMenuTemplateDescription } from "engine/editor/templates/menus/MenuTemplate";
    export { HTMLEMenuItemTemplateDescription };
    export { HTMLEMenuItemTemplate };
    type HTMLEMenuItemTemplateDescription = Pick<HTMLEMenuItemElement, 'name'> & Partial<Pick<HTMLEMenuItemElement, 'id' | 'className' | 'title' | 'type' | 'disabled'>> & {
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
        menu?: HTMLEMenuTemplateDescription;
        disabled?: boolean;
    };
    interface HTMLEMenuItemTemplate {
        (args: HTMLEMenuItemTemplateDescription): HTMLEMenuItemElement;
    }
    const HTMLEMenuItemTemplate: HTMLEMenuItemTemplate;
}
declare module "engine/editor/templates/menus/MenubarTemplate" {
    import { HTMLEMenuBarElement } from "engine/editor/elements/lib/containers/menus/MenuBar";
    import { HTMLEMenuItemTemplateDescription } from "engine/editor/templates/menus/MenuItemTemplate";
    export { HTMLEMenubarTemplateDescription };
    export { HTMLEMenubarTemplate };
    type HTMLEMenubarTemplateDescription = Partial<Pick<HTMLEMenuBarElement, 'id' | 'className' | 'tabIndex'>> & {
        items: HTMLEMenuItemTemplateDescription[];
    };
    interface HTMLEMenubarTemplate {
        (desc: HTMLEMenubarTemplateDescription): HTMLEMenuBarElement;
    }
    const HTMLEMenubarTemplate: HTMLEMenubarTemplate;
}
declare module "engine/editor/Editor" {
    import { HotKey } from "engine/core/input/Input";
    import { Command } from "engine/libs/patterns/commands/Command";
    import { EventDispatcher } from "engine/libs/patterns/messaging/events/EventDispatcher";
    import { HTMLEMenuBarElement } from "engine/editor/elements/lib/containers/menus/MenuBar";
    import { HTMLEStatusBarElement } from "engine/editor/elements/lib/containers/status/StatusBar";
    export { editor };
    export { Editor };
    export { EditorBase };
    export { EditorCommand };
    export { EditorHotKey };
    interface EditorEventsMap {
        "contextenter": {
            data: {
                value: any;
            };
        };
        "contextleave": {
            data: {
                value: any;
            };
        };
        "statechange": {
            data: {
                value: any;
            };
        };
    }
    interface Editor extends EventDispatcher<EditorEventsMap> {
        getState(key: string): any;
        setState(key: string, value: any): void;
        addStateListener(statekey: string, listener: (newValue: any) => void): number;
        removeStateListener(statekey: string, listener: (newValue: any) => void): void;
        addHotkeyExec(hotkey: EditorHotKey, exec: () => void): void;
        removeHotkeyExec(hotkey: EditorHotKey, exec: () => void): void;
        readonly statusbar: HTMLEStatusBarElement | null;
        readonly menubar: HTMLEMenuBarElement | null;
        registerCommand(name: string, command: EditorCommand): void;
        executeCommand(name: string, args?: any, opts?: {
            undo?: boolean;
        }): void;
        undoLastCommand(): void;
        redoLastCommand(): void;
        setContext(context: string): void;
        setup(): Promise<void>;
        reloadState(): Promise<void>;
    }
    interface EditorCommand extends Command {
        context: string;
    }
    interface EditorHotKey extends HotKey {
    }
    class EditorBase extends EventDispatcher<EditorEventsMap> implements Editor {
        private _commands;
        private _hotkeys;
        private _undoCommandsCallStack;
        private _redoCommandsCallStack;
        private _context;
        private _state;
        private _stateListeners;
        menubar: HTMLEMenuBarElement | null;
        statusbar: HTMLEStatusBarElement | null;
        constructor();
        get context(): string;
        setup(): Promise<any>;
        reloadState(): Promise<void>;
        setContext(context: string): void;
        getState(key: string): any;
        setState(key: string, value: any): void;
        addStateListener(statekey: string, listener: (newValue: any) => void): number;
        removeStateListener(statekey: string, listener: (newValue: any) => void): void;
        registerCommand(name: string, command: EditorCommand): void;
        executeCommand(name: string, args?: any, opts?: {
            undo?: boolean;
        }): void;
        undoLastCommand(): void;
        redoLastCommand(): void;
        addHotkeyExec(hotkey: EditorHotKey, exec: () => void): number;
        removeHotkeyExec(hotkey: EditorHotKey, exec: () => void): void;
    }
    var editor: Editor;
}
declare module "engine/editor/elements/lib/containers/menus/MenuItem" {
    import { HotKey } from "engine/core/input/Input";
    import { HTMLEMenuElement } from "engine/editor/elements/lib/containers/menus/Menu";
    import { HTMLEMenuBarElement } from "engine/editor/elements/lib/containers/menus/MenuBar";
    import { HTMLEMenuItemGroupElement } from "engine/editor/elements/lib/containers/menus/MenuItemGroup";
    export { isHTMLEMenuItemElement };
    export { HTMLEMenuItemElement };
    export { BaseHTMLEMenuItemElement };
    type EMenuItemElementType = "button" | "radio" | "checkbox" | "menu" | "submenu";
    function isHTMLEMenuItemElement(obj: any): obj is HTMLEMenuItemElement;
    interface HTMLEMenuItemElement extends HTMLElement {
        name: string;
        label: string;
        type: EMenuItemElementType;
        disabled: boolean;
        checked: boolean;
        value: string;
        icon: string;
        group: HTMLEMenuItemGroupElement | null;
        parentMenu: HTMLEMenuElement | HTMLEMenuBarElement | null;
        childMenu: HTMLEMenuElement | null;
        hotkey: HotKey | null;
        command: string | null;
        commandArgs: any;
        trigger(): void;
    }
    class BaseHTMLEMenuItemElement extends HTMLElement implements HTMLEMenuItemElement {
        name: string;
        label: string;
        type: EMenuItemElementType;
        disabled: boolean;
        checked: boolean;
        value: string;
        icon: string;
        group: HTMLEMenuItemGroupElement | null;
        parentMenu: HTMLEMenuElement | HTMLEMenuBarElement | null;
        childMenu: HTMLEMenuElement | null;
        command: string | null;
        commandArgs: any;
        private _hotkey;
        private _hotkeyExec;
        constructor();
        get hotkey(): HotKey | null;
        set hotkey(hotkey: HotKey | null);
        connectedCallback(): void;
        disconnectedCallback(): void;
        attributeChangedCallback(name: string, oldValue: string, newValue: string): void;
        trigger(): void;
    }
    global {
        interface HTMLElementTagNameMap {
            "e-menuitem": HTMLEMenuItemElement;
        }
    }
}
declare module "engine/editor/elements/lib/containers/menus/Menu" {
    import { HTMLEMenuItemElement } from "engine/editor/elements/lib/containers/menus/MenuItem";
    import { HTMLEMenuItemGroupElement } from "engine/editor/elements/lib/containers/menus/MenuItemGroup";
    export { isHTMLEMenuElement };
    export { HTMLEMenuElement };
    export { BaseHTMLEMenuElement };
    function isHTMLEMenuElement(elem: any): elem is HTMLEMenuElement;
    interface HTMLEMenuElement extends HTMLElement {
        name: string;
        expanded: boolean;
        overflowing: boolean;
        parentItem: HTMLEMenuItemElement | null;
        items: (HTMLEMenuItemElement | HTMLEMenuItemGroupElement)[];
        readonly activeIndex: number;
        readonly activeItem: HTMLEMenuItemElement | HTMLEMenuItemGroupElement | null;
        focusItemAt(index: number, childMenu?: boolean): void;
        focusItem(predicate: (item: HTMLEMenuItemElement) => boolean, subitems?: boolean): void;
        reset(): void;
        findItem(predicate: (item: HTMLEMenuItemElement) => boolean, subitems?: boolean): HTMLEMenuItemElement | null;
    }
    class BaseHTMLEMenuElement extends HTMLElement implements HTMLEMenuElement {
        name: string;
        expanded: boolean;
        overflowing: boolean;
        parentItem: HTMLEMenuItemElement | null;
        items: (HTMLEMenuItemElement | HTMLEMenuItemGroupElement)[];
        private _activeIndex;
        constructor();
        get activeIndex(): number;
        get activeItem(): HTMLEMenuItemElement | HTMLEMenuItemGroupElement | null;
        connectedCallback(): void;
        attributeChangedCallback(name: string, oldValue: string, newValue: string): void;
        focusItemAt(index: number, childMenu?: boolean): void;
        focusItem(predicate: (item: HTMLEMenuItemElement) => boolean, subitems?: boolean): void;
        reset(): void;
        findItem(predicate: (item: HTMLEMenuItemElement) => boolean, subitems?: boolean): HTMLEMenuItemElement | null;
    }
    global {
        interface HTMLElementTagNameMap {
            "e-menu": HTMLEMenuElement;
        }
    }
}
declare module "engine/editor/elements/lib/containers/tabs/TabPanel" {
    export { isHTMLETabPanelElement };
    export { HTMLETabPanelElement };
    export { BaseHTMLETabPanelElement };
    interface HTMLETabPanelElement extends HTMLElement {
        name: string;
    }
    function isHTMLETabPanelElement(obj: any): obj is BaseHTMLETabPanelElement;
    class BaseHTMLETabPanelElement extends HTMLElement implements HTMLETabPanelElement {
        name: string;
        constructor();
        connectedCallback(): void;
    }
}
declare module "engine/editor/elements/lib/containers/tabs/TabList" {
    import { HTMLETabElement } from "engine/editor/elements/lib/containers/tabs/Tab";
    export { TabChangeEvent };
    export { HTMLETabListElement };
    export { BaseHTMLETabListElement };
    interface HTMLETabListElement extends HTMLElement {
        readonly activeTab: HTMLETabElement | null;
        tabs: HTMLETabElement[];
    }
    type TabChangeEvent = CustomEvent<{
        tab: HTMLETabElement;
    }>;
    class BaseHTMLETabListElement extends HTMLElement implements HTMLETabListElement {
        tabs: HTMLETabElement[];
        private _activeIndex;
        constructor();
        get activeTab(): HTMLETabElement | null;
        connectedCallback(): void;
        findTab(predicate: (tab: HTMLETabElement) => boolean): HTMLETabElement | null;
        activateTab(predicate: (tab: HTMLETabElement) => boolean): void;
    }
}
declare module "engine/editor/elements/lib/containers/tabs/Tab" {
    import { HTMLETabPanelElement } from "engine/editor/elements/lib/containers/tabs/TabPanel";
    export { isHTMLETabElement };
    export { HTMLETabElement };
    export { BaseHTMLETabElement };
    function isHTMLETabElement(obj: any): obj is HTMLETabElement;
    interface HTMLETabElement extends HTMLElement {
        name: string;
        active: boolean;
        disabled: boolean;
        controls: string;
        panel: HTMLETabPanelElement | null;
    }
    class BaseHTMLETabElement extends HTMLElement implements HTMLETabElement {
        name: string;
        disabled: boolean;
        active: boolean;
        controls: string;
        panel: HTMLETabPanelElement | null;
        constructor();
        connectedCallback(): void;
        attributeChangedCallback(name: string, oldValue: string, newValue: string): void;
    }
}
declare module "engine/editor/elements/lib/utils/Import" {
    export { isHTMLEImportElement };
    export { HTMLEImportElement };
    export { BaseHTMLEImportElement };
    function isHTMLEImportElement(obj: any): obj is HTMLEImportElement;
    interface HTMLEImportElement extends HTMLElement {
        src: string;
    }
    class BaseHTMLEImportElement extends HTMLElement {
        src: string;
        constructor();
        connectedCallback(): void;
    }
}
declare module "engine/editor/elements/lib/controls/breadcrumb/BreadcrumbTrail" {
    import { HTMLEBreadcrumbItemElement } from "engine/editor/elements/lib/controls/breadcrumb/BreadcrumbItem";
    export { isHTMLEBreadcrumbTrailElement };
    export { HTMLEBreadcrumbTrailElement };
    function isHTMLEBreadcrumbTrailElement(obj: any): obj is HTMLEBreadcrumbTrailElement;
    class HTMLEBreadcrumbTrailElement extends HTMLElement {
        items: HTMLEBreadcrumbItemElement[];
        constructor();
        activateItem(item: HTMLEBreadcrumbItemElement): void;
        connectedCallback(): void;
    }
}
declare module "engine/editor/elements/lib/controls/breadcrumb/BreadcrumbItem" {
    export { isHTMLEBreadcrumbItemElement };
    export { HTMLEBreadcrumbItemElement };
    function isHTMLEBreadcrumbItemElement(obj: any): obj is HTMLEBreadcrumbItemElement;
    class HTMLEBreadcrumbItemElement extends HTMLElement {
        label: string;
        active: boolean;
        constructor();
        connectedCallback(): void;
        attributeChangedCallback(name: string, oldValue: string, newValue: string): void;
    }
}
declare module "engine/editor/objects/StructuredFormData" {
    export { StructuredFormData };
    class StructuredFormData {
        form: HTMLFormElement;
        constructor(form: HTMLFormElement);
        getStructuredFormData(): {};
    }
}
declare module "engine/editor/templates/other/DraggableInputTemplate" {
    import { HTMLEDraggableElement } from "engine/editor/elements/lib/controls/draggable/Draggable";
    export { HTMLDraggableInputTemplateDescription };
    export { HTMLDraggableInputTemplate };
    type HTMLDraggableInputTemplateDescription = Partial<Pick<HTMLEDraggableElement, 'id' | 'className'>> & Partial<Pick<HTMLInputElement, 'value' | 'name'>>;
    interface HTMLDraggableInputTemplate {
        (desc: HTMLDraggableInputTemplateDescription): HTMLEDraggableElement;
    }
    const HTMLDraggableInputTemplate: HTMLDraggableInputTemplate;
}
declare module "samples/scenes/Mockup" {
    import "engine/editor/elements/lib/containers/duplicable/Duplicable";
    import "engine/editor/elements/lib/containers/menus/Menu";
    import "engine/editor/elements/lib/containers/menus/MenuBar";
    import "engine/editor/elements/lib/containers/menus/MenuItem";
    import "engine/editor/elements/lib/containers/menus/MenuItemGroup";
    import "engine/editor/elements/lib/containers/tabs/Tab";
    import "engine/editor/elements/lib/containers/tabs/TabList";
    import "engine/editor/elements/lib/containers/tabs/TabPanel";
    import "engine/editor/elements/lib/controls/draggable/Draggable";
    import "engine/editor/elements/lib/controls/draggable/Dragzone";
    import "engine/editor/elements/lib/controls/draggable/Dropzone";
    import "engine/editor/elements/lib/utils/Import";
    import "engine/editor/elements/lib/controls/breadcrumb/BreadcrumbItem";
    import "engine/editor/elements/lib/controls/breadcrumb/BreadcrumbTrail";
    global {
        var marked: (src: string) => string;
    }
    export function mockup(): Promise<void>;
}
declare module "engine/libs/maths/Snippets" {
    export { deg2Rad };
    export { rad2Deg };
    export { qSqrt };
    export { pow2 };
    export { inRange };
    export { clamp };
    export { lerp };
    export { smoothstep };
    export { smootherstep };
    export { randInt };
    export { randFloat };
    export { randFloatSpread };
    export { degToRad };
    export { radToDeg };
    export { isPowerOfTwo };
    export { ceilPowerOfTwo };
    export { floorPowerOfTwo };
    const deg2Rad: (deg: number) => number;
    const rad2Deg: (rad: number) => number;
    const qSqrt: (x: number) => number;
    const pow2: (k: number) => number;
    const inRange: (x: number, min: number, max: number) => boolean;
    const clamp: (value: number, min: number, max: number) => number;
    const lerp: (x: number, y: number, t: number) => number;
    const smoothstep: (x: number, min: number, max: number) => number;
    const smootherstep: (x: number, min: number, max: number) => number;
    const randInt: (low: number, high: number) => number;
    const randFloat: (low: number, high: number) => number;
    const randFloatSpread: (range: number) => number;
    const degToRad: (degrees: number) => number;
    const radToDeg: (radians: number) => number;
    const isPowerOfTwo: (value: number) => boolean;
    const ceilPowerOfTwo: (value: number) => number;
    const floorPowerOfTwo: (value: number) => number;
}
declare module "engine/libs/maths/algebra/vectors/Vector3" {
    import { Injector } from "engine/libs/patterns/injectors/Injector";
    export { Vector3Values };
    export { Vector3Constructor };
    export { Vector3 };
    export { Vector3Base };
    export { Vector3Injector };
    type Vector3Values = [number, ...number[]] & {
        length: 3;
    };
    interface Vector3Constructor {
        readonly prototype: Vector3;
        new (): Vector3;
        new (values: Vector3Values): Vector3;
        new (values?: Vector3Values): Vector3;
    }
    interface Vector3 {
        readonly array: ArrayLike<number>;
        values: Vector3Values;
        x: number;
        y: number;
        z: number;
        setArray(array: WritableArrayLike<number>): this;
        setValues(v: Vector3Values): this;
        equals(vec: Vector3): boolean;
        copy(vec: Vector3): this;
        clone(): this;
        setZeros(): this;
        add(vec: Vector3): this;
        addScalar(k: number): this;
        sub(vec: Vector3): this;
        lerp(vec: Vector3, t: number): this;
        max(vecB: Vector3): this;
        min(vecB: Vector3): this;
        clamp(min: Vector3, max: Vector3): this;
        multScalar(k: number): this;
        cross(vec: Vector3): this;
        dot(vec: Vector3): number;
        len(): number;
        lenSq(): number;
        dist(vec: Vector3): number;
        distSq(vec: Vector3): number;
        normalize(): this;
        negate(): this;
        mult(vec: Vector3): this;
        addScaled(vec: Vector3, k: number): this;
        copyAndSub(vecA: Vector3, vecB: Vector3): this;
        copyAndCross(vecA: Vector3, vecB: Vector3): this;
        writeIntoArray(out: WritableArrayLike<number>, offset?: number): void;
        readFromArray(arr: ArrayLike<number>, offset?: number): this;
    }
    class Vector3Base {
        protected _array: WritableArrayLike<number>;
        constructor();
        constructor(values: Vector3Values);
        get array(): ArrayLike<number>;
        get values(): Vector3Values;
        set values(values: Vector3Values);
        get x(): number;
        set x(x: number);
        get y(): number;
        set y(y: number);
        get z(): number;
        set z(z: number);
        setArray(array: WritableArrayLike<number>): this;
        setValues(v: Vector3Values): this;
        copy(vec: Vector3): this;
        clone(): this;
        equals(vec: Vector3): boolean;
        setZeros(): this;
        add(vec: Vector3): this;
        addScalar(k: number): this;
        sub(vec: Vector3): this;
        lerp(vec: Vector3, t: number): this;
        max(vecB: Vector3): this;
        min(vecB: Vector3): this;
        clamp(min: Vector3, max: Vector3): this;
        multScalar(k: number): this;
        cross(vec: Vector3): this;
        dot(vec: Vector3): number;
        len(): number;
        lenSq(): number;
        dist(vec: Vector3): number;
        distSq(vec: Vector3): number;
        normalize(): this;
        negate(): this;
        mult(vec: Vector3): this;
        writeIntoArray(out: WritableArrayLike<number>, offset?: number): void;
        readFromArray(arr: ArrayLike<number>, offset?: number): this;
        addScaled(vec: Vector3, k: number): this;
        copyAndSub(vecA: Vector3, vecB: Vector3): this;
        copyAndCross(vecA: Vector3, vecB: Vector3): this;
    }
    var Vector3: Vector3Constructor;
    const Vector3Injector: Injector<Vector3Constructor>;
}
declare module "engine/libs/maths/algebra/matrices/Matrix3" {
    import { Injector } from "engine/libs/patterns/injectors/Injector";
    import { Vector2, Vector2Values } from "engine/libs/maths/algebra/vectors/Vector2";
    import { Vector3, Vector3Values } from "engine/libs/maths/algebra/vectors/Vector3";
    export { Matrix3Values };
    export { Matrix3 };
    export { Matrix3Injector };
    export { Matrix3Base };
    type Matrix3Values = [number, number, number, number, number, number, number, number, number];
    interface Matrix3Constructor {
        readonly prototype: Matrix3;
        new (): Matrix3;
        new (values: Matrix3Values): Matrix3;
        new (values?: Matrix3Values): Matrix3;
    }
    interface Matrix3 {
        readonly array: ArrayLike<number>;
        values: Matrix3Values;
        row1: Vector3Values;
        row2: Vector3Values;
        row3: Vector3Values;
        col1: Vector3Values;
        col2: Vector3Values;
        col3: Vector3Values;
        m11: number;
        m12: number;
        m13: number;
        m21: number;
        m22: number;
        m23: number;
        m31: number;
        m32: number;
        m33: number;
        setArray(array: WritableArrayLike<number>): this;
        setValues(m: Matrix3Values): this;
        getAt(idx: number): number;
        setAt(idx: number, val: number): this;
        getEntry(row: number, col: number): number;
        setEntry(row: number, col: number, val: number): this;
        getRow(idx: number): Vector3Values;
        setRow(idx: number, row: Vector3Values): this;
        getCol(idx: number): Vector3Values;
        setCol(idx: number, col: Vector3Values): this;
        equals(mat: Matrix3): boolean;
        copy(mat: Matrix3): this;
        clone(): this;
        det(): number;
        trace(): number;
        setIdentity(): this;
        setZeros(): this;
        negate(): this;
        transpose(): this;
        invert(): this;
        add(mat: Matrix3): this;
        sub(mat: Matrix3): this;
        mult(mat: Matrix3): this;
        multScalar(k: number): this;
        solve(vecB: Vector3): Vector3Values;
        solve2(vecB: Vector2): Vector2Values;
        writeIntoArray(out: WritableArrayLike<number>, offset?: number): void;
        readFromArray(arr: ArrayLike<number>, offset?: number): void;
    }
    class Matrix3Base {
        protected _array: WritableArrayLike<number>;
        constructor();
        constructor(values: Matrix3Values);
        get array(): ArrayLike<number>;
        get values(): Matrix3Values;
        set values(values: Matrix3Values);
        get row1(): Vector3Values;
        set row1(row1: Vector3Values);
        get row2(): Vector3Values;
        set row2(row2: Vector3Values);
        get row3(): Vector3Values;
        set row3(row3: Vector3Values);
        get col1(): Vector3Values;
        set col1(col1: Vector3Values);
        get col2(): Vector3Values;
        set col2(col2: Vector3Values);
        get col3(): Vector3Values;
        set col3(col3: Vector3Values);
        get m11(): number;
        set m11(m11: number);
        get m12(): number;
        set m12(m12: number);
        get m13(): number;
        set m13(m13: number);
        get m21(): number;
        set m21(m21: number);
        get m22(): number;
        set m22(m22: number);
        get m23(): number;
        set m23(m23: number);
        get m31(): number;
        set m31(m31: number);
        get m32(): number;
        set m32(m32: number);
        get m33(): number;
        set m33(m33: number);
        setArray(array: WritableArrayLike<number>): this;
        setValues(m: Matrix3Values): this;
        getRow(idx: number): Vector3Values;
        setRow(idx: number, row: Vector3Values): this;
        setCol(idx: number, col: Vector3Values): this;
        getCol(idx: number): Vector3Values;
        getAt(idx: number): number;
        setAt(idx: number, val: number): this;
        getEntry(row: number, col: number): number;
        setEntry(row: number, col: number, val: number): this;
        equals(mat: Matrix3): boolean;
        copy(mat: Matrix3): this;
        clone(): this;
        setIdentity(): this;
        setZeros(): this;
        det(): number;
        trace(): number;
        negate(): this;
        transpose(): this;
        invert(): this;
        add(mat: Matrix3): this;
        sub(mat: Matrix3Base): this;
        mult(mat: Matrix3): this;
        multScalar(k: number): this;
        writeIntoArray(out: WritableArrayLike<number>, offset?: number): void;
        readFromArray(arr: ArrayLike<number>, offset?: number): void;
        solve(vecB: Vector3): Vector3Values;
        solve2(vecB: Vector2): Vector2Values;
    }
    var Matrix3: Matrix3Constructor;
    const Matrix3Injector: Injector<Matrix3Constructor>;
}
declare module "engine/libs/maths/algebra/vectors/Vector4" {
    import { Injector } from "engine/libs/patterns/injectors/Injector";
    export { Vector4Values };
    export { Vector4 };
    export { Vector4Constructor };
    export { Vector4Injector };
    export { Vector4Base };
    type Vector4Values = [number, ...number[]] & {
        length: 4;
    };
    interface Vector4Constructor {
        readonly prototype: Vector4;
        new (): Vector4;
        new (values: Vector4Values): Vector4;
        new (values?: Vector4Values): Vector4;
    }
    interface Vector4 {
        readonly array: ArrayLike<number>;
        values: Vector4Values;
        x: number;
        y: number;
        z: number;
        w: number;
        setArray(array: WritableArrayLike<number>): this;
        setValues(v: Vector4Values): this;
        copy(vec: Vector4): this;
        clone(): this;
        equals(vec: Vector4): boolean;
        setZeros(): this;
        add(vec: Vector4): this;
        addScalar(k: number): this;
        sub(vec: Vector4): this;
        lerp(vec: Vector4, t: number): this;
        clamp(min: Vector4, max: Vector4): this;
        multScalar(k: number): this;
        dot(vec: Vector4): number;
        len(): number;
        lenSq(): number;
        dist(vec: Vector4): number;
        distSq(vec: Vector4): number;
        normalize(): this;
        negate(): this;
        mult(vec: Vector4): this;
        addScaled(vec: Vector4, k: number): this;
        writeIntoArray(out: WritableArrayLike<number>, offset?: number): void;
        readFromArray(arr: ArrayLike<number>, offset?: number): this;
    }
    class Vector4Base {
        protected _array: WritableArrayLike<number>;
        constructor();
        constructor(values: Vector4Values);
        get array(): ArrayLike<number>;
        get values(): Vector4Values;
        set values(values: Vector4Values);
        get x(): number;
        set x(x: number);
        get y(): number;
        set y(y: number);
        get z(): number;
        set z(z: number);
        get w(): number;
        set w(w: number);
        setArray(array: WritableArrayLike<number>): this;
        setValues(v: Vector4Values): this;
        copy(vec: Vector4): this;
        clone(): this;
        equals(vec: Vector4): boolean;
        setZeros(): this;
        add(vec: Vector4): this;
        addScalar(k: number): this;
        sub(vec: Vector4): this;
        lerp(vec: Vector4, t: number): this;
        clamp(min: Vector4, max: Vector4): this;
        multScalar(k: number): this;
        dot(vec: Vector4): number;
        len(): number;
        lenSq(): number;
        dist(vec: Vector4): number;
        distSq(vec: Vector4): number;
        normalize(): this;
        negate(): this;
        mult(vec: Vector4): this;
        addScaled(vec: Vector4, k: number): this;
        writeIntoArray(out: WritableArrayLike<number>, offset?: number): void;
        readFromArray(arr: ArrayLike<number>, offset?: number): this;
    }
    var Vector4: Vector4Constructor;
    const Vector4Injector: Injector<Vector4Constructor>;
}
declare module "engine/libs/maths/algebra/matrices/Matrix4" {
    import { Injector } from "engine/libs/patterns/injectors/Injector";
    import { Vector3 } from "engine/libs/maths/algebra/vectors/Vector3";
    import { Vector2 } from "engine/libs/maths/algebra/vectors/Vector2";
    import { Vector4 } from "engine/libs/maths/algebra/vectors/Vector4";
    export { Matrix4Values };
    export { Matrix4 };
    export { Matrix4Injector };
    export { Matrix4Base };
    type Vector2Values = [number, ...number[]] & {
        length: 2;
    };
    type Vector3Values = [number, ...number[]] & {
        length: 3;
    };
    type Vector4Values = [number, ...number[]] & {
        length: 4;
    };
    type Matrix3Values = [number, ...number[]] & {
        length: 9;
    };
    type Matrix34Values = [number, ...number[]] & {
        length: 12;
    };
    type Matrix4Values = [number, ...number[]] & {
        length: 16;
    };
    interface Matrix4Constructor {
        readonly prototype: Matrix4;
        new (): Matrix4;
        new (values: Matrix4Values): Matrix4;
        new (values?: Matrix4Values): Matrix4;
    }
    interface Matrix4 {
        readonly array: ArrayLike<number>;
        values: Matrix4Values;
        row1: Vector4Values;
        row2: Vector4Values;
        row3: Vector4Values;
        row4: Vector4Values;
        col1: Vector4Values;
        col2: Vector4Values;
        col3: Vector4Values;
        col4: Vector4Values;
        m11: number;
        m12: number;
        m13: number;
        m14: number;
        m21: number;
        m22: number;
        m23: number;
        m24: number;
        m31: number;
        m32: number;
        m33: number;
        m34: number;
        m41: number;
        m42: number;
        m43: number;
        m44: number;
        setArray(array: WritableArrayLike<number>): this;
        setValues(m: Matrix4Values): this;
        getAt(idx: number): number;
        setAt(idx: number, val: number): this;
        getEntry(row: number, col: number): number;
        setEntry(row: number, col: number, val: number): this;
        getRow(idx: number): Vector4Values;
        setRow(idx: number, row: Vector4Values): this;
        getCol(idx: number): Vector4Values;
        setCol(idx: number, col: Vector4Values): this;
        getUpper33(): Matrix3Values;
        setUpper33(m: Matrix3Values): this;
        getUpper34(): Matrix34Values;
        setUpper34(m: Matrix34Values): this;
        equals(mat: Matrix4): boolean;
        copy(mat: Matrix4): this;
        clone(): this;
        det(): number;
        trace(): number;
        setIdentity(): this;
        setZeros(): this;
        negate(): this;
        transpose(): this;
        invert(): this;
        add(mat: Matrix4): this;
        sub(mat: Matrix4): this;
        mult(mat: Matrix4): this;
        multScalar(k: number): this;
        getMaxScaleOnAxis(): number;
        solve(vecB: Vector4): Vector4Values;
        solve2(vecB: Vector2): Vector2Values;
        solve3(vecB: Vector3): Vector3Values;
        writeIntoArray(out: WritableArrayLike<number>, offset?: number): void;
        readFromArray(arr: ArrayLike<number>, offset?: number): this;
        setTranslation(vec: Vector3): this;
        translate(vec: Vector3): this;
        setRotationX(angleInRadians: number): this;
        rotateX(angleInRadians: number): this;
        setRotationY(angleInRadians: number): this;
        rotateY(angleInRadians: number): this;
        setRotationZ(angleInRadians: number): this;
        rotateZ(angleInRadians: number): this;
        rotate(x: number, y: number, z: number): this;
        axisRotation(axis: Vector3, angleInRadians: number): this;
        rotateAxis(axis: Vector3, angleInRadians: number): this;
        setScaling(vec: Vector3): this;
        scale(vec: Vector3): this;
        scaleScalar(k: number): this;
        lookAt(eye: Vector3 | Vector3Values, target: Vector3, up: Vector3): this;
        transformPoint(vec: Vector3): Vector3Values;
        transformDirection(vec: Vector3): Vector3Values;
        transformNormal(vec: Vector3): Vector3Values;
        asPerspective(fieldOfViewYInRadians: number, aspect: number, zNear: number, zFar: number): this;
        asOrthographic(left: number, right: number, bottom: number, top: number, near: number, far: number): this;
    }
    class Matrix4Base {
        protected _array: WritableArrayLike<number>;
        constructor();
        constructor(values: Matrix4Values);
        get array(): ArrayLike<number>;
        get values(): Matrix4Values;
        set values(values: Matrix4Values);
        get row1(): Vector4Values;
        set row1(row1: Vector4Values);
        get row2(): Vector4Values;
        set row2(row2: Vector4Values);
        get row3(): Vector4Values;
        set row3(row3: Vector4Values);
        get row4(): Vector4Values;
        set row4(row4: Vector4Values);
        get col1(): Vector4Values;
        set col1(col1: Vector4Values);
        get col2(): Vector4Values;
        set col2(col2: Vector4Values);
        get col3(): Vector4Values;
        set col3(col3: Vector4Values);
        get col4(): Vector4Values;
        set col4(col4: Vector4Values);
        get m11(): number;
        set m11(m11: number);
        get m12(): number;
        set m12(m12: number);
        get m13(): number;
        set m13(m13: number);
        get m14(): number;
        set m14(m14: number);
        get m21(): number;
        set m21(m21: number);
        get m22(): number;
        set m22(m22: number);
        get m23(): number;
        set m23(m23: number);
        get m24(): number;
        set m24(m24: number);
        get m31(): number;
        set m31(m31: number);
        get m32(): number;
        set m32(m32: number);
        get m33(): number;
        set m33(m33: number);
        get m34(): number;
        set m34(m34: number);
        get m41(): number;
        set m41(m41: number);
        get m42(): number;
        set m42(m42: number);
        get m43(): number;
        set m43(m43: number);
        get m44(): number;
        set m44(m44: number);
        setArray(array: WritableArrayLike<number>): this;
        setValues(m: Matrix4Values): this;
        getUpper33(): Matrix3Values;
        setUpper33(m: Matrix3Values): this;
        getUpper34(): Matrix34Values;
        setUpper34(m: Matrix34Values): this;
        getRow(idx: number): Vector4Values;
        setRow(idx: number, row: Vector4Values): this;
        setCol(idx: number, col: Vector4Values): this;
        getCol(idx: number): Vector4Values;
        getAt(idx: number): number;
        setAt(idx: number, val: number): this;
        getEntry(row: number, col: number): number;
        setEntry(row: number, col: number, val: number): this;
        equals(mat: Matrix4): boolean;
        copy(mat: Matrix4): this;
        clone(): this;
        setIdentity(): this;
        setZeros(): this;
        det(): number;
        trace(): number;
        negate(): this;
        transpose(): this;
        invert(): this;
        inverseTranspose(): this;
        add(mat: Matrix4): this;
        sub(mat: Matrix4): this;
        mult(mat: Matrix4): this;
        multScalar(k: number): this;
        getMaxScaleOnAxis(): number;
        writeIntoArray(out: WritableArrayLike<number>, offset?: number): void;
        readFromArray(arr: ArrayLike<number>, offset?: number): this;
        solve(vecB: Vector4): Vector4Values;
        solve2(vecB: Vector2): Vector2Values;
        solve3(vecB: Vector3): Vector3Values;
        setTranslation(vec: Vector3): this;
        translate(vec: Vector3): this;
        setRotationX(angleInRadians: number): this;
        rotateX(angleInRadians: number): this;
        setRotationY(angleInRadians: number): this;
        rotateY(angleInRadians: number): this;
        setRotationZ(angleInRadians: number): this;
        rotateZ(angleInRadians: number): this;
        rotate(x: number, y: number, z: number): this;
        axisRotation(axis: Vector3, angleInRadians: number): this;
        rotateAxis(axis: Vector3, angleInRadians: number): this;
        setScaling(vec: Vector3): this;
        scale(vec: Vector3): this;
        scaleScalar(k: number): this;
        lookAt(eye: Vector3, target: Vector3, up: Vector3): this;
        transformPoint(vec: Vector3): Vector3Values;
        transformDirection(vec: Vector3): Vector3Values;
        transformNormal(vec: Vector3): Vector3Values;
        asPerspective(fieldOfViewYInRadians: number, aspect: number, zNear: number, zFar: number): this;
        asOrthographic(left: number, right: number, bottom: number, top: number, near: number, far: number): this;
    }
    var Matrix4: Matrix4Constructor;
    const Matrix4Injector: Injector<Matrix4Constructor>;
}
declare module "engine/libs/patterns/pools/Pool" {
    export { PoolAutoExtendPolicy };
    export { Pool };
    export { PoolBase };
    enum PoolAutoExtendPolicy {
        NO_AUTO_EXTEND = 0,
        AUTO_EXTEND_ONE = 1,
        AUTO_EXTEND_POW2 = 2
    }
    interface Pool<O extends object = object> {
        readonly ctor: Constructor<O>;
        readonly autoExtendPolicy: PoolAutoExtendPolicy;
        acquireTemp<N extends number>(n: N, func: SplittedTupleFunction<O, N, void>): void;
        acquire(): O;
        release(n: number): void;
        extend(n: number): void;
        clear(): void;
        setAutoExtendPolicy(autoExtendPolicy: PoolAutoExtendPolicy): void;
    }
    abstract class PoolBase<O extends object = object> implements Pool<O> {
        protected _ctor: Constructor<O>;
        protected _autoExtendPolicy: PoolAutoExtendPolicy;
        protected _autoExtendTicks: number;
        protected _autoExtend: (() => void);
        protected constructor(constructor: Constructor<O>, policy?: PoolAutoExtendPolicy);
        get ctor(): Constructor<O>;
        get autoExtendPolicy(): PoolAutoExtendPolicy;
        setAutoExtendPolicy(autoExtendPolicy: PoolAutoExtendPolicy): void;
        protected getAutoExtendFunction(autoExtdPolicy: PoolAutoExtendPolicy): () => void;
        abstract acquireTemp<N extends number>(n: N, func: SplittedTupleFunction<O, N, void>): void;
        abstract acquire(): O;
        abstract release(n: number): void;
        abstract extend(n: number): void;
        abstract clear(): void;
    }
}
declare module "engine/libs/patterns/pools/StackPool" {
    import { PoolAutoExtendPolicy, PoolBase, Pool } from "engine/libs/patterns/pools/Pool";
    export { StackPool };
    export { StackPoolBase };
    interface StackPool<O extends object = object> extends Pool<O> {
    }
    interface StackPoolConstructor {
        readonly prototype: StackPool;
        new <O extends object, C extends Constructor<O>>(constructor: C, options?: {
            args?: ConstructorParameters<C>;
            policy?: PoolAutoExtendPolicy;
            size?: number;
        }): StackPool<O>;
    }
    class StackPoolBase<O extends object = object> extends PoolBase<O> implements Pool<O> {
        private _objects;
        private _top;
        constructor(constructor: Constructor<O>, options?: {
            args?: any;
            policy?: PoolAutoExtendPolicy;
            size?: number;
        });
        acquireTemp<N extends number>(n: N, func: (...args: O[]) => void): void;
        acquire(): O;
        release(n: number): void;
        extend(n: number): void;
        clear(): void;
    }
    const StackPool: StackPoolConstructor;
}
declare module "engine/libs/maths/algebra/quaternions/Quaternion" {
    import { Injector } from "engine/libs/patterns/injectors/Injector";
    import { Matrix3, Matrix3Values } from "engine/libs/maths/algebra/matrices/Matrix3";
    import { Matrix4 } from "engine/libs/maths/algebra/matrices/Matrix4";
    import { Vector3 } from "engine/libs/maths/algebra/vectors/Vector3";
    import { StackPool } from "engine/libs/patterns/pools/StackPool";
    export { QuaternionValues };
    export { Quaternion };
    export { QuaternionInjector };
    export { QuaternionBase };
    export { QuaternionPool };
    type QuaternionValues = [number, ...number[]] & {
        length: 4;
    };
    interface QuaternionConstructor {
        readonly prototype: Quaternion;
        new (): Quaternion;
        new (values: QuaternionValues): Quaternion;
        new (values?: QuaternionValues): Quaternion;
    }
    interface Quaternion {
        readonly array: ArrayLike<number>;
        values: QuaternionValues;
        x: number;
        y: number;
        z: number;
        w: number;
        setArray(array: WritableArrayLike<number>): this;
        setValues(v: QuaternionValues): this;
        copy(quat: Quaternion): this;
        clone(): this;
        getAxis(out: Vector3): Vector3;
        asMatrix33(): Matrix3Values;
        asRotationMatrix(out: Matrix3): Matrix3;
        rotate(vec: Vector3): Vector3;
        setEuler(yaw: number, pitch: number, roll: number): this;
        setFromAxisAngle(axis: Vector3, angle: number): this;
        setFromTransformMatrix(mat: Matrix4): this;
        setFromVectors(from: Vector3, to: Vector3): this;
        angleTo(quat: Quaternion): number;
        rotateTowards(quat: Quaternion): this;
        invert(): this;
        conjugate(): this;
        dot(quat: Quaternion): number;
        lenSq(): number;
        len(): number;
        normalize(): this;
        add(quat: Quaternion): this;
        sub(quat: Quaternion): this;
        mult(quat: Quaternion): this;
        slerp(quat: Quaternion, t: number): this;
        equals(quat: Quaternion): boolean;
        copyIntoArray(out: WritableArrayLike<number>, offset?: number): void;
        readFromArray(arr: ArrayLike<number>, offset?: number): void;
    }
    class QuaternionBase {
        protected _array: WritableArrayLike<number>;
        constructor();
        constructor(values: QuaternionValues);
        get array(): ArrayLike<number>;
        get values(): QuaternionValues;
        set values(values: QuaternionValues);
        private get _x();
        private set _x(value);
        private get _y();
        private set _y(value);
        private set _z(value);
        private get _z();
        private set _w(value);
        private get _w();
        get x(): number;
        set x(x: number);
        get y(): number;
        set y(y: number);
        set z(z: number);
        get z(): number;
        set w(w: number);
        get w(): number;
        setArray(array: WritableArrayLike<number>): this;
        copy(quat: Quaternion): this;
        setValues(v: QuaternionValues): this;
        clone(): this;
        equals(quat: Quaternion): boolean;
        getAxis(out: Vector3): Vector3;
        asMatrix33(): Matrix3Values;
        asRotationMatrix(out: Matrix3): Matrix3;
        rotate(vec: Vector3): Vector3;
        setEuler(yaw: number, pitch: number, roll: number): this;
        setFromAxisAngle(axis: Vector3, angle: number): this;
        setFromTransformMatrix(mat: Matrix4): this;
        setFromVectors(from: Vector3, to: Vector3): this;
        dot(quat: Quaternion): number;
        lenSq(): number;
        len(): number;
        angleTo(quat: Quaternion): number;
        rotateTowards(quat: Quaternion): this;
        invert(): this;
        conjugate(): this;
        normalize(): this;
        add(quat: Quaternion): this;
        sub(quat: Quaternion): this;
        mult(quat: Quaternion): this;
        slerp(quat: Quaternion, t: number): this;
        copyIntoArray(out: WritableArrayLike<number>, offset?: number): void;
        readFromArray(arr: ArrayLike<number>, offset?: number): void;
    }
    var Quaternion: QuaternionConstructor;
    const QuaternionPool: StackPool<Quaternion>;
    const QuaternionInjector: Injector<QuaternionConstructor>;
}
declare module "engine/libs/maths/statistics/random/UUIDGenerator" {
    export { UUID };
    export { Identifiable };
    export { UUIDGeneratorBase };
    export { UUIDGenerator };
    type UUID = string;
    interface Identifiable {
        readonly uuid: UUID;
    }
    interface UUIDGenerator {
        newUUID(): UUID;
    }
    class UUIDGeneratorBase {
        private _count;
        constructor();
        newUUID(): UUID;
    }
    const UUIDGenerator: UUIDGenerator;
}
declare module "engine/core/rendering/scenes/objects/Object3D" {
    import { Transform } from "engine/core/general/Transform";
    export { Object3D };
    export { isObject3D };
    export { Object3DBase };
    interface Object3D {
        isObject3D: true;
        transform: Transform;
    }
    function isObject3D(obj: any): obj is Object3D;
    class Object3DBase implements Object3D {
        readonly isObject3D: true;
        readonly transform: Transform;
        constructor();
    }
}
declare module "engine/libs/structures/trees/Node" {
    export { Node };
    export { NodeBase };
    interface Node<N extends Node<any>> {
        parent: N | null;
        readonly children: N[];
        traverse(func: (node: N, parent: N | null) => any): void;
    }
    abstract class NodeBase<N extends NodeBase<any>> implements Node<N> {
        protected _parent: N | null;
        protected _children: N[];
        constructor();
        constructor(parent: N);
        set parent(parent: N | null);
        get parent(): N | null;
        get children(): N[];
        protected _removeChild(child: N): void;
        traverse(func: (node: N, parent: N | null) => any): void;
    }
}
declare module "engine/core/general/Transform" {
    import { Quaternion } from "engine/libs/maths/algebra/quaternions/Quaternion";
    import { Matrix4 } from "engine/libs/maths/algebra/matrices/Matrix4";
    import { Vector3 } from "engine/libs/maths/algebra/vectors/Vector3";
    import { UUID } from "engine/libs/maths/statistics/random/UUIDGenerator";
    import { Object3D } from "engine/core/rendering/scenes/objects/Object3D";
    import { Node, NodeBase } from "engine/libs/structures/trees/Node";
    export { Transform };
    export { isTransform };
    export { TransformBase };
    function isTransform(obj: any): obj is Transform;
    interface TransformConstructor {
        readonly prototype: Transform;
        new (owner?: Object3D): Transform;
    }
    interface Transform extends Node<Transform> {
        readonly isTransform: true;
        readonly uuid: UUID;
        readonly owner: Object3D | null;
        localPosition: Vector3;
        globalPosition: Vector3;
        rotation: Quaternion;
        localScale: Vector3;
        localMatrix: Matrix4;
        globalMatrix: Matrix4;
        left: Vector3;
        up: Vector3;
        forward: Vector3;
        root(): Transform;
        translate(vec: Vector3): this;
        scale(vec: Vector3): this;
        rotate(quat: Quaternion): this;
        lookAt(target: Vector3, up: Vector3): this;
    }
    class TransformBase extends NodeBase<TransformBase> implements Transform {
        readonly isTransform: true;
        readonly uuid: UUID;
        readonly owner: Object3D | null;
        private _localMatrixArray;
        private _globalMatrixArray;
        private _localMatrix;
        private _globalMatrix;
        private _array;
        private _localPosition;
        private _globalPosition;
        private _rotation;
        private _localScale;
        private _up;
        private _left;
        private _forward;
        private _hasChanged;
        constructor(owner?: Object3D);
        get localMatrix(): Matrix4;
        get localPosition(): Vector3;
        get globalMatrix(): Matrix4;
        set localPosition(position: Vector3);
        get globalPosition(): Vector3;
        set globalPosition(position: Vector3);
        get rotation(): Quaternion;
        set rotation(rotation: Quaternion);
        get localScale(): Vector3;
        set localScale(scale: Vector3);
        get left(): Vector3;
        get up(): Vector3;
        get forward(): Vector3;
        root(): Transform;
        get hasChanged(): boolean;
        translate(vec: Vector3): this;
        scale(vec: Vector3): this;
        rotate(quat: Quaternion): this;
        lookAt(target: Vector3, up: Vector3): this;
        private _bottomUpRecursiveMatrixUpdate;
        private _topDownRecursiveFlagUpdate;
    }
    const Transform: TransformConstructor;
}
declare module "engine/libs/maths/extensions/pools/Vector3Pools" {
    import { Vector3 } from "engine/libs/maths/algebra/vectors/Vector3";
    import { StackPool } from "engine/libs/patterns/pools/StackPool";
    export { Vector3Pool };
    const Vector3Pool: StackPool<Vector3>;
}
declare module "engine/libs/maths/geometry/primitives/Plane" {
    import { Vector3 } from "engine/libs/maths/algebra/vectors/Vector3";
    import { Injector } from "engine/libs/patterns/injectors/Injector";
    export { Plane };
    export { PlaneInjector };
    export { PlaneBase };
    interface Plane {
        normal: Vector3;
        constant: number;
        copy(plane: Plane): Plane;
        set(x: number, y: number, z: number, constant: number): Plane;
        setFromNormalAndConstant(normal: Vector3, constant: number): Plane;
        setFromNormalAndCoplanarPoint(normal: Vector3, point: Vector3): Plane;
        setFromCoplanarPoints(point1: Vector3, point2: Vector3, point3: Vector3): Plane;
        distanceToPoint(point: Vector3): number;
        normalized(): Plane;
    }
    interface PlaneConstructor {
        readonly prototype: Plane;
        new (): Plane;
        new (normal: Vector3, constant: number): Plane;
        new (normal?: Vector3, constant?: number): Plane;
        fromNormalAndConstant(normal: Vector3, constant: number): Plane;
        fromNormalAndCoplanarPoint(normal: Vector3, point: Vector3): Plane;
        fromCoplanarPoints(a: Vector3, b: Vector3, c: Vector3): Plane;
    }
    class PlaneBase implements Plane {
        private _normal;
        private _constant;
        constructor();
        constructor(normal: Vector3, constant: number);
        static fromNormalAndConstant(normal: Vector3, constant: number): Plane;
        static fromNormalAndCoplanarPoint(normal: Vector3, point: Vector3): Plane;
        static fromCoplanarPoints(a: Vector3, b: Vector3, c: Vector3): Plane;
        get normal(): Vector3;
        set normal(normal: Vector3);
        get constant(): number;
        set constant(constant: number);
        copy(plane: PlaneBase): PlaneBase;
        set(x: number, y: number, z: number, constant: number): PlaneBase;
        setFromNormalAndConstant(normal: Vector3, constant: number): PlaneBase;
        setFromNormalAndCoplanarPoint(normal: Vector3, point: Vector3): PlaneBase;
        setFromCoplanarPoints(point1: Vector3, point2: Vector3, point3: Vector3): PlaneBase;
        distanceToPoint(point: Vector3): number;
        normalized(): PlaneBase;
    }
    var Plane: PlaneConstructor;
    const PlaneInjector: Injector<PlaneConstructor>;
}
declare module "engine/libs/maths/geometry/primitives/Triangle" {
    import { Vector3 } from "engine/libs/maths/algebra/vectors/Vector3";
    import { Matrix4 } from "engine/libs/maths/algebra/matrices/Matrix4";
    import { Vector2 } from "engine/libs/maths/algebra/vectors/Vector2";
    import { Plane } from "engine/libs/maths/geometry/primitives/Plane";
    import { StackPool } from "engine/libs/patterns/pools/StackPool";
    import { Injector } from "engine/libs/patterns/injectors/Injector";
    export { TriangleValues };
    export { Triangle };
    export { TriangleInjector };
    export { TriangleBase };
    export { TrianglePool };
    type TriangleValues = Tuple<number, 9>;
    interface Triangle {
        readonly point1: Vector3;
        readonly point2: Vector3;
        readonly point3: Vector3;
        set(point1: Vector3, point2: Vector3, point3: Vector3): Triangle;
        getValues(): TriangleValues;
        setValues(values: TriangleValues): Triangle;
        clone(): Triangle;
        copy(triangle: Triangle): Triangle;
        getNormal(out: Vector3): Vector3;
        getBarycentricCoordinates(point: Vector3, out: Vector3): Vector3;
        sharedPointsWith(triangle: Triangle): IterableIterator<Vector3>;
        indexOfPoint(point: Vector3): number;
        containsPoint(point: Vector3): boolean;
        getUV(point: Vector3, uv1: Vector2, uv2: Vector2, uv3: Vector2, out: Vector2): Vector2;
        isFrontFacing(direction: Vector3): boolean;
        getArea(): number;
        getMidpoint(out: Vector3): Vector3;
        getPlane(out: Plane): Plane;
        closestPointToPoint(point: Vector3, out: Vector3): Vector3;
        equals(triangle: Triangle): boolean;
        translate(vec: Vector3): void;
        transform(mat: Matrix4): void;
        toString(): string;
        readFromArray(arr: ArrayLike<number>, offset: number): Triangle;
        writeIntoArray(arr: WritableArrayLike<number>, offset: number): void;
    }
    interface TriangleConstructor {
        readonly prototype: Triangle;
        new (): Triangle;
        new (point1: Vector3, point2: Vector3, point3: Vector3): Triangle;
        new (point1?: Vector3, point2?: Vector3, point3?: Vector3): Triangle;
    }
    class TriangleBase implements Triangle {
        private _point1;
        private _point2;
        private _point3;
        constructor();
        constructor(point1: Vector3, point2: Vector3, point3: Vector3);
        get point1(): Vector3;
        set point1(point1: Vector3);
        get point2(): Vector3;
        set point2(point2: Vector3);
        get point3(): Vector3;
        set point3(point3: Vector3);
        getValues(): TriangleValues;
        set(point1: Vector3, point2: Vector3, point3: Vector3): TriangleBase;
        setValues(values: TriangleValues): TriangleBase;
        clone(): TriangleBase;
        copy(triangle: TriangleBase): TriangleBase;
        getNormal(out: Vector3): Vector3;
        getBarycentricCoordinates(point: Vector3, out: Vector3): Vector3;
        sharedPointsWith(triangle: TriangleBase): IterableIterator<Vector3>;
        indexOfPoint(point: Vector3): number;
        containsPoint(point: Vector3): boolean;
        getUV(point: Vector3, uv1: Vector2, uv2: Vector2, uv3: Vector2, out: Vector2): Vector2;
        isFrontFacing(direction: Vector3): boolean;
        getArea(): number;
        getMidpoint(out: Vector3): Vector3;
        getPlane(out: Plane): Plane;
        closestPointToPoint(point: Vector3, out: Vector3): Vector3;
        equals(triangle: TriangleBase): boolean;
        translate(vec: Vector3): void;
        transform(mat: Matrix4): void;
        readFromArray(arr: ArrayLike<number>, offset: number): TriangleBase;
        writeIntoArray(arr: WritableArrayLike<number>, offset: number): void;
    }
    var Triangle: TriangleConstructor;
    const TriangleInjector: Injector<TriangleConstructor>;
    const TrianglePool: StackPool<Triangle>;
}
declare module "engine/libs/maths/extensions/lists/TriangleList" {
    import { Triangle } from "engine/libs/maths/geometry/primitives/Triangle";
    import { Vector3Values } from "engine/libs/maths/algebra/vectors/Vector3";
    export { TriangleList };
    export { TriangleListBase };
    interface TriangleList {
        readonly array: ArrayLike<number>;
        readonly count: number;
        setArray(array: WritableArrayLike<number>): this;
        get(idx: number, tri: Triangle): Triangle;
        set(idx: number, tri: Triangle): void;
        indexOf(tri: Triangle): number;
        forEach(func: (tri: Triangle, idx: number) => void, options?: {
            idxFrom: number;
            idxTo: number;
        }): void;
        getIndexedPoints(indices: Vector3Values, triangle: Triangle): void;
        forIndexedPoints(func: (tri: Triangle, idx: number, pointsIndices: Vector3Values) => void, indices: ArrayLike<number>, options?: {
            idxFrom: number;
            idxTo: number;
        }): void;
    }
    interface TriangleListConstructor {
        readonly prototype: TriangleList;
        new (): TriangleList;
        new (array: WritableArrayLike<number>): TriangleList;
    }
    class TriangleListBase implements TriangleList {
        private _array;
        constructor();
        constructor(array: WritableArrayLike<number>);
        get array(): ArrayLike<number>;
        get count(): number;
        setArray(array: WritableArrayLike<number>): this;
        get(idx: number, tri: Triangle): Triangle;
        set(idx: number, tri: Triangle): void;
        indexOf(tri: Triangle): number;
        forEach(func: (triangle: Triangle, idx: number, ...args: any) => void, options?: {
            idxFrom: number;
            idxTo: number;
        }): void;
        getIndexedPoints(indices: Vector3Values, tri: Triangle): void;
        forIndexedPoints(func: (tri: Triangle, idx: number, pointsIndices: Vector3Values) => void, indices: ArrayLike<number>, options?: {
            idxFrom: number;
            idxTo: number;
        }): void;
    }
    const TriangleList: TriangleListConstructor;
}
declare module "engine/libs/maths/extensions/lists/Vector3List" {
    import { Vector3 } from "engine/libs/maths/algebra/vectors/Vector3";
    export { Vector3List };
    export { Vector3ListBase };
    interface Vector3List {
        readonly array: ArrayLike<number>;
        readonly count: number;
        setArray(array: WritableArrayLike<number>): this;
        forEach(func: (vec: Vector3, idx: number) => void, options?: {
            idxFrom: number;
            idxTo: number;
        }): void;
        indexOf(vec: Vector3): number;
        get(idx: number, vec: Vector3): Vector3;
        set(idx: number, vec: Vector3): void;
    }
    interface Vector3ListConstructor {
        readonly prototype: Vector3List;
        new (): Vector3List;
        new (array: WritableArrayLike<number>): Vector3List;
    }
    class Vector3ListBase implements Vector3List {
        private _array;
        constructor();
        constructor(array: WritableArrayLike<number>);
        get array(): ArrayLike<number>;
        get count(): number;
        setArray(array: WritableArrayLike<number>): this;
        forEach(func: (vec: Vector3, idx: number) => void, options?: {
            idxFrom: number;
            idxTo: number;
        }): void;
        forEachFromIndices(func: (vec: Vector3, idx: number, indice: number) => void, indices: ArrayLike<number>, options?: {
            idxFrom: number;
            idxTo: number;
        }): void;
        indexOf(vec: Vector3): number;
        get(idx: number, vec: Vector3): Vector3;
        set(idx: number, vec: Vector3): void;
    }
    const Vector3List: Vector3ListConstructor;
}
declare module "engine/libs/maths/extensions/pools/lists/TriangleListPools" {
    import { TriangleList } from "engine/libs/maths/extensions/lists/TriangleList";
    import { StackPool } from "engine/libs/patterns/pools/StackPool";
    export { TriangleListPool };
    const TriangleListPool: StackPool<TriangleList>;
}
declare module "engine/libs/maths/extensions/pools/lists/Vector3ListPools" {
    import { Vector3List } from "engine/libs/maths/extensions/lists/Vector3List";
    import { StackPool } from "engine/libs/patterns/pools/StackPool";
    export { Vector3ListPool };
    const Vector3ListPool: StackPool<Vector3List>;
}
declare module "engine/core/rendering/scenes/geometries/GeometryUtils" {
    export { GeometryUtils };
    class GeometryUtils {
        static computeTangentsAndBitangents<C extends (new (length: number) => WritableArrayLike<number>)>(verticesArray: ArrayLike<number>, uvsArray: ArrayLike<number>, indicesArray: ArrayLike<number>, type: C): {
            tangentsArray: InstanceType<C>;
            bitangentsArray: InstanceType<C>;
        };
        static computeFacesNormals<C extends (new (length: number) => WritableArrayLike<number>)>(verticesArray: ArrayLike<number>, indicesArray: ArrayLike<number>, type: C): InstanceType<C>;
        static computeVerticesNormals<C extends (new (length: number) => WritableArrayLike<number>)>(verticesArray: ArrayLike<number>, indicesArray: ArrayLike<number>, weighted: boolean, type: C, facesNormalsArray?: ArrayLike<number>): InstanceType<C>;
    }
}
declare module "engine/libs/maths/extensions/pools/Vector2Pools" {
    import { Vector2 } from "engine/libs/maths/algebra/vectors/Vector2";
    import { StackPool } from "engine/libs/patterns/pools/StackPool";
    export { Vector2Pool };
    const Vector2Pool: StackPool<Vector2>;
}
declare module "engine/libs/maths/extensions/lists/Vector2List" {
    import { Vector2 } from "engine/libs/maths/algebra/vectors/Vector2";
    export { Vector2List };
    export { Vector2ListBase };
    interface Vector2List {
        readonly array: ArrayLike<number>;
        readonly count: number;
        setArray(array: WritableArrayLike<number>): this;
        forEach(func: (vec: Vector2, idx: number) => void, options?: {
            idxFrom: number;
            idxTo: number;
        }): void;
        indexOf(vec: Vector2): number;
        get(idx: number, vec: Vector2): Vector2;
        set(idx: number, vec: Vector2): void;
    }
    interface Vector2ListConstructor {
        readonly prototype: Vector2List;
        new (): Vector2List;
        new (array: WritableArrayLike<number>): Vector2List;
    }
    class Vector2ListBase implements Vector2List {
        private _array;
        constructor();
        constructor(array: WritableArrayLike<number>);
        get array(): ArrayLike<number>;
        get count(): number;
        setArray(array: WritableArrayLike<number>): this;
        forEach(func: (vec: Vector2, idx: number) => void, options?: {
            idxFrom: number;
            idxTo: number;
        }): void;
        indexOf(vec: Vector2): number;
        get(idx: number, vec: Vector2): Vector2;
        set(idx: number, vec: Vector2): void;
    }
    const Vector2List: Vector2ListConstructor;
}
declare module "engine/libs/physics/collisions/BoundingSphere" {
    import { Vector3 } from "engine/libs/maths/algebra/vectors/Vector3";
    import { BoundingBox } from "engine/libs/physics/collisions/BoundingBox";
    import { Plane } from "engine/libs/maths/geometry/primitives/Plane";
    import { Matrix4 } from "engine/libs/maths/algebra/matrices/Matrix4";
    import { Vector3List } from "engine/libs/maths/extensions/lists/Vector3List";
    import { Injector } from "engine/libs/patterns/injectors/Injector";
    export { BoundingSphere };
    export { BoundingSphereInjector };
    export { BoundingSphereBase };
    interface BoundingSphere {
        center: Vector3;
        radius: number;
        set(center: Vector3, radius: number): BoundingSphere;
        copy(sphere: BoundingSphere): BoundingSphere;
        clone(): BoundingSphere;
        setFromPoints(points: Vector3List, center?: Vector3): BoundingSphere;
        isEmpty(): boolean;
        makeEmpty(): BoundingSphere;
        containsPoint(point: Vector3): boolean;
        dist(point: Vector3): number;
        distToPlane(plane: Plane): number;
        intersectsSphere(sphere: BoundingSphere): boolean;
        intersectsBox(box: BoundingBox): boolean;
        intersectsPlane(plane: Plane): boolean;
        clampPoint(point: Vector3, out: Vector3): Vector3;
        getBoundingBox(out: BoundingBox): BoundingBox;
        transform(mat: Matrix4): void;
        translate(offset: Vector3): void;
    }
    interface BoundingSphereConstructor {
        readonly prototype: BoundingSphere;
        new (): BoundingSphere;
    }
    class BoundingSphereBase implements BoundingSphere {
        private _center;
        private _radius;
        constructor();
        get center(): Vector3;
        set center(center: Vector3);
        get radius(): number;
        set radius(radius: number);
        set(center: Vector3, radius: number): BoundingSphereBase;
        copy(sphere: BoundingSphereBase): BoundingSphereBase;
        clone(): BoundingSphereBase;
        setFromPoints(points: Vector3List, center?: Vector3): BoundingSphereBase;
        isEmpty(): boolean;
        makeEmpty(): BoundingSphereBase;
        containsPoint(point: Vector3): boolean;
        dist(point: Vector3): number;
        distToPlane(plane: Plane): number;
        intersectsSphere(sphere: BoundingSphereBase): boolean;
        intersectsBox(box: BoundingBox): boolean;
        intersectsPlane(plane: Plane): boolean;
        clampPoint(point: Vector3, out: Vector3): Vector3;
        getBoundingBox(out: BoundingBox): BoundingBox;
        transform(mat: Matrix4): void;
        translate(offset: Vector3): void;
    }
    var BoundingSphere: BoundingSphereConstructor;
    const BoundingSphereInjector: Injector<BoundingSphereConstructor>;
}
declare module "engine/libs/physics/collisions/BoundingBox" {
    import { Vector3 } from "engine/libs/maths/algebra/vectors/Vector3";
    import { Plane } from "engine/libs/maths/geometry/primitives/Plane";
    import { BoundingSphere } from "engine/libs/physics/collisions/BoundingSphere";
    import { Triangle } from "engine/libs/maths/geometry/primitives/Triangle";
    import { Vector3List } from "engine/libs/maths/extensions/lists/Vector3List";
    import { Injector } from "engine/libs/patterns/injectors/Injector";
    import { StackPool } from "engine/libs/patterns/pools/StackPool";
    export { BoundingBox };
    export { BoundingBoxInjector };
    export { BoundingBoxBase };
    export { BoundingBoxPool };
    interface BoundingBox {
        min: Vector3;
        max: Vector3;
        set(min: Vector3, max: Vector3): void;
        copy(box: BoundingBox): BoundingBox;
        clone(box: BoundingBox): BoundingBox;
        makeEmpty(): void;
        isEmpty(): boolean;
        getCenter(out: Vector3): Vector3;
        getSize(out: Vector3): Vector3;
        setFromLengths(center: Vector3, length: number, width: number, height: number): BoundingBox;
        setFromPoints(points: Vector3List): BoundingBox;
        expandByPoint(point: Vector3): BoundingBox;
        expandByVector(vector: Vector3): BoundingBox;
        expandByScalar(k: number): void;
        clampPoint(point: Vector3, out: Vector3): Vector3;
        distanceToPoint(point: Vector3): number;
        intersectsPlane(plane: Plane): boolean;
        intersectsSphere(sphere: BoundingSphere): boolean;
        intersectsBox(box: BoundingBox): boolean;
        getBoundingSphere(out: BoundingSphere): BoundingSphere;
        intersectsTriangle(triangle: Triangle): boolean;
    }
    interface BoundingBoxConstructor {
        readonly prototype: BoundingBox;
        new (): BoundingBox;
    }
    class BoundingBoxBase implements BoundingBox {
        private _min;
        private _max;
        constructor();
        get min(): Vector3;
        set min(min: Vector3);
        get max(): Vector3;
        set max(max: Vector3);
        set(min: Vector3, max: Vector3): void;
        copy(box: BoundingBoxBase): BoundingBoxBase;
        clone(box: BoundingBoxBase): BoundingBoxBase;
        makeEmpty(): void;
        isEmpty(): boolean;
        getCenter(out: Vector3): Vector3;
        getSize(out: Vector3): Vector3;
        setFromLengths(center: Vector3, length: number, width: number, height: number): BoundingBoxBase;
        setFromPoints(points: Vector3List): BoundingBoxBase;
        expandByPoint(point: Vector3): BoundingBoxBase;
        expandByVector(vector: Vector3): BoundingBoxBase;
        expandByScalar(k: number): this;
        clampPoint(point: Vector3, out: Vector3): Vector3;
        distanceToPoint(point: Vector3): number;
        intersectsPlane(plane: Plane): boolean;
        intersectsSphere(sphere: BoundingSphere): boolean;
        intersectsBox(box: BoundingBoxBase): boolean;
        getBoundingSphere(out: BoundingSphere): BoundingSphere;
        intersectsTriangle(triangle: Triangle): boolean;
        private satForAxes;
    }
    var BoundingBox: BoundingBoxConstructor;
    const BoundingBoxInjector: Injector<BoundingBoxConstructor>;
    const BoundingBoxPool: StackPool<BoundingBox>;
}
declare module "engine/core/rendering/scenes/geometries/Geometry" {
    import { TriangleList } from "engine/libs/maths/extensions/lists/TriangleList";
    import { Vector2List } from "engine/libs/maths/extensions/lists/Vector2List";
    import { Vector3List } from "engine/libs/maths/extensions/lists/Vector3List";
    import { UUID } from "engine/libs/maths/statistics/random/UUIDGenerator";
    import { BoundingBox } from "engine/libs/physics/collisions/BoundingBox";
    import { BoundingSphere } from "engine/libs/physics/collisions/BoundingSphere";
    export { GeometryPropertyKeys };
    export { Geometry };
    export { isGeometry };
    export { GeometryBase };
    enum GeometryPropertyKeys {
        vertices = 0,
        indices = 1,
        uvs = 2,
        facesNormals = 3,
        verticesNormals = 4,
        tangents = 5,
        bitangents = 6
    }
    interface Geometry {
        readonly isGeometry: true;
        readonly uuid: UUID;
        indices: TypedArray;
        vertices: Vector3List;
        faces: TriangleList;
        uvs: Vector2List;
        facesNormals: Vector3List;
        verticesNormals: Vector3List;
        tangents: Vector3List;
        bitangents: Vector3List;
        [attrib: string]: any;
        readonly boundingBox?: BoundingBox;
        readonly boundingSphere?: BoundingSphere;
        computeBoundingBox(): BoundingBox;
        computeBoundingSphere(): BoundingSphere;
    }
    function isGeometry(obj: any): obj is Geometry;
    class GeometryBase implements Geometry {
        readonly uuid: UUID;
        readonly isGeometry: true;
        private _boundingBox?;
        private _boundingSphere?;
        private _indicesArray;
        private _verticesArray;
        private _vertices;
        private _faces;
        private _uvsArray;
        private _uvs;
        private _facesNormalsArray;
        private _facesNormals;
        private _verticesNormalsArray;
        private _verticesNormals;
        private _tangentsArray;
        private _tangents;
        private _bitangentsArray;
        private _bitangents;
        private _weightedVerticesNormals;
        constructor(desc: {
            vertices: TypedArray;
            indices: TypedArray;
            uvs: TypedArray;
            weightedVerticesNormals?: boolean;
        });
        get indices(): TypedArray;
        get vertices(): Vector3List;
        get uvs(): Vector2List;
        get faces(): TriangleList;
        get facesNormals(): Vector3List;
        get verticesNormals(): Vector3List;
        get tangents(): Vector3List;
        get bitangents(): Vector3List;
        get boundingBox(): BoundingBox | undefined;
        get boundingSphere(): BoundingSphere | undefined;
        computeBoundingBox(): BoundingBox;
        computeBoundingSphere(): BoundingSphere;
    }
}
declare module "engine/core/rendering/scenes/materials/Material" {
    import { UUID } from "engine/libs/maths/statistics/random/UUIDGenerator";
    export { Material };
    export { isMaterial };
    export { MaterialBase };
    interface Material<T extends List = List> {
        readonly isMaterial: true;
        readonly uuid: UUID;
        readonly name: string;
        copy(instance: Material<T>): Material<T>;
        clone(): Material<T>;
    }
    function isMaterial(obj: any): obj is Material;
    abstract class MaterialBase<T extends List = List> implements Material<T> {
        readonly isMaterial: true;
        readonly uuid: UUID;
        readonly name: string;
        protected _subscriptions: Array<(message: any) => void>;
        constructor(name: string);
        abstract copy(instance: Material<T>): Material<T>;
        abstract clone(): Material<T>;
    }
}
declare module "engine/core/rendering/scenes/objects/meshes/Mesh" {
    import { Object3D, Object3DBase } from "engine/core/rendering/scenes/objects/Object3D";
    import { Geometry } from "engine/core/rendering/scenes/geometries/Geometry";
    import { Material } from "engine/core/rendering/scenes/materials/Material";
    export { Mesh };
    export { isMesh };
    export { MeshBase };
    interface Mesh extends Object3D {
        readonly isMesh: true;
        readonly geometry: Geometry;
        readonly material: Material;
    }
    function isMesh(obj: any): obj is Mesh;
    class MeshBase extends Object3DBase {
        readonly isMesh: true;
        readonly geometry: Geometry;
        readonly material: Material;
        constructor(geometry: Geometry, material: Material);
    }
}
declare module "engine/libs/physics/collisions/Frustrum" {
    import { Plane } from "engine/libs/maths/geometry/primitives/Plane";
    import { Matrix4 } from "engine/libs/maths/algebra/matrices/Matrix4";
    import { BoundingSphere } from "engine/libs/physics/collisions/BoundingSphere";
    import { BoundingBox } from "engine/libs/physics/collisions/BoundingBox";
    import { Vector3 } from "engine/libs/maths/algebra/vectors/Vector3";
    import { Injector } from "engine/libs/patterns/injectors/Injector";
    export { Frustrum };
    export { FrustrumInjector };
    export { FrustrumBase };
    interface Frustrum {
        nearPlane: Plane;
        farPlane: Plane;
        topPlane: Plane;
        bottomPlane: Plane;
        leftPlane: Plane;
        rightPlane: Plane;
        copy(frustrum: Frustrum): Frustrum;
        clone(): Frustrum;
        setFromPerspectiveMatrix(mat: Matrix4): Frustrum;
        set(nearPlane: Plane, farPlane: Plane, topPlane: Plane, bottomPlane: Plane, leftPlane: Plane, rightPlane: Plane): Frustrum;
        intersectsSphere(sphere: BoundingSphere): boolean;
        intersectsBox(box: BoundingBox): boolean;
        containsPoint(point: Vector3): boolean;
    }
    interface FrustrumConstructor {
        readonly prototype: Frustrum;
        new (): Frustrum;
    }
    class FrustrumBase implements Frustrum {
        private _nearPlane;
        private _farPlane;
        private _topPlane;
        private _bottomPlane;
        private _leftPlane;
        private _rightPlane;
        constructor();
        get nearPlane(): Plane;
        set nearPlane(nearPlane: Plane);
        get farPlane(): Plane;
        set farPlane(farPlane: Plane);
        get topPlane(): Plane;
        set topPlane(topPlane: Plane);
        get bottomPlane(): Plane;
        set bottomPlane(bottomPlane: Plane);
        get leftPlane(): Plane;
        set leftPlane(leftPlane: Plane);
        get rightPlane(): Plane;
        set rightPlane(rightPlane: Plane);
        set(nearPlane: Plane, farPlane: Plane, topPlane: Plane, bottomPlane: Plane, leftPlane: Plane, rightPlane: Plane): Frustrum;
        copy(frustrum: FrustrumBase): FrustrumBase;
        clone(): FrustrumBase;
        setFromPerspectiveMatrix(mat: Matrix4): FrustrumBase;
        intersectsSphere(sphere: BoundingSphere): boolean;
        intersectsBox(box: BoundingBox): boolean;
        containsPoint(point: Vector3): boolean;
    }
    var Frustrum: FrustrumConstructor;
    const FrustrumInjector: Injector<FrustrumConstructor>;
}
declare module "engine/core/rendering/scenes/cameras/Camera" {
    import { Object3D, Object3DBase } from "engine/core/rendering/scenes/objects/Object3D";
    import { Mesh } from "engine/core/rendering/scenes/objects/meshes/Mesh";
    import { Matrix4 } from "engine/libs/maths/algebra/matrices/Matrix4";
    import { UUID } from "engine/libs/maths/statistics/random/UUIDGenerator";
    export { Camera };
    export { CameraBase };
    interface Camera extends Object3D {
        readonly uuid: UUID;
        projection: Matrix4;
        getProjection(mat: Matrix4): Matrix4;
        isViewing(mesh: Mesh): boolean;
    }
    class CameraBase extends Object3DBase {
        readonly uuid: UUID;
        protected _projection: Matrix4;
        private _frustrum;
        constructor();
        constructor(projection: Matrix4);
        get projection(): Matrix4;
        getProjection(mat: Matrix4): Matrix4;
        isViewing(mesh: Mesh): boolean;
        protected updateFrustrum(): void;
    }
}
declare module "engine/core/rendering/scenes/cameras/PerspectiveCamera" {
    import { CameraBase } from "engine/core/rendering/scenes/cameras/Camera";
    export class PerspectiveCamera extends CameraBase {
        constructor(fieldOfViewYInRadians?: number, aspect?: number, zNear?: number, zFar?: number);
        setValues(fieldOfViewYInRadians?: number, aspect?: number, zNear?: number, zFar?: number): PerspectiveCamera;
    }
}
declare module "engine/utils/Snippets" {
    export { isNotNull };
    export { crashIfNull };
    export { hasMemberOfPrototype };
    export { isOfPrototype };
    export { hasFunctionMember };
    export { buildArrayFromIndexedArrays };
    export { safeQuerySelector };
    function isNotNull<O extends any>(obj: O): obj is Exclude<O, null>;
    function crashIfNull<O extends any>(obj: O): Exclude<O, null>;
    function hasMemberOfPrototype<K extends string, P extends object>(obj: any, key: K, ctor: new (...args: any) => P): obj is {
        [key in K]: P;
    };
    function isOfPrototype<P extends object>(obj: any, ctor: new (...args: any) => P): obj is P;
    function hasFunctionMember<K extends string>(obj: any, key: K): obj is {
        [key in K]: Function;
    };
    function buildArrayFromIndexedArrays(arrays: number[][], indexes: ArrayLike<number>): number[];
    function safeQuerySelector<E extends Element>(parent: ParentNode, query: string): E;
}
declare module "engine/core/rendering/scenes/geometries/lib/polyhedron/CubeGeometry" {
    import { GeometryBase } from "engine/core/rendering/scenes/geometries/Geometry";
    export { CubeGeometry };
    class CubeGeometry extends GeometryBase {
        constructor();
    }
}
declare module "engine/libs/maths/geometry/GeometryConstants" {
    export { GOLDEN_RATIO };
    const GOLDEN_RATIO = 1.618;
}
declare module "engine/core/rendering/scenes/geometries/lib/polyhedron/IcosahedronGeometry" {
    import { GeometryBase } from "engine/core/rendering/scenes/geometries/Geometry";
    export { IcosahedronGeometry };
    class IcosahedronGeometry extends GeometryBase {
        constructor();
    }
}
declare module "engine/core/rendering/scenes/geometries/lib/QuadGeometry" {
    import { GeometryBase } from "engine/core/rendering/scenes/geometries/Geometry";
    export { QuadGeometry };
    class QuadGeometry extends GeometryBase {
        constructor();
    }
}
declare module "engine/core/rendering/webgl/WebGLConstants" {
    export { BlendingMode };
    export { BlendingEquation };
    export { BufferDataUsage };
    export { BufferMask };
    export { BufferMaskBit };
    export { BufferBindingPoint };
    export { BufferIndexType };
    export { BufferInterpolation };
    export { BufferTarget };
    export { Capabilities };
    export { CullFaceMode };
    export { DrawMode };
    export { DataType };
    export { Error };
    export { FramebufferAttachment };
    export { FramebufferAttachmentParameter };
    export { FramebufferTarget };
    export { FramebufferTextureTarget };
    export { FrontFace };
    export { HintTarget };
    export { HintMode };
    export { Parameter };
    export { PixelFormat };
    export { PixelStorageMode };
    export { PixelType };
    export { RenderbufferTarget };
    export { Shader };
    export { ShaderType };
    export { ShaderPrecision };
    export { StencilAction };
    export { TestFunction };
    export { TextureUnits };
    export { TextureParameter };
    export { TextureTarget };
    export { TextureMagFilter };
    export { TextureMinFilter };
    export { TextureWrapMode };
    export { UniformQuery };
    export { UniformType };
    export { VertexAttribute };
    enum BlendingMode {
        ZERO,
        ONE,
        SRC_COLOR,
        ONE_MINUS_SRC_COLOR,
        DST_COLOR,
        ONE_MINUS_DST_COLOR,
        SRC_ALPHA,
        ONE_MINUS_SRC_ALPHA,
        ONE_MINUS_DST_ALPHA,
        CONSTANT_COLOR,
        ONE_MINUS_CONSTANT_COLOR,
        CONSTANT_ALPHA,
        ONE_MINUS_CONSTANT_ALPHA,
        SRC_ALPHA_SATURATE
    }
    enum BlendingEquation {
        FUNC_ADD,
        FUNC_SUBTRACT,
        FUNC_REVERSE_SUBTRACT,
        MIN,
        MAX
    }
    enum BufferMaskBit {
        DEPTH_BUFFER_BIT,
        STENCIL_BUFFER_BIT,
        COLOR_BUFFER_BIT
    }
    enum BufferMask {
        DEPTH,
        STENCIL,
        COLOR,
        DEPTH_STENCIL
    }
    enum BufferDataUsage {
        STATIC_DRAW,
        DYNAMIC_DRAW,
        STREAM_DRAW,
        STATIC_READ,
        DYNAMIC_READ,
        STREAM_READ,
        STATIC_COPY,
        DYNAMIC_COPY,
        STREAM_COPY
    }
    enum BufferBindingPoint {
        ARRAY_BUFFER,
        ELEMENT_ARRAY_BUFFER,
        COPY_READ_BUFFER,
        COPY_WRITE_BUFFER,
        TRANSFORM_FEEDBACK_BUFFER,
        UNIFORM_BUFFER,
        PIXEL_PACK_BUFFER,
        PIXEL_UNPACK_BUFFER
    }
    enum BufferIndexType {
        UNSIGNED_BYTE,
        UNSIGNED_SHORT,
        UNSIGNED_INT
    }
    enum BufferInterpolation {
        LINEAR,
        NEAREST
    }
    enum BufferTarget {
        ARRAY_BUFFER,
        ELEMENT_ARRAY_BUFFER,
        COPY_READ_BUFFER,
        COPY_WRITE_BUFFER,
        TRANSFORM_FEEDBACK_BUFFER,
        UNIFORM_BUFFER,
        PIXEL_PACK_BUFFER,
        PIXEL_UNPACK_BUFFER
    }
    enum Capabilities {
        BLEND,
        CULL_FACE,
        DEPTH_TEST,
        DITHER,
        POLYGON_OFFSET_FILL,
        SAMPLE_ALPHA_TO_COVERAGE,
        SAMPLE_COVERAGE,
        SCISSOR_TEST,
        STENCIL_TEST,
        RASTERIZER_DISCARD
    }
    enum CullFaceMode {
        FRONT,
        BACK,
        FRONT_AND_BACK
    }
    enum DrawMode {
        POINTS,
        LINE_STRIP,
        LINE_LOOP,
        LINES,
        TRIANGLE_STRIP,
        TRIANGLE_FAN,
        TRIANGLES
    }
    enum DataType {
        BYTE,
        SHORT,
        UNSIGNED_BYTE,
        UNSIGNED_SHORT,
        FLOAT,
        HALF_FLOAT
    }
    enum Error {
        NO_ERROR,
        INVALID_ENUM,
        INVALID_OPERATION,
        OUT_OF_MEMORY,
        CONTEXT_LOST_WEBGL
    }
    enum FramebufferAttachment {
        COLOR_ATTACHMENT0,
        COLOR_ATTACHMENT1,
        COLOR_ATTACHMENT2,
        COLOR_ATTACHMENT3,
        COLOR_ATTACHMENT4,
        COLOR_ATTACHMENT5,
        COLOR_ATTACHMENT6,
        COLOR_ATTACHMENT7,
        COLOR_ATTACHMENT8,
        COLOR_ATTACHMENT9,
        COLOR_ATTACHMENT10,
        COLOR_ATTACHMENT11,
        COLOR_ATTACHMENT12,
        COLOR_ATTACHMENT13,
        COLOR_ATTACHMENT14,
        COLOR_ATTACHMENT15,
        DEPTH_ATTACHMENT,
        STENCIL_ATTACHMENT,
        DEPTH_STENCIL_ATTACHMENT
    }
    enum FramebufferAttachmentParameter {
        FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE,
        FRAMEBUFFER_ATTACHMENT_OBJECT_NAME,
        FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL,
        FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE,
        FRAMEBUFFER_ATTACHMENT_ALPHA_SIZE,
        FRAMEBUFFER_ATTACHMENT_BLUE_SIZE,
        FRAMEBUFFER_ATTACHMENT_COLOR_ENCODING,
        FRAMEBUFFER_ATTACHMENT_COMPONENT_TYPE,
        FRAMEBUFFER_ATTACHMENT_DEPTH_SIZE,
        FRAMEBUFFER_ATTACHMENT_GREEN_SIZE,
        FRAMEBUFFER_ATTACHMENT_RED_SIZE,
        FRAMEBUFFER_ATTACHMENT_STENCIL_SIZE,
        FRAMEBUFFER_ATTACHMENT_TEXTURE_LAYER
    }
    enum FramebufferTarget {
        FRAMEBUFFER,
        DRAW_FRAMEBUFFER,
        READ_FRAMEBUFFER
    }
    enum FramebufferTextureTarget {
        TEXTURE_2D,
        TEXTURE_CUBE_MAP_POSITIVE_X,
        TEXTURE_CUBE_MAP_NEGATIVE_X,
        TEXTURE_CUBE_MAP_POSITIVE_Y,
        TEXTURE_CUBE_MAP_NEGATIVE_Y,
        TEXTURE_CUBE_MAP_POSITIVE_Z,
        TEXTURE_CUBE_MAP_NEGATIVE_Z
    }
    enum FrontFace {
        CW,
        CCW
    }
    enum HintTarget {
        GENERATE_MIPMAP_HINT,
        FRAGMENT_SHADER_DERIVATIVE_HINT
    }
    enum HintMode {
        FASTEST,
        NICEST,
        DONT_CARE
    }
    enum Parameter {
        ACTIVE_TEXTURE,
        ALIASED_LINE_WIDTH_RANGE,
        ALIASED_POINT_SIZE_RANGE,
        ALPHA_BITS,
        ARRAY_BUFFER_BINDING,
        BLEND,
        BLEND_COLOR,
        BLEND_DST_ALPHA,
        BLEND_DST_RGB,
        BLEND_EQUATION,
        BLEND_EQUATION_ALPHA,
        BLEND_EQUATION_RGB,
        BLEND_SRC_ALPHA,
        BLEND_SRC_RGB,
        BLUE_BITS,
        COLOR_CLEAR_VALUE,
        COLOR_WRITEMASK,
        COMPRESSED_TEXTURE_FORMATS,
        CULL_FACE,
        CULL_FACE_MODE,
        CURRENT_PROGRAM,
        DEPTH_BITS,
        DEPTH_CLEAR_VALUE,
        DEPTH_FUNC,
        DEPTH_RANGE,
        DEPTH_TEST,
        DEPTH_WRITEMASK,
        DITHER,
        ELEMENT_ARRAY_BUFFER_BINDING,
        FRAMEBUFFER_BINDING,
        FRONT_FACE,
        GENERATE_MIPMAP_HINT,
        GREEN_BITS,
        IMPLEMENTATION_COLOR_READ_FORMAT,
        IMPLEMENTATION_COLOR_READ_TYPE,
        LINE_WIDTH,
        MAX_COMBINED_TEXTURE_IMAGE_UNITS,
        MAX_CUBE_MAP_TEXTURE_SIZE,
        MAX_FRAGMENT_UNIFORM_VECTORS,
        MAX_RENDERBUFFER_SIZE,
        MAX_TEXTURE_IMAGE_UNITS,
        MAX_TEXTURE_SIZE,
        MAX_VARYING_VECTORS,
        MAX_VERTEX_ATTRIBS,
        MAX_VERTEX_UNIFORM_VECTORS,
        MAX_VIEWPORT_DIMS,
        PACK_ALIGNMENT,
        POLYGON_OFFSET_FACTOR,
        POLYGON_OFFSET_FILL,
        POLYGON_OFFSET_UNITS,
        RED_BITS,
        RENDERBUFFER_BINDING,
        RENDERER,
        SAMPLE_BUFFERS,
        SAMPLE_COVERAGE_INVERT,
        SAMPLE_COVERAGE_VALUE,
        SAMPLES,
        SCISSOR_BOX,
        SCISSOR_TEST,
        SHADING_LANGUAGE_VERSION,
        STENCIL_BACK_FAIL,
        STENCIL_BACK_FUNC,
        STENCIL_BACK_PASS_DEPTH_FAIL,
        STENCIL_BACK_PASS_DEPTH_PASS,
        STENCIL_BACK_REF,
        STENCIL_BACK_VALUE_MASK,
        STENCIL_BACK_WRITEMASK,
        STENCIL_BITS,
        STENCIL_CLEAR_VALUE,
        STENCIL_FAIL,
        STENCIL_FUNC,
        STENCIL_PASS_DEPTH_FAIL,
        STENCIL_PASS_DEPTH_PASS,
        STENCIL_REF,
        STENCIL_TEST,
        STENCIL_VALUE_MASK,
        STENCIL_WRITEMASK,
        SUBPIXEL_BITS,
        TEXTURE_BINDING_2D,
        TEXTURE_BINDING_CUBE_MAP,
        UNPACK_ALIGNMENT,
        UNPACK_COLORSPACE_CONVERSION_WEBGL,
        UNPACK_FLIP_Y_WEBGL,
        UNPACK_PREMULTIPLY_ALPHA_WEBGL,
        VENDOR,
        VERSION,
        VIEWPORT,
        COPY_READ_BUFFER_BINDING,
        COPY_WRITE_BUFFER_BINDING,
        DRAW_FRAMEBUFFER_BINDING,
        FRAGMENT_SHADER_DERIVATIVE_HINT,
        MAX_3D_TEXTURE_SIZE,
        MAX_ARRAY_TEXTURE_LAYERS,
        MAX_CLIENT_WAIT_TIMEOUT_WEBGL,
        MAX_COLOR_ATTACHMENTS,
        MAX_COMBINED_FRAGMENT_UNIFORM_COMPONENTS,
        MAX_COMBINED_UNIFORM_BLOCKS,
        MAX_COMBINED_VERTEX_UNIFORM_COMPONENTS,
        MAX_DRAW_BUFFERS,
        MAX_ELEMENT_INDEX,
        MAX_ELEMENTS_INDICES,
        MAX_ELEMENTS_VERTICES,
        MAX_FRAGMENT_INPUT_COMPONENTS,
        MAX_FRAGMENT_UNIFORM_BLOCKS,
        MAX_FRAGMENT_UNIFORM_COMPONENTS,
        MAX_PROGRAM_TEXEL_OFFSET,
        MAX_SAMPLES,
        MAX_SERVER_WAIT_TIMEOUT,
        MAX_TEXTURE_LOD_BIAS,
        MAX_TRANSFORM_FEEDBACK_INTERLEAVED_COMPONENTS,
        MAX_TRANSFORM_FEEDBACK_SEPARATE_ATTRIBS,
        MAX_TRANSFORM_FEEDBACK_SEPARATE_COMPONENTS,
        MAX_UNIFORM_BLOCK_SIZE,
        MAX_UNIFORM_BUFFER_BINDINGS,
        MAX_VARYING_COMPONENTS,
        MAX_VERTEX_OUTPUT_COMPONENTS,
        MAX_VERTEX_UNIFORM_BLOCKS,
        MAX_VERTEX_UNIFORM_COMPONENTS,
        MIN_PROGRAM_TEXEL_OFFSET,
        PACK_ROW_LENGTH,
        PACK_SKIP_PIXELS,
        PACK_SKIP_ROWS,
        PIXEL_PACK_BUFFER_BINDING,
        PIXEL_UNPACK_BUFFER_BINDING,
        RASTERIZER_DISCARD,
        READ_BUFFER,
        READ_FRAMEBUFFER_BINDING,
        SAMPLE_ALPHA_TO_COVERAGE,
        SAMPLE_COVERAGE,
        SAMPLER_BINDING,
        TEXTURE_BINDING_2D_ARRAY,
        TEXTURE_BINDING_3D,
        TRANSFORM_FEEDBACK_ACTIVE,
        TRANSFORM_FEEDBACK_BINDING,
        TRANSFORM_FEEDBACK_BUFFER_BINDING,
        TRANSFORM_FEEDBACK_PAUSED,
        UNIFORM_BUFFER_BINDING,
        UNIFORM_BUFFER_OFFSET_ALIGNMENT,
        UNPACK_IMAGE_HEIGHT,
        UNPACK_ROW_LENGTH,
        UNPACK_SKIP_IMAGES,
        UNPACK_SKIP_PIXELS,
        UNPACK_SKIP_ROWS,
        VERTEX_ARRAY_BINDING
    }
    enum PixelFormat {
        ALPHA,
        LUMINANCE,
        LUMINANCE_ALPHA,
        RGB,
        RGBA,
        RGBA4,
        RGB565,
        RGB5_A1,
        DEPTH_COMPONENT,
        DEPTH_STENCIL,
        STENCIL_INDEX8,
        R8,
        R8UI,
        R8I,
        R16UI,
        R16I,
        R32UI,
        R32I,
        RG8,
        RG8UI,
        RG8I,
        RG16UI,
        RG16I,
        RG32UI,
        RG32I,
        RGB8,
        RGBA8,
        SRGB8_ALPHA8,
        RGB10_A2,
        RGBA8UI,
        RGBA8I,
        RGB10_A2UI,
        RGBA16UI,
        RGBA16I,
        RGBA32I,
        RGBA32UI,
        DEPTH_COMPONENT24,
        DEPTH_COMPONENT32F,
        DEPTH24_STENCIL8,
        DEPTH32F_STENCIL8
    }
    enum PixelStorageMode {
        UNPACK_FLIP_Y_WEBGL,
        UNPACK_PREMULTIPLY_ALPHA_WEBGL,
        UNPACK_COLORSPACE_CONVERSION_WEBGL
    }
    enum PixelType {
        BYTE,
        FLOAT,
        FLOAT_32_UNSIGNED_INT_24_8_REV,
        HALF_FLOAT,
        INT,
        SHORT,
        UNSIGNED_BYTE,
        UNSIGNED_INT,
        UNSIGNED_INT_2_10_10_10_REV,
        UNSIGNED_INT_10F_11F_11F_REV,
        UNSIGNED_INT_5_9_9_9_REV,
        UNSIGNED_INT_24_8,
        UNSIGNED_SHORT,
        UNSIGNED_SHORT_5_6_5,
        UNSIGNED_SHORT_4_4_4_4,
        UNSIGNED_SHORT_5_5_5_1
    }
    enum RenderbufferTarget {
        RENDERBUFFER
    }
    enum Shader {
        FRAGMENT_SHADER,
        VERTEX_SHADER,
        COMPILE_STATUS,
        DELETE_STATUS,
        LINK_STATUS,
        VALIDATE_STATUS,
        ATTACHED_SHADERS,
        ACTIVE_ATTRIBUTES,
        ACTIVE_UNIFORMS,
        MAX_VERTEX_ATTRIBS,
        MAX_VERTEX_UNIFORM_VECTORS,
        MAX_VARYING_VECTORS,
        MAX_COMBINED_TEXTURE_IMAGE_UNITS,
        MAX_VERTEX_TEXTURE_IMAGE_UNITS,
        MAX_TEXTURE_IMAGE_UNITS,
        MAX_FRAGMENT_UNIFORM_VECTORS,
        SHADER_TYPE,
        SHADING_LANGUAGE_VERSION,
        CURRENT_PROGRAM
    }
    enum ShaderType {
        FRAGMENT_SHADER,
        VERTEX_SHADER
    }
    enum ShaderPrecision {
        LOW_FLOAT,
        MEDIUM_FLOAT,
        HIGH_FLOAT,
        LOW_INT,
        MEDIUM_INT,
        HIGH_INT
    }
    enum StencilAction {
        KEEP,
        REPLACE,
        INCR,
        DECR,
        INVERT,
        INCR_WRAP,
        DECR_WRAP
    }
    enum TestFunction {
        NEVER,
        LESS,
        EQUAL,
        LEQUAL,
        GREATER,
        NOTEQUAL,
        GEQUAL,
        ALWAYS
    }
    enum TextureUnits {
        TEXTURE,
        TEXTURE0
    }
    enum TextureParameter {
        TEXTURE_MAG_FILTER,
        TEXTURE_MIN_FILTER,
        TEXTURE_WRAP_S,
        TEXTURE_WRAP_T,
        TEXTURE_BASE_LEVEL,
        TEXTURE_MAX_LEVEL,
        TEXTURE_MAX_LOD,
        TEXTURE_MIN_LOD,
        TEXTURE_WRAP_R
    }
    enum TextureTarget {
        TEXTURE_2D,
        TEXTURE_CUBE_MAP,
        TEXTURE_3D,
        TEXTURE_2D_ARRAY,
        TEXTURE_CUBE_MAP_POSITIVE_X,
        TEXTURE_CUBE_MAP_NEGATIVE_X,
        TEXTURE_CUBE_MAP_POSITIVE_Y,
        TEXTURE_CUBE_MAP_NEGATIVE_Y,
        TEXTURE_CUBE_MAP_POSITIVE_Z,
        TEXTURE_CUBE_MAP_NEGATIVE_Z
    }
    enum TextureMagFilter {
        LINEAR,
        NEAREST
    }
    enum TextureMinFilter {
        LINEAR,
        NEAREST,
        NEAREST_MIPMAP_NEAREST,
        LINEAR_MIPMAP_NEAREST,
        NEAREST_MIPMAP_LINEAR,
        LINEAR_MIPMAP_LINEAR
    }
    enum TextureWrapMode {
        REPEAT,
        CLAMP_TO_EDGE,
        MIRRORED_REPEAT
    }
    enum UniformQuery {
        UNIFORM_TYPE,
        UNIFORM_SIZE,
        UNIFORM_BLOCK_INDEX,
        UNIFORM_OFFSET,
        UNIFORM_ARRAY_STRIDE,
        UNIFORM_MATRIX_STRIDE,
        UNIFORM_IS_ROW_MAJOR
    }
    enum UniformType {
        BOOL,
        BOOL_VEC2,
        BOOL_VEC3,
        BOOL_VEC4,
        INT,
        INT_VEC2,
        INT_VEC3,
        INT_VEC4,
        INT_SAMPLER_2D,
        INT_SAMPLER_3D,
        INT_SAMPLER_CUBE,
        INT_SAMPLER_2D_ARRAY,
        UNSIGNED_INT_SAMPLER_2D,
        UNSIGNED_INT_SAMPLER_3D,
        UNSIGNED_INT_SAMPLER_CUBE,
        UNSIGNED_INT_SAMPLER_2D_ARRAY,
        UNSIGNED_INT,
        UNSIGNED_INT_VEC2,
        UNSIGNED_INT_VEC3,
        UNSIGNED_INT_VEC4,
        FLOAT,
        FLOAT_VEC2,
        FLOAT_VEC3,
        FLOAT_VEC4,
        FLOAT_MAT2,
        FLOAT_MAT3,
        FLOAT_MAT4,
        FLOAT_MAT2x3,
        FLOAT_MAT2x4,
        FLOAT_MAT3x2,
        FLOAT_MAT3x4,
        FLOAT_MAT4x2,
        FLOAT_MAT4x3,
        SAMPLER_2D,
        SAMPLER_3D,
        SAMPLER_CUBE,
        SAMPLER_2D_SHADOW,
        SAMPLER_2D_ARRAY,
        SAMPLER_2D_ARRAY_SHADOW,
        SAMPLER_CUBE_SHADOW
    }
    enum VertexAttribute {
        CURRENT_VERTEX_ATTRIB,
        VERTEX_ATTRIB_ARRAY_ENABLED,
        VERTEX_ATTRIB_ARRAY_SIZE,
        VERTEX_ATTRIB_ARRAY_STRIDE,
        VERTEX_ATTRIB_ARRAY_TYPE,
        VERTEX_ATTRIB_ARRAY_NORMALIZED,
        VERTEX_ATTRIB_ARRAY_POINTER,
        VERTEX_ATTRIB_ARRAY_BUFFER_BINDING
    }
}
declare module "engine/core/rendering/webgl/WebGLFramebufferUtilities" {
    import { FramebufferAttachment, FramebufferTextureTarget, BufferMaskBit, TextureMagFilter } from "engine/core/rendering/webgl/WebGLConstants";
    export { WebGLFramebufferUtilities };
    type FramebufferReference = {
        glFb: WebGLFramebuffer;
    };
    type Framebuffer = FramebufferReference;
    type FramebufferTextureAttachmentProperties = {
        attachment: FramebufferAttachment;
        texTarget: FramebufferTextureTarget;
        glTex: WebGLTexture;
    };
    type FramebufferTextureAttachment = FramebufferTextureAttachmentProperties & Framebuffer;
    type FramebufferRenderbufferAttachmentProperties = {
        attachment: FramebufferAttachment;
        glRb: WebGLTexture;
    };
    type FramebufferRenderbufferAttachment = FramebufferRenderbufferAttachmentProperties & Framebuffer;
    class WebGLFramebufferUtilities {
        private constructor();
        static createFramebuffer(gl: WebGL2RenderingContext): Framebuffer | null;
        static attachTexture(gl: WebGL2RenderingContext, fb: Framebuffer, props: FramebufferTextureAttachmentProperties): FramebufferTextureAttachment;
        static attachTextures(gl: WebGL2RenderingContext, fb: Framebuffer, props: FramebufferTextureAttachmentProperties[]): FramebufferTextureAttachment[];
        static attachRenderbuffers(gl: WebGL2RenderingContext, fb: Framebuffer, props: FramebufferRenderbufferAttachmentProperties[]): FramebufferRenderbufferAttachment[];
        static attachRenderbuffer(gl: WebGL2RenderingContext, fb: Framebuffer, props: FramebufferRenderbufferAttachmentProperties): FramebufferRenderbufferAttachment;
        static blit(gl: WebGL2RenderingContext, readFb: Framebuffer | null, drawFb: Framebuffer | null, readRec: Tuple<number, 4>, drawRec: Tuple<number, 4>, mask: BufferMaskBit, filter: TextureMagFilter): void;
        static clearColor(gl: WebGL2RenderingContext, fb: Framebuffer, buff: Float32Array | Tuple<number, 4>, offset?: number): void;
        static clearDepthStencil(gl: WebGL2RenderingContext, fb: Framebuffer, depth: number, stencil: number): void;
        static checkFramebufferStatus(gl: WebGL2RenderingContext): number;
        static deleteFramebuffer(gl: WebGL2RenderingContext, fb: Framebuffer): void;
        static bindFramebuffer(gl: WebGL2RenderingContext, fb: Framebuffer): void;
        static unbindFramebuffer(gl: WebGL2RenderingContext): void;
    }
}
declare module "engine/core/rendering/webgl/WebGLBufferUtilities" {
    export { WebGLBufferUtilities };
    class WebGLBufferUtilities {
        static createBuffer(gl: WebGL2RenderingContext): WebGLBuffer | null;
    }
}
declare module "engine/core/rendering/webgl/WebGLVertexArrayUtilities" {
    export { WebGLVertexArrayUtilities };
    class WebGLVertexArrayUtilities {
        private constructor();
        static createVertexArray(gl: WebGL2RenderingContext): WebGLBuffer | null;
    }
}
declare module "engine/core/rendering/webgl/WebGLAttributeUtilities" {
    import { DataType, BufferTarget, BufferDataUsage, BufferIndexType } from "engine/core/rendering/webgl/WebGLConstants";
    export { AttributeArray };
    export { AttributeIndicesArray };
    export { AttributeNumComponents };
    export { AttributeProperties };
    export { Attribute };
    export { AttributesList };
    export { AttributeSetter };
    export { AttributesListProperties };
    export { AttributesSettersList };
    export { WebGLAttributeUtilities };
    type AttributeArray = TypedArray;
    type AttributeIndicesArray = Uint8Array | Uint16Array | Uint32Array;
    type AttributeNumComponents = 1 | 2 | 3 | 4;
    type AttributeProperties<N extends AttributeNumComponents = AttributeNumComponents> = {
        numComponents: N;
        normalized?: boolean;
        srcOffset?: number;
        srcLength?: number;
    };
    type Attribute<A extends AttributeArray = AttributeArray, N extends AttributeNumComponents = AttributeNumComponents> = {
        array: A;
        props: AttributeProperties<N>;
    };
    type AttributesList = {
        list: List<Attribute>;
        indices?: AttributeIndicesArray;
        props?: Partial<AttributesListProperties>;
    };
    type AttributeSetter = {
        location: number;
        bufferBytesOffset: number;
    };
    type AttributesListProperties = {
        instanced: boolean;
        divisor: number;
        target: BufferTarget;
        usage: BufferDataUsage;
    };
    type AttributesSettersList = {
        setters: List<AttributeSetter>;
        props: AttributesListProperties;
        bufferByteLength: number;
        numElements: number;
        hasIndices: boolean;
        indexType: BufferIndexType;
        glVao: WebGLVertexArrayObject;
        glBuffer: WebGLBuffer;
        glIndicesBuffer: WebGLBuffer;
        glProg: WebGLProgram;
    };
    class WebGLAttributeUtilities {
        static getAttributesListSetter(gl: WebGL2RenderingContext, glProg: WebGLProgram, list: AttributesList): AttributesSettersList | null;
        static setAttributesListValues(gl: WebGL2RenderingContext, settersList: AttributesSettersList, list: AttributesList): void;
        static bindAttributesList(gl: WebGL2RenderingContext, settersList: AttributesSettersList): void;
        static unbindAttributesList(gl: WebGL2RenderingContext): void;
        static getAttributeArrayDataType(array: AttributeArray): DataType;
        static getDataTypeByteLength(dataType: DataType): number;
        static getAttributeIndicesBufferType(indices: AttributeIndicesArray): BufferIndexType;
        private static getAttributesListNumElements;
    }
}
declare module "engine/core/rendering/webgl/WebGLTextureUtilities" {
    import { PixelFormat, TextureTarget, PixelType, TextureMinFilter, TextureMagFilter, TextureWrapMode } from "engine/core/rendering/webgl/WebGLConstants";
    export { TexturePixels };
    export { Texture2DPixels };
    export { TextureCubeMapPixels };
    export { TextureReference };
    export { TextureProperties };
    export { TexturePartialProperties };
    export { TextureBinding };
    export { Texture };
    export { TexturesUnitsContext };
    export { WebGLTextureUtilities };
    type TexturePixels = number[] | ArrayBufferView | TexImageSource | null;
    type Texture2DPixels = TexturePixels;
    type TextureCubeMapPixels = {
        xPos: TexImageSource;
        xNeg: TexImageSource;
        yPos: TexImageSource;
        yNeg: TexImageSource;
        zPos: TexImageSource;
        zNeg: TexImageSource;
    };
    type TextureReference = {
        glTex: WebGLTexture;
    };
    type TextureProperties = {
        target: TextureTarget;
        pixels: Texture2DPixels | TextureCubeMapPixels;
        subimage?: {
            xoffset: number;
            yoffset: number;
            width: number;
            height: number;
        };
        lod: number;
        width: number;
        height: number;
        format: PixelFormat;
        internalFormat?: PixelFormat;
        type: PixelType;
        min?: TextureMinFilter;
        mag?: TextureMagFilter;
        wrapS?: TextureWrapMode;
        wrapT?: TextureWrapMode;
        wrapR?: TextureWrapMode;
        baseLod?: number;
        maxLod?: number;
    };
    type TexturePartialProperties = Required<Pick<TextureProperties, 'pixels'>> & Partial<TextureProperties>;
    type TextureBinding = {
        unit: number;
    };
    type Texture = TextureProperties & TextureReference & TextureBinding;
    type TexturesUnitsContext = {
        maxTextureUnits: number;
        registeredTextureUnits: Array<boolean>;
    };
    class WebGLTextureUtilities {
        private constructor();
        static createBindingsContext(gl: WebGL2RenderingContext): TexturesUnitsContext;
        static createTexture(gl: WebGL2RenderingContext, ctx: TexturesUnitsContext, props: TextureProperties): Texture | null;
        static deleteTexture(gl: WebGL2RenderingContext, ctx: TexturesUnitsContext, tex: Texture): void;
        static setTexture(gl: WebGL2RenderingContext, tex: Texture): void;
        static setTextureParameters(gl: WebGL2RenderingContext, tex: Texture): void;
        static bindTexture(gl: WebGL2RenderingContext, tex: Texture): void;
        static guessTextureProperties(tex: TexturePartialProperties): TextureProperties;
        static getNumBytesFromPixelTypeAndFormat(type: PixelType, format: PixelFormat): number;
        static getNumChannelsFromPixelFormat(format: PixelFormat): number;
        private static _allocateTextureUnit;
        private static _freeTextureUnit;
    }
}
declare module "engine/core/rendering/webgl/WebGLUniformUtilities" {
    import { UniformType } from "engine/core/rendering/webgl/WebGLConstants";
    import { Texture } from "engine/core/rendering/webgl/WebGLTextureUtilities";
    export { UniformValue };
    export { UniformProperties };
    export { Uniform };
    export { UniformsList };
    export { UniformSetter };
    export { UniformsSettersList };
    export { WebGLUniformUtilities };
    type UniformValue = number | Float32List | Uint32List | Int32List | Texture;
    type UniformProperties = {
        srcOffset?: number;
        srcLength?: number;
        transpose?: boolean;
    };
    type Uniform<V extends UniformValue = UniformValue> = {
        value: V;
        props?: UniformProperties;
    };
    type UniformsList = List<Uniform>;
    type UniformSetter = {
        type: UniformType;
        func: (value: any) => void;
    };
    type UniformsSettersList = {
        setters: List<UniformSetter | null>;
        glProg: WebGLProgram;
    };
    class WebGLUniformUtilities {
        private constructor();
        static getUniformValueArrayBufferView(uniformValue: UniformValue): ArrayBufferView;
        static getUniformsListSetter(gl: WebGL2RenderingContext, glProg: WebGLProgram, list: UniformsList): UniformsSettersList;
        static setUniformsListValues(gl: WebGL2RenderingContext, settersList: UniformsSettersList, list: UniformsList): void;
        static isTexture(uniformValue: UniformValue): boolean;
        static getUniformSetter(gl: WebGL2RenderingContext, glProg: WebGLProgram, uniformName: string, uniform: Uniform): UniformSetter | null;
    }
}
declare module "engine/core/rendering/webgl/WebGLUniformBlockUtilities" {
    import { UniformsList } from "engine/core/rendering/webgl/WebGLUniformUtilities";
    import { BufferDataUsage } from "engine/core/rendering/webgl/WebGLConstants";
    export { UniformBlockProperties };
    export { UniformBlockReference };
    export { UniformBlockBinding };
    export { UniformBlock };
    export { UniformBlockSetter };
    export { UniformBlocksBindingsContext };
    export { WebGLUniformBlockUtilities };
    type UniformBlockProperties = {
        name: string;
        usage?: BufferDataUsage;
    };
    type UniformBlockReference = {
        glBuffer: WebGLBuffer;
    };
    type UniformBlockBinding = {
        bindingPoint: number;
    };
    type UniformBlock = UniformBlockProperties & UniformBlockReference & UniformBlockBinding;
    type UniformBlockSetter = UniformBlock & {
        index: number;
        uniforms: {
            [name: string]: {
                offset: number;
            };
        };
        bufferByteLength: number;
        glProg: WebGLProgram;
    };
    type UniformBlocksBindingsContext = {
        maxBindingPoints: number;
        registeredBindingPoints: Array<boolean>;
    };
    class WebGLUniformBlockUtilities {
        private constructor();
        static createBindingsContext(gl: WebGL2RenderingContext): UniformBlocksBindingsContext;
        static createUniformBlock(gl: WebGL2RenderingContext, ctx: UniformBlocksBindingsContext, name: string): UniformBlock | null;
        static getUniformBlockSetter(gl: WebGL2RenderingContext, glProg: WebGLProgram, block: UniformBlock): UniformBlockSetter | null;
        static setUniformBlockValues(gl: WebGL2RenderingContext, setter: UniformBlockSetter, uniforms: UniformsList): void;
        static bindUniformBlock(gl: WebGL2RenderingContext, setter: UniformBlockSetter): void;
        private static _allocateBindingPoint;
        private static _freeBindingPoint;
    }
}
declare module "engine/core/rendering/webgl/WebGLDrawUtilities" {
    import { DrawMode, BufferIndexType } from "engine/core/rendering/webgl/WebGLConstants";
    export { WebGLDrawUtilities };
    class WebGLDrawUtilities {
        private constructor();
        static drawElements(gl: WebGL2RenderingContext, mode: DrawMode, indexType: BufferIndexType, count: number, offset: number): void;
        static drawElementsInstanced(gl: WebGL2RenderingContext, mode: DrawMode, indexType: BufferIndexType, count: number, offset: number, instanceCount: number): void;
        static drawRangeElements(gl: WebGL2RenderingContext, mode: DrawMode, start: number, end: number, count: number, indexType: BufferIndexType, offset: number): void;
        static drawArrays(gl: WebGL2RenderingContext, mode: DrawMode, first: number, count: number): void;
        static drawArraysInstanced(gl: WebGL2RenderingContext, mode: DrawMode, first: number, count: number, instances: number): void;
    }
}
declare module "engine/core/rendering/webgl/WebGLPacketUtilities" {
    import { AttributesList, AttributesSettersList } from "engine/core/rendering/webgl/WebGLAttributeUtilities";
    import { Texture, TextureProperties, TexturesUnitsContext } from "engine/core/rendering/webgl/WebGLTextureUtilities";
    import { UniformBlock, UniformBlockProperties, UniformBlocksBindingsContext, UniformBlockSetter } from "engine/core/rendering/webgl/WebGLUniformBlockUtilities";
    import { UniformsList, UniformsSettersList } from "engine/core/rendering/webgl/WebGLUniformUtilities";
    import { DrawMode } from "engine/core/rendering/webgl/WebGLConstants";
    export { Packet };
    export { PacketBindingsProperties };
    export { PacketBindings };
    export { PacketOptions };
    export { PacketSetter };
    export { WebGLPacketUtilities };
    type Packet = {
        attributes?: AttributesList;
        uniforms?: UniformsList;
        uniformBlocks?: List<{
            block: UniformBlock;
            list: UniformsList;
        }>;
        props?: PacketOptions;
    };
    type PacketBindingsProperties = {
        texturesProps?: List<TextureProperties>;
        blocksProps?: List<UniformBlockProperties>;
        texturesCtx?: TexturesUnitsContext;
        blocksCtx?: UniformBlocksBindingsContext;
    };
    type PacketBindings = {
        textures: List<Texture>;
        blocks: List<UniformBlock>;
        texturesCtx?: TexturesUnitsContext;
        blocksCtx?: UniformBlocksBindingsContext;
    };
    type PacketOptions = {
        drawMode?: DrawMode;
        instanced?: boolean;
        instanceCount?: number;
    };
    type PacketSetter = {
        attributesSetter?: AttributesSettersList;
        uniformsSetter?: UniformsSettersList;
        uniformBlockSetters?: List<UniformBlockSetter>;
        drawMode: DrawMode;
        instanced: boolean;
        instanceCount: number;
    };
    class WebGLPacketUtilities {
        private constructor();
        static createPacketBindings(gl: WebGL2RenderingContext, props: PacketBindingsProperties): PacketBindings | null;
        static getPacketSetter(gl: WebGL2RenderingContext, glProg: WebGLProgram, packet: Packet): PacketSetter | null;
        static setPacketValues(gl: WebGL2RenderingContext, setter: PacketSetter, packet: Packet): void;
        static drawPacket(gl: WebGL2RenderingContext, setter: PacketSetter): void;
    }
}
declare module "engine/core/rendering/webgl/WebGLShaderUtilities" {
    import { ShaderType } from "engine/core/rendering/webgl/WebGLConstants";
    export { WebGLShaderUtilities };
    class WebGLShaderUtilities {
        private constructor();
        static createShader(gl: WebGL2RenderingContext, type: ShaderType, source: string): WebGLShader | null;
        static deleteShader(gl: WebGL2RenderingContext, glShader: WebGLShader): void;
    }
}
declare module "engine/core/rendering/webgl/WebGLProgramUtilities" {
    export { WebGLProgramUtilties };
    class WebGLProgramUtilties {
        private constructor();
        static createProgramFromSources(gl: WebGL2RenderingContext, vertexSource: string, fragmentSource: string): WebGLProgram | null;
        static createProgram(gl: WebGL2RenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram | null;
        static deleteProgram(gl: WebGL2RenderingContext, glProg: WebGLProgram): void;
        static useProgram(gl: WebGL2RenderingContext, glProg: WebGLProgram): void;
    }
}
declare module "engine/core/rendering/webgl/WebGLRenderbuffersUtilities" {
    import { PixelFormat } from "engine/core/rendering/webgl/WebGLConstants";
    export { WebGLRenderbufferUtilities };
    type Renderbuffer = {
        glRb: WebGLRenderbuffer;
    };
    type RenderbufferProperties = {
        internalFormat: PixelFormat;
        width: number;
        height: number;
        samples?: number;
    };
    class WebGLRenderbufferUtilities {
        private constructor();
        static createRenderbuffer(gl: WebGL2RenderingContext, props: RenderbufferProperties): Renderbuffer | null;
    }
}
declare module "engine/core/rendering/webgl/WebGLRendererUtilities" {
    import { Capabilities, BufferMaskBit, Parameter, TestFunction } from "engine/core/rendering/webgl/WebGLConstants";
    export { WebGLRendererUtilities };
    class WebGLRendererUtilities {
        private constructor();
        static setScissor(gl: WebGL2RenderingContext, x: number, y: number, width: number, height: number): void;
        static setViewport(gl: WebGL2RenderingContext, x: number, y: number, width: number, height: number): void;
        static getViewport(gl: WebGL2RenderingContext): Int32Array;
        static getScissorBox(gl: WebGL2RenderingContext): Int32Array;
        static getParameter(gl: WebGL2RenderingContext, param: Parameter): any;
        static enable(gl: WebGL2RenderingContext, cap: Capabilities): void;
        static depthFunc(gl: WebGL2RenderingContext, func: TestFunction): void;
        static stencilFunc(gl: WebGL2RenderingContext, func: TestFunction, ref: number, mask: number): void;
        static clear(gl: WebGL2RenderingContext, buff: BufferMaskBit): void;
        static clearRgba(gl: WebGL2RenderingContext, red: number, green: number, blue: number, alpha: number): void;
        static clearColor(gl: WebGL2RenderingContext, color: Tuple<number, 4>): void;
    }
}
declare module "engine/editor/elements/lib/containers/panels/Panel" {
    export { PanelElement };
    class PanelElement extends HTMLElement {
        label: string;
        state: 'opened' | 'closed';
        constructor();
        render(): Promise<void>;
        connectedCallback(): void;
    }
}
declare module "engine/editor/elements/lib/containers/panels/PanelGroup" {
    export { PanelGroupElement };
    class PanelGroupElement extends HTMLElement {
        label: string;
        state: 'opened' | 'closed';
        static readonly observedAttributes: string[];
        constructor();
        connectedCallback(): void;
    }
}
declare module "engine/libs/graphics/colors/Color" {
    export { ColorValues };
    export { Color };
    export { ColorBase };
    type ColorValues = [number, number, number, number];
    interface ColorConstructor {
        readonly prototype: Color;
        new (): Color;
        new (values: ColorValues): Color;
        new (values?: ColorValues): Color;
        readonly BLACK: Color;
        readonly RED: Color;
        readonly GREEN: Color;
        readonly BLUE: Color;
        readonly WHITE: Color;
        rgb(r: number, g: number, b: number): Color;
        rgba(r: number, g: number, b: number, a: number): Color;
        array(...colors: Color[]): number[];
    }
    interface Color {
        array: ArrayLike<number>;
        r: number;
        g: number;
        b: number;
        a: number;
        copy(color: Color): Color;
        clone(): Color;
        getValues(): ColorValues;
        setValues(c: ColorValues): Color;
        lerp(color: Color, t: number): Color;
        valuesNormalized(): ColorValues;
    }
    class ColorBase implements Color {
        private _array;
        constructor();
        constructor(type: new (length: number) => TypedArray);
        static readonly BLACK: ColorBase;
        static readonly RED: ColorBase;
        static readonly GREEN: ColorBase;
        static readonly BLUE: ColorBase;
        static readonly WHITE: ColorBase;
        static rgb(r: number, g: number, b: number): ColorBase;
        static rgba(r: number, g: number, b: number, a: number): ColorBase;
        static array(...colors: ColorBase[]): number[];
        get array(): ArrayLike<number>;
        get r(): number;
        set r(r: number);
        get g(): number;
        set g(g: number);
        get b(): number;
        set b(b: number);
        get a(): number;
        set a(a: number);
        setValues(c: ColorValues): ColorBase;
        getValues(): ColorValues;
        copy(color: ColorBase): ColorBase;
        clone(): ColorBase;
        lerp(color: ColorBase, t: number): ColorBase;
        valuesNormalized(): ColorValues;
    }
    const Color: ColorConstructor;
}
declare module "engine/libs/patterns/messaging/brokers/SingleTopicMessageBroker" {
    export { SingleTopicMessagePublisher };
    export { SingleTopicMessageSubscriber };
    export { SingleTopicMessageBroker };
    export { SingleTopicMessageBrokerBase };
    interface SingleTopicMessagePublisher<M extends unknown = any> {
        hasSubscriptions(): boolean;
        publish(message: M): void;
    }
    interface SingleTopicMessageSubscriber<M extends unknown = any> {
        hasSubscriptions(): boolean;
        subscribe(subscription: (message: M) => void): (message: any) => void;
        unsubscribe(subscription: (message: M) => void): number;
    }
    interface SingleTopicMessageBroker<M extends unknown = any> extends SingleTopicMessagePublisher<M>, SingleTopicMessageSubscriber<M> {
    }
    interface SingleTopicMessageBrokerConstructor {
        readonly prototype: SingleTopicMessageBroker;
        new (): SingleTopicMessageBroker;
    }
    class SingleTopicMessageBrokerBase<M extends unknown = any> implements SingleTopicMessageBroker {
        private _subscriptions;
        constructor();
        hasSubscriptions(): boolean;
        subscribe(subscription: (message: M) => void): (message: M) => void;
        unsubscribe(subscription: (message: M) => void): number;
        publish(message: M): void;
    }
    const SingleTopicMessageBroker: SingleTopicMessageBrokerConstructor;
}
declare module "engine/core/logger/Logger" {
    export { LogLevel };
    export { LoggerMessage };
    export { Logger };
    export { LoggerBase };
    enum LogLevel {
        DEBUG = 0,
        ERROR = 1,
        INFO = 2,
        LOG = 3,
        WARN = 4
    }
    type LoggerMessage = {
        level: LogLevel;
        message: string;
    };
    interface Logger {
        log(message: string): void;
        info(message: string): void;
        warn(message: string): void;
        debug(message: string): void;
        error(message: string): void;
        subscribe(subscription: (message: LoggerMessage) => void): (message: LoggerMessage) => void;
        unsubscribe(subscription: (message: LoggerMessage) => void): number;
    }
    class LoggerBase implements Logger {
        constructor();
        log(message: string): void;
        info(message: string): void;
        warn(message: string): void;
        debug(message: string): void;
        error(message: string): void;
        protected _onLog(level: LogLevel, message: string): void;
        private _broker;
        subscribe(subscription: (message: LoggerMessage) => void): (message: LoggerMessage) => void;
        unsubscribe(subscription: (message: LoggerMessage) => void): number;
        private formatMessage;
        private getTimestamp;
    }
    const Logger: Logger;
}
declare module "engine/resources/Resources" {
    export { Resources };
    interface Resources {
        readonly folder: string;
        get<T>(path: string): T | null;
        toString(): string;
        load(path: string): Promise<void>;
        loadList(path: string): Promise<void>;
    }
    interface ResourcesConstructor {
        readonly prototype: Resources;
        new (folder?: string): Resources;
    }
    const Resources: ResourcesConstructor;
}
declare module "engine/editor/elements/lib/containers/dropdown/Dropdown" {
    export { HTMLEDropdownElement };
    export { isDropdownElement };
    function isDropdownElement(elem: Element): elem is HTMLEDropdownElement;
    class HTMLEDropdownElement extends HTMLElement {
        expanded: boolean;
        button: HTMLElement | null;
        content: HTMLElement | null;
        constructor();
        connectedCallback(): void;
    }
}
declare module "engine/editor/elements/lib/containers/menus/MenuButton" {
    import { HTMLEMenuElement } from "engine/editor/elements/lib/containers/menus/Menu";
    export { HTMLEMenuButtonElement };
    export { isHTMLEMenuButtonElement };
    export { BaseHTMLEMenuButtonElement };
    function isHTMLEMenuButtonElement(elem: Element): elem is HTMLEMenuButtonElement;
    interface HTMLEMenuButtonElement extends HTMLElement {
        name: string;
        label: string;
        disabled: boolean;
        icon: string;
        active: boolean;
        childMenu: HTMLEMenuElement | null;
        trigger(): void;
    }
    class BaseHTMLEMenuButtonElement extends HTMLElement implements HTMLEMenuButtonElement {
        name: string;
        label: string;
        disabled: boolean;
        icon: string;
        active: boolean;
        childMenu: HTMLEMenuElement | null;
        constructor();
        trigger(): void;
        attributeChangedCallback(name: string, oldValue: string, newValue: string): void;
        connectedCallback(): void;
    }
}
declare module "engine/editor/elements/lib/misc/Palette" {
    export { PaletteElement };
    class PaletteElement extends HTMLElement {
        colors: Array<string>;
        constructor();
        connectedCallback(): void;
    }
}
declare module "engine/editor/elements/lib/utils/Loader" {
    export { isHTMLELoaderElement };
    export { HTMLELoaderElement };
    export { BaseHTMLELoaderElement };
    function isHTMLELoaderElement(obj: any): obj is HTMLELoaderElement;
    type LoaderType = "bar" | "circle";
    interface HTMLELoaderElement extends HTMLElement {
        type: LoaderType;
    }
    class BaseHTMLELoaderElement extends HTMLElement {
        type: LoaderType;
        constructor();
        connectedCallback(): void;
    }
}
declare module "samples/scenes/SimpleScene" {
    export function start(): Promise<void>;
    export function launchScene(): Promise<void>;
}
declare module "samples/Sandbox" {
    export function sandbox(): Promise<void>;
}
declare module "boot" {
    export function boot(): Promise<void>;
}
declare module "engine/Engine" {
    export { IEngine };
    export { Engine };
    interface IEngine {
        run(): void;
    }
    class Engine implements IEngine {
        boot(): Promise<void>;
        run(): void;
    }
}
declare module "engine/config/Configuration" {
    export { IConfigurationOptions };
    export { IConfiguration };
    export { SConfiguration };
    interface IConfigurationOptions {
        renderingCanvasId: string;
    }
    interface IConfiguration {
        options: IConfigurationOptions;
    }
    class SConfiguration implements IConfiguration {
        private static _instance;
        static get instance(): IConfiguration;
        private constructor();
        readonly options: IConfigurationOptions;
    }
}
declare module "engine/core/general/ComponentsRegistry" {
    import { Component } from "engine/core/general/Component";
    import { Entity } from "engine/core/general/Entity";
    export class ComponentsRegistry {
        private static _instance;
        static get instance(): ComponentsRegistry;
        private _dictionary;
        private constructor();
        register<T extends Component<any>>(name: string, type: {
            new (...args: any): T;
        }): void;
        create<T extends Component<any>>(name: string, owner: Entity, desc: any): T | undefined;
    }
}
declare module "engine/core/general/Entity" {
    import { ComponentDesc, Component } from "engine/core/general/Component";
    import { UUID } from "engine/libs/maths/statistics/random/UUIDGenerator";
    import { Transform } from "engine/core/general/Transform";
    export { EntityDesc };
    export { Entity };
    export { EntityBase };
    interface EntityDesc {
        components?: {
            [name: string]: ComponentDesc;
        };
        children?: {
            [name: string]: EntityDesc;
        };
    }
    interface Entity {
        uuid: UUID;
        desc: EntityDesc;
        name: string;
        active: boolean;
        components: Map<string, Component<any>>;
        transform: Transform;
        setup(desc: EntityDesc): void;
        parent?: Entity;
        children: Entity[];
        getComponent<T extends Component<any>>(name: string): T | undefined;
        addComponent<T extends Component<any>>(name: string, desc: any): void;
    }
    interface EntityConstructor {
        readonly prototype: Entity;
        new (name: string, parent?: Entity): Entity;
    }
    class EntityBase implements Entity {
        readonly uuid: UUID;
        desc: EntityDesc;
        name: string;
        active: boolean;
        parent?: Entity;
        children: Entity[];
        components: Map<string, Component<any>>;
        transform: Transform;
        constructor(name: string, parent?: Entity);
        setup(desc: EntityDesc): void;
        getComponent<T extends Component<any>>(name: string): T | undefined;
        addComponent<T extends Component<any>>(name: string, desc: any): T | undefined;
    }
    const Entity: EntityConstructor;
}
declare module "engine/core/general/Component" {
    import { Entity } from "engine/core/general/Entity";
    export type ComponentDesc = {
        [key: string]: any;
    };
    export interface Component<T extends ComponentDesc> {
        type: string;
        owner: Entity;
        desc: T;
        enabled: boolean;
        setup(): void;
        cleanup(): void;
    }
    export abstract class AbstractComponent<T extends ComponentDesc> implements Component<T> {
        type: string;
        owner: Entity;
        enabled: boolean;
        desc: T;
        constructor(owner: Entity, desc: T);
        abstract setup(): void;
        abstract cleanup(): void;
    }
}
declare module "engine/core/general/System" {
    export class System {
    }
}
declare module "engine/core/audio/AudioSystem" {
    import { System } from "engine/core/general/System";
    export const GAudioContext: AudioContext;
    export class AudioSystem extends System {
    }
}
declare module "engine/core/components/rendering/MeshComponent" {
    import { ComponentDesc } from "engine/core/general/Component";
    export interface TMeshComponentDesc extends ComponentDesc {
        mesh?: string;
    }
    export class MeshComponent {
        setup(): void;
        cleanup(): void;
        render(): void;
    }
}
declare module "engine/core/general/Clock" {
    export class Clock {
        deltaTime: number;
    }
}
declare module "engine/core/general/Scene" {
    import { EntityDesc, Entity } from "engine/core/general/Entity";
    import { UUID } from "engine/libs/maths/statistics/random/UUIDGenerator";
    export { Scene };
    export { SceneBase };
    type SceneDesc = {
        [key: string]: EntityDesc;
    };
    interface Scene {
        readonly uuid: UUID;
        readonly root: Entity;
        build(desc: SceneDesc): void;
    }
    interface SceneConstructor {
        readonly prototype: Scene;
        new (): Scene;
    }
    class SceneBase implements Scene {
        readonly root: Entity;
        readonly uuid: UUID;
        constructor();
        private parseEntityRecursive;
        build(desc: SceneDesc, root?: Entity): void;
    }
    const Scene: SceneConstructor;
}
declare module "engine/core/rendering/pipelines/RenderingPipeline" {
    export class RenderingPipeline {
        addPass(): void;
    }
}
declare module "engine/core/rendering/renderers/MeshRenderer" {
    export class MeshRenderer {
    }
}
declare module "engine/core/rendering/shaders/lib/PhongShader" {
    import { Shader } from "engine/core/rendering/shaders/Shader";
    export { PhongShader };
    class PhongShader extends Shader {
        constructor();
    }
}
declare module "engine/core/rendering/shaders/ShadersLib" {
    import { PhongShader } from "engine/core/rendering/shaders/lib/PhongShader";
    export { ShadersLib };
    const ShadersLib: Readonly<{
        shaders: {
            Phong: typeof PhongShader;
        };
        chunks: Map<string, string>;
    }>;
}
declare module "engine/core/rendering/shaders/Shader" {
    import { Resources } from "engine/resources/Resources";
    export { ShaderType };
    export { Shader };
    enum ShaderType {
        FRAGMENT_SHADER = 0,
        VERTEX_SHADER = 1
    }
    interface ShaderConstructor {
        readonly prototype: Shader;
        new (args: {
            name: string;
            vertex: string;
            fragment: string;
        }): Shader;
    }
    interface Shader {
        readonly name: string;
        readonly vertex: string;
        readonly fragment: string;
        setDefinition(shader: Shader, sourceType: ShaderType, definitionName: string, definitionValue: number): Shader;
        resolveIncludes(shader: Shader, sourceType: ShaderType, resources: Resources): void;
        getUniformBlockIndex(shader: Shader, sourceType: ShaderType, blockName: string): number | null;
        replaceInSource(shader: Shader, sourceType: ShaderType, oldStr: string, newStr: string): void;
        prependToSource(shader: Shader, sourceType: ShaderType, str: string): void;
        getSource(type: ShaderType): string;
    }
    const Shader: ShaderConstructor;
}
declare module "engine/core/rendering/renderers/RenderPacket" {
    import { Shader } from "engine/core/rendering/shaders/Shader";
    import { AttributesList, AttributesSettersList } from "engine/core/rendering/webgl/WebGLAttributeUtilities";
    import { UniformsList, UniformsSettersList } from "engine/core/rendering/webgl/WebGLUniformUtilities";
    export type TRenderPacketSetters = {
        attributes: Array<AttributesSettersList>;
        uniforms: Array<UniformsSettersList>;
    };
    export type TRenderPacketArrays = {
        attributes: Array<AttributesList>;
        uniforms: Array<UniformsList>;
    };
    export abstract class RenderPacket<S extends Shader = any> {
        readonly shader: S;
        readonly attributes: Map<string, AttributesList>;
        readonly uniforms: Map<string, UniformsList>;
        readonly setters: TRenderPacketSetters;
        constructor(shader: S);
        abstract prepare(...args: any): void;
        abstract update(...args: any): void;
    }
}
declare module "engine/core/rendering/renderers/RenderPipeline" {
    export class RenderPipeline {
    }
}
declare module "engine/core/rendering/scenes/objects/lights/Light" {
    import { Color } from "engine/libs/graphics/colors/Color";
    import { Object3D, Object3DBase } from "engine/core/rendering/scenes/objects/Object3D";
    import { Mesh } from "engine/core/rendering/scenes/objects/meshes/Mesh";
    export { LightProperties };
    export { Light };
    export { isLight };
    export { LightBase };
    enum LightProperties {
        color = 0
    }
    interface Light extends Object3D {
        readonly isLight: true;
        color: Color;
        isLightingOn(mesh: Mesh): boolean;
    }
    function isLight(obj: any): obj is Light;
    abstract class LightBase extends Object3DBase {
        readonly isLight: true;
        private _color;
        constructor(color: Color);
        get color(): Color;
        set color(color: Color);
        abstract isLightingOn(mesh: Mesh): boolean;
    }
}
declare module "engine/core/rendering/scenes/objects/meshes/Submesh" {
    import { BoundingBox } from "engine/libs/physics/collisions/BoundingBox";
    import { CompositeMesh } from "engine/core/rendering/scenes/objects/meshes/CompositeMesh";
    import { Material } from "engine/core/rendering/scenes/materials/Material";
    export { Submesh };
    export { BaseSubmesh };
    interface Submesh {
        composite: CompositeMesh;
        indexStart: number;
        indexCount: number;
        material: Material;
        boundingBox?: BoundingBox;
    }
    class BaseSubmesh {
        composite: CompositeMesh;
        indexStart: number;
        indexCount: number;
        material: Material;
        boundingBox?: BoundingBox;
        constructor(composite: CompositeMesh, indexStart: number, indexCount: number, material: Material);
    }
}
declare module "engine/core/rendering/scenes/objects/meshes/CompositeMesh" {
    import { Submesh } from "engine/core/rendering/scenes/objects/meshes/Submesh";
    import { Object3DBase, Object3D } from "engine/core/rendering/scenes/objects/Object3D";
    import { Geometry } from "engine/core/rendering/scenes/geometries/Geometry";
    export { CompositeMesh };
    export { CompositeMeshBase };
    interface CompositeMesh extends Object3D {
        geometry: Geometry;
        submeshes: Submesh[];
    }
    class CompositeMeshBase extends Object3DBase implements CompositeMesh {
        geometry: Geometry;
        submeshes: Submesh[];
        constructor(geometry: Geometry, ...submeshes: Submesh[]);
    }
}
declare module "engine/core/rendering/scenes/Scene" {
    import { Light } from "engine/core/rendering/scenes/objects/lights/Light";
    import { Mesh } from "engine/core/rendering/scenes/objects/meshes/Mesh";
    import { Transform } from "engine/core/general/Transform";
    import { CompositeMesh } from "engine/core/rendering/scenes/objects/meshes/CompositeMesh";
    export { Scene };
    export { BaseScene };
    interface Scene {
    }
    class BaseScene implements Scene {
        root: Transform;
        meshes: Mesh[];
        compositeMeshes: CompositeMesh[];
        lights: Light[];
        layers: number[];
        constructor();
        parseObjectRecursive(transform: Transform): void;
        lightsOn(mesh: Mesh): IterableIterator<Light>;
    }
}
declare module "engine/core/rendering/renderers/Renderer" {
    import { Scene } from "engine/core/rendering/scenes/Scene";
    import { Camera } from "engine/core/rendering/scenes/cameras/Camera";
    import { RenderPacket } from "engine/core/rendering/renderers/RenderPacket";
    import { Shader } from "engine/core/rendering/shaders/Shader";
    import { Texture } from "engine/core/rendering/webgl/WebGLTextureUtilities";
    export class Renderer {
        context: WebGL2RenderingContext;
        programs: Map<Shader, Shader>;
        packets: Array<RenderPacket>;
        textures: Texture[];
        constructor(context: WebGL2RenderingContext);
        compile(scene: Scene): void;
        clear(): void;
        dispose(): void;
        prepare(): void;
        prerender(scene: Scene): void;
        render(scene: Scene, camera: Camera): void;
    }
}
declare module "engine/core/rendering/scenes/cameras/OrthographicCamera" {
    import { CameraBase, Camera } from "engine/core/rendering/scenes/cameras/Camera";
    export class OrthographicCamera extends CameraBase {
        constructor(left?: number, width?: number, height?: number, top?: number, near?: number, far?: number);
        setValues(left?: number, width?: number, height?: number, top?: number, near?: number, far?: number): Camera;
    }
}
declare module "engine/core/rendering/scenes/cameras/controls/OrbitingControls" {
    export class OrbitingControls {
    }
}
declare module "engine/core/rendering/scenes/environment/fog/Fog" {
    export class Fog {
    }
}
declare module "engine/core/rendering/scenes/geometries/GeometryBuilder" {
    import { Geometry } from "engine/core/rendering/scenes/geometries/Geometry";
    export { GeometryBuilder };
    export { GeometryBuilderBase };
    interface GeometryBuilder<G extends PartialGeometry = PartialGeometry> {
        attribute<S extends string, C extends new (array: WritableArrayLike<number>) => any>(name: S, array: WritableArrayLike<number>, container: C): GeometryBuilder<G & {
            [K in S]: InstanceType<C>;
        }>;
        build(): G;
    }
    interface PartialGeometry extends Partial<Geometry> {
    }
    class GeometryBuilderBase<G extends PartialGeometry> implements GeometryBuilder<G> {
        private geometry;
        constructor(geometry: G);
        attribute<S extends string, C extends new (array: WritableArrayLike<number>) => any>(name: S, array: WritableArrayLike<number>, container: C): GeometryBuilder<G & {
            [K in S]: InstanceType<C>;
        }>;
        build(): G;
    }
}
declare module "engine/core/rendering/scenes/geometries/MorphTargetGeometry" {
    import { GeometryBase } from "engine/core/rendering/scenes/geometries/Geometry";
    export { MorphTargetGeometry };
    class MorphTargetGeometry extends GeometryBase {
    }
}
declare module "engine/core/rendering/scenes/geometries/PhongGeometry" {
    import { Vector3List } from "engine/libs/maths/extensions/lists/Vector3List";
    import { Geometry } from "engine/core/rendering/scenes/geometries/Geometry";
    export { PhongGeometry };
    interface PhongGeometry extends Geometry {
        readonly facesNormals: Vector3List;
        readonly verticesNormals: Vector3List;
        readonly tangents: Vector3List;
        readonly bitangents: Vector3List;
    }
}
declare module "engine/core/rendering/scenes/geometries/lib/SphereGeometry" {
    import { GeometryBase } from "engine/core/rendering/scenes/geometries/Geometry";
    export { SphereGeometry };
    class SphereGeometry extends GeometryBase {
        constructor();
    }
}
/**
 *
 *           v0_ _ _v1    v1_ _ _v2                      _-v24-_
 *          /        \    /        \                    -         -
 *        v2          \  /          v5               v23          v25
 *         -_        _ v3 _        _-         _v12_   \            /   _-v25-_
 *           -_    _-      - _   _-        _-       -_ \          / _-         -_
 *    v6_ _ _ _ v4             v6_ _ _ _v10           v22_ _ _ _v23              v26
 *    /          \             /         \            /           \              /
 *   /            \           /           \          /             \            /
 *  v12            \         /            v11_ _ _ _v15            v21_ _ _ _ v27
 *   \         _ -v8_ _ _ _v9- _        /        _-  - _         _-   -_
 *     v14 _ -    /         \     - _v12        _-        -_   _-        -_
 *               /           \               v20            v16            v32
 *             v16            v13              \             / \            |
 *               -_         _-                  \           /   \           |
 *                  -_    _-                     v40_ _ _ _v33   v30_ _ _ _v31
 *                     v14
 *
 */ 
declare module "engine/core/rendering/scenes/geometries/lib/polyhedron/TetrahedronGeometry" {
    import { GeometryBase } from "engine/core/rendering/scenes/geometries/Geometry";
    export { TetrahedronGeometry };
    class TetrahedronGeometry extends GeometryBase {
        constructor();
    }
}
declare module "engine/core/rendering/shaders/textures/Texture" {
    import { Vector2 } from "engine/libs/maths/algebra/vectors/Vector2";
    import { UUID } from "engine/libs/maths/statistics/random/UUIDGenerator";
    import { SingleTopicMessageBroker, SingleTopicMessageSubscriber } from "engine/libs/patterns/messaging/brokers/SingleTopicMessageBroker";
    import { TextureTarget, PixelFormat, PixelType, TextureWrapMode, TextureMinFilter, TextureMagFilter } from "engine/core/rendering/webgl/WebGLConstants";
    import { TexturePixels } from "engine/core/rendering/webgl/WebGLTextureUtilities";
    export { TextureProperties };
    export { ReadonlyTexture };
    export { Texture };
    export { BaseTexture };
    enum TexturePropertyKeys {
        target = 0,
        lod = 1,
        width = 2,
        height = 3,
        pixels = 4,
        format = 5,
        type = 6,
        min = 7,
        mag = 8,
        wrapS = 9,
        wrapT = 10,
        wrapR = 11,
        tiling = 12,
        offset = 13,
        baseLod = 14,
        maxLod = 15,
        unpackAlignment = 16,
        anisotropy = 17,
        flipY = 18
    }
    type TextureProperties = {
        readonly uuid: UUID;
        target: TextureTarget;
        lod: number;
        width: number;
        height: number;
        pixels: TexturePixels | List<TexturePixels>;
        format: PixelFormat;
        type: PixelType;
        min?: TextureMinFilter;
        mag?: TextureMagFilter;
        wrapS?: TextureWrapMode;
        wrapT?: TextureWrapMode;
        wrapR?: TextureWrapMode;
        tiling?: Vector2;
        offset?: Vector2;
        baseLod?: number;
        maxLod?: number;
        unpackAlignment?: number;
        anisotropy?: number;
        flipY?: boolean;
    };
    type TReadonlyTexture = Readonly<Texture>;
    interface Texture extends TextureProperties {
    }
    interface ReadonlyTexture extends TReadonlyTexture {
    }
    class BaseTexture implements Texture {
        readonly uuid: UUID;
        target: TextureTarget;
        lod: number;
        width: number;
        height: number;
        pixels: TexturePixels | List<TexturePixels>;
        format: PixelFormat;
        type: PixelType;
        min?: TextureMinFilter;
        mag?: TextureMagFilter;
        wrapS?: TextureWrapMode;
        wrapT?: TextureWrapMode;
        wrapR?: TextureWrapMode;
        tiling?: Vector2;
        offset?: Vector2;
        baseLod?: number;
        maxLod?: number;
        unpackAlignment?: number;
        anisotropy?: number;
        flipY?: boolean;
        constructor(props: TextureProperties);
    }
    export class TextureWrapper implements Texture {
        internal: Texture;
        get uuid(): UUID;
        constructor(internal: Texture);
        get target(): TextureTarget;
        set target(target: TextureTarget);
        get lod(): number;
        set lod(lod: number);
        get width(): number;
        set width(width: number);
        get height(): number;
        set height(height: number);
        get pixels(): TexturePixels | List<TexturePixels>;
        set pixels(pixels: TexturePixels | List<TexturePixels>);
        get format(): PixelFormat;
        set format(format: PixelFormat);
        get type(): PixelType;
        set type(type: PixelType);
        get min(): TextureMinFilter | undefined;
        set min(min: TextureMinFilter | undefined);
        get mag(): TextureMagFilter | undefined;
        set mag(mag: TextureMagFilter | undefined);
        get wrapS(): TextureWrapMode | undefined;
        set wrapS(wrapS: TextureWrapMode | undefined);
        get wrapT(): TextureWrapMode | undefined;
        set wrapT(wrapT: TextureWrapMode | undefined);
        get wrapR(): TextureWrapMode | undefined;
        set wrapR(wrapR: TextureWrapMode | undefined);
        get tiling(): Vector2 | undefined;
        set tiling(tiling: Vector2 | undefined);
        get offset(): Vector2 | undefined;
        set offset(offset: Vector2 | undefined);
        get baseLod(): number | undefined;
        set baseLod(baseLod: number | undefined);
        get maxLod(): number | undefined;
        set maxLod(maxLod: number | undefined);
        get unpackAlignment(): number | undefined;
        set unpackAlignment(unpackAlignment: number | undefined);
        get anisotropy(): number | undefined;
        set anisotropy(anisotropy: number | undefined);
        get flipY(): boolean | undefined;
        set flipY(flipY: boolean | undefined);
    }
    export interface IObservableTexture extends Texture {
        internal: Texture;
        readonly changes: SingleTopicMessageSubscriber<TextureProperties>;
    }
    export class ObservableTexture extends TextureWrapper implements Texture {
        readonly changes: SingleTopicMessageBroker<TexturePropertyKeys>;
        constructor(internal: Texture, broker: SingleTopicMessageBroker);
        set target(target: TextureTarget);
        set lod(lod: number);
        set width(width: number);
        set height(height: number);
        set pixels(pixels: TexturePixels | List<TexturePixels>);
        set format(format: PixelFormat);
        set type(type: PixelType);
        set min(min: TextureMinFilter | undefined);
        set mag(mag: TextureMagFilter | undefined);
        set wrapS(wrapS: TextureWrapMode | undefined);
        set wrapT(wrapT: TextureWrapMode | undefined);
        set wrapR(wrapR: TextureWrapMode | undefined);
        set tiling(tiling: Vector2 | undefined);
        set offset(offset: Vector2 | undefined);
        set baseLod(baseLod: number | undefined);
        set maxLod(maxLod: number | undefined);
        set unpackAlignment(unpackAlignment: number | undefined);
        set anisotropy(anisotropy: number | undefined);
        set flipY(flipY: boolean | undefined);
    }
}
declare module "engine/core/rendering/scenes/materials/lib/PhongMaterial" {
    import { Texture } from "engine/core/rendering/shaders/textures/Texture";
    import { TextureProperties } from "engine/core/rendering/webgl/WebGLTextureUtilities";
    import { Color, ColorValues } from "engine/libs/graphics/colors/Color";
    import { Material, MaterialBase } from "engine/core/rendering/scenes/materials/Material";
    import { SingleTopicMessageSubscriber } from "engine/libs/patterns/messaging/brokers/SingleTopicMessageBroker";
    export { PhongMaterialPropertyKeys };
    export { PhongMaterialProperties };
    export { PhongMaterial };
    export { PhongMaterialBase };
    enum PhongMaterialPropertyKeys {
        albedo = 0,
        albedoMap = 1,
        alpha = 2,
        alphaMap = 3,
        displacementMap = 4,
        emissionMap = 5,
        normalMap = 6,
        occlusionMap = 7,
        reflexionMap = 8,
        shininess = 9,
        lightMap = 10,
        specular = 11,
        specularMap = 12,
        specularFactor = 13
    }
    type PhongMaterialProperties = {
        albedo?: Color;
        albedoMap?: Texture;
        alpha?: number;
        alphaMap?: Texture;
        displacementMap?: Texture;
        emissionMap?: Texture;
        lightMap?: Texture;
        normalMap?: Texture;
        occlusionMap?: Texture;
        reflexionMap?: Texture;
        shininess?: number;
        specular?: Color;
        specularMap?: Texture;
        specularFactor?: number;
    };
    interface PhongMaterial extends Material<PhongMaterialProperties>, PhongMaterialProperties {
        readonly changes: SingleTopicMessageSubscriber<PhongMaterialPropertyKeys>;
    }
    class PhongMaterialBase extends MaterialBase<PhongMaterialProperties> implements PhongMaterial {
        private _changes;
        private static readonly _name;
        private _albedo?;
        private _albedoMap?;
        private _alpha?;
        private _alphaMap?;
        private _displacementMap?;
        private _emissionMap?;
        private _lightMap?;
        private _normalMap?;
        private _occlusionMap?;
        private _reflexionMap?;
        private _shininess?;
        private _specular?;
        private _specularMap?;
        private _specularFactor?;
        constructor(props: PhongMaterialProperties);
        get changes(): SingleTopicMessageSubscriber<PhongMaterialPropertyKeys>;
        get albedo(): Color | undefined;
        updateAlbedo(albedo: ColorValues | undefined): void;
        get albedoMap(): Texture | undefined;
        updateAlbedoMap(albedoMap: TextureProperties | undefined): void;
        get alpha(): number | undefined;
        set alpha(alpha: number | undefined);
        get alphaMap(): Texture | undefined;
        set alphaMap(alphaMap: Texture | undefined);
        get displacementMap(): Texture | undefined;
        set displacementMap(displacementMap: Texture | undefined);
        get emissionMap(): Texture | undefined;
        set emissionMap(emissionMap: Texture | undefined);
        get lightMap(): Texture | undefined;
        set lightMap(lightMap: Texture | undefined);
        get normalMap(): Texture | undefined;
        set normalMap(normalMap: Texture | undefined);
        get occlusionMap(): Texture | undefined;
        set occlusionMap(occlusionMap: Texture | undefined);
        get reflexionMap(): Texture | undefined;
        set reflexionMap(reflexionMap: Texture | undefined);
        get shininess(): number | undefined;
        set shininess(shininess: number | undefined);
        get specular(): Color | undefined;
        set specular(specular: Color | undefined);
        get specularMap(): Texture | undefined;
        set specularMap(specularMap: Texture | undefined);
        get specularFactor(): number | undefined;
        set specularFactor(specularFactor: number | undefined);
        copy(material: PhongMaterialBase): PhongMaterialBase;
        clone(): PhongMaterialBase;
    }
}
declare module "engine/core/rendering/scenes/objects/groups/Group" {
    import { Object3D, Object3DBase } from "engine/core/rendering/scenes/objects/Object3D";
    export { Group };
    export { GroupBase };
    interface Group {
        readonly objects: Object3D[];
        add(object: Object3D): Group;
    }
    class GroupBase extends Object3DBase implements Group {
        readonly objects: Object3D[];
        constructor();
        add(object: Object3D): Group;
    }
}
declare module "engine/core/rendering/scenes/objects/lights/AmbientLight" {
    import { LightBase } from "engine/core/rendering/scenes/objects/lights/Light";
    import { Mesh } from "engine/core/rendering/scenes/objects/meshes/Mesh";
    export { AmbientLight };
    class AmbientLight extends LightBase {
        isLightingOn(mesh: Mesh): boolean;
    }
}
declare module "engine/core/rendering/scenes/objects/lights/DirectionalLight" {
    import { LightBase } from "engine/core/rendering/scenes/objects/lights/Light";
    import { Mesh } from "engine/core/rendering/scenes/objects/meshes/Mesh";
    export { DirectionalLight };
    class DirectionalLight extends LightBase {
        isLightingOn(mesh: Mesh): boolean;
    }
}
declare module "engine/core/rendering/scenes/objects/lights/HemisphereLight" {
    import { LightBase } from "engine/core/rendering/scenes/objects/lights/Light";
    import { Mesh } from "engine/core/rendering/scenes/objects/meshes/Mesh";
    export { HemisphereLight };
    class HemisphereLight extends LightBase {
        isLightingOn(mesh: Mesh): boolean;
    }
}
declare module "engine/core/rendering/scenes/objects/lights/PointLight" {
    import { LightBase } from "engine/core/rendering/scenes/objects/lights/Light";
    import { Mesh } from "engine/core/rendering/scenes/objects/meshes/Mesh";
    export { PointLight };
    class PointLight extends LightBase {
        isLightingOn(mesh: Mesh): boolean;
    }
}
declare module "engine/core/rendering/scenes/objects/lights/SpotLight" {
    import { LightBase } from "engine/core/rendering/scenes/objects/lights/Light";
    import { Mesh } from "engine/core/rendering/scenes/objects/meshes/Mesh";
    export { SpotLight };
    class SpotLight extends LightBase {
        isLightingOn(mesh: Mesh): boolean;
    }
}
declare module "engine/core/rendering/scenes/objects/meshes/PhongMesh" {
    import { PhongGeometry } from "engine/core/rendering/scenes/geometries/PhongGeometry";
    import { PhongMaterial } from "engine/core/rendering/scenes/materials/lib/PhongMaterial";
    import { MeshBase, Mesh } from "engine/core/rendering/scenes/objects/meshes/Mesh";
    export { PhongMesh };
    export { PhongMeshBase };
    interface PhongMesh extends Mesh {
        readonly geometry: PhongGeometry;
        readonly material: PhongMaterial;
    }
    class PhongMeshBase extends MeshBase implements PhongMesh {
        readonly geometry: PhongGeometry;
        readonly material: PhongMaterial;
        constructor(geometry: PhongGeometry, material: PhongMaterial);
    }
}
declare module "engine/core/rendering/scenes/rigs/Joint" {
    import { Object3DBase, Object3D } from "engine/core/rendering/scenes/objects/Object3D";
    export { Joint };
    export { JointBase };
    interface Joint extends Object3D {
    }
    class JointBase extends Object3DBase implements Joint {
        constructor();
    }
}
declare module "engine/core/rendering/scenes/objects/meshes/SkinnedMesh" {
    import { MeshBase, Mesh } from "engine/core/rendering/scenes/objects/meshes/Mesh";
    import { Joint } from "engine/core/rendering/scenes/rigs/Joint";
    import { Geometry } from "engine/core/rendering/scenes/geometries/Geometry";
    import { Material } from "engine/core/rendering/scenes/materials/Material";
    export { SkinnedMesh };
    export { SkinnedMeshBase };
    interface SkinnedMesh extends Mesh {
        bonesWeights: Uint8Array;
        bonesIndices: Uint16Array;
        hipsJoint: Joint;
    }
    class SkinnedMeshBase extends MeshBase implements SkinnedMesh {
        bonesWeights: Uint8Array;
        bonesIndices: Uint16Array;
        hipsJoint: Joint;
        constructor(geometry: Geometry, material: Material);
    }
}
declare module "engine/core/rendering/scenes/rigs/Pose" {
    export { IPose };
    export { Pose };
    interface IPose {
    }
    class Pose implements IPose {
    }
}
declare module "engine/core/rendering/scenes/rigs/Rig" {
    export { IRig };
    export { Rig };
    interface IRig {
    }
    class Rig implements IRig {
    }
}
declare module "engine/core/rendering/shaders/packets/Packet" {
    import { Packet, PacketBindingsProperties, PacketBindings } from "engine/core/rendering/webgl/WebGLPacketUtilities";
    export abstract class AbstractPacket {
        abstract getPacketBindingsProperties(...args: any): PacketBindingsProperties;
        abstract enableDelta(): void;
        abstract disableDelta(): void;
        abstract getPacketValues(bindings: PacketBindings, ...args: any): Packet;
        abstract getDeltaPacketValues(bindings: PacketBindings, ...args: any): Packet;
    }
}
declare module "engine/libs/patterns/flags/Flags" {
    export { Flags };
    export { FlagsBase };
    interface Flags {
        bits: number;
        getThenUnset(flag: number): boolean;
        get(flag: number): boolean;
        set(flag: number): void;
        unset(flag: number): void;
        setAll(): void;
        unsetAll(): void;
    }
    interface FlagsConstructor {
        new (): Flags;
    }
    class FlagsBase {
        protected _bits: number;
        get bits(): number;
        getThenUnset(flag: number): boolean;
        get(flag: number): boolean;
        set(flag: number): void;
        unset(flag: number): void;
        setAll(): void;
        unsetAll(): void;
    }
    const Flags: FlagsConstructor;
}
declare module "engine/core/rendering/shaders/ubos/UBO" {
    import { Identifiable, UUID } from "engine/libs/maths/statistics/random/UUIDGenerator";
    import { Flags } from "engine/libs/patterns/flags/Flags";
    import { UniformsList } from "engine/core/rendering/webgl/WebGLUniformUtilities";
    export { UBO };
    export { UBOBase };
    interface UBO<L extends UniformsList = UniformsList> {
        readonly uuid: UUID;
        readonly name: string;
        subscribeReferences(): void;
        unsubscribeReferences(): void;
        getUniformValues(): L;
        getDeltaUniformValues(): Partial<L> | null;
    }
    type UBOCtor<U extends UBOBase, R extends List<Identifiable> = List<Identifiable>> = new (references: R) => U;
    abstract class UBOBase<R extends List<Identifiable> = List<Identifiable>, L extends UniformsList = UniformsList> implements UBO<L> {
        readonly name: string;
        readonly uuid: UUID;
        protected _references: R;
        protected _subscriptions?: Array<(message: any) => void>;
        protected _deltaFlags?: Flags;
        constructor(name: string, references: R);
        private static _dictionary;
        abstract subscribeReferences(): void;
        abstract unsubscribeReferences(): void;
        abstract getUniformValues(): L;
        abstract getDeltaUniformValues(): Partial<L> | null;
        protected static getReferencesHash<R extends List<Identifiable>>(references: R): string;
        protected static getConcreteInstance<U extends UBOBase, R extends List<Identifiable>>(ctor: UBOCtor<U, R>, references: R): U;
    }
}
declare module "engine/core/rendering/shaders/ubos/lib/PhongUBO" {
    import { PhongMaterial } from "engine/core/rendering/scenes/materials/lib/PhongMaterial";
    import { Uniform } from "engine/core/rendering/webgl/WebGLUniformUtilities";
    import { UBOBase } from "engine/core/rendering/shaders/ubos/UBO";
    export { PhongUBOReferences };
    export { PhongUBOValues };
    export { PhongUBOIndices };
    export { PhongUBO };
    type PhongUBOReferences = {
        material: PhongMaterial;
    };
    type PhongUBOValues = {
        u_shininess: Uniform;
        u_specular: Uniform;
        u_specularFactor: Uniform;
    };
    enum PhongUBOIndices {
        shininess = 0,
        specular = 1,
        specularFactor = 2
    }
    class PhongUBO extends UBOBase<PhongUBOReferences, PhongUBOValues> {
        constructor(references: PhongUBOReferences);
        static getInstance(references: PhongUBOReferences): PhongUBO;
        subscribeReferences(): void;
        unsubscribeReferences(): void;
        getUniformValues(): PhongUBOValues;
        getDeltaUniformValues(): Partial<PhongUBOValues> | null;
    }
}
declare module "engine/libs/structures/arrays/ArraySection" {
    export { ArraySectionValues };
    export { ArraySections };
    export { ArraySectionsBase };
    type ArraySectionValues = [number, number];
    interface ArraySections {
        get(index: number): ArraySectionValues;
        getThenSetEmpty(index: number): ArraySectionValues;
        isEmpty(index: number): boolean;
        setEmpty(index: number): void;
        extend(index: number, extension: ArraySectionValues): void;
    }
    interface ArraySectionsConstructor {
        readonly prototype: ArraySections;
        new (count: number, maxLength: number): ArraySections;
    }
    class ArraySectionsBase implements ArraySections {
        private _sections;
        private _maxLength;
        constructor(count: number, maxLength: number);
        get(index: number): ArraySectionValues;
        getThenSetEmpty(index: number): ArraySectionValues;
        isEmpty(index: number): boolean;
        setEmpty(index: number): void;
        extend(index: number, section: ArraySectionValues): void;
    }
    const ArraySections: ArraySectionsConstructor;
}
declare module "engine/core/rendering/shaders/vaos/VAO" {
    import { AttributesList } from "engine/core/rendering/webgl/WebGLAttributeUtilities";
    import { Identifiable, UUID } from "engine/libs/maths/statistics/random/UUIDGenerator";
    import { ArraySections } from "engine/libs/structures/arrays/ArraySection";
    export { VAO };
    export { VAOBase };
    type VAOCtor<U extends VAOBase, R extends List<Identifiable> = List<Identifiable>> = new (references: R) => U;
    interface VAO<L extends AttributesList = AttributesList> {
        readonly name: string;
        readonly uuid: UUID;
        enableDeltaSubscriptions(): void;
        disableDeltaSubscriptions(): void;
        getAttributeValues(): L;
        getDeltaAttributeValues(): RecursivePartial<L> | null;
    }
    abstract class VAOBase<R extends List<Identifiable> = List<Identifiable>, L extends AttributesList = AttributesList> implements VAO<L> {
        readonly uuid: UUID;
        readonly name: string;
        protected _references: R;
        protected _values: L;
        protected _deltaSubscriptions?: Array<(message: any) => void>;
        protected _deltaSections?: ArraySections;
        protected constructor(name: string, references: R);
        abstract getAttributeValues(): L;
        abstract getDeltaAttributeValues(): RecursivePartial<L> | null;
        abstract enableDeltaSubscriptions(): void;
        abstract disableDeltaSubscriptions(): void;
        private static _dictionary;
        protected static getReferencesHash<R extends List<Identifiable>>(references: R): string;
        static getConcreteInstance<V extends VAOBase, R extends List<Identifiable>>(ctor: VAOCtor<V, R>, references: R): V;
    }
}
declare module "engine/core/rendering/shaders/vaos/lib/PhongVAO" {
    import { PhongGeometry } from "engine/core/rendering/scenes/geometries/PhongGeometry";
    import { VAOBase } from "engine/core/rendering/shaders/vaos/VAO";
    import { Attribute, AttributeProperties } from "engine/core/rendering/webgl/WebGLAttributeUtilities";
    export { PhongVAOReferences };
    export { PhongVAOAttributesList };
    export { PhongVAOValues };
    export { PhongVAO };
    type PhongVAOReferences = {
        geometry: PhongGeometry;
    };
    type PhongVAOValues = {
        list: PhongVAOAttributesList;
        indices: Uint8Array | Uint16Array | Uint32Array;
    };
    type PhongVAOAttributesList = {
        a_position: Attribute;
        a_normal: Attribute;
        a_tangent: Attribute;
        a_bitangent: Attribute;
        a_uv: Attribute;
    };
    type BufferAttributesInfo = [keyof PhongVAOAttributesList, ArrayLike<number>, AttributeProperties];
    class PhongVAO extends VAOBase<PhongVAOReferences, PhongVAOValues> implements PhongVAO {
        readonly buffersAttributes: BufferAttributesInfo[];
        constructor(references: PhongVAOReferences);
        static getInstance(references: PhongVAOReferences): PhongVAO;
        getAttributeValues(): PhongVAOValues;
        enableDeltaSubscriptions(): void;
        disableDeltaSubscriptions(): void;
        getDeltaAttributeValues(): RecursivePartial<PhongVAOValues> | null;
    }
}
declare module "engine/core/rendering/shaders/textures/TextureReference" {
    import { TextureProperties } from "engine/core/rendering/webgl/WebGLTextureUtilities";
    import { Texture } from "engine/core/rendering/shaders/textures/Texture";
    export interface ITextureReference {
        readonly texture: Texture;
        getProperties(): TextureProperties;
        getDeltaProperties(): Partial<TextureProperties> | null;
        subscribeDelta(): void;
        unsubscribeDelta(): void;
    }
    export class TextureReference {
        readonly texture: Texture;
        private constructor();
        private static _instances;
        static getInstance(texture: Texture): TextureReference;
    }
}
declare module "engine/libs/maths/extensions/pools/Matrix4Pools" {
    import { Matrix4 } from "engine/libs/maths/algebra/matrices/Matrix4";
    import { StackPool } from "engine/libs/patterns/pools/StackPool";
    export { Matrix4Pool };
    const Matrix4Pool: StackPool<Matrix4>;
}
declare module "engine/core/rendering/shaders/ubos/lib/WorldViewUBO" {
    import { Transform } from "engine/core/general/Transform";
    import { Camera } from "engine/core/rendering/scenes/cameras/Camera";
    import { UniformsList } from "engine/core/rendering/webgl/WebGLUniformUtilities";
    import { UBOBase } from "engine/core/rendering/shaders/ubos/UBO";
    export { WorldViewUBO };
    type WorldViewUBOReferences = {
        meshTransform: Transform;
        camera: Camera;
    };
    class WorldViewUBO extends UBOBase<WorldViewUBOReferences> implements WorldViewUBO {
        constructor(references: WorldViewUBOReferences);
        static getInstance(references: WorldViewUBOReferences): WorldViewUBO;
        subscribeReferences(): void;
        unsubscribeReferences(): void;
        getUniformValues(): UniformsList;
        getDeltaUniformValues(): Partial<UniformsList> | null;
    }
}
declare module "engine/core/rendering/shaders/ubos/lib/LightsUBO" {
    import { Scene } from "engine/core/general/Scene";
    import { UniformsList } from "engine/core/rendering/webgl/WebGLUniformUtilities";
    import { UBOBase } from "engine/core/rendering/shaders/ubos/UBO";
    export { LightsUBO };
    type LightsUBOReferences = {
        scene: Scene;
    };
    class LightsUBO extends UBOBase<LightsUBOReferences> implements LightsUBO {
        constructor(references: LightsUBOReferences);
        static getInstance(references: LightsUBOReferences): LightsUBO;
        subscribeReferences(): void;
        unsubscribeReferences(): void;
        getUniformValues(): UniformsList;
        getDeltaUniformValues(): UniformsList | null;
    }
}
declare module "engine/core/rendering/shaders/packets/lib/MeshPhongPacket" {
    import { Scene } from "engine/core/general/Scene";
    import { Camera } from "engine/core/rendering/scenes/cameras/Camera";
    import { Packet, PacketBindings, PacketBindingsProperties } from "engine/core/rendering/webgl/WebGLPacketUtilities";
    import { AbstractPacket } from "engine/core/rendering/shaders/packets/Packet";
    import { PhongUBO } from "engine/core/rendering/shaders/ubos/lib/PhongUBO";
    import { PhongVAO } from "engine/core/rendering/shaders/vaos/lib/PhongVAO";
    import { TextureReference } from "engine/core/rendering/shaders/textures/TextureReference";
    import { WorldViewUBO } from "engine/core/rendering/shaders/ubos/lib/WorldViewUBO";
    import { LightsUBO } from "engine/core/rendering/shaders/ubos/lib/LightsUBO";
    import { PhongMesh } from "engine/core/rendering/scenes/objects/meshes/PhongMesh";
    export type MeshPhongPacketReferences = {
        mesh: PhongMesh;
        camera: Camera;
        scene: Scene;
    };
    type TMeshPhongPacketTextures = {
        albedoMap?: TextureReference;
        normalMap?: TextureReference;
    };
    export class MeshPhongPacket extends AbstractPacket {
        references: MeshPhongPacketReferences;
        textures: TMeshPhongPacketTextures;
        phongVAO: PhongVAO;
        phongUBO: PhongUBO;
        worldViewUBO: WorldViewUBO;
        lightsUBO: LightsUBO;
        constructor(references: MeshPhongPacketReferences);
        getPacketBindingsProperties(): PacketBindingsProperties;
        getPacketValues(bindings: PacketBindings): Packet;
        enableDelta(): void;
        disableDelta(): void;
        getDeltaPacketValues(bindings: PacketBindings): Packet;
    }
}
declare module "engine/core/systems/RenderingSystem" {
    import { System } from "engine/core/general/System";
    export class RenderingSystem extends System {
    }
}
declare module "engine/editor/elements/forms/Snippets" {
    export { FormState };
    export { getFormState };
    export { setFormState };
    interface FormState {
        [name: string]: ({
            type: "checkbox";
            checked: boolean;
        } | {
            type: "radio";
            nodes: [{
                value: string;
                checked: boolean;
            }];
        } | {
            value: string;
        });
    }
    const getFormState: (form: HTMLFormElement) => FormState;
    const setFormState: (form: HTMLFormElement, state: FormState) => void;
}
declare module "engine/editor/elements/lib/builtins/inputs/NumberInput" {
    export { NumberInputElement };
    class NumberInputElement extends HTMLInputElement {
        cache: string;
        constructor();
        isValueValid(value: string): boolean;
        parseValue(value: string): string;
        connectedCallback(): void;
    }
}
declare module "engine/editor/elements/lib/containers/toolbar/Toolbar" {
    export { HTMLEMenuBarElement };
    export { isHTMLEMenuBarElement };
    function isHTMLEMenuBarElement(elem: Element): elem is HTMLEMenuBarElement;
    class HTMLEMenuBarElement extends HTMLElement {
    }
}
declare module "engine/editor/elements/lib/containers/toolbar/ToolbarItem" {
    export { HTMLEMenuItemElement };
    export { isHTMLEMenuItemElement };
    function isHTMLEMenuItemElement(elem: Element): elem is HTMLEMenuItemElement;
    class HTMLEMenuItemElement extends HTMLElement {
    }
}
declare module "engine/editor/elements/lib/containers/toolbar/ToolbarItemGroup" {
    export { isHTMLEMenuItemGroupElement };
    export { HTMLEMenuItemGroupElement };
    function isHTMLEMenuItemGroupElement(elem: Element): elem is HTMLEMenuItemGroupElement;
    class HTMLEMenuItemGroupElement extends HTMLElement {
    }
}
declare module "engine/editor/elements/lib/containers/windows/Window" {
    export { WindowElement };
    class WindowElement extends HTMLElement {
        title: string;
        tooltip: string;
        toggled: boolean;
        constructor();
        connectedCallback(): void;
    }
}
declare module "engine/editor/elements/lib/math/Vector3Input" {
    import { Vector3 } from "engine/libs/maths/algebra/vectors/Vector3";
    export { Vector3InputElement };
    class Vector3InputElement extends HTMLElement {
        readonly vector: Vector3;
        label: string;
        tooltip: string;
        constructor();
        refresh(): void;
        connectedCallback(): void;
    }
}
declare module "engine/editor/templates/table/TableTemplate" {
    export { HTMLTableTemplateDescription };
    export { HTMLTableTemplate };
    type HTMLTableTemplateDescription = Partial<Pick<HTMLTableElement, "id" | "className">> & {
        headerCells: (string | Node)[];
        bodyCells: ((string | Node) | {
            type: "header" | "data" | undefined;
            content: Node | string;
        })[][];
        footerCells: (string | Node | {
            type: "header" | "data" | undefined;
            content: Node | string;
        })[];
    };
    interface HTMLTableTemplate {
        (desc: HTMLTableTemplateDescription): HTMLTableElement;
    }
    const HTMLTableTemplate: HTMLTableTemplate;
}
declare module "engine/extras/profiler/Profiler" {
    export { IProfiler };
    export { Profiler };
    interface IProfiler {
    }
    class Profiler {
    }
}
declare module "engine/libs/maths/algebra/matrices/Matrix2" {
    import { Vector2, Vector2Values } from "engine/libs/maths/algebra/vectors/Vector2";
    import { Injector } from "engine/libs/patterns/injectors/Injector";
    import { StackPool } from "engine/libs/patterns/pools/StackPool";
    export { Matrix2Values };
    export { Matrix2 };
    export { Matrix2Base };
    export { Matrix2Injector };
    export { Matrix2Pool };
    type Matrix2Values = [number, number, number, number];
    interface Matrix2Constructor {
        readonly prototype: Matrix2;
        new (): Matrix2;
        new (values: Matrix2Values): Matrix2;
        new (values?: Matrix2Values): Matrix2;
    }
    interface Matrix2 {
        readonly array: ArrayLike<number>;
        values: Matrix2Values;
        row1: Vector2Values;
        row2: Vector2Values;
        col1: Vector2Values;
        col2: Vector2Values;
        m11: number;
        m12: number;
        m21: number;
        m22: number;
        setArray(array: WritableArrayLike<number>): this;
        setValues(m: Matrix2Values): void;
        getAt(idx: number): number;
        setAt(idx: number, val: number): this;
        getEntry(row: number, col: number): number;
        setEntry(row: number, col: number, val: number): this;
        getRow(idx: number): Vector2Values;
        setRow(idx: number, row: Vector2Values): this;
        getCol(idx: number): Vector2Values;
        setCol(idx: number, col: Vector2Values): this;
        equals(mat: Matrix2): boolean;
        copy(mat: Matrix2): this;
        clone(): this;
        det(): number;
        trace(): number;
        setIdentity(): this;
        setZeros(): this;
        negate(): this;
        transpose(): this;
        invert(): this;
        add(mat: Matrix2): this;
        sub(mat: Matrix2): this;
        mult(mat: Matrix2): this;
        multScalar(k: number): this;
        solve(vecB: Vector2): Vector2Values;
        writeIntoArray(out: WritableArrayLike<number>, offset?: number): void;
        readFromArray(arr: ArrayLike<number>, offset?: number): this;
    }
    class Matrix2Base {
        protected _array: WritableArrayLike<number>;
        constructor();
        constructor(values: Matrix2Values);
        get array(): ArrayLike<number>;
        get values(): Matrix2Values;
        set values(values: Matrix2Values);
        get row1(): Vector2Values;
        set row1(row1: Vector2Values);
        get row2(): Vector2Values;
        set row2(row2: Vector2Values);
        get col1(): Vector2Values;
        set col1(col1: Vector2Values);
        get col2(): Vector2Values;
        set col2(col2: Vector2Values);
        get m11(): number;
        set m11(m11: number);
        get m12(): number;
        set m12(m12: number);
        get m21(): number;
        set m21(m21: number);
        get m22(): number;
        set m22(m22: number);
        setArray(array: WritableArrayLike<number>): this;
        setValues(m: Matrix2Values): this;
        getRow(idx: number): Vector2Values;
        setRow(idx: number, row: Vector2Values): this;
        setCol(idx: number, col: Vector2Values): this;
        getCol(idx: number): Vector2Values;
        getAt(idx: number): number;
        setAt(idx: number, val: number): this;
        getEntry(row: number, col: number): number;
        setEntry(row: number, col: number, val: number): this;
        equals(mat: Matrix2): boolean;
        getValues(): Matrix2Values;
        copy(mat: Matrix2): this;
        clone(): this;
        det(): number;
        trace(): number;
        setIdentity(): this;
        setZeros(): this;
        negate(): this;
        transpose(): this;
        invert(): this;
        add(mat: Matrix2): this;
        sub(mat: Matrix2): this;
        mult(mat: Matrix2): this;
        multScalar(k: number): this;
        writeIntoArray(out: WritableArrayLike<number>, offset?: number): void;
        readFromArray(arr: ArrayLike<number>, offset?: number): this;
        solve(vecB: Vector2): Vector2Values;
    }
    var Matrix2: Matrix2Constructor;
    const Matrix2Pool: StackPool<Matrix2>;
    const Matrix2Injector: Injector<Matrix2Constructor>;
}
declare module "engine/libs/maths/calculus/interpolation/Interpolant" {
    export abstract class Interpolant {
        abstract evaluate(): number;
    }
}
declare module "engine/libs/maths/extensions/observables/ObservableVector4" {
    import { Vector4, Vector4Values } from "engine/libs/maths/algebra/vectors/Vector4";
    import { SingleTopicMessageBroker } from "engine/libs/patterns/messaging/brokers/SingleTopicMessageBroker";
    export { ObservableVector4 };
    export { ObservableVector4Base };
    interface Vector4Changes extends SingleTopicMessageBroker<void> {
        enabled: boolean;
    }
    interface ObservableVector4 extends Vector4 {
        readonly changes: Vector4Changes;
        internal: Vector4;
    }
    interface ObservableVector4Constructor {
        readonly prototype: ObservableVector4;
        new (internal: Vector4): ObservableVector4;
        new (internal: Vector4, broker: SingleTopicMessageBroker<void>): ObservableVector4;
    }
    class ObservableVector4Base implements Vector4 {
        readonly changes: Vector4Changes;
        internal: Vector4;
        constructor(internal: Vector4);
        constructor(internal: Vector4, broker: SingleTopicMessageBroker<void>);
        get array(): ArrayLike<number>;
        get values(): Vector4Values;
        set values(values: Vector4Values);
        get x(): number;
        set x(x: number);
        get y(): number;
        set y(y: number);
        get z(): number;
        set z(z: number);
        get w(): number;
        set w(w: number);
        setArray(array: WritableArrayLike<number>): this;
        setValues(v: Vector4Values): this;
        copy(vec: Vector4): this;
        clone(): this;
        equals(vec: Vector4): boolean;
        setZeros(): this;
        add(vec: Vector4): this;
        addScalar(k: number): this;
        sub(vec: Vector4): this;
        lerp(vec: Vector4, t: number): this;
        clamp(min: Vector4, max: Vector4): this;
        multScalar(k: number): this;
        dot(vec: Vector4): number;
        len(): number;
        lenSq(): number;
        dist(vec: Vector4): number;
        distSq(vec: Vector4): number;
        normalize(): this;
        negate(): this;
        mult(vec: Vector4): this;
        addScaled(vec: Vector4, k: number): this;
        writeIntoArray(out: TypedArray | number[], offset?: number): void;
        readFromArray(arr: ArrayLike<number>, offset?: number): this;
    }
    const ObservableVector4: ObservableVector4Constructor;
}
declare module "engine/libs/maths/extensions/pools/Matrix3Pools" {
    import { Matrix3 } from "engine/libs/maths/algebra/matrices/Matrix3";
    import { StackPool } from "engine/libs/patterns/pools/StackPool";
    export { Matrix3Pool };
    const Matrix3Pool: StackPool<Matrix3>;
}
declare module "engine/libs/maths/extensions/pools/Vector4Pools" {
    import { Vector4 } from "engine/libs/maths/algebra/vectors/Vector4";
    import { StackPool } from "engine/libs/patterns/pools/StackPool";
    export { Vector4Pool };
    const Vector4Pool: StackPool<Vector4>;
}
declare module "engine/libs/maths/extensions/pools/lists/Vector2LisPools" {
    import { Vector2List } from "engine/libs/maths/extensions/lists/Vector2List";
    import { StackPool } from "engine/libs/patterns/pools/StackPool";
    export { Vector2ListPool };
    const Vector2ListPool: StackPool<Vector2List>;
}
declare module "engine/libs/maths/extensions/typed/TypedMatrix4" {
    import { Matrix4, Matrix4Base, Matrix4Values } from "engine/libs/maths/algebra/matrices/Matrix4";
    export { TypedMatrix4Constructor };
    export { TypedMatrix4 };
    export { TypedMatrix4Base };
    interface TypedMatrix4Constructor {
        readonly prototype: TypedMatrix4<TypedArray>;
        new (): TypedMatrix4<Float64Array>;
        new <T extends TypedArray>(type: Constructor<T>): TypedMatrix4<T>;
        new <T extends TypedArray>(type: Constructor<T>, values: Matrix4Values): TypedMatrix4<T>;
    }
    interface TypedMatrix4<T extends TypedArray = Float64Array> extends Matrix4 {
        readonly array: T;
        setArray<O extends T>(typedArray: O): this;
    }
    class TypedMatrix4Base<T extends TypedArray = Float64Array> extends Matrix4Base {
        protected _array: T;
        constructor();
        constructor(type: Constructor<T>);
        constructor(type: Constructor<T>, values: Matrix4Values);
        get array(): T;
        setArray<O extends T>(typedArray: O): this;
    }
    const TypedMatrix4: TypedMatrix4Constructor;
}
declare module "engine/libs/maths/extensions/typed/TypedVector3" {
    import { Vector3, Vector3Base, Vector3Values } from "engine/libs/maths/algebra/vectors/Vector3";
    export { TypedVector3Constructor };
    export { TypedVector3 };
    export { TypedVector3Base };
    interface TypedVector3Constructor {
        readonly prototype: TypedVector3<TypedArray>;
        new (): TypedVector3<Float64Array>;
        new <T extends TypedArray>(type: Constructor<T>): TypedVector3<T>;
        new <T extends TypedArray>(type: Constructor<T>, values: Vector3Values): TypedVector3<T>;
    }
    interface TypedVector3<T extends TypedArray = Float64Array> extends Vector3 {
        readonly array: T;
        setArray<O extends T>(typedArray: O): this;
    }
    class TypedVector3Base<T extends TypedArray = Float64Array> extends Vector3Base {
        protected _array: T;
        constructor();
        constructor(type: Constructor<T>);
        constructor(type: Constructor<T>, values: Vector3Values);
        get array(): T;
        setArray<O extends T>(typedArray: O): this;
    }
    const TypedVector3: TypedVector3Constructor;
}
declare module "engine/libs/maths/geometry/primitives/Quad" {
    import { Vector3 } from "engine/libs/maths/algebra/vectors/Vector3";
    import { Triangle } from "engine/libs/maths/geometry/primitives/Triangle";
    import { Matrix4 } from "engine/libs/maths/algebra/matrices/Matrix4";
    import { Injector } from "engine/libs/patterns/injectors/Injector";
    export { Quad };
    export { QuadInjector };
    export { QuadBase };
    interface Quad {
        point1: Vector3;
        point2: Vector3;
        point3: Vector3;
        point4: Vector3;
        set(point1: Vector3, point2: Vector3, point3: Vector3, point4: Vector3): Quad;
        clone(): Quad;
        copy(quad: Quad): Quad;
        translate(vec: Vector3): void;
        transform(mat: Matrix4): void;
        copyTriangles(triangle1: Triangle, triangle2: Triangle): void;
    }
    interface QuadConstructor {
        readonly prototype: Quad;
        new (): Quad;
        new (point1: Vector3, point2: Vector3, point3: Vector3, point4: Vector3): Quad;
        new (point1?: Vector3, point2?: Vector3, point3?: Vector3, point4?: Vector3): Quad;
    }
    class QuadBase implements Quad {
        private _point1;
        private _point2;
        private _point3;
        private _point4;
        constructor();
        constructor(point1: Vector3, point2: Vector3, point3: Vector3, point4: Vector3);
        get point1(): Vector3;
        set point1(point1: Vector3);
        get point2(): Vector3;
        set point2(point2: Vector3);
        get point3(): Vector3;
        set point3(point3: Vector3);
        get point4(): Vector3;
        set point4(point4: Vector3);
        set(point1: Vector3, point2: Vector3, point3: Vector3, point4: Vector3): QuadBase;
        clone(): QuadBase;
        copy(quad: QuadBase): QuadBase;
        translate(vec: Vector3): void;
        transform(mat: Matrix4): void;
        copyTriangles(triangle1: Triangle, triangle2: Triangle): void;
    }
    var Quad: QuadConstructor;
    const QuadInjector: Injector<QuadConstructor>;
}
declare module "engine/libs/maths/geometry/primitives/Ray" {
    import { Vector3 } from "engine/libs/maths/algebra/vectors/Vector3";
    import { Plane } from "engine/libs/maths/geometry/primitives/Plane";
    import { BoundingSphere } from "engine/libs/physics/collisions/BoundingSphere";
    import { Triangle } from "engine/libs/maths/geometry/primitives/Triangle";
    import { BoundingBox } from "engine/libs/physics/collisions/BoundingBox";
    import { Matrix4 } from "engine/libs/maths/algebra/matrices/Matrix4";
    import { Quad } from "engine/libs/maths/geometry/primitives/Quad";
    import { Injector } from "engine/libs/patterns/injectors/Injector";
    export { Ray };
    export { RayInjector };
    export { RayBase };
    interface Ray {
        origin: Vector3;
        direction: Vector3;
        set(origin: Vector3, direction: Vector3): Ray;
        equals(ray: Ray): boolean;
        copy(ray: Ray): Ray;
        clone(): Ray;
        pointAt(dist: number, out: Vector3): Vector3;
        closestPointTo(point: Vector3, out: Vector3): Vector3;
        distToPoint(point: Vector3): number;
        distSqToPoint(point: Vector3): number;
        distToPlane(plane: Plane): number | null;
        intersectsWithSphere(sphere: BoundingSphere): boolean;
        intersectsWithQuad(quad: Quad): number | null;
        intersectsWithTriangle(triangle: Triangle): number | null;
        intersectsWithPlane(plane: Plane): boolean | null;
        intersectsWithBox(box: BoundingBox): boolean | null;
        intersectionWithSphere(sphere: BoundingSphere, out: Vector3): Vector3 | null;
        intersectionWithPlane(plane: Plane, out: Vector3): Vector3 | null;
        intersectionWithBox(box: BoundingBox, out: Vector3): Vector3 | null;
        transform(mat: Matrix4): void;
    }
    interface RayConstructor {
        readonly prototype: Ray;
        new (): Ray;
        new (origin: Vector3, direction: Vector3): Ray;
        new (origin?: Vector3, direction?: Vector3): Ray;
    }
    class RayBase implements Ray {
        private _origin;
        private _direction;
        constructor();
        constructor(origin: Vector3, direction: Vector3);
        get origin(): Vector3;
        set origin(origin: Vector3);
        get direction(): Vector3;
        set direction(direction: Vector3);
        set(origin: Vector3, direction: Vector3): RayBase;
        equals(ray: RayBase): boolean;
        copy(ray: RayBase): RayBase;
        clone(): RayBase;
        pointAt(dist: number, out: Vector3): Vector3;
        lookAt(vec: Vector3): this;
        closestPointTo(point: Vector3, out: Vector3): Vector3;
        distToPoint(point: Vector3): number;
        distSqToPoint(point: Vector3): number;
        distToPlane(plane: Plane): number | null;
        intersectsWithSphere(sphere: BoundingSphere): boolean;
        intersectsWithQuad(quad: Quad): number | null;
        /**
         * Möller–Trumbore intersection algorithm
         */
        intersectsWithTriangle(triangle: Triangle): number | null;
        intersectsWithPlane(plane: Plane): boolean;
        intersectsWithBox(box: BoundingBox): boolean;
        intersectionWithSphere(sphere: BoundingSphere, out: Vector3): Vector3 | null;
        intersectionWithPlane(plane: Plane, out: Vector3): Vector3 | null;
        intersectionWithBox(box: BoundingBox, out: Vector3): Vector3 | null;
        transform(mat: Matrix4): void;
    }
    var Ray: RayConstructor;
    const RayInjector: Injector<RayConstructor>;
}
declare module "engine/libs/maths/geometry/space/Space" {
    import { TypedVector3 } from "engine/libs/maths/extensions/typed/TypedVector3";
    /**
     *     y axis
     * 	      ^   z axis
     *     UP |   ^  FORWARD
     *        | /
     *        +------> x axis
     *         RIGHT
     *
     *  left-handed coordinates system
     *
     */
    export { Space };
    class Space {
        private constructor();
        static readonly xAxis: TypedVector3<Uint8Array>;
        static readonly yAxis: TypedVector3<Uint8Array>;
        static readonly zAxis: TypedVector3<Uint8Array>;
        static readonly right: TypedVector3<Uint8Array>;
        static readonly left: TypedVector3<Uint8Array>;
        static readonly up: TypedVector3<Uint8Array>;
        static readonly down: TypedVector3<Uint8Array>;
        static readonly forward: TypedVector3<Uint8Array>;
        static readonly backward: TypedVector3<Uint8Array>;
    }
}
declare module "engine/libs/maths/statistics/random/RandomNumberGenerator" {
    export { RandomNumberGenerator };
    class RandomNumberGenerator {
        seed: number;
        m: number;
        a: number;
        c: number;
        xi: number;
        i: number;
        constructor(seed?: number, m?: number, a?: number, c?: number);
        reset(): void;
        random(): number;
        randomInRange(min: number, max: number): number;
    }
}
declare module "engine/libs/patterns/flags/options/Options" {
    export { Options };
    export { AdvancedOptionsBase };
    export { SimpleOptionsBase };
    interface Options<O extends number = number> {
        readonly bits: number;
        set(options: O): void;
        unset(options: O): boolean;
        get(options: O): boolean;
    }
    abstract class AdvancedOptionsBase<O extends number = number> implements Options<O> {
        private _flags;
        constructor(flags?: O);
        get bits(): number;
        set(options: O): void;
        unset(options: O): boolean;
        get(options: O): boolean;
        protected abstract handleSet(options: O): void;
        protected abstract handleUnset(options: O): void;
    }
    class SimpleOptionsBase<O extends number = number> implements Options<O> {
        private _flags;
        constructor(flags?: O);
        get bits(): number;
        set(options: O): void;
        unset(options: O): boolean;
        get(options: O): boolean;
    }
}
declare module "engine/libs/patterns/messaging/brokers/MessageBroker" {
    export { MessagePublisher };
    export { MessageSubscriber };
    export { MessageBroker };
    export { MessageBrokerBase };
    interface MessagePublisher<S extends string = string, M extends unknown = any> {
        hasSubscriptions(): boolean;
        publish(topic: S, message: M): void;
    }
    interface MessageSubscriber<S extends string = string, M extends unknown = any> {
        subscribe(topic: S, subscription: (message: M) => void): (message: any) => void;
        unsubscribe(topic: S, subscription: (message: M) => void): number;
    }
    interface MessageBroker<S extends string = string, M extends unknown = any> extends MessagePublisher<S, M>, MessageSubscriber<S, M> {
    }
    interface MessageBrokerConstructor {
        readonly prototype: MessageBroker;
        new (): MessageBroker;
    }
    class MessageBrokerBase<S extends string = string, M extends unknown = any> implements MessageBroker<S, M> {
        private _subscriptions;
        constructor();
        hasSubscriptions(): boolean;
        subscribe(topic: string, subscription: (message: any) => void): (message: any) => void;
        unsubscribe(topic: string, subscription: (message: any) => void): number;
        publish(topic: string, message?: any): void;
    }
    const MessageBroker: MessageBrokerConstructor;
}
declare module "engine/libs/patterns/messaging/brokers/SingleSubscriptionMessageBroker" {
    export { SingleSubscriptionMessagePublisher };
    export { SingleSubscriptionMessageSubscriber };
    export { SingleSubscriptionMessageBroker };
    export { SingleSubscriptionMessageBrokerBase };
    interface SingleSubscriptionMessagePublisher<M extends unknown = any> {
        hasSubscription(): boolean;
        publish(message: M): void;
    }
    interface SingleSubscriptionMessageSubscriber<M extends unknown = any> {
        hasSubscription(): boolean;
        subscribe(subscription: (message: M) => void): (message: any) => void;
        unsubscribe(subscription: (message: M) => void): number;
    }
    interface SingleSubscriptionMessageBroker<M extends unknown = any> extends SingleSubscriptionMessagePublisher<M>, SingleSubscriptionMessageSubscriber<M> {
    }
    interface SingleSubscriptionMessageBrokerConstructor {
        readonly prototype: SingleSubscriptionMessageBroker;
        new (): SingleSubscriptionMessageBroker;
    }
    class SingleSubscriptionMessageBrokerBase<M extends unknown = any> implements SingleSubscriptionMessageBroker<M> {
        private _subscription?;
        hasSubscription(): boolean;
        subscribe(subscription: (message: any) => void): (message: any) => void;
        unsubscribe(subscription: (message: any) => void): number;
        publish(message?: any): void;
    }
    const SingleSubscriptionMessageBroker: SingleSubscriptionMessageBrokerConstructor;
}
declare module "engine/libs/structures/trees/Tree" {
    import { Node } from "engine/libs/structures/trees/Node";
    export { Tree };
    export { BaseTree };
    interface Tree<N extends Node<any>> {
        readonly root: N;
        traverse(func: (...args: any) => any): void;
    }
    class BaseTree<N extends Node<any>> {
        readonly root: N;
        constructor(root: N);
        traverse(func: (...args: any) => any): void;
    }
}
