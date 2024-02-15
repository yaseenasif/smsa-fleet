import { Component, ViewChild } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import { Vehicle } from 'src/app/modal/vehicle';
import { VehicleReplacement } from 'src/app/modal/vehicleReplacement';
import { VehicleService } from '../service/vehicle.service';
import { Router } from '@angular/router';
import { PaginatedResponse } from 'src/app/modal/paginatedResponse';

@Component({
  selector: 'app-un-assigned-vehicles',
  templateUrl: './un-assigned-vehicles.component.html',
  styleUrls: ['./un-assigned-vehicles.component.scss']
})
export class UnAssignedVehiclesComponent {
  @ViewChild('fileUpload', { static: false })
  fileUpload!: FileUpload;
  fileSelected: boolean = false;
  visible: boolean = false;
  query !: {
    page: number,
    size: number
  };
  value: string | null = null;
  totalRecords: number = 0;
  vehicleReplacement: VehicleReplacement = {
    id: null,
    reason: null,
    remarks: null,
    vehicle: null
  }
  statusVisible!: boolean;
  vehicles!: Array<Vehicle>;
  replacementVehicles!: Array<Vehicle>;
  vId!: number
  vehicleStatus: any;
  selectedStatus = { name: 'Active' };
  size: number = 10240000;
  uploadedFiles: any[] = [];
  items: MenuItem[] | undefined;

  constructor(
    private vehicleService: VehicleService,
    private messageService: MessageService,
    private router: Router
    ) { }

  ngOnInit() {
    this.items = [{ label: 'Vehicle' }];
    this.vehicleStatus = [
      {
        name: 'Active'
      },
      {
        name: 'Inactive'
      }
    ]
    this.getAllVehicles();

  }

  onFileSelect() {
    this.fileSelected = true;
  }

  showDialog(vId: number, event: Event) {
    event.stopPropagation();
    this.vId = vId;
    this.availableForReplacement();

    this.visible = true;
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
            // If response.message is a single message, display it
            this.messageService.add({ severity: 'success', summary: 'Upload Successful', detail: response.message });
          } else {
            // Display a generic success message if no message is provided
            this.messageService.add({ severity: 'success', summary: 'Upload Successful', detail: 'File uploaded successfully.' });
          }

          this.getAllVehicles();
        },
        (error) => {
          console.error('Error while saving the file:', error);

          this.messageService.add({ severity: 'error', summary: 'Upload Error', detail: error.error });
          // Handle error
        }
      );
    }
  }

  getAllVehicles() {
    debugger
    this.vehicleService.searchUnAssignedVehicles(this.value, this.query).subscribe((res: PaginatedResponse<Vehicle>) => {
      debugger
      this.vehicles = res.content;
      this.query = { page: res.pageable.pageNumber, size: res.size }
      this.totalRecords = res.totalElements;
    })

  }

  getAllInactiveVehicles() {
    this.vehicleService.searchInactiveVehicle(this.value, this.query).subscribe((res: PaginatedResponse<Vehicle>) => {
      this.vehicles = res.content;
      this.query = { page: res.pageable.pageNumber, size: res.size }
      this.totalRecords = res.totalElements;
    })

  }

  onPageChange(value?: string | null, event?: any) {
    this.query.page = event.page;
    this.query.size = event.rows;
    if (this.selectedStatus.name == 'Active') {
      this.getAllVehicles()
    } else {
      this.getAllInactiveVehicles()
    }
  }


  flag = 'Active'
  OnSelectChange() {
    if (this.selectedStatus.name != this.flag) {
      this.query.page = 0
      this.flag = this.selectedStatus.name
    }

    if (this.selectedStatus.name == 'Active') {
      this.getAllVehicles()
    } else {
      this.getAllInactiveVehicles()
    }
  }

  availableForReplacement() {
    this.vehicleService.availableForReplacement().subscribe((res: Vehicle[]) => {
      this.replacementVehicles = res;
    }, (error) => { })
  }

  closeDialog() {
    this.statusVisible = false;
  }

  showStatusDialog(id: number) {
    this.vId = id;
    this.statusVisible = true;
    console.log(this.vId);

  }

  activateVehicle() {
    this.vehicleService.activateVehicle(this.vId).subscribe((res: Vehicle) => {
      this.messageService.add({ severity: 'success', summary: 'Vehicle Activated' });
      //     
      //     setTimeout(() => {
      // 
      //       this.router.navigate(['/vehicle'])
      //     },1000)
      this.closeDialog()
      this.getAllInactiveVehicles()
    })
  }
}
