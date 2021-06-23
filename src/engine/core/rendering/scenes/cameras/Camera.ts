import { Object3D, Object3DBase } from "engine/core/rendering/scenes/objects/Object3D";
import { Mesh } from "../objects/meshes/Mesh";
import { Frustrum } from "engine/libs/physics/collisions/Frustrum";
import { Matrix4 } from "engine/libs/maths/algebra/matrices/Matrix4";
import { UUID, UUIDGenerator } from "engine/libs/maths/statistics/random/UUIDGenerator";

export { Camera };
export { CameraBase };

interface Camera extends Object3D {
  readonly uuid: UUID;
  projection: Matrix4;
  getProjection(mat: Matrix4): Matrix4;
  isViewing(mesh: Mesh): boolean;
}

class CameraBase extends Object3DBase {
    public readonly uuid: UUID;
    protected _projection: Matrix4;
    private _frustrum: Frustrum;
  
    constructor()
    constructor(projection: Matrix4)
    constructor(projection?: Matrix4) {
      super();
      this.uuid = UUIDGenerator.newUUID();
      this._projection = projection || new Matrix4();
      this._frustrum = new Frustrum().setFromPerspectiveMatrix(this._projection);
    }

    public get projection(): Matrix4 {
      return this._projection;
    }

    public getProjection(mat: Matrix4): Matrix4 {
      return mat.copy(this._projection);
    }

    public isViewing(mesh: Mesh): boolean {
      if (typeof mesh.geometry.boundingBox === 'undefined') {
        const boundingBox = mesh.geometry.computeBoundingBox();
        return this._frustrum.intersectsBox(boundingBox);
      }
      return this._frustrum.intersectsBox(mesh.geometry.boundingBox);
    }

    protected updateFrustrum(): void {
      this._frustrum.setFromPerspectiveMatrix(this._projection);
    }
}