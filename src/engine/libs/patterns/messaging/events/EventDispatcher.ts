export { EventBase };
export { Event };
export { EEvent };
export { EventDispatcher };
export { EventDispatcherBase };

interface EventConstructor {
    readonly prototype: Event;
    new<T extends string, D extends any>(type: T, data: D): Event<T, D>;
}

interface Event<T extends string = string, D extends any = any> {
    readonly type: T;
    readonly data: D;
}

type EEvent<T extends string = string, D extends any = any> = Event<T, D>;

class EventBase<T extends string, D extends any> implements Event<T, D> {
    readonly type: T;
    readonly data: D;

    constructor(type: T, data: D) {
        this.type = type;
        this.data = data;
    }
}

var Event: EventConstructor = EventBase;

type EventHandler<E extends Event> = (event: E) => void;

interface EventListener<E extends Event = Event> {
    handler: EventHandler<E>;
    once?: boolean;
}

interface EventDispatcher<Events extends {[K in Extract<keyof Events, string>]: Event<K>} = {}> {
    addEventListener<K extends Extract<keyof Events, string>>(event: K, handler: (event: Events[K]) => void, once?: boolean): (event: Events[K]) => void;
    addEventListener<K extends string>(event: K, handler: (event: Event<K>) => void, once?: boolean): (event: Event<K>) => void;
    removeEventListener<K extends Extract<keyof Events, string>>(event: K, handler: (event: Events[K]) => void, once?: boolean): number;
    removeEventListener<K extends string>(event: K, handler: (event: Event<K>) => void, once?: boolean): number;
    dispatchEvent<K extends Extract<keyof Events, string>>(event: Events[K]): void;
    dispatchEvent<K extends string>(event: Event<K>): void;
}

interface EventDispatcherConstructor {
    readonly prototype: EventDispatcher<{}>;
    new<Events extends {[K in Extract<keyof Events, string>]: Event<K>} = {}>(): EventDispatcher<Events>;
}

class EventDispatcherBase<Events extends {[K in Extract<keyof Events, string>]: Event<K>} = {}> implements EventDispatcher<Events> {
    private _listeners: Map<string, EventListener<any>[]>;

    constructor() {
        this._listeners = new Map();
    }

    addEventListener<K extends string>(event: K, handler: (event: Event<K>) => void, once?: boolean): (event: Event<K>) => void;
    addEventListener<K extends Extract<keyof Events, string>>(event: K, handler: (event: Events[K]) => void, once?: boolean): (event: Events[K]) => void;
    addEventListener<K extends Extract<keyof Events, string>>(event: K, handler: (event: Events[K]) => void, once?: boolean): (event: Events[K]) => void {
        let listeners = this._listeners.get(event.toString());
        let newListener: EventListener<any> = {
            handler: handler,
            once: once
        };
        
        if (typeof listeners === "undefined") {
            this._listeners.set(event.toString(), [newListener]);
        }
        else if (!listeners.find(listener => listener.handler === handler && listener.once === once)) {
            listeners.push(newListener);
        }

        return handler;
    }

    removeEventListener<K extends string>(event: string, handler: (event: Event<K>) => void, once?: boolean): number;
    removeEventListener<K extends Extract<keyof Events, string>>(event: K, handler: (event: Events[K]) => void, once?: boolean): number;
    removeEventListener<K extends Extract<keyof Events, string>>(event: K, handler: (event: Events[K]) => void, once?: boolean): number {
        let listeners = this._listeners.get(event);
        if (typeof listeners !== "undefined") {
            const count = listeners.length;
            const idx = listeners.findIndex(listener => listener.handler === handler && listener.once === once);
            if (idx > -1) {
                if (count > 1) {
                    listeners[idx] = listeners.pop()!;
                    return count - 1;
                }
                else {
                    this._listeners.delete(event.toString());
                    return 0;
                }
            }
        }
        return -1;
    }

    dispatchEvent<K extends string>(event: Event<K>): void;
    dispatchEvent<K extends Extract<keyof Events, string>>(event: Events[K]): void;
    dispatchEvent<K extends Extract<keyof Events, string>>(event: Events[K]): void {
        let listeners = this._listeners.get(event.type);
        if (typeof listeners !== 'undefined') {
            listeners = listeners.filter((listener) => {
                listener.handler(event);
                return !listener.once
            });
            if (listeners.length === 0) {
                this._listeners.delete(event.type);
            }
        }
    }
}

const EventDispatcher: EventDispatcherConstructor = EventDispatcherBase;