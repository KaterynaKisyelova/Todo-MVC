import listHtml from "./TodoListView.html";
import "./TodoListView.scss";

class TodoListView {
  static COMPLETED_CLASS_NAME = "completed";
  static DELETE_BTN_CLASS_NAME = "destroy";
  static TOGGLE_CLASS_NAME = "toggle";
  static TODO_ITEM_TAG = "li";
  static TODO_LIST_SELECTOR = ".todo-list";
  static TOGGLE_ALL_SELECTOR = ".toggle-all";
  static TODO_TITLE_TAG_NAME = "LABEL";
  static EDIT_INPUT_CLASS_NAME = "edit";
  static EDITING_TODO_CLASS_NAME = "editing";

  constructor(options) {
    this.options = options;
    this.list = this.init();
    this.todoContainer = this.list.querySelector(
      TodoListView.TODO_LIST_SELECTOR
    );
  }

  init() {
    const list = new DOMParser().parseFromString(listHtml, "text/html").body
      .firstChild;

    const todoContainer = list.querySelector(TodoListView.TODO_LIST_SELECTOR);
    const toggleCheckbox = list.querySelector(TodoListView.TOGGLE_ALL_SELECTOR);

    todoContainer.addEventListener(
      "click",
      this.onTodoContainerClick.bind(this)
    );
    todoContainer.addEventListener("dblclick", this.onTodoContainerDblClick);
    todoContainer.addEventListener(
      "blur",
      this.onTodoContainerBlur.bind(this),
      true
    );
    todoContainer.addEventListener(
      "keydown",
      this.onTodoContainerKeydown.bind(this),
      true
    );
    todoContainer.addEventListener(
      "mouseover",
      this.onTodoContainerMouseover.bind(this)
    );
    todoContainer.addEventListener(
      "mouseout",
      this.onTodoContainerMouseout.bind(this)
    );
    toggleCheckbox.addEventListener(
      "change",
      this.onToggleCheckboxChange.bind(this)
    );

    return list;
  }

  onTodoContainerClick(e) {
    const targetEl = e.target;
    const todoItem = targetEl.closest(TodoListView.TODO_ITEM_TAG);

    if (this.isTargetEl(targetEl, TodoListView.DELETE_BTN_CLASS_NAME)) {
      this.options.onDelete(todoItem.dataset.id);
      todoItem.remove();
      return;
    }

    if (this.isTargetEl(targetEl, TodoListView.TOGGLE_CLASS_NAME)) {
      this.options.onEdit({
        [todoItem.dataset.id]: {
          completed: !this.isComplete(todoItem),
        },
      });

      this.toggleItemCompleteness(todoItem, !this.isComplete(todoItem));

      this.options.onFilter(window.location.hash);
    }
  }

  onTodoContainerDblClick(e) {
    const todoText = e.target;

    if (todoText.tagName === TodoListView.TODO_TITLE_TAG_NAME) {
      const todoItem = this.findTodoEl(todoText);
      todoItem.classList.add(TodoListView.EDITING_TODO_CLASS_NAME);

      const editInput = todoItem.lastChild;
      const todoContent = todoItem.querySelector(".view");
      todoContent.style.display = "none";
      editInput.classList.add(TodoListView.EDIT_INPUT_CLASS_NAME);
      editInput.value = todoText.innerText;
      editInput.focus();
    }
  }

  onTodoContainerBlur(e) {
    const targetEl = e.target;

    if (!this.isTargetEl(targetEl, TodoListView.EDIT_INPUT_CLASS_NAME)) {
      return;
    }

    const editedTodo = this.findTodoEl(targetEl);
    const editedTodoId = editedTodo.dataset.id;
    const todoText = editedTodo.querySelector(TodoListView.TODO_TITLE_TAG_NAME);

    if (!targetEl.value.trim()) {
      this.options.onDelete(editedTodoId);
      editedTodo.remove();
      return;
    }

    todoText.innerText = targetEl.value;
    this.options.onEdit({ [editedTodoId]: { title: targetEl.value } });
    targetEl.value = null;
    targetEl.classList.remove(TodoListView.EDIT_INPUT_CLASS_NAME);
    const todoContent = editedTodo.querySelector(".view");
    todoContent.style.display = "block";
    editedTodo.classList.remove(TodoListView.EDITING_TODO_CLASS_NAME);
  }

  onTodoContainerKeydown(e) {
    const targetEl = e.target;

    if (
      this.isTargetEl(targetEl, TodoListView.EDIT_INPUT_CLASS_NAME) &&
      e.key === "Enter"
    ) {
      targetEl.blur();
    }
  }

  onTodoContainerMouseover(e) {
    const todoItem = this.findTodoEl(e.target);

    if (todoItem) {
      const deleteBtn = todoItem.querySelector(
        `.${TodoListView.DELETE_BTN_CLASS_NAME}`
      );
      deleteBtn.style.display = "block";
    }
  }

  onTodoContainerMouseout(e) {
    const todoItem = this.findTodoEl(e.target);

    if (todoItem) {
      const deleteBtn = todoItem.querySelector(
        `.${TodoListView.DELETE_BTN_CLASS_NAME}`
      );
      deleteBtn.style.display = "none";
    }
  }

  onToggleCheckboxChange() {
    const [...todos] = this.todoContainer.children;

    if (todos.every((todo) => this.isComplete(todo))) {
      const changes = todos.reduce((acc, todo) => {
        acc[todo.dataset.id] = { completed: false };
        this.toggleItemCompleteness(todo, false);

        return acc;
      }, {});

      this.options.onEdit(changes);
      return;
    }

    const changes = todos.reduce((acc, todo) => {
      if (!this.isComplete(todo)) {
        acc[todo.dataset.id] = { completed: true };
        this.toggleItemCompleteness(todo, true);

        return acc;
      }

      return acc;
    }, {});

    this.options.onEdit(changes);
  }

  renderList(todos) {
    const fragment = document.createDocumentFragment();

    todos.forEach((todo) => {
      const item = this.generateItem(todo);
      fragment.appendChild(item);
    });

    this.todoContainer.innerHTML = null;
    this.todoContainer.append(fragment);
  }

  renderItem(todo) {
    const item = this.generateItem(todo);

    this.todoContainer.append(item);
  }

  generateItem(todo) {
    const item = document.createElement(TodoListView.TODO_ITEM_TAG);

    item.dataset.id = todo.id;

    item.insertAdjacentHTML("afterbegin", this.generateItemContent(todo.title));

    this.toggleItemCompleteness(item, todo.completed);

    return item;
  }

  generateItemContent(text) {
    return `<div class="view">
              <input class=${TodoListView.TOGGLE_CLASS_NAME} type="checkbox"/>
              <label>${text}</label>
              <button class=${TodoListView.DELETE_BTN_CLASS_NAME}></button>
            </div>
            <input />`;
  }

  addToContainer(container) {
    container.append(this.list);
  }

  isComplete(el) {
    return this.isTargetEl(el, TodoListView.COMPLETED_CLASS_NAME);
  }

  isTargetEl(el, className) {
    return el.classList.contains(className);
  }

  findTodoEl(el) {
    return el.closest(TodoListView.TODO_ITEM_TAG);
  }

  toggleItemCompleteness(item, complete) {
    item.classList.toggle(TodoListView.COMPLETED_CLASS_NAME, complete);
  }

  clearCompleted() {
    if (this.todoContainer.children) {
      [...this.todoContainer.children].forEach((item) =>
        this.isComplete(item) ? item.remove() : null
      );
    }
  }
}

export default TodoListView;
