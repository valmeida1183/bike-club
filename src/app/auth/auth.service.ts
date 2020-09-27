import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, tap, switchMap, map } from 'rxjs/operators';
import { throwError, Subject, forkJoin, BehaviorSubject } from 'rxjs';

import { IAuthResponseData } from '../models/auth/IAuthResponseData';
import { AuthRequestData } from '../models/auth/authRequestData';
import { environment } from 'src/environments/environment';
import { User } from '../models/user.model';
import { AuthUserData } from '../models/auth/authUserData';

@Injectable({ providedIn: 'root' })
export class AuthService {
  authUserDataSubject = new BehaviorSubject<AuthUserData>(null);
  userSubject = new BehaviorSubject<User>(null);

  private singUpUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseApiKey}`;
  private signInUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseApiKey}`;
  private userUrl = `https://bike-club-cf635.firebaseio.com/users.json`;
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router) { }

  signUp(user: User) {
    return this.http.post<IAuthResponseData>(
      this.singUpUrl,
      new AuthRequestData(user.email, user.password, true)
    ).pipe(
      catchError(this.handleAuthError),
      tap(authResponseData => {
        this.createUser(user, authResponseData.idToken);
        this.handleAuthentication(authResponseData, user);
      })
    );
  }

  signIn(email: string, password: string) {
    const signIn$ = this.http.post<IAuthResponseData>(this.signInUrl, new AuthRequestData(email, password, true));
    const user$ = signIn$.pipe(switchMap(authResponseData => this.getUser(authResponseData.email, authResponseData.idToken)));

    // Vai unir os dois observables passará para o stream de dados um array contendo os dois responses de cada observable.
    return forkJoin(signIn$, user$).pipe(
      catchError(this.handleAuthError),
      tap(multipleResponse => {
        this.handleAuthentication(multipleResponse[0], multipleResponse[1]);
      })
    );
  }

  autoSignIn() {
    const storedUserData = JSON.parse(localStorage.getItem('bikeClubAuthUserData'));

    if (!storedUserData) {
      return;
    }

    const authUserData = new AuthUserData(storedUserData.email, storedUserData.id,
      storedUserData.role, storedUserData.token, new Date(storedUserData.tokenExpirationDate));

    if (authUserData.currentToken) {
      this.authUserDataSubject.next(authUserData);
      this.getUser(authUserData.email, authUserData.currentToken).subscribe(user => {
        this.userSubject.next(user);
      });

      // calcula o tempo restante que o token do user do localstorage está válido. (pois pode ter se logado a bastante tempo).
      const expirationDuration =
        new Date(storedUserData.tokenExpirationDate).getTime() -
        new Date().getTime();

      this.autoLogout(expirationDuration);

      if (this.router.url === '/') {
        this.router.navigate(['/shopping']);
      }
    }
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  logout() {
    this.authUserDataSubject.next(null);
    this.userSubject.next(null);

    this.router.navigate(['/login']);

    localStorage.removeItem('bikeClubAuthUserData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  private handleAuthentication(authResponseData: IAuthResponseData, user: User) {
    const currentTime = new Date().getTime();
    const expirationDate = new Date(currentTime + (+authResponseData.expiresIn * 1000));
    const authUserData = new AuthUserData(authResponseData.email,
      authResponseData.localId, user.roleName, authResponseData.idToken, expirationDate);

    this.authUserDataSubject.next(authUserData);
    this.userSubject.next(user);

    this.autoLogout(+authResponseData.expiresIn * 1000);

    localStorage.setItem('bikeClubAuthUserData', JSON.stringify(authUserData));
  }

  private handleAuthError(errorResponse: HttpErrorResponse) {
    let handledErrorMessage = 'An error has ocurred!';
    if (!errorResponse.error || !errorResponse.error.error) {
      return throwError(handledErrorMessage);
    }

    const responseErrorMessage = errorResponse.error.error.message;
    switch (responseErrorMessage) {
      case 'EMAIL_EXISTS':
        handledErrorMessage = 'This email exists already';
        break;
      case 'TOO_MANY_ATTEMPTS_TRY_LATER':
        handledErrorMessage = 'We have blocked all requests from this device due to unusual activity. Try again later.';
        break;
      case 'EMAIL_NOT_FOUND':
      case 'INVALID_PASSWORD':
        handledErrorMessage = 'Invalid login attempt';
        break;
    }
    return throwError(handledErrorMessage);
  }

  private createUser(user: User, token: string) {
    this.http.post(
      this.userUrl,
      user,
      { params: new HttpParams().set('auth', token) }
    ).subscribe(response => {
      console.log(response);
    });
  }

  private getUser(email: string, token: string) {
    return this.http.get<User>(
      `${this.userUrl}?orderBy="email"&equalTo="${email}"`,
      { params: new HttpParams().set('auth', token) })
      .pipe(
        map(user => {
          const userId = Object.keys(user)[0];
          return user[userId];
        })
      );
  }
}
