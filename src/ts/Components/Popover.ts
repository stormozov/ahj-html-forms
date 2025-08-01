export default class Popover {
  private _buttonSelector: string;
  private _buttonPopoverMap: Map<HTMLButtonElement, HTMLDivElement>;

  constructor(buttonSelector: string) {
    this._buttonSelector = buttonSelector;
    this._buttonPopoverMap = new Map();
  }

  init(): void {
    this._initListeners();
  }

  private _initListeners(): void {
    this._initButtonListeners();
  }

  private _initButtonListeners(): void {
    const buttons = document.querySelectorAll(this._buttonSelector);

    buttons.forEach((button) => {
      if (button instanceof HTMLButtonElement) {
        button.addEventListener('click', () => this._togglePopover(button));
      }
    });
  }

  private _togglePopover(button: HTMLButtonElement): void {
    const existingPopover = this._buttonPopoverMap.get(button);

    if (existingPopover) {
      // Если popover уже есть — удаляем его
      existingPopover.remove();
      this._buttonPopoverMap.delete(button);
    } else {
      // Если нет — создаём новый
      const popover = this._createPopover(button);
      document.body.appendChild(popover);
      this._positionPopover(button, popover);
      this._buttonPopoverMap.set(button, popover);
    }
  }

  private _createPopover(button: HTMLButtonElement): HTMLDivElement {
    const title = button.getAttribute('data-popover-title') || '';
    const content = button.getAttribute('data-popover-content') || '';

    const popoverElement = document.createElement('div');
    popoverElement.classList.add('popover');

    const titleElement = document.createElement('p');
    titleElement.textContent = title;
    titleElement.classList.add('popover__title');

    const contentElement = document.createElement('p');
    contentElement.textContent = content;
    contentElement.classList.add('popover__content');

    popoverElement.appendChild(titleElement);
    popoverElement.appendChild(contentElement);

    return popoverElement;
  }

  private _positionPopover(
    button: HTMLButtonElement,
    popover: HTMLDivElement
  ): void {
    // Сначала позиционируем popover вне экрана
    popover.style.position = 'absolute';
    popover.style.top = '-1000px';
    popover.style.left = '-1000px';
    popover.style.display = 'block';

    // Принудительно перерисовываем элемент
    void popover.offsetHeight; // Триггерит reflow

    // Теперь получаем корректные размеры popover
    const popoverRect = popover.getBoundingClientRect();

    // Вычисляем точную позицию popover
    const popoverTop = button.offsetTop - popoverRect.height - 10;
    const popoverLeft =
      button.offsetLeft + button.offsetWidth / 2 - popoverRect.width / 2;

    // Применяем финальное позиционирование
    popover.style.top = `${popoverTop}px`;
    popover.style.left = `${popoverLeft}px`;
  }
}
