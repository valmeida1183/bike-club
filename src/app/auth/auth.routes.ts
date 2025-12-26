import { Routes } from '@angular/router';

import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { GendersResolver } from '../resolvers/genders.resolver';
import { isAuthGuard } from '../guards/is-auth.guard';

export const AUTH_ROUTES: Routes = [
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