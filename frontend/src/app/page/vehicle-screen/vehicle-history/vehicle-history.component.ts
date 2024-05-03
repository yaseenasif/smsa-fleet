import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Vehicle } from 'src/app/modal/vehicle';
import { VehicleHistory } from 'src/app/modal/vehicle-history';
import { VehicleService } from '../service/vehicle.service';
import { saveAs } from 'file-saver';
import { DashboardRedirectServiceService } from 'src/app/CommonServices/dashboard-redirect-service.service';
import { DatePipe } from '@angular/common';


// import { DatePipe } from '@angular/common';

interface EventItem {
  event?: string;
  date?: string;
  icon?: string;
  color?: string;
  image?: string;
  plateNumber?: number;
  employ?: { name: string, employNumber: number };
}


@Component({
  selector: 'app-vehicle-history',
  templateUrl: './vehicle-history.component.html',
  styleUrls: ['./vehicle-history.component.scss'],
  providers: [DatePipe]
})
export class VehicleHistoryComponent {
  items: MenuItem[] | undefined;

  vehicleId: Number | undefined;
  vehicleHistory!: VehicleHistory[];
  vehicle!: Vehicle;
  constructor(private vehicleService: VehicleService,
    private route: ActivatedRoute,
    private dashboardRedirectService: DashboardRedirectServiceService, private datePipe:DatePipe) {}

  ngOnInit() {
    this.items = [{ label: 'Vehicle', routerLink: '/vehicle' }, { label: 'Vehicle History' }];
    this.vehicleId = +this.route.snapshot.paramMap.get('id')!;
    this.getVehicleHistoryById(this.vehicleId);
    this.getVehicleById(this.vehicleId)
    this.dashboardRedirectService.setDashboardValue('Vehicle');
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

  getVehicleById(id: Number) {
    this.vehicleService.getVehicleById(id).subscribe((res) => {
      this.vehicle = res;
    });
  }

  downloadPdf(id: Number) {
    this.vehicleService.generateVehicleHistoryPdf(id).subscribe(blob => saveAs(blob, "vehicle_history_" + id));
  }
  removeSecondsFromTime(time: string): string {
    const [hours, minutes] = time.split(':');

    let formattedHours = parseInt(hours, 10);
    const amPm = formattedHours >= 12 ? 'PM' : 'AM';
    formattedHours = formattedHours % 12 || 12;
    
    return `${formattedHours}:${minutes} ${amPm}`;
  }


}
