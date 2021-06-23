export { Event };
export { EventDispatcher };
export { EventDispatcherBase };
export { EventsMap };

type Event = {
    data: any
}

type EventsMap = {
    [key: string]: Event;
}

interface EventDispatcher<M> {
    addEventListener<K extends keyof M & string>(event: K, callback: (event: M[K]) => void, once?: boolean): (event: M[K]) => void;
    addEventListener(event: string, callback: (event: Event) => void, once?: boolean): (event: Event) => void;
    removeEventListener<K extends keyof M & string>(event: K, callback: (event: M[K]) => void): number;
    removeEventListener(event: string, callback: (event: Event) => void): number;
    dispatchEvent<K extends keyof M & string>(name: K, event: M[K]): void;
    dispatchEvent(name: string, event: Event): void;
}

interface EventListener<E extends Event> {
    callback: (event: E) => void;
    once?: boolean;
}

interface EventDispatcherConstructor {
    readonly prototype: EventDispatcher<EventsMap>;
    new<M = EventsMap>(): EventDispatcher<M>;
}

class EventDispatcherBase<M> implements EventDispatcher<M> {
    private _listeners: Map<string, EventListener<Event>[]>;

    constructor() {
        this._listeners = new Map();
    }

    public addEventListener(event: string, callback: (event: any) => void, once?: boolean): (event: Event) => void;
    public addEventListener<K extends keyof M>(event: K, callback: (event: M[K]) => void, once?: boolean): (event: M[K]) => void;
    public addEventListener(event: string, callback: (event: any) => void, once?: boolean): (event: any) => void {
        let listeners = this._listeners.get(event);
        let listener = {
            callback: callback,
            once: once
        };
        
        if (typeof listeners === 'undefined') {
            this._listeners.set(event, [listener]);
        }
        else {
            listeners.push(listener);
        }

        return callback;
    }

    public removeEventListener(event: string, callback: (event: any) => void, once?: boolean): number;
    public removeEventListener<K extends keyof M>(event: K, callback: (event: M[K]) => void, once?: boolean): number;
    public removeEventListener(event: string, callback: (event: any) => void, once?: boolean): number {
        let listeners = this._listeners.get(event as string);
        let listener = {
            callback: callback,
            once: once
        } as EventListener<Event>;

        if (typeof listeners === 'undefined') {
            return -1;
        }
        const count = listeners.length;
        const idx = listeners.indexOf(listener);
        if (idx > -1) {
            if (count > 1) {
                listeners[idx] = listeners.pop()!;
                return count - 1;
            }
            else {
                this._listeners.delete(event);
                return 0;
            }
        }
        return count;
    }

    public dispatchEvent(name: string, event: any): void;
    public dispatchEvent<K extends keyof M>(name: K, event: M[K]): void;
    public dispatchEvent(name: string, event: any): void {
        let listeners = this._listeners.get(name);
        if (typeof listeners !== 'undefined') {
            listeners = listeners.filter((listener) => {
                listener.callback(event);
                return !listener.once
            });
            if (listeners.length === 0) {
                this._listeners.delete(name);
            }
        }
    }
}

const EventDispatcher: EventDispatcherConstructor = EventDispatcherBase;