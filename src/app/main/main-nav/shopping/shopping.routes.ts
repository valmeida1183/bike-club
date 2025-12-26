import { Routes } from '@angular/router';
import { CategoriesResolver } from 'src/app/resolvers/categories.resolver';
import { GendersResolver } from 'src/app/resolvers/genders.resolver';
import { ShoppingComponent } from './shopping.component';

export const SHOPPING_ROUTES: Routes = [
    { path: '', component: ShoppingComponent, resolve: { genders: GendersResolver, categories: CategoriesResolver} }
];