import { HomeComponent } from './_components/home/home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './_helpers';


const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
