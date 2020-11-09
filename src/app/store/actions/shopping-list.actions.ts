import { createAction, props } from '@ngrx/store';
import { Bike } from 'src/app/models/bike.model';

export const loadBikes = createAction('[Shopping List] Load Bikes', props<{ bike: any}>());
export const loadBikesSuccess = createAction('[Shopping List] Load Bikes Success', props<{ bikes: Bike[]}>());
export const loadBikesFailed = createAction('[Shopping List]Load Bikes Failed', props<{ errorMsg: string }>());
