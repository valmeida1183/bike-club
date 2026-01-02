import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class HttpErrorHandlerService {
	httpErrorMap = new Map<number, [string, string]>([
		[400, ['Bad Request', 'Your request is not well formatted.']],
		[
			401,
			['Authentication Error', 'You are not authorized to perform this action.'],
		],
		[
			403,
			[
				'Authorization Error',
				'You do not have permission to access this resource.',
			],
		],
		[404, ['Resource Not Found', 'The requested resource could not be found.']],
		[500, ['Server Error', 'An error has occurred!']],
	]);
}
