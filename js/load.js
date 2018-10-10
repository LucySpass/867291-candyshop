'use strict';

var loadModule = (function () {
  var DATA_URL = 'https://js.dump.academy/candyshop/data';
  var CANDY_SHOP_URL = 'https://js.dump.academy/candyshop';
  var HTTP_OK_CODE = 200;
  var TIMEOUT = 10000;

  function contactServer(requestType, onLoad, onError, data) {
    var xhr = new XMLHttpRequest();
    xhr.responceType = 'json';
    xhr.addEventListener('load', function () {
      if (xhr.status === HTTP_OK_CODE) {
        onLoad(xhr.response);
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = TIMEOUT;
    if (requestType === 'GET') {
      xhr.open('GET', DATA_URL, true);
      xhr.send();
    } else if (requestType === 'POST') {
      xhr.open('POST', CANDY_SHOP_URL, true);
      xhr.send(data);
    }
  }


  return {
    contactServer: contactServer,
    DATA_URL: DATA_URL
  };
})();

window.loadModule = loadModule;
