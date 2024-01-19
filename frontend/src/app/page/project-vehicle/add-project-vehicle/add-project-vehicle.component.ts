import { Component } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { ProjectVehicle, ProjectVehicleValues } from 'src/app/modal/project-vehicle';
import { Vendor } from 'src/app/modal/vendor';
import { PrjectVehicleService } from '../service/prject-vehicle.service';
import { Router } from '@angular/router';
import { VendorService } from '../../vendor-screen/service/vendor.service';

@Component({
  selector: 'app-add-project-vehicle',
  templateUrl: './add-project-vehicle.component.html',
  styleUrls: ['./add-project-vehicle.component.scss'],
  providers: [MessageService]

})
export class AddProjectVehicleComponent {
constructor(private projectVehicleService : PrjectVehicleService,
  private messageService : MessageService,
  private router: Router,
  private vendorService : VendorService
  ){}
  items: MenuItem[] | undefined;

  vendors !: Vendor[];
  additionalPlateNumbers: String[] = [];
  additionalVendors: Vendor[] = [];

  projectVehicle: (ProjectVehicle)[] = [
  {
      id: null,
      projectName: null,
      startDate: null,
      projectVehicleValues: [
        {
          id: null,
          plateNumber: null,
          cost: null,
          rentalLease: null,
          vendor: {
            id: null,
            vendorName: null,
            officeLocation: null,
            contactPersonList: [],
            attachments: null
          }
        }
      ]
    }
  ];

  ngOnInit(): void {
    this.items = [{ label: 'Project Vehicle',routerLink:'/project-vehicle'},{ label: 'Add Project Vehicle'}];
  this.getAllVendors();
  }
  addMoreFieldValue(i: number) {
    const newFieldValue: ProjectVehicleValues = {
      id: null,
      plateNumber: null,
      cost: null,
      rentalLease: null,
      vendor: {
        id: null,
        vendorName: null,
        officeLocation: null,
        contactPersonList: [],
        attachments: null
      }
    };
  
    if (this.projectVehicle[i].projectVehicleValues) {
      this.projectVehicle[i].projectVehicleValues.push(newFieldValue);
    } else {
      this.projectVehicle[i].projectVehicleValues = [newFieldValue];
    }
  }
  // removeField(index: number) {
  //   if (this.projectVehicle.length > 1) {
  //     this.projectVehicle.splice(index, 1);
  //   }
  // }
  removeFieldValue(parentIndex: number, childIndex: number) {
    const projectVehicleField = this.projectVehicle[parentIndex];
  
    if (projectVehicleField.projectVehicleValues.length > 1) {
      projectVehicleField.projectVehicleValues.splice(childIndex, 1);
    }
  }
  getAllVendors() {
    this.vendorService.getVendor().subscribe(
      (res: Vendor[]) => {
        this.vendors = res;
      }
    );
  }
  onSubmit() {
    this.projectVehicleService.addProjectVehicle(this.projectVehicle as ProjectVehicle[]).subscribe((res: ProjectVehicle) => {
      this.messageService.add({ severity: 'success', summary: 'Project Vehicle Added Successfully' });
      setTimeout(() => {
        this.router.navigate(['/project-vehicle'])
      }, 5000)
    },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Upload Error', detail: error.error });
      })
  }

}
