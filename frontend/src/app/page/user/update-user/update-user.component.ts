import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {MenuItem} from 'primeng/api'
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

  selectedRole!: Role
  roles!: Role[];

  user: User = {
    id: undefined,
    name: undefined,
    email: undefined,
    password: undefined,
    roles: []
  }

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private roleService: RoleService
  ) { }

  userId: Number | undefined;


  ngOnInit(): void {
    this.items = [{ label: 'User',routerLink:'/user'},{ label: 'Edit User'}];
    this.userId = +this.route.snapshot.paramMap.get('id')!;

    this.getAllRoles()
    this.getUserById(this.userId)
   
  }

  getAllRoles(){
    this.roleService.getAllRoles().subscribe((res: Role[])=>{
      this.roles=res;      
    })
  }

  getUserById(id: Number) {
    this.userService.getUserById(id).subscribe((res: User) => {
      this.user = res;
      console.log(this.user);
      

  })
  }

  updateUser(user: User) {

    this.userService.updateUser(this.userId!, user).subscribe((res) => {

    })

  }

  onSubmit() {
    this.updateUser(this.user)
  }
  
}
