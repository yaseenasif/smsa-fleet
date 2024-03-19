import { Component } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api'
import { Role } from 'src/app/modal/role';
import { RoleService } from '../role.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Permission } from 'src/app/modal/Permission';
import { PermissionService } from '../../permission/service/permission.service';
import { Subscription } from 'rxjs';

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
  vehicleList!: Permission[];
  vehiclePermissionObject!: { [x: string]: Permission[]; };
  vehicleCollapse: boolean = false;
  isSelectAll: boolean = false;

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
          this.isSelectAll = this.permissions.every(permission => permission.status === true);
          // this.vehicleList = this.permissions.filter((vehicle) => vehicle.name?.includes("Vehicle"));
          const allowedVehiclePermissions = ['AddVehicles', 'ViewVehicles', 'UpdateVehicles', 'DeleteVehicles', 'VehiclesHistory', 'ReplaceVehicles', 'VehiclesAttachment'];

          this.vehicleList = this.permissions.filter((vehicle) => allowedVehiclePermissions.includes(vehicle.name!));
          const vehiclePermission = this.permissions.find(perm => perm.name === 'Vehicles');
          
          if (vehiclePermission && typeof vehiclePermission.name === 'string') {
            this.vehiclePermissionObject = { [vehiclePermission.name]: this.vehicleList };
          }
          
          // this.permissions = this.permissions.filter(perm => !perm.name?.includes('ViewVehicle'));
          // if (this.vehiclePermissionObject) {
          //   // const vehiclesArray = this.vehiclePermissionObject['Vehicles'];
          //   if (Array.isArray(vehiclesArray)) {
          //     // Push each item of vehiclesArray into permission array
          //     vehiclesArray.forEach(vehicle => this.permissions.push(vehicle));
          //   }
          // }
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

  toggleCollapse() {
    this.vehicleCollapse = !this.vehicleCollapse;
  }

  selectAllPermissions(event: Event) {
    const target = event.target as HTMLInputElement
    const isChecked = target.checked;
    for (const perm of this.permissions) {
      perm.status = isChecked;
    }
  }
  childPermissions(item: Permission) {
    
    if (item.name === "Vehicles") {
      this.vehiclePermissionObject['Vehicles'].forEach((element: Permission) => {
        
        element.status = item.status;
      });
    }
  }

  checkIsSeletAll(perm: Permission[]) {
    this.isSelectAll = perm.every(permission => permission.status === true);
  }
}

