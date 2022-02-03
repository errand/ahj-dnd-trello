export default class CardsValidatorController {
  constructor(cardsValidator) {
    this.cardsValidator = cardsValidator;
    this.cards = this.cardsValidator.cards;
  }

  init() {
    this.cardsValidator.checkBinding();
    this.cardsValidator.addInputListener(this.validateCard.bind(this));
    this.cardsValidator.addClickListener(this.validateCard.bind(this));
  }

  /**
   * Card payment system check
   *
   * @param value
   */
  validateCard(value) {
    this.disableActiveCards();
    const paymentSystem = this.cardsValidator.paymentSystemCheck(value);
    if (paymentSystem) {
      const card = this.cardsValidator.container.querySelector(`.${paymentSystem}`);
      card.classList.add('active');
    }

    if (this.cardsValidator.luhnAlgorithm(value)) {
      this.cardsValidator.form.classList.add('valid');
    } else {
      this.cardsValidator.form.classList.add('invalid');
    }
  }

  disableActiveCards() {
    this.cardsValidator.form.classList.remove('valid');
    this.cardsValidator.form.classList.remove('invalid');
    this.cards.forEach(el => el.classList.remove('active'));
  }
}
