import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Category } from '../models/category.model';
import { SelectOptionsService } from '../shared/services/select-options.service';

@Injectable({ providedIn: 'root' })
export class CategoriesResolver {
	constructor(private selectOptionsService: SelectOptionsService) {}

	resolve(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot,
	): Category[] | Observable<Category[]> | Promise<Category[]> {
		return this.selectOptionsService.getCategorySelectOption();
	}
}
