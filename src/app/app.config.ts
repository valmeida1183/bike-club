import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import {
	PreloadAllModules,
	provideRouter,
	withPreloading,
} from '@angular/router';

import { requestParamsInterceptor } from './core/layout/interceptors/request-params.interceptor';

import { provideAnimations } from '@angular/platform-browser/animations';
import { errorHandlingInterceptor } from './core/errors/interceptors/error-handling.interceptor';
import { loadingInterceptor } from './core/layout/interceptors/loading.interceptor';

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
		provideAnimations(),
		{
			provide: MAT_DIALOG_DEFAULT_OPTIONS,
			useValue: { minWidth: '15vw', minHeight: '10vh', autoFocus: false },
		},
	],
};
