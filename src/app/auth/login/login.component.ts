import { Component, OnInit, viewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthWebService } from '../auth-web.service';
import { SpinnerService } from 'src/app/shared/spinner.service';
import { DialogService } from 'src/app/shared/dialog.service';
import { DialogType } from 'src/app/shared/simple-dialog/dialogType';

@Component({
	selector: 'bc-login',
	templateUrl: './login.component.html',
	styleUrls: ['../auth.component.scss'],
	standalone: false,
})
export class LoginComponent implements OnInit {
	readonly form = viewChild<NgForm>('form');

	constructor(
		private authWebService: AuthWebService,
		private router: Router,
		private spinnerService: SpinnerService,
		private dialogService: DialogService,
	) {}

	ngOnInit() {}

	onSubmit(): void {
		const form = this.form();
		if (form.invalid) {
			return;
		}

		this.spinnerService.showSpinner();
		const { email, password } = form.value;

		this.authWebService.signIn(email, password).subscribe(
			(response) => {
				this.spinnerService.hideSpinner();
				this.router.navigate(['/home']);
			},
			(errorMessage) => {
				this.dialogService.openDialog(
					DialogType.Error,
					'Sign In Error',
					errorMessage,
				);
				this.spinnerService.hideSpinner();
			},
		);

		form.resetForm();
	}
}
