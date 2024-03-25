/**
 * Класс VK
 * Управляет изображениями из VK. С помощью VK API.
 * С помощью этого класса будет выполняться загрузка изображений из vk.
 * Имеет свойства ACCESS_TOKEN и lastCallback
 * */
class VK {

  static ACCESS_TOKEN = 'токен';
  static lastCallback;

  static get(id = '', callback) {

    // Создаем переданный колбек
    VK.lastCallback = callback;

    // Создаем тег script
    const script = document.createElement('script');
    script.src = `https://api.vk.com/method/photos.get?owner_id=${id}&access_token=${VK.ACCESS_TOKEN}&v=5.131&callback=VK.processData&album_id=wall`;

    // Добавляем созданный скрипт в тело документа
    document.body.appendChild(script);
  }

  /**
   * Обрабатывает ответ от сервера VK API
   * @param {object} result - Результат запроса VK API
   */
  /**
   * Передаётся в запрос VK API для обработки ответа.
   * Является обработчиком ответа от сервера.
   */
  static processData(result){
    console.log(result);

    try {
      // Удаляем тег script, добавленный для выполнения запроса
      const script = document.querySelector('script[src*="api.vk.com"]');
      script.parentNode.removeChild(script);

      // Обрабатываем ошибки в ответе
      if (result.error) {
        alert(`Ошибка VK API: ${result.error.error_msg}`);
        return;
      }

      // Находим самые крупные изображения из ответа и передайте их в колбек
      const images = result.response.items.map(item => item.sizes.pop().url);
      VK.lastCallback(images);

      // Обновляем свойство lastCallback на функцию-пустышку
      VK.lastCallback = () => {};
    } catch (error) {

      // Обрабатываем ошибки
      alert(`Ошибка обработки ответа: ${error.message}`);
    }
  }
}

