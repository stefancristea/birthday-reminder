import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './_components/login';
import { RegisterComponent } from './_components/register';

const routes: Routes = [
  { path: '', loadChildren: () => import('./home.module').then(mod => mod.HomeModule) },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '**', redirectTo: '' }
];

export const appRoutingModule = RouterModule.forRoot(routes);
