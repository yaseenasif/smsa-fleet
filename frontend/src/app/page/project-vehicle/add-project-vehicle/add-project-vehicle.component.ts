  import { Component, OnInit } from '@angular/core';
  import { MenuItem, MessageService, SelectItem } from 'primeng/api';
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
    duration:number[]=[];
    projectNames: ProductField | null | undefined;
    types : ProductField | null | undefined;
    replacementCheck: boolean | undefined;

    vehicleTypes: SelectItem[] = [
      { label: 'Rental', value: 'Rental' },
      { label: 'Leased', value: 'Leased' },
    ];
    minDueDate: Date | null | undefined;

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
        rentalDate: null,
        startLease:null,
        expiryLease:null,
        duration:null,
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
    }
    // projectVehicleField: any = {
    //   startLease: null,
    //   expiryLease: null,
    //   duration: null
    // };
    addMoreFieldValue() {
      const newFieldValue: ProjectVehicleValues = {
        id: null,
        plateNumber: null,
        leaseCost: null,
        type: null,
        origin: null,
        destination: null,
        rentalDate: null,
        startLease: null,
        expiryLease: null,
        duration:null,
        vendor: {
          id: null,
          vendorName: null,
          officeLocation: null,
          contactPersonList: [],
          attachments: null
        },
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
    // onLeaseTypeChange() {
    //   if (this.projectVehicleField.leaseType !== 'rentalLease') {
    //     this.projectVehicle.projectVehicleValuesList.forEach(item => {
    //       item.origin = null;
    //       item.destination = null;
    //     });
    //   }
    // }
    updateDuration(i: number) {
      if (this.projectVehicle.projectVehicleValuesList[i].startLease) {
          this.minDueDate = new Date(this.projectVehicle.projectVehicleValuesList[i].startLease!);
      } else {
          this.minDueDate = null;
      }
      debugger;
  
      if (this.projectVehicle.projectVehicleValuesList[i].startLease && this.projectVehicle.projectVehicleValuesList[i].expiryLease) {
          debugger;
          const startLeaseTime = this.projectVehicle.projectVehicleValuesList[i].startLease!.getTime();
          const expiryLeaseTime = this.projectVehicle.projectVehicleValuesList[i].expiryLease!.getTime();
  
          if (expiryLeaseTime < startLeaseTime) {
              this.duration[i] = Number(null); // Convert null to number type
              console.error('Expiry date is before start date.');
          } else {
              const timeDifference = expiryLeaseTime - startLeaseTime;
              const durationInDays = timeDifference / (1000 * 60 * 60 * 24);
  
              this.duration[i] = durationInDays;
              console.log('Duration:', this.duration);
          }
      } else {
          this.duration[i] = 0;
          console.error('Start date or expiry date is undefined.');
      }
  }
  
  }