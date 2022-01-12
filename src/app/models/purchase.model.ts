import { Bike } from './bike.model';
import { ShopCart } from './shopCart.model';

export class Purchase {
    constructor(public shopCartId: number = null,
                public bikeId: number = null,
                public quantity: number = 0,
                public shopCart: ShopCart = null,
                public bike: Bike = null){}
}
