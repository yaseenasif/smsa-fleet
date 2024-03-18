import { Component } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api'
import { Role } from 'src/app/modal/role';
import { RoleService } from '../role.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Permission } from 'src/app/modal/Permission';
import { PermissionService } from '../../permission/service/permission.service';

@Component({
  selector: 'app-edit-role',
  templateUrl: './edit-role.component.html',
  styleUrls: ['./edit-role.component.scss']
})
export class EditRoleComponent {
  items: MenuItem[] | undefined;
  role: Role = {
    id: null,
    name: null,
    permissions: [],
  };
  permissions!: Permission[];
  roleId: number = 0;

  constructor(
    private roleService: RoleService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
    private permissionService: PermissionService
  ) { }


  ngOnInit(): void {
    this.items = [{ label: 'Role list', routerLink: '/role' }, { label: 'Edit Role' }];
    this.roleId = +this.route.snapshot.paramMap.get('id')!;
    this.getRoleById(this.roleId);
    this.getPermissions();
  }

  getPermissions(): Permission[] {
    this.permissionService.getPermissions().subscribe(
      (res: Permission[]) => {
        this.permissions = res;
        if (this.role.permissions.length > 0) {
          this.permissions.forEach(permission => {
            permission.status = this.role.permissions.some(rolePermission => rolePermission.name === permission.name);
          });
        }
      }, error => {
        this.showError(error.error);
      }
    )
    return this.permissions;
  }

  getRoleById(id: number): void {
    this.roleService.getRolebyId(id).subscribe(
      (res: Role) => {
        this.role = res;
      }, error => {
        this.showError(error.error);
      }
    )
  }

  updateRole(): void {
    debugger
    const selectedPermissions = this.permissions.filter(perm => perm.status);
    this.role.permissions = selectedPermissions
    this.roleService.updateRole(this.roleId, this.role).subscribe(
      (res: Role) => {
        this.showSuccess(res);
        setTimeout(() => {
          this.router.navigate(['/role']);
        }, 1500);
      },
      (error) => {
        this.showError(error.error)
      }
    );
  }
  showError(error: string): void {
    this.messageService.add({ severity: 'error', summary: 'Add Error', detail: error });
  }
  showSuccess(value: Role): void {
    this.messageService.add({ severity: 'success', summary: ' Updated Successfully', detail: `Role ${value.name} has been updated` });
  }
  selectAllPermissions(event: Event) {
    const target = event.target as HTMLInputElement
    const isChecked = target.checked;
    for (const perm of this.permissions) {
      perm.status = isChecked;
    }
  }
}

