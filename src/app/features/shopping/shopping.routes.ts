import { Routes } from '@angular/router';
import { categoriesResolverFn } from 'src/app/shared/resolvers/categories.resolver';
import { gendersResolverFn } from 'src/app/shared/resolvers/genders.resolver';
import { ShoppingComponent } from './containers/shopping.component';

export const SHOPPING_ROUTES: Routes = [
	{
		path: '',
		component: ShoppingComponent,
		resolve: { genders: gendersResolverFn, categories: categoriesResolverFn },
	},
];
