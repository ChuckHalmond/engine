import { Vector3 } from "engine/libs/maths/algebra/vectors/Vector3";
import { Matrix4 } from "../../../../libs/maths/algebra/matrices/Matrix4";
import { Space } from "../../../../libs/maths/geometry/space/Space";
import { UUID, UUIDGenerator } from "../../../../libs/maths/statistics/random/UUIDGenerator";
import { Frustrum } from "../../../../libs/physics/collisions/Frustrum";
import { Mesh } from "../objects/meshes/Mesh";
import { Object3D, Object3DBase } from "../objects/Object3D";

export { Camera };
export { CameraBase };

interface Camera extends Object3D {
  readonly uuid: UUID;
  readonly viewProjection: Matrix4;
  readonly projection: Matrix4;
  readonly view: Matrix4
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
      return this._projection.clone();
    }

    public get view(): Matrix4 {
      return this.transform.matrix.clone().invert();
    }

    public get viewProjection(): Matrix4 {
      return this.projection.clone().mult(this.view);
    }

    public isViewing(mesh: Mesh): boolean {
      /*if (typeof mesh.geometry.boundingBox === 'undefined') {
        const boundingBox = mesh.geometry.computeBoundingBox();
        return this._frustrum.intersectsBox(boundingBox);
      }
      return this._frustrum.intersectsBox(mesh.geometry.boundingBox);*/
      return true;
    }

    protected updateFrustrum(): void {
      this._frustrum.setFromPerspectiveMatrix(this._projection);
    }
}