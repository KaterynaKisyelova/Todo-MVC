import footerHtml from "./TodoFooterView.html";
import "./TodoFooterView.scss";

class TodoFooterView {
  static ACTIVE_COUNT_SELECTOR = ".todo-count";
  static SELECTED_CLASS_NAME = "selected";
  static CLEAR_BTN_SELECTOR = ".clear-completed";
  static ACTIVE_CLASS_NAME = "active";

  hash;

  constructor(options) {
    this.options = options;
    this.hash = window.location.hash;
    this.footer = this.init();
    this.countContainer = this.footer.querySelector(
      TodoFooterView.ACTIVE_COUNT_SELECTOR
    );
    this.clearBtn = this.footer.querySelector(
      TodoFooterView.CLEAR_BTN_SELECTOR
    );
  }

  init() {
    const footer = new DOMParser().parseFromString(footerHtml, "text/html").body
      .firstChild;

    const clearButton = footer.querySelector(".clear-completed");
    clearButton.addEventListener("click", this.onClearButtonClick.bind(this));
    window.addEventListener("hashchange", this.onWindowHashchange.bind(this));

    return footer;
  }

  onClearButtonClick() {
    this.options.onClear();
    this.clearBtn.classList.remove("active");
  }

  onWindowHashchange(e) {
    const activeEl = e.currentTarget.document.activeElement;
    this.hash = e.target.location.hash;
    this.options.onHashChange(this.hash);
    const selectedEl = this.footer.querySelector(
      `.${TodoFooterView.SELECTED_CLASS_NAME}`
    );
    if (selectedEl) {
      selectedEl.classList.remove(TodoFooterView.SELECTED_CLASS_NAME);
    }

    activeEl.classList.add(TodoFooterView.SELECTED_CLASS_NAME);
  }

  selectFilter() {
    let activeLick;

    if (this.hash) {
      activeLick = this.footer.querySelector(`a[href=\'${this.hash}\']`);
    } else {
      activeLick = this.footer.querySelector(`a[href="#/"]`);
    }

    activeLick.classList.add(TodoFooterView.SELECTED_CLASS_NAME);
  }

  getHash() {
    return this.hash;
  }

  addToContainer(container) {
    container.append(this.footer);
  }

  renderActiveCount(count) {
    const activeItemsText = count === 1 ? "item left" : "items left";

    this.countContainer.innerHTML = `<strong>${count}</strong> ${activeItemsText}`;
  }
  
  hideClearBtn() {
    this.clearBtn.classList.remove(TodoFooterView.ACTIVE_CLASS_NAME);
  }

  showClearBtn() {
    this.clearBtn.classList.add(TodoFooterView.ACTIVE_CLASS_NAME);
  }
}

export default TodoFooterView;
