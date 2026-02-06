import { Component, computed, inject, OnInit } from '@angular/core';
import { AccountCardComponent } from '../../components/account-card/account-card.component';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
	FormBuilder,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { Gender } from 'src/app/models/gender.model';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { matchValueValidator } from 'src/app/shared/validators/match-value/match-value.validator';
import { AuthStore } from 'src/app/core/auth/store/auth.store';
import { User } from 'src/app/core/auth/models/user.model';

@Component({
	selector: 'bc-register',
	imports: [
		AccountCardComponent,
		MatCardModule,
		MatFormFieldModule,
		MatInputModule,
		MatButtonModule,
		MatSelectModule,
		ReactiveFormsModule,
	],
	templateUrl: './register.component.html',
	styleUrl: '../account.component.scss',
})
export class RegisterComponent implements OnInit {
	private fb = inject(FormBuilder);
	private authStore = inject(AuthStore);
	private route = inject(ActivatedRoute);
	private routeData = toSignal(this.route.data);

	genders = computed(() => this.routeData().genders as Gender[]);

	registerForm: FormGroup;

	ngOnInit(): void {
		this.configureForm();
		this.registerForm.reset();
	}

	get email() {
		return this.registerForm.get('email');
	}

	get password() {
		return this.registerForm.get('password');
	}

	get confirmPassword() {
		return this.registerForm.get('confirmPassword');
	}

	get name() {
		return this.registerForm.get('name');
	}

	get lastName() {
		return this.registerForm.get('lastName');
	}

	get gender() {
		return this.registerForm.get('gender');
	}

	get phone() {
		return this.registerForm.get('phone');
	}

	onSubmit(): void {
		if (this.registerForm.invalid) {
			return;
		}

		const user = this.createUserModel();
		this.authStore.signUp(user);
	}

	private configureForm(): void {
		this.registerForm = this.fb.group(
			{
				email: [null, [Validators.required, Validators.email]],
				password: [null, [Validators.required, Validators.minLength(6)]],
				confirmPassword: [null, [Validators.required]],
				name: [null, [Validators.required, Validators.maxLength(50)]],
				lastName: [null, [Validators.required, Validators.maxLength(50)]],
				gender: [null, Validators.required],
				phone: [
					null,
					[
						Validators.required,
						Validators.pattern(/^(?:\()[0-9]{2}(?:\))\s?[0-9]{4,5}(?:-)[0-9]{4}$/),
					],
				],
			},
			{
				validators: matchValueValidator('password', 'confirmPassword'),
			},
		);
	}

	private createUserModel(): User {
		const { name, lastName, email, password, gender, phone } =
			this.registerForm.value;

		return new User(0, name, lastName, email, password, gender, phone);
	}
}
