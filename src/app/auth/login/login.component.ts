import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { AuthWebService } from '../auth-web.service';
import { SimpleDialogComponent } from 'src/app/shared/simple-dialog/simple-dialog.component';
import { SpinnerService } from 'src/app/shared/spinner.service';

@Component({
  selector: 'bc-login',
  templateUrl: './login.component.html',
  styleUrls: ['../auth.component.scss']
})
export class LoginComponent implements OnInit {
  @ViewChild('form') form: NgForm;

  constructor(private authWebService: AuthWebService,
              private dialog: MatDialog,
              private router: Router,
              private spinnerService: SpinnerService) { }

  ngOnInit() {
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }
    this.spinnerService.showSpinner();
    const { email, password } = this.form.value;

    this.authWebService.signIn(email, password).subscribe(response => {
      console.log(response);
      this.spinnerService.hideSpinner();
      this.router.navigate(['/shopping']);
    }, errorMessage => {
      this.openErrorDialog(errorMessage);
      this.spinnerService.hideSpinner();
    });

    this.form.resetForm();
  }

  private openErrorDialog(errorMessage): void {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.panelClass = ['simple-dialog', 'error-dialog'];
    dialogConfig.data = {
      type: 'error',
      title: 'Sign In Error',
      message: errorMessage
    };

    this.dialog.open(SimpleDialogComponent, dialogConfig);
  }
}
