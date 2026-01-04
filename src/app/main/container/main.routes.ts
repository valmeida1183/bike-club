import { Routes } from '@angular/router';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { authGuard } from 'src/app/core/auth/guards/auth.guard';
import { HomeComponent } from '../../features/home/home.component';
import { AboutComponent } from '../../features/about/about.component';

export const ACCOUNT_ROUTES: Routes = [
	{
		path: '',
		component: MainLayoutComponent,
		canActivate: [authGuard],
		children: [
			{ path: 'home', component: HomeComponent },
			{
				path: 'club',
				loadChildren: () =>
					import('../../features/club/club.routes').then((m) => m.CLUB_ROUTES),
			},
			{
				path: 'shopping',
				loadChildren: () =>
					import('../../features/shopping/shopping.routes').then(
						(m) => m.SHOPPING_ROUTES,
					),
			},
			{ path: 'about', component: AboutComponent },
		],
	},
];
