'use strict';

var cartModule = (function () {
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
  var deliverStoreId = 'deliver__store';

  var courierForm = document.querySelector('.deliver__courier');
  var courierStoreId = 'deliver__courier';

  var cardForm = document.querySelector('.payment__card-wrap');
  var cardId = 'payment__card';

  var cashForm = document.querySelector('.payment__cash-wrap');
  var cashId = 'payment__cash';

  var form = document.querySelector('form:nth-child(2)');
  var paymentCardDate = form.querySelector('#payment__card-date');

  var errorDialog = document.querySelector('.modal--error');
  var successDialog = document.querySelector('.modal--success');

  function contains(array, productName) {
    for (var i = 0; i < array.length; i++) {
      if (array[i].name.toUpperCase() === productName.toUpperCase()) {
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
    removeCart(productCardsElement);
    if (cartProducts.length === 0 || cartProducts === []) {
      productCardsElement.classList.add('goods__cards--empty');
      productCartEmpty.classList.remove('visually-hidden');

      cartLabel.textContent = 'В корзине ничего нет';
      return;
    }

    var sum = 0;
    var amount = 0;

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
    if (!event.target.id) {
      return;
    }

    if (event.target.id === deliverStoreId) {
      toggleDisableForm(pickupForm, false);
      toggleDisableForm(courierForm, true);
    }

    if (event.target.id === courierStoreId) {
      toggleDisableForm(courierForm, false);
      toggleDisableForm(pickupForm, true);
    }
  }

  function paymentRadioToggle(event) {
    if (!event.target.id) {
      return;
    }

    if (event.target.id === cardId) {
      toggleDisableForm(cardForm, false);
      toggleDisableForm(cashForm, true);
    }

    if (event.target.id === cashId) {
      toggleDisableForm(cashForm, false);
      toggleDisableForm(cardForm, true);
    }
  }

  function isCorrect(cardNumber) {
    var arr = cardNumber.split('').map(function (num, index) {
      var digit = parseInt(num, 10);

      if ((index + cardNumber.length) % 2 === 0) {
        var digitX2 = digit * 2;

        return digitX2 > 9 ? digitX2 - 9 : digitX2;
      }

      return digit;
    });

    var result = arr.reduce(function (previousValue, currentValue) {
      return previousValue + currentValue;
    });

    return (result >= 10 && result % 10 === 0);
  }

  function keyupHandler(evt) {
    if (evt.keyCode !== 8) {
      if (paymentCardDate.value.length === 2) {
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

  function toggleDisableForm(formElement, bool) {
    var blockInputs = formElement.querySelectorAll('input');

    if (bool) {
      formElement.classList.add('visually-hidden');
    } else {
      formElement.classList.remove('visually-hidden');
    }

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

  return {
    addToCard: addToCard,

    onDeliverRadioChange: function () {
      deliverRadio.addEventListener('click', deliverRadioToggle, false);
    },

    onPaymentRadioChange: function () {
      paymentMethodRadio.addEventListener('click', paymentRadioToggle, false);
    },

    onFormChange: function () {
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

      // var cartProductAmount = document.querySelector('.card-order__amount');
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

      paymentCardDate.addEventListener('keyup', keyupHandler);

      form.addEventListener('submit', function (evt) {
        window.loadModule.contactServer('POST', formPost, showError, new FormData(form));
        document.querySelectorAll('input').forEach(function (inputElement) {
          inputElement.value = inputElement.defaultValue;
        });
        evt.preventDefault();
      });
    }
  };
})();

window.cartModule = cartModule;
