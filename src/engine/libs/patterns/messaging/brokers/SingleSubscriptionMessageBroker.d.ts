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
declare class SingleSubscriptionMessageBrokerBase<M extends unknown = any> implements SingleSubscriptionMessageBroker<M> {
    private _subscription?;
    hasSubscription(): boolean;
    subscribe(subscription: (message: any) => void): (message: any) => void;
    unsubscribe(subscription: (message: any) => void): number;
    publish(message?: any): void;
}
declare const SingleSubscriptionMessageBroker: SingleSubscriptionMessageBrokerConstructor;
