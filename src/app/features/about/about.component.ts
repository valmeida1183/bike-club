import { Component, OnInit } from '@angular/core';
import { TitleComponent } from 'src/app/shared/components/title/title.component';

@Component({
	selector: 'bc-about',
	templateUrl: './about.component.html',
	styleUrls: ['./about.component.scss'],
	standalone: true,
	imports: [TitleComponent],
})
export class AboutComponent implements OnInit {
	constructor() {}

	ngOnInit() {}
}
