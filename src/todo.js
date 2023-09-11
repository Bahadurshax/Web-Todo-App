import { getTemplate, bindAll } from "./utils.js"

let dragSrcEl = null;

export class Item {
    constructor(id, value, isCompleted) {
        this.id = id;
        this.value = value;
        this.isCompleted = isCompleted;
    }

    handleDragStart(e) {
        dragSrcEl = e.currentTarget;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', e.currentTarget.innerHTML);
    }

    handleDrop(e) {
        e.stopPropagation();
        dragSrcEl.innerHTML = e.currentTarget.innerHTML;
        e.currentTarget.innerHTML = e.dataTransfer.getData('text/html');
    }

    handleDragEnter(e) {
        e.currentTarget.classList.add('drag-over');
    }

    handleDragLeave(e) {
        e.currentTarget.classList.remove('drag-over');
    }

    handleDragEnd() {
        document.querySelectorAll('.todo__item').forEach(item => {
            item.classList.remove('drag-over');
        })
    }

    get template() {
        return `
            <label>
                <input type="checkbox" data-id="${this.id}" data-type="item" ${this.isCompleted ? 'checked' : ''}/>
                <span>${this.value}</span>
            </label>
            <button aria-label="Remove the item" data-type="remove" data-id="${this.id}"></button>
        `
    }

    toHTML() {
        const li = document.createElement('li');
        li.classList.add('todo__item', 'd-flex');
        li.setAttribute('draggable', 'true');

        li.innerHTML = this.template;

        li.addEventListener('dragstart', this.handleDragStart);
        li.addEventListener('drop', this.handleDrop);
        li.addEventListener('dragenter', this.handleDragEnter);
        li.addEventListener('dragleave', this.handleDragLeave);
        li.addEventListener('dragend', this.handleDragEnd);
        li.ondragover = e => e.preventDefault();

        return li;
    }
}


export class Todo {
    constructor(selector) {
        this.$el = document.querySelector(selector);
        this.items = [];

        this.#init();
        this.#setup();
    }

    #init() {
        this.$el.innerHTML = getTemplate();
        this.$input = this.$el.querySelector('[data-input]');
        this.$list = this.$el.querySelector('[data-list]');
        this.$footer = this.$el.querySelector('[data-todo-footer]');
        this.$quantity = this.$el.querySelector('[data-items-count]');
    }

    addItem(e) {
        const input = e.target;

        if (e.keyCode === 13 && input.value !== '') {
            const id = Date.now().toString();
            const item = new Item(id, input.value, false);
            this.items.push(item);
            input.value = '';
            this.save(item);
            this.render();
            this.updateItemsCount();
        }
    }

    save(item) {
        localStorage.setItem(item.id, JSON.stringify(item));
    }

    removeItem(id) {
        const $item = this.$list.querySelector(`[data-id="${id}"]`).closest('.todo__item');
        $item.classList.add('removing');

        setTimeout(() => {
            $item.remove();
            this.items = this.items.filter(item => item.id !== id);
            localStorage.removeItem(id);
            this.updateItemsCount();
        }, 400)
    }

    updateItemsCount() {
        const incompleteItems = this.items.filter(item => !item.isCompleted);
        this.$quantity.textContent = `${incompleteItems.length} item(s) left`;
    }

    handleItemClicks(e) {
        const { type, id } = e.target.dataset;

        if (type === 'item') {
            const item = this.items.find(item => item.id === id);
            item.isCompleted = e.target.checked;
            this.save(item);
            this.updateItemsCount();
        }

        if (type === 'remove') {
            this.removeItem(id);
        }
    }

    filterItems(btn, $items) {
        if (btn === 'all') {
            $items.forEach(item => {
                item.closest('.todo__item').style.display = 'flex';
            })
        } else if (btn === 'active') {
            $items.forEach(item => {
                item.closest('.todo__item').style.display = item.checked ? 'none' : 'flex';
            })
        } else if (btn === 'completed') {
            $items.forEach(item => {
                item.closest('.todo__item').style.display = item.checked ? 'flex' : 'none';
            })
        }
    }

    handleFooterClicks(e) {
        const btn = e.target.dataset.btn;
        const $items = this.$list.querySelectorAll('[data-type="item"]');

        if (e.target.dataset.type === 'filter') {
            const buttons = this.$footer.querySelectorAll('[data-btn]');
            buttons.forEach(btn => btn.classList.remove('active'));

            e.target.classList.add('active');

            this.filterItems(btn, $items);
        }

        if (btn === 'clear') {
            $items.forEach(item => {
                if (item.checked) this.removeItem(item.dataset.id);
            })
        }
    }

    #setup() {
        const [
            addItem,
            handleItemClicks,
            handleFooterClicks
        ] = bindAll(this, this.addItem, this.handleItemClicks, this.handleFooterClicks);

        this.$input.addEventListener('keypress', addItem);
        this.$list.addEventListener('click', handleItemClicks);
        this.$footer.addEventListener('click', handleFooterClicks);
    }

    render() {
        this.$list.innerHTML = '';

        this.items.forEach(item => {
            this.$list.insertAdjacentElement('beforeend', item.toHTML());
        })
    }
}