import { Routes, RouterModule } from '@angular/router';

import { Dashboard } from './dashboard.component';
import { LoginModule } from './../login/login.module';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { LoginComponent } from './../login/login.component';

// noinspection TypeScriptValidateTypes

export const routes: Routes = [
  {
    path: 'login',
    loadChildren: 'app/pages/login/login.module#LoginModule',
  },
  {
    path: '',
    component: Dashboard,
    children: [
      { path: 'login' , redirectTo: 'login', pathMatch: 'full' },
      //{ path: 'treeview', component: TreeViewComponent }
    ],
  },
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
