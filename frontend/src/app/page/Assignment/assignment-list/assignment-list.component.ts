import { Component } from '@angular/core';
import { MenuItem, MessageService, SelectItem } from 'primeng/api';
import { VehicleAssignmentService } from '../vehicle-assignment.service';
import { VehicleAssignment } from 'src/app/modal/vehicle-assignment';
import { PaginatedResponse } from 'src/app/modal/paginatedResponse';
import { VehicleService } from '../../vehicle-screen/service/vehicle.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Vehicle } from 'src/app/modal/vehicle';

@Component({
  selector: 'app-assignment-list',
  templateUrl: './assignment-list.component.html',
  styleUrls: ['./assignment-list.component.scss'],
  providers: [MessageService]
})
export class AssignmentListComponent {
  vehicle!: Vehicle;
  vehicleId: Number | undefined;
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
  departmentNumber: string | null = null;
  sectionNumber: string | null = null;
  regionNumber: string | null = null;
  totalRecords: number = 0;
  visible!: boolean;
  // visibleReplacement!: boolean;
  vehicleAssignmentId!: Number;
  replacementCheck: boolean = false;
  Number: any[] | undefined;
  selectedSearchType: any = "Search Plate Number";
  placeHolder: any = "Search Plate Number"
  searchTerm: string | null = null;

  constructor(private vehicleAssignmentService: VehicleAssignmentService,
    private messageService: MessageService, private vehicleService: VehicleService,
    private router: Router, private route: ActivatedRoute) { }


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
    this.items = [{ label: 'Vehicle Assignment' }];

    // this.getAllVehicleAssignment();
    this.getAllVehicleAssignmentByPlateNum();

    this.vehicleId = +this.route.snapshot.paramMap.get('id')!;
    if (this.vehicleId) {
      this.getVehicleById(this.vehicleId);
    }
    this.Number = [
      { name: 'Plate Number', value: 'Search Plate Number' },
      { name: 'Employee Number', value: 'Search Employee Number' },
      { name: 'Region', value: 'Search Region' },
      { name: 'Department', value: 'Search Department' },
      { name: 'Section', value: 'Search Section' }
    ];

  }

  turner = true;
  getAllVehicleAssignment() {

    this.vehicleAssignmentService.searchAssignmentByPlateNumber(this.plateNumber, this.query).subscribe((res: PaginatedResponse<VehicleAssignment>) => {
      this.vehicleAssignment = res.content;
      this.query = { page: res.pageable.pageNumber, size: res.size }
      this.totalRecords = res.totalElements;
    })


  }

  deleteVehicleAssignment(id: Number) {
    this.vehicleAssignmentService.deleteVehicleAssignment(id).subscribe((res) => {
      this.vehicleAssignment = res;
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

  onSearchTypeChange(event: { originalEvent: Event, value: SelectItem }) {
    this.placeHolder = event.value.value;
    this.selectedSearchType = event.value.value;
  }

  search() {
    if (this.searchTerm) {
      switch (this.selectedSearchType) {
        case 'Search Employee Number':
          this.getAllVehicleAssignmentByEmployeeNum();
          break;
        case 'Search Plate Number':
          this.getAllVehicleAssignmentByPlateNum();
          break;
        case 'Search Region':
          this.getSearchAssignmentByRegion();
          break;
        case 'Search Department':
          this.getSearchAssignmentByDepartment();
          break;
        case 'Search Section':
          this.getSearchAssignmentBySection();
          break;
        default:
          break;
      }
    } else {
      this.getAllVehicleAssignment();
    }
  }

  getAllVehicleAssignmentByEmployeeNum() {
    this.vehicleAssignmentService.searchAssignmentByEmployeeNumber(this.searchTerm, this.query)
      .subscribe((res: PaginatedResponse<VehicleAssignment>) => {
        this.vehicleAssignment = res.content;
        this.query = { page: res.pageable.pageNumber, size: res.size };
        this.totalRecords = res.totalElements;
      });
  }

  getAllVehicleAssignmentByPlateNum() {
    this.vehicleAssignmentService.searchAssignmentByPlateNumber(this.searchTerm, this.query)
      .subscribe((res: PaginatedResponse<VehicleAssignment>) => {
        this.vehicleAssignment = res.content;
        this.query = { page: res.pageable.pageNumber, size: res.size };
        this.totalRecords = res.totalElements;
      });
  }

  getSearchAssignmentByRegion() {
    this.vehicleAssignmentService.searchAssignmentByRegion(this.searchTerm,'Active', this.query)
      .subscribe((res: PaginatedResponse<VehicleAssignment>) => {
        this.vehicleAssignment = res.content;
        this.query = { page: res.pageable.pageNumber, size: res.size };
        this.totalRecords = res.totalElements;
      });
  }
  getSearchAssignmentByDepartment() {
    this.vehicleAssignmentService.searchAssignmentByDepartment(this.searchTerm, 'Active', this.query)
      .subscribe((res: PaginatedResponse<VehicleAssignment>) => {
        this.vehicleAssignment = res.content;
        this.query = { page: res.pageable.pageNumber, size: res.size };
        this.totalRecords = res.totalElements;
      });
  }
  getSearchAssignmentBySection() {
    this.vehicleAssignmentService.searchAssignmentBySection(this.searchTerm, 'Active',this.query)
      .subscribe((res: PaginatedResponse<VehicleAssignment>) => {
        this.vehicleAssignment = res.content;
        this.query = { page: res.pageable.pageNumber, size: res.size };
        this.totalRecords = res.totalElements;
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
}
