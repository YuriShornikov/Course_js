/**
 * Класс PreviewModal
 * Используется как обозреватель загруженный файлов в облако
 */


 class PreviewModal extends BaseModal {
  constructor(element) {
    // Вызываем конструктор родителя
    super(element);

    // Получаем ссылку на элемент модального окна
    this.modal = this.modalElement;

    // Хранилище для кэшированных изображений
    this.allFiles = [];

    // Регистрируем обработчики событий
    this.registerEvents();
  }

  // Регистрация обработчиков событий
  registerEvents() {
    // Обработчик закрытия модального окна
    this.modal.on('click', '.header .x.icon', () =>{
      this.close();  
    });

    // Обработчик клика на кнопках "Удалить" и "Скачать"
    this.modal.on('click', '.delete', (event) => {
      const target = event.currentTarget;

      // путь к файлу
      const imagePath = target.dataset.path;
      this.removeImage(imagePath);

      // удаление отображенного на экране
      console.log(target.closest('.image-preview-container'))
      target.closest('.image-preview-container').remove();
      console.log(target.closest('.image-preview-container'))
    });

    this.modal.on('click', '.download', (event) => {
      const target = event.currentTarget;
      const imageUrl = target.dataset.file;
      this.downloadImage(imageUrl);
    });
  }

  // отображаем информацию в PreviewModal от Яндекс диска
  getYandexDiskFiles(getImagePath) {

    // очищаем временное хранилище
    this.allFiles = [];

    console.log(getImagePath);

    // Получаем список файлов с Яндекс.Диска
    Yandex.getUploadedFiles(response => {
        
      // Поиск фото на Яндексе и добавление их response в массив
      response.forEach(file => {
        this.allFiles.push(file);
      });

      // Вызываем метод отображения фото
      this.showImages(this.allFiles);
      console.log(this.allFiles)
    })
  }

  // Метод для отображения изображений
  showImages(images) {
    
    // Очищаем предыдущее содержимое
    this.modal.find('.content').html('');

    // Отрисовываем новые изображения
    images.forEach(image => {
      const imageHTML = this.getImageInfo(image);
      this.modal.find('.content').append(imageHTML);
    });
  }

  // Метод для форматирования даты
  formatDate(date) {

    // Проверяем, является ли переданное значение даты корректным
    if (!date || isNaN(new Date(date).getTime())) {
      return 'Invalid Date';
    }
  
    // Форматируем дату в требуемом формате
    const options = { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric' };
    return new Intl.DateTimeFormat('ru-RU', options).format(new Date(date));
  }

  // Метод для отображения информации об изображении
  getImageInfo(item) {
    return `
    <div class="image-preview-container">
      <img src="${item.preview}" />
      <table class="ui celled table">
        <thead>
          <tr><th>Имя</th><th>Создано</th><th>Размер</th></tr>
        </thead>
        <tbody>
          <tr><td>${item.name}</td><td>${this.formatDate(item.created)}</td><td>${item.size} Кб</td></tr>
        </tbody>
      </table>
      <div class="buttons-wrapper">
        <button class="ui labeled icon red basic button delete" data-path="${item.path}">
          Удалить
          <i class="trash icon"></i>
        </button>
        <button class="ui labeled icon violet basic button download" data-file="${item.file}">
          Скачать
          <i class="download icon"></i>
        </button>
      </div>
    </div>
  `;
  }

  // Метод для удаления изображения
  removeImage(imagePath) {
    Yandex.removeFile(imagePath);
    const filename = imagePath.substring(imagePath.lastIndexOf('/') + 1);

    // Удаление данных
    this.deletePath(filename);

  }

  // Удаляем кеш:)
  deletePath(filename) {
    const index = this.allFiles.findIndex(item => item.name === filename)
    if (index !== -1) {
      this.allFiles.splice(index, 1);
      return true;
    }
    return false;
  }

  // Метод для скачивания изображения
  downloadImage(imageUrl) {
    Yandex.downloadFileByUrl(imageUrl);
  }
}
