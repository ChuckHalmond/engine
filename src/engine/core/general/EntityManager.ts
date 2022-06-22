export { EntityManager };

interface EntityManagerConstructor {

}

interface EntityManager {

}

class EntityManagerBase implements EntityManager {

    private constructor() {
        
    }

    public readonly instance: EntityManagerBase = new EntityManagerBase();
}

var EntityManager: EntityManagerConstructor = EntityManagerBase;