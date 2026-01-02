import { Routes } from '@angular/router';

import { authGuard } from './core/auth/guards/auth.guard';
import { AboutComponent } from './main/main-nav/about/about.component';
import { HomeComponent } from './main/main-nav/home/home.component';
import { MainComponent } from './main/main.component';

export const APP_ROUTES: Routes = [
	{
		path: '',
		component: MainComponent,
		canActivate: [authGuard],
		children: [
			{ path: 'home', component: HomeComponent },
			{
				path: 'club',
				loadChildren: () =>
					import('./main/main-nav/club/club.routes').then((m) => m.CLUB_ROUTES),
			},
			{
				path: 'shopping',
				loadChildren: () =>
					import('./main/main-nav/shopping/shopping.routes').then(
						(m) => m.SHOPPING_ROUTES,
					),
			},
			{ path: 'about', component: AboutComponent },
		],
	},
	{
		path: '',
		loadChildren: () => import('./auth/auth.routes').then((m) => m.AUTH_ROUTES),
	},
	{
		path: 'account',
		loadChildren: () =>
			import('./features/account/account.routes').then((m) => m.ACCOUNT_ROUTES),
	},
];
