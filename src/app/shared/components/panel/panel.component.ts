import { Component, OnInit, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';

@Component({
	selector: 'bc-panel',
	templateUrl: './panel.component.html',
	styleUrls: ['./panel.component.scss'],
	standalone: true,
	imports: [CommonModule, MatExpansionModule, MatButtonModule],
})
export class PanelComponent implements OnInit {
	readonly expanded = input<boolean>(true);
	readonly submitDisabled = input<boolean>(true);
	readonly title = input<string>(undefined);
	readonly description = input<string>(undefined);
	readonly submitText = input<string>(undefined);
	readonly showSubmit = input<boolean>(false);
	readonly actionPanel = output<void>();

	constructor() {}

	ngOnInit() {}

	onSubmit() {
		this.actionPanel.emit();
	}
}
