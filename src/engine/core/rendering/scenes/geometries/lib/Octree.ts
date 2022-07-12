import { Vector3 } from "engine/libs/maths/algebra/vectors/Vector3";
import { BoundingBox } from "../bounding/BoundingBox";
/*
export class Octree {
    region: BoundingBox;
    objects: Array<any>;
    
    parent: Octree;
    octants: Array<Octree>;

    MIN_SIZE = 1; 

    constructor(region: BoundingBox, objects: Array<any>) {
        this.region = region;
        this.objects = objects;
        const {min: regionMin, max: regionMax} = region;
        const center = new Vector3([
            (regionMin.x + regionMax.x) / 2,
            (regionMin.y + regionMax.y) / 2,
            (regionMin.z + regionMax.z) / 2,
        ]);
        this.octants = [
            new Octree(new BoundingBox(regionMin, center)),
            new Octree(new BoundingBox(new Vector3(center.X, m_region.Min.Y, m_region.Min.Z), new Vector3(m_region.Max.X, center.Y, center.Z));
            new Octree(new BoundingBox(new Vector3(center.X, m_region.Min.Y, center.Z), new Vector3(m_region.Max.X, center.Y, m_region.Max.Z));
            new Octree(new BoundingBox(new Vector3(m_region.Min.X, m_region.Min.Y, center.Z), new Vector3(center.X, center.Y, m_region.Max.Z));
            new Octree(new BoundingBox(new Vector3(m_region.Min.X, center.Y, m_region.Min.Z), new Vector3(center.X, m_region.Max.Y, center.Z));
            new Octree(new BoundingBox(new Vector3(center.X, center.Y, m_region.Min.Z), new Vector3(m_region.Max.X, m_region.Max.Y, center.Z));
            new Octree(new BoundingBox(center, m_region.Max);
            new Octree(new BoundingBox(new Vector3(m_region.Min.X, center.Y, center.Z), new Vector3(center.X, m_region.Max.Y, m_region.Max.Z));
        ];
    }
}*/