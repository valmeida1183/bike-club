import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, map, switchMap, concatMap, mergeMap } from 'rxjs/operators';
import { throwError, Subject, forkJoin } from 'rxjs';

import { IAuthResponseData } from '../models/auth/IAuthResponseData';
import { AuthRequestData } from '../models/auth/authRequestData';
import { environment } from 'src/environments/environment';
import { User } from '../models/user.model';
import { AuthUserData } from '../models/auth/authUserData';

@Injectable({ providedIn: 'root' })
export class AuthService {
  authUserDataSubject = new Subject<AuthUserData>();
  private singUpUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseApiKey}`;
  private signInUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseApiKey}`;
  private userUrl = `https://bike-club-cf635.firebaseio.com/users.json`;

  constructor(private http: HttpClient) { }

  signup(user: User) {
    return this.http.post<IAuthResponseData>(
      this.singUpUrl,
      new AuthRequestData(user.email, user.password, true)
    ).pipe(
      catchError(this.handleAuthError),
      tap(authResponseData => {
        this.createUser(user);
        this.handleAuthentication(authResponseData, user);
      })
    );
  }

  signIn(email: string, password: string) {
    const signIn$ = this.http.post<IAuthResponseData>(this.signInUrl, new AuthRequestData(email, password, true));
    const user$ = signIn$.pipe(switchMap(authResponseData => this.getUser(authResponseData.email)));

    // Vai unir os dois observables passará para o stream de dados um array contendo os dois responses de cada observable.
    return forkJoin(signIn$, user$).pipe(
      catchError(this.handleAuthError),
      tap(multipleResponse => {
        this.handleAuthentication(multipleResponse[0], multipleResponse[1]);
      })
    );

    /* return this.http.post<IAuthResponseData>(
      this.signInUrl,
      new AuthRequestData(email, password, true)
    ).pipe(
      catchError(this.handleAuthError),
      mergeMap(authResponseData => {
        return this.getUser(authResponseData.email);
      }),
      tap(authResponseData => {
        console.log(authResponseData);
        // this.handleAuthentication(authResponseData);
      }),
     /*  switchMap(authResponseData => {
        return this.getUser(authResponseData.email);
      }),
    ); */
  }

  private handleAuthentication(authResponseData: IAuthResponseData, user: User) {
    const currentTime = new Date().getTime();
    const expirationDate = new Date(currentTime + (+authResponseData.expiresIn * 1000));
    const authUserData = new AuthUserData(authResponseData.email,
      authResponseData.localId, user.userType, authResponseData.idToken, expirationDate);

    this.authUserDataSubject.next(authUserData);
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

  private createUser(user: User) {
    this.http.post(this.userUrl, user).subscribe(response => {
      console.log(response);
    });
  }

  private getUser(email: string) {
    return this.http.get<User>(`${this.userUrl}?orderBy="email"&equalTo="${email}"`);
  }
}
