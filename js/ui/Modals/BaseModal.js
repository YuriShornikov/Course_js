/**
 * Класс BaseModal
 * Используется как базовый класс всплывающего окна
 */
class BaseModal {
  constructor( element ) {
    // Получаем элемент всплывающего окна
    this.modalElement = element;

    // Взаимодействие с элементом DOM находится на нулевой позиции элемента семантики
    this.domElement = element.get(0);
  }

  //Открывает всплывающее окно
  open() {

    // Добавляем класс для отображения всплывающего окна
    this.modalElement.modal('show');
  }

  // Закрывает всплывающее окно
  close() {

    // Вызываем метод modal на семантическом элементе, передавая 'hide'
    this.modalElement.modal('hide');
  }
}
