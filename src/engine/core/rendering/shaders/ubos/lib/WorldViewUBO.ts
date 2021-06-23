import { TransformOrigin, Transform } from "engine/core/general/Transform";
import { Camera } from "engine/core/rendering/scenes/cameras/Camera";
import { UniformsList } from "engine/core/rendering/webgl/WebGLUniformUtilities";
import { Matrix4 } from "engine/libs/maths/algebra/matrices/Matrix4";
import { Matrix4Pool } from "engine/libs/maths/extensions/pools/Matrix4Pools";
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
    
    public static getInstance(references: WorldViewUBOReferences): WorldViewUBO {
        return UBOBase.getConcreteInstance(WorldViewUBO, references);
    }

    public subscribeReferences(): void {
        throw new Error("Method not implemented.");
    }

    public unsubscribeReferences(): void {
        throw new Error("Method not implemented.");
    }

    public getUniformValues(): UniformsList {

        let values: UniformsList = {};
        Matrix4Pool.acquireTemp(4, ([worldInverseTranspose, worldViewProjection, cameraWorld, meshWorld]: Tuple<Matrix4, 4>) => {
            
            this._references.camera.transform.getMatrix(cameraWorld, TransformOrigin.GLOBAL);
            this._references.meshTransform.getMatrix(meshWorld, TransformOrigin.GLOBAL);
            worldInverseTranspose.copy(meshWorld).invert().transpose();

            this._references.camera.getProjection(worldViewProjection).mult(cameraWorld).mult(meshWorld);

            values = {
                u_world: { value: new Float32Array(meshWorld.array) },
                u_worldInverseTranspose: { value: new Float32Array(worldInverseTranspose.array) },
                u_viewInverse: { value: new Float32Array(cameraWorld.array) },
                u_worldViewProjection: { value: new Float32Array(worldViewProjection.array) }
            };

        });
        
        return values;
    }
        
    public getDeltaUniformValues(): Partial<UniformsList> | null {
        throw new Error("Method not implemented.");
    }
}