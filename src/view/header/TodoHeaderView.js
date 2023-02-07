import headerHtml from "./TodoHeaderView.html";
import { v4 as uuidv4 } from "uuid";
import "./TodoHeaderView.scss";

class TodoHeaderView {
  constructor(options) {
    this.options = options;
    this.header = this.init();
  }

  init() {
    const header = new DOMParser().parseFromString(headerHtml, "text/html").body
      .firstChild;

    const input = header.querySelector(".new-todo");
    input.addEventListener("keypress", this.onInputKeypress.bind(this));
    return header;
  }

  onInputKeypress(e) {
    const title = e.target.value;

    if (e.key === "Enter" && title.trim()) {
      const newTodo = { title, completed: false, id: uuidv4() };

      this.options.onSubmit(newTodo);
      this.options.onFilter(window.location.hash);
      e.target.value = "";
    }
  }

  addToContainer(container) {
    container.append(this.header);
  }
}

export default TodoHeaderView;
