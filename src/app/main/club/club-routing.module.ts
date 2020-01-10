import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClubComponent } from './club.component';

const routes: Routes = [
    { path: 'club', component: ClubComponent }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClubRoutingModule {}
