import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { Router } from '@angular/router';

import { User } from 'src/app/models/user.model';
import { AuthService } from '../auth.service';
import { SimpleDialogComponent } from 'src/app/shared/simple-dialog/simple-dialog.component';
import { SpinnerService } from 'src/app/shared/spinner.service';

@Component({
  selector: 'bc-register',
  templateUrl: './register.component.html',
  styleUrls: ['../auth.component.scss']
})
export class RegisterComponent implements OnInit {
  @ViewChild('form', {static: false}) form: NgForm;

  // TODO buscar do BE e colocar em  um resolve antes de acessar a rota
  genders = [
    { gender: 'M', description: 'Male'},
    { gender: 'F', description: 'Female'}
  ];

  constructor(private authService: AuthService,
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
    const { name, lastName, email, password, gender, phone } = this.form.value;
    const user = new User(null, name, lastName, email, password, gender, phone, 'Biker');

    this.authService.signup(user).subscribe(response => {
      console.log(response);
      this.spinnerService.hideSpinner();
      this.router.navigate(['/main']);
    }, errorMessage => {
      this.openErrorDialog(errorMessage);
      this.spinnerService.hideSpinner();
    });

    this.form.resetForm();
  }

  private openErrorDialog(errorMessage): void {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.panelClass = ['simple-dialog', 'error-dialog'];
    dialogConfig.data =  {
      type: 'error',
      title: 'Sign Up Error',
      message: errorMessage
    };

    this.dialog.open(SimpleDialogComponent, dialogConfig);
  }
}
