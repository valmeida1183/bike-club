import { DialogTypeEnum } from '../enums/dialog-type.enum';

export interface LayoutState {
	isLoading: boolean;
	cartCounter: number;
	_dialogTypeCssMap: Map<DialogTypeEnum, string>; // _ means that it is a private property in signal store
}
