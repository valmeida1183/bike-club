import { inject, Injectable } from '@angular/core';
import {
	ActivatedRouteSnapshot,
	ResolveFn,
	RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { Category } from '../../models/category.model';
import { SelectOptionsApiService } from '../services/select-options.api.service';

@Injectable({ providedIn: 'root' })
export class CategoriesResolver {
	constructor(private selectOptionsApiService: SelectOptionsApiService) {}

	resolve(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot,
	): Observable<Category[]> {
		return this.selectOptionsApiService.getCategorySelectOption();
	}
}

export const categoriesResolverFn: ResolveFn<Category[]> = (
	route: ActivatedRouteSnapshot,
	state: RouterStateSnapshot,
) => {
	const selectOptionsApiService = inject(SelectOptionsApiService);

	return selectOptionsApiService.getCategorySelectOption();
};
