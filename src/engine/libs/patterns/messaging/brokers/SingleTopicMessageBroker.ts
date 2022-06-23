export { SingleTopicMessagePublisher };
export { SingleTopicMessageSubscriber };
export { SingleTopicMessageBroker };
export { SingleTopicMessageBrokerBase };

interface SingleTopicMessagePublisher<M extends unknown = any> {
    hasSubscriptions(): boolean;
    publish(message: M): void
}

interface SingleTopicMessageSubscriber<M extends unknown = any> {
    hasSubscriptions(): boolean;
    subscribe(subscription: (message: M) => void): (message: any) => void;
    unsubscribe(subscription: (message: M) => void): number;
}

interface SingleTopicMessageBroker<M extends unknown = any> extends SingleTopicMessagePublisher<M>, SingleTopicMessageSubscriber<M> {};

interface SingleTopicMessageBrokerConstructor {
    readonly prototype: SingleTopicMessageBroker;
    new(): SingleTopicMessageBroker;
}

class SingleTopicMessageBrokerBase<M extends unknown = any> implements SingleTopicMessageBroker {
    private _subscriptions: ((message: M) => void)[];

    constructor() {
        this._subscriptions = [];
    }
    
    hasSubscriptions(): boolean {
        return this._subscriptions.length > 0;
    }

    subscribe(subscription: (message: M) => void): (message: M) => void {
        const index = this._subscriptions.indexOf(subscription);
        if (index < 0) {
            this._subscriptions.push(subscription);
        }

        return subscription;
    }

    unsubscribe(subscription: (message: M) => void): number {
        const index = this._subscriptions.indexOf(subscription);
        if (index > -1) {
            this._subscriptions.splice(index, 1);
        }
        return this._subscriptions.length;
    }

    publish(message: M): void {
        for (const subscription of this._subscriptions) {
            subscription(message);
        }
    }
}

const SingleTopicMessageBroker: SingleTopicMessageBrokerConstructor = SingleTopicMessageBrokerBase;