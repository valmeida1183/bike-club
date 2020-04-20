import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpParams } from '@angular/common/http';
import { take, exhaustMap } from 'rxjs/operators';

import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    return this.authService.authUserDataSubject.pipe(
      take(1),
      exhaustMap(authUserData => {
        if (!authUserData) {
          return next.handle(request);
        }

        const modifedRequest = request.clone({
          params: new HttpParams().set('auth', authUserData.currentToken)
        });

        return next.handle(modifedRequest);
      })
    );
  }
}
