import CardsValidator from './CardsValidator';
import CardsValidatorController from './CardsValidatorController';

const validator = new CardsValidator();
validator.bindToDOM(document.querySelector('#cards-container'));

const validatorCtrl = new CardsValidatorController(validator);
validatorCtrl.init();
