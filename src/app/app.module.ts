import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';

import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { AppComponent } from './app.component';

import { MainComponent } from './main/main.component';
import { MainNavComponent } from './main/main-nav/main-nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { AboutComponent } from './main/main-nav/about/about.component';
import { AuthInterceptor } from './auth/auth.interceptor';
import { RequestParamsInterceptor } from './shared/request-params.interceptor';
import { shoppingListReducer } from './store/reducers/shopping-list.reducer';


@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    MainNavComponent,
    AboutComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    LayoutModule,
    HttpClientModule,
    StoreModule.forRoot({shoppingList: shoppingListReducer})
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: RequestParamsInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
