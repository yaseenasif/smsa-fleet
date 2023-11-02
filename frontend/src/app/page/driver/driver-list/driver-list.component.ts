import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { DriverService } from '../driver.service';
import { Driver } from 'src/app/modal/driver';

@Component({
  selector: 'app-driver-list',
  templateUrl: './driver-list.component.html',
  styleUrls: ['./driver-list.component.scss']
})
export class DriverListComponent implements OnInit {

  constructor(private driverService: DriverService) { }

  driver!: Driver[];
  
  items: MenuItem[] | undefined;

 

  ngOnInit() {
      this.items = [{ label: 'Driver List'}];

      this.getAllDrivers();
  }

  getAllDrivers() {
    this.driverService.getAllDriver().subscribe((res) => {
      
      this.driver = res;
      
    })
  }

}
