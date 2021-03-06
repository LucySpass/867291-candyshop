'use strict';

var initModule = (function (options) {
  var _cartModule = options.cartModule;
  var _productModule = options.productModule;
  var _filterModule = options.filterModule;
  var _loadModule = options.loadModule;

  return {
    main: function () {
      _cartModule.onDeliverRadioChange();
      _cartModule.onPaymentRadioChange();
      _cartModule.onFormChange();

      _loadModule.load(_productModule.getProducts, _productModule.showError);

      _productModule.addBtnClick(_cartModule.addToCard);

      _filterModule.listenToPriceRadio();
      _filterModule.onFilterChange(_productModule.applyFilters);
    }
  };
})({
  cartModule: window.cartModule,
  productModule: window.productModule,
  filterModule: window.filterModule,
  loadModule: window.loadModule
});

initModule.main();
