import { Input, Component, OnInit } from '@angular/core';

import { Bike } from 'src/app/models/bike.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'bc-shop-item',
  templateUrl: './shop-item.component.html',
  styleUrls: ['./shop-item.component.scss']
})
export class ShopItemComponent implements OnInit {
  @Input() bike: Bike;
  imagePath: string;

  constructor() {}

  ngOnInit(): void {
    this.imagePath = `${environment.imageResource}${this.bike.image}`;
  }

  onDetails(): void {

  }

  onAddToCart(): void {

  }
}
