import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Role } from 'src/app/modal/role';
import { User } from 'src/app/modal/user';
import { RoleService } from '../../role/role.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {

  items: MenuItem[] | undefined;
  roles!: Role[];
  selectedRole!: Role

  user: User = {
    id: undefined,
    name: undefined,
    email: undefined,
    password: undefined,
    roles: []
  }
 
  // user!: User;

  constructor(private roleService: RoleService,
              private userService: UserService) { }


  ngOnInit(): void {

    this.items = [{ label: 'User',routerLink:'/user'},{ label: 'Add User'}];
    this.getAllRoles();
  }


  getAllRoles(){
    this.roleService.getAllRoles().subscribe((res: Role[])=>{
      this.roles=res;      
    })
  }

  onSubmit() {    
    this.userService.addUser(this.user).subscribe((res) => {      
    })
  }

  getRoleData() {

  }

}

