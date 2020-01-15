import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { ClubRoutingModule } from './club-routing.module';

import { ClubComponent } from './club.component';

@NgModule({
  declarations: [
    ClubComponent
  ],
  imports: [
    ClubRoutingModule,
    SharedModule
  ]
})
export class ClubModule { }
