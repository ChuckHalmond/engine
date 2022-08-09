export { MessageQueue };

interface MessageQueueConstructor {
    prototype: MessageQueue;
    new(): MessageQueue;
}

interface MessageQueue {
    enqueue(id: number, content: any): void;
    dequeue(): [number, any] | undefined;
}

class MessageQueueBase implements MessageQueue {
    #messages: [number, any][];

    constructor() {
        this.#messages  = [];
    }

    enqueue(id: number, content: any): void {
        this.#messages.push([id, content]);
    }

    dequeue(): [number, any] | undefined {
        return this.#messages.pop();
    }
}

var MessageQueue: MessageQueueConstructor = MessageQueueBase;