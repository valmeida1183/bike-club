import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import {
	MAT_DIALOG_DATA,
	MatDialogModule,
	MatDialogRef,
} from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
	selector: 'bc-simple-dialog',
	templateUrl: './simple-dialog.component.html',
	styleUrls: ['./simple-dialog.component.scss'],
	encapsulation: ViewEncapsulation.None,
	standalone: true,
	imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
})
export class SimpleDialogComponent implements OnInit {
	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		private dialogRef: MatDialogRef<SimpleDialogComponent>
	) {}

	ngOnInit() {}

	onClose() {
		this.dialogRef.close();
	}
}
