import { Routes } from '@angular/router';

import { authGuard } from './core/auth/guards/auth.guard';
import { AboutComponent } from './features/about/about.component';
import { HomeComponent } from './features/home/home.component';

export const APP_ROUTES: Routes = [
	{
		path: '',
		loadChildren: () =>
			import('./main/container/main.routes').then((m) => m.ACCOUNT_ROUTES),
	},
	// {
	// 	path: '',
	// 	component: MainComponent,
	// 	canActivate: [authGuard],
	// 	children: [
	// 		{ path: 'home', component: HomeComponent },
	// 		{
	// 			path: 'club',
	// 			loadChildren: () =>
	// 				import('./main/main-nav/club/club.routes').then((m) => m.CLUB_ROUTES),
	// 		},
	// 		{
	// 			path: 'shopping',
	// 			loadChildren: () =>
	// 				import('./main/main-nav/shopping/shopping.routes').then(
	// 					(m) => m.SHOPPING_ROUTES,
	// 				),
	// 		},
	// 		{ path: 'about', component: AboutComponent },
	// 	],
	// },
	{
		path: 'account',
		loadChildren: () =>
			import('./features/account/account.routes').then((m) => m.ACCOUNT_ROUTES),
	},
];
