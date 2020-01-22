import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, Subject } from 'rxjs';

import { IAuthResponseData } from '../models/auth/IAuthResponseData';
import { AuthRequestData } from '../models/auth/authRequestData';
import { environment } from 'src/environments/environment';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  user = new Subject<User>();
  private singUpUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseApiKey}`;
  private signInUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseApiKey}`;

  constructor(private http: HttpClient) { }

  signup(user: User) {
    return this.http.post<IAuthResponseData>(
      this.singUpUrl,
      new AuthRequestData(user.email, user.password, true)
    ).pipe(
      catchError(this.handleAuthError),
      tap(response => {
        this.handleAuthentication(response, user);
      })
    );
  }

  signIn(email: string, password: string) {
    return this.http.post<IAuthResponseData>(
      this.signInUrl,
      new AuthRequestData(email, password, true)
    ).pipe(
      catchError(this.handleAuthError)
    );
  }

  private handleAuthentication(responseData: IAuthResponseData, user: User) {
    const currentTime = new Date().getTime();
    const expirationDate = new Date(currentTime + (+responseData.expiresIn * 1000));

    user.userId = responseData.localId;
    user.currentToken = responseData.idToken;
    user.currentTokenExpirationDate = expirationDate;

    this.user.next(user);
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

  /*  signup(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseApiKey}`,
      {
        email,
        password,
        returnSecureToken: true
      }
    ).pipe(
      // usando o operador catchError para capturar erros
      catchError(this.handleError),
      // Relembrando... o operador tap não interrompe, bloqueia ou altera o "observable chain",
      ele simplesmente permite rodar algum código com os dados retornados do observalbe./
      tap(responseData => {
        this.handleAuthentication(responseData);
      })
    );
  }
  */
}
