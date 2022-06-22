import { Transform } from "../../engine/core/general/Transform";
export declare type Widget = {
    name: string;
    data?: any;
} & ({
    type: "range";
    min?: number;
    max?: number;
    value: number;
    setter: (this: Widget, val: number) => void;
} | {
    type: "checkbox";
    value: boolean;
    setter: (this: Widget, val: boolean) => void;
} | {
    type: "button";
    trigger: (this: Widget) => void;
} | {
    type: "select";
    value: string;
    options: ({
        value: string;
        label: string;
    })[];
    setter: (this: Widget, val: string) => void;
});
export declare function addWidgets(widgets: Widget[]): void;
export declare function createRotationWidgets(transform: Transform, name: string): Widget[];
export declare function createPositionWidgets(transform: Transform, name: string): Widget[];
export declare function createRelativePositionWidgets(transform: Transform, name: string): Widget[];
