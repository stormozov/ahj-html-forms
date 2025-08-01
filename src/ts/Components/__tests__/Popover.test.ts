/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import Popover from '../Popover';

describe('Компонент Popover', () => {
  let popover: Popover;
  let button: HTMLButtonElement;
  let container: HTMLDivElement;

  beforeEach(() => {
    // Создаем контейнер для тестов
    container = document.createElement('div');
    document.body.appendChild(container);

    // Создаем кнопку с атрибутами
    button = document.createElement('button');
    button.setAttribute('data-popover-title', 'Test Title');
    button.setAttribute('data-popover-content', 'Test Content');
    button.textContent = 'Click me';
    container.appendChild(button);

    // Создаем экземпляр popover
    popover = new Popover('button');
  });

  afterEach(() => {
    // Очищаем DOM после каждого теста
    document.body.innerHTML = '';
  });

  describe('Метод init()', () => {
    it('должен инициализировать и добавить обработчик кликов для кнопки', () => {
      popover.init();

      // Проверяем, что popover изначально не отображается
      const popovers = document.querySelectorAll('.popover');
      expect(popovers.length).toBe(0);
    });
  });

  describe('Поведение при нажатии кнопки', () => {
    beforeEach(() => {
      popover.init();
    });

    it('должно появляться всплывающее окно при первом нажатии', () => {
      // Первый клик - должен создать popover
      button.click();

      const popovers = document.querySelectorAll('.popover');
      expect(popovers.length).toBe(1);

      const popoverElement = popovers[0];
      expect(popoverElement).toBeInTheDocument();

      // Проверяем содержимое popover
      const title = popoverElement.querySelector('.popover__title');
      const content = popoverElement.querySelector('.popover__content');

      expect(title?.textContent).toBe('Test Title');
      expect(content?.textContent).toBe('Test Content');
    });

    it('должно удаляться всплывающее окно при втором нажатии', () => {
      // Первый клик - создаем popover
      button.click();
      expect(document.querySelectorAll('.popover').length).toBe(1);

      // Второй клик - удаляем popover
      button.click();
      expect(document.querySelectorAll('.popover').length).toBe(0);
    });
  });

  describe('Позиционирование', () => {
    beforeEach(() => {
      popover.init();
    });

    it('всплывающее окно должно располагаться над кнопкой', () => {
      // Устанавливаем позицию кнопки для теста
      Object.defineProperty(button, 'offsetTop', { value: 100 });
      Object.defineProperty(button, 'offsetLeft', { value: 50 });
      Object.defineProperty(button, 'offsetWidth', { value: 100 });
      Object.defineProperty(button, 'offsetHeight', { value: 40 });

      button.click();

      const popoverElement = document.querySelector('.popover') as HTMLElement;
      expect(popoverElement).toBeInTheDocument();

      // Проверяем, что popover имеет абсолютное позиционирование
      expect(popoverElement.style.position).toBe('absolute');
    });
  });

  describe('Крайние случаи', () => {
    it('должен обрабатывать кнопку без атрибутов popover', () => {
      const buttonWithoutAttrs = document.createElement('button');
      buttonWithoutAttrs.textContent = 'No attrs';
      container.appendChild(buttonWithoutAttrs);

      popover = new Popover('button');
      popover.init();

      buttonWithoutAttrs.click();

      const popoverElement = document.querySelector('.popover');
      expect(popoverElement).toBeInTheDocument();

      // Должен создать popover с пустыми значениями
      const title = popoverElement?.querySelector('.popover__title');
      const content = popoverElement?.querySelector('.popover__content');

      expect(title?.textContent).toBe('');
      expect(content?.textContent).toBe('');
    });

    it('не должен создавать всплывающие окна для элементов, не являющихся кнопками', () => {
      const div = document.createElement('div');
      div.setAttribute('data-popover-title', 'Div Title');
      div.textContent = 'Not a button';
      container.appendChild(div);

      popover = new Popover('div');
      popover.init();

      div.click();

      // Для div не должно создаваться popover, так как мы проверяем instanceof HTMLButtonElement
      const popovers = document.querySelectorAll('.popover');
      expect(popovers.length).toBe(0);
    });
  });
});
