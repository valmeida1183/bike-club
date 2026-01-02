import {
	HttpInterceptorFn,
	HttpRequest,
	HttpHandlerFn,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthStore } from '../store/auth.store';

export const authInterceptor: HttpInterceptorFn = (
	request: HttpRequest<any>,
	next: HttpHandlerFn,
) => {
	const authStore = inject(AuthStore);

	if (!authStore.isAuthenticated()) {
		return next(request);
	}

	const token = authStore.token();
	const modifedRequest = request.clone({
		setHeaders: {
			Authorization: `Bearer ${token}`,
		},
	});

	return next(modifedRequest);
};
