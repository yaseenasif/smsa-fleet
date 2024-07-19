import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthGuardService } from './components/service/auth-guard.service';
import { AppLayoutComponent } from './layout/app-layout/app-layout.component';
import { ViewVehicleComponent } from './components/vehicle-screen/view-vehicle/view-vehicle/view-vehicle.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot(
    [
      {
        path: '', component: AppLayoutComponent, canActivate: [AuthGuardService],
        children: [
          {
            path: '', component: DashboardComponent, canActivate: [AuthGuardService]
          },
          {
            path: 'finance-dashboard', component: DashboardComponent, canActivate: [AuthGuardService]
          },
          {
            path: 'view-vehicle', component: ViewVehicleComponent, canActivate: [AuthGuardService]
          }
        ]
      },
      {path: 'login', component: LoginComponent},
    ]
  )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
