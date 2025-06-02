export interface IItem {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number
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
    removeItem: (id: string) => void;
    onClick: ()=> void;
}

export interface IFormStepOneView {
    payment: string;
    address: string; 
}

export interface IFormStepTwoView {
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
    getTotal():  number;
}