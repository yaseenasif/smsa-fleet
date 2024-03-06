import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginFormComponent } from './page/login-form/login-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DashboardHeadComponent } from './components/dashboard-head/dashboard-head.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
// import { UpdateDriverComponent } from './page/driver/update-driver/update-driver.component';
// import { AddDriverComponent } from './page/driver/add-driver/add-driver.component';
// import { DriverListComponent } from './page/driver/driver-list/driver-list.component';
import { AddLocationComponent } from './page/location/add-location/add-location.component';
import { UpdateLocationComponent } from './page/location/update-location/update-location.component';
import { LocationListComponent } from './page/location/location-list/location-list.component';
import { LocationPortListComponent } from './page/location-port/location-port-list/location-port-list.component';
import { AddLocationPortComponent } from './page/location-port/add-location-port/add-location-port.component';
import { UpdateLocationPortComponent } from './page/location-port/update-location-port/update-location-port.component';
import { UserListComponent } from './page/user/user-list/user-list.component';
import { AddUserComponent } from './page/user/add-user/add-user.component';
import { UpdateUserComponent } from './page/user/update-user/update-user.component';
import { StatusListComponent } from './page/status/status-list/status-list.component';
import { AddStatusComponent } from './page/status/add-status/add-status.component';
import { UpdateStatusComponent } from './page/status/update-status/update-status.component';
import { PermissionListComponent } from './page/permission/permission-list/permission-list.component';
import { AddPermissionComponent } from './page/permission/add-permission/add-permission.component';
import { EditPermissionComponent } from './page/permission/edit-permission/edit-permission.component';
import { RoleListComponent } from './page/role/role-list/role-list.component';
import { AddRoleComponent } from './page/role/add-role/add-role.component';
import { EditRoleComponent } from './page/role/edit-role/edit-role.component';
import { CommonModule } from '@angular/common';
import { ProductFieldListComponent } from './page/product-field/product-field-list/product-field-list.component';
import { ProductFieldAddComponent } from './page/product-field/product-field-add/product-field-add.component';
import { FormsModule } from '@angular/forms'
// import { DomesticShippingListComponent } from './page/shipping-order/domestic/domestic-shipping-list/domestic-shipping-list.component';
import { NgxUiLoaderModule, NgxUiLoaderHttpModule } from "ngx-ui-loader";
import { TimelineModule } from 'primeng/timeline';
import { TooltipModule } from 'primeng/tooltip';



import {
  HTTP_INTERCEPTORS,
  HttpClientModule
} from '@angular/common/http';
// import { provideRouter, withHashLocation } from '@angular/router';
import { TokenInterceptor } from './auth-service/interceptor/token.interceptor';
import { CalendarModule } from 'primeng/calendar';

//primeng imports
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MultiSelectModule } from 'primeng/multiselect';
import { PasswordModule } from 'primeng/password';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DomesticSummaryComponent } from './page/bounds/domestic/domestic-summary/domestic-summary.component';
import { InternationalSummaryByRoadComponent } from './page/bounds/international/international-summary-by-road/international-summary-by-road.component';
import { InternationalSummaryByAirComponent } from './page/bounds/international/international-summary-by-air/international-summary-by-air.component';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { AddAssignmentComponent } from './page/Assignment/add-assignment/add-assignment.component';
import { UpdateAssignmentComponent } from './page/Assignment/update-assignment/update-assignment.component';
import { AssignmentListComponent } from './page/Assignment/assignment-list/assignment-list.component';
import { ChartModule } from 'primeng/chart';
import { AddVehicleComponent } from './page/vehicle-screen/add-vehicle/add-vehicle.component';
import { UpdateVehicleComponent } from './page/vehicle-screen/update-vehicle/update-vehicle.component';
import { VehicleListComponent } from './page/vehicle-screen/vehicle-list/vehicle-list.component';
import { AddEmployeeComponent } from './page/employee-screen/add-employee/add-employee.component';
import { UpdateEmployeeComponent } from './page/employee-screen/update-employee/update-employee.component';
import { EmployeeListComponent } from './page/employee-screen/employee-list/employee-list.component';
import { AddVendorComponent } from './page/vendor-screen/add-vendor/add-vendor.component';
import { EditVendorComponent } from './page/vendor-screen/edit-vendor/edit-vendor.component';
import { VendorListComponent } from './page/vendor-screen/vendor-list/vendor-list.component';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DialogModule } from 'primeng/dialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { GradeListComponent } from './page/grade/grade-list/grade-list.component';
import { AddGradeComponent } from './page/grade/add-grade/add-grade.component';
import { EditGradeComponent } from './page/grade/edit-grade/edit-grade.component';
import { PaginatorModule } from 'primeng/paginator';
import { VendorDetailComponent } from './page/vendor-screen/vendor-detail/vendor-detail.component';
import { VehicleDetailComponent } from './page/vehicle-screen/vehicle-detail/vehicle-detail.component';
import { VehicleHistoryComponent } from './page/vehicle-screen/vehicle-history/vehicle-history.component';
import { CardModule } from 'primeng/card';
import { VehicleAttachmentComponent } from './page/vehicle-screen/vehicle-attachment/vehicle-attachment.component';
import { AssigmentAttachmentComponent } from './page/Assignment/assigment-attachment/assigment-attachment.component';
import { VendorAttachmentComponent } from './page/vendor-screen/vendor-attachment/vendor-attachment.component';
import { EmployeeAttachmentComponent } from './page/employee-screen/employee-attachment/employee-attachment.component';
import { IndividualFileListComponent } from './page/individual-file-list/individual-file-list/individual-file-list.component';
import { KeyFilterModule } from 'primeng/keyfilter';
import { InputNumberModule } from 'primeng/inputnumber';
import { AddCityComponent } from './page/city/add-city/add-city.component';
import { EditCityComponent } from './page/city/edit-city/edit-city.component';
import { CityListComponent } from './page/city/city-list/city-list.component';
import { DialogBoxComponent } from './components/dialog-box/dialog-box.component';
import { ViewVehicleComponent } from './page/vehicle-screen/view-vehicle/view-vehicle.component';
import { ViewEmployeeComponent } from './page/employee-screen/view-employee/view-employee.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ViewAssignmentComponent } from './page/Assignment/view-assignment/view-assignment.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { ChipsModule } from 'primeng/chips';
import { RegionComponent } from './page/region/region.component';
import { AddRegionComponent } from './page/region/add-region/add-region.component';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { AssignmentHistoryComponent } from './page/Assignment/assignment-history/assignment-history.component';
import { CountUpModule } from 'ngx-countup';
import { MessageService } from 'primeng/api';
import { UnAssignedVehiclesComponent } from './page/vehicle-screen/un-assigned-vehicles/un-assigned-vehicles.component';
import { ProjectVehicleComponent } from './page/project-vehicle/project-vehicle.component';
import { AddProjectVehicleComponent } from './page/project-vehicle/add-project-vehicle/add-project-vehicle.component';
import { EditProjectVehicleComponent } from './page/project-vehicle/edit-project-vehicle/edit-project-vehicle.component';
import { ViewProjectVehicleComponent } from './page/project-vehicle/view-project-vehicle/view-project-vehicle.component';
import { SpeedDialModule } from 'primeng/speeddial';
import { ShowVehicleComponent } from './page/project-vehicle/show-vehicle/show-vehicle.component';
import { ReplacementActionComponent } from './page/Assignment/replacement-action/replacement-action.component';
import { AddJobTitleComponent } from './page/job-title/add-job-title/add-job-title.component';
import { JobTitleListComponent } from './page/job-title/job-title-list/job-title-list.component';
import { ReportManagmentListComponent } from './page/report-managment/report-managment-list/report-managment-list.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginFormComponent,
    DashboardHeadComponent,
    DashboardComponent,
    SidebarComponent,
    AddLocationComponent,
    UpdateLocationComponent,
    LocationListComponent,
    LocationPortListComponent,
    AddLocationPortComponent,
    UpdateLocationPortComponent,
    UserListComponent,
    AddUserComponent,
    UpdateUserComponent,
    StatusListComponent,
    AddStatusComponent,
    UpdateStatusComponent,
    ProductFieldListComponent,
    ProductFieldAddComponent,
    PermissionListComponent,
    AddPermissionComponent,
    EditPermissionComponent,
    RoleListComponent,
    AddRoleComponent,
    EditRoleComponent,
    DomesticSummaryComponent,
    InternationalSummaryByRoadComponent,
    InternationalSummaryByAirComponent,
    AddAssignmentComponent,
    UpdateAssignmentComponent,
    AssignmentListComponent,
    AddVehicleComponent,
    UpdateVehicleComponent,
    VehicleListComponent,
    AddEmployeeComponent,
    UpdateEmployeeComponent,
    EmployeeListComponent,
    AddVendorComponent,
    EditVendorComponent,
    VendorListComponent,
    GradeListComponent,
    AddGradeComponent,
    EditGradeComponent,
    VendorDetailComponent,
    VehicleDetailComponent,
    EditGradeComponent,
    VehicleHistoryComponent,
    VehicleAttachmentComponent,
    AssigmentAttachmentComponent,
    VendorAttachmentComponent,
    EmployeeAttachmentComponent,
    IndividualFileListComponent,
    DialogBoxComponent,
    ViewVehicleComponent,
    ViewEmployeeComponent,
    ViewAssignmentComponent,
    AddCityComponent,
    EditCityComponent,
    CityListComponent,
    RegionComponent,
    AddRegionComponent,
    AssignmentHistoryComponent,
    UnAssignedVehiclesComponent,
    ProjectVehicleComponent,
    AddProjectVehicleComponent,
    EditProjectVehicleComponent,
    ViewProjectVehicleComponent,
    ShowVehicleComponent,
    ReplacementActionComponent,
    AddJobTitleComponent,
    JobTitleListComponent,
    ReportManagmentListComponent,
  ],
  imports: [
    ConfirmDialogModule,
    CardModule,
    TimelineModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    InputTextModule,
    DropdownModule,
    ToolbarModule,
    ButtonModule,
    TableModule,
    BreadcrumbModule,
    MultiSelectModule,
    PasswordModule,
    InputSwitchModule,
    CalendarModule,
    FileUploadModule,
    ToastModule,
    FileUploadModule,
    RadioButtonModule,
    ChartModule,
    NgxUiLoaderModule,
    DialogModule,
    PaginatorModule,
    InputTextareaModule,
    KeyFilterModule,
    InputNumberModule,
    TooltipModule,
    ToggleButtonModule,
    ChipsModule,
    SpeedDialModule,
    CountUpModule,
    NgxUiLoaderHttpModule.forRoot({
      showForeground: true
    })
  ],

  providers: [
    MessageService,
    // AuthGuard,
    // DatePipe,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    // { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true }, // Register the AuthInterceptor
    // provideRouter(routes, withHashLocation()),
    [{ provide: LocationStrategy, useClass: HashLocationStrategy }]
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
