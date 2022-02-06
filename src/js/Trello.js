export default class Trello {
  constructor() {
    this.container = null;
    this.listsTitles = ['TODO', 'In Progress', 'Done'];
    this.storage = window.localStorage;
  }

  bindToDOM(container) {
    if (!(container instanceof HTMLElement)) {
      throw new Error('container is not HTMLElement');
    }
    this.container = container;
  }

  checkBinding() {
    if (this.container === null) {
      throw new Error('Class is not bind to DOM');
    }
  }

  init() {
    this.checkBinding();
    if (this.storage.getItem('lists') !== null) {
      this.loadFromLocalStorage();
    } else {
      this.drawTest();
    }
  }

  drawTest() {
    this.listsTitles.forEach(title => {
      this.createListWrapper(title);
    });
  }

  createListWrapper(title, id = '') {
    const list = document.createElement('div');
    list.classList.add('list-wrapper');
    const boardId = id || `board${this.getRandomInt()}`;
    list.innerHTML = `<div class="list" data-board-id="${boardId}">
            <div class="list-header">${title}</div>
            <div class="list-cards">              
            </div>
            <div class="card-composer-container">
              <a class="open-card-composer" href="#">
                <span><svg aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="svg-icon icon-add"><path fill="currentColor" d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z" class=""></path></svg></span>
                <span class="js-add-a-card">Добавить карточку</span>
              </a>
            </div>
          </div>`;
    list.querySelector('.open-card-composer').addEventListener('click', e => this.openCardComposer(e));
    this.container.appendChild(list);
  }

  openCardComposer(e) {
    const parent = e.target.closest('.list');
    const cards = parent.querySelector('.list-cards');
    const cardComposer = parent.querySelector('.card-composer-container');
    const cardController = document.createElement('div');
    cardController.classList.add('card-composer');
    cardController.innerHTML = `<div class="list-card">
          <div class="list-card-details">
            <textarea class="list-card-composer-textarea" placeholder="Ввести заголовок для этой карточки"></textarea>
          </div>
        </div>
        <div class="cc-controls">
          <div class="cc-controls-section">
            <button class="confirm" type="button">Добавить карточку</button>
            <a class="icon-close" href="#"></a>
          </div>
        </div>`;

    cardComposer.style.display = 'none';
    cardController.querySelector('.icon-close').addEventListener('click', ev => this.closeCardComposer(ev));
    cards.appendChild(cardController);

    const textarea = cardController.querySelector('.list-card-composer-textarea');
    const button = cardController.querySelector('.confirm');

    button.addEventListener('click', buttonEvent => {
      if (textarea.value.match(/[^\s]/g)) {
        this.createCard(parent.dataset.boardId, textarea.value);
        cardController.remove();
        cardComposer.style.display = 'block';
      }
    });
    textarea.addEventListener('keypress', textAreaEvent => {
      if (textarea.value.match(/[^\s]/g) && textAreaEvent.keyCode === 13 && !textAreaEvent.shiftKey) {
        this.createCard(parent.dataset.boardId, textarea.value);
        cardController.remove();
        cardComposer.style.display = 'block';
      }
    });
  }

  closeCardComposer(e) {
    const parent = e.target.closest('.list');
    const cardController = parent.querySelector('.card-composer');
    const cardComposer = parent.querySelector('.card-composer-container');

    cardController.remove();
    cardComposer.style.display = 'block';
  }

  createCard(board, text) {
    const parent = this.container.querySelector(`[data-board-id="${board}"]`);

    console.log(board);
    const cards = parent.querySelector('.list-cards');
    const card = document.createElement('div');
    card.classList.add('list-card');
    card.innerHTML = `<div class="list-card-details">${text}<span class="icon-close"></span>`;
    card.querySelector('.icon-close').addEventListener('click', evt => this.deleteConfirmation(evt));
    cards.appendChild(card);
    this.saveToLocalStorage();
  }

  deleteConfirmation(e) {
    const card = e.target.closest('.list-card');
    const popover = document.createElement('div');
    popover.classList.add('popover');
    popover.innerHTML = 'Уверены? <a href="#" class="popover_confirm">Да</a> <a href="#" class="popover_cancel">Нет</a>';
    popover.querySelector('.popover_confirm').addEventListener('click', evt => this.deleteCard(card));
    popover.querySelector('.popover_cancel').addEventListener('click', () => popover.remove());
    card.appendChild(popover);
  }

  deleteCard(card) {
    card.remove();
    this.saveToLocalStorage();
  }

  saveToLocalStorage() {
    const lists = this.container.querySelectorAll('.list');
    const obj = [...lists].map(el => ({
      id: el.dataset.boardId,
      name: el.querySelector('.list-header').innerHTML,
      cards: [...el.querySelectorAll('.list-card')].filter(text => text.innerText.length > 0).map(title => title.innerText),
    }));
    this.storage.setItem('lists', JSON.stringify(obj));
  }

  getRandomInt() {
    return Math.floor(1000 + Math.random() * 99999);
  }

  loadFromLocalStorage() {
    const boards = JSON.parse(this.storage.getItem('lists'));
    boards.forEach(board => {
      this.createListWrapper(board.name, board.id);
      board.cards.forEach(card => this.createCard(board.id, card));
    });
  }
}
