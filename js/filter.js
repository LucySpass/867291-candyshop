'use strict';

var filterModule = (function () {
  var rangeMin = document.querySelector('.range__btn--left');
  var rangeMax = document.querySelector('.range__btn--right');
  var priceMin = document.querySelector('.range__price--min');
  var priceMax = document.querySelector('.range__price--max');
  var sliderLine = document.querySelector('.range__filter');
  var sliderFillLine = document.querySelector('.range__fill-line');

  var filters = [];
  var minPrice = 0;
  var maxPrice = 260;
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
      maxPrice = parseInt(max, 10);
      priceMax.textContent = maxPrice;
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

  function checkForSort(sortName) {

  }

  return {
    listenToPriceRadio: function () {
      rangeMin.addEventListener('mousedown', rangeMinMouseDownHandler);
      rangeMax.addEventListener('mousedown', rangeMaxMouseDownHandler);
    },
    onFilterChange: function (callback) {
      var form = document.querySelector('form:nth-child(1)');
      form.addEventListener('change', function (evt) {
        var currFilter = evt.target.nextElementSibling.innerText;
        console.log(currFilter);
        console.log(evt.target.name);
        console.log(evt.target.classList);

        filters[0] = ({
          price: {
            minPrice: minPrice,
            maxPrice: maxPrice
          }
        });
        var currFilterIndex = filters.indexOf(currFilter);

        switch (evt.target.name) {
          case 'food-type':
            var
            break;
          case 'food-property':
            break;
          case 'mark':
            break;
          case 'sort':
            break;
          default:
            break;
        }


        // var currFilterIndex = filters.indexOf(currFilter);

        // if(evt.target.name === )

        if (currFilterIndex > -1) {
          filters.splice(currFilterIndex, 1);
        } else {
          filters.push(currFilter);
        }

        console.log(filters);

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
      callback('lallala');
      // filterCallback = callback;
    }
  };
})();

window.filterModule = filterModule;
