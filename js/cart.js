'use strict';

var cartModule = (function () {
  var cartProducts = [];
  var cartFragment = document.createDocumentFragment();
  var productCardsElement = document.querySelector('.goods__cards');
  var productCartEmpty = document.querySelector('#cards-empty').content.querySelector('.goods__card-empty');
  var cartLabel = document.querySelector('.main-header__basket');
  var deliverRadio = document.querySelector('.deliver__toggle');
  var cardNumberElement = document.querySelector('#payment__card-number');

  var pickupForm = document.querySelector('.deliver__store');
  var deliverStoreId = 'deliver__store';

  var courierForm = document.querySelector('.deliver__courier');
  var courierStoreId = 'deliver__courier';

  var form = document.querySelector('form:nth-child(2)');
  var contactDataName = form.querySelector('#contact-data__name');
  var contactDataTel = form.querySelector('#contact-data__tel');
  var paymentCardNumber = form.querySelector('#payment__card-number');
  var paymentCardDate = form.querySelector('#payment__card-date');
  var paymentСardСVC = form.querySelector('#payment__card-cvc');
  var paymentCardholder = form.querySelector('#payment__cardholder');
  var deliverStreet = form.querySelector('#deliver_street');
  var deliverHouse = form.querySelector('#deliver_house');
  var deliverFloor = form.querySelector('#deliver__floor');
  var deliverRoom = form.querySelector('#deliver__room');

  function hide(element) {
    element.classList.add('visually-hidden');
  }

  function show(element) {
    element.classList.remove('visually-hidden');
  }

  function contains(array, product) {
    for (var i = 0; i < array.length; i++) {
      if (array[i].name === product.name) {
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

    if (cartProducts.length === 0) {
      productCardsElement.classList.add('goods__cards--empty');
      productCartEmpty.classList.remove('visually-hidden');

      cartLabel.textContent = 'В корзине ничего нет';
      return;
    }

    var sum = 0;
    var amount = 0;

    for (var i = 0; i < cartProducts.length; i++) {
      var cartCardTemplate = document.querySelector('#card-order').content.querySelector('.goods_card');
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

    var index = contains(cartProducts, product);
    if (index > -1) {
      cartProducts[index].cartAmount++;
    } else {
      var cartProduct = Object.assign({}, product);
      cartProduct.cartAmount = 1;
      cartProducts.push(cartProduct);
    }
    renderCartCards();
  }

  function radioToggle(event) {
    if (!event.target.id) {
      return;
    }

    if (event.target.id === deliverStoreId) {
      show(pickupForm);
      hide(courierForm);
    }

    if (event.target.id === courierStoreId) {
      show(courierForm);
      hide(pickupForm);
    }
  }

  function isCorrect(cardNumber) {
    var arr = cardNumber.split('').map(function (num, index) {
      var digit = parseInt(num, 10);
      if (index % 2 === 0) {

        return digit * 2 > 9 ? digit * 2 - 9 : digit * 2;
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

  return {
    addToCard: addToCard,

    onDeliverRadioChange: function () {
      deliverRadio.addEventListener('click', radioToggle, false);
    },

    onCardNumberChange: function () {
      cardNumberElement.addEventListener('change', function (evt) {
        return isCorrect(evt.target.value) ? cardNumberElement.setCustomValidity('') : cardNumberElement.setCustomValidity('Invalid form');
      });
    },

    onCartDateChange: function () {
      paymentCardDate.addEventListener('keyup', keyupHandler);
    }
  };
})();

window.cartModule = cartModule;
