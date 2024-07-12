import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../../service/login.service';
import { LoginCredential } from '../../../modal/loginCredentials';
import { Router } from '@angular/router';
import { LoginResponse } from '../../../modal/loginResponse';
import { Observable, switchMap, tap } from 'rxjs';
import { User } from '../../../modal/User';
import { MessageService } from 'primeng/api';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BackenCommonErrorThrow } from '../../../modal/BackenCommonErrorThrow';
import { ErrorService } from '../../service/ErrorService';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit{

  loginForm !: FormGroup;
  token !: string;
  employeeId !: string;
  password !: string;
  private jwtHelper: JwtHelperService = new JwtHelperService();




  constructor(
    private loginService: LoginService,
    private router: Router,
    private messageService: MessageService,
    private errorHandelService: ErrorService
  ) {}

  ngAfterViewInit(): void {
    const token = localStorage.getItem('accessToken');
    ;
    if (token != null) {
      if (this.isTokenExpired(token)) {
        this.messageService.add({
          severity: 'info',
          summary: 'Info',
          detail:
            'For enhanced security, your access token has automatically expired after a period of inactivity. Please refresh your session by logging in.',
        });
      }
    }
    localStorage.removeItem('accessToken');
  }


  ngOnInit(): void {
    localStorage.clear();

  }

  isTokenExpired(token: string): boolean {
    return this.jwtHelper.isTokenExpired(token);
  }

  

  login( credentials: LoginCredential ) {
        this.loginService.login(credentials).pipe(
      tap((res: LoginResponse) => {
        localStorage.setItem('accessToken', res.accessToken!);
        localStorage.setItem("isLoggedIn", "true");
      }),
      switchMap(() => this.getUserByEmpId(this.employeeId))
    ).subscribe(
      (user: User) => {
        this.validationOnUserRole(user);
      },
      (err: BackenCommonErrorThrow) => {
        this.errorHandelService.showError(err.error!);
      }
    );

  }

  getUserByEmpId(employeeId: string): Observable<User> {
    return this.loginService.getUserByEmpId(employeeId);
  } 

  validationOnUserRole(user: User) {
    if (user) {
      console.log(user);
      
      if (user.roles[0].name === 'ROLE_FINANCE') {
        this.router.navigate(['/finance-dashboard'])
      } else {
        this.errorHandelService.showError('The Role is not Finance');
      }
    }
  }

}
