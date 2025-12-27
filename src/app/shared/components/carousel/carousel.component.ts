import { animate, style, transition, trigger } from '@angular/animations';
import { Component, computed, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
	selector: 'bc-carousel',
	standalone: true,
	imports: [CommonModule, MatIconModule, MatButtonModule],
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
