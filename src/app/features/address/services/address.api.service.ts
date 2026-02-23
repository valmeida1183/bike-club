import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { City } from '../models/city.model';
import { State } from '../models/state.model';

@Injectable()
export class AddressApiService {
	private http = inject(HttpClient);
	private baseAddressFilePath = '../../../../assets/jsons/locality.json';
	private addressesEndpointUrl = `${environment.baseApiUrl}/addresses`;

	getStates(): Observable<State[]> {
		return this.http.get<any>(this.baseAddressFilePath).pipe(
			map((data: any) => {
				const keys = Object.keys(data);
				const states: State[] = keys.map((key) => {
					const stateName = data[key]?.name || key;

					return {
						code: key,
						name: stateName,
					};
				});

				return states;
			}),
		);
	}

	getCities(stateCode: string): Observable<City[]> {
		return this.http.get<any>(`${this.baseAddressFilePath}`).pipe(
			map((data: any) => {
				const citiesData = data[stateCode]?.cities || [];
				const cities: City[] = citiesData.map((city: string) => ({
					name: city,
					stateCode: stateCode,
				}));

				return cities;
			}),
		);
	}
}
