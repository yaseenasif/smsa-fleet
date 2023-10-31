import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Employee } from 'src/app/modal/employee';
import { EmployeeService } from '../service/employee.service';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss'],
  providers: [MessageService]
})
export class EmployeeListComponent implements OnInit{

  constructor(
              private employeeService: EmployeeService,
              private messageService: MessageService) { }

  employee!: Employee[];


  items: MenuItem[] | undefined;

  ngOnInit(): void {

    this.items = [{
      label: 'Employee'
    }]

    this.getAllEmployees();

  }

  getAllEmployees() {

    this.employeeService.getAllEmployees().subscribe((res: Employee[]) => {
      
      this.employee = res;      
      
    })

  }

  deleteEmployee(id: Number) {

    this.employeeService.deleteEmployee(id).subscribe((res) => {

      this.messageService.add({ severity: 'Delete Successfully', summary: 'Delete Successfully', detail: 'Employee has been deleted' });  

      this.getAllEmployees();
      
    })
  }


}
