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

  

  removeSecondsFromTime(time: string): string {
    const [hours, minutes] = time.split(':');

    let formattedHours = parseInt(hours, 10);
    const amPm = formattedHours >= 12 ? 'PM' : 'AM';
    formattedHours = formattedHours % 12 || 12;

    return `${formattedHours}:${minutes} ${amPm}`;
  }

}
