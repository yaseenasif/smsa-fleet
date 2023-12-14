import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Role } from 'src/app/modal/role';
import { RoleService } from '../role.service';

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.scss']
})
export class RoleListComponent {
  roles!: Role[];
  
  constructor(private roleService: RoleService) { }

  products:any=[{name:"Demo",permission:[{id:1,name:"Demo"}]},
  {name:"Demo",permission:[{id:1,name:"Demo"},{id:1,name:"Demo"}]},
  {name:"Demo",permission:[{id:1,name:"Demo"}]},
  {name:"Demo",permission:[{id:1,name:"Demo"}]},
  {name:"Demo",permission:[{id:1,name:"Demo"},{id:1,name:"Demo"}]},
  {name:"Demo",permission:[{id:1,name:"Demo"}]},
  {name:"Demo",permission:[{id:1,name:"Demo"},{id:1,name:"Demo"},{id:1,name:"Demo"},{id:1,name:"Demo"}]},
  {name:"Demo",permission:[{id:1,name:"Demo"}]},
  {name:"Demo",permission:[{id:1,name:"Demo"},{id:1,name:"Demo"},{id:1,name:"Demo"}]},
  {name:"Demo",permission:[{id:1,name:"Demo"}]},];
  items: MenuItem[] | undefined;

 

  ngOnInit() {
      this.items = [{ label: 'Role'}];
      this.getAllRoles();
  }

  getAllRoles(){
    this.roleService.getAllRoles().subscribe((res: Role[])=>{
      this.roles=res;      
    })
  }
}
