import { Component, OnInit, OnDestroy } from '@angular/core';
import { SpinnerService } from './shared/spinner.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'bc-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy   {
  title = 'bike-club';
  loadingSubscription: Subscription;
  isLoading = false;

  constructor(private spinnerService: SpinnerService) {}

  ngOnInit(): void {
    this.loadingSubscription = this.spinnerService.isLoading.subscribe(toggleValue => {
      this.isLoading = toggleValue;
    });
  }

  ngOnDestroy(): void {
    this.loadingSubscription.unsubscribe();
  }
}
