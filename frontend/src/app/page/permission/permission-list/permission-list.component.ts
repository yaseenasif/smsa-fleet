import { Component } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Permission } from 'src/app/modal/Permission';
import { PermissionService } from '../service/permission.service';

@Component({
  selector: 'app-permission-list',
  templateUrl: './permission-list.component.html',
  styleUrls: ['./permission-list.component.scss']
})
export class PermissionListComponent {
  permissionList!: Permission[];
  items: MenuItem[] | undefined;
  areYouSure: boolean = false;
  permissionRow: Permission | undefined | null;

  constructor(
    private permissionService: PermissionService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.items = [{ label: 'Permission' }];
    this.getAllPermissions();
  }

  getAllPermissions(): void {
    this.permissionService.getPermissions().subscribe(
      (res: Permission[]) => {
        this.permissionList = res;
      }, error => {
        this.showError(error.error);
      })
  }
  showDialog(permissionRow: Permission) {
    this.permissionRow = permissionRow;
    this.areYouSure = true;
  }

  deletePermission(obj: Permission | undefined | null) {
    this.permissionService.deletePermissionById(obj!.id!).subscribe(res => {
      this.areYouSure = false;
      this.getAllPermissions();
    }, error => {

    })
  }
  showError(error: string): void {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: error });
  }
}
