import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { State } from '../models/state.model';
import { City } from '../models/city.model';

@Injectable()
export class AddressApiService {
	private http = inject(HttpClient);
	private baseAddressFilePath = '../../../../assets/jsons/locality.json';

	getStates(): Observable<State[]> {
		return this.http.get<any>(this.baseAddressFilePath).pipe(
			map((data: any) => {
				const keys = Object.keys(data);
				const states: State[] = keys.map((key) => ({
					code: key,
					name: data[key],
				}));

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
