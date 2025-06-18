import { IContact, IItem, IOrder, IResult } from '../types';
import { Api, ApiListResponse } from './base/api';

export interface IWebLarekAPI {
	getItemList: () => Promise<IItem[]>;
}

export class WebLarekApi extends Api implements IWebLarekAPI {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	getItemList(): Promise<IItem[]> {
		return this.get('/product').then((data: ApiListResponse<IItem>) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image.replace('.svg', '.png'),
			}))
		);
	}

	order(data: IOrder & IContact): Promise<IResult> {
		return this.post('/order', data).then((data: IResult) => data);
	}
}
