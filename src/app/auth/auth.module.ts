import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    AuthComponent
  ],
  imports: [
    AuthRoutingModule,
    CommonModule,
    SharedModule
  ]
})
export class AuthModule { }
