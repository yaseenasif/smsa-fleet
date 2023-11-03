import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { VehicleService } from '../service/vehicle.service';
import { Vehicle } from 'src/app/modal/vehicle'
import { FileUpload } from 'primeng/fileupload';

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
  
  constructor(
    private vehicleService: VehicleService,
    private messageService: MessageService
    ) { }
  
  vehicles!: Vehicle[];

  size: number = 10240000; // Maximum file size (e.g., 10MB)

  uploadedFiles: any[] = [];

  

  products:any=[{name:"Demo"},
  {name:"Demo"},
  {name:"Demo"},
  {name:"Demo"},
  {name:"Demo"},
  {name:"Demo"},
  {name:"Demo"},
  {name:"Demo"},
  {name:"Demo"},
  {name:"Demo"},];
  items: MenuItem[] | undefined;

 

  ngOnInit() {
      this.items = [{ label: 'Vehicle'}];

      this.getAllVehicles();

  }

  onFileSelect() {
    this.fileSelected = true;
  }

  onCancel() {
    // Handle cancel logic here
    this.fileSelected = false;

    this.fileUpload.clear();

  }

  onUpload(event: any) {
    debugger
    const uploadedFile = event.files[0];

    if (uploadedFile) {
      debugger;
      this.vehicleService.saveFile(uploadedFile).subscribe(
        (response) => {
          debugger
          
   
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
          debugger  
          console.error('Error while saving the file:', error);

          this.messageService.add({ severity: 'error', summary: 'Upload Error', detail: error.error });
          // Handle error
        }
      );
    }
  }

  getAllVehicles() {

    this.vehicleService.getAllVehicles().subscribe((res: Vehicle[]) => {
      
      this.vehicles = res;      
      
    })

  }

  deleteVehicle(id: Number) {

    this.vehicleService.deleteVehicle(id).subscribe((res) => {
      this.getAllVehicles();
      
    })
  }

}
