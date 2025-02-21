import { animate, style, transition, trigger } from '@angular/animations';
import { Component, computed, input, signal } from '@angular/core';

@Component({
	selector: 'bc-carousel',
	standalone: false,
	templateUrl: './carousel.component.html',
	styleUrl: './carousel.component.scss',
	animations: [
		trigger('slideAnimation', [
			transition(':increment', [
				style({ transform: 'translateX(100%)' }),
				animate('500ms ease-in-out', style({ transform: 'translateX(0%)' })),
			]),
			transition(':decrement', [
				style({ transform: 'translateX(-100%)' }),
				animate('500ms ease-in-out', style({ transform: 'translateX(0%)' })),
			]),
		]),
	],
})
export class CarouselComponent {
	readonly images = input.required<string[]>();
	protected readonly currentIndex = signal<number>(0);
	private imagesCount = computed(() => this.images().length - 1);

	nextSlide(): void {
		let index = this.currentIndex();

		index < this.imagesCount() ? index++ : (index = 0);
		this.currentIndex.set(index);
	}

	prevSlide(): void {
		let index = this.currentIndex();

		index > 0 ? index-- : (index = this.imagesCount());
		this.currentIndex.set(index);
	}

	goToSlide(index: number): void {
		this.currentIndex.set(index);
	}
}
