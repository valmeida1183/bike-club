import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
// import { CarouselComponent } from 'src/app/shared/carousel/carousel.component'; // Keep commented out for now

@Component({
	selector: 'bc-home',
	standalone: true,
	imports: [
		CommonModule,
		RouterModule,
		MatButtonModule,
		// CarouselComponent, // Uncomment if bc-carousel is used
	],
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
