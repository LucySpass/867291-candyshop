'use strict';

function getValueInArray(array) {
  return deleteUsedArrayValue(array, getRandomArrayValue(array));
}

function getRandomArrayValue(array) {
  var index = Math.floor(Math.random() * array.length);
  return array[index];
}

function deleteUsedArrayValue(array, value) {
  array.splice(array.indexOf(value), 1);
  return value;
}

var cartModule = (function () {
  var cartProducts = [];
  var cartFragment = document.createDocumentFragment();
  var productCardsElement = document.querySelector('.goods__cards');
  var productCartEmpty = document.querySelector('#cards-empty').content.querySelector('.goods__card-empty');
  var cartLabel = document.querySelector('.main-header__basket');
  var deliverRadio = document.querySelector('.deliver__toggle');
  var paymentMethodRadio = document.querySelector('.payment');

  var pickupForm = document.querySelector('.deliver__store');
  var deliverStoreId = 'deliver__store';

  var courierForm = document.querySelector('.deliver__courier');
  var courierStoreId = 'deliver__courier';

  var cardForm = document.querySelector('.payment__card-wrap');
  var cardId = 'payment__card';

  var cashForm = document.querySelector('.payment__cash-wrap');
  var cashId = 'payment__cash';

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
    if (product.amount < 1) {
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

  function deliverRadioToggle(event) {
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

  function paymentRadioToggle(event) {
    if (!event.target.id) {
      return;
    }

    if (event.target.id === cardId) {
      show(cardForm);
      hide(cashForm);
    }

    if (event.target.id === cashId) {
      show(cashForm);
      hide(cardForm);
    }
  }

  return {
    addToCard: function (product) {
      addToCard(product);
    },

    onDeliverRadioChange: function () {
      deliverRadio.addEventListener('click', deliverRadioToggle, false);
    },

    onPaymentRadioChange: function () {
      paymentMethodRadio.addEventListener('click', paymentRadioToggle, false);
    }
  };
})();

var productModule = (function () {
  var RATING_NUMBER = 5;
  var AMOUNT_MIDDLE = 5;
  var SRC = 'img/cards/';
  var products = [];

  var VALUES = [
    'one', 'two', 'three', 'four', 'five'
  ];

  var AMOUNT = {
    min: 0, max: 20
  };

  var PRICE = {
    min: 100, max: 1500
  };

  var WEIGHT = {
    min: 30, max: 300
  };

  var RATING = {
    VALUES: {
      min: 1, max: 5
    },
    RATINGS: {
      min: 10, max: 900
    }
  };

  var NUTRITION_FACTS = {
    SUGAR: {
      min: 0, max: 1
    },
    ENERGY: {
      min: 70, max: 500
    },
    CONTENTS: [
      'молоко',
      'сливки',
      'вода',
      'пищевой краситель',
      'патока',
      'ароматизатор бекона',
      'ароматизатор свинца',
      'ароматизатор дуба, идентичный натуральному',
      'ароматизатор картофеля',
      'лимонная кислота',
      'лимонная кислота',
      'эмульгатор',
      'консервант: сорбат калия',
      'посолочная смесь: соль, нитрит натрия',
      'ксилит',
      'карбамид',
      'вилларибо',
      'виллабаджо'
    ]
  };

  var NAMES = [
    'Чесночные сливки',
    'Огуречный педант',
    'Молочная хрюша',
    'Грибной шейк',
    'Баклажановое безумие',
    'Паприколу итальяно',
    'Нинзя-удар васаби',
    'Хитрый баклажан',
    'Горчичный вызов',
    'Кедровая липучка',
    'Корманный портвейн',
    'Чилийский задира',
    'Беконовый взрыв',
    'Арахис vs виноград',
    'Сельдерейная душа',
    'Початок в бутылке',
    'Чернющий мистер чеснок',
    'Раша федераша',
    'Кислая мина',
    'Кукурузное утро',
    'Икорный фуршет',
    'Новогоднее настроение',
    'С пивком потянет',
    'Мисс креветка',
    'Бесконечный взрыв',
    'Невинные винные',
    'Бельгийское пенное',
    'Острый язычок'
  ];

  var PICTURES = [
    'gum-cedar.jpg',
    'gum-chile.jpg',
    'gum-eggplant.jpg',
    'gum-mustard.jpg',
    'gum-portwine.jpg',
    'gum-wasabi.jpg',
    'ice-eggplant.jpg',
    'ice-cucumber.jpg',
    'ice-garlic.jpg',
    'ice-italian.jpg',
    'ice-mushroom.jpg',
    'ice-pig.jpg',
    'marmalade-beer.jpg',
    'marmalade-caviar.jpg',
    'marmalade-corn.jpg',
    'marmalade-new-year.jpg',
    'marmalade-sour.jpg',
    'marshmallow-bacon.jpg',
    'marshmallow-beer.jpg',
    'marshmallow-shrimp.jpg',
    'marshmallow-spicy.jpg',
    'marshmallow-wine.jpg',
    'soda-bacon.jpg',
    'soda-celery.jpg',
    'soda-cob.jpg',
    'soda-garlic.jpg',
    'soda-peanut-grapes.jpg',
    'soda-russian.jpg'
  ];

  var PRODUCTS_AMOUNT = 26;
  var catalogCardsElement = document.querySelector('.catalog__cards');

  // var filters;

  function getRandomNumberInRange(obj) {
    return Math.floor(Math.random() * (obj.max - obj.min + 1)) + obj.min;
  }

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

  function generateProduct() {
    return {
      name: getValueInArray(NAMES),
      picture: SRC + getValueInArray(PICTURES),
      amount: getRandomNumberInRange(AMOUNT),
      price: getRandomNumberInRange(PRICE),
      weight: getRandomNumberInRange(WEIGHT),
      rating: {
        value: getRandomNumberInRange(RATING.VALUES),
        number: getRandomNumberInRange(RATING.RATINGS)
      },
      nutritionFacts: {
        sugar: getRandomNumberInRange(NUTRITION_FACTS.SUGAR),
        energy: getRandomNumberInRange(NUTRITION_FACTS.ENERGY),
        contents: getRandomArrayValue(NUTRITION_FACTS.CONTENTS)
      }
    };
  }

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
      return favoriteBtn.classList.contains('card__btn-favorite--selected') ?
        favoriteBtn.classList.remove('card__btn-favorite--selected') :
        favoriteBtn.classList.add('card__btn-favorite--selected');
    });

    addBtn.dataset.cartproductname = product.name;

    return cardElement;
  }

  return {
    generateProducts: function () {
      var fragment = document.createDocumentFragment();
      for (var i = 0; i < PRODUCTS_AMOUNT; i++) {
        products.push(generateProduct());
        fragment.appendChild(renderCard(products[i]));
      }
      catalogCardsElement.appendChild(fragment);
    },

    applyFilters: function (/* data*/) {
      // filters = data;
    },

    addBtnClick: function (callback) {
      catalogCardsElement.addEventListener('click', function (event) {
        var productArray = products.filter(function (product) {
          if (product.name === event.target.dataset.cartproductname) {
            return product;
          }
          return null;
        });
        callback(productArray[0]);
      });
    }
  };
})();

var filterModule = (function () {
  var rangeMin = document.querySelector('.range__btn--left');
  var rangeMax = document.querySelector('.range__btn--right');
  var priceMin = document.querySelector('.range__price--min');
  var priceMax = document.querySelector('.range__price--max');
  var sliderLine = document.querySelector('.range__filter');
  var sliderFillLine = document.querySelector('.range__fill-line');
  // var filterCallback;

  var min = parseInt(getComputedStyle(rangeMin).left, 10);
  var max = parseInt(getComputedStyle(rangeMax).left, 10);
  var MIN = 0;
  var MAX = 245;
  var ELEMENT_WIDTH = 240;
  var sliderLineCoords = getCoords(sliderLine);

  function rangeMaxMouseDownHandler(evt) {
    var elMaxCoords = getCoords(rangeMax);
    var shiftX = evt.pageX - elMaxCoords.left;
    document.addEventListener('mousemove', rangeMaxMouseMoveHandler);

    function rangeMaxMouseMoveHandler(e) {
      priceMax.textContent = parseInt(max, 10);

      var newRight = e.pageX - shiftX - sliderLineCoords.left;
      if (newRight > MAX) {
        newRight = MAX;
      }
      if (newRight < min + rangeMin.offsetWidth / 2) {
        newRight = min + rangeMin.offsetWidth / 2;
      }
      max = newRight;
      rangeMax.style.left = newRight + 'px';
      sliderFillLine.style.right = ELEMENT_WIDTH - newRight + 'px';
    }

    function rangeMaxMouseUpHandler() {
      document.removeEventListener('mousemove', rangeMaxMouseMoveHandler);
      document.removeEventListener('mouseup', rangeMaxMouseUpHandler);
    }

    document.addEventListener('mouseup', rangeMaxMouseUpHandler);
  }

  function rangeMinMouseDownHandler(evt) {
    var elMinCoords = getCoords(rangeMin);
    var shiftX = evt.pageX - elMinCoords.left;
    document.addEventListener('mousemove', rangeMinMouseMoveHandler);

    function rangeMinMouseMoveHandler(e) {
      priceMin.textContent = parseInt(min, 10);
      var newLeft = e.pageX - shiftX - sliderLineCoords.left;
      if (newLeft < MIN) {
        newLeft = MIN;
      }
      if (newLeft > max - rangeMax.offsetWidth / 2) {
        newLeft = max - rangeMax.offsetWidth / 2;
      }
      min = newLeft;
      rangeMin.style.left = newLeft + 'px';
      sliderFillLine.style.left = newLeft + 'px';
    }

    function rangeMinMouseUpHandler() {
      document.removeEventListener('mousemove', rangeMinMouseMoveHandler);
      document.removeEventListener('mouseup', rangeMinMouseUpHandler);
    }

    document.addEventListener('mouseup', rangeMinMouseUpHandler);
  }

  function getCoords(elem) {
    var elCoords = elem.getBoundingClientRect();
    return {
      top: elCoords.top + pageYOffset,
      left: elCoords.left + pageXOffset
    };
  }

  return {
    listenToPriceRadio: function () {
      rangeMin.addEventListener('mousedown', rangeMinMouseDownHandler);
      rangeMax.addEventListener('mousedown', rangeMaxMouseDownHandler);
    },
    onFilterChange: function (/* callback*/) {
      // filterCallback = callback;
    }
  };
})();

var initModule = (function (options) {
  var _cartModule = options.cartModule;
  var _filterModule = options.filterModule;
  var _productModule = options.productModule;

  var catalogCardsElement = document.querySelector('.catalog__cards');
  var catalogLoadElement = document.querySelector('.catalog__load');

  return {
    main: function () {
      _productModule.generateProducts();
      _filterModule.listenToPriceRadio();

      _cartModule.onDeliverRadioChange();
      _cartModule.onPaymentRadioChange();

      var filters = 'mock data';
      _filterModule.onFilterChange(function () {
        _productModule.applyFilters(filters);
      });

      _productModule.addBtnClick(_cartModule.addToCard);


      catalogCardsElement.classList.remove('catalog__cards--load');
      catalogLoadElement.classList.add('visually-hidden');
    }
  };
})({productModule: productModule, cartModule: cartModule, filterModule: filterModule});

initModule.main();
