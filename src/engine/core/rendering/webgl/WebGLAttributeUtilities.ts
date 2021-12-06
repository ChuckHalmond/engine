import { DataType, BufferTarget, BufferDataUsage, BufferIndexType } from "./WebGLConstants";
import { WebGLBufferUtilities } from "./WebGLBufferUtilities";
import { WebGLVertexArrayUtilities } from "./WebGLVertexArrayUtilities";

export { AttributeArray };
export { AttributeIndicesArray };
export { AttributeNumComponents };
export { AttributeProperties };
export { Attribute };
export { AttributesList };
export { AttributeSetter };
export { AttributesListProperties };
export { AttributesSettersList };
export { WebGLAttributeUtilities };

type AttributeArray = TypedArray;
type AttributeIndicesArray = Uint8Array | Uint16Array | Uint32Array;

type AttributeNumComponents = 1 | 2 | 3 | 4;
type AttributeProperties<N extends AttributeNumComponents = AttributeNumComponents> = {
    numComponents: N;
    normalized?: boolean;
    srcOffset?: number;
    srcLength?: number; 
}

type Attribute<A extends AttributeArray = AttributeArray, N extends AttributeNumComponents = AttributeNumComponents> = {
    array: A;
    props: AttributeProperties<N>;
}

type AttributesList = {
    list: List<Attribute>;
    indices?: AttributeIndicesArray;
    props?: Partial<AttributesListProperties>;
}

type AttributeSetter = {
    location: number;
    bufferBytesOffset: number;
}

type AttributesListProperties = {
    instanced: boolean;
    divisor: number;
    target: BufferTarget;
    usage: BufferDataUsage;
}

type AttributesSettersList = {
    setters: List<AttributeSetter>;
    props: AttributesListProperties;

    bufferByteLength: number;
    numElements: number;
    hasIndices: boolean;
    indexType: BufferIndexType;

    glVao: WebGLVertexArrayObject;
    glBuffer: WebGLBuffer;
    glIndicesBuffer: WebGLBuffer;
    glProg: WebGLProgram;
}

class WebGLAttributeUtilities {

    public static getAttributesListSetter(gl: WebGL2RenderingContext, glProg: WebGLProgram, list: AttributesList): AttributesSettersList | null {
        
        const glVao = WebGLVertexArrayUtilities.createVertexArray(gl);
        if (glVao === null) {
            return null;
        }
 
        const glBuffer = WebGLBufferUtilities.createBuffer(gl);
        if (glBuffer === null) {
            return null;
        }

        const glIndicesBuffer = WebGLBufferUtilities.createBuffer(gl);
        if (glIndicesBuffer === null) {
            return null;
        }

        const attributes = list.list;
        
        const props = list.props;
        const instanced = props?.instanced || false;
        const divisor = props?.divisor || 1;
        const target = props?.target || BufferTarget.ARRAY_BUFFER;
        const usage = props?.usage || BufferDataUsage.STATIC_DRAW;

        const attributesNames = Object.keys(attributes);
        const attributesValues = attributesNames.map(
            (attributeName: string) => {
                return attributes[attributeName];
            }
        );
        
        const numElements = (typeof list.indices !== "undefined") ? list.indices.length : this.getAttributesListNumElements(list);
        const indexType = (typeof list.indices !== "undefined") ? this.getAttributeIndicesBufferType(list.indices) : BufferIndexType.UNSIGNED_SHORT;
        
        const settersList = {
            setters: {}
        } as AttributesSettersList;

        let bufferByteLength = 0;
        attributesValues.forEach((attr: Attribute) => {
            bufferByteLength += attr.array.byteLength + (32 - attr.array.byteLength % 32) % 32;
        });

        let bufferBytesOffset = 0;

        gl.bindVertexArray(glVao);
        
        gl.bindBuffer(target, glBuffer);
        gl.bufferData(target, bufferByteLength, usage);

        for (const name of attributesNames) {
            const attribute = attributes[name];
            const props = attribute.props;

            const location = gl.getAttribLocation(glProg, name);
            if (location == -1) {
                console.warn(`Attribute ${name} could not be located.`);
                continue;
            }

            gl.enableVertexAttribArray(location);

            const type = this.getAttributeArrayDataType(attribute.array);
            const normalized = (typeof props.normalized === "undefined") ? false : props.normalized;

            gl.vertexAttribPointer(location, props.numComponents, type, normalized, 0, bufferBytesOffset);
            
            if (instanced) {
                gl.vertexAttribDivisor(location, divisor);
            }

            settersList.setters[name] = {
                location: location,
                bufferBytesOffset: bufferBytesOffset
            };

            bufferBytesOffset += attribute.array.byteLength + (32 - attribute.array.byteLength % 32) % 32;
        }

        let hasIndices = false;
        if (typeof list.indices !== "undefined") {
            hasIndices = true;
            gl.bindBuffer(BufferTarget.ELEMENT_ARRAY_BUFFER, glIndicesBuffer);
            gl.bufferData(BufferTarget.ELEMENT_ARRAY_BUFFER, list.indices.byteLength, BufferDataUsage.STATIC_READ);
        }
        
        gl.bindVertexArray(null);

        settersList.glBuffer = glBuffer;
        settersList.glIndicesBuffer = glIndicesBuffer;
        settersList.glProg = glProg;
        settersList.glVao = glVao;
        settersList.props = {
            instanced: instanced,
            divisor: divisor,
            target: target,
            usage: usage
        };
        settersList.bufferByteLength = bufferByteLength;
        settersList.numElements = numElements;
        settersList.indexType = indexType;
        settersList.hasIndices = hasIndices;

        return settersList;
    }

    public static setAttributesListValues(gl: WebGL2RenderingContext, settersList: AttributesSettersList, list: AttributesList): void {

        const attributes = list.list;
        
        gl.bindVertexArray(settersList.glVao);
        gl.bindBuffer(settersList.props.target, settersList.glBuffer);

        Object.keys(attributes).forEach((name) => {
            const attribute = attributes[name];
            const setter = settersList.setters[name];

            const srcOffset = (typeof attribute.props.srcOffset === "undefined") ? 0 : attribute.props.srcOffset;
            const srcLength = (typeof attribute.props.srcLength === "undefined") ? attribute.array.length : attribute.props.srcLength;

            if (typeof setter !== "undefined") {
                gl.bufferSubData(settersList.props.target, setter.bufferBytesOffset, attribute.array, srcOffset, srcLength);
            }
            else {
                console.warn(`Attribute ${name} does not exist in the setters.`);
            }
        });

        if (typeof list.indices !== "undefined") {
            gl.bindBuffer(BufferTarget.ELEMENT_ARRAY_BUFFER, settersList.glIndicesBuffer);
            gl.bufferSubData(BufferTarget.ELEMENT_ARRAY_BUFFER, 0, list.indices);
        }

        gl.bindVertexArray(null);
    }

    public static bindAttributesList(gl: WebGL2RenderingContext, settersList: AttributesSettersList): void {
        gl.bindVertexArray(settersList.glVao);
    }

    public static unbindAttributesList(gl: WebGL2RenderingContext): void {
        gl.bindVertexArray(null);
    }

    public static getAttributeArrayDataType(array: AttributeArray): DataType {
        if (array instanceof Float32Array || array instanceof Int32Array || array instanceof Uint32Array) {
            return DataType.FLOAT;
        }
        else if (array instanceof Int16Array) {
            return DataType.SHORT;
        }
        else if (array instanceof Uint16Array) {
            return DataType.UNSIGNED_SHORT;
        }
        else if (array instanceof Int8Array) {
            return DataType.BYTE;
        }
        else if (array instanceof Uint8Array) {
            return DataType.UNSIGNED_BYTE;
        }
        console.error(`Unsupported attribute array ${array.constructor.name}.`);
        return -1;
    }

    public static getDataTypeByteLength(dataType: DataType): number {
        switch (dataType) {
            case DataType.FLOAT:
                return 4;
            case DataType.SHORT:
            case DataType.UNSIGNED_SHORT:
                return 2;
            case DataType.BYTE:
            case DataType.UNSIGNED_BYTE:
                    return 1;
        }
        console.error(`Unsupported data type ${DataType[dataType]}.`);
        return -1;
    }

    public static getAttributeIndicesBufferType(indices: AttributeIndicesArray): BufferIndexType {
        if (indices instanceof Uint8Array) {
            return BufferIndexType.UNSIGNED_BYTE;
        }
        else if (indices instanceof Uint16Array) {
            return BufferIndexType.UNSIGNED_SHORT;
        }
        else {
            return BufferIndexType.UNSIGNED_INT;
        }
    }

    private static getAttributesListNumElements(list: AttributesList): number {
        const attributes = list.list;
        const attributesNames = Object.keys(attributes);
        
        let numElements = 0;
        for (const name of attributesNames) {
            const attribute = attributes[name];
            if (numElements == 0) {
                numElements = Math.floor(attribute.array.length / attribute.props.numComponents);
            }
            else if (Math.floor(attribute.array.length / attribute.props.numComponents) !== numElements) {
                console.error(`Attribute ${name} should have ${numElements} elements.`);
            }
        }
        return numElements;
    }
}