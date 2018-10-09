'use strict';

var utilModule = (function () {
  var catalogCardsElement = document.querySelector('.catalog__cards');
  var catalogLoadElement = document.querySelector('.catalog__load');

  return {
    main: function () {
      catalogCardsElement.classList.remove('catalog__cards--load');
      catalogLoadElement.classList.add('visually-hidden');
    }
  };
})();

utilModule.main();
