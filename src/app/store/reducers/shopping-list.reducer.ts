import { createReducer, on } from '@ngrx/store';
import { Bike } from 'src/app/models/bike.model';
import { loadBikes, loadBikesFailed, loadBikesSuccess } from '../actions/shopping-list.actions';

const initialState = {
    bikes: [],
    errorMessage: null
};

export const shoppingListReducer = createReducer(initialState,
    on(loadBikesSuccess, (state, {bikes}) => ({
        ...state,
        bikes,
        errorMessage: null
    })),
    on(loadBikesFailed, (state, {errorMsg}) => ({
        ...state,
        bikes: null,
        errorMessage: errorMsg
    }))
);
