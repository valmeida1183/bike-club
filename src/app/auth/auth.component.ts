import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

@Component({
	selector: 'bc-auth',
	templateUrl: './auth.component.html',
	styleUrls: ['./auth.component.scss'],
	preserveWhitespaces: true,
	standalone: true,
	imports: [CommonModule, RouterModule, MatToolbarModule, MatButtonModule],
})
export class AuthComponent implements OnInit {
	constructor() {}

	ngOnInit() {}
}
