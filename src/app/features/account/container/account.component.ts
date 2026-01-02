import { Component, effect, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { Router, RouterModule } from '@angular/router';
import { AuthStore } from 'src/app/core/auth/store/auth.store';

@Component({
	selector: 'bc-account',
	imports: [MatToolbar, MatToolbarRow, RouterModule, MatButtonModule],
	templateUrl: './account.component.html',
	styleUrl: './account.component.scss',
})
export class AccountComponent {
	// authStore = inject(AuthStore);
	// router = inject(Router);

	constructor() {
		// effect(() => {
		// 	if (this.authStore.isAuthenticated()) {
		// 		//this.router.navigateByUrl('/home');
		// 		this.router.navigate(['/home']);
		// 	}
		// });
	}
}
