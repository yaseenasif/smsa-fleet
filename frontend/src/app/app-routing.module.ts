import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginFormComponent } from './page/login-form/login-form.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AddLocationComponent } from './page/location/add-location/add-location.component';
import { LocationListComponent } from './page/location/location-list/location-list.component';
import { UpdateLocationComponent } from './page/location/update-location/update-location.component';
import { AddLocationPortComponent } from './page/location-port/add-location-port/add-location-port.component';
import { LocationPortListComponent } from './page/location-port/location-port-list/location-port-list.component';
import { UpdateLocationPortComponent } from './page/location-port/update-location-port/update-location-port.component';
import { UserListComponent } from './page/user/user-list/user-list.component';
import { UpdateUserComponent } from './page/user/update-user/update-user.component';
import { AddUserComponent } from './page/user/add-user/add-user.component';
import { AddStatusComponent } from './page/status/add-status/add-status.component';
import { StatusListComponent } from './page/status/status-list/status-list.component';
import { UpdateStatusComponent } from './page/status/update-status/update-status.component';
import { ProductFieldListComponent } from './page/product-field/product-field-list/product-field-list.component';
import { ProductFieldAddComponent } from './page/product-field/product-field-add/product-field-add.component';
import { AuthGuard } from './auth-service/authguard/authguard';
import { PermissionListComponent } from './page/permission/permission-list/permission-list.component';
import { AddPermissionComponent } from './page/permission/add-permission/add-permission.component';
import { EditPermissionComponent } from './page/permission/edit-permission/edit-permission.component';
import { RoleListComponent } from './page/role/role-list/role-list.component';
import { AddRoleComponent } from './page/role/add-role/add-role.component';
import { EditRoleComponent } from './page/role/edit-role/edit-role.component';
import { DomesticSummaryComponent } from './page/bounds/domestic/domestic-summary/domestic-summary.component';
import { InternationalSummaryByAirComponent } from './page/bounds/international/international-summary-by-air/international-summary-by-air.component';
import { InternationalSummaryByRoadComponent } from './page/bounds/international/international-summary-by-road/international-summary-by-road.component';
import { AssignmentListComponent } from './page/Assignment/assignment-list/assignment-list.component';
import { AddAssignmentComponent } from './page/Assignment/add-assignment/add-assignment.component';
import { UpdateAssignmentComponent } from './page/Assignment/update-assignment/update-assignment.component';
import { VehicleListComponent } from './page/vehicle-screen/vehicle-list/vehicle-list.component';
import { AddVehicleComponent } from './page/vehicle-screen/add-vehicle/add-vehicle.component';
import { UpdateVehicleComponent } from './page/vehicle-screen/update-vehicle/update-vehicle.component';
import { EmployeeListComponent } from './page/employee-screen/employee-list/employee-list.component';
import { AddEmployeeComponent } from './page/employee-screen/add-employee/add-employee.component';
import { UpdateEmployeeComponent } from './page/employee-screen/update-employee/update-employee.component';
import { VendorListComponent } from './page/vendor-screen/vendor-list/vendor-list.component';
import { AddVendorComponent } from './page/vendor-screen/add-vendor/add-vendor.component';
import { EditVendorComponent } from './page/vendor-screen/edit-vendor/edit-vendor.component';
import { GradeListComponent } from './page/grade/grade-list/grade-list.component';
import { AddGradeComponent } from './page/grade/add-grade/add-grade.component';
import { FormsModule } from '@angular/forms';
import { EditGradeComponent } from './page/grade/edit-grade/edit-grade.component';
import { VehicleDetailComponent } from './page/vehicle-screen/vehicle-detail/vehicle-detail.component';
import { VehicleHistoryComponent } from './page/vehicle-screen/vehicle-history/vehicle-history.component';
import { VehicleAttachmentComponent } from './page/vehicle-screen/vehicle-attachment/vehicle-attachment.component';
import { AssigmentAttachmentComponent } from './page/Assignment/assigment-attachment/assigment-attachment.component';
import { VendorAttachmentComponent } from './page/vendor-screen/vendor-attachment/vendor-attachment.component';
import { EmployeeAttachmentComponent } from './page/employee-screen/employee-attachment/employee-attachment.component';
import { IndividualFileListComponent } from './page/individual-file-list/individual-file-list/individual-file-list.component';
import { CityListComponent } from './page/city/city-list/city-list.component';
import { AddCityComponent } from './page/city/add-city/add-city.component';
import { EditCityComponent } from './page/city/edit-city/edit-city.component';
import { ViewVehicleComponent } from './page/vehicle-screen/view-vehicle/view-vehicle.component';
import { ViewEmployeeComponent } from './page/employee-screen/view-employee/view-employee.component';
import { ViewAssignmentComponent } from './page/Assignment/view-assignment/view-assignment.component';
import { AssignmentHistoryComponent } from './page/Assignment/assignment-history/assignment-history.component';
import { RegionComponent } from './page/region/region.component';
import { AddRegionComponent } from './page/region/add-region/add-region.component';
import { UnAssignedVehiclesComponent } from './page/vehicle-screen/un-assigned-vehicles/un-assigned-vehicles.component';
import { ProjectVehicleComponent } from './page/project-vehicle/project-vehicle.component';
import { AddProjectVehicleComponent } from './page/project-vehicle/add-project-vehicle/add-project-vehicle.component';
import { EditProjectVehicleComponent } from './page/project-vehicle/edit-project-vehicle/edit-project-vehicle.component';
import { ViewProjectVehicleComponent } from './page/project-vehicle/view-project-vehicle/view-project-vehicle.component';
import { ShowVehicleComponent } from './page/project-vehicle/show-vehicle/show-vehicle.component';
import { ReplacementActionComponent } from './page/Assignment/replacement-action/replacement-action.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'home',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'productFields',
    component: ProductFieldListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'add-ProductField',
    component: ProductFieldAddComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'add-ProductField/:id',
    component: ProductFieldAddComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'location',
    component: LocationListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'add-location',
    component: AddLocationComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'edit-location',
    component: UpdateLocationComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'location-port',
    component: LocationPortListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'add-location-port',
    component: AddLocationPortComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'edit-location-port',
    component: UpdateLocationPortComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'user',
    component: UserListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'add-user',
    component: AddUserComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'edit-user/:id',
    component: UpdateUserComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'status',
    component: StatusListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'add-status',
    component: AddStatusComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'edit-status',
    component: UpdateStatusComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'vehicle',
    component: VehicleListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'vehicle/:vehicletab',
    component: VehicleListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'unassigned-vehicle',
    component: UnAssignedVehiclesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'vehicle-history/:id',
    component: VehicleHistoryComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'vehicle-attachment/:id',
    component: VehicleAttachmentComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'add-vehicle',
    component: AddVehicleComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'add-vehicle/:replacementCheck/vId',
    component: AddVehicleComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'edit-vehicle/:id',
    component: UpdateVehicleComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'vehicle-detail/:id',
    component: VehicleDetailComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'employee',
    component: EmployeeListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'employee-attachment/:id',
    component: EmployeeAttachmentComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'add-employee',
    component: AddEmployeeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'edit-employee/:id',
    component: UpdateEmployeeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'vendor',
    component: VendorListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'vendor-attachment',
    component: VendorAttachmentComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'add-vendor',
    component: AddVendorComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'edit-vendor/:id',
    component: EditVendorComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'project-vehicle',
    component: ProjectVehicleComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'add-project-vehicle',
    component: AddProjectVehicleComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'edit-project-vehicle/:id',
    component: EditProjectVehicleComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'view-project-vehicle/:id',
    component: ViewProjectVehicleComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'show-vehicle/:id',
    component: ShowVehicleComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'permission',
    component: PermissionListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'add-permission',
    component: AddPermissionComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'edit-permission/:id',
    component: EditPermissionComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'role',
    component: RoleListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'add-role',
    component: AddRoleComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'edit-role/:id',
    component: EditRoleComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'domestic-summary',
    component: DomesticSummaryComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'international-summary-by-air',
    component: InternationalSummaryByAirComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'international-summary-by-road',
    component: InternationalSummaryByRoadComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'assignment',
    component: AssignmentListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'assignment-attachment/:id',
    component: AssigmentAttachmentComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'add-assignment',
    component: AddAssignmentComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'edit-assignment',
    component: UpdateAssignmentComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'view-assignment/:id',
    component: ViewAssignmentComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'assignment-history/:id',
    component: AssignmentHistoryComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    component: LoginFormComponent
  },
  {
    path: 'grade-list',
    component: GradeListComponent,
    canActivate: [AuthGuard]
  }, {
    path: 'add-grade',
    component: AddGradeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'edit-grade/:id',
    component: EditGradeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'individual-file-list-component/:call-type/:id',
    component: IndividualFileListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'city-list',
    component: CityListComponent,
    canActivate: [AuthGuard]
  }, {
    path: 'add-city',
    component: AddCityComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'edit-city/:id',
    component: EditCityComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'view-vehicle/:id',
    component: ViewVehicleComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'view-vehicle/assignmentCheck/:id',
    component: ViewVehicleComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'view-employee/:id',
    component: ViewEmployeeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'get-all-regions',
    component: RegionComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'add-region',
    component: AddRegionComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'add-region/:id',
    component: AddRegionComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'replacement-action/:id',
    component: ReplacementActionComponent,
    canActivate: [AuthGuard]  
  }

];

@NgModule({
  imports: [FormsModule, RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
