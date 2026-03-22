import { Component, computed, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
	selector: 'bc-increment',
	imports: [MatButtonModule],
	templateUrl: './increment.component.html',
	styleUrl: './increment.component.scss',
})
export class IncrementComponent {
	value = input.required<number>();
	changeQuantity = output<number>();

	disabledDecrement = computed(() => this.value() <= 1);
	disabledIncrement = computed(() => this.value() >= 10);

	increment() {
		const newValue = this.value() + 1;
		this.changeQuantity.emit(newValue);
	}

	decrement() {
		const newValue = this.value() - 1;
		this.changeQuantity.emit(newValue);
	}
}
