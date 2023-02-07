class Collection {
  static KEY = "todos";

  #todoList = [];

  static getFromStorage() {
    return JSON.parse(localStorage.getItem(Collection.KEY)) || [];
  }

  static setToStorage(list) {
    localStorage.setItem(Collection.KEY, JSON.stringify(list));
  }

  get() {
    this.#todoList = Collection.getFromStorage();
    return this.#todoList;
  }

  create(todo) {
    this.#todoList.push(todo);
    Collection.setToStorage(this.#todoList);

    const activeItemsCount = this.count();

    return activeItemsCount;
  }

  delete(id) {
    this.#todoList = this.#todoList.filter((todo) => todo.id !== id);
    Collection.setToStorage(this.#todoList);

    const activeItemsCount = this.count();

    return activeItemsCount;
  }

  update(objOfChanges) {
    this.#todoList = this.#todoList.map((todo) => {
      const changedProperty = objOfChanges[todo.id];

      return changedProperty ? { ...todo, ...changedProperty } : todo;
    });

    Collection.setToStorage(this.#todoList);

    const activeItemsCount = this.count();

    return activeItemsCount;
  }

  clear() {
    this.#todoList = this.#todoList.filter((todo) => todo.completed !== true);
    Collection.setToStorage(this.#todoList);
  }

  filter(hash) {
    switch (hash) {
      case "#/active":
        return this.#todoList.filter((todo) => todo.completed === false);
      case "#/completed":
        return this.#todoList.filter((todo) => todo.completed === true);
      case "#/":
      default:
        return this.#todoList;
    }
  }

  count() {
    return this.#todoList.filter((todo) => todo.completed === false).length;
  }

  hasComplete() {
    return this.#todoList.some((todo) => todo.completed === true);
  }
}

export default Collection;
