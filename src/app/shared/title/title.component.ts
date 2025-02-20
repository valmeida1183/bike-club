import { Component, OnInit, input } from '@angular/core';

@Component({
	selector: 'bc-title',
	templateUrl: './title.component.html',
	styleUrls: ['./title.component.scss'],
	standalone: false,
})
export class TitleComponent implements OnInit {
	readonly title = input.required<string>();

	constructor() {}

	ngOnInit() {}
}
