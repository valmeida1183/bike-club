import { Bike } from './bike.model';
import { ShopCart } from './shopCart.model';

export class Purchase {
	constructor(
		public shopCartId: number,
		public bikeId: number,
		public quantity: number = 0,
		public shopCart?: ShopCart,
		public bike?: Bike,
	) {}
}
