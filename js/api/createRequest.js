/**
 * Основная функция для совершения запросов по Yandex API.
 * */
const createRequest = (options = {}) => {
  if (!options.url) {
    throw new Error('Missing URL parameter');
  }

  const xhr = new XMLHttpRequest();
  const method = options.method ? options.method.toUpperCase() : 'GET';
  let urlWithParams = options.url;

  // Добавляем параметры запроса для метода GET, если данные указаны
  if (method === 'GET' && options.data) {
    const params = new URLSearchParams(options.data);
    urlWithParams += `?${params}`;
  }

  // Назначаем свойству responseType значения 'json'
  xhr.responseType = 'json';

  // Открываем соединение
  xhr.open(method, urlWithParams);

  // Устанавливаем заголовки запроса
  if (options.headers) {
    for (const [header, value] of Object.entries(options.headers)) {
      xhr.setRequestHeader(header, value);
    }
  }

  // Устанавливаем обработчик события загрузки
  xhr.onload = function () {
    console.log('Response from server:', xhr.status, xhr.response);
    options.callback(xhr.response);
  };

  // Устанавливаем обработчик события ошибки
  xhr.onerror = function () {
    console.error('Request failed');
    options.callback(new Error('Request failed'));
  };

  // Отправляем запрос с данными (если они есть)
  console.log('Sending request:', method, urlWithParams);
  xhr.send(method === 'GET' ? null : JSON.stringify(options.data));
};