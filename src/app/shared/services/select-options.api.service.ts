import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { Category } from '../../models/category.model';
import { Gender } from '../../models/gender.model';

@Injectable({ providedIn: 'root' })
export class SelectOptionsApiService {
	constructor(private http: HttpClient) {}

	getGenderSelectOption(): Observable<Gender[]> {
		return this.http.get<Gender[]>(`${environment.baseApiUrl}/genders`);
	}

	getCategorySelectOption(): Observable<Category[]> {
		return this.http.get<Category[]>(`${environment.baseApiUrl}/categories`);
	}
}
