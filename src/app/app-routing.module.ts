import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

import { MainComponent } from './main/main.component';

const routes: Routes = [
  { path: '',
    component: MainComponent,
    children: [
      // Para ativar o lazy load é preciso apontar a rota e o path do arquivo do módulo que será carregado
      { path: 'club', loadChildren: './main/club/club.module#ClubModule' },
      { path: 'shopping', loadChildren: './main/shopping/shopping.module#ShoppingModule' },
    ]
  },
  { path: 'auth', loadChildren: './auth/auth.module#AuthModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
