import { Routes } from '@angular/router';
import { categoriesResolverFn } from 'src/app/shared/resolvers/categories.resolver';
import { gendersResolverFn } from 'src/app/shared/resolvers/genders.resolver';
import { ShoppingDetailsComponent } from './shopping-details/containers/shopping-details.component';
import { ShoppingListComponent } from './shopping-list/containers/shopping-list.component';

export const SHOPPING_ROUTES: Routes = [
	{
		path: '',
		component: ShoppingListComponent,
		resolve: { genders: gendersResolverFn, categories: categoriesResolverFn },
	},
	{
		path: 'details/:id', // use withComponentInputBindings in app-routing.module.ts
		component: ShoppingDetailsComponent,
	},
];
