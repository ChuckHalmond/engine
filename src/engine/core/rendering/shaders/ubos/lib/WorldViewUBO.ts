
import { Uniform } from "engine/core/rendering/webgl/WebGLUniformUtilities";
import { Matrix4 } from "../../../../../libs/maths/algebra/matrices/Matrix4";
import { Matrix4Pool } from "../../../../../libs/maths/extensions/pools/Matrix4Pools";
import { Transform } from "../../../../general/Transform";
import { Camera } from "../../../scenes/cameras/Camera";
import { UBOBase } from "../UBO";

export { WorldViewUBO };

type WorldViewUBOReferences = {
    meshTransform: Transform;
    camera: Camera;
}

class WorldViewUBO extends UBOBase<WorldViewUBOReferences> implements WorldViewUBO {
    
    constructor(references: WorldViewUBOReferences) {
        super('WorldViewUBO', references);
    }
    
    static getInstance(references: WorldViewUBOReferences): WorldViewUBO {
        return UBOBase.getConcreteInstance(WorldViewUBO, references);
    }

    subscribeReferences(): void {
        throw new Error("Method not implemented.");
    }

    unsubscribeReferences(): void {
        throw new Error("Method not implemented.");
    }

    getUniformValues(): Record<string, Uniform> {
        let values: Record<string, Uniform> = {};
        const [worldInverseTranspose, worldViewProjection, cameraWorld, meshWorld] = Matrix4Pool.acquire(4);
        cameraWorld.copy(this._references.camera.transform.matrix);
        meshWorld.copy(this._references.meshTransform.matrix);
        worldInverseTranspose.copy(meshWorld).invert().transpose();

        worldViewProjection.copy(this._references.camera.projection).mult(cameraWorld).mult(meshWorld);

        values = {
            u_world: { value: new Float32Array(meshWorld.array) },
            u_worldInverseTranspose: { value: new Float32Array(worldInverseTranspose.array) },
            u_viewInverse: { value: new Float32Array(cameraWorld.array) },
            u_worldViewProjection: { value: new Float32Array(worldViewProjection.array) }
        };
        Matrix4Pool.release(4);
        
        return values;
    }
        
    getDeltaUniformValues(): Partial<Record<string, Uniform>> | null {
        throw new Error("Method not implemented.");
    }
}