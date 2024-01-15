import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ProjectVehicle } from 'src/app/modal/project-vehicle';
import { Vendor } from 'src/app/modal/vendor';

@Component({
  selector: 'app-add-project-vehicle',
  templateUrl: './add-project-vehicle.component.html',
  styleUrls: ['./add-project-vehicle.component.scss']
})
export class AddProjectVehicleComponent {

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

  onSubmit() {

  }

}
