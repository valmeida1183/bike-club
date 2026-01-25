import { Component, input } from '@angular/core';
import { Bike } from '../../../models/bike.model';
import { BikeTagComponent } from '../bike-tag/bike-tag.component';

@Component({
	selector: 'bc-bike-item-description',
	imports: [BikeTagComponent],
	templateUrl: './bike-item-description.component.html',
	styleUrl: './bike-item-description.component.scss',
})
export class BikeItemDescriptionComponent {
	bike = input.required<Bike>();
}
