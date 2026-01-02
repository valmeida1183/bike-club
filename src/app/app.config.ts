import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import {
	PreloadAllModules,
	provideRouter,
	withPreloading,
} from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';

import { requestParamsInterceptor } from './shared/request-params.interceptor';

import { loadingInterceptor } from './core/layout/interceptors/loading.interceptor';
import { errorHandlingInterceptor } from './core/errors/interceptors/error-handling.interceptor';
import { shoppingListReducer } from './store/reducers/shopping-list.reducer';
import { ShoppingListEffects } from './store/effects/shopping-list.effects';
import { shopCartReducer } from './store/reducers/shop-cart.reducer';
import { provideAnimations } from '@angular/platform-browser/animations';

import { APP_ROUTES } from './app.routes';
import { authInterceptor } from './core/auth/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
	providers: [
		provideZoneChangeDetection({ eventCoalescing: true }),
		provideRouter(APP_ROUTES, withPreloading(PreloadAllModules)),
		provideHttpClient(
			withInterceptors([
				requestParamsInterceptor,
				authInterceptor,
				loadingInterceptor,
				errorHandlingInterceptor,
			]),
		),
		provideStore({
			shoppingList: shoppingListReducer,
			shopCart: shopCartReducer,
		}),
		provideEffects([ShoppingListEffects]),
		provideAnimations(),
		{
			provide: MAT_DIALOG_DEFAULT_OPTIONS,
			useValue: { minWidth: '15vw', minHeight: '10vh', autoFocus: false },
		},
	],
};
