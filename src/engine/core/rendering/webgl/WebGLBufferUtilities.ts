export { Buffer };

export enum BufferDataUsage {
    STATIC_DRAW = 0x88E4,
    DYNAMIC_DRAW = 0x88E8,
    STREAM_DRAW = 0x88E0,
    STATIC_READ = 0x88E5,
    DYNAMIC_READ = 0x88E9,
    STREAM_READ = 0x88E1,
    STATIC_COPY = 0x88E6,
    DYNAMIC_COPY = 0x88EA,
    STREAM_COPY = 0x88E2
}

export enum BufferTarget {
    ARRAY_BUFFER = 0x8892,
    ELEMENT_ARRAY_BUFFER = 0x8893,
    TRANSFORM_FEEDBACK_BUFFER = 0x8C8E,
    UNIFORM_BUFFER = 0x8A11,
}

type Buffer = {
    internalBuffer: WebGLBuffer;
    target: BufferTarget;
    usage: BufferDataUsage;
}