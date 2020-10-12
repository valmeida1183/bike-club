import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Gender } from 'src/app/models/gender.model';
import { SelectOptionsService } from 'src/app/shared/select-options.service';

@Injectable({ providedIn: 'root'})
export class RegisterResolver implements Resolve<Gender[]> {
    constructor(private selectOptionsService: SelectOptionsService) {}

    // os parâmetros não sou usados, mas estão como exemplo do que pode ser passado
    // são usados para pegar parâmetros da state ex: querystring, route params...
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.selectOptionsService.getGenderSelectOption();
    }
}
