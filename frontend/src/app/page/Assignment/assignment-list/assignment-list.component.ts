import { Component } from '@angular/core';
import { MenuItem, MessageService, SelectItem } from 'primeng/api';
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
import { ConcateSearch, SearchItems } from 'src/app/modal/SearchCriteria';
import { RegionService } from '../../region/service/region.service';
import { Region } from 'src/app/modal/Region';
import * as saveAs from 'file-saver';
import { FileUpload } from 'primeng/fileupload';

@Component({
  selector: 'app-assignment-list',
  templateUrl: './assignment-list.component.html',
  styleUrls: ['./assignment-list.component.scss']
})
export class AssignmentListComponent {
  items: MenuItem[] | undefined;
  fileName: string = 'assignmentSample.xlsx'

  fileUpload!: FileUpload;

  fileSelected: boolean = false;

  vehicle!: Vehicle;
  vehicleId: Number | undefined;
  vehicleAssignment !: VehicleAssignment[]

  query: PageEvent = {
    page: 0,
    size: 7,
  };

  globalTransformObj: ConcateSearch = {
    assignToEmpId: {
      department: undefined,
      region: undefined,
      section: undefined
    }
  };

  plateNumber: string | null | undefined;
  employeeNumber: number | null | undefined;
  departmentNumber: string | null = null;
  sectionNumber: string | null = null;
  regionNumber: string | null = null;
  totalRecords: number = 0;
  visible!: boolean;
  vehicleAssignmentId!: Number;
  replacementCheck: boolean = false;
  selectedSearchType: any = "Search Plate Number";
  placeHolder: any = "Search Plate Number"
  searchTerm: string | null = null;
  plateNoSearch: boolean = false;
  empNoSearch: boolean = false;
  vehicleAssignmentType: boolean = false;
  someObservable: any;
  regionList: Region[] = [];
  departmentList: ProductFieldValue[] = [];
  sectionList: ProductFieldValue[] = [];
  criteriaSearch: boolean = false;
  vehicleAssignmentTypes: SelectItem[] = [
    { label: "Replacement", value: "Replacement" },
    { label: "Orignal", value: "Active" },
  ];
  slectedAssignmentType: String | undefined | null;

  constructor(
    private vehicleAssignmentService: VehicleAssignmentService,
    private productFieldService: ProductFieldServiceService,
    private errorHandleService: ErrorService,
    private vehicleService: VehicleService,
    private regionService: RegionService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
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
    if (searchTerm) {
      this.vehicleAssignmentService.searchAssignmentByEmployeeNumber(searchTerm, this.query)
        .subscribe((res: PaginatedResponse<VehicleAssignment>) => {
          this.vehicleAssignment = res.content;
          this.plateNumber = res.content[0].vehicle.plateNumber;
          this.slectedAssignmentType = res.content[0].vehicle.vehicleStatus;
          
          this.globalTransformObj.assignToEmpId = {
            department: res.content[0].assignToEmpId?.department?.toUpperCase(),
            region: res.content[0].assignToEmpId?.region?.toUpperCase(),
            section: res.content[0].assignToEmpId?.section?.toUpperCase()
          };
          this.query = { page: res.pageable.pageNumber, size: res.size };
          this.totalRecords = res.totalElements;
        }, error => {
          this.errorHandleService.showError(error.error);
        });
    } else {
      this.slectedAssignmentType = undefined;
      this.plateNumber = undefined;
      this.globalTransformObj.assignToEmpId = {
        department: undefined,
        region: undefined,
        section: undefined
      };
    }
  }

  getAllVehicleAssignmentByPlateNum(searchTerm?: string) {
    this.plateNoSearch = searchTerm ? true : false;
    this.vehicleAssignmentService.searchAssignmentByPlateNumber(searchTerm, this.query)
      .subscribe((res: PaginatedResponse<VehicleAssignment>) => {
        this.vehicleAssignment = res.content;
        if (searchTerm) {
          this.employeeNumber = res.content[0].assignToEmpId.employeeNumber;
          this.slectedAssignmentType = res.content[0].vehicle.vehicleStatus;
          
          this.globalTransformObj.assignToEmpId = {
            department: res.content[0].assignToEmpId?.department?.toUpperCase(),
            region: res.content[0].assignToEmpId?.region?.toUpperCase(),
            section: res.content[0].assignToEmpId?.section?.toUpperCase()
          };
        } else {
          this.employeeNumber = undefined;
          this.slectedAssignmentType = undefined;
          this.globalTransformObj.assignToEmpId = {
            department: undefined,
            region: undefined,
            section: undefined
          };
        }
        
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
        replacementCheck: this.replacementCheck,
        vId: id,
        screenType:'assignment'
      }
    });
  }

  getVehicleById(id: Number) {
    this.vehicleService.getVehicleById(id).subscribe((res: Vehicle) => {
      this.vehicle = res;
    })
  }

  private getRegionValues(productName: string) {
    this.regionService.getRegion().subscribe(
      (res: Region[]) => {
        this.regionList = res.map((obj: Region) => ({
          id: obj.id,
          name: obj.name,
          region: obj.name?.toUpperCase(),
          country: obj.country,
          cities: obj.cities,
          status: obj.status
        }));;
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

  getSearchAssignmentByAnyValue(searchTerm: SearchItems) {
    
    this.criteriaSearch = true;
    const transformSearch = (search: SearchItems, field: keyof SearchItems) => {
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
        this.vehicleAssignment = res.content;
        
        this.query = { page: res.pageable.pageNumber, size: res.size };
        this.totalRecords = res.totalElements;
      }, error => {
        this.errorHandleService.showError(error.error);
      });
  }


  takeAction(vId: Number) {
    this.router.navigate(['/replacement-action/id'], {
      queryParams: {
        id: vId
      }
    })
  }

  navigateToViewVehicle(id: Number) {
    this.router.navigate(['/view-vehicle/assignmentCheck/id'], {
      queryParams: {
        assignmentCheck: 'true', id: id
      }
    });
  }

  clearFields() {
    this.criteriaSearch = false;
  }

  searchByAssignmentType(searchTerm: string) {
    this.vehicleAssignmentType = searchTerm ? true : false;
    this.vehicleAssignmentService.searchAssignmentByPlateNumber(searchTerm, this.query)
      .subscribe((res: PaginatedResponse<VehicleAssignment>) => {
        
        this.vehicleAssignment = res.content;
        this.query = { page: res.pageable.pageNumber, size: res.size };
        this.totalRecords = res.totalElements;
      }, err => {
        this.errorHandleService.showError(err.error)
      });
  }

  downloadExcelData() {
    this.vehicleAssignmentService.downloadExcelData().subscribe(blob => saveAs(blob, "Assignment Data.xlsx"))
  }
  
  onFileSelect() {
    this.fileSelected = true;
  }

  Cancel() {
    this.fileSelected = false;
    this.fileUpload.clear();
  }


  onUpload(event: any) {
    const uploadedFile = event.files[0];

    if (uploadedFile) {
      this.vehicleAssignmentService.uploadBulkAssignment(uploadedFile).subscribe(
        (response) => {

          if (Array.isArray(response.message)) {

            response.message.forEach((message: any) => {
              this.messageService.add({ severity: 'success', summary: 'Upload Successful', detail: message });
            });

          } else if (response.message) {
            // If response.message is a single message, display it
            this.messageService.add({ severity: 'success', summary: 'Upload Successful', detail: response.message });
          } else {
            // Display a generic success message if no message is provided
            this.messageService.add({ severity: 'success', summary: 'Upload Successful', detail: 'File uploaded successfully.' });
          }

          this.getAllVehicleAssignmentByPlateNum();
        
        },
        (error) => {
          console.error('Error while saving the file:', error);

          this.messageService.add({ severity: 'error', summary: 'Upload Error', detail: error.error });
          // Handle error
        }
      );
    }
  }
  
  downloadAttachment(fileName:string){
    this.vehicleService.downloadAttachments(fileName).subscribe(blob => saveAs(blob, fileName));
  }
}
