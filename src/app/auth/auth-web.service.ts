import { AuthRequestData } from '../models/auth/authRequestData';
import { AuthWebUserData } from '../models/auth/authWebUserData';
import { environment } from 'src/environments/environment';
import { User } from '../core/auth/models/user.model';

import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthWebService {
	authWebUserDataSubject = new BehaviorSubject<AuthWebUserData>(null);
	private tokenExpirationTimer: any;

	constructor(
		private http: HttpClient,
		private router: Router,
	) {}

	signUp(user: User) {
		const registerUrl = `${environment.baseApiUrl}/accounts/register`;

		return this.http.post<AuthWebUserData>(registerUrl, user).pipe(
			catchError(this.handleAuthError),
			tap((response) => {
				this.handleAuthentication(response);
			}),
		);
	}

	signIn(email: string, password: string) {
		const loginUrl = `${environment.apiUrl}/${environment.apiVersion}/accounts/login`;

		return this.http
			.post<AuthWebUserData>(loginUrl, new AuthRequestData(email, password))
			.pipe(
				catchError(this.handleAuthError),
				tap((response) => {
					this.handleAuthentication(response);
				}),
			);
	}

	autoSignIn() {
		const storedUserData = JSON.parse(
			localStorage.getItem('bikeClubAuthUserData'),
		);

		if (!storedUserData) {
			return;
		}

		const authWebUserData = new AuthWebUserData(
			storedUserData.user,
			new Date(storedUserData.expiresIn),
			storedUserData.token,
		);

		if (authWebUserData.currentToken()) {
			this.authWebUserDataSubject.next(authWebUserData);

			this.autoLogout(new Date(storedUserData.expiresIn));
		}
	}

	logout() {
		this.authWebUserDataSubject.next(null);
		this.router.navigate(['/login']);

		localStorage.removeItem('bikeClubAuthUserData');
		if (this.tokenExpirationTimer) {
			clearTimeout(this.tokenExpirationTimer);
		}
		this.tokenExpirationTimer = null;
	}

	private autoLogout(expirationDate: Date) {
		// calcula o tempo restante que o token do user do localstorage está válido. (pois pode ter se logado a bastante tempo).
		const expirationDuration = expirationDate.getTime() - new Date().getTime();

		this.tokenExpirationTimer = setTimeout(() => {
			this.logout();
		}, expirationDuration);
	}

	private handleAuthentication(response: any) {
		const authWebUserData = new AuthWebUserData(
			response.user,
			new Date(response.expiresIn),
			response.token,
		);

		const expirationDate = new Date(authWebUserData.expiresIn);

		this.authWebUserDataSubject.next(authWebUserData);

		this.autoLogout(expirationDate);

		localStorage.setItem('bikeClubAuthUserData', JSON.stringify(authWebUserData));
	}

	private handleAuthError(errorResponse: HttpErrorResponse) {
		const defaultErrorMessage = 'An error has ocurred!';
		const errorMessage =
			errorResponse && errorResponse.error && errorResponse.error.message
				? errorResponse.error.message
				: defaultErrorMessage;

		return throwError(() => new Error(errorMessage));
	}
}
