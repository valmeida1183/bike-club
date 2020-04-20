import { Component, OnInit, OnDestroy } from '@angular/core';
import { SpinnerService } from './shared/spinner.service';
import { Subscription } from 'rxjs';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'bc-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy   {
  title = 'bike-club';
  loadingSubscription: Subscription;
  isLoading = false;

  constructor(private spinnerService: SpinnerService, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadingSubscription = this.spinnerService.isLoading.subscribe(toggleValue => {
      this.isLoading = toggleValue;
    });

    this.authService.autoSignIn();
  }

  ngOnDestroy(): void {
    this.loadingSubscription.unsubscribe();
  }
}
