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

  function getAmountClass(element, amount) {
    if (amount < AMOUNT_MIDDLE) {
      element.classList.remove('card--in-stock');
      element.classList.add(amount === 0 ? 'card--soon' : 'card--little');
    }
  }

  function getRating(element, good) {
    var ratingElem = element.querySelector('.stars__rating');

    if (good.rating.value !== RATING_NUMBER) {
      ratingElem.classList.remove('stars__rating--five');
      ratingElem.classList.add('stars__rating--' + VALUES[good.rating.value]);
    }
  }

  function renderCard(product) {
    var cardTemplate = document.querySelector('#card').content.querySelector('.catalog__card');
    var cardElement = cardTemplate.cloneNode(true);
    var picture = cardElement.querySelector('.card__img');
    var price = cardElement.querySelector('.card__price');
    var favoriteBtn = cardElement.querySelector('.card__btn-favorite');
    var addBtn = cardElement.querySelector('.card__btn');

    if (product.favourite) {
      favoriteBtn.classList.add('card__btn-favorite--selected');
    }

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

  function renderCards(cards) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < cards.length; i++) {
      fragment.appendChild(renderCard(cards[i]));
    }
    catalogCardsElement.appendChild(fragment);
  }

  function showFilterError() {
    var blockEmptyFilter = document.querySelector('#empty-filters').content.querySelector('.catalog__empty-filter');
    var emptyFilter = blockEmptyFilter.cloneNode(true);
    catalogCardsElement.appendChild(emptyFilter);
  }

  function filterProducts(filters) {
    catalogCardsElement.innerHTML = '';

    var filteredProducts = products;
    for (var i = 0; i < Object.keys(filters).length; i++) {
      var filterName = Object.keys(filters)[i];

      switch (filterName) {
        case 'value':
          if (filters[filterName].length > 0) {
            filteredProducts = filteredProducts.filter(function (product) {
              var flag = false;
              filters[filterName].forEach(function (filter) {
                flag = flag || product.kind === filter;
              });
              return flag;
            });
            continue;
          }
          break;
        case 'bool':
          if (filters[filterName].length > 0) {
            filteredProducts = filteredProducts.filter(function (product) {
              var flag = false;
              filters[filterName].forEach(function (filter) {
                if (filter.name === 'favourite') {
                  flag = flag || product.favourite === filter.bool;
                } else {
                  flag = flag || product.nutritionFacts[filter.name] === filter.bool;
                }
              });
              return flag;
            });
            continue;
          }
          break;
        case 'more':
          if (filters[filterName] !== '') {
            filteredProducts = filteredProducts.filter(function (product) {
              return product.amount > 0;
            });
            continue;
          }
          break;
        case 'sort':
          switch (filters[filterName]) {
            case 'rating.number':
              filteredProducts = filteredProducts.sort(function (a, b) {
                return b.rating.number - a.rating.number;
              });
              break;
            case 'priceDown':
              filteredProducts = filteredProducts.sort(function (a, b) {
                return b.price - a.price;
              });
              break;
            case 'priceUp':
              filteredProducts = filteredProducts.sort(function (a, b) {
                return a.price - b.price;
              });
              break;
            case 'rating.value':
              filteredProducts = filteredProducts.sort(function (a, b) {
                return b.rating.value - a.rating.value;
              });
              break;
          }
          continue;
        case 'price':
          filteredProducts = filteredProducts.filter(function (product) {
            return product.price >= filters.price.min && product.price <= filters.price.max;
          });
          break;
      }
    }
    renderCards(filteredProducts);

    if (filteredProducts === [] || filteredProducts.length === 0) {
      showFilterError();
    }
  }

  return {
    getProducts: function (serverProducts) {
      var catalogLoad = document.querySelector('.catalog__load');

      catalogCardsElement.classList.remove('catalog__cards--load');
      catalogLoad.classList.add('visually-hidden');

      products = JSON.parse(serverProducts);
      products.forEach(function (product) {
        product.picture = SRC + product.picture;
      });
      renderCards(products);
    },

    showError: showError,

    applyFilters: function (filters) {
      filterProducts(filters);
    },

    addBtnClick: function (callback) {
      catalogCardsElement.addEventListener('click', function (event) {
        if (event.target.classList.contains('card__btn')) {
          var additionProduct = products.filter(function (product) {
            if (product.name === event.target.dataset.cartproductname) {
              return product;
            }
            return null;
          });
          callback(additionProduct[0]);
        }
      });
    }
  };
})();

window.productModule = productModule;
