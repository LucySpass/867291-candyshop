'use strict';

var initModule = (function (options) {
  var _cartModule = options.cartModule;
  var _productModule = options.productModule;
  var _filterModule = options.filterModule;
  var _utilModule = options.utilModule;

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

      _utilModule.resolveClasses();
    }
  };
})({
  cartModule: window.cartModule,
  productModule: window.productModule,
  filterModule: window.filterModule,
  utilModule: window.utilModule
});

initModule.main();
