import { Component, OnInit, viewChild } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AuthWebService } from '../auth-web.service';
import { SpinnerService } from 'src/app/shared/spinner.service';
import { DialogService } from 'src/app/shared/dialog.service';
import { DialogType } from 'src/app/shared/simple-dialog/dialogType';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
	selector: 'bc-login',
	templateUrl: './login.component.html',
	styleUrls: ['../auth.component.scss'],
	standalone: true,
	imports: [
		CommonModule,
		FormsModule,
		MatCardModule,
		MatFormFieldModule,
		MatInputModule,
		MatButtonModule,
		RouterModule,
	],
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
