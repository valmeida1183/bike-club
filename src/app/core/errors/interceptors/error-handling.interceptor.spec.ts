import { TestBed } from '@angular/core/testing';
import {
	HttpClient,
	HttpHeaders,
	provideHttpClient,
	withInterceptors,
} from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { errorHandlingInterceptor, SkipErrorHandlingHeader } from './error-handling.interceptor';
import { LayoutStore } from '../../layout/store/layout.store';
import { HttpErrorHandlerService } from '../services/http-error-handler.service';

const TEST_URL = '/api/test';

const makeEnvelope = (description: string, status: boolean = false) => ({
	value: null,
	isSuccess: status,
	isFailure: !status,
	error: { code: 'Some.Error', description, type: 0 },
});

describe('errorHandlingInterceptor', () => {
	let http: HttpClient;
	let httpTesting: HttpTestingController;
	let layoutStoreSpy: jasmine.SpyObj<{ openMessageDialog: (type: any, title: string, message: string) => void }>;

	beforeEach(() => {
		layoutStoreSpy = jasmine.createSpyObj('LayoutStore', ['openMessageDialog']);

		TestBed.configureTestingModule({
			providers: [
				provideHttpClient(withInterceptors([errorHandlingInterceptor])),
				provideHttpClientTesting(),
				HttpErrorHandlerService,
				{ provide: LayoutStore, useValue: layoutStoreSpy },
			],
		});

		http = TestBed.inject(HttpClient);
		httpTesting = TestBed.inject(HttpTestingController);
	});

	afterEach(() => {
		httpTesting.verify();
	});

	it('given_errorBodyHasResultEnvelope_when_4xx_then_dialogMessageIsErrorDescription', () => {
		const envelope = makeEnvelope('You are not authorized');

		http.get(TEST_URL).subscribe({ error: () => {} });
		httpTesting.expectOne(TEST_URL).flush(envelope, { status: 401, statusText: 'Unauthorized' });

		expect(layoutStoreSpy.openMessageDialog).toHaveBeenCalledOnceWith(
			jasmine.anything(),
			jasmine.anything(),
			'You are not authorized',
		);
	});

	it('given_errorBodyHasResultEnvelope_when_4xx_then_dialogTitleIsHttpStatusTitle', () => {
		const envelope = makeEnvelope('You are not authorized');

		http.get(TEST_URL).subscribe({ error: () => {} });
		httpTesting.expectOne(TEST_URL).flush(envelope, { status: 401, statusText: 'Unauthorized' });

		expect(layoutStoreSpy.openMessageDialog).toHaveBeenCalledOnceWith(
			jasmine.anything(),
			'Authentication Error',
			jasmine.anything(),
		);
	});

	it('given_errorBodyHasNoEnvelope_when_4xx_then_fallsBackToHttpErrorMap', () => {
		http.get(TEST_URL).subscribe({ error: () => {} });
		httpTesting.expectOne(TEST_URL).flush(null, { status: 404, statusText: 'Not Found' });

		expect(layoutStoreSpy.openMessageDialog).toHaveBeenCalledOnceWith(
			jasmine.anything(),
			'Resource Not Found',
			'The requested resource could not be found.',
		);
	});

	it('given_422WithErrorsArray_when_intercepted_then_messageConcatenatesEveryDescriptionInOrder', () => {
		const body = {
			errors: [
				{ code: 'Name.Required', description: 'Name is required', type: 1 },
				{ code: 'Email.Invalid', description: 'Email is invalid', type: 1 },
			],
			value: null,
			isSuccess: false,
			isFailure: true,
			error: { code: 'Validation.Error', description: 'Validation error occurred', type: 1 },
		};

		http.get(TEST_URL).subscribe({ error: () => {} });
		httpTesting.expectOne(TEST_URL).flush(body, { status: 422, statusText: 'Unprocessable Entity' });

		expect(layoutStoreSpy.openMessageDialog).toHaveBeenCalledOnceWith(
			jasmine.anything(),
			jasmine.anything(),
			'Name is required\nEmail is invalid',
		);
	});

	it('given_422WithErrorsArray_when_intercepted_then_titleIsEnvelopeErrorDescription', () => {
		const body = {
			errors: [{ code: 'Name.Required', description: 'Name is required', type: 1 }],
			value: null,
			isSuccess: false,
			isFailure: true,
			error: { code: 'Validation.Error', description: 'Validation error occurred', type: 1 },
		};

		http.get(TEST_URL).subscribe({ error: () => {} });
		httpTesting.expectOne(TEST_URL).flush(body, { status: 422, statusText: 'Unprocessable Entity' });

		expect(layoutStoreSpy.openMessageDialog).toHaveBeenCalledOnceWith(
			jasmine.anything(),
			'Validation error occurred',
			jasmine.anything(),
		);
	});

	it('given_422WithEmptyOrMissingErrors_when_intercepted_then_fallsBackToValidationErrorTitle', () => {
		const body = {
			errors: [],
			value: null,
			isSuccess: false,
			isFailure: true,
			error: { code: 'Validation.Error', description: '', type: 1 },
		};

		http.get(TEST_URL).subscribe({ error: () => {} });
		httpTesting.expectOne(TEST_URL).flush(body, { status: 422, statusText: 'Unprocessable Entity' });

		expect(layoutStoreSpy.openMessageDialog).toHaveBeenCalledOnceWith(
			jasmine.anything(),
			'Validation error',
			jasmine.anything(),
		);
	});

	it('given_skipErrorHandlingHeader_when_intercepted_then_noDialog_and_headerStripped', () => {
		http
			.get(TEST_URL, { headers: new HttpHeaders({ [SkipErrorHandlingHeader]: 'true' }) })
			.subscribe({ error: () => {} });

		const testReq = httpTesting.expectOne(TEST_URL);
		expect(testReq.request.headers.has(SkipErrorHandlingHeader)).toBeFalse();
		testReq.flush(null, { status: 401, statusText: 'Unauthorized' });

		expect(layoutStoreSpy.openMessageDialog).not.toHaveBeenCalled();
	});

	it('given_anyHandledError_when_intercepted_then_errorRethrownDownstream', () => {
		const envelope = makeEnvelope('Login failed');

		let caughtError: unknown;
		http.get(TEST_URL).subscribe({
			next: () => fail('should not emit a value'),
			error: (err: unknown) => {
				caughtError = err;
			},
		});

		httpTesting.expectOne(TEST_URL).flush(envelope, { status: 401, statusText: 'Unauthorized' });

		expect(caughtError).toBeTruthy();
	});
});
