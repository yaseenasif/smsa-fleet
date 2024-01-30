import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { ProjectVehicle, ProjectVehicleValues } from 'src/app/modal/project-vehicle';
import { Vendor } from 'src/app/modal/vendor';
import { PrjectVehicleService } from '../service/prject-vehicle.service';
import { Router } from '@angular/router';
import { VendorService } from '../../vendor-screen/service/vendor.service';
import { ProductFieldServiceService } from '../../product-field/service/product-field-service.service';
import { ProductField } from 'src/app/modal/ProductField';

@Component({
  selector: 'app-add-project-vehicle',
  templateUrl: './add-project-vehicle.component.html',
  styleUrls: ['./add-project-vehicle.component.scss'],
  providers: [MessageService]
})
export class AddProjectVehicleComponent implements OnInit {
  items: MenuItem[] | undefined;
  vendors!: Vendor[];
  projectNames: ProductField | null | undefined;
  types : ProductField | null | undefined;
  replacementCheck: boolean | undefined;



   projectVehicle: ProjectVehicle = {
    id: null,
    projectName: null,
    date: null,
    projectVehicleValuesList: [{
      id: null,
      plateNumber: null,
      leaseCost: null,
      type: null,
      origin: null,
      destination: null,
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
    private vendorService: VendorService,
    private productFieldService: ProductFieldServiceService,

  ) {}

  ngOnInit(): void {
    this.items = [{ label: 'Project Vehicle', routerLink: '/project-vehicle' }, { label: 'Add Project Vehicle' }];
    this.getAllVendors();
    console.log(this.projectVehicle);
    this.getProjectName();
    this.getType()
  }
  projectVehicleField: any = {
    leaseType: null,
    origin: null,
    destinition: null,
  };
  addMoreFieldValue() {
    const newFieldValue: ProjectVehicleValues = {
      id: null,
      plateNumber: null,
      leaseCost: null,
      type: null,
      origin: null,
      destination: null,
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
        this.messageService.add({ severity: 'success', summary: 'Project Vehicle Added Successfully', detail: 'Project Vehicle has been added'});
        setTimeout(() => {
          this.router.navigate(['/project-vehicle']);
        }, 1000);
      },
      (error) => {
      }
    );
  }
  getProjectName() {
    this.productFieldService.getProductFieldByName('Project Name').subscribe((res: ProductField) => {
      this.projectNames = res;
      console.log(res);
      
    }, error => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error });
    })
  }
  getType() {
    this.productFieldService.getProductFieldByName('Type').subscribe((res: ProductField) => {
      this.types = res;
      console.log(res);
      
    }, error => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error });
    })
  }

  onLeaseTypeChange() {
    if (this.projectVehicleField.leaseType !== 'rentalLease') {
      this.projectVehicle.projectVehicleValuesList.forEach(item => {
        item.origin = null;
        item.destination = null;
      });
    }
  }
}
