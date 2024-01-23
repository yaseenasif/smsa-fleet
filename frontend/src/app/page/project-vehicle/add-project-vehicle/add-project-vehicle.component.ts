import { Component, OnInit } from '@angular/core';
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
export class AddProjectVehicleComponent implements OnInit {
  items: MenuItem[] | undefined;
  vendors!: Vendor[];

  projectVehicle: ProjectVehicle = {
    id: null,
    projectName: null,
    date: null,
    projectVehicleValuesList: [{
      id: null,
      plateNumber: null,
      leaseCost: null,
      rentalLease: null,
      vendor: {
        id: null,
        vendorName: null,
        officeLocation: null,
        contactPersonList: [],
        attachments: null
      }
    }]
  };

  constructor(
    private projectVehicleService: PrjectVehicleService,
    private messageService: MessageService,
    private router: Router,
    private vendorService: VendorService
  ) {}

  ngOnInit(): void {
    this.items = [{ label: 'Project Vehicle', routerLink: '/project-vehicle' }, { label: 'Add Project Vehicle' }];
    this.getAllVendors();
    console.log(this.projectVehicle);
  }

  addMoreFieldValue() {
    const newFieldValue: ProjectVehicleValues = {
      id: null,
      plateNumber: null,
      leaseCost: null,
      rentalLease: null,
      vendor: {
        id: null,
        vendorName: null,
        officeLocation: null,
        contactPersonList: [],
        attachments: null
      }
    };

    this.projectVehicle.projectVehicleValuesList.push(newFieldValue);

  }

 
  removeFieldValue(index: number) {
    if (this.projectVehicle.projectVehicleValuesList.length > 1) {
      this.projectVehicle.projectVehicleValuesList.splice(index, 1);
    }
  }

  getAllVendors() {
    this.vendorService.getVendor().subscribe((res: Vendor[]) => {
      this.vendors = res;
    });
  }
  onSubmit() {
    this.projectVehicleService.addProjectVehicle(this.projectVehicle).subscribe(
      (res: ProjectVehicle) => {
        this.messageService.add({ severity: 'success', summary: 'Project Vehicle Added Successfully' });
        setTimeout(() => {
          this.router.navigate(['/project-vehicle']);
        }, 1000);
      },
      (error) => {
      }
    );
  }
}
