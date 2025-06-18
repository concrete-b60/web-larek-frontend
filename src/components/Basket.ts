import { IBasketView } from '../types';
import { createElement, ensureElement } from '../utils/utils';
import { Component } from './base/Component';
import { IEvents } from './base/events';

export class Basket extends Component<IBasketView> {
	protected _basketPrice: HTMLElement;
	protected _basketButton: HTMLButtonElement;
	protected _basketList: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._basketList = ensureElement<HTMLElement>('.basket__list', container);
		this._basketPrice = this.container.querySelector('.basket__price');
		this._basketButton = this.container.querySelector('.basket__button');

		if (this._basketButton) {
			this._basketButton.addEventListener('click', () => {
				events.emit('order:open');
			});
		}

		this.items = [];
	}

	set items(items: HTMLElement[]) {
		if (items.length) {
			this._basketList.replaceChildren(...items);
		} else {
			this._basketList.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста',
				})
			);
		}
	}
	set selected(items: string[]) {
		if (items.length) {
			this.setDisabled(this._basketButton, false);
		} else {
			this.setDisabled(this._basketButton, true);
		}
	}

	set total(total: number) {
		this.setText(this._basketPrice, `${total} синапсов`);
		const totalNumber = Number(total);
		if (this._basketButton) {
			this.setDisabled(this._basketButton, totalNumber <= 0);
		}
	}
}
