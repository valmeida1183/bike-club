import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatBadgeModule } from '@angular/material/badge';

import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
	MatDialogModule,
	MAT_DIALOG_DEFAULT_OPTIONS,
} from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SimpleDialogComponent } from './simple-dialog/simple-dialog.component';
import { TitleComponent } from './title/title.component';
import { PanelComponent } from './panel/panel.component';
import { MatButtonModule } from '@angular/material/button';
import { CarouselComponent } from './carousel/carousel.component';

@NgModule({
	imports: [
		CommonModule,
		MatButtonModule,
		MatCardModule,
		MatDialogModule,
		MatIconModule,
		MatExpansionModule,
		SimpleDialogComponent,
		TitleComponent,
		PanelComponent,
		CarouselComponent,
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	exports: [
		CommonModule,
		MatButtonModule,
		MatCardModule,
		MatDialogModule,
		MatToolbarModule,
		MatIconModule,
		MatSidenavModule,
		MatBadgeModule,
		MatListModule,
		MatGridListModule,
		MatFormFieldModule,
		MatInputModule,
		MatSelectModule,
		MatRadioModule,
		MatDatepickerModule,
		MatNativeDateModule,
		MatChipsModule,
		MatTooltipModule,
		MatTableModule,
		MatPaginatorModule,
		MatProgressSpinnerModule,
		MatExpansionModule,
		TitleComponent,
		PanelComponent,
		CarouselComponent,
		SimpleDialogComponent,
	],
	providers: [
		{
			provide: MAT_DIALOG_DEFAULT_OPTIONS,
			useValue: { minWidth: '15vw', minHeight: '10vh', autoFocus: false },
		},
	],
})
export class SharedModule {}
