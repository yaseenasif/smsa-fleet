import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { ErrorService } from 'src/app/CommonServices/Error/error.service';
import { AuthguardService } from 'src/app/auth-service/authguard/authguard.service';
import { BackenCommonErrorThrow } from 'src/app/modal/BackendCommonErrorThrow';
import { User } from 'src/app/modal/user';
import { PasswordChange } from 'src/app/page/user/user-list/user-list.component';
import { UserService } from 'src/app/page/user/user.service';
@Component({
  selector: 'app-dashboard-head',
  templateUrl: './dashboard-head.component.html',
  styleUrls: ['./dashboard-head.component.scss']
})
export class DashboardHeadComponent implements OnInit {

  @ViewChild('menu') menu!: Menu;
  isMenuOpen: boolean = false;
  items: MenuItem[] = [];
  resetPassword: boolean = false;
  error: boolean = false;
  currentPassword: string | undefined | null;
  errorMessage: string | undefined | null;
  newPassword: string | undefined | null;
  user: User | undefined | null;

  constructor(
    private authService: AuthguardService,
    private errorService: ErrorService,
    private userService: UserService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    const decodedToken = this.decodeTokenTOGetUser();
    this.checkUser(decodedToken?.sub!);

    this.items = [
      {
        items: [
          {
            label: 'Edit User',
            icon: 'pi pi-file-edit',
            command: () => {
              this.editUser();
            }
          },
          {
            label: 'Change Password',
            icon: 'pi pi-prime',
            command: () => {
              this.changePassword();
            }
          },
          {
            label: 'Logout',
            icon: 'pi pi-fw pi-power-off',
            command: () => {
              this.logout();
            }
          }
        ]
      }
    ];
  }

  logout() {
    localStorage.removeItem('accessToken');
    this.router.navigateByUrl('/login');
  }

  decodeTokenTOGetUser(): { PERMISSIONS: string[], ROLES: string[], sub: string } | null {
    const token = localStorage.getItem('accessToken');
    return this.authService.getDecodedAccessToken(token!);
  }

  checkUser(employeeId: string): void {
    this.userService.getUserByEmpId(employeeId).subscribe(
      (user: User) => {
        this.user = user;
      }, (err: BackenCommonErrorThrow) => {
        this.errorService.showError(err.error!)
      });
  }

  editUser() {
    this.router.navigate(['/edit-user/', this.user?.id]);
  }

  changePassword() {
    this.resetPassword = true;
  }

  toggleMenu(event: Event) {
    event.stopPropagation();
    if (this.menu) {
      this.menu.toggle(event);
      this.isMenuOpen = this.menu.overlayVisible!;
    }
  }

  updatePassword(passwords: PasswordChange) {
    this.userService.updatePassword(passwords).subscribe(
      (res: User) => {
        this.resetPassword = false;
      }, (error: BackenCommonErrorThrow) => {
        this.error = true;
        this.errorMessage = error.error;
        this.errorService.showError(error.error!);
      }
    );
  }
}
