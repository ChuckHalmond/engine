import { Color } from "../../../libs/graphics/colors/Color";
import { Matrix3 } from "../../../libs/maths/algebra/matrices/Matrix3";
import { Vector3 } from "../../../libs/maths/algebra/vectors/Vector3";
import { Vector4 } from "../../../libs/maths/algebra/vectors/Vector4";
import { Plane } from "../../../libs/maths/geometry/primitives/Plane";
import { Mesh } from "../hl/Mesh";
import { WireframeMaterial } from "../hl/WireframeMaterial";
import { Camera } from "../scenes/cameras/Camera";
import { GeometryBuffer } from "../scenes/geometries/GeometryBuffer";
import { AttributeDataType } from "../webgl/WebGLVertexArrayUtilities";

export { CameraHelper };

interface CameraHelperConstructor {
    prototype: CameraHelper;
    new(camera: Camera): CameraHelper;
}

interface CameraHelper extends Mesh {
    readonly camera: Camera;
}

class CameraHelperBase extends Mesh implements CameraHelper {
    readonly camera: Camera;

    constructor(camera: Camera) {
        /*const {viewProjection} = camera;
        const viewProjectionInvert = viewProjection.invert();
        const clipPoints = [
            new Vector4(-1, -1, 0, 1),
            new Vector4(-1, 1, 0, 1),
            new Vector4(1, 1, 0, 1),
            new Vector4(1, -1, 0, 1),
            new Vector4(-1, -1, 1, 1),
            new Vector4(-1, 1, 1, 1),
            new Vector4(1, 1, 1, 1),
            new Vector4(1, -1, 1, 1),
        ];
        clipPoints.forEach((point) => {
            viewProjectionInvert.transformPoint4(point);
            console.log(point.w);
            point.multScalar(1 / point.w);
        });
        const [
            leftBottomNear, leftTopNear, rightTopNear, rightBottomNear,
            leftBottomFar, leftTopFar, rightTopFar, rightBottomFar
        ] = clipPoints.map((vector) => {
            const [x, y, z] = vector.array;
            return new Vector3(x, y, z);
        });*/
        const {frustrum} = camera;
        const {nearPlane, farPlane, bottomPlane, topPlane, leftPlane, rightPlane} = frustrum;
        const leftBottomNear = Plane.intersection(leftPlane, bottomPlane, nearPlane, new Vector3());
        const leftTopNear = Plane.intersection(leftPlane, topPlane, nearPlane, new Vector3());
        const rightBottomNear = Plane.intersection(rightPlane, bottomPlane, nearPlane, new Vector3());
        const rightTopNear = Plane.intersection(rightPlane, topPlane, nearPlane, new Vector3());
        const leftBottomFar  = Plane.intersection(leftPlane, bottomPlane, farPlane, new Vector3());
        const leftTopFar = Plane.intersection(leftPlane, topPlane, farPlane, new Vector3());
        const rightBottomFar = Plane.intersection(rightPlane, bottomPlane, farPlane, new Vector3());
        const rightTopFar = Plane.intersection(rightPlane, topPlane, farPlane, new Vector3());

        const vertices = [
            ...leftBottomNear, ...leftTopNear,
            ...leftTopNear, ...rightTopNear,
            ...rightTopNear, ...rightBottomNear,
            ...rightBottomNear, ...leftBottomNear,
            
            ...leftBottomNear, ...leftBottomFar,
            ...leftTopNear, ...leftTopFar,
            ...rightBottomNear, ...rightBottomFar,
            ...rightTopNear, ...rightTopFar,

            ...leftBottomFar, ...leftTopFar,
            ...leftTopFar, ...rightTopFar,
            ...rightTopFar, ...rightBottomFar,
            ...rightBottomFar, ...leftBottomFar,
        ];

        const nearColor = Color.rgba(Color.RED);
        const farColor = Color.rgba(Color.GREEN);
        const sideColor = Color.rgba(Color.BLUE);

        const colors = [
            ...nearColor, ...nearColor,
            ...nearColor, ...nearColor,
            ...nearColor, ...nearColor,
            ...nearColor, ...nearColor,

            ...sideColor, ...sideColor,
            ...sideColor, ...sideColor,
            ...sideColor, ...sideColor,
            ...sideColor, ...sideColor,

            ...farColor, ...farColor,
            ...farColor, ...farColor,
            ...farColor, ...farColor,
            ...farColor, ...farColor,
        ];
        
		const geometry = new GeometryBuffer({
            "a_position": {
                array: new Float32Array(vertices),
                type: AttributeDataType.VEC3
            },
            "a_color": {
                array: new Float32Array(colors),
                type: AttributeDataType.VEC3
            }
        });
        
		const material = new WireframeMaterial();
        super({geometry, material});

        this.camera = camera;
    }
}

var CameraHelper: CameraHelperConstructor = CameraHelperBase;