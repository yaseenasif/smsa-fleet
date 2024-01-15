import { Component } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { VehicleAssignmentService } from '../vehicle-assignment.service';
import { VehicleAssignment } from 'src/app/modal/vehicle-assignment';
import { PaginatedResponse } from 'src/app/modal/paginatedResponse';
import { VehicleService } from '../../vehicle-screen/service/vehicle.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-assignment-list',
  templateUrl: './assignment-list.component.html',
  styleUrls: ['./assignment-list.component.scss'],
  providers: [MessageService]
})
export class AssignmentListComponent {
  
  vehicleAssignment !: VehicleAssignment[]

  query !: {
    page: number,
    size: number
  };

  // vehicleReplacement: VehicleReplacement = {
  //   id: null,
  //   reason: null,
  //   vehicle: null
  // }

  plateNumber: string | null = null;
  employeeNumber: string | null = null;
  totalRecords: number = 0;
  visible!: boolean;
  // visibleReplacement!: boolean;
  vehicleAssignmentId!: Number;
  // replacementVehicles!: Array<Vehicle>;
  // vId!: number;
  replacementCheck: boolean = false;

  constructor(private vehicleAssignmentService: VehicleAssignmentService,
    private messageService: MessageService,private vehicleService:VehicleService,
    private router: Router) { }
  

  // products:any=[{name:"Demo",contactNumber:"Demo",referenceNumber:"Demo"},
  // {name:"Demo",contactNumber:"Demo",referenceNumber:"Demo"},
  // {name:"Demo",contactNumber:"Demo",referenceNumber:"Demo"},
  // {name:"Demo",contactNumber:"Demo",referenceNumber:"Demo"},
  // {name:"Demo",contactNumber:"Demo",referenceNumber:"Demo"},
  // {name:"Demo",contactNumber:"Demo",referenceNumber:"Demo"},
  // {name:"Demo",contactNumber:"Demo",referenceNumber:"Demo"},
  // {name:"Demo",contactNumber:"Demo",referenceNumber:"Demo"},
  // {name:"Demo",contactNumber:"Demo",referenceNumber:"Demo"},
  // {name:"Demo",contactNumber:"Demo",referenceNumber:"Demo"},];
  items: MenuItem[] | undefined;

 

  ngOnInit() {
      this.items = [{ label: 'Vehicle Assignment'}];
    
      this.getAllVehicleAssignment();
    }

    turner=true;
  getAllVehicleAssignment() {
    
    
    this.vehicleAssignmentService.searchAssignmentByPlateNumber(this.plateNumber, this.query).subscribe((res: PaginatedResponse<VehicleAssignment>) => {
      this.vehicleAssignment = res.content;
      this.query = { page: res.pageable.pageNumber, size: res.size }
      this.totalRecords = res.totalElements;
    })
     

  }

  deleteVehicleAssignment(id: Number) {
    this.vehicleAssignmentService.deleteVehicleAssignment(id).subscribe((res) => {
      this.vehicleAssignment=res;
      this.messageService.add({ severity: 'error', summary: 'Delete Successfully', detail: 'Assignment has been deleted' });  

      this.getAllVehicleAssignment();
      this.closeDialog();
    })
  
}
  onPageChange(event?: any) {
    this.query.page = event.page;
    this.query.size = event.rows;
    this.getAllVehicleAssignment()
  }
  showDialog(id: Number) {
    this.vehicleAssignmentId = id;
    this.visible = true;
  }

  closeDialog() {
    this.visible = false;
  }

  booleanTurner(){
 this.turner=!(this.turner)
 this.plateNumber = "";
 this.employeeNumber = "";
 this.getAllVehicleAssignment();
  }

  getAllVehicleAssignmentByEmployeeNum(){
    this.vehicleAssignmentService.searchAssignmentByEmployeeNumber(this.employeeNumber, this.query).subscribe((res: PaginatedResponse<VehicleAssignment>) => {
      this.vehicleAssignment = res.content;
      this.query = { page: res.pageable.pageNumber, size: res.size }
      this.totalRecords = res.totalElements;
    })
  }
  getAllVehicleAssignmentByPlateNum(){
    this.vehicleAssignmentService.searchAssignmentByPlateNumber(this.plateNumber, this.query).subscribe((res: PaginatedResponse<VehicleAssignment>) => {
      this.vehicleAssignment = res.content;
      this.query = { page: res.pageable.pageNumber, size: res.size }
      this.totalRecords = res.totalElements;
  })
}
 
replaceVehicle(id: Number){
  this.replacementCheck = true;
 this.router.navigate(['/add-vehicle/replacementCheck/vId'], { queryParams: { 
   replacementCheck: this.replacementCheck, vId: id} });
}

}
