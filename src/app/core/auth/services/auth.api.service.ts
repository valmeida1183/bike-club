import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { environment } from 'src/environments/environment';
import { AuthResponse } from '../models/auth-response.model';
import { Observable } from 'rxjs';
import { Result } from '../../api/models/result';

@Injectable({
	providedIn: 'root',
})
export class AuthApiService {
	http = inject(HttpClient);

	signUp(user: User): Observable<Result<AuthResponse>> {
		const registerUrl = `${environment.baseApiUrl}/accounts/register`;

		return this.http.post<Result<AuthResponse>>(registerUrl, user);
	}

	signIn(email: string, password: string) {
		const loginUrl = `${environment.apiUrl}/${environment.apiVersion}/accounts/login`;

		return this.http.post<Result<AuthResponse>>(loginUrl, { email, password });
	}
}
