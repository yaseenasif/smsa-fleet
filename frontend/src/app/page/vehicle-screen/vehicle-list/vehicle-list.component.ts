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
import { Region } from 'src/app/modal/Region';
import { RegionService } from '../../region/service/region.service';

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
  // visible: boolean = false;

  query !: {
    page: number,
    size: number
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

  constructor(
    private vehicleService: VehicleService,
    private messageService: MessageService,
    private router: Router,
    private regionService: RegionService,
    ) { }

  vehicles!: Array<Vehicle>;
  vId!: number
  region !: Region[];
  vehicleStatus : any;
  selectedStatus = {name:'TBA'};

  size: number = 10240000;

  uploadedFiles: any[] = [];
  fileName : string = 'vehicleSample.xlsx'
  replacementCheck: boolean = false;



  items: MenuItem[] | undefined;
  ngOnInit() {
      this.items = [{ label: 'Vehicle'}];
      this.vehicleStatus = [
        {
          name: 'TBA'
        },
        {
          name: 'Active'
        },
        {
          name: 'In-Active'
        },
        {
          name: 'Under Maintenance'
        },
        {
          name: 'Replacement'
        }
      ]
      this.searchAllVehicles('TBA');
  }

  onFileSelect() {
    this.fileSelected = true;
  }

  // showDialog(vId:number, event: Event) {
  //   event.stopPropagation();
  //   this.vId=vId;
  //   this.availableForReplacement(this.vId);

  //   this.visible = true;
  // }

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

          this.searchAllVehicles(this.selectedStatus.name);
        },
        (error) => {
          console.error('Error while saving the file:', error);

          this.messageService.add({ severity: 'error', summary: 'Upload Error', detail: error.error });
          // Handle error
        }
      );
    }
  }

  // getAllVehicles() {
  //   this.vehicleService.searchVehicle(this.value, this.query).subscribe((res: PaginatedResponse<Vehicle>) => {
  //     this.vehicles = res.content;
  //     this.query = { page: res.pageable.pageNumber, size: res.size }
  //     this.totalRecords = res.totalElements;
  //   })

  // }

  // getAllInactiveVehicles(){
  //   this.vehicleService.searchInactiveVehicle(this.value, this.query).subscribe((res: PaginatedResponse<Vehicle>) => {
  //     this.vehicles = res.content;
  //     this.query = { page: res.pageable.pageNumber, size: res.size }
  //     this.totalRecords = res.totalElements;
  //   })

  // }

  onPageChange(value?: string | null, event?: any) {
    this.query.page = event.page;
    this.query.size = event.rows;
    this.searchAllVehicles(this.selectedStatus.name)
  }


  flag='TBA'
  OnSelectChange(){
    if(this.selectedStatus.name!=this.flag){
     this.query.page=0
     this.flag=this.selectedStatus.name
    }
  this.searchAllVehicles(this.selectedStatus.name)
  }

  closeDialog() {
    this.statusVisible = false;
    this.replacementVisible = false;
  }

  showStatusDialog(id: number) {
    this.vId = id;
    this.statusVisible = true;
    console.log(this.vId);

}

 activateVehicle(){
  this.vehicleService.activateVehicle(this.vId).subscribe((res:Vehicle)=>{
    this.messageService.add({ severity: 'success', summary: 'Vehicle Activated'});

    this.closeDialog()
    this.searchAllVehicles(this.selectedStatus.name)
  })
 }

downloadAttachment(fileName:string){
  this.vehicleService.downloadAttachments(fileName).subscribe(blob => saveAs(blob,fileName));
}

searchAllVehicles(vehiclestatus: string){
  this.vehicleService.searchAllVehicles(this.value,vehiclestatus, this.query).subscribe((res: PaginatedResponse<Vehicle>)=>{
    this.vehicles = res.content
    this.query = { page: res.pageable.pageNumber, size: res.size }
    this.totalRecords = res.totalElements;
  })
}

 replaceVehicle(id: Number){
   this.replacementCheck = true;
  this.router.navigate(['/add-vehicle/replacementCheck/vId'], { queryParams: {
    replacementCheck: this.replacementCheck, vId: id} });
 }


 deleteReplacementVehicle(){
   this.vehicleService.deleteReplacementVehicle(this.vId).subscribe((res)=>{
    this.messageService.add({ severity: 'success', summary: 'Vehicle Deleted'});
    this.closeDialog()
    this.searchAllVehicles(this.selectedStatus.name)

   })
 }

 showReplacementDialog(id: number){
   this.vId = id;
   this.replacementVisible = true;
 }
}
