import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { ShoppingRouterModule} from './shopping-router.module';

import { ShoppingComponent } from './shopping.component';
import { ShoppListComponent } from './shopp-list/shopp-list.component';
import { ShoppFilterComponent } from './shopp-filter/shopp-filter.component';

@NgModule({
  declarations: [
    ShoppingComponent,
    ShoppListComponent,
    ShoppFilterComponent
  ],
  imports: [
    SharedModule,
    ShoppingRouterModule
  ]
})
export class ShoppingModule { }
