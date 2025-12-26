import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { take, exhaustMap } from 'rxjs/operators';

import { AuthWebService } from './auth-web.service';

export const authInterceptor: HttpInterceptorFn = (request: HttpRequest<any>, next: HttpHandlerFn) => {
  const authWebService = inject(AuthWebService);

  return authWebService.authWebUserDataSubject.pipe(
    take(1),
    exhaustMap(authWebUserData => {
      if (!authWebUserData) {
        return next(request);
      }

      const modifedRequest = request.clone({
        setHeaders: {
          Authorization: `Bearer ${authWebUserData.currentToken()}`
        }
      });

      return next(modifedRequest);
    })
  );
};
