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
import { DialogTypeEnum } from '../../../shared/enums/dialog-type.enum';
import { HttpErrorHandlerService } from '../services/http-error-handler.service';

export const SkipErrorHandlingHeader = 'X-Skip-Error-Handling';

const VALIDATION_ERROR_FALLBACK_TITLE = 'Validation error';

type ResultEnvelopeBody = {
	value: unknown;
	isSuccess: boolean;
	isFailure: boolean;
	error: { code: string; description: string; type: number };
};

type ValidationResultBody = ResultEnvelopeBody & {
	errors: { description: string }[];
};

function isResultEnvelope(body: unknown): body is ResultEnvelopeBody {
	return (
		body != null &&
		typeof body === 'object' &&
		'value' in body &&
		'isSuccess' in body &&
		'isFailure' in body
	);
}

function isValidationResult(body: unknown): body is ValidationResultBody {
	return isResultEnvelope(body) && Array.isArray((body as ValidationResultBody).errors);
}

function buildValidationMessage(errors: { description: string }[]): string {
	return errors.map((e) => e.description).join('\n');
}

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
			const errorType = DialogTypeEnum.ERROR;
			const httpErrorMap = httpErrorHandlerService.httpErrorMap;

			if (error.error instanceof ErrorEvent) {
				errorMessage = `Error: ${error.error.message}`;
			} else if (error.status === 422 && isValidationResult(error.error)) {
				errorTitle = error.error.error?.description || VALIDATION_ERROR_FALLBACK_TITLE;
				errorMessage = buildValidationMessage(error.error.errors);
			} else if (isResultEnvelope(error.error)) {
				if (httpErrorMap.has(error.status)) {
					errorTitle = httpErrorMap.get(error.status)![0];
				}
				errorMessage = error.error.error.description;
			} else {
				if (httpErrorMap.has(error.status)) {
					const errorTuple = httpErrorMap.get(error.status)!;
					errorTitle = errorTuple[0];
					errorMessage = errorTuple[1];
				}

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
