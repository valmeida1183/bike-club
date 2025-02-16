import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { GendersResolver } from '../resolvers/genders.resolver';
import { isAuthGuard } from '../guards/is-auth.guard';

const routes: Routes = [
	{
		path: '',
		component: AuthComponent,
		children: [
			{ path: 'login', component: LoginComponent, canActivate: [isAuthGuard] },
			{
				path: 'register',
				component: RegisterComponent,
				canActivate: [isAuthGuard],
				resolve: { genders: GendersResolver },
			},
		],
	},
];

@NgModule({
	declarations: [],
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class AuthRoutingModule {}
