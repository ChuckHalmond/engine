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
declare class SingleTopicMessageBrokerBase<M extends unknown = any> implements SingleTopicMessageBroker {
    private _subscriptions;
    constructor();
    hasSubscriptions(): boolean;
    subscribe(subscription: (message: M) => void): (message: M) => void;
    unsubscribe(subscription: (message: M) => void): number;
    publish(message: M): void;
}
declare const SingleTopicMessageBroker: SingleTopicMessageBrokerConstructor;
