import { Component, inject, OnInit } from '@angular/core';
import { AccountCardComponent } from '../../components/account-card/account-card.component';
import {
	FormBuilder,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { AuthStore } from 'src/app/core/auth/store/auth.store';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
	selector: 'bc-login',
	imports: [
		AccountCardComponent,
		MatCardModule,
		MatFormFieldModule,
		MatInputModule,
		MatButtonModule,
		ReactiveFormsModule,
	],
	templateUrl: './login.component.html',
	styleUrl: '../account.component.scss',
})
export class LoginComponent implements OnInit {
	fb = inject(FormBuilder);
	router = inject(Router);
	authStore = inject(AuthStore);

	loginForm: FormGroup;

	get email() {
		return this.loginForm.get('email');
	}

	get password() {
		return this.loginForm.get('password');
	}

	ngOnInit(): void {
		this.configureForm();
		this.loginForm.reset();
	}

	onSubmit(): void {
		if (this.loginForm.invalid) {
			return;
		}

		const { email, password } = this.loginForm.value;

		this.authStore.signIn(email, password);
	}

	private configureForm(): void {
		this.loginForm = this.fb.group({
			email: [null, [Validators.required, Validators.email]],
			password: [null, [Validators.required, Validators.minLength(6)]],
		});
	}
}
