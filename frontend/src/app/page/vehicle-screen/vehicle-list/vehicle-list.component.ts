import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { VehicleService } from '../service/vehicle.service';
import { Vehicle } from 'src/app/modal/vehicle'
import { FileUpload } from 'primeng/fileupload';
import { VehicleReplacement } from 'src/app/modal/vehicleReplacement';
import { PaginatedResponse } from 'src/app/modal/paginatedResponse';
import { PageEvent } from 'src/app/modal/pageEvent';
import { Router } from '@angular/router';
import * as saveAs from 'file-saver';

@Component({
  selector: 'app-vehicle-list',
  templateUrl: './vehicle-list.component.html',
  styleUrls: ['./vehicle-list.component.scss'],
  providers: [MessageService]
})
export class VehicleListComponent implements OnInit{
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
    vehicle: null
  }

  statusVisible!: boolean;

  constructor(
    private vehicleService: VehicleService,
    private messageService: MessageService,
    private router: Router
    ) { }

  vehicles!: Array<Vehicle>;
  replacementVehicles!: Array<Vehicle>;
  vId!: number

  vehicleStatus : any;
  selectedStatus = {name:'Active'};

  size: number = 10240000; // Maximum file size (e.g., 10MB)

  uploadedFiles: any[] = [];
  fileName : string = 'vehicleSample.xlsx'




  items: MenuItem[] | undefined;
  ngOnInit() {
      this.items = [{ label: 'Vehicle'}];
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

  showDialog(vId:number, event: Event) {
    event.stopPropagation();
    this.vId=vId;
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
    this.vehicleService.searchVehicle(this.value, this.query).subscribe((res: PaginatedResponse<Vehicle>) => {
      this.vehicles = res.content;
      this.query = { page: res.pageable.pageNumber, size: res.size }
      this.totalRecords = res.totalElements;
    })

  }

  getAllInactiveVehicles(){
    this.vehicleService.searchInactiveVehicle(this.value, this.query).subscribe((res: PaginatedResponse<Vehicle>) => {
      this.vehicles = res.content;
      this.query = { page: res.pageable.pageNumber, size: res.size }
      this.totalRecords = res.totalElements;
    })

  }

  // deleteVehicle(id: Number, event: Event) {
  //   event.stopPropagation();

  //   this.vehicleService.inactiveVehicleById(id).subscribe((res) => {
  //     this.getAllVehicles();

  //   })
  // }

  onSubmit(){
    this.vehicleService.replaceVehicle(this.vId,this.vehicleReplacement).subscribe(res=>{
      this.messageService.add({ severity: 'success', summary: 'Vehicle Replaced', detail: 'Vehicle is successfully replaced'});
      this.getAllVehicles();
    },error=>{
      this.messageService.add({ severity: 'error', summary: 'Upload Error', detail: error.error });
    })
  }

  onPageChange(value?: string | null, event?: any) {
    this.query.page = event.page;
    this.query.size = event.rows;
    if(this.selectedStatus.name == 'Active'){
      this.getAllVehicles()
      }else{
        this.getAllInactiveVehicles()
      }
  }


  flag='Active'
  OnSelectChange(){
    if(this.selectedStatus.name!=this.flag){
     this.query.page=0
     this.flag=this.selectedStatus.name
    }

    if(this.selectedStatus.name == 'Active'){
      this.getAllVehicles()
      }else{
        this.getAllInactiveVehicles()
      }
  }

  availableForReplacement(){
    this.vehicleService.availableForReplacement().subscribe((res:Vehicle[])=>{
      this.replacementVehicles=res;
    },(error)=>{})
  }

  closeDialog() {
    this.statusVisible = false;
  }

  showStatusDialog(id: number) {
    this.vId = id;
    this.statusVisible = true;
    console.log(this.vId);

}

 activateVehicle(){
  this.vehicleService.activateVehicle(this.vId).subscribe((res:Vehicle)=>{
    this.messageService.add({ severity: 'success', summary: 'Vehicle Activated'});
//
//     setTimeout(() => {
//
//       this.router.navigate(['/vehicle'])
//     },1000)
    this.closeDialog()
    this.getAllInactiveVehicles()
  })
 }

// downloadExcel(): void {
//   this.vehicleService.exportToExcel(this.data, 'user_data', 'Sheet1');
// }
downloadAttachment(fileName:string){
  this.vehicleService.downloadAttachments(fileName).subscribe(blob => saveAs(blob,fileName));
}
}
