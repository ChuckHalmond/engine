import { Matrix3Values } from "../../libs/maths/algebra/matrices/Matrix3";
import { Matrix4 } from "../../libs/maths/algebra/matrices/Matrix4";
import { DualQuaternion } from "../../libs/maths/algebra/quaternions/DualQuaternion";
import { Quaternion } from "../../libs/maths/algebra/quaternions/Quaternion";
import { Vector2 } from "../../libs/maths/algebra/vectors/Vector2";
import { Vector3 } from "../../libs/maths/algebra/vectors/Vector3";

export class ArcBallControl {
    /*private _fov: number;
    private _windowSize: Vector2;

    private _prevMousePosNDC!: Vector2;

    private _positionT0!: Vector3;
    private _zoomingT0!: number;
    private _qRotationT0!: Quaternion;

    private _currentPosition!: Vector3;
    private _currentZooming!: number;
    private _currentQRotation!: Quaternion;

    private _targetPosition!: Vector3;
    private _targetZooming!: number;
    private _targetQRotation!: Quaternion;

    private _lagging!: number;

    private _view!: Matrix4;
    private _inverseView!: Matrix4;
    
    constructor(eye: Vector3, viewCenter: Vector3,
        upDir: Vector3, fov: number, windowSize: Vector2) {
        this._fov = fov;
        this._windowSize = windowSize;
        this.setViewParameters(eye, viewCenter, upDir);
    }
    
    // Project a point in NDC onto the arcball sphere
    public ndcToArcBall(point: Vector2): Quaternion {
        const dist = point.dot(point);
    
        // Point is on sphere
        if (dist <= 1.0)
            return new Quaternion([point.x, point.y, Math.sqrt(1.0 - dist), 0.0]);
    
        // Point is outside sphere
        const proj: Vector2 = point.normalize();
        return new Quaternion([proj.x, proj.y, 0.0, 0.0]);
    }
    
    public setViewParameters(eye: Vector3, viewCenter: Vector3, upDir: Vector3)
    {
        const dir: Vector3 = viewCenter.clone().sub(eye);
        
        let zAxis: Vector3 = dir.clone().normalize();
        let xAxis: Vector3 = zAxis.clone().cross(upDir.clone().normalize()).normalize();
        let yAxis: Vector3 = xAxis.clone().cross(zAxis.clone().normalize()).normalize();
        xAxis = zAxis.clone().cross(yAxis.clone().normalize()).normalize();
    
        this._targetPosition = viewCenter.clone().negate();
        this._targetZooming = -dir.len();
        this._targetQRotation = new Quaternion().setFromTransformMatrix(
            new Matrix4().setUpper33([...xAxis.values, ...yAxis.values, ...zAxis.values] as Matrix3Values).transpose()
        ).normalize();

        this._positionT0  = this._currentPosition = this._targetPosition;
        this._zoomingT0 = this._currentZooming = this._targetZooming;
        this._qRotationT0 = this._currentQRotation = this._targetQRotation;
    
        this.updateInternalTransformations();
    }
    
    public reset() {
        this._targetPosition = this._positionT0;
        this._targetZooming = this._zoomingT0;
        this._targetQRotation = this._qRotationT0;
    }
    
    public setLagging(lagging: number) {
        //CORRADE_INTERNAL_ASSERT(lagging >= 0.0f && lagging < 1.0f);
        this._lagging = lagging;
    }
    
    void ArcBall::initTransformation(const Vector2i& mousePos) {
        _prevMousePosNDC = screenCoordToNDC(mousePos);
    }
    
    public rotate(mousePos: Vector2) {
        const mousePosNDC: Vector2 = this.screenCoordToNDC(mousePos);

        const currentQRotation: Quaternion = this.ndcToArcBall(mousePosNDC);
        const prevQRotation: Quaternion = this.ndcToArcBall(this._prevMousePosNDC);

        this._prevMousePosNDC = mousePosNDC;
        this._targetQRotation = this._currentQRotation.clone().mult(prevQRotation).mult(this._targetQRotation).normalize();
    }
    
    public translate(mousePos: Vector2) {
        const mousePosNDC: Vector2 = this.screenCoordToNDC(mousePos);
        const translationNDC: Vector2 = mousePosNDC.sub(this._prevMousePosNDC);
        this._prevMousePosNDC = mousePosNDC;
        this.translateDelta(translationNDC);
    }
    
    public translateDelta(translationNDC: Vector2) {
        // Half size of the screen viewport at the view center and perpendicular
        //   with the viewDir
        const hh = Math.abs(this._targetZooming) * Math.tan(this._fov * 0.5);
        const hw = hh * (this._windowSize.x / this._windowSize.y);
        
        this._targetPosition.add(
            new Vector3(
                this._inverseView.transformDirection(
                    new Vector3([translationNDC.x * hw, translationNDC.y * hh, 0.0])
                )
            )
        );
    }
    
    public zoom(delta: number) {
        this._targetZooming += delta;
    }
    
    public updateTransformation() {
        const diffViewCenter: Vector3 = this._targetPosition.clone().sub(this._currentPosition);
        const diffRotation: Quaternion = this._targetQRotation.clone().sub(this._currentQRotation);
        const diffZooming = this._targetZooming - this._currentZooming;
    
        const dViewCenter = diffViewCenter.dot(diffViewCenter);
        const dRotation = diffRotation.dot(diffRotation);
        const dZooming = diffZooming * diffZooming;
    
        const small = Math.pow(10, -10);
        // Nothing change
        if (dViewCenter < small &&
           dRotation < small &&
           dZooming < small) {
            return false;
        }
        const almostSmall = Math.pow(10, -6);
        // Nearly done: just jump directly to the target
        if (dViewCenter < almostSmall &&
           dRotation < almostSmall &&
           dZooming < almostSmall) {
            this._currentPosition  = this._targetPosition;
            this._currentQRotation = this._targetQRotation;
            this._currentZooming   = this._targetZooming;
    
        // Interpolate between the current transformation and the target
        //  transformation
        } else {
            const t = 1 - this._lagging;
            this._currentPosition = this._currentPosition.lerp(this._targetPosition, t);
            this._currentZooming  = this._currentZooming + t*(this._targetZooming - this._currentZooming);
            this._currentQRotation = this._currentQRotation.slerp(this._targetQRotation, t);
        }
    
        this.updateInternalTransformations();
        return true;
    }
    
    public updateInternalTransformations() {
        this._view = 
            new Matrix4().setTranslation(
                new Vector3([0, 0, this._currentZooming])
            ).mult(
                DualQuaternion.fromRotation(this._currentQRotation).toMatrix()
            ).mult(
                new Matrix4().setTranslation(this._currentPosition)
            );
        this._inverseView = this._view.invert();
    }
    
    public screenCoordToNDC(mousePos: Vector2): Vector2 {
        return new Vector2([
            mousePos.x *2.0 / this._windowSize.x - 1.0,
            1.0 - 2.0 * mousePos.y / this._windowSize.y
        ]);
    }*/
}