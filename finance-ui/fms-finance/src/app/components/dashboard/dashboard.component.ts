import { Component, OnInit } from '@angular/core';
import { DashboardService } from './dashboard.service';
import { Vehicle } from '../../modal/vehicle';
import { VehicleService } from '../../common-service/vehicle.service';
import { VehicleHistory } from '../../modal/vehicleHistory';
import { ActivatedRoute } from '@angular/router';

interface EventItem {
  status?: string;
  date?: string;
  icon?: string;
  color?: string;
  image?: string;
}
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit{

  events !: EventItem[];
  vehicleId: Number | undefined;

  value !: string;
  vehicle : Vehicle = {
    id: undefined,
    processOrderNumber: undefined,
    plateNumber: undefined,
    make: undefined,
    year: undefined,
    design: undefined,
    model: undefined,
    type: undefined,
    capacity: undefined,
    power: undefined,
    region: undefined,
    country: undefined,
    location: undefined,
    registrationExpiry: undefined,
    fuelType: undefined,
    vendor: {
      id: undefined,
      vendorName: undefined,
      officeLocation: undefined,
      attachments: undefined
    },
    insuranceExpiry: undefined,
    leaseCost: undefined,
    replaceLeaseCost: undefined,
    leaseStartDate: undefined,
    leaseExpiryDate: undefined,
    usageType: undefined,
    category: undefined,
    vehicleStatus: undefined,
    replacementVehicleStatus: undefined,
    registrationStatus: undefined,
    insuranceStatus: undefined,
    replacementDate: undefined,
    replacementReason: undefined,
    replacementRemarks: undefined,
    replacementVehicle: undefined
  };

  vehicleHistory!: VehicleHistory[];

  pieData: any;
  pieOptions: any;
  pieDataAccount: any;
  pieDataAwb: any;
  pieAwbOptions: any;
  awbData: any;

  refresh: boolean = true;


  constructor( private vehicleService: VehicleService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {

  }

  search() {
    this.vehicleService.searchVehicleByPlateNumber(this.value).subscribe(( res: Vehicle) => {
      this.vehicle = res;
      if (this.vehicle && this.vehicle.id) {
        this.vehicleId = +this.vehicle.id;
        this.getVehicleHistoryById(this.vehicleId);
      }
    })
  }

  getVehicleHistoryById(id: Number) {

    this.vehicleService.getVehicleHistoryById(id).subscribe((res) => {
      this.vehicleHistory = res.map((el) => {

        [el.createdAtDate, el.createdAtTime] = el.createdAt.split('T');


        if (el.type == 'Assignment' || el.type == 'Released') {
          return { ...el, icon: 'bi bi-clipboard2-check', color: '#F59E0B' }
        } else {
          return { ...el, icon: 'bi bi-arrow-repeat', color: '#3B82F6' }
        }


      });

    })
  }

  removeSecondsFromTime(time: string): string {
    const [hours, minutes] = time.split(':');

    let formattedHours = parseInt(hours, 10);
    const amPm = formattedHours >= 12 ? 'PM' : 'AM';
    formattedHours = formattedHours % 12 || 12;

    return `${formattedHours}:${minutes} ${amPm}`;
  }

}
