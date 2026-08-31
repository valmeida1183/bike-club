import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { PaymentIntentResponse } from '../models/payment-intent.model';

@Injectable({
	providedIn: 'root',
})
export class PaymentApiService {
	private http = inject(HttpClient);
	private paymentEndpointUrl = `${environment.baseApiUrl}/payments`;

	createPaymentIntent(shopCartId: number): Observable<PaymentIntentResponse> {
		return this.http.post<PaymentIntentResponse>(
			`${this.paymentEndpointUrl}/intents`,
			{ shopCartId },
		);
	}
}
