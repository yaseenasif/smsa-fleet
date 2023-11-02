import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Driver } from 'src/app/modal/driver';
import { DriverService } from '../driver.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-update-driver',
  templateUrl: './update-driver.component.html',
  styleUrls: ['./update-driver.component.scss']
})
export class UpdateDriverComponent implements OnInit {

  items: MenuItem[] | undefined;

  driver: Driver = {
    id: undefined,
    empId: {
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
    },
    licenseNumber: undefined,
    vehicleBudget: undefined
  }

  driverId: Number | undefined;


  constructor( private driverService: DriverService,
                private router: Router,
              private route: ActivatedRoute,

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
  
  onSubmit() {

  }
}
