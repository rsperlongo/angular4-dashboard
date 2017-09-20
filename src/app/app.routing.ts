import { Routes, RouterModule, CanActivate } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { AuthGuard } from 'app/_guards';

export const routes: Routes = [
  {   
      path : '', 
      redirectTo: 'login', 
      pathMatch: 'full',
      canActivate: [AuthGuard] 
    },
   { 
      path: '', 
      redirectTo: 'login', 
      pathMatch: 'full' 
    },
   {  
     path: '**', 
      redirectTo: 'login' 
    },
   {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  // { path: '', redirectTo: 'pages', pathMatch: 'full' },
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes, { useHash: true });
