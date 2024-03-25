/**
 * Класс ImageViewer
 * Используется для взаимодействием блоком изображений
 * */
class ImageViewer {
  constructor( element ) {

    this.element = element;
    this.offset = 0;
    this.addedElements = []; // Хранение добавленных элементов

     // Кнопки и другие элементы интерфейса
      this.selectAllButton = document.querySelector('.select-all');
      this.sendToDiskButton = document.querySelector('.send');
      this.newImage = document.getElementById('new-image');
      

    this.registerEvents();
  }

  /**
   * Добавляет следующие обработчики событий:
   * 1. Клик по изображению меняет класс активности у изображения
   * 2. Двойной клик по изображению отображает изображаения в блоке предпросмотра
   * 3. Клик по кнопке выделения всех изображений проверяет у всех ли изображений есть класс активности?
   * Добавляет или удаляет класс активности у всех изображений
   * 4. Клик по кнопке "Посмотреть загруженные файлы" открывает всплывающее окно просмотра загруженных файлов
   * 5. Клик по кнопке "Отправить на диск" открывает всплывающее окно для загрузки файлов
   */
  registerEvents() {

    // 1. Клик по изображению меняет класс активности у изображения
    this.element.addEventListener('click', (event) => this.handleImageClick(event));

    // 2. Двойной клик по изображению отображает изображения в блоке предпросмотра
    this.element.addEventListener('dblclick', (event) => this.handleImageDoubleClick(event));

    // 3. Клик по кнопке выделения всех изображений
    this.element.addEventListener('click', (event) => this.handleSelectAllClick(event));

    // 4. Клик по кнопке "Отправить на диск"
    this.element.addEventListener('click', (event) => this.handleSendClick(event));


    // 5. Клик по кнопке "Посмотреть загруженные файлы"
    this.element.addEventListener('click', (event) => this.handleViewUploadedFilesClick(event));
  }

  handleImageClick(event) {
    const target = event.target;
    if (target.tagName === 'IMG') {

      // Переключаем класс "selected" для изображения
      target.classList.toggle('selected');

      // Проверяем текст кнопок "Выбрать всё" и "Отправить на диск"
      this.checkButtonText();
    }
  }

  // Обработчик события двойного клика на изображение
  handleImageDoubleClick(event) {
    const target = event.target;
    if (target.tagName === 'IMG') {

      // Вызываем метод showInPreview с путем к изображению
      this.showInPreview(target.src);
    }
  }

  // Обработчик события клика на кнопку "Выбрать всё"
  handleSelectAllClick(event) {
    const target = event.target;
    if (target.classList.contains('select-all')) {

      // Получаем все изображения
      const images = this.element.querySelectorAll('.image-wrapper img');

      // Проверяем, есть ли у всех изображений класс "selected"
      const isSelected = Array.from(images).every(img => img.classList.contains('selected'));

      // Добавляем или удаляем класс "selected" для всех изображений в зависимости от результата
      images.forEach(img => img.classList.toggle('selected', !isSelected));

      // Проверяем текст кнопок "Выбрать всё" и "Отправить на диск"
      this.checkButtonText();
    }
  }

  // Обработчик события клика на кнопку "Отправить на диск"
  handleSendClick(event) {
    const target = event.target;
    if (target.classList.contains('send') && !target.classList.contains('disabled')) {
      const fileUploader = App.getModal('fileUploader');
      
      const selectImg = this.element.querySelectorAll('.selected');

      const imagePaths = Array.from(selectImg).map(wrapper => wrapper.src);
      fileUploader.showImages(imagePaths);
      fileUploader.open();
    }
  }

  // Обработчик события клика на кнопку "Посмотреть загруженные файлы"
  handleViewUploadedFilesClick(event) {
    const target = event.target;
    if (target.classList.contains('show-uploaded-files')) {

      // Открывает всплывающее окно просмотра загруженных файлов
      const filePreviewer = App.getModal('filePreviewer');

      // Вызов метода из Prewiew запрос на Яндекс
      filePreviewer.getYandexDiskFiles();
      filePreviewer.open();
    }
  }

  /**
   * Очищает отрисованные изображения
   */
  clear() {

    // Удаление только добавленных элементов
    for (const addedElement of this.addedElements) {
      addedElement.parentNode.removeChild(addedElement);
    }

    // Очистка массива добавленных элементов
    this.addedElements = [];
  }

  /**
   * Отрисовывает изображения.
  */
  drawImages(images) {

    this.clear();

    // Проверяем, есть ли изображения
    if (images.length > 0) {

      // Если есть, то убираем класс "disabled" у кнопки "Выбрать всё"
      this.selectAllButton.classList.remove('disabled');
    } else {

      // Если изображений нет, то добавляем класс "disabled" у кнопки "Выбрать всё"
      this.selectAllButton.classList.add('disabled');
    }
    
    const newImage = this.newImage;

    // Для каждого изображения создаем блок и добавляем его в блок изображений
    images.forEach(image => {
      
      const imageWrapper = document.createElement('div');
      imageWrapper.className = 'image-wrapper';
      imageWrapper.innerHTML = `<img src='${image}' />`;
      this.addedElements.push(imageWrapper);
      newImage.appendChild(imageWrapper);
    });

    this.checkButtonText();
  }

  /**
   * Контроллирует кнопки выделения всех изображений и отправки изображений на диск
   */
  checkButtonText() {

    // Получаем все отрисованные изображения
    const images = this.element.querySelectorAll('.image-wrapper img');

    // Получаем кнопки с классом "select-all" и "send"
    const selectAllButton = this.selectAllButton;
    const sendButton = this.sendToDiskButton;

    // Проверяем, все ли изображения имеют класс "selected"
    const allSelected = Array.from(images).every(img => img.classList.contains('selected'));

    // Устанавливаем текст для кнопки "Выбрать всё" в зависимости от результата
    selectAllButton.textContent = allSelected ? 'Снять выделение' : 'Выбрать всё';

    // Проверяем, есть ли хотя бы одно изображение с классом "selected"
    const anySelected = Array.from(images).some(img => img.classList.contains('selected'));

    // Добавляем или удаляем класс "disabled" у кнопки "Отправить на диск" в зависимости от результата
    sendButton.classList.toggle('disabled', !anySelected);
  }

  /**
   * Отображает изображения в блоке предпросмотра
   */
  showInPreview(imageSrc) {

    const previewBlock = document.querySelector('.ui.fluid.image');
    previewBlock.src = imageSrc;
  }
}