import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { LayoutStore } from './core/layout/store/layout.store';

@Component({
	selector: 'bc-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	standalone: true,
	imports: [CommonModule, RouterModule, MatProgressSpinnerModule],
})
export class AppComponent {
	layoutStore = inject(LayoutStore);
}
