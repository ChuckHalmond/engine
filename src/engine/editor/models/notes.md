view.model(model)
model.data(index, role)

view handles selection
view handles presentation

model: hasChange ? mapping model <-> view

view > model

widget = model (json) + view (dom)



model => onchange => view update



model = data

widget => bindModel


FieldTemplate

insert
remove

Model {
    key1
    key2
}

ModelList() {
    insert()
    remove()
}

ModelList => (add => insert)


@Observe({hasChanged: () => {}})
Model => (update)

```javascript
model.addEventListener("update");

```