import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { DashboardRedirectServiceService } from 'src/app/CommonServices/dashboard-redirect-service.service';

@Component({
  selector: 'app-update-assignment',
  templateUrl: './update-assignment.component.html',
  styleUrls: ['./update-assignment.component.scss']
})
export class UpdateAssignmentComponent {
  items: MenuItem[] | undefined;
    size=100000
  uploadedFiles: any[] = [];

   onUpload(event: any) {

  }

   onUpload1(event:any) {
    for(let file of event.files) {
        this.uploadedFiles.push(file);
    }
  }

  employee!:Employee[];
  selectedEmployee!:Employee;
  constructor(private dashboardRedirectService: DashboardRedirectServiceService) { }
  name!:string;
  contactNumber!:string;
  referenceNumber!:string;
  ngOnInit(): void {
    this.items = [{ label: 'Assignment',routerLink:'/assignment'},{ label: 'Edit Assignment'}];
    this.employee=[
      {
        employeeName:"karachi",
        id:1
      },
      {
        employeeName:"kaAAi",
        id:2
      },
      {
        employeeName:"Alld",
        id:3
      },
      {
        employeeName:"islamabad",
        id:4
      },
      {
        employeeName:"lahore",
        id:5
      },
    ]
    this.dashboardRedirectService.setDashboardValue('Assignment');
  }
  
}
interface Employee{
  employeeName:string,
  id:number
}
