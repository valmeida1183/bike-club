import {
	HttpEvent,
	HttpHandlerFn,
	HttpInterceptorFn,
	HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LayoutStore } from '../store/layout.store';

export const SkipLoadingHeader = 'X-Skip-Loading';

export const loadingInterceptor: HttpInterceptorFn = (
	req: HttpRequest<any>,
	next: HttpHandlerFn,
): Observable<HttpEvent<any>> => {
	const layoutStore = inject(LayoutStore);

	if (req.headers.has(SkipLoadingHeader)) {
		const headers = req.headers.delete(SkipLoadingHeader);
		return next(req.clone({ headers }));
	}

	layoutStore.showLoading();

	return next(req).pipe(
		finalize(() => {
			layoutStore.hideLoading();
		}),
	);
};
