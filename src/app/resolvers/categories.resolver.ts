import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Category } from '../models/category';
import { SelectOptionsService } from '../shared/select-options.service';

@Injectable({ providedIn: 'root'})
export class CategoriesResolver implements Resolve<Category[]> {
    constructor(private selectOptionsService: SelectOptionsService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Category[] | Observable<Category[]> | Promise<Category[]> {
        return this.selectOptionsService.getCategorySelectOption();
    }
}
