import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { PreloadAllModules, provideRouter, withPreloading, Routes } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';

import { requestParamsInterceptor } from './shared/request-params.interceptor'; // Updated import
import { authInterceptor } from './auth/auth.interceptor'; // Updated import
import { shoppingListReducer } from './store/reducers/shopping-list.reducer';
import { ShoppingListEffects } from './store/effects/shopping-list.effects';
import { shopCartReducer } from './store/reducers/shop-cart.reducer';
import { provideAnimations } from '@angular/platform-browser/animations';

import { APP_ROUTES } from './app.routes';

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(APP_ROUTES, withPreloading(PreloadAllModules)),
        provideHttpClient(withInterceptors([requestParamsInterceptor, authInterceptor])), // Use functional interceptors
        provideStore({
            shoppingList: shoppingListReducer,
            shopCart: shopCartReducer,
        }),
        provideEffects([ShoppingListEffects]),
        provideAnimations(),
    ]
};
