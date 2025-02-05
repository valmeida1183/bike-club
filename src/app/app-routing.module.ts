import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

import { MainComponent } from './main/main.component';
import { AuthGuard } from './guards/auth.guard';
import { Role } from './models/auth/role.model';
import { AboutComponent } from './main/main-nav/about/about.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: '',
    component: MainComponent,
    canActivate: [AuthGuard],
    children: [
      // Para ativar o lazy load é preciso apontar a rota e o path do arquivo do módulo que será carregado
      {
        path: 'club',
        loadChildren: () =>
          import('./main/main-nav/club/club.module').then((m) => m.ClubModule),
      },
      {
        path: 'shopping',
        loadChildren: () =>
          import('./main/main-nav/shopping/shopping.module').then(
            (m) => m.ShoppingModule
          ),
      },
      { path: 'about', component: AboutComponent },
    ],
  },
  {
    path: '',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
];

@NgModule({
  // preloadingStrategy siginifica que irá carregar os módulos o mais cedo possível,
  // mantendo o comportamento de lazy load (bundle separadados)
  imports: [
    RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules
}),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
