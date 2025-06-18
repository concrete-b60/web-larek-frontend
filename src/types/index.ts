export interface IItem {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number;
}

export interface IItemModel {
	items: IItem[];
}

export interface IDelivery {
	payment: string;
	email: string;
	phone: string;
	address: string;
	total: number;
	items: IItem[];
}

export interface IProductView {
	item: IItem;
	onClick: (item: IItem) => void;
}

export interface IBasketView {
	items: IItem[];
	total: number;
}

export interface IOrderForm {
	payment: string;
	address: string;
}

export interface IOrder extends IOrderForm {
	items: string[];
}

export interface IContact {
	email: string;
	phone: string;
}

export interface IRender {
	render(): HTMLElement;
}

export interface IPopup {
	content: HTMLElement;
	open(): void;
	close(): void;
}

export interface IBasket {
	addItem(item: IItem): void;
	removeItem(id: string): void;
	clear(): void;
	getItems(): IItem[];
	getTotal(): number;
}

export interface IAppState {
	catalog: IItem[];
	basket: string[];
	preview: string | null;
	loading: boolean;
	contacts: IContact;
	order: IOrder;
	formErrors: Partial<Record<keyof (IContact & IOrder), string>>;
}

export interface IResult {
	id: string;
}
