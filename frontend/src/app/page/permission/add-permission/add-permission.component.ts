import { Component } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { PermissionService } from '../service/permission.service';
import { Permission } from 'src/app/modal/Permission';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-permission',
  templateUrl: './add-permission.component.html',
  styleUrls: ['./add-permission.component.scss']
})
export class AddPermissionComponent {
  items: MenuItem[] | undefined;
  permission: Permission = {
    id: null,
    name: null,
    status: null,
  };

  constructor(
    private permissionService: PermissionService,
    private messageService: MessageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.items = [{ label: 'Permission list', routerLink: '/permission' }, { label: 'Add Permission' }];
  }
  addPermission(): void {
    this.permissionService.addPermission(this.permission).subscribe(
      (res: Permission) => {
        this.showSuccess(res);
        setTimeout(() => {
          this.router.navigate(['/permission']);
        }, 1500);
      }, error => {
        this.showError(error.error)
      }
    )
  }
  showError(error: string): void {
    this.messageService.add({ severity: 'error', summary: 'Add Error', detail: error });
  }
  showSuccess(value: Permission): void {
    this.messageService.add({ severity: 'success', summary: ' Added Successfully', detail: `Permission ${value.name} has been added` });
  }
}
