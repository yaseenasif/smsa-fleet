import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Role } from 'src/app/modal/role';
import { User } from 'src/app/modal/user';
import { RoleService } from '../../role/role.service';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {

  items: MenuItem[] | undefined;
  roles!: Role[];
  selectedRole!: Role
  error: boolean = false;
  user: User = {
    id: undefined,
    name: undefined,
    email: undefined,
    password: undefined,
    employeeId: undefined,
    roles: []
  }

  constructor(
    private roleService: RoleService,
    private userService: UserService,
    private router: Router,
    private messageService: MessageService
  ) { }


  ngOnInit(): void {

    this.items = [{ label: 'User', routerLink: '/user' }, { label: 'Add User' }];
    this.getAllRoles();
  }


  getAllRoles() {
    this.roleService.getAllRoles().subscribe((res: Role[]) => {
      this.roles = res;
    })
  }

  onSubmit() {
    
    this.userService.addUser(this.user).subscribe(
      (res: User) => {
        this.showSuccess(res);
        setTimeout(() => {
          this.router.navigate(['/user']);
        }, 1500);
      }, error => {
        this.showError(error.error);
      });
  }

  showError(error: string): void {
    this.messageService.add({ severity: 'error', summary: 'Add Error', detail: error });
  }
  showSuccess(value: User): void {
    this.messageService.add({ severity: 'success', summary: ' Added Successfully', detail: `User ${value.name} has been added` });
  }

}

