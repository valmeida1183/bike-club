import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { environment } from 'src/environments/environment';
import { AuthResponse } from '../models/auth-response.model';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class AuthApiService {
	http = inject(HttpClient);

	signUp(user: User): Observable<AuthResponse> {
		const registerUrl = `${environment.baseApiUrl}/accounts/register`;

		return this.http.post<AuthResponse>(registerUrl, user);
	}

	signIn(email: string, password: string) {
		const loginUrl = `${environment.apiUrl}/${environment.apiVersion}/accounts/login`;

		return this.http.post<AuthResponse>(loginUrl, { email, password });
	}
}
