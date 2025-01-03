import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { SkeletonModule } from 'primeng/skeleton';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastModule } from 'primeng/toast';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { TimelineModule } from 'primeng/timeline';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { AppRoutingModule } from './app-routing.module';
import { FileUploadModule } from 'primeng/fileupload';
import { PaginatorModule } from 'primeng/paginator';
import { ToolbarModule } from 'primeng/toolbar';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/auth/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { AppTopbarComponent } from './layout/app-topbar/app-topbar.component';
import { AppLayoutComponent } from './layout/app-layout/app-layout.component';
import { AppSidebarComponent } from './layout/app-sidebar/app-sidebar.component';
import { AppMenuComponent } from './layout/app-menu/app-menu.component';
import { AppMenuitemComponent } from './layout/app-menu/menu-items.component';
import { ViewVehicleComponent } from './components/vehicle-screen/view-vehicle/view-vehicle/view-vehicle.component';
import { InvoiceUploadComponent } from './components/invoice-screen/invoice-upload/invoice-upload.component';
import { InvoiceDetailsComponent } from './components/invoice-screen/invoice-details/invoice-details.component';
import { InvoiceSupplierComponent } from './components/invoice-screen/invoice-supplier/invoice-supplier.component';
import { ReportSectionComponent } from './components/report-section/report-section.component';
import { InterceptorService } from './components/service/interceptor.service';
import { VehicleListComponent } from './components/vehicle-screen/vehicle-list/vehicle-list.component';
import { RouterModule } from '@angular/router';  // Ensure this is imported
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    AppTopbarComponent,
    AppLayoutComponent,
    AppSidebarComponent,
    AppMenuComponent,
    AppMenuitemComponent,
    ViewVehicleComponent,
    InvoiceUploadComponent,
    InvoiceDetailsComponent,
    InvoiceSupplierComponent,
    ReportSectionComponent,
    VehicleListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ButtonModule,
    PasswordModule,
    InputTextModule,
    SkeletonModule,
    ChartModule,
    TableModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastModule,
    AvatarModule,
    AvatarGroupModule,
    TimelineModule,
    CardModule,
    DropdownModule,
    CalendarModule,
    FileUploadModule,
    PaginatorModule,
    ToolbarModule,
    RouterModule,
    TooltipModule,
    DialogModule
  ],
  providers: [
    MessageService,
    { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true },
    [{ provide: LocationStrategy, useClass: HashLocationStrategy }]
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
