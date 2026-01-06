import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Bike } from 'src/app/models/bike.model';
import { environment } from 'src/environments/environment';

@Injectable()
export class ShopApiService {
	private http = inject(HttpClient);
	private bikesEndpointUrl = `${environment.baseApiUrl}/bikes`;

	getBikes(filter: any): Observable<Bike[]> {
		return this.http.get<Bike[]>(this.bikesEndpointUrl, { params: filter });
	}
}
