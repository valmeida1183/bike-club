import {
	patchState,
	signalStore,
	withMethods,
	withProps,
	withState,
} from '@ngrx/signals';
import { PaymentState } from './payment.state';
import { inject, Injector } from '@angular/core';
import {
	MatDialog,
	MatDialogConfig,
	MatDialogRef,
} from '@angular/material/dialog';
import { PaymentIntent } from '../models/payment-intent.model';
import { PaymentDialogComponent } from '../containers/payment-dialog.component';
import { PaymentDialogData } from '../models/payment-dialog-data.model';
import { PaymentApiService } from '../services/payment.api.service';

const initialState: PaymentState = {
	paymentIntent: null,
};

export const PaymentStore = signalStore(
	withState(initialState),
	withProps(() => ({
		matDialogService: inject(MatDialog),
		paymentApiService: inject(PaymentApiService),
		injectorContext: inject(Injector),
	})),
	withMethods((store) => {
		return {
			createPaymentIntent(shopCartId: number): void {
				const { paymentApiService } = store;

				paymentApiService.createPaymentIntent(shopCartId).subscribe({
					next: (response: PaymentIntent) => {
						patchState(store, { paymentIntent: response });
					},
				});

				// Mock
				// patchState(store, {
				// 	paymentIntent: {
				// 		amount: 6100.9,
				// 		clientSecret:
				// 			'pi_3UCpXZHORatcURcA1qcn30yc_secret_fWJwxL9kREI7aX877Zou2WhDe',
				// 	},
				// });
			},

			openPaymentDialog(
				title: string,
			): MatDialogRef<PaymentDialogComponent, string> {
				const { matDialogService } = store;

				const dialogConfig: MatDialogConfig<PaymentDialogData> = {
					width: '700px',
					disableClose: true,
					data: {
						title: title,
						paymentIntent: store.paymentIntent(),
					},
					// Pass the injector context to the dialog then it can inject the PaymentStore and knowing who is providing it (AddressStore)
					// and avoid creating a new instance of the store in the dialog component
					injector: store.injectorContext,
				};

				const dialogRef = matDialogService.open<
					PaymentDialogComponent,
					PaymentDialogData,
					string
				>(PaymentDialogComponent, dialogConfig);

				return dialogRef;
			},
		};
	}),
);
