import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, viewChild } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { AuthStore } from 'src/app/core/auth/store/auth.store';
import { CartStore } from 'src/app/features/shopping/cart/store/cart.store';
import { LayoutStore } from 'src/app/core/layout/store/layout.store';
import { BreakpointService } from 'src/app/shared/services/breakpoint.service';

@Component({
	selector: 'bc-main-layout',
	imports: [
		CommonModule,
		RouterModule,
		MatToolbarModule,
		MatIconModule,
		MatButtonModule,
		MatSidenavModule,
		MatListModule,
		MatBadgeModule,
	],
	templateUrl: './main-layout.component.html',
	styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent {
	readonly drawer = viewChild<MatSidenav>('drawer');

	private authStore = inject(AuthStore);
	protected layoutStore = inject(LayoutStore);
	protected cartStore = inject(CartStore);
	protected breakpointService = inject(BreakpointService);

	onLogout() {
		this.authStore.logout();
	}
}
