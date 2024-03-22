import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { DashboardRedirectServiceService } from 'src/app/CommonServices/dashboard-redirect-service.service';
import { Employee } from 'src/app/modal/employee';
import { EmployeeService } from '../service/employee.service';

@Component({
  selector: 'app-view-employee',
  templateUrl: './view-employee.component.html',
  styleUrls: ['./view-employee.component.scss']
})
export class ViewEmployeeComponent {

  items: MenuItem[] | undefined;
  employee!: Employee;
  employeeId: Number | undefined;

  constructor(private employeeService: EmployeeService,private route: ActivatedRoute,
    
    private dashboardRedirectService: DashboardRedirectServiceService) { }


  ngOnInit(){
    this.items = [{ label: 'Employee',routerLink:'/employee'},{ label: 'View Employee'}];
    this.employeeId = +this.route.snapshot.paramMap.get('id')!;
    this.getEmployeeById(this.employeeId);
    this.dashboardRedirectService.setDashboardValue('Employee');
  }

  getEmployeeById(id: Number) {
    this.employeeService.getEmployeeById(id).subscribe((res: Employee) => {
      this.employee = res;
    })
  }
}
