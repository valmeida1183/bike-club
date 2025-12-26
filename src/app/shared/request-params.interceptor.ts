import {
	HttpRequest,
	HttpEvent,
	HttpInterceptorFn,
	HttpHandlerFn
} from '@angular/common/http';
import { Observable } from 'rxjs';

export const requestParamsInterceptor: HttpInterceptorFn = (
	request: HttpRequest<any>,
	next: HttpHandlerFn,
): Observable<HttpEvent<any>> => {
	const keys: string[] = request.params.keys();

	if (keys.length > 0) {
		let newParams = request.params;

		for (const key of keys) {
			const value = newParams.get(key);

			if (value === null || value === undefined || value === '') {
				newParams = newParams.delete(key, value);
			}
		}

		const modifedRequest: HttpRequest<any> = request.clone({
			params: newParams,
		});

		return next(modifedRequest);
	}

	return next(request);
};
