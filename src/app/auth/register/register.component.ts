import { Component, OnInit, viewChild } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { User } from 'src/app/core/auth/models/user.model';
import { AuthWebService } from '../auth-web.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { Gender } from 'src/app/models/gender.model';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { DialogType } from 'src/app/shared/components/simple-dialog/dialogType';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

@Component({
	selector: 'bc-register',
	templateUrl: './register.component.html',
	styleUrls: ['../auth.component.scss'],
	standalone: true,
	imports: [
		CommonModule,
		FormsModule,
		RouterModule,
		MatCardModule,
		MatFormFieldModule,
		MatInputModule,
		MatSelectModule,
		MatButtonModule,
	],
})
export class RegisterComponent implements OnInit {
	readonly form = viewChild<NgForm>('form');
	genders: Gender[];

	constructor(
		private activatedRoute: ActivatedRoute,
		private authWebService: AuthWebService,
		private router: Router,
		private spinnerService: SpinnerService,
		private dialogService: DialogService,
	) {}

	ngOnInit() {
		this.genders = this.activatedRoute.snapshot.data.genders;
	}

	onSubmit(): void {
		const form = this.form();
		if (form.invalid) {
			return;
		}

		this.spinnerService.showSpinner();
		const { name, lastName, email, password, gender, phone } = form.value;
		const user = new User(
			0,
			name,
			lastName,
			email,
			password,
			gender,
			phone,
			null,
		);

		this.authWebService.signUp(user).subscribe(
			(response) => {
				this.spinnerService.hideSpinner();
				this.router.navigate(['/home']);
			},
			(errorMessage) => {
				this.dialogService.openDialog(
					DialogType.Error,
					'Sign Up Error',
					errorMessage,
				),
					this.spinnerService.hideSpinner();
			},
		);

		form.resetForm();
	}
}
