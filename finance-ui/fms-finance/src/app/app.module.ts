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

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/auth/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { AppTopbarComponent } from './layout/app-topbar/app-topbar.component';
import { AppLayoutComponent } from './layout/app-layout/app-layout.component';
import { AppSidebarComponent } from './layout/app-sidebar/app-sidebar.component';
import { AppMenuComponent } from './layout/app-menu/app-menu.component';
import { AppMenuitemComponent } from './layout/app-menu/menu-items.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    AppTopbarComponent,
    AppLayoutComponent,
    AppSidebarComponent,
    AppMenuComponent,
    AppMenuitemComponent
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
    CardModule

  ],
  providers: [MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
