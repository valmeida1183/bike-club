import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthStore } from '../store/auth.store';

export const autoLoginGuard: CanActivateFn = (
	route,
	state,
): boolean | UrlTree => {
	const authStore = inject(AuthStore);
	const router = inject(Router);

	if (
		authStore.isAuthenticated() &&
		(state.url === '/account/login' || state.url === '/account/register')
	) {
		return router.createUrlTree(['/shopping']);
	}

	return true;
};
