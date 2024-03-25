/**
 * Класс SearchBlock
 * Используется для взаимодействием со строкой ввода и поиска изображений
 * */
class SearchBlock {
  constructor( element ) {

    this.element = element;

    // // Получаем элементы интерфейса
    this.inputElement = element.querySelector('input');
    this.replaceButton = element.querySelector('.replace');
    this.addButton = element.querySelector('.add');

    // Регистрируем события
    this.registerEvents();
  }

  /**
   * Выполняет подписку на кнопки "Заменить" и "Добавить"
   * Клик по кнопкам выполняет запрос на получение изображений и отрисовывает их,
   * только клик по кнопке "Заменить" перед отрисовкой очищает все отрисованные ранее изображения
   */
  registerEvents() {

    // Обработчик клика по кнопке "Заменить"
    this.replaceButton.addEventListener('click', () => {
      console.log(this.inputElement.value);
      this.handleButtonClick();
    });

    // Обработчик клика по кнопке "Добавить"
    this.addButton.addEventListener('click', () => {
      console.log(this.inputElement.value);
      this.handleAddClick();
    });
  }

   // Обработчик клика по кнопке "Заменить"
   handleButtonClick() {

    // Проверяем, не пустое ли поле ввода
    if (this.inputElement.value.trim() === '') {
      alert('Введите id пользователя');
      return;
    }

    // Очищаем отрисованные ранее изображения
    App.imageViewer.clear();

    // Выполняем запрос на сервер для получения изображений
    VK.get(this.inputElement.value, this.handleImagesResponse);
  }
  
  handleAddClick() {

    // Проверяем, не пустое ли поле ввода
    if (this.inputElement.value.trim() === '') {
      alert('Введите id пользователя');
      return;
    }

    // Выполняем запрос на сервер для получения изображений
    VK.get(this.inputElement.value, this.handleImagesResponse.bind(this));
  }

  handleImagesResponse(images) {

    // Отрисовываем полученные изображения
    App.imageViewer.drawImages(images);
  }
  

}