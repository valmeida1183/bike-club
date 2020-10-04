import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Gender } from 'src/app/models/gender.model';
import { SelectOptionsService } from 'src/app/shared/select-options.service';

@Injectable({ providedIn: 'root'})
export class RegisterResolver implements Resolve<Gender[]> {
    constructor(private selectOptionsService: SelectOptionsService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.selectOptionsService.getGenderSelectOption();
    }
}
