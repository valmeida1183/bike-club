import { Component, OnInit, OnDestroy } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { AuthService } from 'src/app/auth/auth.service';
import { Role } from 'src/app/models/auth/role.model';

@Component({
  selector: 'bc-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss']
})
export class MainNavComponent implements OnInit, OnDestroy {
  role: Role;
  userName: string;
  private authUserDataSubscription: Subscription;
  private userSubscription: Subscription;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver,
              private authService: AuthService) { }

  //#region Life Cicle Events
  ngOnInit(): void {
    this.authUserDataSubscription = this.authService.authUserDataSubject
      .subscribe(authUserData => {
        this.role = authUserData ? authUserData.role : null;
      });

    this.userSubscription = this.authService.userSubject.subscribe(user => {
      this.userName = user ? `${user.name} ${user.lastName}` : null;
    });
  }

  ngOnDestroy(): void {
    this.authUserDataSubscription.unsubscribe();
  }
  //#endregion

  //#region Events
  onLogout() {
    this.authService.logout();
  }
  //#endregion
}
