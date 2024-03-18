import { Component, OnInit } from '@angular/core';
import { FormGroup} from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/auth-service/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {


  loginForm!: FormGroup;
  images: String[] = [
    'healthcare_upd_eng4.png',
    'smsa_ksamap_eng2.png',
    'FINAL_smartshipenglish2.png'
  ]
  currentIndex: any = 0;
  currentImageUrl!: string;
  togglePassword: any;
  employeeId!: string
  error: boolean = false;
  password!: string
  private jwtHelper: JwtHelperService = new JwtHelperService();

  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService,
  ) { }

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

    localStorage.removeItem("accessToken");
    
  }


  login(credentials: any) {
    this.authService.login(credentials).subscribe((res: any) => {
      localStorage.setItem('accessToken', res.accessToken);
      localStorage.setItem("isLoggedIn", "true");
      this.router.navigate(['/home']);
    }, (err: any) => {
      this.showError(err.error);
      this.error = true;
    });
  }


  showError(error: string) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: error });

  }

  isTokenExpired(token: string): boolean {
    return this.jwtHelper.isTokenExpired(token);
  }

}
