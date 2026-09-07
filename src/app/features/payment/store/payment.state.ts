import { PaymentIntent } from '../models/payment-intent.model';

export interface PaymentState {
	paymentIntent: PaymentIntent | null;
}
