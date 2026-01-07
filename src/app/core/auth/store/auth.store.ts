import { computed, effect, inject, untracked } from '@angular/core';
import { Router } from '@angular/router';
import {
	patchState,
	signalStore,
	withComputed,
	withHooks,
	withMethods,
	withProps,
	withState,
} from '@ngrx/signals';

import { AuthResponse } from '../models/auth-response.model';
import { User } from '../models/user.model';
import { AuthApiService } from '../services/auth.api.service';
import { AuthState } from './auth.state';

const initialState: AuthState = {
	user: null,
	token: null,
	expiresIn: null,
	logoutTimerId: null,
};

export const AuthStore = signalStore(
	{ providedIn: 'root' },
	withState(initialState),
	withProps(() => {
		return {
			authApiService: inject(AuthApiService),
			router: inject(Router),
		};
	}),
	withComputed((store) => ({
		isAuthenticated: computed(() => {
			const tokeExpiresIn = store.expiresIn();

			if (tokeExpiresIn && new Date() > tokeExpiresIn) {
				return false;
			}

			return !!store.token();
		}),
		userFullName: computed(() => `${store.user?.name} ${store.user?.lastName}`),
		userRole: computed(() => store.user.roleName),
	})),
	withMethods(({ authApiService, router, ...store }) => {
		return {
			signUp(user: User): void {
				authApiService.signUp(user).subscribe({
					next: (response: AuthResponse) => {
						this._handleAuthentication(response);
					},
				});
			},
			signIn(email: string, password: string): void {
				authApiService.signIn(email, password).subscribe({
					next: (response: AuthResponse) => {
						this._handleAuthentication(response);
					},
				});
			},
			autoSignIn(): void {
				const localstoredUserData: AuthResponse = JSON.parse(
					localStorage.getItem('bikeClubAuthUserData'),
				);

				if (!localstoredUserData) {
					return;
				}

				if (
					localstoredUserData.token &&
					localstoredUserData.expiresIn &&
					new Date() < new Date(localstoredUserData.expiresIn)
				) {
					this._handleAuthentication(localstoredUserData);
				} else {
					localStorage.removeItem('bikeClubAuthUserData');
				}
			},
			logout(): void {
				const timerId = store.logoutTimerId();

				if (timerId) {
					clearTimeout(timerId);
				}

				patchState(store, initialState);
			},
			// 👇 private method
			_handleAuthentication(response: AuthResponse): void {
				const { user, token, expiresIn } = response;
				patchState(store, { user, token, expiresIn: new Date(expiresIn) });
			},
		};
	}),
	withHooks({
		onInit({ authApiService, router, ...store }) {
			store.autoSignIn();

			effect((onCleanup) => {
				const expiresIn = store.expiresIn();
				const token = store.token();

				if (!token || !expiresIn) {
					return;
				}

				const expirationDuration = expiresIn.getTime() - new Date().getTime();
				if (expirationDuration > 0) {
					const timerId = setTimeout(() => {
						store.logout();
					}, expirationDuration);

					patchState(store, { logoutTimerId: timerId });

					onCleanup(() => {
						clearTimeout(timerId);
					});
				} else {
					store.logout();
				}
			});

			effect(() => {
				if (store.isAuthenticated()) {
					untracked(() => {
						localStorage.setItem(
							'bikeClubAuthUserData',
							JSON.stringify({
								user: store.user(),
								token: store.token(),
								expiresIn: store.expiresIn(),
							}),
						);
					});

					router.navigate(['/home']);
				} else {
					router.navigate(['/account/login']);
					localStorage.removeItem('bikeClubAuthUserData');
				}
			});
		},
		onDestroy(store) {
			const timerId = store.logoutTimerId();

			if (timerId) {
				clearTimeout(timerId);
			}
		},
	}),
);
