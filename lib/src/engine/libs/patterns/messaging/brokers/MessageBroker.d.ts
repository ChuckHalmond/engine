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
declare class MessageBrokerBase<S extends string = string, M extends unknown = any> implements MessageBroker<S, M> {
    private _subscriptions;
    constructor();
    hasSubscriptions(): boolean;
    subscribe(topic: string, subscription: (message: any) => void): (message: any) => void;
    unsubscribe(topic: string, subscription: (message: any) => void): number;
    publish(topic: string, message?: any): void;
}
declare const MessageBroker: MessageBrokerConstructor;
