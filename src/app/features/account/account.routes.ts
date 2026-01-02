import { Routes } from '@angular/router';
import { autoLoginGuard } from 'src/app/core/auth/guards/auto-login.guard';
import { gendersResolverFn } from 'src/app/shared/resolvers/genders.resolver';
import { AccountComponent } from './container/account.component';
import { LoginComponent } from './container/login/login.component';
import { RegisterComponent } from './container/register/register.component';

export const ACCOUNT_ROUTES: Routes = [
	{
		path: '',
		component: AccountComponent,
		children: [
			{ path: 'login', component: LoginComponent, canActivate: [autoLoginGuard] },
			{
				path: 'register',
				component: RegisterComponent,
				canActivate: [autoLoginGuard],
				resolve: { genders: gendersResolverFn },
			},
		],
	},
];
