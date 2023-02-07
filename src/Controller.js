import Collection from "./model/Collection";
import TodoFooterView from "./view/footer/TodoFooterView";
import TodoHeaderView from "./view/header/TodoHeaderView";
import TodoListView from "./view/list/TodoListView";

class Controller {
  constructor(rootEl) {
    this.rootEl = rootEl;
    this.collection = new Collection();
    this.header = new TodoHeaderView({
      onSubmit: (todo) => {
        this.createNewTodo(todo);
      },
      onFilter: (hash) => this.filterList(hash),
    });
    this.list = new TodoListView({
      onDelete: (id) => this.deleteTodo(id),
      onEdit: (changes) => this.editTodo(changes),
      onFilter: (hash) => this.filterList(hash),
    });
    this.footer = new TodoFooterView({
      onClear: this.clearCompleted.bind(this),
      onHashChange: (hash) => this.filterList(hash),
    });

    this.header.addToContainer(this.rootEl);
    this.list.addToContainer(this.rootEl);
    this.footer.addToContainer(this.rootEl);

    this.init();
  }

  init() {
    const hash = this.footer.getHash();
    let initialTodos = this.collection.get();
    const activeItemsCount = this.collection.count();

    if (hash) {
      initialTodos = this.collection.filter(hash);
    }

    this.list.renderList(initialTodos);
    this.footer.renderActiveCount(activeItemsCount);
    this.footer.selectFilter();
    this.switchClearBtnVisibility();
  }

  createNewTodo(todo) {
    const activeItemsCount = this.collection.create(todo);
    this.list.renderItem(todo);
    this.footer.renderActiveCount(activeItemsCount);
  }

  deleteTodo(id) {
    const activeItemsCount = this.collection.delete(id);

    this.footer.renderActiveCount(activeItemsCount);
    this.switchClearBtnVisibility();
  }

  editTodo(changes) {
    const activeItemsCount = this.collection.update(changes);

    this.footer.renderActiveCount(activeItemsCount);
    this.switchClearBtnVisibility();
  }

  clearCompleted() {
    this.collection.clear();
    this.list.clearCompleted();
  }

  filterList(hash) {
    const filteredList = this.collection.filter(hash);
    this.list.renderList(filteredList);
  }

  switchClearBtnVisibility() {
    const hasCompleteItems = this.collection.hasComplete();

    if (!hasCompleteItems) {
      this.footer.hideClearBtn();
      return;
    }

    this.footer.showClearBtn();
  }
}

export default Controller;
