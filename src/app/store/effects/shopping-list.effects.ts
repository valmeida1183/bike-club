import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { Bike } from 'src/app/models/bike.model';
import { HttpParamsHelper } from 'src/app/helpers/http-params.helper';
import { environment } from 'src/environments/environment';
import * as ShoppingListActions from '../actions/shopping-list.actions';

@Injectable()
export class ShoppingListEffects {
  loadBikes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ShoppingListActions.loadBikes),
      switchMap((action) => {
        const bikesUrl = `${environment.baseApiUrl}/bikes`;
        const httpParams = HttpParamsHelper.createHttpQueryParams(action.query);

        return this.http.get<Bike[]>(bikesUrl, { params: httpParams }).pipe(
          map((bikes: Bike[]) =>
            ShoppingListActions.loadBikesSuccess({ bikes })
          ),
          catchError((error) =>
            of(ShoppingListActions.loadBikesFailed({ errorMsg: error.message }))
          )
        );
      })
    )
  );

  constructor(private actions$: Actions, private http: HttpClient) {}
}
