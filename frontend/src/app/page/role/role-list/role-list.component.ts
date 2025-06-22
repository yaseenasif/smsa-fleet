import { Component } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Role } from 'src/app/modal/role';
import { RoleService } from '../role.service';

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.scss']
})
export class RoleListComponent {

  items: MenuItem[] | undefined;
  roles!: Role[];
  roleRow: Role | undefined | null;
  areYouSure: boolean = false;

  constructor(
    private roleService: RoleService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.items = [{ label: 'RoleList' }];
    this.getAllRoles();
  }

  getAllRoles() {
    this.roleService.getAllRoles().subscribe((res: Role[]) => {
      this.roles = res;
      
    }, err => {
      this.showError(err.error);
    });
  }

  showDialog(roleRow: Role) {
    this.roleRow = roleRow;
    this.areYouSure = true;
  }

  deleteRole(obj: Role | undefined | null) {
    this.roleService.deleteRoleById(obj!.id!).subscribe((res: Role) => {
    }, error => {
    })
    this.showSuccess(`Role ${obj?.name} on id ${obj?.id} has been deleted`)
    setTimeout(() => {
      this.areYouSure = false;
      this.getAllRoles();
    }, 1000);
  }

  showSuccess(message: string) {
    this.messageService.add({ severity: 'success', summary: ' Deleted Successfully', detail: `${message}` });
  }

  showError(error: string): void {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: error });
  }
}
