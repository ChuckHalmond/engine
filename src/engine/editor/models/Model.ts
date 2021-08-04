import { EventDispatcher } from "engine/libs/patterns/messaging/events/EventDispatcher";

// set event
abstract class AbstractModel extends EventDispatcher {
    parent: AbstractModel;
}

// set event
abstract class ItemModel extends AbstractModel {
    
}

// insert event
// remove event
abstract class ListModel extends AbstractModel {
    
}

// insert event
// remove event
abstract class TreeModel extends AbstractModel {
    
}