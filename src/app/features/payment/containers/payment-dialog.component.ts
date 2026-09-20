import {
	AfterViewInit,
	Component,
	ElementRef,
	inject,
	signal,
	viewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
	MAT_DIALOG_DATA,
	MatDialogModule,
	MatDialogRef,
} from '@angular/material/dialog';
import { loadStripe, Stripe, StripeElements } from '@stripe/stripe-js';
import { environment } from 'src/environments/environment';

@Component({
	selector: 'bc-payment-dialog',
	imports: [MatDialogModule, MatButtonModule],
	templateUrl: './payment-dialog.component.html',
	styleUrl: './payment-dialog.component.scss',
})
export class PaymentDialogComponent implements AfterViewInit {
	private dialogRef = inject(MatDialogRef<PaymentDialogComponent>);
	private data = inject<any>(MAT_DIALOG_DATA);
	protected readonly title = this.data.title;

	paymentElementRef = viewChild<ElementRef<HTMLDivElement>>('paymentElement');
	isConfirming = signal(false);
	paymentError = signal<string | null>(null);

	private stripe: Stripe | null = null;
	private stripeElements: StripeElements | null = null;

	ngAfterViewInit(): void {
		this.mountPaymentElement();
	}

	onCancel(): void {
		this.dialogRef.close();
	}

	async onConfirmPayment(): Promise<void> {
		if (!this.stripe || !this.stripeElements) {
			return;
		}

		this.isConfirming.set(true);
		this.paymentError.set(null);

		const { error: stripeError } = await this.stripeElements.submit();

		if (stripeError) {
			this.paymentError.set(
				stripeError.message ?? 'Please check your card details.',
			);
			this.isConfirming.set(false);
			return;
		}

		const { error, paymentIntent } = await this.stripe.confirmPayment({
			elements: this.stripeElements,
			confirmParams: {
				return_url: window.location.href,
			},
			redirect: 'if_required',
		});

		this.isConfirming.set(false);

		if (error) {
			this.paymentError.set(
				error.message ?? 'An error occurred during payment confirmation.',
			);
			return;
		}

		if (paymentIntent && paymentIntent.status === 'succeeded') {
			console.info('Payment succeeded:', paymentIntent.id);
			console.log('PaymentId length:', paymentIntent.id.length);
			this.dialogRef.close(paymentIntent.id);
		}
	}

	private async mountPaymentElement(): Promise<void> {
		const paymentElement = this.paymentElementRef();
		const { clientSecret } = this.data.paymentIntent;

		this.stripe = await loadStripe(environment.stripePublishableKey);

		if (!clientSecret || !this.stripe || !paymentElement) {
			return;
		}

		this.stripeElements = this.stripe.elements({ clientSecret });
		this.stripeElements.create('payment').mount(paymentElement.nativeElement);
	}
}
