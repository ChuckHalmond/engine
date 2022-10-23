export { MessageQueue };
interface MessageQueueConstructor {
    prototype: MessageQueue;
    new (): MessageQueue;
}
interface MessageQueue {
    enqueue(id: number, content: any): void;
    dequeue(): [number, any] | undefined;
}
declare var MessageQueue: MessageQueueConstructor;
