export { Entity };
interface EntityProperties {
    parent: Entity | null;
}
interface EntityConstructor {
    prototype: Entity;
    new (properties: EntityProperties): Entity;
}
interface Entity {
    get parent(): Entity | null;
    readonly nodes: Entity[];
}
declare var Entity: EntityConstructor;
