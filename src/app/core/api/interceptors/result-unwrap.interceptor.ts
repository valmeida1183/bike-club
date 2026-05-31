import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';

export const SkipResultUnwrapHeader = 'X-Skip-Result-Unwrap';

function isResultEnvelope(
	body: unknown,
): body is { value: unknown; isSuccess: boolean; isFailure: boolean } {
	return (
		body != null &&
		typeof body === 'object' &&
		'value' in body &&
		'isSuccess' in body &&
		'isFailure' in body &&
		(body as { isSuccess: boolean }).isSuccess === true
	);
}

export const resultUnwrapInterceptor: HttpInterceptorFn = (req, next) => {
	if (req.headers.has(SkipResultUnwrapHeader)) {
		const headers = req.headers.delete(SkipResultUnwrapHeader);

		return next(req.clone({ headers }));
	}

	return next(req).pipe(
		map((event) =>
			event instanceof HttpResponse && isResultEnvelope(event.body)
				? event.clone({ body: event.body.value })
				: event,
		),
	);
};
