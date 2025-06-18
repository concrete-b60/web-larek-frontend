import { ensureElement } from '../utils/utils';
import { Component } from './base/Component';

interface ISuccess {
	total: number;
}

interface ISuccessActions {
	onClick: () => void;
}

export class Success extends Component<ISuccess> {
	protected _buttonSuccess: HTMLElement;
	protected _descriptionSuccess: HTMLElement;

	constructor(container: HTMLElement, actions: ISuccessActions) {
		super(container);

		this._buttonSuccess = ensureElement<HTMLElement>(
			'.order-success__close',
			this.container
		);

		this._descriptionSuccess = ensureElement<HTMLElement>(
			'.order-success__description',
			this.container
		);

		if (actions?.onClick) {
			this._buttonSuccess.addEventListener('click', actions.onClick);
		}
	}

	set total(total: number) {
		const totalPrice = `Списано ${total} синапсов`;
		this.setText(this._descriptionSuccess, totalPrice);
	}
}
