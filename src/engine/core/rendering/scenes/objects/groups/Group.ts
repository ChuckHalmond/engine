import { Object3D, Object3DBase } from "../Object3D";

export { Group };
export { GroupBase };

interface Group {
    readonly objects: Object3D[];
    add(object: Object3D): Group;
}

class GroupBase extends Object3DBase implements Group {
    readonly objects: Object3D[];

    constructor() {
        super();
        this.objects = [];
    }

    add(object: Object3D): Group {
        this.objects.push(object);
        return this;
    }
}