import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { ShoppingRouterModule} from './shopping-router.module';
import { ReactiveFormsModule } from '@angular/forms';

import { ShoppingComponent } from './shopping.component';
import { ShoppListComponent } from './shopp-list/shopp-list.component';
import { ShoppFilterComponent } from './shopp-filter/shopp-filter.component';
import { ShopItemComponent } from './shopp-list/shop-item/shop-item.component';

@NgModule({
  declarations: [
    ShoppingComponent,
    ShoppListComponent,
    ShoppFilterComponent,
    ShopItemComponent
  ],
  imports: [
    SharedModule,
    ShoppingRouterModule,
    ReactiveFormsModule
  ]
})
export class ShoppingModule { }
