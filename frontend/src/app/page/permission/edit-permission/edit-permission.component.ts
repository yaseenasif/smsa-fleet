import { Component } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api'
import { PermissionService } from '../service/permission.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Permission } from 'src/app/modal/Permission';

@Component({
  selector: 'app-edit-permission',
  templateUrl: './edit-permission.component.html',
  styleUrls: ['./edit-permission.component.scss']
})
export class EditPermissionComponent {
  items: MenuItem[] | undefined;
  permission: Permission = {
    id: null,
    name: null,
    status: null,
  };
  permissionId: number = 0;

  constructor(
    private permissionService: PermissionService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute
  ) { }


  ngOnInit(): void {
    this.items = [{ label: 'Permission list', routerLink: '/permission' }, { label: 'Edit Permission' }];
    this.permissionId = +this.route.snapshot.paramMap.get('id')!;

    this.getPermissionById(this.permissionId);
  }

  getPermissionById(id: number): void {
    this.permissionService.getPermissionbyId(id).subscribe(
      (res: Permission) => {
        this.permission = res;
      }, error => {
      }
    )
  }

  updatePermission(): void {
    this.permissionService.updatePermission(this.permissionId, this.permission).subscribe(
      (res: Permission) => {
        this.showSuccess(res);
        setTimeout(() => {
          this.router.navigate(['/permission']);
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
  showSuccess(value: Permission): void {
    this.messageService.add({ severity: 'success', summary: ' Updated Successfully', detail: `Permission ${value.name} has been updated` });
  }
}
