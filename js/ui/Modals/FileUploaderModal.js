/**
 * Класс FileUploaderModal
 * Используется как всплывающее окно для загрузки изображений
 */


class FileUploaderModal extends BaseModal {
  constructor( element ) {
    
    // Вызываем конструктор родителя
    super(element);

    // Находим все блоки загрузки изображений и сохраняем их в свойстве класса
    this.contentBlock = this.modalElement.find('.scrolling.content');
    this.imageContainers = this.modalElement.find('.ui.button');

    this.registerEvents();
  }

  /**
   * Добавляет следующие обработчики событий:
   * 1. Клик по крестику на всплывающем окне, закрывает его
   * 2. Клик по кнопке "Закрыть" на всплывающем окне, закрывает его
   * 3. Клик по кнопке "Отправить все файлы" на всплывающем окне, вызывает метод sendAllImages
   * 4. Клик по кнопке загрузке по контроллерам изображения: 
   * убирает ошибку, если клик был по полю вода
   * отправляет одно изображение, если клик был по кнопке отправки
   */
  registerEvents() {

    // 1. Клик по крестику на всплывающем окне, закрывает его
    this.modalElement.on('click', '.header .x.icon', () => {
      this.close();
    });

    // 2. Клик по кнопке "Закрыть" на всплывающем окне, закрывает его
    this.modalElement.on('click', '.close.button', () => {
      this.close();
    });

    // 3. Клик по кнопке "Отправить все файлы" на всплывающем окне, вызывает метод sendAllImages
    this.modalElement.on('click', '.send-all.button', () => {
      this.sendAllImages();
    });

    // 4. Клик по кнопке загрузке по контроллерам изображения
    this.modalElement.on('click', '.ui.action.input', (event) => {
      const target = $(event.target);
      const inputField = target.find('input'); // Ищем поле ввода внутри текущего элемента
  
      // Проверяем, был ли клик по полю ввода или его потомкам
      if (inputField.length > 0) {
        const imageContainer = target.closest('.image-preview-container');
        this.removeError(imageContainer);
      }
    });
    
    this.modalElement.on('click', '.ui.button', (event) => {
        const target = $(event.target);
    
        // Проверяем, был ли клик по кнопке "Отправить"
        if (target.hasClass('ui button')) {
          this.sendImage(target.closest('.image-preview-container'));
        }
    });
  }

  /**
   * Отображает все полученные изображения в теле всплывающего окна
   */
  showImages(images) {

    // Очищаем предыдущее содержи
    this.contentBlock.html('');

    // Отрисовываем новые изображения
    for (const image of images) {
      console.log(image)
      const imageHTML = this.getImageHTML(image);
      this.contentBlock.append(imageHTML);
    }
  }

  /**
   * Формирует HTML разметку с изображением, полем ввода для имени файла и кнопкной загрузки
   */
  getImageHTML(item) {
    return `
      <div class="image-preview-container">
        <img src="${item}" />
        <div class="ui action input">
          <input type="text" placeholder="Путь к файлу">
          <button class="ui button"><i class="upload icon"></i></button>
        </div>
      </div>
    `;
  }

  /**
   * Отправляет все изображения в облако
   */
  sendAllImages() {

    // Перебираем все блоки изображений-контейнеров
    this.contentBlock.find('.image-preview-container').each((index, element) => {
      console.log(element);
      this.sendImage($(element));
    });
  }

  /**
   * Валидирует изображение и отправляет его на сервер
   */
  sendImage(imageContainer) {
    console.log('Отправка изображения на сервер Яндекс.Диска:', imageContainer)

    // Получаем значение поля ввода
    const inputField = imageContainer.find('.ui.action.input input');
    const filePath = inputField.val().trim();
    const saveName = filePath.split('/').pop();
    console.log('Путь к файлу:', filePath);

    // Проверяем, введен ли путь к файлу
    if (filePath === '') {
      // Если путь не введен, добавляем класс ошибки
      imageContainer.addClass('error');
      return alert('введите путь к файлу');
    }

    // Добавляем класс disabled для блока с классом input
    imageContainer.find('button').addClass('disabled');

    // Получаем изображение для загрузки
    const image = imageContainer.find('img');
    console.log('Изображение для загрузки:', image.attr('src'));

    // Выполняем запрос на отправку изображения
    Yandex.uploadFile(filePath, image.attr('src'), (response) => {
      console.log('Ответ от сервера Яндекс.Диска:', response);

      // Удаляем блок контейнера добавленного изображения
      imageContainer.remove();

      // Если в модалке не осталось изображений, закрываем модальное окно
      if (this.contentBlock.length === 0) {
        this.close();
      }
    });
  }
}


