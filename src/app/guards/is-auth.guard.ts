import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthWebService } from '../auth/auth-web.service';
import { map } from 'rxjs/operators';

export const isAuthGuard: CanActivateFn = (route, state) => {
	const authWebService = inject(AuthWebService);
	const router = inject(Router);

	return authWebService.authWebUserDataSubject.pipe(
		map((authWebUserData) => {
			const isAuth = !!authWebUserData;
			if (isAuth && (state.url === '/login' || state.url === '/register')) {
				return router.createUrlTree(['/shopping']);
			}

			return true;
		}),
	);
};
