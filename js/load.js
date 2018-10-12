'use strict';

var loadModule = (function () {
  var DATA_URL = 'https://js.dump.academy/candyshop/data';
  var CANDY_SHOP_URL = 'https://js.dump.academy/candyshop';
  var HTTP_OK_CODE = 200;
  var TIMEOUT = 10000;

  function load(onLoad, onError) {
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

    xhr.open('GET', DATA_URL, true);
    xhr.send();
  }

  function upload(data, onLoad, onError) {
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
    xhr.open('POST', CANDY_SHOP_URL, true);
    xhr.send(data);
  }

  return {
    load: load,
    upload: upload
  };
})();

window.loadModule = loadModule;
