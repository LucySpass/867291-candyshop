'use strict';

var productModule = (function () {
  var RATING_NUMBER = 5;
  var AMOUNT_MIDDLE = 5;
  var SRC = 'img/cards/';
  var products = [];
  var errorDialog = document.querySelector('.modal--error');
  var ESC_KEYCODE = 27;

  var VALUES = [
    'one', 'two', 'three', 'four', 'five'
  ];

  var catalogCardsElement = document.querySelector('.catalog__cards');

  function errorDialogClose(evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      errorDialog.classList.add('modal--hidden');
      document.removeEventListener('keydown', errorDialogClose);
    }
  }

  // var filters;

  function getAmountClass(element, amount) {
    if (amount < AMOUNT_MIDDLE) {
      element.classList.remove('card--in-stock');
      element.classList.add(amount === 0 ? 'card--soon' : 'card--little');
    }
  }

  var getRating = function (element, good) {
    var ratingElem = element.querySelector('.stars__rating');

    if (good.rating.value !== RATING_NUMBER) {
      ratingElem.classList.remove('stars__rating--five');
      ratingElem.classList.add('stars__rating--' + VALUES[good.rating.value]);
    }
  };

  function renderCard(product) {
    var cardTemplate = document.querySelector('#card').content.querySelector('.catalog__card');
    var cardElement = cardTemplate.cloneNode(true);
    var picture = cardElement.querySelector('.card__img');
    var price = cardElement.querySelector('.card__price');
    var favoriteBtn = cardElement.querySelector('.card__btn-favorite');
    var addBtn = cardElement.querySelector('.card__btn');

    getAmountClass(cardTemplate, product.amount);

    cardElement.querySelector('.card__title').textContent = product.name;

    picture.src = product.picture;
    picture.alt = product.name;

    price.childNodes[0].textContent = product.price + ' ';
    price.childNodes[2].textContent = '/ ' + product.weight + ' Г';

    getRating(cardElement, product);

    cardElement.querySelector('.star__count').textContent = product.rating.number;

    cardElement.querySelector('.card__characteristic').textContent =
      (!product.nutritionFacts.sugar ? 'Без сахара' : 'Содержит сахар') +
      product.nutritionFacts.energy + ' ккал';

    cardElement.querySelector('.card__composition-list').textContent = product.nutritionFacts.contents;

    favoriteBtn.addEventListener('click', function () {
      product.favourite = !favoriteBtn.classList.contains('card__btn-favorite--selected');

      if (favoriteBtn.classList.contains('card__btn-favorite--selected')) {
        favoriteBtn.classList.remove('card__btn-favorite--selected');
      } else {
        favoriteBtn.classList.add('card__btn-favorite--selected');
      }
      renderCard(product);
    });

    addBtn.dataset.cartproductname = product.name;
    return cardElement;
  }

  function showError(error) {
    var errorDialogMessage = errorDialog.querySelector('.modal__message');
    var closeDialogBtn = errorDialog.querySelector('.modal__close');

    errorDialog.classList.remove('modal--hidden');
    errorDialogMessage.textContent = error;

    closeDialogBtn.addEventListener('click', function () {
      errorDialog.classList.add('modal--hidden');
      document.removeEventListener('keydown', errorDialogClose);
    });

    document.addEventListener('keydown', errorDialogClose);
  }

  return {
    getProducts: function (serverProducts) {
      var catalogLoad = document.querySelector('.catalog__load');

      catalogCardsElement.classList.remove('catalog__cards--load');
      catalogLoad.classList.add('visually-hidden');

      products = JSON.parse(serverProducts);
      console.log(products);
      products.forEach(function (product) {
        product.picture = SRC + product.picture;
      });

      var fragment = document.createDocumentFragment();
      for (var i = 0; i < products.length; i++) {
        fragment.appendChild(renderCard(products[i]));
      }
      catalogCardsElement.appendChild(fragment);
    },

    showError: showError,

    applyFilters: function (data) {
      console.log(data);
      // filters = data;
    },

    addBtnClick: function (callback) {
      catalogCardsElement.addEventListener('click', function (event) {
        if (event.target.classList.contains('card__btn')) {
          var productArray = products.filter(function (product) {
            if (product.name === event.target.dataset.cartproductname) {
              return product;
            }
            return null;
          });
          callback(productArray[0]);
        }
      });
    }
  };
})();

window.productModule = productModule;
