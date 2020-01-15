import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { ShoppingRouterModule} from './shopping-router.module';

import { ShoppingComponent } from './shopping.component';

@NgModule({
  declarations: [
    ShoppingComponent
  ],
  imports: [
    SharedModule,
    ShoppingRouterModule
  ]
})
export class ShoppingModule { }
