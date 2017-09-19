import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

export const routes: Routes = [
  { path : 'Home', redirectTo: 'login', pathMatch: 'full' },
   { path: '', redirectTo: 'login', pathMatch: 'full' },
   { path: '**', redirectTo: 'login' },
   {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  // { path: '', redirectTo: 'pages', pathMatch: 'full' },
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes, { useHash: true });
