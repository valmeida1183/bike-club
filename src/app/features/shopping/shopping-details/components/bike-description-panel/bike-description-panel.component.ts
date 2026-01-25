import { Component, input } from '@angular/core';
import { Bike } from '../../../models/bike.model';
import { BikeTagComponent } from '../bike-tag/bike-tag.component';

@Component({
	selector: 'bc-bike-description-panel',
	imports: [BikeTagComponent],
	templateUrl: './bike-description-panel.component.html',
	styleUrl: './bike-description-panel.component.scss',
})
export class BikeDescriptionPanelComponent {
	bike = input.required<Bike>();
}
