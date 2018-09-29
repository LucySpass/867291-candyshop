'use strict';

var PRODUCTS_AMOUNT = 26;
var CART_PRODUCTS_AMOUNT = 3;
var RATING_NUMBER = 5;
var AMOUNT_MIDDLE = 5;
var SRC = 'img/cards/';

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
    'виллабаджо',
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
  'Острый язычок',
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
  'soda-russian.jpg',
];


var VALUES = [
  'one', 'two', 'three', 'four', 'five'
];

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

function getRandomNumberInRange(obj) {
  return Math.floor(Math.random() * (obj.max - obj.min + 1)) + obj.min;
}

function generateProduct() {
  return {
    name: getValueInArray(NAMES),
    picture: SRC + getValueInArray(PICTURES),
    amount: getRandomNumberInRange(AMOUNT),
    price: getRandomNumberInRange(PRICE),
    weight: getRandomNumberInRange(WEIGHT),
    rating: {
      value: getRandomNumberInRange(RATING.VALUES),
      number: getRandomNumberInRange(RATING.RATINGS),
    },
    nutritionFacts: {
      sugar: getRandomNumberInRange(NUTRITION_FACTS.SUGAR),
      energy: getRandomNumberInRange(NUTRITION_FACTS.ENERGY),
      contents: getRandomArrayValue(NUTRITION_FACTS.CONTENTS)
    }
  };
}

function getAmountClass(element, amount) {
  if (amount < 5) {
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

  cardTemplate.classList.add(getAmountClass(product.amount));
  getAmountClass(cardTemplate, product.amount);

  var cardElement = cardTemplate.cloneNode(true);

  cardElement.querySelector('.card__title').textContent = product.name;

  var picture = cardElement.querySelector('.card__img');
  picture.src = product.picture;
  picture.alt = product.name;

  var price = cardElement.querySelector('.card__price');
  price.childNodes[0].textContent = product.price + ' ';
  price.childNodes[2].textContent = '/ ' + product.weight + ' Г';

  getRating(cardElement, product);

  cardElement.querySelector('.star__count').textContent = product.rating.number;

  cardElement.querySelector('.card__characteristic').textContent =
    (!product.nutritionFacts.sugar ? 'Без сахара' : 'Содержит сахар') +
    product.nutritionFacts.energy + ' ккал';

  cardElement.querySelector('.card__composition-list').textContent = product.nutritionFacts.contents;
  return cardElement;
}

function renderCartCard(product) {
  var cartCardTemplate = document.querySelector('#card-order')
    .content
    .querySelector('.goods_card');

  var cardOrderElement = cartCardTemplate.cloneNode(true);
  cardOrderElement.querySelector('.card-order__title').textContent = product.name;

  var image = cardOrderElement.querySelector('.card-order__img');
  image.src = product.picture;
  image.alt = product.name;

  cardOrderElement.querySelector('.card-order__price').textContent = product.price + ' ₽';

  return cardOrderElement;
}


function main() {
  document.querySelector('.catalog__cards').classList.remove('catalog__cards--load');
  document.querySelector('.catalog__load').classList.add('visually-hidden');

  var fragment = document.createDocumentFragment();
  var products = [];

  for (var i = 0; i < PRODUCTS_AMOUNT; i++) {
    products.push(generateProduct());
    fragment.appendChild(renderCard(products[i]));
  }
  document.querySelector('.catalog__cards').appendChild(fragment);

  var cartFragment = document.createDocumentFragment();
  for (var j = 0; j < CART_PRODUCTS_AMOUNT; j++) {
    cartFragment.appendChild(renderCartCard(getValueInArray(products)));
  }
  var goodCardsElement = document.querySelector('.goods__cards');
  goodCardsElement.classList.remove('goods__cards--empty');

  goodCardsElement.appendChild(cartFragment);

  document.querySelector('.goods__card-empty').classList.add('visually-hidden');
}

main();
