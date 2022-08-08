import { Vector3 } from "engine/libs/maths/algebra/vectors/Vector3";
import { Matrix4 } from "../../../../libs/maths/algebra/matrices/Matrix4";
import { Space } from "../../../../libs/maths/geometry/space/Space";
import { UUID, UUIDGenerator } from "../../../../libs/maths/statistics/random/UUIDGenerator";
import { Frustum } from "../../../../libs/physics/collisions/Frustum";
import { Mesh } from "../objects/meshes/Mesh";
import { Object3D, Object3DBase } from "../objects/Object3D";

export { Camera };

interface CameraConstructor {
  prototype: Camera;
  new(): Camera;
  new(projection: Matrix4): Camera;
}

interface Camera extends Object3D {
  readonly uuid: UUID;
  readonly viewProjection: Matrix4;
  readonly projection: Matrix4;
  readonly view: Matrix4;
  readonly frustum: Frustum;
  isViewing(mesh: Mesh): boolean;
  updateFrustum(): void;
  getFront(vector: Vector3): Vector3;
}

class CameraBase extends Object3DBase {
    readonly uuid: UUID;
    readonly projection: Matrix4;
    readonly frustum: Frustum;
  
    constructor()
    constructor(projection: Matrix4)
    constructor(projection?: Matrix4) {
      super();
      this.uuid = UUIDGenerator.newUUID();
      this.projection = projection || new Matrix4();
      this.frustum = new Frustum().setFromMatrix(this.viewProjection);
    }

    getFront(vector: Vector3): Vector3 {
      return this.transform.getBackward(vector);
    }

    get view(): Matrix4 {
      return this.transform.matrix.clone().invert();
    }

    get viewProjection(): Matrix4 {
      return this.projection.clone().mult(this.view);
    }

    isViewing(mesh: Mesh): boolean {
      return true;
    }

    updateFrustum(): void {
      this.frustum.setFromMatrix(this.viewProjection);
    }
}

var Camera: CameraConstructor = CameraBase;