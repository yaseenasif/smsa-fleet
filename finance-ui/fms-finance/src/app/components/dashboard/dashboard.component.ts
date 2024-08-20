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

  basicData: any;
  basicOptions: any;

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

    const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        this.basicData = {
            labels: ['Number of Invoices', 'Number of Files', 'Number of Vehicles', 'Number of Unassigned Vehicles'],
            datasets: [
                {
                    label: 'Records',
                    data: [15, 10, 17, 20],
                    backgroundColor: ['rgba(255, 159, 64, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(153, 102, 255, 0.2)'],
                    borderColor: ['rgb(255, 159, 64)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)'],
                    borderWidth: 1
                }
            ]
        };

        this.basicOptions = {
          plugins: {
              legend: {
                  labels: {
                      color: textColor
                  }
              }
          },
          scales: {
              y: {
                  beginAtZero: true,
                  ticks: {
                      color: textColorSecondary
                  },
                  grid: {
                      color: surfaceBorder,
                      drawBorder: false
                  }
              },
              x: {
                  ticks: {
                      color: textColorSecondary
                  },
                  grid: {
                      color: surfaceBorder,
                      drawBorder: false
                  }
              }
          }
      };

  }



  removeSecondsFromTime(time: string): string {
    const [hours, minutes] = time.split(':');

    let formattedHours = parseInt(hours, 10);
    const amPm = formattedHours >= 12 ? 'PM' : 'AM';
    formattedHours = formattedHours % 12 || 12;

    return `${formattedHours}:${minutes} ${amPm}`;
  }

}
