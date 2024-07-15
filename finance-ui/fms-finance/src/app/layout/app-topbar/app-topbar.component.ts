import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LayoutService } from '../service/layout.service';
import { LoginService } from '../../components/service/login.service';

@Component({
  selector: 'app-app-topbar',
  templateUrl: './app-topbar.component.html',
  styleUrl: './app-topbar.component.scss'
})
export class AppTopbarComponent implements OnInit{

  @ViewChild("menubutton") menuButton!: ElementRef;
  @ViewChild("topbarmenubutton") topbarMenuButton!: ElementRef;


  userDetails: any;
  public loginUserName?: any;
  public loginUser: any;
  public loginUserEmail?: any;
  role: any;


  constructor( public layoutService: LayoutService,
               private loginService: LoginService
  ) {

    this.loginService.getUserByEmpId
  }

  ngOnInit(): void {
  }

}
