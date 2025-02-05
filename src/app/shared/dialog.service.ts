import { Injectable } from '@angular/core';
import { MatLegacyDialog as MatDialog, MatLegacyDialogConfig as MatDialogConfig } from '@angular/material/legacy-dialog';

import { SimpleDialogComponent } from './simple-dialog/simple-dialog.component';

@Injectable({ providedIn: 'root' })
export class DialogService {
  private panelClasses = {
    Error: 'error-dialog',
    Warning: 'warning-dialog',
    Information: 'info-dialog'
  };

  constructor(private dialog: MatDialog) { }

  openDialog(type: string, title: string, message: string) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.panelClass = ['simple-dialog', this.panelClasses[type]];
    dialogConfig.data = {
      type,
      title,
      message
    };

    this.dialog.open(SimpleDialogComponent, dialogConfig);
  }
}
