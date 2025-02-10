import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class RequestParamsInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const keys: string[] = request.params.keys();

    if (keys.length > 0) {
      let newParams = request.params;

      for (const key of keys) {
        const value = newParams.get(key);

        if (value === null || value === undefined || value === '') {
          newParams = newParams.delete(key, value);
        }
      }

      const modifedRequest: HttpRequest<any> = request.clone({ params: newParams });

      return next.handle(modifedRequest);
    }

    return next.handle(request);
  }
}
