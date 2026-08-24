import { Component, computed, input } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
	selector: 'bc-bike-image-panel',
	imports: [],
	templateUrl: './bike-image-panel.component.html',
	styleUrl: './bike-image-panel.component.scss',
})
export class BikeImagePanelComponent {
	imageName = input<string>();
	imagePath = computed(() => `${environment.imageResource}${this.imageName()}`);
}
