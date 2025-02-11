import { Component, OnInit, OnDestroy } from '@angular/core';
import { SpinnerService } from './shared/spinner.service';
import { Subscription } from 'rxjs';
import { AuthWebService } from './auth/auth-web.service';

@Component({
    selector: 'bc-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'bike-club';
  loadingSubscription: Subscription;
  isLoading = false;

  constructor(
    private spinnerService: SpinnerService,
    private authWebService: AuthWebService,
  ) {}

  ngOnInit(): void {
    this.loadingSubscription = this.spinnerService.isLoading.subscribe(
      (toggleValue) => {
        this.isLoading = toggleValue;
      },
    );

    this.authWebService.autoSignIn();
  }

  ngOnDestroy(): void {
    this.loadingSubscription.unsubscribe();
  }
}
