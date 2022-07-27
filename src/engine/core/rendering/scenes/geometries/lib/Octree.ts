import { Vector3 } from "engine/libs/maths/algebra/vectors/Vector3";
import { Frustrum } from "../../../../../libs/physics/collisions/Frustrum";
import { BoundingBox } from "../bounding/BoundingBox";

const tempVector = new Vector3();

interface OctreeEntity {
    box: BoundingBox;
}

export class Octree {
    region: BoundingBox;
    
    parent: Octree | null;
    octants: Octree[];

    MIN_SIZE = 1;
    MAX_ENTITES = 8;

    nonStaticEntities: OctreeEntity[];
    staticEntities: OctreeEntity[];

    constructor(region: BoundingBox, parent?: Octree, nonStaticEntities?: OctreeEntity[], staticEntities?: OctreeEntity[]) {
        this.region = region;
        this.parent = parent ?? null;
        this.nonStaticEntities = nonStaticEntities ?? [];
        this.staticEntities = staticEntities ?? [];
        /*const {min, max} = region;
        const {x: minX, y: minY, z: minZ} = min;
        const {x: maxX, y: maxY, z: maxZ} = max;
        const centerX = (minX + maxX) / 2;
        const centerY = (minY + maxY) / 2;
        const centerZ = (minZ + maxZ) / 2;
        const center = new Vector3(centerX, centerY, centerZ);*/
        this.octants = [
            /*new Octree(new BoundingBox(min, center)),
            new Octree(new BoundingBox(new Vector3(centerX, minY, minZ), new Vector3(maxX, centerY, centerZ))),
            new Octree(new BoundingBox(new Vector3(centerX, minY, centerZ), new Vector3(maxX, centerY, maxZ))),
            new Octree(new BoundingBox(new Vector3(minX, minY, centerZ), new Vector3(centerX, centerY, maxZ))),
            new Octree(new BoundingBox(new Vector3(minX, centerY, minZ), new Vector3(centerX, maxY, centerZ))),
            new Octree(new BoundingBox(new Vector3(centerX, centerY, minZ), new Vector3(maxX, maxY, centerZ))),
            new Octree(new BoundingBox(center, max)),
            new Octree(new BoundingBox(new Vector3(minX, centerY, centerZ), new Vector3(centerX, maxY, maxZ)))*/
        ];
    }

    set(region: BoundingBox, parent?: Octree, nonStaticEntities?: OctreeEntity[], staticEntities?: OctreeEntity[]) {
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
    }

    entitiesWithinFrustrum(frustrum: Frustrum) {
        const {octants, region} = this;

        const {nearPlane, farPlane, bottomPlane, topPlane, leftPlane, rightPlane} = frustrum;
        const {normal: nearPlaneNormal} = nearPlane;
        const {normal: farPlaneNormal} = farPlane;
        const {normal: bottomPlaneNormal} = bottomPlane;
        const {normal: topPlaneNormal} = topPlane;
        const {normal: leftPlaneNormal} = leftPlane;
        const {normal: rightPlaneNormal} = rightPlane;

        const {min, max} = region;
        const {x: minX, y: minY, z: minZ} = min;
        const {x: maxX, y: maxY, z: maxZ} = max;
        const intersects = 
            nearPlane.distanceToPoint(tempVector.setValues(
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

        if (octants) {
            octants.forEach((octant) => {

                if (intersects) {

                }
            });
        }
        else {

        }
		return intersects;
    }

    update(): void {
        let octree: Octree = this;
        const {octants, nonStaticEntities} = this;
        nonStaticEntities.forEach((entity_i, i) => {
            while (!entity_i.box.hits(octree.region) && octree.parent) {
                octree = octree.parent;
            }
            if (octree && octree !== this) {
                nonStaticEntities.copyWithin(i, i + 1);
                nonStaticEntities.length--;
                const octreeEntitiesCount = octree.nonStaticEntities.push(entity_i);
                if (octreeEntitiesCount > this.MAX_ENTITES) {
                    octree.expand();
                }
            }
        });
        octants.forEach((octant) => {
            octant.update();
        });
    }

    dispose(): void {
        const {nonStaticEntities, staticEntities} = this;
        nonStaticEntities.length = 0;
        staticEntities.length = 0;
    }

    expand(): void {
        const {octants, region, staticEntities, nonStaticEntities} = this;
        const {min, max} = region;
        const {x: minX, y: minY, z: minZ} = min;
        const {x: maxX, y: maxY, z: maxZ} = max;
        const centerX = (minX + maxX) / 2;
        const centerY = (minY + maxY) / 2;
        const centerZ = (minZ + maxZ) / 2;
        const center = new Vector3(centerX, centerY, centerZ);
        octants.push(
            new Octree(new BoundingBox(min, center), this),
            new Octree(new BoundingBox(new Vector3(centerX, minY, minZ), new Vector3(maxX, centerY, centerZ)), this),
            new Octree(new BoundingBox(new Vector3(centerX, minY, centerZ), new Vector3(maxX, centerY, maxZ)), this),
            new Octree(new BoundingBox(new Vector3(minX, minY, centerZ), new Vector3(centerX, centerY, maxZ)), this),
            new Octree(new BoundingBox(new Vector3(minX, centerY, minZ), new Vector3(centerX, maxY, centerZ)), this),
            new Octree(new BoundingBox(new Vector3(centerX, centerY, minZ), new Vector3(maxX, maxY, centerZ)), this),
            new Octree(new BoundingBox(center, max), this),
            new Octree(new BoundingBox(new Vector3(minX, centerY, centerZ), new Vector3(centerX, maxY, maxZ)), this)
        );
        staticEntities.forEach((entity) => {
            const enclosingOctants = octants.filter(
                octant => octant.region.hits(entity.box)
            );
            if (enclosingOctants) {
                enclosingOctants.forEach(
                    (octant) => octant.staticEntities.push(entity)
                );
            }
        });
        nonStaticEntities.forEach((entity) => {
            const enclosingOctants = octants.filter(
                octant => octant.region.hits(entity.box)
            );
            if (enclosingOctants) {
                enclosingOctants.forEach(
                    (octant) => octant.nonStaticEntities.push(entity)
                );
            }
        });
        staticEntities.length = 0;
        nonStaticEntities.length = 0;
        octants.forEach((octant) => {
            if (octant.staticEntities.length + octant.nonStaticEntities.length > this.MAX_ENTITES) {
                octant.expand();
            }
        });
    }

    collapse(): void {
        const {octants, staticEntities, nonStaticEntities} = this;
        octants.forEach((octant) => {
            const {staticEntities: octantStaticEntities, nonStaticEntities: octantNonStaticEntities} = octant;
            staticEntities.push(...octantStaticEntities);
            nonStaticEntities.push(...octantNonStaticEntities);
            octant.dispose();
        });
    }
}