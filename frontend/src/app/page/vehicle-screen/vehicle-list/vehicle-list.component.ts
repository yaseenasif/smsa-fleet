import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { VehicleService } from '../service/vehicle.service';
import { Vehicle } from 'src/app/modal/vehicle'
import { FileUpload } from 'primeng/fileupload';
import { PaginatedResponse } from 'src/app/modal/paginatedResponse';
import { PageEvent } from 'src/app/modal/pageEvent';
import { ActivatedRoute, Router } from '@angular/router';
import * as saveAs from 'file-saver';
import { Region } from 'src/app/modal/Region';
import { RegionService } from '../../region/service/region.service';
import { EmployeeService } from '../../employee-screen/service/employee.service';
import { Employee } from 'src/app/modal/employee';

@Component({
  selector: 'app-vehicle-list',
  templateUrl: './vehicle-list.component.html',
  styleUrls: ['./vehicle-list.component.scss'],
  providers: [MessageService]
})
export class VehicleListComponent implements OnInit {
  @ViewChild('fileUpload', { static: false })
  fileUpload!: FileUpload;

  fileSelected: boolean = false;

  query: PageEvent = {
    page: 0,
    size: 7,
  };

  value: string | null = null;
  totalRecords: number = 0;

  // vehicleReplacement: VehicleReplacement ={
  //   id:undefined,
  //   reason:undefined,
  //   vehicle:undefined
  // }

  statusVisible!: boolean;
  replacementVisible!: boolean;
  vehicletab: boolean | undefined;
  tempTab: boolean | undefined;
  unAssignedVehicleTab: boolean | undefined;
  lastAssignedEmployee!: Employee;

  constructor(
    private vehicleService: VehicleService,
    private messageService: MessageService,
    private router: Router,
    private regionService: RegionService,
    private route: ActivatedRoute,
    private employeeService: EmployeeService
  ) { }

  vehicles!: Array<Vehicle>;
  vId!: Number
  region !: Region[];
  vehicleStatus: any;
  selectedStatus = { name: 'TBA' };

  size: number = 10240000;

  uploadedFiles: any[] = [];
  fileName: string = 'vehicleSample.xlsx'
  replacementCheck: boolean = false;



  items: MenuItem[] | undefined;
  ngOnInit() {
    this.items = [{ label: 'Vehicle' }];
    this.vehicleStatus = [
      {
        name: 'All'
      },
      {
        name: 'Active'
      },
      {
        name: 'Replacement'
      },
      {
        name: 'Under Maintenance'
      },
      {
        name: 'In-Active'
      },
      {
        name: 'TBA'
      },
    ]
    this.setSelectedStatusAndGetAllVehicles();

    this.route.queryParams.subscribe(params => {
      this.vehicletab = params['vehicletab'] === 'true';
      this.unAssignedVehicleTab = params['unAssignVehicleTab'] === 'true';

    });

  }


  onFileSelect() {
    this.fileSelected = true;
  }

  onCancel() {
    // Handle cancel logic her
    this.fileSelected = false;

    this.fileUpload.clear();

  }

  onUpload(event: any) {
    const uploadedFile = event.files[0];

    if (uploadedFile) {
      this.vehicleService.saveFile(uploadedFile).subscribe(
        (response) => {

          if (Array.isArray(response.message)) {
            response.message.forEach((message: any) => {
              this.messageService.add({ severity: 'success', summary: 'Upload Successful', detail: message });
            });

          } else if (response.message) {
            this.messageService.add({ severity: 'success', summary: 'Upload Successful', detail: response.message });
          } else {
            this.messageService.add({ severity: 'success', summary: 'Upload Successful', detail: 'File uploaded successfully.' });
          }
          this.searchAllVehicles(this.selectedStatus.name);
        },
        (error) => {
          this.messageService.add({ severity: 'error', summary: 'Upload Error', detail: error.error });
        }
      );
    }
  }

  onPageChange(value?: string | null, event?: any) {
    this.query.page = event.page;
    this.query.size = event.rows;
    this.searchAllVehicles(this.selectedStatus.name)
  }


  flag = 'TBA'
  // OnSelectChange() {

  //   if (this.selectedStatus.name != this.flag) {
  //     this.query.page = 0
  //     this.flag = this.selectedStatus.name
  //   }
  //   this.searchAllVehicles(this.selectedStatus.name)
  // }

  OnSelectChange() {
    if (this.selectedStatus.name !== this.flag) {
      this.query.page = 0;
      this.flag = this.selectedStatus.name;
      sessionStorage.setItem('selectedStatus', this.selectedStatus.name);
    }
    this.searchAllVehicles(this.selectedStatus.name);
  }

  closeDialog() {
    this.statusVisible = false;
    this.replacementVisible = false;
  }

  showActivationDialog(id: Number) {
    this.vId = id;
    this.statusVisible = true;
    this.getLastAssignmentByVehicleId(id)
  }

  activateVehicle() {
    this.vehicleService.activateVehicle(this.vId).subscribe((res: Vehicle) => {
      this.messageService.add({ severity: 'success', summary: 'Vehicle Activated' });

      this.closeDialog()
      this.searchAllVehicles(this.selectedStatus.name)
    })
  }

  downloadAttachment(fileName: string) {
    this.vehicleService.downloadAttachments(fileName).subscribe(blob => saveAs(blob, fileName));
  }

  searchAllVehicles(vehiclestatus: string) {
    
    this.vehicleService.searchAllVehicles(this.value, vehiclestatus, this.query).subscribe((res: PaginatedResponse<Vehicle>) => {
      this.vehicles = res.content
      this.query = { page: res.pageable.pageNumber, size: res.size }
      this.totalRecords = res.totalElements;
    })
  }

  replaceVehicle(id: Number) {
    this.replacementCheck = true;
    this.router.navigate(['/add-vehicle/replacementCheck/vId'], {
      queryParams: {
        replacementCheck: this.replacementCheck, vId: id
      }
    });
  }


  deleteReplacementVehicle() {
    this.vehicleService.deleteReplacementVehicle(this.vId).subscribe((res) => {
      this.messageService.add({ severity: 'success', summary: 'Vehicle Deleted' });
      this.closeDialog()
      this.searchAllVehicles(this.selectedStatus.name)

    })
  }

  showReplacementDialog(id: number) {
    this.vId = id;
    this.replacementVisible = true;
  }

  getLastAssignmentByVehicleId(id: Number) {
    this.employeeService.getLastAssignedEmployeeByVehicleId(id).subscribe((res) => {
      this.lastAssignedEmployee = res;
    })
  }

  markVehicleTotalLost() {
    this.vehicleService.markVehicleTotalLost(this.vId).subscribe((res) => {
      this.messageService.add({ severity: 'success', summary: 'Vehicle Marked as total lost' });
      this.closeDialog()
      this.searchAllVehicles(this.selectedStatus.name)

    })
  }

  downloadExcelData() {
    this.vehicleService.downloadExcelData([]).subscribe(blob => saveAs(blob, "Vehicle Data.xlsx"))
  }

  setSelectedStatusAndGetAllVehicles() {
    const status = sessionStorage.getItem('selectedStatus');
    this.selectedStatus.name = status ? status : "TBA";
    this.searchAllVehicles(this.selectedStatus.name);
  }
}
