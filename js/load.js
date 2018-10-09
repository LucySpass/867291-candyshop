'use strict';

var loadModule = (function () {
  var CALLBACK_NAME = '__jsonpCallback';
  var DATA_URL = 'https://js.dump.academy/candyshop/data';
  var CANDY_SHOP_URL = 'https://js.dump.academy/candyshop';

  function load(onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responceType = 'json';
    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onLoad(xhr.response);
        CALLBACK_NAME = onLoad(xhr.response);
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

    xhr.timeout = 10000;

    xhr.open('GET', DATA_URL, true);
    xhr.send();
  }

  function upload(data, onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responceType = 'json';
    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
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
    xhr.open('POST', CANDY_SHOP_URL, true);
    xhr.send(data);
  }

  return {
    load: load,
    upload: upload,
    CALLBACK_NAME: CALLBACK_NAME,
    DATA_URL: DATA_URL
  };
})();

window.loadModule = loadModule;
