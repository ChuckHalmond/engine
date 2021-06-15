import { SingleTopicMessageBroker } from "engine/libs/patterns/messaging/brokers/SingleTopicMessageBroker";

export { LogLevel };
export { LoggerMessage };
export { Logger };
export { LoggerBase };

enum LogLevel {
    DEBUG,
    ERROR,
    INFO,
    LOG,
    WARN
}

type LoggerMessage = {level: LogLevel, message: string};

interface Logger {
    log(message: string): void;
    info(message: string): void;
    warn(message: string): void;
    debug(message: string): void;
    error(message: string): void;
    subscribe(subscription: (message: LoggerMessage) => void): (message: LoggerMessage) => void;
	unsubscribe(subscription: (message: LoggerMessage) => void): number;
}

class LoggerBase implements Logger {

    constructor() {}

    public log(message: string): void {
        const level = LogLevel.LOG;
        message = this.formatMessage(level, message);
        console.log(message);
        this._onLog(level, message);
    }

    public info(message: string): void {
        const level = LogLevel.INFO;
        message = this.formatMessage(level, message);
        console.info(message);
        this._onLog(level, message);
    }

    public warn(message: string): void {
        const level = LogLevel.WARN;
        message = this.formatMessage(level, message);
        console.warn(message);
        this._onLog(level, message);
    }

    public debug(message: string): void {
        const level = LogLevel.DEBUG;
        message = this.formatMessage(level, message);
        console.debug(message);
        this._onLog(level, message);
    }

    public error(message: string): void {
        const level = LogLevel.ERROR;
        message = this.formatMessage(level, message);
        console.error(message);
        this._onLog(level, message);
    }

    protected _onLog(level: LogLevel, message: string): void {
        this._broker.publish({level: level, message: message});
    }

    private _broker = new SingleTopicMessageBroker();

    public subscribe(subscription: (message: LoggerMessage) => void): (message: LoggerMessage) => void {
        return this._broker.subscribe(subscription);
    }

    public unsubscribe(subscription: (message: LoggerMessage) => void): number {
        return this._broker.unsubscribe(subscription);
    }

    private formatMessage(level: LogLevel, message: string): string {
        const time = this.getTimestamp();
        return `[${time}] ${message}`;
    }

    private getTimestamp(): string {
        return new Date().toLocaleTimeString("en-US", {hour: "numeric", minute: "numeric", second: "numeric", hour12: false});
    }
}

const Logger: Logger = new LoggerBase();