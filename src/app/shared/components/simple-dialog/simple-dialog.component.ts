import {
	Component,
	OnInit,
	Inject,
	ViewEncapsulation,
	inject,
} from '@angular/core';
import {
	MAT_DIALOG_DATA,
	MatDialogModule,
	MatDialogRef,
} from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SimpleDialogData } from '../../models/simple-dialog-data.model';
import { DialogTypeEnum } from '../../enums/dialog-type.enum';

@Component({
	selector: 'bc-simple-dialog',
	templateUrl: './simple-dialog.component.html',
	styleUrls: ['./simple-dialog.component.scss'],
	encapsulation: ViewEncapsulation.None, //TODO find another alternative to turn of view encapsulation
	standalone: true,
	imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
})
export class SimpleDialogComponent {
	dialogRef = inject(MatDialogRef<SimpleDialogComponent>);
	data = inject<SimpleDialogData>(MAT_DIALOG_DATA);

	dialogTypeEnum = DialogTypeEnum;

	onClose() {
		this.dialogRef.close();
	}
}
