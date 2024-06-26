import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api'
import { Role } from 'src/app/modal/role';
import { User } from 'src/app/modal/user';
import { RoleService } from '../../role/role.service';
import { UserService } from '../user.service';
import { Region } from 'src/app/modal/Region';
import { RegionService } from '../../region/service/region.service';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.scss']
})
export class UpdateUserComponent implements OnInit {
  items: MenuItem[] | undefined;

  selectedRole: string | undefined | null;
  roles!: Role[];
  regions!: Region[]
  selectedRegion!: Region[]

  user: User = {
    id: undefined,
    name: undefined,
    email: undefined,
    password: undefined,
    employeeId: undefined,
    roles: [],
    regions: []
  }
  redirectValue: string | null |undefined;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private roleService: RoleService,
    private regionService: RegionService,
    private messageService: MessageService,
    private router: Router
  ) {
    // this.userId = +this.route.snapshot.paramMap.get('id')!;

   }

  userId: number | undefined;


  ngOnInit(): void {
    this.items = [{ label: 'User', routerLink: '/user' }, { label: 'Edit User' }];
    this.getAllRoles();
    this.getAllRegions();
    this.route.queryParams.subscribe(params => {
      if (params.hasOwnProperty('redirectValue')) {
        this.redirectValue = params['redirectValue'];
      }
      if (params.hasOwnProperty('id')) {
        this.userId = params['id'];
        this.getUserById(this.userId!); // Call the function only if userId is available

      }
    });

    if (!this.userId) {
      this.userId = +this.route.snapshot.paramMap.get('id')!;
      this.getUserById(this.userId!); // Call the function only if userId is available

    }
  }

  getAllRoles() {
    this.roleService.getAllRoles().subscribe(
      (res: Role[]) => {
        this.roles = res;
      }, error => {
        this.showError(error.error);
      });
  }

  getAllRegions() {
    this.regionService.getRegion().subscribe((res: Region[]) => {
      this.regions = res;
    })
  }

  getUserById(id: number) {
    this.userService.getUserById(id).subscribe((res: User) => {
      this.user = res;
      this.selectedRole = res?.roles[0]?.name;
    }, error => {
      this.showError(error.error);
    });
  }

  updateUser(user: User) {
    user.roles[0].name = this.selectedRole;
    this.userService.updateUser(this.userId!, user).subscribe(
      (res: User) => {
        this.showSuccess(res);
        if(this.redirectValue === 'Vehicle'){
          this.router.navigate(['/vehicle']);
        }else if(this.redirectValue === 'Employee'){
          this.router.navigate(['/employee']);
        }else if(this.redirectValue === 'Assignment'){
          this.router.navigate(['/assignment']);
        }else if(this.redirectValue === 'ProjectVehicle'){
          this.router.navigate(['/project-vehicle']);
        }else if(this.redirectValue === 'Dashboard'){
          this.router.navigate(['/home']);
        }else{
          this.router.navigate(['/user']);
        }
      }, error => {
        this.showError(error.error);
      });
  }

  onSubmit() {
    this.updateUser(this.user)
  }

  showError(error: string): void {
    this.messageService.add({ severity: 'error', summary: 'Update Error', detail: error });
  }

  showSuccess(user: User): void {
    this.messageService.add({ severity: 'success', summary: ' Update Successfully', detail: `User ${user.name} has been updated` });
  }

  onCancel(){
    if(this.redirectValue === 'Vehicle'){
      this.router.navigate(['/vehicle']);
    }else if(this.redirectValue === 'Employee'){
      this.router.navigate(['/employee']);
    }else if(this.redirectValue === 'Assignment'){
      this.router.navigate(['/assignment']);
    }else if(this.redirectValue === 'ProjectVehicle'){
      this.router.navigate(['/project-vehicle']);
    }else if(this.redirectValue === 'Dashboard'){
      this.router.navigate(['/home']);
    }
    else{
      this.router.navigate(['/user']);
    }
  }

}
