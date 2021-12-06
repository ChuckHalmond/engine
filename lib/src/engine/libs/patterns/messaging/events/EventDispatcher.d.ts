export { EventBase };
export { Event };
export { EEvent };
export { EventDispatcher };
export { EventDispatcherBase };
interface EventConstructor {
    readonly prototype: Event;
    new <T extends string, D extends any>(type: T, data: D): Event<T, D>;
}
interface Event<T extends string = string, D extends any = any> {
    readonly type: T;
    readonly data: D;
}
declare type EEvent<T extends string = string, D extends any = any> = Event<T, D>;
declare class EventBase<T extends string, D extends any> implements Event<T, D> {
    readonly type: T;
    readonly data: D;
    constructor(type: T, data: D);
}
declare var Event: EventConstructor;
interface EventDispatcher<Events extends {
    [K in Extract<keyof Events, string>]: Event<K>;
} = {}> {
    addEventListener<K extends Extract<keyof Events, string>>(event: K, handler: (event: Events[K]) => void, once?: boolean): (event: Events[K]) => void;
    addEventListener<K extends string>(event: K, handler: (event: Event<K>) => void, once?: boolean): (event: Event<K>) => void;
    removeEventListener<K extends Extract<keyof Events, string>>(event: K, handler: (event: Events[K]) => void, once?: boolean): number;
    removeEventListener<K extends string>(event: K, handler: (event: Event<K>) => void, once?: boolean): number;
    dispatchEvent<K extends Extract<keyof Events, string>>(event: Events[K]): void;
    dispatchEvent<K extends string>(event: Event<K>): void;
}
interface EventDispatcherConstructor {
    readonly prototype: EventDispatcher<{}>;
    new <Events extends {
        [K in Extract<keyof Events, string>]: Event<K>;
    } = {}>(): EventDispatcher<Events>;
}
declare class EventDispatcherBase<Events extends {
    [K in Extract<keyof Events, string>]: Event<K>;
} = {}> implements EventDispatcher<Events> {
    private _listeners;
    constructor();
    addEventListener<K extends string>(event: K, handler: (event: Event<K>) => void, once?: boolean): (event: Event<K>) => void;
    addEventListener<K extends Extract<keyof Events, string>>(event: K, handler: (event: Events[K]) => void, once?: boolean): (event: Events[K]) => void;
    removeEventListener<K extends string>(event: string, handler: (event: Event<K>) => void, once?: boolean): number;
    removeEventListener<K extends Extract<keyof Events, string>>(event: K, handler: (event: Events[K]) => void, once?: boolean): number;
    dispatchEvent<K extends string>(event: Event<K>): void;
    dispatchEvent<K extends Extract<keyof Events, string>>(event: Events[K]): void;
}
declare const EventDispatcher: EventDispatcherConstructor;
