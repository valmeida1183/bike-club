import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthWebService } from '../auth/auth-web.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authWebService: AuthWebService,
              private router: Router) { }

  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this.authWebService.authWebUserDataSubject
      .pipe(map(authWebUserData => {
        const isAuth = !!authWebUserData;
        if (isAuth) {
          return true;
        }

        return this.router.createUrlTree(['/login']);
      }));
  }
}
