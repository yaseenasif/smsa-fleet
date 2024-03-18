import { Component } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { PermissionService } from '../../permission/service/permission.service';
import { Role } from 'src/app/modal/role';
import { Permission } from 'src/app/modal/Permission';
import { RoleService } from '../role.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-role',
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.scss']
})
export class AddRoleComponent {
  items: MenuItem[] | undefined;
  permission!: Permission[];

  role: Role = {
    id: null,
    name: null,
    permissions: [],
  };
  vehicleCollapse: boolean = false;
  vehiclePermissionObject: any;
  vehicleList!: Permission[];
  isSelectAll: boolean = false;

  constructor(
    private permissionService: PermissionService,
    private messageService: MessageService,
    private roleService: RoleService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.items = [{ label: 'Role list', routerLink: '/role' }, { label: 'Add Role' }];
    this.getPermissions();
  }

  getPermissions(): void {
    this.permissionService.getPermissions().subscribe(
      (res: Permission[]) => {
        this.vehicleList = res.filter((vehicle) => vehicle.name?.includes("Vehicle"));
        const vehiclePermission = res.find(perm => perm.name === 'Vehicles');
        if (vehiclePermission && typeof vehiclePermission.name === 'string') {
          this.vehiclePermissionObject = { [vehiclePermission.name]: this.vehicleList };
        }

        this.permission = res.filter(perm => !perm.name?.includes('Vehicle'));
        if (this.vehiclePermissionObject) {
          const vehiclesArray = this.vehiclePermissionObject['Vehicles'];
          if (Array.isArray(vehiclesArray)) {
            // Push each item of vehiclesArray into permission array
            vehiclesArray.forEach(vehicle => this.permission.push(vehicle));
          }
        }

        // Set status to false for each permission
        this.permission.forEach(perm => perm.status = false);
      },
      error => {
        this.showError(error.error);
      }
    );
  }


  addRole(): void {
    debugger
    const selectedPermissions = this.permission.filter(perm => perm.status);
    this.role.permissions = selectedPermissions;
    this.roleService.addRole(this.role).subscribe(
      (res: Role) => {
        this.showSuccess(res);
        setTimeout(() => {
          this.router.navigate(['/role']);
        }, 1500);
      }, error => {
        this.showError(error.error)
      }
    )
  }

  showError(error: string): void {
    this.messageService.add({ severity: 'error', summary: 'Add Error', detail: error });
  }

  showSuccess(value: Role): void {
    this.messageService.add({ severity: 'success', summary: ' Added Successfully', detail: `Permission ${value.name} has been added` });
  }

  toggleCollapse() {
    this.vehicleCollapse = !this.vehicleCollapse;
  }

  selectAllPermissions(event: Event) {
    const target = event.target as HTMLInputElement
    const isChecked = target.checked;
    for (const perm of this.permission) {
      perm.status = isChecked;
    }
  }
  childPermissions(item: Permission) {
    debugger
    if (item.name === "Vehicles") {
      this.vehiclePermissionObject.Vehicles.forEach((element: Permission) => {
        debugger
        element.status = item.status;
      });
    }
  }

  checkIsSeletAll(perm: Permission[]) {
    this.isSelectAll = perm.every(permission => permission.status === true);
  }
}
