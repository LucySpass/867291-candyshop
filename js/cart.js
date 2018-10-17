'use strict';

var cartModule = (function () {
  var DECIMAL = 10;
  var LUHN_CHECK_NUMBER = 10;
  var LUHN_MINUS_NUMBER = 9;
  var LUHN_TIMES_NUMBER = 2;
  var BACKSPACE = 8;
  var MONTHS_NUMBER = 2;
  var EVEN_NUMBER_CHECK = 2;

  var cartProducts = [];
  var cartFragment = document.createDocumentFragment();
  var productCardsElement = document.querySelector('.goods__cards');
  var productCartEmpty = document.querySelector('#cards-empty').content.querySelector('.goods__card-empty');
  var cartLabel = document.querySelector('.main-header__basket');
  var deliverRadio = document.querySelector('.deliver__toggle');
  var cardNumberElement = document.querySelector('#payment__card-number');
  var paymentMethodRadio = document.querySelector('.payment');
  var cartCardTemplate = document.querySelector('#card-order').content.querySelector('.goods_card');

  var pickupForm = document.querySelector('.deliver__store');
  var pickupStoreId = 'deliver__store';

  var courierForm = document.querySelector('.deliver__courier');
  var courierStoreId = 'deliver__courier';

  var cardForm = document.querySelector('.payment__card-wrap');
  var cardId = 'payment__card';

  var cashForm = document.querySelector('.payment__cash-wrap');
  var cashId = 'payment__cash';

  var contactDataForm = document.querySelector('.contact-data__inner');

  var form = document.querySelector('form:nth-child(2)');
  var paymentCardDate = form.querySelector('#payment__card-date');

  var errorDialog = document.querySelector('.modal--error');
  var successDialog = document.querySelector('.modal--success');

  var deliverStoreList = document.querySelector('.deliver__store-list').querySelectorAll('input');
  var deliverStoreMap = document.querySelector('.deliver__store-map-img');

  function contains(elements, productName) {
    for (var i = 0; i < elements.length; i++) {
      if (elements[i].name.toUpperCase() === productName.toUpperCase()) {
        return i;
      }
    }
    return -1;
  }

  function removeCart(element) {
    element.innerHTML = '';
  }

  function createCartCard(product, cardOrderElement) {
    var image = cardOrderElement.querySelector('.card-order__img');

    image.src = product.picture;
    image.alt = product.name;

    cardOrderElement.querySelector('.card-order__title').textContent = product.name;
    cardOrderElement.querySelector('.card-order__price').textContent = product.price + ' ₽';

    return cardOrderElement;
  }

  function renderCartCards() {
    var sum = 0;
    var amount = 0;

    removeCart(productCardsElement);
    if (cartProducts.length === 0 || cartProducts === []) {
      productCardsElement.classList.add('goods__cards--empty');

      productCardsElement.appendChild(productCartEmpty);
      productCartEmpty.classList.remove('visually-hidden');

      cartLabel.textContent = 'В корзине ничего нет';

      disableAllCheckoutForms(true);
      return;
    }
    disableAllCheckoutForms(false);

    for (var i = 0; i < cartProducts.length; i++) {
      var cardOrderElement = cartCardTemplate.cloneNode(true);
      var cartProductAmountEl = cardOrderElement.querySelector('.card-order__count');
      var cartCard = createCartCard(cartProducts[i], cardOrderElement);

      cartProductAmountEl.value = cartProducts[i].cartAmount;
      cartProductAmountEl.name = cartProducts[i].name;

      cartFragment.appendChild(cartCard);
      amount = amount + cartProducts[i].cartAmount;
      sum = sum + cartProducts[i].price * cartProducts[i].cartAmount;
    }
    cartLabel.textContent = 'В корзине ' + amount + ' товара на ' + sum + '₽';

    productCardsElement.appendChild(cartFragment);
    productCardsElement.classList.remove('goods__cards--empty');
    productCartEmpty.classList.add('visually-hidden');
  }

  function addToCard(product) {
    if (product.amount < 1 || (!product)) {
      return;
    }

    var index = contains(cartProducts, product.name);
    if (index > -1) {
      cartProducts[index].cartAmount++;
    } else {
      var cartProduct = Object.assign({}, product);
      cartProduct.cartAmount = 1;
      cartProducts.push(cartProduct);
    }
    renderCartCards();
  }

  function deliverRadioToggle(event) {
    if (!event.target.id || cartProducts.length === 0 || cartProducts === []) {
      return;
    }

    if (event.target.id === pickupStoreId) {
      toggleFormVisibility(pickupForm, false);
      toggleFormVisibility(courierForm, true);
    }

    if (event.target.id === courierStoreId) {
      toggleFormVisibility(courierForm, false);
      toggleFormVisibility(pickupForm, true);
    }
  }

  function paymentRadioToggle(event) {
    if (!event.target.id || cartProducts.length === 0 || cartProducts === []) {
      return;
    }

    if (event.target.id === cardId) {
      toggleFormVisibility(cardForm, false);
      toggleFormVisibility(cashForm, true);
    }

    if (event.target.id === cashId) {
      toggleFormVisibility(cashForm, false);
      toggleFormVisibility(cardForm, true);
    }
  }

  function isCorrect(cardNumber) {
    var cardNumbers = cardNumber.split('').map(function (num, index) {
      var digit = parseInt(num, DECIMAL);

      if ((index + cardNumber.length) % EVEN_NUMBER_CHECK === 0) {
        var digitX2 = digit * LUHN_TIMES_NUMBER;

        return digitX2 > LUHN_MINUS_NUMBER ? digitX2 - LUHN_MINUS_NUMBER : digitX2;
      }

      return digit;
    });

    var result = cardNumbers.reduce(function (previousValue, currentValue) {
      return previousValue + currentValue;
    });

    return (result >= LUHN_CHECK_NUMBER && result % LUHN_CHECK_NUMBER === 0);
  }

  function keyUpHandler(evt) {
    if (evt.keyCode !== BACKSPACE) {
      if (paymentCardDate.value.length === MONTHS_NUMBER) {
        paymentCardDate.value += '/';
      }
    }
  }

  function formPost() {
    var successDialogClose = successDialog.querySelector('.modal__close');
    successDialog.classList.remove('modal--hidden');
    successDialogClose.addEventListener('click', function () {
      successDialog.classList.add('modal--hidden');
    });
    document.addEventListener('keydown', dialogClose);
  }

  function dialogClose() {
    successDialog.classList.add('modal--hidden');
    document.removeEventListener('keydown', dialogClose);
  }

  function showError(errorMessage) {
    var errorDialogMessage = errorDialog.querySelector('.modal__message');
    var errorDialogCloseBtn = errorDialog.querySelector('.modal__close');

    errorDialog.classList.remove('modal--hidden');
    errorDialogMessage.textContent = errorMessage;

    errorDialogCloseBtn.addEventListener('click', function () {
      errorDialog.classList.add('modal--hidden');
    });

    document.addEventListener('keydown', dialogClose);
  }

  function toggleFormVisibility(formElement, bool) {
    toggleFormDisability(formElement, !bool);

    if (bool) {
      formElement.classList.add('visually-hidden');
    } else {
      formElement.classList.remove('visually-hidden');
    }
  }

  function toggleFormDisability(formElement, bool) {
    var blockInputs = formElement.querySelectorAll('input');

    blockInputs.forEach(function (input, index) {
      blockInputs[index].disabled = bool;
    });
  }

  function changeAmount(increase, name) {
    var index = contains(cartProducts, name);
    if (index !== -1) {
      if (increase) {
        cartProducts[index].cartAmount++;
      } else {
        cartProducts[index].cartAmount--;
        if (cartProducts[index].cartAmount === 0) {
          cartProducts.splice(index, 1);
        }
      }
      renderCartCards();
    }
  }

  function deliverStoreChangeHandler() {
    deliverStoreList.forEach(function (radio) {
      if (radio.checked) {
        deliverStoreMap.src = 'img/map/' + radio.value + '.jpg';
      }
    });
  }

  function disableAllCheckoutForms(bool) {
    toggleFormDisability(courierForm, bool);
    toggleFormDisability(cashForm, bool);
    toggleFormDisability(pickupForm, bool);
    toggleFormDisability(cardForm, bool);
    toggleFormDisability(contactDataForm, bool);
  }

  return {
    addToCard: addToCard,

    onDeliverRadioChange: function () {
      deliverRadio.addEventListener('click', deliverRadioToggle, false);
    },

    onPaymentRadioChange: function () {
      paymentMethodRadio.addEventListener('click', paymentRadioToggle, false);
    },

    onFormChange: function () {
      disableAllCheckoutForms(true);

      var cartCardsWrap = document.querySelector('.goods__card-wrap');
      cartCardsWrap.addEventListener('click', function (evt) {
        if (evt.target.classList.contains('card-order__close')) {
          var index = contains(cartProducts, evt.target.nextElementSibling.innerText);
          if (index !== -1) {
            cartProducts.splice(index, 1);
            renderCartCards();
          }
        }
      });

      cartCardsWrap.addEventListener('click', function (evt) {
        if (evt.target.classList.contains('card-order__btn--decrease')) {
          changeAmount(false, evt.target.parentNode.parentNode.parentNode.childNodes[3].innerText);
        }
        if (evt.target.classList.contains('card-order__btn--increase')) {
          changeAmount(true, evt.target.parentNode.parentNode.parentNode.childNodes[3].innerText);
        }
      });

      cardNumberElement.addEventListener('change', function (evt) {
        return isCorrect(evt.target.value) ? cardNumberElement.setCustomValidity('') : cardNumberElement.setCustomValidity('Invalid card');
      });

      paymentCardDate.addEventListener('keyup', keyUpHandler);

      form.addEventListener('submit', function (evt) {
        window.loadModule.upload(new FormData(form), formPost, showError);
        document.querySelectorAll('input').forEach(function (inputElement) {
          inputElement.value = inputElement.defaultValue;
        });
        evt.preventDefault();
      });

      document.querySelector('.deliver__store-list').querySelectorAll('input').forEach(function (el) {
        el.addEventListener('change', deliverStoreChangeHandler);
      });
    }
  };
})();

window.cartModule = cartModule;
