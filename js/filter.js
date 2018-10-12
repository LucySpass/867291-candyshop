'use strict';

var filterModule = (function () {
  var rangeMin = document.querySelector('.range__btn--left');
  var rangeMax = document.querySelector('.range__btn--right');
  var priceMin = document.querySelector('.range__price--min');
  var priceMax = document.querySelector('.range__price--max');
  var sliderLine = document.querySelector('.range__filter');
  var sliderFillLine = document.querySelector('.range__fill-line');

  var filters = {
    value: [],
    bool: [],
    more: '',
    sort: '',
    price: {min: 0, max: 0}
  };
  var minPrice = 0;
  var maxPrice = 245;

  var min = parseInt(getComputedStyle(rangeMin).left, 10);
  var max = parseInt(getComputedStyle(rangeMax).left, 10);
  var MIN = 0;
  var MAX = 245;
  var ELEMENT_WIDTH = 240;
  var sliderLineCoords = getCoords(sliderLine);

  var filterCallback;

  function rangeMaxMouseDownHandler(evt) {
    var elMaxCoords = getCoords(rangeMax);
    var shiftX = evt.pageX - elMaxCoords.left;
    document.addEventListener('mousemove', rangeMaxMouseMoveHandler);

    function rangeMaxMouseMoveHandler(e) {
      maxPrice = parseInt(max, 10);
      priceMax.textContent = maxPrice;

      filters.price.min = minPrice;
      filters.price.max = maxPrice;
      filterCallback(filters);

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
      minPrice = parseInt(min, 10);
      priceMin.textContent = minPrice;

      filters.price.min = minPrice;
      filters.price.max = maxPrice;

      filterCallback(filters);

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

  function arrContains(array, value) {
    var index = array.indexOf(value);
    if (index > -1) {
      array.splice(index, 1);
      return;
    }
    array.push(value);
  }

  function filtersBoolContains(value, bool) {
    if (filters.bool.length === 0) {
      filters.bool.push({name: value, bool: bool});
    } else {
      for (var i = 0; i < filters.bool.length; i++) {
        if (filters.bool[i].name === value) {
          filters.bool.splice(i, 1);
          return;
        }
      }
      filters.bool.push({name: value, bool: bool});
    }
  }

  function addFilterValue(value, array) {
    arrContains(array, value);
  }

  function addFilterBool(value) {
    switch (value) {
      case 'Без сахара':
        filtersBoolContains('sugar', false);
        break;
      case 'Безглютеновое':
        filtersBoolContains('gluten', false);
        break;
      case 'Вегетарианское':
        filtersBoolContains('vegetarian', true);
        break;
      case 'Только избранное':
        filtersBoolContains('favourite', true);
        break;
      default:
        break;
    }
  }

  function addFilterMore(value) {
    if (filters.more !== '') {
      filters.more = '';
    } else {
      filters.more = value;
    }
  }

  function addFilterSort(value) {
    var name;
    switch (value) {
      case 'Сначала популярные':
        name = 'rating.number';
        break;
      case 'Сначала дорогие':
        name = 'priceDown';
        break;
      case 'Сначала дешёвые':
        name = 'priceUp';
        break;
      case 'По рейтингу':
        name = 'rating.value';
        break;
      default:
        break;
    }
    filters.sort = name;
  }

  return {
    listenToPriceRadio: function () {
      rangeMin.addEventListener('mousedown', rangeMinMouseDownHandler);
      rangeMax.addEventListener('mousedown', rangeMaxMouseDownHandler);
    },
    onFilterChange: function (callback) {
      filterCallback = callback;

      var form = document.querySelector('form:nth-child(1)');
      form.addEventListener('change', function (evt) {
        var currFilter = evt.target.nextElementSibling.innerText;
        var currElementName = evt.target.name;

        filters.sort = 'rating.number';

        switch (currElementName) {
          case 'food-type':
            addFilterValue(currFilter, filters.value);
            break;
          case 'food-property':
            addFilterBool(currFilter);
            break;
          case 'mark':
            if (currFilter !== 'Только избранное') {
              addFilterMore(currFilter);
            } else {
              addFilterBool(currFilter);
            }
            break;
          case 'sort':
            addFilterSort(currFilter);
            break;
          default:
            break;
        }
        filterCallback(filters);

        /* evt.target.nextElementSibling.nextElementSibling.innerText = 'lala';
        [].forEach.call(form.children, function (elem) {
          if (elem.classList.contains('catalog__filter')) {
            console.log(elem);
            console.log(elem.querySelector('.input-btn__item-count'));
            var itemsCount = elem.querySelector('.input-btn__item-count');
            if (itemsCount !== null) {
              callback()
            }
          }
        });*/

      });
    }
  };
})();

window.filterModule = filterModule;
