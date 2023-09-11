import { Item, Todo } from "./todo.js"

const todo = new Todo('#todo');

window.addEventListener('load', () => {
    if (localStorage.length) {
        let rawItems = Object.values(localStorage);

        rawItems.forEach(rawItem => {
            const item = JSON.parse(rawItem);
            Object.setPrototypeOf(item, Item.prototype);
            todo.items.push(item);
        })

        todo.render();
        todo.updateItemsCount();
    }
})