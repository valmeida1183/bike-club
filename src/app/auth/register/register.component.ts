import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute , Router } from '@angular/router';

import { User } from 'src/app/models/user.model';
import { AuthWebService } from '../auth-web.service';
import { SpinnerService } from 'src/app/shared/spinner.service';
import { Gender } from 'src/app/models/gender.model';
import { DialogService } from 'src/app/shared/dialog.service';
import { DialogType } from 'src/app/shared/simple-dialog/dialogType';

@Component({
  selector: 'bc-register',
  templateUrl: './register.component.html',
  styleUrls: ['../auth.component.scss']
})
export class RegisterComponent implements OnInit {
  @ViewChild('form') form: NgForm;
  genders: Gender[];

  constructor(private activatedRoute: ActivatedRoute ,
              private authWebService: AuthWebService,
              private router: Router,
              private spinnerService: SpinnerService,
              private dialogService: DialogService) { }

  ngOnInit() {
    this.genders = this.activatedRoute.snapshot.data.genders;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    this.spinnerService.showSpinner();
    const { name, lastName, email, password, gender, phone } = this.form.value;
    const user = new User(0, name, lastName, email, password, gender, phone, null);

    this.authWebService.signUp(user).subscribe(response => {
      this.spinnerService.hideSpinner();
      this.router.navigate(['/shopping']);
    }, errorMessage => {
      this.dialogService.openDialog(DialogType.Error, 'Sign Up Error', errorMessage),
      this.spinnerService.hideSpinner();
    });

    this.form.resetForm();
  }
}
