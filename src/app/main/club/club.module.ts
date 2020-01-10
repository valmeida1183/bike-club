import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClubRoutingModule } from './club-routing.module';
import { ClubComponent } from './club.component';

@NgModule({
  declarations: [
    ClubComponent
  ],
  imports: [
    CommonModule,
    ClubRoutingModule
  ]
})
export class ClubModule { }
