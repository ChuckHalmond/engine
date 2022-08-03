import { multiDraw } from "./src/samples/scenes/MultiDraw";
import { Entity } from "./src/engine/core/general/Entity";
import { Scene } from "./src/engine/core/general/Scene";
import { FaceHalfEdgesIterator, FaceVerticesIterator, Vertex, VertexFacesIterator } from "./src/engine/core/rendering/scenes/geometries/GeometryBuilder";
import { QuadGeometry } from "./src/engine/core/rendering/scenes/geometries/lib/QuadGeometry";
import { Matrix3 } from "./src/engine/libs/maths/algebra/matrices/Matrix3";
import { Matrix4 } from "./src/engine/libs/maths/algebra/matrices/Matrix4";
import { Vector2 } from "./src/engine/libs/maths/algebra/vectors/Vector2";
import { Vector3, Vector3Values } from "./src/engine/libs/maths/algebra/vectors/Vector3";
import { Vector4 } from "./src/engine/libs/maths/algebra/vectors/Vector4";
import { GOLDEN_RATIO } from "./src/engine/libs/maths/geometry/GeometryConstants";
import { Triangle } from "./src/engine/libs/maths/geometry/primitives/Triangle";
import { Space } from "./src/engine/libs/maths/geometry/space/Space";
import { buildArrayFromIndexedArrays } from "./src/engine/utils/Snippets";
import { start } from "./src/samples/scenes/SimpleScene";
import { octree } from "./src/samples/scenes/Octree";
import { deferred } from "./src/samples/scenes/Deferred";
import { helpers } from "./src/samples/scenes/Helpers";
/*
function windingOrder(v0: Vector3, v1: Vector3, v2: Vector3) {
    const triangle = new Triangle(v0, v1, v2);
    const centroid = triangle.getMidpoint(new Vector3());
    const normal = triangle.getNormal(new Vector3());
    
    const e1 = v1.clone().sub(v0);
    const e2 = e1.clone().cross(normal);

    e1.normalize();
    e2.normalize();

    const v0_centered = v0.clone().sub(centroid);
    const v1_centered = v1.clone().sub(centroid);
    const v2_centered = v2.clone().sub(centroid);

    const v0_t1 = e1.dot(v0_centered);
    const v0_t2 = e2.dot(v0_centered);

    const v1_t1 = e1.dot(v1_centered);
    const v1_t2 = e2.dot(v1_centered);

    const v2_t1 = e1.dot(v2_centered);
    const v2_t2 = e2.dot(v2_centered);

    const det = (v1_t1 - v0_t1) * (v2_t2 - v0_t2) - (v1_t2 - v0_t2) * (v2_t1 - v0_t1);
    console.log(det < 0 ? "CW" : "CCW");

    // const v0_out = new Vector2([v0_t1, v0_t2]);
    // const v1_out = new Vector2([v1_t1, v1_t2]);
    // const v2_out = new Vector2([v2_t1, v2_t2]);
    // const v0_angle = Math.atan2(v0_out.y, v0_out.x);
    // const v1_angle = Math.atan2(v1_out.y, v1_out.x);
    // const v2_angle = Math.atan2(v2_out.y, v2_out.x);
    
    // const angles = [v0_angle, v1_angle, v2_angle];
}*/

export async function main() {
    //instanced();
    //wireframe();

    /*const myWorker = new Worker("./worker.js");
    const sab = new SharedArrayBuffer(1024);
    const array = new Uint32Array(sab);
    myWorker.addEventListener("message", (event) => {
        console.log(`Received back: ${array[10]}`);
    });

    myWorker.postMessage(sab);*/

    helpers();
    //deferred();
    //octree();
    //start();
    //multiDraw();

    //startMaps();

    // const button = document.createElement("button");
    // button.textContent = "Get bin";
    // document.body.insertAdjacentElement("beforebegin", button);
    // button.onclick = () => {
    //     const anchor = document.createElement("a");
    //     const myData = new Float32Array([32.20, 1]);
    //     const myBlob = new Blob([myData]);
    //     anchor.download = "dat.bin";
    //     anchor.href = URL.createObjectURL(myBlob);
    //     anchor.click();
    // };
    
    // const input = document.createElement("input");
    // input.type = "file";
    // input.oninput = () => {
    //     if (input.files) {
    //         Array.from(input.files).forEach((file) => {
    //             file.arrayBuffer().then((arr) => {
    //                 console.log(Array.from(new Float32Array(arr)).map(val => val.toFixed(3)));
    //             });
    //         });
    //     }
    // };
    // document.body.insertAdjacentElement("beforebegin", input);
}