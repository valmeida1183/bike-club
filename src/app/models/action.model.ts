import { Action } from '@ngrx/store/src/models';

export class ActionModel implements Action {
    type: string;
    payload: any;
}
