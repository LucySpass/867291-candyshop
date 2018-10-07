'use strict';

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

      var filters = 'mock data';
      _filterModule.onFilterChange(function () {
        _productModule.applyFilters(filters);
      });

      _productModule.addBtnClick(_cartModule.addToCard);

      _cartModule.onCardNumberChange();

      catalogCardsElement.classList.remove('catalog__cards--load');
      catalogLoadElement.classList.add('visually-hidden');
    }
  };
})({productModule: productModule, cartModule: cartModule, filterModule: filterModule});

initModule.main();
