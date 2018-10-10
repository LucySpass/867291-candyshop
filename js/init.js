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

      _loadModule.contactServer('GET', _productModule.getProducts, _productModule.showError);

      _productModule.addBtnClick(_cartModule.addToCard);

      var filters = 'mock data';
      _filterModule.listenToPriceRadio();
      _filterModule.onFilterChange(function () {
        _productModule.applyFilters(filters);
      });

      var loader = document.createElement('script');
      loader.src = _loadModule.DATA_URL + '?callback=' + _loadModule.CALLBACK_NAME;
      document.body.append(loader);
    }
  };
})({
  cartModule: window.cartModule,
  productModule: window.productModule,
  filterModule: window.filterModule,
  loadModule: window.loadModule
});

initModule.main();
