import { Address } from '../../../shared/models/address.model';
import { Purchase } from './purchase.model';
import { User } from '../../../core/auth/models/user.model';

// export class ShopCart {
// 	constructor(
// 		public id: number,
// 		public purchaseDate: Date,
// 		public totalAmount: number = 0,
// 		public userId: number,
// 		public addressId: number,
// 		public purchases: Purchase[] = [],
// 		public user: User,
// 		public address: Address,
// 	) {}
// }

export interface ShopCart {
	id: number | null;
	purchaseDate: Date | null;
	totalAmount: number | null;
	userId: number | null;
	addressId: number | null;
	purchases: Purchase[];
	user: User | null;
	address: Address | null;
}
