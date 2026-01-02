import { inject, Injectable } from '@angular/core';
import {
	ActivatedRouteSnapshot,
	ResolveFn,
	RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { Gender } from '../../models/gender.model';
import { SelectOptionsApiService } from '../services/select-options.api.service';

@Injectable({ providedIn: 'root' })
export class GendersResolver {
	constructor(private selectOptionsApiService: SelectOptionsApiService) {}

	resolve(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot,
	): Observable<Gender[]> {
		return this.selectOptionsApiService.getGenderSelectOption();
	}
}

export const gendersResolverFn: ResolveFn<Gender[]> = (
	route: ActivatedRouteSnapshot,
	state: RouterStateSnapshot,
) => {
	const selectOptionsApiService = inject(SelectOptionsApiService);

	return selectOptionsApiService.getGenderSelectOption();
};
