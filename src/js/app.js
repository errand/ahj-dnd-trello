import Trello from './Trello';

const trello = new Trello();
trello.bindToDOM(document.querySelector('#board'));
trello.init();
