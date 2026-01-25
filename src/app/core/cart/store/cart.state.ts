import { ShopCart } from 'src/app/features/shopping/models/shopCart.model';

export interface CartState {
	shopCart: ShopCart | null;
}
