import { createReducer, on } from '@ngrx/store';
import { loadBikes } from '../actions/shopping-list.actions';

const initialState = [
        {
            id: 1,
            gears: 18,
            frameSize: 17.5,
            rimSize: 27.5,
            model: 'Silver Mountain',
            description: 'The classic mountain bike. Equipped with front suspension, V-Brake and aluminum frame.',
            price: 600.90,
            image: 'mountain1.png',
            genderCode: 'M',
            categoryId: 2,
            purchases: null,
            gender: null,
            category: null
        },
        {
            id: 2,
            gears: 10,
            frameSize: 17.5,
            rimSize: 27.5,
            model: 'Mechanical Orange',
            description: 'Versatile model, classified as hybrid. Equipped with front suspension, V-Brake, aluminum frame.',
            price: 450.90,
            image: 'mountain2.png',
            genderCode: 'M',
            categoryId: 3,
            purchases: null,
            gender: null,
            category: null
        }
    ];

export const shoppingListReducer = createReducer(initialState,
    on(loadBikes, (state, { bike }) => ({
        ...state
    }))
);
