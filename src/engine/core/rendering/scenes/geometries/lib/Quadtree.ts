import { Vector2 } from "../../../../../libs/maths/algebra/vectors/Vector2";
import { Object3D } from "../../objects/Object3D";
import { BoundingRectangle } from "../bounding/BoundingRectangle";

export class Quadtree {
    region: BoundingRectangle;
    objects: Object3D[];
    
    parent: Quadtree | null;
    quadrants: Quadtree[];

    MIN_SIZE = 1;

    MAX_ENTITES = 8;

    constructor(region: BoundingRectangle, objects?: Object3D[], parent?: Quadtree) {
        this.region = region;
        this.objects = objects ?? [];
        this.parent = parent ?? null;
        const {min, max} = region;
        const {x: minX, y: minY} = min;
        const {x: maxX, y: maxY} = max;
        const centerX = (minX + maxX) / 2;
        const centerY = (minY + maxY) / 2;
        const center = new Vector2(centerX, centerY);
        this.quadrants = [
            new Quadtree(new BoundingRectangle(min, center)),
            new Quadtree(new BoundingRectangle(new Vector2(minX, centerY), new Vector2(centerX, maxY))),
            new Quadtree(new BoundingRectangle(new Vector2(centerX, minY), new Vector2(maxX, centerY))),
            new Quadtree(new BoundingRectangle(center, max)),
        ];
    }

    update() {
        
    }

    expand(): void {

    }

    collapse(): void {

    }
}