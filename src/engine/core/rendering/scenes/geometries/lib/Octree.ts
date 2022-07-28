import { Vector3 } from "../../../../../libs/maths/algebra/vectors/Vector3";
import { Frustrum } from "../../../../../libs/physics/collisions/Frustrum";
import { BoundingBox } from "../bounding/BoundingBox";

const tempVector = new Vector3();

const SQRT3 = Math.sqrt(3);

interface OctreeEntity {
    box: BoundingBox;
    containedIn: number[];
}

export class Octree {
    region: BoundingBox;
    
    parent: Octree | null;
    octants: Octree[];

    MIN_SIZE = 1;
    MAX_ENTITES = 8;

    nonStaticEntities: OctreeEntity[];
    staticEntities: OctreeEntity[];

    expanded: boolean;
    id: number;

    static count = 0;

    constructor(region: BoundingBox, parent?: Octree | null, nonStaticEntities?: OctreeEntity[], staticEntities?: OctreeEntity[]) {
        this.id = Octree.count++;
        this.region = region;
        this.parent = parent ?? null;
        this.nonStaticEntities = nonStaticEntities ?? [];
        this.staticEntities = staticEntities ?? [];
        this.octants = new Array(8);
        this.expanded = false;
    }

    /*set(region: BoundingBox, parent?: Octree, nonStaticEntities?: OctreeEntity[], staticEntities?: OctreeEntity[]) {
        this.region = region;
        this.parent = parent ?? null;
        this.nonStaticEntities = nonStaticEntities ?? [];
        this.staticEntities = staticEntities ?? [];
        const {octants} = this;
        const {min, max} = region;
        const {x: minX, y: minY, z: minZ} = min;
        const {x: maxX, y: maxY, z: maxZ} = max;
        const centerX = (minX + maxX) / 2;
        const centerY = (minY + maxY) / 2;
        const centerZ = (minZ + maxZ) / 2;
        const center = new Vector3(centerX, centerY, centerZ);
        octants.forEach((octant_i, i) => {
            const {region: octantRegion} = octant_i;
            const {min: octantMin, max: octantMax} = octantRegion;
            switch (i) {
                case 0: {
                    octantMin.copy(min);
                    octantMax.copy(center);
                    break;
                }
                case 1: {
                    octantMin.setValues(centerX, minY, minZ);
                    octantMax.setValues(maxX, centerY, centerZ);
                    break;
                }
                case 2: {
                    octantMin.setValues(centerX, minY, centerZ);
                    octantMax.setValues(maxX, centerY, maxZ);
                    break;
                }
                case 3: {
                    octantMin.setValues(minX, minY, centerZ);
                    octantMax.setValues(centerX, centerY, maxZ);
                    break;
                }
                case 4: {
                    octantMin.setValues(minX, centerY, minZ);
                    octantMax.setValues(centerX, maxY, centerZ);
                    break;
                }
                case 5: {
                    octantMin.setValues(centerX, centerY, minZ);
                    octantMax.setValues(maxX, maxY, centerZ);
                    break;
                }
                case 6: {
                    octantMin.copy(center);
                    octantMax.copy(max);
                    break;
                }
                case 7: {
                    octantMin.setValues(minX, centerY, centerZ);
                    octantMax.setValues(centerX, maxY, maxZ);
                    break;
                }
            };
        });
    }*/

    *entitiesWithinFrustrum(frustrum: Frustrum): IterableIterator<OctreeEntity> {
        const {region, expanded, octants, staticEntities, nonStaticEntities} = this;

        const {nearPlane, farPlane, bottomPlane, topPlane, leftPlane, rightPlane} = frustrum;
        const {normal: nearPlaneNormal} = nearPlane;
        const {normal: farPlaneNormal} = farPlane;
        const {normal: bottomPlaneNormal} = bottomPlane;
        const {normal: topPlaneNormal} = topPlane;
        const {normal: leftPlaneNormal} = leftPlane;
        const {normal: rightPlaneNormal} = rightPlane;

        const intersectsWithFrustrum = (box: BoundingBox) => {
            const {min, max} = box;
            const {x: minX, y: minY, z: minZ} = min;
            const {x: maxX, y: maxY, z: maxZ} = max;
            return nearPlane.distanceToPoint(tempVector.setValues(
                nearPlaneNormal.x > 0 ? maxX : minX,
                nearPlaneNormal.y > 0 ? maxY : minY,
                nearPlaneNormal.z > 0 ? maxZ : minZ
            )) >= 0 &&
            farPlane.distanceToPoint(tempVector.setValues(
                farPlaneNormal.x > 0 ? maxX : minX,
                farPlaneNormal.y > 0 ? maxY : minY,
                farPlaneNormal.z > 0 ? maxZ : minZ
            )) >= 0 &&
            leftPlane.distanceToPoint(tempVector.setValues(
                leftPlaneNormal.x > 0 ? maxX : minX,
                leftPlaneNormal.y > 0 ? maxY : minY,
                leftPlaneNormal.z > 0 ? maxZ : minZ
            )) >= 0 &&
            rightPlane.distanceToPoint(tempVector.setValues(
                rightPlaneNormal.x > 0 ? maxX : minX,
                rightPlaneNormal.y > 0 ? maxY : minY,
                rightPlaneNormal.z > 0 ? maxZ : minZ
            )) >= 0 &&
            topPlane.distanceToPoint(tempVector.setValues(
                topPlaneNormal.x > 0 ? maxX : minX,
                topPlaneNormal.y > 0 ? maxY : minY,
                topPlaneNormal.z > 0 ? maxZ : minZ
            )) >= 0 &&
            bottomPlane.distanceToPoint(tempVector.setValues(
                bottomPlaneNormal.x > 0 ? maxX : minX,
                bottomPlaneNormal.y > 0 ? maxY : minY,
                bottomPlaneNormal.z > 0 ? maxZ : minZ
            )) >= 0;
        };
        if (intersectsWithFrustrum(region)) {
            if (expanded) {
                octants.forEach(octant => octant.entitiesWithinFrustrum(frustrum));
            }
            else {
                yield *[...staticEntities, ...nonStaticEntities];
            }
        }
    }

    init(): void {
        const {nonStaticEntities, staticEntities} = this;
        if (nonStaticEntities.length + staticEntities.length > this.MAX_ENTITES) {
            this.expand();
        }
    }

    update(): void {
        let octree: Octree = this;
        const {octants, nonStaticEntities, expanded} = this;
        nonStaticEntities.forEach((entity_i, i) => {
            while (!entity_i.box.hits(octree.region) && octree.parent) {
                octree = octree.parent;
            }
            if (octree && octree !== this) {
                nonStaticEntities.copyWithin(i, i + 1);
                nonStaticEntities.length--;
                const octreeEntitiesCount = octree.nonStaticEntities.push(entity_i);

                //
                entity_i.containedIn.push(octree.id);
                //
                
                if (octreeEntitiesCount > this.MAX_ENTITES) {
                    octree.expand();
                }
            }
        });
        if (expanded) {
            octants.forEach((octant) => {
                octant.update();
            });
            const entitiesCount = octants.reduce((count, octant) => {
                const {nonStaticEntities, staticEntities} = octant;
                return count + nonStaticEntities.length + staticEntities.length;
            }, 0);
            if (entitiesCount < this.MAX_ENTITES) {
                this.collapse();
            }
        }
    }

    expand(): void {
        const {expanded} = this;
        if (!expanded) {
            const {region} = this;
            const {min, max} = region;
            if (min.distance(max) > SQRT3 * this.MIN_SIZE) {
                const {octants, staticEntities, nonStaticEntities} = this;
                const {x: minX, y: minY, z: minZ} = min;
                const {x: maxX, y: maxY, z: maxZ} = max;
                const centerX = (minX + maxX) / 2;
                const centerY = (minY + maxY) / 2;
                const centerZ = (minZ + maxZ) / 2;
                const center = new Vector3(centerX, centerY, centerZ);
                octants[0] = new Octree(new BoundingBox(min, center), this);
                octants[1] = new Octree(new BoundingBox(new Vector3(centerX, minY, minZ), new Vector3(maxX, centerY, centerZ)), this);
                octants[2] = new Octree(new BoundingBox(new Vector3(centerX, minY, centerZ), new Vector3(maxX, centerY, maxZ)), this);
                octants[3] = new Octree(new BoundingBox(new Vector3(minX, minY, centerZ), new Vector3(centerX, centerY, maxZ)), this);
                octants[4] = new Octree(new BoundingBox(new Vector3(minX, centerY, minZ), new Vector3(centerX, maxY, centerZ)), this);
                octants[5] = new Octree(new BoundingBox(new Vector3(centerX, centerY, minZ), new Vector3(maxX, maxY, centerZ)), this);
                octants[6] = new Octree(new BoundingBox(center, max), this);
                octants[7] = new Octree(new BoundingBox(new Vector3(minX, centerY, centerZ), new Vector3(centerX, maxY, maxZ)), this);
                staticEntities.forEach((entity) => {
                    const enclosingOctants = octants.filter(
                        octant => octant.region.hits(entity.box)
                    );
                    if (enclosingOctants) {
                        enclosingOctants.forEach(
                            (octant) => {
                                octant.staticEntities.push(entity);

                                //
                                entity.containedIn.push(octant.id);
                                //
                            }
                        );
                    }
                });
                nonStaticEntities.forEach((entity) => {
                    const enclosingOctants = octants.filter(
                        octant => octant.region.hits(entity.box)
                    );
                    if (enclosingOctants) {
                        enclosingOctants.forEach(
                            (octant) => {
                                console.log(`${octant.id}[min: ${Array.from(octant.region.min)}, max: ${Array.from(octant.region.max)}] encloses [min: ${Array.from(entity.box.min)}, max: ${Array.from(entity.box.max)}]`)
                                octant.nonStaticEntities.push(entity);

                                //
                                entity.containedIn.push(octant.id);
                                //
                            }
                        );
                    }
                });
                staticEntities.length = 0;

                //
                staticEntities.forEach((entity) => {
                    const index = entity.containedIn.indexOf(this.id);
                    entity.containedIn.copyWithin(index, index + 1);
                    entity.containedIn.length--;
                });
                //

                nonStaticEntities.length = 0;

                //
                nonStaticEntities.forEach((entity) => {
                    const index = entity.containedIn.indexOf(this.id);
                    entity.containedIn.copyWithin(index, index + 1);
                    entity.containedIn.length--;
                });
                //

                octants.forEach((octant) => {
                    const {staticEntities, nonStaticEntities} = octant;
                    if (staticEntities.length + nonStaticEntities.length > this.MAX_ENTITES) {
                        octant.expand();
                    }
                });
                this.expanded = true;
            }
        }
    }

    collapse(): void {
        const {expanded} = this;
        if (expanded) {
            const {octants, staticEntities, nonStaticEntities} = this;
            octants.forEach((octant) => {
                const {staticEntities: octantStaticEntities, nonStaticEntities: octantNonStaticEntities} = octant;
                staticEntities.push(...octantStaticEntities);
                
                //
                octantStaticEntities.forEach((entity) => {
                    entity.containedIn.push(this.id);
                });
                //

                nonStaticEntities.push(...octantNonStaticEntities);

                //
                octantNonStaticEntities.forEach((entity) => {
                    entity.containedIn.push(this.id);
                });
                //

                octantNonStaticEntities.length = 0;
                //
                octantNonStaticEntities.forEach((entity) => {
                    const index = entity.containedIn.indexOf(octant.id);
                    entity.containedIn.copyWithin(index, index + 1);
                    entity.containedIn.length--;
                });
                //

                octantStaticEntities.length = 0;
                //
                octantStaticEntities.forEach((entity) => {
                    const index = entity.containedIn.indexOf(octant.id);
                    entity.containedIn.copyWithin(index, index + 1);
                    entity.containedIn.length--;
                });
                //
            });
            this.expanded = false;
        }
    }
}