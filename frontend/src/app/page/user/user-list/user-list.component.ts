import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { User } from 'src/app/modal/user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  users!: User[];
  userRow: User | undefined | null;
  areYouSure: boolean = false;

  constructor(
    private userService: UserService,
    private messageService: MessageService
  ) { }

  items: MenuItem[] | undefined;



  ngOnInit() {
    this.items = [{ label: 'User' }];
    this.getActiveUsers();
  }

  getActiveUsers() {
    this.userService.getActiveUsers().subscribe(
      (res: User[]) => {
        this.users = res;
      }, error => {
        this.showError(error.error);
      });
  }

  showDialog(userRow: User) {
    this.userRow = userRow;
    this.areYouSure = true;
  }

  deleteUser(obj: User | undefined | null) {
    this.userService.deleteUserById(obj!.id!).subscribe(
      (res: User) => {
        this.areYouSure = false;
        this.getActiveUsers();
      }, error => {
        this.showError(error.error);
      })
  }
  showError(error: string): void {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: error });
  }
}
