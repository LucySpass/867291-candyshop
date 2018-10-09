'use strict';

var initModule = (function (options) {
  var _cartModule = options.cartModule;
  var _productModule = options.productModule;
  var _filterModule = options.filterModule;

  var catalogCardsElement = document.querySelector('.catalog__cards');
  var catalogLoadElement = document.querySelector('.catalog__load');

  return {
    main: function () {
      _cartModule.onDeliverRadioChange();
      _cartModule.onCardNumberChange();

      _productModule.generateProducts();
      _productModule.addBtnClick(_cartModule.addToCard);

      var filters = 'mock data';
      _filterModule.listenToPriceRadio();
      _filterModule.onFilterChange(function () {
        _productModule.applyFilters(filters);
      });

      catalogCardsElement.classList.remove('catalog__cards--load');
      catalogLoadElement.classList.add('visually-hidden');
    }
  };
})({cartModule: window.cartModule, productModule: window.productModule, filterModule: window.filterModule});

initModule.main();
