import { Component, OnInit } from '@angular/core';
import { TitleComponent } from 'src/app/shared/components/title/title.component';

@Component({
	selector: 'app-club',
	templateUrl: './club.component.html',
	styleUrls: ['./club.component.scss'],
	standalone: true,
	imports: [TitleComponent],
})
export class ClubComponent implements OnInit {
	constructor() {}

	ngOnInit() {}
}
