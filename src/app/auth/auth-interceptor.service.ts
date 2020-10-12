import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpParams } from '@angular/common/http';
import { take, exhaustMap } from 'rxjs/operators';

import { AuthService } from './auth.service';
import { AuthWebService } from './auth-web.service';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private authWebService: AuthWebService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    return this.authWebService.authWebUserDataSubject.pipe(
      take(1),
      exhaustMap(authWebUserData => {
        if (!authWebUserData) {
          return next.handle(request);
        }

        const modifedRequest = request.clone({
          setHeaders: {
            Authorization: `Bearer ${authWebUserData.currentToken()}`
          }
        });

        return next.handle(modifedRequest);
      })
    );
  }
}
