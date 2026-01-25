import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Bike } from '../../models/bike.model';

@Injectable()
export class ShoppingDetailsApiService {
	private http = inject(HttpClient);
	private bikesEndpointUrl = `${environment.baseApiUrl}/bikes`;

	getBike(id: number): Observable<Bike> {
		return this.http.get<Bike>(`${this.bikesEndpointUrl}/${id}`);
	}
}
