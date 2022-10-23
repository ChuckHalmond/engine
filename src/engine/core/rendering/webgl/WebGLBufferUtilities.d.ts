export { Buffer };
export declare enum BufferDataUsage {
    STATIC_DRAW = 35044,
    DYNAMIC_DRAW = 35048,
    STREAM_DRAW = 35040,
    STATIC_READ = 35045,
    DYNAMIC_READ = 35049,
    STREAM_READ = 35041,
    STATIC_COPY = 35046,
    DYNAMIC_COPY = 35050,
    STREAM_COPY = 35042
}
export declare enum BufferTarget {
    ARRAY_BUFFER = 34962,
    ELEMENT_ARRAY_BUFFER = 34963,
    TRANSFORM_FEEDBACK_BUFFER = 35982,
    UNIFORM_BUFFER = 35345
}
declare type Buffer = {
    internalBuffer: WebGLBuffer;
    target: BufferTarget;
    usage: BufferDataUsage;
    byteLength: number;
};
