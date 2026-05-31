import { TestBed } from '@angular/core/testing';
import {
	HttpClient,
	HttpHeaders,
	HttpResponse,
	provideHttpClient,
	withInterceptors,
} from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { resultUnwrapInterceptor, SkipResultUnwrapHeader } from './result-unwrap.interceptor';

const TEST_URL = '/api/test';

describe('resultUnwrapInterceptor', () => {
	let http: HttpClient;
	let httpTesting: HttpTestingController;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				provideHttpClient(withInterceptors([resultUnwrapInterceptor])),
				provideHttpClientTesting(),
			],
		});
		http = TestBed.inject(HttpClient);
		httpTesting = TestBed.inject(HttpTestingController);
	});

	afterEach(() => {
		httpTesting.verify();
	});

	it('given_responseHasResultEnvelope_when_intercepted_then_emitsValueOnly', () => {
		const domainValue = { id: 1, name: 'Bike' };
		const envelope = { value: domainValue, isSuccess: true, isFailure: false, error: { code: '', description: '', type: 0 } };

		let result: unknown;
		http.get(TEST_URL).subscribe((body) => {
			result = body;
		});

		httpTesting.expectOne(TEST_URL).flush(envelope);

		expect(result).toEqual(domainValue);
	});

	it('given_responseHasNoEnvelopeShape_when_intercepted_then_passesThroughUnchanged', () => {
		const plainBody = [{ state: 'SP', cities: ['São Paulo'] }];

		let result: unknown;
		http.get(TEST_URL).subscribe((body) => {
			result = body;
		});

		httpTesting.expectOne(TEST_URL).flush(plainBody);

		expect(result).toEqual(plainBody);
	});

	it('given_requestHasSkipUnwrapHeader_when_intercepted_then_bodyPreserved_and_headerStripped', () => {
		const envelope = { value: { id: 1 }, isSuccess: true, isFailure: false, error: {} };

		let result: unknown;
		http
			.get(TEST_URL, { headers: new HttpHeaders({ [SkipResultUnwrapHeader]: 'true' }) })
			.subscribe((body) => {
				result = body;
			});

		const testReq = httpTesting.expectOne(TEST_URL);
		expect(testReq.request.headers.has(SkipResultUnwrapHeader)).toBeFalse();
		testReq.flush(envelope);

		expect(result).toEqual(envelope);
	});

	it('given_errorResponse_when_intercepted_then_doesNotAttemptUnwrap', () => {
		const envelope = { value: null, isSuccess: false, isFailure: true, error: { code: 'NotFound', description: 'Not found', type: 2 } };

		let caught: unknown;
		http.get(TEST_URL).subscribe({
			next: () => fail('should not emit a value'),
			error: (err: unknown) => {
				caught = err;
			},
		});

		httpTesting.expectOne(TEST_URL).flush(envelope, { status: 404, statusText: 'Not Found' });

		expect(caught).toBeTruthy();
	});

	it('given_envelopeBody_when_intercepted_then_originalResponseInstanceNotMutated', (done) => {
		const domainValue = { id: 42 };
		const envelope = { value: domainValue, isSuccess: true, isFailure: false };
		const originalResponse = new HttpResponse<typeof envelope>({ body: envelope, status: 200 });

		const next = () => of(originalResponse);

		TestBed.runInInjectionContext(() => {
			resultUnwrapInterceptor({ headers: { has: () => false } } as any, next as any).subscribe(
				(emitted) => {
					expect(emitted).not.toBe(originalResponse);
					expect(originalResponse.body!.value).toEqual(domainValue);
					done();
				},
			);
		});
	});
});
