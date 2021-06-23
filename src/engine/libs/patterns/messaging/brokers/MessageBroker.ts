export { MessagePublisher };
export { MessageSubscriber };
export { MessageBroker };
export { MessageBrokerBase };

interface MessagePublisher<S extends string = string, M extends unknown = any> {
    hasSubscriptions(): boolean;
    publish(topic: S, message: M): void
}

interface MessageSubscriber<S extends string = string, M extends unknown = any> {
    subscribe(topic: S, subscription: (message: M) => void): (message: any) => void;
    unsubscribe(topic: S, subscription: (message: M) => void): number;
}

interface MessageBroker<S extends string = string, M extends unknown = any> extends MessagePublisher<S, M>, MessageSubscriber<S, M> {};

interface MessageBrokerConstructor {
    readonly prototype: MessageBroker;
    new(): MessageBroker;
}

class MessageBrokerBase<S extends string = string, M extends unknown = any> implements MessageBroker<S, M> {
    private _subscriptions: Map<string, ((message: any) => void)[]>;
    
    constructor() {
        this._subscriptions = new Map();
    }

    public hasSubscriptions(): boolean {
        return this._subscriptions.size > 0;
    }

    public subscribe(topic: string, subscription: (message: any) => void): (message: any) => void {
        let subscriptions = this._subscriptions.get(topic);

        if (typeof subscriptions === 'undefined') {
            this._subscriptions.set(topic, [subscription]);
        }
        else if (subscriptions.indexOf(subscription) < 0) {
            subscriptions.push(subscription);
        }

        return subscription;
    }

    public unsubscribe(topic: string, subscription: (message: any) => void): number {
        let subscriptions = this._subscriptions.get(topic);

        if (typeof subscriptions === 'undefined') {
            return -1;
        }
        const count = subscriptions.length;
        const idx = subscriptions.indexOf(subscription);
        if (idx > -1) {
            if (count > 1) {
                subscriptions[idx] = subscriptions.pop()!;
                return count - 1;
            }
            else {
                this._subscriptions.delete(topic);
                return 0;
            }
        }
        return count;
    }

    public publish(topic: string, message?: any): void {
        let subscriptions = this._subscriptions.get(topic);

        if (typeof subscriptions !== 'undefined') {
            for (const subscription of subscriptions) {
                subscription(message);
            }
        }
    }
}

const MessageBroker: MessageBrokerConstructor = MessageBrokerBase;