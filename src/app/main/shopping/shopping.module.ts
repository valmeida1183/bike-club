import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShoppingRouterModule} from './shopping-router.module';
import { ShoppingComponent } from './shopping.component';

@NgModule({
  declarations: [
    ShoppingComponent
  ],
  imports: [
    CommonModule,
    ShoppingRouterModule
  ]
})
export class ShoppingModule { }
