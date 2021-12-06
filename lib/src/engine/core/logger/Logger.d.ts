export { LogLevel };
export { LoggerMessage };
export { Logger };
export { LoggerBase };
declare enum LogLevel {
    DEBUG = 0,
    ERROR = 1,
    INFO = 2,
    LOG = 3,
    WARN = 4
}
declare type LoggerMessage = {
    level: LogLevel;
    message: string;
};
interface Logger {
    log(message: string): void;
    info(message: string): void;
    warn(message: string): void;
    debug(message: string): void;
    error(message: string): void;
    subscribe(subscription: (message: LoggerMessage) => void): (message: LoggerMessage) => void;
    unsubscribe(subscription: (message: LoggerMessage) => void): number;
}
declare class LoggerBase implements Logger {
    constructor();
    log(message: string): void;
    info(message: string): void;
    warn(message: string): void;
    debug(message: string): void;
    error(message: string): void;
    protected _onLog(level: LogLevel, message: string): void;
    private _broker;
    subscribe(subscription: (message: LoggerMessage) => void): (message: LoggerMessage) => void;
    unsubscribe(subscription: (message: LoggerMessage) => void): number;
    private formatMessage;
    private getTimestamp;
}
declare const Logger: Logger;
