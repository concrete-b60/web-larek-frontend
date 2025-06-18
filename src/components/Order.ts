import { IOrder } from '../types';
import { IEvents } from './base/events';
import { Form } from './common/Form';
import { Tabs } from './common/Tabs';

export class Order extends Form<IOrder> {
	protected paymentTabs: Tabs;
	protected currentPayment: string = 'card';

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
		const buttonsContainer = container.querySelector(
			'.order__buttons'
		) as HTMLElement;
		this.paymentTabs = new Tabs(buttonsContainer, {
			onClick: (tabName: string) => {
				this.currentPayment = tabName;
				this.paymentTabs.selected = tabName;
				this.events.emit('order.payment:change', {
					field: 'payment',
					value: tabName,
				});
			},
		});

		this.paymentTabs.selected = this.currentPayment;
	}
	set payment(value: string) {
		this.currentPayment = value;
		this.paymentTabs.selected = value;
	}

	get payment() {
		return this.currentPayment;
	}

	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}
}
