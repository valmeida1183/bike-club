import { PaymentIntent } from './payment-intent.model';

export interface PaymentDialogData {
	title: string;
	paymentIntent: PaymentIntent | null;
}
