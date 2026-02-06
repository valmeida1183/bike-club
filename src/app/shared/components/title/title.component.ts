import { Component, OnInit, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
	selector: 'bc-title',
	templateUrl: './title.component.html',
	styleUrls: ['./title.component.scss'],
	standalone: true,
	imports: [CommonModule, RouterLink, MatButtonModule, MatIconModule],
})
export class TitleComponent implements OnInit {
	readonly title = input.required<string>();
	readonly backLink = input<string | null>(null);

	constructor() {}

	ngOnInit() {}
}
