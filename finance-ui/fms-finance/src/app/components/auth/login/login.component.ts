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

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [MessageService]
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
    private messageService: MessageService
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

  getUserByEmpId(employeeId: string): Observable<User> {
    return this.loginService.getUserByEmpId(employeeId);
  }

  login( credentials: LoginCredential ) {
    this.loginService.login(credentials).subscribe(( res: any) => {
      console.log(res.roles);
      localStorage.setItem('accessToken', res.accessToken!);
      localStorage.setItem("isLoggedIn", "true");
      this.router.navigate(['']);
    })

    // this.loginService.login(credentials).pipe(
    //   tap((res: LoginResponse) => {
    //     localStorage.setItem('accessToken', res.accessToken!);
    //     localStorage.setItem("isLoggedIn", "true");
    //   }),
    //   switchMap(() => this.getUserByEmpId(this.employeeId))
    // ).subscribe(
    //   (user: User) => {
    //     this.redirectBasedOnUserRole(user);
    //   },
    //   (err) => {
    //     console.log(err);

    //   }
    // );

  }

  // redirectBasedOnUserRole(user: User) {
  //   if (user) {
  //     if (user.roles[0].name === 'ROLE_ADMIN') {
  //       this.router.navigate(['']);
  //     } else {
  //       this.router.navigate(['/access']);
  //     }
  //   }
  // }

}
