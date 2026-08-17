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
		userFullName: computed(
			() => `${store.user()?.name} ${store.user()?.lastName}`,
		),
		userRole: computed(() => store.user()?.roleName),
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
				const bikeClubAuthUserData = localStorage.getItem('bikeClubAuthUserData');
				const localstoredUserData: AuthResponse = bikeClubAuthUserData
					? JSON.parse(bikeClubAuthUserData)
					: null;

				if (!localstoredUserData) {
					return;
				}

				if (
					localstoredUserData.token &&
					localstoredUserData.expiresIn &&
					new Date() < new Date(localstoredUserData.expiresIn)
				) {
					// Restoring a session must not navigate — it would clobber whatever
					// route the user cold-booted into.
					this._handleAuthentication(localstoredUserData, false);
				} else {
					localStorage.removeItem('bikeClubAuthUserData');
				}
			},
			logout(): void {
				const timerId = store.logoutTimerId();

				if (timerId) {
					clearTimeout(timerId);
				}

				// Clear state before navigating so autoLoginGuard sees an
				// unauthenticated store and lets /account/login through.
				patchState(store, initialState);
				router.navigate(['/account/login']);
			},
			_handleAuthentication(
				response: AuthResponse,
				navigateHome = true,
			): void {
				const { user, token, expiresIn } = response;
				patchState(store, { user, token, expiresIn: new Date(expiresIn) });

				if (navigateHome) {
					router.navigate(['/home']);
				}
			},
		};
	}),
	withHooks({
		onInit(store) {
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

			// Keeps localStorage in sync with auth state. Navigation deliberately
			// lives at the transition points (_handleAuthentication / logout) instead:
			// this effect also runs on store init, so navigating here hijacked any
			// cold deep-link into the app.
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
				} else {
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
