import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PaymentIntent } from '../models/payment-intent.model';

@Injectable()
export class PaymentApiService {
	private http = inject(HttpClient);
	private paymentEndpointUrl = `${environment.baseApiUrl}/payment`;

	createPaymentIntent(shopCartId: number): Observable<PaymentIntent> {
		return this.http.post<PaymentIntent>(`${this.paymentEndpointUrl}/intents`, {
			shopCartId,
		});
	}
}
