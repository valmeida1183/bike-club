import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Gender } from '../models/gender.model';
import { SelectOptionsService } from '../shared/select-options.service';

@Injectable({ providedIn: 'root'})
export class GendersResolver  {
    constructor(private selectOptionsService: SelectOptionsService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Gender[] | Observable<Gender[]> | Promise<Gender[]> {
        return this.selectOptionsService.getGenderSelectOption();
    }
}
