export function bindAll(ctx, ...functions) {
    return functions.map(fn => {
        return fn.bind(ctx);
    })
}

export const getTemplate = () => {
    return `
    <input class="todo__input" data-input type="text" placeholder="Create a new todo...">

    <div class="todo__content">
        <ul class="todo__list" data-list></ul>
    </div>
    
    <div class="todo__footer d-flex" data-todo-footer>
        <p data-items-count>No items yet</p>

        <div class="filter_buttons">
            <button class="btn bold active" data-type="filter" data-btn="all">All</button>
            <button class="btn bold" data-type="filter" data-btn="active">Active</button>
            <button class="btn bold" data-type="filter" data-btn="completed">Completed</button>
        </div>
        
        <button class="btn" data-btn="clear">Clear Completed</button>
    </div>`
}