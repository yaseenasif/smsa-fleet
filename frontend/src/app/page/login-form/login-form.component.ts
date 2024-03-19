import { Component, OnInit } from '@angular/core';
import { FormGroup} from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/auth-service/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UserService } from '../user/user.service';
import { User } from 'src/app/modal/user';

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
  user!: User 

  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService,
    private userService: UserService
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
      this.getUserByEmpId(this.employeeId)
      if(this.user.roles[0].name === 'ROLE_COORDINATOR'){
        this.router.navigate(['/vehicle']);
      }
      else if(this.user.roles[0].name === 'ROLE_PROJECTMANAGER'){
        this.router.navigate(['/project-vehicle']);
      }else{
      this.router.navigate(['/home']);
      }
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

  getUserByEmpId(id: string){
    this.userService.getUserByEmpId(id).subscribe((res)=>{
      this.user =res
    })
  }
}
