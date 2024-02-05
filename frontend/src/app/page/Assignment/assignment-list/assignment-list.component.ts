import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { VehicleAssignmentService } from '../vehicle-assignment.service';
import { VehicleAssignment } from 'src/app/modal/vehicle-assignment';
import { PaginatedResponse } from 'src/app/modal/paginatedResponse';
import { VehicleService } from '../../vehicle-screen/service/vehicle.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Vehicle } from 'src/app/modal/vehicle';;
import { ProductField, ProductFieldValue } from 'src/app/modal/ProductField';
import { PageEvent } from 'src/app/modal/pageEvent';
import { ProductFieldServiceService } from '../../product-field/service/product-field-service.service';
import { ErrorService } from 'src/app/CommonServices/Error/error.service';
import { ConcateSearch } from 'src/app/modal/SearchCriteria';

@Component({
  selector: 'app-assignment-list',
  templateUrl: './assignment-list.component.html',
  styleUrls: ['./assignment-list.component.scss']
})
export class AssignmentListComponent {
  items: MenuItem[] | undefined;

  vehicle!: Vehicle;
  vehicleId: Number | undefined;
  vehicleAssignment !: VehicleAssignment[]

  query: PageEvent = {
    page: 0,
    size: 10,
  };

  globalTransformObj: ConcateSearch = {
    assignToEmpId: {
      department: undefined,
      region: undefined,
      section: undefined
    }
  };

  plateNumber: string | null = null;
  employeeNumber: string | null = null;
  departmentNumber: string | null = null;
  sectionNumber: string | null = null;
  regionNumber: string | null = null;
  totalRecords: number = 0;
  visible!: boolean;
  vehicleAssignmentId!: Number;
  replacementCheck: boolean = false;
  searchByNumberList: VehicleAssignment[] = [];
  selectedSearchType: any = "Search Plate Number";
  placeHolder: any = "Search Plate Number"
  searchTerm: string | null = null;
  plateNoSearch: boolean = false;
  empNoSearch: boolean = false;
  someObservable: any;
  regionList: ProductFieldValue[] = [];
  departmentList: ProductFieldValue[] = [];
  sectionList: ProductFieldValue[] = [];
  criteriaSearch: boolean = false;


  constructor(
    private vehicleAssignmentService: VehicleAssignmentService,
    private vehicleService: VehicleService,
    private router: Router,
    private route: ActivatedRoute,
    private productFieldService: ProductFieldServiceService,
    private errorHandleService: ErrorService,
  ) { }

  ngOnInit() {
    this.items = [{ label: 'Vehicle Assignment' }];
    this.getRegionValues("Region");
    this.getDepartmentValues("Department");
    this.getSectionValues("Section");
    this.getAllVehicleAssignmentByPlateNum();
    this.vehicleId = +this.route.snapshot.paramMap.get('id')!;
    if (this.vehicleId) {
      this.getVehicleById(this.vehicleId);
    }
  }

  getAllVehicleAssignment() {
    this.vehicleAssignmentService.searchAssignmentByPlateNumber(this.plateNumber, this.query).subscribe((res: PaginatedResponse<VehicleAssignment>) => {
      this.vehicleAssignment = res.content;
      this.query = { page: res.pageable.pageNumber, size: res.size }
      this.totalRecords = res.totalElements;
    }, error => {
      this.errorHandleService.showError(error.error);
    })
  }

  deleteVehicleAssignment(id: Number) {
    this.vehicleAssignmentService.deleteVehicleAssignment(id).subscribe((res) => {
      this.vehicleAssignment = res;
      this.errorHandleService.showError("Assignment has been deleted");
      this.getAllVehicleAssignment();
      this.closeDialog();
    }, error => {
      this.errorHandleService.showError(error.error);
    });
  }

  onPageChange(event?: any) {
    this.query.page = event.page;
    this.query.size = event.rows;
    this.getAllVehicleAssignment();
  }

  showDialog(id: Number) {
    this.vehicleAssignmentId = id;
    this.visible = true;
  }

  closeDialog() {
    this.visible = false;
  }

  getAllVehicleAssignmentByEmployeeNum(searchTerm?: string) {
    this.empNoSearch = searchTerm ? true : false;
    this.vehicleAssignmentService.searchAssignmentByEmployeeNumber(searchTerm, this.query)
      .subscribe((res: PaginatedResponse<VehicleAssignment>) => {
        this.vehicleAssignment = res.content;
        this.query = { page: res.pageable.pageNumber, size: res.size };
        this.totalRecords = res.totalElements;
      }, error => {
        this.errorHandleService.showError(error.error);
      });
  }

  getAllVehicleAssignmentByPlateNum(searchTerm?: string) {
    this.plateNoSearch = searchTerm ? true : false;
    this.vehicleAssignmentService.searchAssignmentByPlateNumber(searchTerm, this.query)
      .subscribe((res: PaginatedResponse<VehicleAssignment>) => {
        this.vehicleAssignment = res.content;
        this.searchByNumberList = res.content;
        this.query = { page: res.pageable.pageNumber, size: res.size };
        this.totalRecords = res.totalElements;
      }, error => {
        this.errorHandleService.showError(error.error);
      });
  }

  replaceVehicle(id: Number) {
    this.replacementCheck = true;
    this.router.navigate(['/add-vehicle/replacementCheck/vId'], {
      queryParams: {
        replacementCheck: this.replacementCheck, vId: id
      }
    });
  }

  getVehicleById(id: Number) {
    this.vehicleService.getVehicleById(id).subscribe((res: Vehicle) => {
      this.vehicle = res;
    })
  }

  private getRegionValues(productName: string) {
    this.productFieldService.getProductFieldByName(productName).subscribe(
      (res: ProductField) => {
        this.regionList = res.productFieldValuesList.map((productFieldValue: ProductFieldValue) => ({
          name: productFieldValue.name,
          region: productFieldValue.name,
          id: productFieldValue.id,
          status: productFieldValue.status,
        }));
      },
      (error) => {
        this.errorHandleService.showError(error.error);
      }
    );
  }

  private getSectionValues(productName: string) {
    this.productFieldService.getProductFieldByName(productName).subscribe(
      (res: ProductField) => {
        this.sectionList = res.productFieldValuesList.map((productFieldValue: ProductFieldValue) => ({
          name: productFieldValue.name,
          section: productFieldValue.name,
          id: productFieldValue.id,
          status: productFieldValue.status,
        }));

      }, error => {
        this.errorHandleService.showError(error.error);
      }
    )
  }

  private getDepartmentValues(productName: string) {
    this.productFieldService.getProductFieldByName(productName).subscribe(
      (res: ProductField) => {
        this.departmentList = res.productFieldValuesList.map((productFieldValue: ProductFieldValue) => ({
          name: productFieldValue.name,
          department: productFieldValue.name,
          id: productFieldValue.id,
          status: productFieldValue.status,
        }));

      }, error => {
        this.errorHandleService.showError(error.error);
      }
    )
  }

  clear() {
    window.location.reload();
  }

  getSearchAssignmentByAnyValue(searchTerm: string) {
    this.criteriaSearch = true;
    const transformSearch = (search: string, field: any) => {
      return search?.hasOwnProperty(field) ? { [field]: search[field] } : null;
    };

    const transformObj: any = {
      ...transformSearch(searchTerm, 'region'),
      ...transformSearch(searchTerm, 'department'),
      ...transformSearch(searchTerm, 'section'),
    };

    if (searchTerm) {
      this.globalTransformObj.assignToEmpId = { ...this.globalTransformObj.assignToEmpId, ...transformObj };
    }
  }

  searchCriteria() {

    this.vehicleAssignmentService.searchAssignmentByAnyValue(this.query, this.globalTransformObj)
      .subscribe((res: PaginatedResponse<VehicleAssignment>) => {
        debugger
        this.vehicleAssignment = res.content;
        this.query = { page: res.pageable.pageNumber, size: res.size };
        this.totalRecords = res.totalElements;

      }, error => {
        this.errorHandleService.showError(error.error);
      });

  }

}

// Previous Code


// getSearchAssignmentByRegion() {
//   this.vehicleAssignmentService.searchAssignmentByRegion(this.searchTerm, 'Active', this.query)
//     .subscribe((res: PaginatedResponse<VehicleAssignment>) => {
//       this.vehicleAssignment = res.content;
//       this.query = { page: res.pageable.pageNumber, size: res.size };
//       this.totalRecords = res.totalElements;
//     });
// }
// getSearchAssignmentByDepartment() {
//   this.vehicleAssignmentService.searchAssignmentByDepartment(this.searchTerm, 'Active', this.query)
//     .subscribe((res: PaginatedResponse<VehicleAssignment>) => {
//       this.vehicleAssignment = res.content;
//       this.query = { page: res.pageable.pageNumber, size: res.size };
//       this.totalRecords = res.totalElements;
//     });
// }
// getSearchAssignmentBySection() {
//   this.vehicleAssignmentService.searchAssignmentBySection(this.searchTerm, 'Active', this.query)
//     .subscribe((res: PaginatedResponse<VehicleAssignment>) => {
//       this.vehicleAssignment = res.content;
//       this.query = { page: res.pageable.pageNumber, size: res.size };
//       this.totalRecords = res.totalElements;
//     });
// }


// onSearchTypeChange(event: { originalEvent: Event, value: SelectItem }) {
//   this.placeHolder = event.value.value;
//   this.selectedSearchType = event.value.value;
// }

// search() {
//   if (this.searchTerm) {
//     switch (this.selectedSearchType) {
//       case 'Search Employee Number':
//         this.getAllVehicleAssignmentByEmployeeNum();
//         break;
//       case 'Search Plate Number':
//         this.getAllVehicleAssignmentByPlateNum();
//         break;
//       case 'Search Region':
//         this.getSearchAssignmentByRegion();
//         break;
//       case 'Search Department':
//         this.getSearchAssignmentByDepartment();
//         break;
//       case 'Search Section':
//         this.getSearchAssignmentBySection();
//         break;
//       default:
//         break;
//     }
//   } else {
//     this.getAllVehicleAssignment();
//   }
// }
