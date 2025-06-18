import { IAppState, IContact, IItem, IOrder, IOrderForm } from '../types';
import { Model } from './base/Model';

export class AppState extends Model<IAppState> {
	catalog: IItem[] = [];
	preview: string | null = null;
	loading = false;
	order: IOrder = { payment: 'card', address: '', items: [] };
	contacts: IContact = { email: '', phone: '' };
	formErrors: IAppState['formErrors'] = {};

	setCatalog(items: IItem[]) {
		this.catalog = items;
		this.events.emit('catalog:changed', this.catalog);
	}

	getCatalog(): IItem[] {
		return this.catalog;
	}

	setPreview(id: string) {
		this.preview = id;

		const item = this.catalog.find((product) => product.id === id);
		if (item) {
			this.events.emit('product:selected', item);
		}
	}

	getPreview(): string | null {
		return this.preview;
	}

	toggleItemInBasket(id: string, isBasket: boolean) {
		if (isBasket) {
			this.order.items = Array.from(new Set([...this.order.items, id]));
		} else {
			this.order.items = this.order.items.filter((itemId) => itemId !== id);
		}
		this.events.emit('basket:updated', this.order.items);
	}

	addToBasket(itemId: string) {
		if (!this.order.items.includes(itemId)) {
			this.order.items.push(itemId);
			this.events.emit('basket:updated', this.getBasketItems());
		}
	}

	removeFromBasket(itemId: string) {
		this.order.items = this.order.items.filter((id) => id !== itemId);
		this.events.emit('basket:updated', this.getBasketItems());
	}

	clearBasket() {
		this.order.items = [];
		this.events.emit('basket:updated', []);
	}

	getBasketItems(): IItem[] {
		return this.catalog.filter((item) => this.order.items.includes(item.id));
	}

	getTotal(): number {
		return this.getBasketItems().reduce(
			(sum, item) => sum + (item.price ?? 0),
			0
		);
	}

	setOrderField(field: keyof IOrderForm, value: string) {
		this.order[field] = value;
		if (this.validateOrder()) {
			this.events.emit('order:ready', this.order);
		}
	}

	setContactField(field: keyof IContact, value: string) {
		this.contacts[field] = value;
		if (this.validateContact()) {
			this.events.emit('contacts:ready', this.contacts);
		}
	}

	validateOrder() {
		const errors: typeof this.formErrors = {};
		if (!this.order.address) {
			errors.phone = 'Необходимо указать адрес';
		}
		this.formErrors = errors;
		this.events.emit('formErrors:change:order', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	validateContact() {
		const errors: typeof this.formErrors = {};
		if (!this.contacts.email) {
			errors.email = 'Необходимо указать email';
		}
		if (!this.contacts.phone) {
			errors.phone = 'Необходимо указать телефон';
		}
		this.formErrors = errors;
		this.events.emit('formErrors:change:contacts', this.formErrors);
		return Object.keys(errors).length === 0;
	}
}
