import { DialogTypeEnum } from '../enums/dialog-type.enum';

export interface SimpleDialogData {
	title: string;
	type: DialogTypeEnum;
	message: string;
}
