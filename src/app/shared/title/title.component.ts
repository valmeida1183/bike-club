import { Component, OnInit, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'bc-title',
	templateUrl: './title.component.html',
	styleUrls: ['./title.component.scss'],
	standalone: true,
	imports: [CommonModule],
})
export class TitleComponent implements OnInit {
	readonly title = input.required<string>();

	constructor() {}

	ngOnInit() {}
}
