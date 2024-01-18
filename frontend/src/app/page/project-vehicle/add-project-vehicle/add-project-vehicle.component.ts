import { Component } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { ProjectVehicle } from 'src/app/modal/project-vehicle';
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

  projectVehicle : ProjectVehicle[] = [
    {
      id: undefined,
      projectName: undefined,
      plateNumber: undefined,
      vendor: {
        id: undefined,
        vendorName: undefined,
        officeLocation: undefined,
        contactPersonList: [],
        attachments: undefined
      }
    }
  ]

  ngOnInit(): void {
    this.items = [{ label: 'Project Vehicle',routerLink:'/project-vehicle'},{ label: 'Add Project Vehicle'}];
  this.getAllVendors();
  }

  addMoreField() {
    const newProjectField: ProjectVehicle = {
      id: undefined,
      projectName: undefined,
      plateNumber: undefined,
      vendor: {
        id: undefined,
        vendorName: undefined,
        officeLocation: undefined,
        contactPersonList: [],
        attachments: undefined
      }
    }

    this.projectVehicle.push(newProjectField);
  }

  removeField(index: number) {
    if (this.projectVehicle.length > 1) {
      this.projectVehicle.splice(index, 1);
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
    this.projectVehicleService.addProjectVehicle(this.projectVehicle).subscribe((res: ProjectVehicle) => {
      this.messageService.add({ severity: 'success', summary: 'Project Vehicle Added Successfully' });
      setTimeout(() => {
        this.router.navigate(['/project-vehicle'])
      }, 5000)
    },
    )
  }

}
