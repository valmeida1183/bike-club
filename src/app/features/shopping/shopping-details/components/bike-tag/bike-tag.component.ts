import { Component, input } from '@angular/core';

@Component({
	selector: 'bc-bike-tag',
	imports: [],
	templateUrl: './bike-tag.component.html',
	styleUrl: './bike-tag.component.scss',
})
export class BikeTagComponent {
	tag = input.required<string>();
	value = input<number>();
}
