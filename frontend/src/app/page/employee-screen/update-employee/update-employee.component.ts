import { Component } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Employee } from 'src/app/modal/employee';
import { EmployeeService } from '../service/employee.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-update-employee',
  templateUrl: './update-employee.component.html',
  styleUrls: ['./update-employee.component.scss'],
  providers: [MessageService, DatePipe]
})
export class UpdateEmployeeComponent {

  items: MenuItem[] | undefined;

  employee: Employee = {
    id: undefined,
    empName: undefined,
    jobTitle: undefined,
    joiningDate: undefined,
    department: undefined,
    section: undefined,
    region: undefined,
    city: undefined,
    nationality: undefined,
    contactNumber: undefined,
    companyEmailAddress: undefined,
    grade: undefined,
    licenseNumber: undefined,
    vehicleBudget: undefined
  }

  employeeId: Number | undefined;

  dummyData: any = [
    { id: 1, name: 'Software Developer' },
    { id: 2, name: 'Data Analyst' },
    { id: 3, name: 'Project Manager' },
    { id: 4, name: 'Web Designer' },
    { id: 5, name: 'Grade A' },
    { id: 6, name: 'North America' },
    { id: 7, name: 'South Asia' },
    { id: 8, name: 'New York City' },
    { id: 9, name: 'Pakistan' },
    { id: 10, name: 'Quality Assurance Tester' }
  ]

  constructor(private employeeService: EmployeeService,
              private router: Router,
              private messageService: MessageService,
              private route: ActivatedRoute,
              private datePipe: DatePipe) { }


  name!:string;

  size=100000
  uploadedFiles: any[] = [];

   onUpload(event: any) {
    
  }

   onUpload1(event:any) {
    for(let file of event.files) {
        this.uploadedFiles.push(file);
    }
  }
  
  ngOnInit(): void {
    this.items = [{ label: 'Employee',routerLink:'/employee'},{ label: 'Edit Employee'}];
    this.employeeId = +this.route.snapshot.paramMap.get('id')!;
    this.getEmployeeById(this.employeeId)
  }

  getEmployeeById(id: Number) {
    this.employeeService.getEmployeeById(id).subscribe((res: Employee) => {
      res.joiningDate = res.joiningDate ? new Date(res.joiningDate) : new Date();
      this.employee = res;

      console.log(this.employee);
      
    })
  }

  updateEmployee(employee: Employee) {

    this.employeeService.updateEmployee(this.employeeId!, employee).subscribe((res) => {

      this.messageService.add({ severity: 'Update Successfully', summary: 'Update Successfully', detail: 'Message Content' });  

      setTimeout(() => {
        this.router.navigate(['/employee'])
      },8000)
      
    })

  }

  onSubmit() {
    this.updateEmployee(this.employee);
  }
}

