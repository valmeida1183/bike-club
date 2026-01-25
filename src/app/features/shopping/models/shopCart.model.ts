import { Address } from '../../../models/address.model';
import { Purchase } from './purchase.model';
import { User } from '../../../core/auth/models/user.model';

export class ShopCart {
	constructor(
		public id: number = null,
		public purchaseDate: Date = null,
		public totalAmount: number = 0,
		public userId: number = null,
		public addressId: number = null,
		public purchases: Purchase[] = [],
		public user: User = null,
		public address: Address = null,
	) {}

	calculateTotalAmount() {
		for (const purchase of this.purchases) {
			this.totalAmount += purchase.bike.price;
		}
	}
}
