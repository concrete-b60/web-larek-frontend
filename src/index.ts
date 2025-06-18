import { AppState } from './components/AppData';
import { EventEmitter } from './components/base/events';
import { Basket } from './components/Basket';
import { Card } from './components/Card';
import { Popup } from './components/common/Popup';
import { Contacts } from './components/Contacts';
import { Order } from './components/Order';
import { Page } from './components/Page';
import { Success } from './components/Success';
import { WebLarekApi } from './components/WebLarekApi';
import './scss/styles.scss';
import { IContact, IItem, IOrderForm } from './types';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

const productListTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const productTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const popupTemplate = ensureElement<HTMLElement>('#modal-container');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const api = new WebLarekApi(CDN_URL, API_URL);
const events = new EventEmitter();
const appData = new AppState({}, events);
const page = new Page(document.body, events);
const modal = new Popup(popupTemplate, events);
const orderForm = new Order(cloneTemplate(orderTemplate), events);
const contactsForm = new Contacts(cloneTemplate(contactsTemplate), events);

api
	.getItemList()
	.then(appData.setCatalog.bind(appData))
	.catch((err) => {
		console.error(err);
	});

events.on('catalog:changed', () => {
	page.catalog = appData.catalog.map((item) => {
		const card = new Card(cloneTemplate(productListTemplate), {
			onClick: () => events.emit('product:selected', item),
		});
		return card.render({
			title: item.title,
			image: item.image,
			description: item.description,
			category: item.category,
			price: item.price,
		});
	});
});

events.on('product:selected', (item: IItem) => {
	const isInBasket = appData.order.items.includes(item.id);

	const ProductView = new Card(cloneTemplate(productTemplate), {
		onClick: () => {
			appData.toggleItemInBasket(item.id, !isInBasket);
			modal.close();
		},
	});

	ProductView.inBasket = isInBasket;
	modal.content = ProductView.render(item);
	modal.open();
});

function renderBasket() {
	const basketView = new Basket(cloneTemplate(basketTemplate), events);
	const basketItems = appData.getBasketItems();
	const basketItemViews = basketItems.map((item) => {
		const itemView = new Card(cloneTemplate(cardBasketTemplate), {
			onClick: () => {
				appData.removeFromBasket(item.id);
			},
		});
		return itemView.render(item);
	});

	basketView.items = basketItemViews;
	basketView.total = appData.getTotal();

	modal.content = basketView.render();
}

events.on('basket:updated', (items: IItem[]) => {
	page.counter = items.length;
	if (modal.isOpen) {
		renderBasket();
	}
});

events.on('basket:open', () => {
	renderBasket();
	modal.open();
});

events.on('formErrors:change:contacts', (errors: Partial<IContact>) => {
	const { email, phone } = errors;
	contactsForm.valid = !email && !phone;
	contactsForm.errors = Object.values({ phone, email }).filter(Boolean);
});

events.on('formErrors:change:order', (errors: Partial<IOrderForm>) => {
	const { address } = errors;
	orderForm.valid = !address;
	orderForm.errors = Object.values({ address }).filter(Boolean);
});

events.on(
	/^order\..*:change/,
	(data: { field: keyof IOrderForm; value: string }) => {
		appData.setOrderField(data.field, data.value);
	}
);

events.on(
	/^contacts\..*:change/,
	(data: { field: keyof IContact; value: string }) => {
		appData.setContactField(data.field, data.value);
	}
);

events.on('order:open', () => {
	modal.render({
		content: orderForm.render({
			payment: 'card',
			address: '',
			valid: false,
			errors: [],
		}),
	});
});

events.on(
	'order.payment:change',
	(data: { field: keyof IOrderForm; value: string }) => {
		appData.setOrderField(data.field, data.value);
	}
);

events.on('order:submit', () => {
	modal.render({
		content: contactsForm.render({
			email: '',
			phone: '',
			valid: false,
			errors: [],
		}),
	});
});

events.on('contacts:submit', () => {
	const total = appData.getTotal();

	const fullOrder = {
		...appData.contacts,
		...appData.order,
		total: total,
	};
	console.log('AppData', fullOrder);

	api
		.order(fullOrder)
		.then((result) => {
			appData.clearBasket();
			const success = new Success(cloneTemplate(successTemplate), {
				onClick: () => {
					modal.close();
				},
			});
			modal.render({
				content: success.render({ total }),
			});
		})
		.catch((err) => {
			console.error(err);
		});
});

events.on('modal:open', () => {
	page.locked = true;
});

events.on('modal:close', () => {
	page.locked = false;
});
