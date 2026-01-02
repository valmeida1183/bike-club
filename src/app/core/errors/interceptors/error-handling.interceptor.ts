import {
	HttpErrorResponse,
	HttpEvent,
	HttpHandlerFn,
	HttpInterceptorFn,
	HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LayoutStore } from '../../layout/store/layout.store';
import { DialogTypeEnum } from '../../layout/enums/dialog-type.enum';
import { HttpErrorHandlerService } from '../services/http-error-handler.service';

export const SkipErrorHandlingHeader = 'X-Skip-Error-Handling';

export const errorHandlingInterceptor: HttpInterceptorFn = (
	req: HttpRequest<any>,
	next: HttpHandlerFn,
): Observable<HttpEvent<any>> => {
	const layoutStore = inject(LayoutStore);
	const httpErrorHandlerService = inject(HttpErrorHandlerService);

	if (req.headers.has(SkipErrorHandlingHeader)) {
		const headers = req.headers.delete(SkipErrorHandlingHeader);
		return next(req.clone({ headers }));
	}

	return next(req).pipe(
		catchError((error: HttpErrorResponse) => {
			console.error('HTTP Error:', error);

			let errorMessage = 'An unknown error occurred!';
			let errorTitle = 'Error';
			let errorType = DialogTypeEnum.ERROR;
			const httpErrorMap = httpErrorHandlerService.httpErrorMap;

			if (error.error instanceof ErrorEvent) {
				// Client-side error
				errorMessage = `Error: ${error.error.message}`;
			} else {
				// Server-side error
				if (httpErrorMap.has(error.status)) {
					const errorTuple = httpErrorMap.get(error.status);
					errorTitle = errorTuple[0];
					errorMessage = errorTuple[1];
				}

				// Prioritize specific error messages from the backend if available and suitable
				if (error.error && typeof error.error === 'string') {
					errorMessage = error.error;
				} else if (error.error && error.error.message) {
					errorMessage = error.error.message;
				}
			}

			layoutStore.openMessageDialog(errorType, errorTitle, errorMessage);
			return throwError(() => error);
		}),
	);
};
