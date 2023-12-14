import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { User } from 'src/app/modal/user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  users!: User[];

  constructor(private userService: UserService) { }

  items: MenuItem[] | undefined;

 

  ngOnInit() {
      this.items = [{ label: 'User'}];
      this.getActiveUsers();
  }

  getActiveUsers(){
    this.userService.getActiveUsers().subscribe((res: User[])=>{
      this.users=res;      
    })
  }

  
}
