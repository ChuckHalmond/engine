import { Transform } from "../../engine/core/general/Transform";
import { Matrix3 } from "../../engine/libs/maths/algebra/matrices/Matrix3";
import { Quaternion } from "../../engine/libs/maths/algebra/quaternions/Quaternion";
import { Vector3 } from "../../engine/libs/maths/algebra/vectors/Vector3";
import { Matrix3Pool } from "../../engine/libs/maths/extensions/pools/Matrix3Pools";
import { Space } from "../../engine/libs/maths/geometry/space/Space";

export type Widget = {
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
  
export function addWidgets(widgets: Widget[]) {
    const container = document.getElementById("widgets");
    if (container) {
        widgets.forEach((widget) => {
        let input: HTMLInputElement | HTMLSelectElement | null = null;
        let output: HTMLOutputElement | null = null;
        let label: HTMLLabelElement  = document.createElement("label");
        label.textContent = widget.name;
        switch (widget.type) {
            case "range":
                input = document.createElement("input");
                input.type = "range";
                if (widget.min !== void 0) {
                    input.min = widget.min.toString();
                }
                if (widget.max !== void 0) {
                    input.max = widget.max.toString();
                }
                input.value = widget.value.toString();
                output = document.createElement("output");
                output.value = widget.value.toString();
                input.onchange = (event: Event) => {
                    const newValue = (event.currentTarget as HTMLInputElement).value;
                    widget.setter.call(widget, parseFloat(newValue));
                    output!.value = newValue;
                };
            break;
            case "checkbox":
                input = document.createElement("input");
                input.type = "checkbox";
                input.value = widget.value.toString();
                input.onclick = (event: Event) => {
                    widget.setter.call(widget, (event.currentTarget as HTMLInputElement).checked);
                };
            break;
            case "select":
                input = document.createElement("select");
                input.value = widget.value.toString();
                input.append(
                    ...widget.options.map(opt => new Option(opt.label, opt.value))
                );
                input.onchange = (event: Event) => {
                    widget.setter.call(widget, (event.currentTarget as HTMLSelectElement).value);
                };
            break;
            case "button":
                input = document.createElement("input");
                input.value = widget.name;
                input.type = "button";
                input.onclick = () => {
                    widget.trigger.call(widget);
                };
            break;
        }
        if (input) {
            container.append(label, input);
            if (output) {
                container.append(output);
            }
        }
        });
    }
}

export function createRotationWidgets(transform: Transform, name: string): Widget[] {
    return [
        {
            name: `${name} roll`, type: "range",
            value: 0, min: -360, max: 360,
            setter: function(this, val) {
                const rotationMatrix = transform.getRotation(new Quaternion()).getMatrix();
                
                if (!("data" in this)) {
                    this.data = {
                        lastValue: 0
                    };
                }
                if (typeof this.data.lastValue === "number") {
                    const lastRotation = Matrix3.rotationX(this.data.lastValue * (Math.PI / 180));
                    rotationMatrix.mult(lastRotation.transpose());
                }
                this.data.lastValue = val;
        
                const newRotation = Quaternion.fromMatrix(rotationMatrix.mult(Matrix3.rotationX(val * (Math.PI / 180))));
                transform.setRotation(Quaternion.fromEuler(newRotation.pitch, newRotation.yaw, newRotation.roll));
            }
        },
        {
            name: `${name} pitch`, type: "range",
            value: 0, min: -360, max: 360,
            setter: function(this, val) {
                const rotationMatrix = transform.getRotation(new Quaternion()).getMatrix();
                
                if (!("data" in this)) {
                    this.data = {
                        lastValue: 0
                    };
                }
                if (typeof this.data.lastValue === "number") {
                    const lastRotation = Matrix3.rotationY(this.data.lastValue * (Math.PI / 180));
                    rotationMatrix.mult(lastRotation.transpose());
                }
                this.data.lastValue = val;
        
                const newRotation = Quaternion.fromMatrix(rotationMatrix.mult(Matrix3.rotationY(val * (Math.PI / 180))));
                transform.setRotation(Quaternion.fromEuler(newRotation.pitch, newRotation.yaw, newRotation.roll));
            }
        },
        {
            name: `${name} yaw`, type: "range",
            value: 0, min: -360, max: 360,
            setter: function(this, val) {
                const rotationMatrix = transform.getRotation(new Quaternion()).getMatrix();
                
                if (!("data" in this)) {
                    this.data = {
                        lastValue: 0
                    };
                }
                if (typeof this.data.lastValue === "number") {
                    const lastRotation = Matrix3.rotationZ(this.data.lastValue * (Math.PI / 180));
                    rotationMatrix.mult(lastRotation.transpose());
                }
                this.data.lastValue = val;
        
                const newRotation = Quaternion.fromMatrix(rotationMatrix.mult(Matrix3.rotationZ(val * (Math.PI / 180))));
                transform.setRotation(Quaternion.fromEuler(newRotation.pitch, newRotation.yaw, newRotation.roll));
            }
        }
    ];
}

export function createPositionWidgets(transform: Transform, name: string): Widget[] {
    return [
        {
            name: `${name} X`, type: "range",
            value: 0, min: -10, max: 10,
            setter: function(this, val) {
                if (!("data" in this)) {
                    this.data = {};
                }
                if (typeof this.data.lastValue === "number") {
                    transform.translate(Space.right.clone().scale(this.data.lastValue).negate());
                }
                this.data.lastValue = val;

                transform.translate(Space.right.clone().scale(val));
            }
        },
        {
            name: `${name} Y`, type: "range",
            value: 0, min: -10, max: 10,
            setter: function(this, val) {
                if (!("data" in this)) {
                    this.data = {};
                }
                if (typeof this.data.lastValue === "number") {
                    transform.translate(Space.up.clone().scale(this.data.lastValue).negate());
                }
                this.data.lastValue = val;

                transform.translate(Space.up.clone().scale(val));
            }
        },
        {
            name: `${name} Z`, type: "range",
            value: 0, min: -10, max: 10,
            setter: function(this, val) {
                if (!("data" in this)) {
                    this.data = {};
                }
                if (typeof this.data.lastValue === "number") {
                    transform.translate(Space.forward.clone().scale(this.data.lastValue).negate());
                }
                this.data.lastValue = val;

                transform.translate(Space.forward.clone().scale(val));
            }
        }
    ];
}

export function createRelativePositionWidgets(transform: Transform, name: string): Widget[] {
    return [
        {
            name: `${name} right`, type: "range",
            value: 0, min: -10, max: 10,
            setter: function(this, val) {
                transform.translate(transform.getRight(new Vector3()).scale(val).clone());
            }
        },
        {
            name: `${name} up`, type: "range",
            value: 0, min: -10, max: 10,
            setter: function(this, val) {
                transform.translate(transform.getUp(new Vector3()).scale(val).clone());
            }
        },
        {
            name: `${name} forward`, type: "range",
            value: 0, min: -10, max: 10,
            setter: function(this, val) {
                transform.translate(transform.getForward(new Vector3()).scale(val).clone());
            }
        }
    ];
}