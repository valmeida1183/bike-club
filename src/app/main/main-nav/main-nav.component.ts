import { Component, OnInit, OnDestroy } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'bc-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss']
})
export class MainNavComponent implements OnInit, OnDestroy {
  userType: string;
  private authUserDataSubscription: Subscription;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver, private authService: AuthService) {}

  ngOnInit(): void {
    this.authUserDataSubscription = this.authService.authUserDataSubject
      .subscribe(authUserData => {
        this.userType = authUserData.userType;
      });
  }
  ngOnDestroy(): void {
    this.authUserDataSubscription.unsubscribe();
  }
}
