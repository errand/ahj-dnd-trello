/**
 * @jest-environment jsdom
 */

import CardsValidator from '../CardsValidator';

const validator = new CardsValidator();

/* eslint-disable quotes */
test('Validate Luhn Algorithm', () => {
  expect(validator.luhnAlgorithm('6011870328613948')).toBeTruthy();
});

test('Fail Luhn Algorithm for Cards', () => {
  expect(validator.luhnAlgorithm('3434')).not.toBeTruthy();
});

test.each([
  ['5318065797202099', 'mastercard'],
  ['4758024707169070', 'visa'],
  ['3013522570371072', 'amex'],
  ['2200972321544391', 'mir'],
  ['6011870328613948', 'discover'],
])('System is %expected', (num, expected) => {
  expect(validator.paymentSystemCheck(num)).toBe(expected);
});
