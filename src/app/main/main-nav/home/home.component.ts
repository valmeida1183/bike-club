import { Component, ViewEncapsulation } from '@angular/core';

@Component({
	selector: 'bc-home',
	standalone: false,
	templateUrl: './home.component.html',
	styleUrl: './home.component.scss',
	encapsulation: ViewEncapsulation.None,
})
export class HomeComponent {
	readonly imagesPaths = [
		'../../../../assets/images/vintage_custom.png',
		'../../../../assets/images/vintage_dark_green.png',
		'../../../../assets/images/vintage_dark_red.png',
		'../../../../assets/images/vintage_light-cian.png',
		'../../../../assets/images/vintage_light_blue.png',
		'../../../../assets/images/vintage_yellow.png',
	];
}
