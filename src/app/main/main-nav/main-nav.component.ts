import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay, tap } from 'rxjs/operators';

import { AuthService } from 'src/app/auth/auth.service';
import { Role } from 'src/app/models/auth/role.model';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthWebService } from 'src/app/auth/auth-web.service';

@Component({
  selector: 'bc-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss']
})
export class MainNavComponent implements OnInit, OnDestroy {
  @ViewChild('drawer') drawer: MatSidenav;
  role: Role;
  userName: string;
  private authWebUserDataSubscription: Subscription;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      tap(result => {
        if (!result.matches && this.drawer) {
          this.drawer.close();
        }
      }),
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver,
              private authService: AuthService,
              private authWebService: AuthWebService) { }

  //#region Life Cicle Events
  ngOnInit(): void {
    this.authWebUserDataSubscription = this.authWebService.authWebUserDataSubject
      .subscribe(authWebUserData => {
        if (authWebUserData && authWebUserData.user) {
          const { user } = authWebUserData;

          this.role = user.roleName;
          this.userName = `${user.name} ${user.lastName}`;
        }
      });
  }

  ngOnDestroy(): void {
    this.authWebUserDataSubscription.unsubscribe();
  }
  //#endregion

  //#region Events
  onLogout() {
    this.authWebService.logout();
  }
  //#endregion
}
