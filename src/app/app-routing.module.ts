import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

import { MainComponent } from './main/main.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full'},
  { path: 'main',
    component: MainComponent,
    children: [
      // Para ativar o lazy load é preciso apontar a rota e o path do arquivo do módulo que será carregado
      { path: 'club', loadChildren: () => import('./main/main-nav/club/club.module').then(m => m.ClubModule) },
      { path: 'shopping', loadChildren: () => import('./main/main-nav/shopping/shopping.module').then(m => m.ShoppingModule) }
    ]
  },
  { path: '', loadChildren: './auth/auth.module#AuthModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
