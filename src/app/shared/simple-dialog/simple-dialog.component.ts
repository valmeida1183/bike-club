import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
    selector: 'bc-simple-dialog',
    templateUrl: './simple-dialog.component.html',
    styleUrls: ['./simple-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: false
})
export class SimpleDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<SimpleDialogComponent>) {}

  ngOnInit() {
  }

  onClose() {
    this.dialogRef.close();
  }
}
