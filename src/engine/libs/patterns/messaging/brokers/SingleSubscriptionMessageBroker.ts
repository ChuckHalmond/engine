export { SingleSubscriptionMessagePublisher };
export { SingleSubscriptionMessageSubscriber };
export { SingleSubscriptionMessageBroker };
export { SingleSubscriptionMessageBrokerBase };

interface SingleSubscriptionMessagePublisher<M extends unknown = any> {
    hasSubscription(): boolean;
    publish(message: M): void
}

interface SingleSubscriptionMessageSubscriber<M extends unknown = any> {
    hasSubscription(): boolean;
    subscribe(subscription: (message: M) => void): (message: any) => void;
    unsubscribe(subscription: (message: M) => void): number;
}

interface SingleSubscriptionMessageBroker<M extends unknown = any> extends SingleSubscriptionMessagePublisher<M>, SingleSubscriptionMessageSubscriber<M> {};

interface SingleSubscriptionMessageBrokerConstructor {
    readonly prototype: SingleSubscriptionMessageBroker;
    new(): SingleSubscriptionMessageBroker;
}

class SingleSubscriptionMessageBrokerBase<M extends unknown = any> implements SingleSubscriptionMessageBroker<M> {
    private _subscription?: (message: any) => void;
    
    public hasSubscription(): boolean {
        return (typeof this._subscription !== 'undefined');
    }

    public subscribe(subscription: (message: any) => void): (message: any) => void {
        this._subscription = subscription;
        return subscription;
    }

    public unsubscribe(subscription: (message: any) => void): number {
        if (this._subscription === subscription) {
            delete this._subscription;
            return 0;
        }
        return -1;
    }

    public publish(message?: any): void {
        if (typeof this._subscription !== 'undefined') {
            this._subscription(message);
        }
    }
}

const SingleSubscriptionMessageBroker: SingleSubscriptionMessageBrokerConstructor = SingleSubscriptionMessageBrokerBase;