import { DialogTypeEnum } from '../../../shared/enums/dialog-type.enum';

export interface LayoutState {
	isLoading: boolean;
	_dialogTypeCssMap: Map<DialogTypeEnum, string>; // _ means that it is a private property in signal store
}
