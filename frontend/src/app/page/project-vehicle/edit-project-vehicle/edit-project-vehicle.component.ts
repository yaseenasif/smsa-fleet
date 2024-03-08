import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService, SelectItem } from 'primeng/api';
import { ProjectVehicle, ProjectVehicleValues } from 'src/app/modal/project-vehicle';
import { PrjectVehicleService } from '../service/prject-vehicle.service';
import { Vendor } from 'src/app/modal/vendor';
import { ActivatedRoute, Router } from '@angular/router';
import { VendorService } from '../../vendor-screen/service/vendor.service';
import { ProductFieldServiceService } from '../../product-field/service/product-field-service.service';
import { ProductField } from 'src/app/modal/ProductField';

@Component({
  selector: 'app-edit-project-vehicle',
  templateUrl: './edit-project-vehicle.component.html',
  styleUrls: ['./edit-project-vehicle.component.scss'],
  providers: [MessageService]
})
export class EditProjectVehicleComponent implements OnInit {
  items: MenuItem[] | undefined;
  vendors!: Vendor[];
  projectNames: ProductField | null | undefined;
  replacementCheck: boolean | undefined;
  vehicleTypes: SelectItem[] = [
    { label: 'Rental', value: 'Rental' },
    { label: 'Leased', value: 'Leased' },
  ];

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
      rentalDateTo: null,
      rentalDate: null,
      startLease: null,
      expiryLease: null,
      duration: null,
      vendor: {
        id: null,
        vendorName: null,
        officeLocation: null,
        contactPersonList: [],
        attachments: null
      }
    }]
  };

  types: ProductField | null | undefined;
  projectVehicleId: number | undefined | null;

  constructor(
    private projectVehicleService: PrjectVehicleService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
    private vendorService: VendorService,
    private productFieldService: ProductFieldServiceService,

  ) { }

  ngOnInit(): void {
    this.items = [{ label: 'Project Vehicle', routerLink: '/project-vehicle' }, { label: 'Edit Project Vehicle' }];
    this.getAllVendors();
    this.projectVehicleId = +this.route.snapshot.paramMap.get('id')!;
    this.getProjectVehicleById(this.projectVehicleId);
    this.getProjectName()
  }
  projectVehicleField: any = {
    leaseType: null,
    origin: null,
    destinition: null,
  };
  minDueDate: Date | null | undefined;

  getProjectVehicleById(id: number) {
    this.projectVehicleService.getProjectVehicleById(id).subscribe(
      (res: ProjectVehicle) => {
        this.patchProjectVehicle(res)
      }, error => {

      })

  }
  patchProjectVehicle(obj: ProjectVehicle) {
    
    obj.date = new Date
    this.convertInDate(obj)
    this.projectVehicle = obj
    for (let index = 0; index < obj.projectVehicleValuesList.length; index++) {
      this.updateDuration(index)
    }
  }
  addMoreFieldValue() {
    const newFieldValue: ProjectVehicleValues = {
      id: null,
      plateNumber: null,
      leaseCost: null,
      type: null,
      origin: null,
      destination: null,
      rentalDateTo: null,
      rentalDate: null,
      startLease: null,
      expiryLease: null,
      duration: null,
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
    
    this.projectVehicleService.updateProjectVehicle(this.projectVehicleId!, this.projectVehicle).subscribe(
      (res: ProjectVehicle) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Update Successfully',
          detail: 'Project Vehicle has been updated',
        });
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

  onLeaseTypeChange() {
    if (this.projectVehicleField.leaseType !== 'rentalLease') {
      this.projectVehicle.projectVehicleValuesList.forEach(item => {
        item.origin = null;
        item.destination = null;
      });
    }
  }

  private convertInDate(obj: ProjectVehicle) {
    if (typeof obj.date === 'string') {
      obj.date = new Date(obj.date);
    }
    obj.projectVehicleValuesList.forEach((value) => {
      if (typeof value.rentalDate === 'string') {
        value.rentalDate = new Date(value.rentalDate);
      }
      if (typeof value.startLease === 'string') {
        value.startLease = new Date(value.startLease);
      }
      if (typeof value.expiryLease === 'string') {
        value.expiryLease = new Date(value.expiryLease);
      }
    });
  }

  updateDuration(i: number) {
    if (this.projectVehicle.projectVehicleValuesList[i].startLease) {
      this.minDueDate = new Date(this.projectVehicle.projectVehicleValuesList[i].startLease!);
    } else {
      this.minDueDate = null;
    }


    if (this.projectVehicle.projectVehicleValuesList[i].startLease && this.projectVehicle.projectVehicleValuesList[i].expiryLease) {

      const startLeaseTime = this.projectVehicle.projectVehicleValuesList[i].startLease!.getTime();
      const expiryLeaseTime = this.projectVehicle.projectVehicleValuesList[i].expiryLease!.getTime();

      if (expiryLeaseTime < startLeaseTime) {
        this.projectVehicle.projectVehicleValuesList[i].duration = null;
        this.projectVehicle.projectVehicleValuesList[i].startLease = null;
      } else {
        const timeDifference = expiryLeaseTime - startLeaseTime;
        const durationInDays = timeDifference / (1000 * 60 * 60 * 24);
        this.projectVehicle.projectVehicleValuesList[i].duration = durationInDays;
      }
    } else {
      this.projectVehicle.projectVehicleValuesList[i].duration = null;
    }
  }

}
