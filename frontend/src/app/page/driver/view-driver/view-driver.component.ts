import { Component } from '@angular/core';
import { DriverService } from '../driver.service';
import { ActivatedRoute } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Driver } from 'src/app/modal/driver';

@Component({
  selector: 'app-view-driver',
  templateUrl: './view-driver.component.html',
  styleUrls: ['./view-driver.component.scss']
})
export class ViewDriverComponent {
  items: MenuItem[] | undefined;
  driver!: Driver;
  employeeId: Number | undefined;
  constructor(private driverService: DriverService,private route: ActivatedRoute) { }


  ngOnInit(){
    this.items = [{ label: 'Driver Assignment',routerLink:'/driver'},{ label: 'View Driver Assignment'}];
    this.employeeId = +this.route.snapshot.paramMap.get('id')!;
    this.getViewDrivertById(this.employeeId);
  }

  getViewDrivertById(id: Number) {
    this.driverService.getDriverById(id).subscribe((res: Driver) => {
      this.driver = res;
    })
  }
}
