import { Component, OnInit, input } from '@angular/core';
import { Store } from '@ngrx/store';

import { addToShopCart } from 'src/app/store/actions/shop-cart.actions';
import { Bike } from 'src/app/models/bike.model';
import { environment } from 'src/environments/environment';
import { Purchase } from 'src/app/models/purchase.model';
import { ShopCart } from 'src/app/models/shopCart.model';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'bc-shop-item',
    templateUrl: './shop-item.component.html',
    styleUrls: ['./shop-item.component.scss'],
    standalone: true,
    imports: [CommonModule, MatCardModule, MatButtonModule]
})
export class ShopItemComponent implements OnInit {
  readonly bike = input<Bike>(undefined);
  imagePath: string;

  constructor(private store: Store<{shopCart: ShopCart}>) {}

  ngOnInit(): void {
    this.imagePath = `${environment.imageResource}${this.bike().image}`;
  }

  onDetails(): void {

  }

  onAddToCart(): void {
    const purchase = new Purchase();
    purchase.bike = this.bike();
    purchase.bikeId = this.bike().id;
    purchase.quantity += +1;

    this.store.dispatch(addToShopCart({purchase}));
  }
}
