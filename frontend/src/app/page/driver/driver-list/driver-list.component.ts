import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { DriverService } from '../driver.service';
import { Driver } from 'src/app/modal/driver';
import { PaginatedResponse } from 'src/app/modal/paginatedResponse';

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

  query !: {
    page: number,
    size: number
  };

  value: number | null = null;
  totalRecords: number = 0;
 

  ngOnInit() {
      this.items = [{ label: 'Driver List'}];

      this.getAllDrivers();
  }

  getAllDrivers() {
      this.driverService.searchDriver(this.value, this.query).subscribe((res: PaginatedResponse<Driver>) => {
      this.driver = res.content;
      this.query = { page: res.pageable.pageNumber, size: res.size }
      this.totalRecords = res.totalElements;
    })  
  }



  deleteDriver(id: Number) {

      this.driverService.deleteDriver(id).subscribe((res) => {
  
        this.messageService.add({ severity: 'Delete Successfully', summary: 'Delete Successfully', detail: 'Employee has been deleted' });  
  
        this.getAllDrivers();
        
      })
    
  }

  onPageChange(event?: any) {
    this.query.page = event.page;
    this.query.size = event.rows;
    this.getAllDrivers()
  }

}
