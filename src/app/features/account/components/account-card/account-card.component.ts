import { Component, input } from '@angular/core';
import { MatCard, MatCardHeader, MatCardModule } from '@angular/material/card';

@Component({
	selector: 'bc-account-card',
	imports: [MatCardModule],
	templateUrl: './account-card.component.html',
	styleUrl: './account-card.component.scss',
})
export class AccountCardComponent {
	title = input.required<string>();
}
