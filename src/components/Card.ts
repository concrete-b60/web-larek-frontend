import { IItem } from '../types';
import { ensureElement } from '../utils/utils';
import { Component } from './base/Component';

interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export class Card extends Component<IItem> {
	protected _image?: HTMLImageElement;
	protected _title: HTMLElement;
	protected _category: HTMLElement;
	protected _price: HTMLElement;
	protected _description?: HTMLElement;
	protected _button?: HTMLButtonElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container);
		this._category =
			container.querySelector<HTMLElement>('.card__category') ?? undefined;
		this._title = ensureElement<HTMLElement>('.card__title', container);
		this._image =
			container.querySelector<HTMLImageElement>('.card__image') ?? undefined;
		this._price = ensureElement<HTMLElement>('.card__price', container);
		this._description =
			container.querySelector<HTMLElement>('.card__text') ?? undefined;
		this._button =
			container.querySelector<HTMLButtonElement>('.card__button') ?? undefined;

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}

	get id(): string {
		return this.container.dataset.id || '';
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	set description(value: string) {
		if (this._description) {
			this.setText(this._description, value);
		}
	}

	set category(value: string) {
		this.setText(this._category, value);
	}

	set price(value: string) {
		const price = value ? `${value} синапсов` : 'бесценно';
		this.setText(this._price, price);

		const priceNumber = Number(value);
		if (this._button) {
			this.setDisabled(this._button, priceNumber <= 0);
		}
	}

	set image(value: string) {
		if (this._image) {
			this.setImage(this._image, value, this.title);
		}
	}

	set inBasket(value: boolean) {
		if (this._button) {
			this._button.textContent = value ? 'Удалить' : 'В корзину';
		}
	}
}
