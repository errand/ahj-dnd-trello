export default class CardsValidator {
  constructor() {
    this.container = null;
    this.form = null;
    this.formInput = null;
    this.formButton = null;
    this.cards = null;
    this.rules = {
      mastercard: /^5[1-5]?(\d+)?$/, // full: ^5[1-5][0-9]{14}$/,
      visa: /^4[0-9]?(\d+)?$/, // full: /^4[0-9]{12}(?:[0-9]{3})?$/
      maestro: /^(5018|5020|5038|5893|6304|6759|6761|6762|6763)[0-9]?(\d+)?$/, // full /^(5018|5020|5038|5893|6304|6759|6761|6762|6763)[0-9]{8,15}$/,
      amex: /(^30[0-5][0-9]?(\d+)?$)|(^(36|38)[0-9]?(\d+)?$)/, // full /(^30[0-5][0-9]{11}$)|(^(36|38)[0-9]{12}$)/,
      jcb: /^(?:2131|1800|35(\d+)?)$/, // full /^(?:2131|1800|35\d{3})\d{11}$/,
      discover: /^65[4-9][0-9]?(\d+)?|64[4-9][0-9]?(\d+)?|6011[0-9]?(\d+)?|(622(?:12[6-9]|1[3-9][0-9]|[2-8][0-9][0-9]|9[01][0-9]|92[0-5])[0-9]?(\d+)?)$/, // full /^65[4-9][0-9]{13}|64[4-9][0-9]{13}|6011[0-9]{12}|(622(?:12[6-9]|1[3-9][0-9]|[2-8][0-9][0-9]|9[01][0-9]|92[0-5])[0-9]{10})$/,
      mir: /^(?:220[0-4])(\d+)?$/,
    };
    this.inputListeners = [];
    this.clickListeners = [];
  }

  bindToDOM(container) {
    if (!(container instanceof HTMLElement)) {
      throw new Error('container is not HTMLElement');
    }
    this.container = container;
    this.form = this.container.querySelector('#cardsValidationForm');
    this.formInput = this.container.querySelector('#card_number');
    this.formButton = this.container.querySelector('#submitform');
    this.cards = Array.from(this.container.querySelector('.cards').children);
    this.formInput.addEventListener('input', event => this.onInput(event));
    this.formButton.addEventListener('click', event => this.onClick(event));
  }

  checkBinding() {
    if (this.container === null) {
      throw new Error('CardsValidator not bind to DOM');
    }
  }

  /**
   * Loon algorithm
   *
   * @param {string} str - The string containing numbers to check.
   * @return {boolean} true if OK.
   */
  // eslint-disable-next-line class-methods-use-this
  luhnAlgorithm(str) {
    if (str.length > 7 && str.length < 20) {
      let ch = 0;
      const num = String(str).replace(/\D/g, '');
      const isOdd = num.length % 2 !== 0;

      if (num === '') return false;

      for (let i = 0; i < num.length; i += 1) {
        let n = parseInt(num[i], 10);

        // eslint-disable-next-line no-bitwise,no-cond-assign
        ch += (isOdd | 0) === (i % 2) && (n *= 2) > 9 ? (n - 9) : n;
      }

      return (ch % 10) === 0;
    }
    return false;
  }

  /**
   * Check if Input contain numbers only
   * @param {string} str - The string containing numbers to check.
   * @return {boolean} true if OK.
   */
  // eslint-disable-next-line class-methods-use-this
  checkInputNumbers(str) {
    if (!str.match(/^\d+$/gm)) {
      return false;
    }
    return true;
  }

  /**
   * Card payment system check
   *
   * @param setValue: string
   */
  paymentSystemCheck(setValue) {
    if (this.checkInputNumbers(setValue)) {
      // eslint-disable-next-line no-restricted-syntax
      for (const [key, value] of Object.entries(this.rules)) {
        if (setValue.match(value)) {
          return key;
        }
      }
    }
    return false;
  }

  /**
   * Add listener to input
   *
   * @param callback
   */
  addInputListener(callback) {
    this.inputListeners.push(callback);
  }

  onInput(event) {
    const input = this.formInput.value;
    this.inputListeners.forEach(o => o.call(null, input));
  }

  /**
   * Add listener to button click
   *
   * @param callback
   */
  addClickListener(callback) {
    this.clickListeners.push(callback);
  }

  onClick(event) {
    event.preventDefault();
    const input = this.formInput.value;
    this.clickListeners.forEach(o => o.call(null, input));
  }
}
