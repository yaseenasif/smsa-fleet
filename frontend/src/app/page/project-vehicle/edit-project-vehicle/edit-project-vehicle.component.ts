import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService, SelectItem } from 'primeng/api';
import { ProjectVehicle, ProjectVehicleValues } from 'src/app/modal/project-vehicle';
import { PrjectVehicleService } from '../service/prject-vehicle.service';
import { Vendor } from 'src/app/modal/vendor';
import { ActivatedRoute, Router } from '@angular/router';
import { VendorService } from '../../vendor-screen/service/vendor.service';
import { ProductFieldServiceService } from '../../product-field/service/product-field-service.service';
import { ProductField } from 'src/app/modal/ProductField';
import { DashboardRedirectServiceService } from 'src/app/CommonServices/dashboard-redirect-service.service';
import { BackenCommonErrorThrow } from 'src/app/modal/BackendCommonErrorThrow';
import { ErrorService } from 'src/app/CommonServices/Error/error.service';

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
      costCenter: null,
      vendor: {
        id: null,
        vendorName: null,
        officeLocation: null,
        contactPersonList: [],
        attachments: null
      },
      month: null,
      vehicleType: undefined,
      referenceNo: undefined
    }]
  };

  types: ProductField | null | undefined;
  projectVehicleId: number | undefined | null;
  tabIndex: number = 0;
  vehicleTypeList: ProductField | undefined | null;


  constructor(
    private dashboardRedirectService: DashboardRedirectServiceService,
    private productFieldService: ProductFieldServiceService,
    private projectVehicleService: PrjectVehicleService,
    private errorHandleService: ErrorService,
    private messageService: MessageService,
    private vendorService: VendorService,
    private route: ActivatedRoute,
    private router: Router,

  ) { }

  ngOnInit(): void {
    this.items = [{ label: 'Project Vehicle', routerLink: '/project-vehicle' }, { label: 'Edit Project Vehicle' }];
    this.getAllVendors();
    this.projectVehicleId = +this.route.snapshot.paramMap.get('id')!;
    this.getProjectVehicleById(this.projectVehicleId);
    this.getProjectName()
    this.getTypeList('Vehicle Type');
    this.dashboardRedirectService.setDashboardValue('ProjectVehicle');
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
    this.destructureResponse(obj);
    for (let index = 0; index < obj.projectVehicleValuesList.length; index++) {
      this.updateDuration(index, obj.projectVehicleValuesList[index].month!)
    }
  }

  addMoreFieldValue(event: Event, month: string) {
    event.stopPropagation();

    // Create a new instance of ProjectVehicleValues
    const newFieldValue: ProjectVehicleValues = {
      id: null,
      dateForMonth: new Date(),
      month: month,
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
      costCenter: null,
      vendor: {
        id: null,
        vendorName: null,
        officeLocation: null,
        contactPersonList: [],
        attachments: null
      },
      vehicleType: undefined,
      referenceNo: undefined
    };

    // Find the month in monthWiseList and push the new field value
    const monthData = this.projectVehicle.monthWiseList?.find(data => data.month === month);
    if (monthData) {
      monthData.values.push(newFieldValue);
    } else {
      // If the month doesn't exist, create a new entry for it
      this.projectVehicle.monthWiseList?.push({ month: month, values: [newFieldValue] });
    }
  }


  removeFieldValue(index: number, month: string) {
    this.projectVehicle.monthWiseList?.find(data => data.month === month)?.values.splice(index, 1);
  }

  getAllVendors() {
    this.vendorService.getVendor().subscribe((res: Vendor[]) => {
      console.log(res);
      this.vendors = res;
    });
  }

  onSubmit() {
    
    this.projectVehicle.projectVehicleValuesList = [];
    this.projectVehicle.monthWiseList?.forEach(data => {
      this.projectVehicle.projectVehicleValuesList = this.projectVehicle.projectVehicleValuesList.concat(data.values);
    });
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

  updateDuration(i: number, month: string) {
    if (this.projectVehicle.monthWiseList) {
      this.projectVehicle.projectVehicleValuesList = this.projectVehicle.monthWiseList
        .filter(data => data.month === month)
        .map(data => data.values)
        .flat();
    }
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

  destructureResponse(projectVehicle: ProjectVehicle) {
    this.projectVehicle = projectVehicle
    const { projectVehicleValuesList } = projectVehicle;

    // Extracting unique month names and filtering out null or undefined values
    const monthList = [...new Set(projectVehicleValuesList
      .map(item => item.month)
      .filter(month => typeof month === 'string')
    )];

    // Get current month
    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleString('en-us', { month: 'long' });

    // Add current month to monthList if it doesn't already exist
    if (!monthList.includes(currentMonth)) {
      monthList.push(currentMonth);
    }

    // Sort the monthList in chronological order
    monthList.sort((a, b) => {
      const monthA = new Date(Date.parse("01 " + a + " 2000"));
      const monthB = new Date(Date.parse("01 " + b + " 2000"));
      return monthA.getTime() - monthB.getTime();
    });

    // Initialize an array to hold month-wise data
    const monthWiseList: { month: string; values: ProjectVehicleValues[] }[] = [];

    // Group projectVehicleValues by month
    for (const month of monthList) {
      if (month) {
        const values = projectVehicleValuesList.filter(item => item.month === month);
        monthWiseList.push({ month, values });
      }
    }

    // Assign monthWiseList to projectVehicle
    this.projectVehicle.monthWiseList = monthWiseList;

    console.log(projectVehicle);
  }

  private getTypeList(fieldName: string): void {
    this.productFieldService.getProductFieldByName(fieldName).subscribe(
      (res: ProductField) => {
        this.vehicleTypeList = res;

      }, (err: BackenCommonErrorThrow) => {
        this.errorHandleService.showError(err.error!);
      });
  }

}
