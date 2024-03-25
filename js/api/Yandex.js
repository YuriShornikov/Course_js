
/**
 * Класс Yandex
 * Используется для управления облаком.
 * Имеет свойство HOST
 * */
class Yandex {
  static HOST = 'https://cloud-api.yandex.net/v1/disk';

  /**
   * Метод формирования и сохранения токена для Yandex API
   */
  static getToken() {
    // Проверяем, есть ли токен в локальном хранилище
    return 'токен';
  }

  /**
   * Метод загрузки файла в облако
   */
   static uploadFile(filePath, url, callback) {
    console.log('Отправка запроса на загрузку файла на сервер Яндекс.Диска:', filePath, url);

    const token = this.getToken();

    if (!token) {
        console.error('Не удалось получить токен авторизации.');
        return;
    }

    if (!filePath || !url) {
        console.error('Отсутствует путь или URL файла.');
        return;
    }

    // Формируем данные для запроса
    const requestData = {
        path: filePath,
        url,
    };

    // Выполняем запрос на загрузку файла
    createRequest({
      method: 'POST',
      url: `${this.HOST}/resources/upload?path=${encodeURIComponent(filePath)}&url=${encodeURIComponent(url)}`,
      headers: {
          'Authorization': `OAuth ${token}`,
      },

      callback: (response) => {
        if (response.error) {
            console.error('Ошибка при загрузке файла на Яндекс.Диск:', response.error);
            callback(response.error);
        } else {
            console.log('Ответ от сервера Яндекс.Диска на запрос загрузки файла:', response);
            callback(null, response);
        }
      }
    })
  }

  /**
   * Метод удаления файла из облака
   */
  static removeFile(path, callback){
    console.log(path)

    const token = this.getToken();

    // Выполняем запрос на удаление файла
    createRequest({
      method: 'DELETE',
      url: `${this.HOST}/resources?path=${encodeURIComponent(path)}`,
      headers: {
        'Authorization': `OAuth ${token}`,
      },
      callback: (response) => {
        if (typeof callback === 'function') {
          if (response && response.status === 204) {
            callback();
          } else {
            callback('Ошибка при удалении файла с Яндекс.Диска. Некорректный ответ', null);
          }
        }
      }
    })
  }

  /**
   * Метод получения последних загруженных 50 фото
   */
  static getUploadedFiles(callback){

    const token = this.getToken();

    // Выполняем запрос на получение списка файлов
    createRequest({
      method: 'GET',
      url: `${this.HOST}/resources/files?media_type=image&limit=50&sort=-created`,
      headers: {
        'Authorization': `OAuth ${token}`,
        'Content-Type': 'application/json',
      },
      callback: response => {

        // Обрабатываем ответ
        if (response.error) {
            console.error('Ошибка при получении списка файлов с Яндекс.Диска:', response.error);
            callback([]);
        } else {
            callback(response.items);
        }
      }
    })
  }

  static downloadFileByUrl(url){
    const link = document.createElement('a');
    link.href = url;
    link.click()
  };
}
