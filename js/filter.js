'use strict';

var filterModule = (function () {
  var MIN = 0;
  var MAX = 245;
  var ELEMENT_WIDTH = 240;
  var DECIMAL = 10;
  var MIDDLE_DIVISION_NUMBER = 2;
  var NOT_FOUND_INDEX_NUMBER = -1;

  var minPrice = MIN;
  var maxPrice = MAX;

  var rangeMin = document.querySelector('.range__btn--left');
  var rangeMax = document.querySelector('.range__btn--right');
  var priceMin = document.querySelector('.range__price--min');
  var priceMax = document.querySelector('.range__price--max');
  var sliderLine = document.querySelector('.range__filter');
  var sliderFillLine = document.querySelector('.range__fill-line');
  var showAllBtn = document.querySelector('.catalog__submit');

  var form = document.querySelector('form:nth-child(1)');
  var sortingRadioButtons = form.querySelectorAll('.input-btn__input--radio');

  var initFilters = {
    value: [],
    bool: [],
    more: '',
    sort: 'rating.number',
    price: {min: MIN, max: MAX}
  };

  var filters = JSON.parse(JSON.stringify(initFilters));

  var min = parseInt(getComputedStyle(rangeMin).left, DECIMAL);
  var max = parseInt(getComputedStyle(rangeMax).left, DECIMAL);

  var sliderLineCoordinates = getCoordinates(sliderLine);
  var filterCallback;

  function rangeMaxMouseDownHandler(evt) {
    var shiftX = evt.pageX - getCoordinates(rangeMax).left;
    document.addEventListener('mousemove', rangeMaxMouseMoveHandler);

    function rangeMaxMouseMoveHandler(e) {
      maxPrice = parseInt(max, DECIMAL);
      priceMax.textContent = maxPrice;

      filters.price.min = minPrice;
      filters.price.max = maxPrice;
      filterCallback(filters);

      var newRight = e.pageX - shiftX - sliderLineCoordinates.left;
      if (newRight > MAX) {
        newRight = MAX;
      }
      if (newRight < min + rangeMin.offsetWidth / MIDDLE_DIVISION_NUMBER) {
        newRight = min + rangeMin.offsetWidth / MIDDLE_DIVISION_NUMBER;
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
    var shiftX = evt.pageX - getCoordinates(rangeMin).left;
    document.addEventListener('mousemove', rangeMinMouseMoveHandler);

    function rangeMinMouseMoveHandler(e) {
      minPrice = parseInt(min, DECIMAL);
      priceMin.textContent = minPrice;

      filters.price.min = minPrice;
      filters.price.max = maxPrice;

      filterCallback(filters);

      var newLeft = e.pageX - shiftX - sliderLineCoordinates.left;
      if (newLeft < MIN) {
        newLeft = MIN;
      }
      if (newLeft > max - rangeMax.offsetWidth / MIDDLE_DIVISION_NUMBER) {
        newLeft = max - rangeMax.offsetWidth / MIDDLE_DIVISION_NUMBER;
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

  function getCoordinates(elem) {
    var coordinatesElement = elem.getBoundingClientRect();
    return {
      top: coordinatesElement.top + pageYOffset,
      left: coordinatesElement.left + pageXOffset
    };
  }

  function arrContains(array, value) {
    var index = array.indexOf(value);
    if (index > NOT_FOUND_INDEX_NUMBER) {
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

  function resetPrice() {
    minPrice = MIN;
    maxPrice = MAX;

    rangeMin.style.left = MIN + 'px';
    sliderFillLine.style.left = MIN + 'px';

    rangeMax.style.left = MAX + 'px';
    sliderFillLine.style.right = ELEMENT_WIDTH - MAX + 'px';

    priceMax.textContent = maxPrice;
    priceMin.textContent = minPrice;
  }

  function resetFilters(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    filters = JSON.parse(JSON.stringify(initFilters));
    resetCheckbox();
    sortingRadioButtons[0].checked = true;

    resetPrice();

    filterCallback(filters);
  }

  function resetCheckbox() {
    var inputCheckbox = document.querySelectorAll('.input-btn__input--checkbox');
    inputCheckbox.forEach(function (checkbox) {
      checkbox.checked = false;
    });
  }

  return {
    listenToPriceRadio: function () {
      rangeMin.addEventListener('mousedown', rangeMinMouseDownHandler);
      rangeMax.addEventListener('mousedown', rangeMaxMouseDownHandler);
    },

    onFilterChange: function (callback) {
      filterCallback = callback;
      showAllBtn.addEventListener('click', resetFilters);

      form.addEventListener('change', function (evt) {
        var currFilter = evt.target.nextElementSibling.innerText;
        var currElementName = evt.target.name;

        switch (currElementName) {
          case 'food-type':
            addFilterValue(currFilter, filters.value);
            break;
          case 'food-property':
            addFilterBool(currFilter);
            break;
          case 'mark':
            filters = JSON.parse(JSON.stringify(initFilters));
            resetCheckbox();
            resetPrice();
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
      });
    }
  };
})();

window.filterModule = filterModule;
