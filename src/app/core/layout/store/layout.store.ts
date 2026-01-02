import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { LayoutState } from './layout.state';
import { inject } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogTypeEnum } from '../enums/dialog-type.enum';
import { SimpleDialogComponent } from 'src/app/shared/components/simple-dialog/simple-dialog.component';

const initialState: LayoutState = {
	isLoading: false,
	_dialogTypeCssMap: new Map<DialogTypeEnum, string>([
		[DialogTypeEnum.ERROR, 'error-dialog'],
		[DialogTypeEnum.WARN, 'warning-dialog'],
		[DialogTypeEnum.INFO, 'info-dialog'],
		[DialogTypeEnum.SUCCESS, 'info-dialog'],
	]),
};

export const LayoutStore = signalStore(
	{ providedIn: 'root' },
	withState(initialState),
	withMethods((store) => {
		const matDialogService = inject(MatDialog);

		return {
			showLoading(): void {
				patchState(store, { isLoading: true });
			},
			hideLoading(): void {
				patchState(store, { isLoading: false });
			},
			openMessageDialog(
				type: DialogTypeEnum,
				title: string,
				message: string,
			): void {
				const dialogConfig = new MatDialogConfig();
				const simpleDialogCssClass = 'simple-dialog';
				const dialogTypeCssMap = store._dialogTypeCssMap();
				const typeDialogCssClass = dialogTypeCssMap.get(type);

				if (!dialogTypeCssMap.has(type)) {
					return;
				}

				dialogConfig.panelClass = [simpleDialogCssClass, typeDialogCssClass];
				dialogConfig.data = {
					type,
					title,
					message,
				};

				matDialogService.open(SimpleDialogComponent, dialogConfig);
			},
		};
	}),
);
