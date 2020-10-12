import {NgModule} from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CategoriesResolver } from 'src/app/resolvers/categories.resolver';
import { GendersResolver } from 'src/app/resolvers/genders.resolver';
import { ShoppingComponent } from './shopping.component';

const routes: Routes = [
    { path: '', component: ShoppingComponent, resolve: { genders: GendersResolver, categories: CategoriesResolver} }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShoppingRouterModule {}
