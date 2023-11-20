import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { DriverService } from '../driver.service';
import { Driver } from 'src/app/modal/driver';

@Component({
  selector: 'app-driver-list',
  templateUrl: './driver-list.component.html',
  styleUrls: ['./driver-list.component.scss'],
  providers: [MessageService]
})
export class DriverListComponent implements OnInit {

  constructor(private driverService: DriverService, private messageService: MessageService) { }

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

  deleteDriver(id: Number) {

      this.driverService.deleteDriver(id).subscribe((res) => {
  
        this.messageService.add({ severity: 'Delete Successfully', summary: 'Delete Successfully', detail: 'Employee has been deleted' });  
  
        this.getAllDrivers();
        
      })
    
  }

}
