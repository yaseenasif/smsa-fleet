import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Driver } from 'src/app/modal/driver';
import { DriverService } from '../driver.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-update-driver',
  templateUrl: './update-driver.component.html',
  styleUrls: ['./update-driver.component.scss'],
  providers: [MessageService]
})
export class UpdateDriverComponent implements OnInit {

  items: MenuItem[] | undefined;

  driver: Driver = {
    id: undefined,
    empId: {
        id: undefined,
        employeeNumber:  undefined,
        budgetRef: undefined,
        empName: undefined,
        gender: undefined,
        maritalStatus: undefined,
        dateOfBirth: undefined,
        joiningDate: undefined,
        jobTitle: undefined,
        status: undefined,
        region: undefined,
        location: undefined,
        organization: undefined,
        division: undefined,
        deptCode: undefined,
        department: undefined,
        contactNumber: undefined,
        section: undefined,
        iqamaNumber: undefined,
        svEmployeeNumber: undefined,
        svEmployeeName: undefined,
        city: undefined,
        age:  undefined,
        portOfDestination: undefined,
        nationality: undefined,
        companyEmailAddress: undefined,
        grade: undefined,
        licenseNumber: undefined,  
        vehicleBudget: undefined
    },
    licenseNumber: undefined,
    vehicleBudget: undefined
  }

  driverId: Number | undefined;


  constructor( private driverService: DriverService,
                private router: Router,
              private route: ActivatedRoute,
              private messageService: MessageService

    ) { }


  name!:string;
  contactNumber!:string;
  referenceNumber!:string;
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
    this.items = [{ label: 'Driver List',routerLink:'/driver'},{ label: 'Edit Driver'}];

    this.driverId = +this.route.snapshot.paramMap.get('id')!;

    this.getDriverById(this.driverId)
    
  }

  getDriverById(id: Number) {
    this.driverService.getDriverById(id).subscribe((res: Driver) => {
      res.empId.joiningDate = res.empId.joiningDate ? new Date(res.empId.joiningDate) : new Date();
      this.driver = res;

      console.log(this.driver);
      
    })
  }

  updateDriver(driver: Driver) {

    this.driverService.updateDriver(this.driverId!, driver).subscribe((res) => {

      this.messageService.add({ severity: 'Update Successfully', summary: 'Update Successfully', detail: 'Message Content' });  

      setTimeout(() => {
        this.router.navigate(['/driver'])
      },5000)
      
    })

  }
  
  onSubmit() {

    this.updateDriver(this.driver)

  }
}
