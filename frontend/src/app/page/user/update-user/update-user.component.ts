import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api'
import { Role } from 'src/app/modal/role';
import { User } from 'src/app/modal/user';
import { RoleService } from '../../role/role.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.scss']
})
export class UpdateUserComponent implements OnInit {
  items: MenuItem[] | undefined;

  selectedRole: string | undefined | null;
  roles!: Role[];

  user: User = {
    id: undefined,
    name: undefined,
    email: undefined,
    password: undefined,
    employeeId: undefined,
    roles: [],
  }

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private roleService: RoleService,
    private messageService: MessageService,
    private router: Router
  ) { }

  userId: number | undefined;


  ngOnInit(): void {
    this.items = [{ label: 'User', routerLink: '/user' }, { label: 'Edit User' }];
    this.userId = +this.route.snapshot.paramMap.get('id')!;
    this.getAllRoles()
    this.getUserById(this.userId)

  }

  getAllRoles() {
    this.roleService.getAllRoles().subscribe(
      (res: Role[]) => {
        this.roles = res;
      }, error => {
        this.showError(error.error);
      });
  }

  getUserById(id: number) {
    this.userService.getUserById(id).subscribe((res: User) => {
      this.user = res;
      this.selectedRole = res?.roles[0]?.name;
    }, error => {
      this.showError(error.error);
    });
  }

  updateUser(user: User) {
    
    user.roles[0].name = this.selectedRole;
    this.userService.updateUser(this.userId!, user).subscribe(
      (res: User) => {
        this.showSuccess(res);
        setTimeout(() => {
          this.router.navigate(['/user']);
        }, 1500);
      }, error => {
        this.showError(error.error);
      });
  }

  onSubmit() {
    this.updateUser(this.user)
  }

  showError(error: string): void {
    this.messageService.add({ severity: 'error', summary: 'Update Error', detail: error });
  }

  showSuccess(user: User): void {
    this.messageService.add({ severity: 'success', summary: ' Update Successfully', detail: `User ${user.name} has been updated` });
  }

}
