import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { User } from 'src/app/modal/user';
import { UserService } from '../user.service';
import { AuthguardService } from 'src/app/auth-service/authguard/authguard.service';
import { BackenCommonErrorThrow } from 'src/app/modal/BackendCommonErrorThrow';
import { ErrorService } from 'src/app/CommonServices/Error/error.service';
export interface PasswordChange {
  id: number | null | undefined;
  oldPassword: string | null | undefined;
  newPassword: string | null | undefined;
}

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  users!: User[];
  userRow: User | undefined | null;
  areYouSure: boolean = false;
  error: boolean = false;
  resetPassword: boolean = false;
  currentPassword: string | undefined | null;
  errorMessage: string | undefined | null;
  newPassword: string | undefined | null;


  constructor(
    private userService: UserService,
    private errorService: ErrorService,
    private authService: AuthguardService,
    private messageService: MessageService,
  ) { }

  items: MenuItem[] | undefined;



  ngOnInit() {
    this.items = [{ label: 'User' }];
    this.getActiveUsers();
    this.checkUser();
  }

  getActiveUsers() {
    this.userService.getActiveUsers().subscribe(
      (res: User[]) => {
        debugger
        const decodedToken = this.checkUser();
        if (decodedToken?.ROLES[0] === "ADMIN") {
          this.users = res;
        } else {
          const user = res.find((user: User) => user.employeeId === decodedToken?.sub);
          if (user) {
            this.users = [];
            this.users.push(user);
          }
        }
      }, error => {
        this.showError(error.error);
      });
  }

  showDialog(userRow: User) {
    this.userRow = userRow;
    this.areYouSure = true;
  }

  deleteUser(obj: User | undefined | null) {
    this.userService.deleteUserById(obj!.id!).subscribe(
      (res: User) => {
        this.areYouSure = false;
        this.getActiveUsers();
      }, error => {
        this.showError(error.error);
      })
  }
  showError(error: string): void {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: error });
  }
  checkUser(): { PERMISSIONS: string[], ROLES: string[], sub: string } | null {
    const token = localStorage.getItem('accessToken');
    return this.authService.getDecodedAccessToken(token!);
  }
  passwordDialog(user: User): void {
    this.userRow = user;
    this.resetPassword = true;
  }
  updatePassword(passwords: PasswordChange) {
    debugger
    this.userService.updatePassword(passwords).subscribe(
      (res: User) => {
        this.resetPassword = false;
      }, (error: BackenCommonErrorThrow) => {
        debugger
        this.error = true;
        this.errorMessage = error.error;
        this.errorService.showError(error.error!);
      }
    );
  }
}
