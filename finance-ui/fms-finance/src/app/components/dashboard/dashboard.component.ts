import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  pieData: any;
  pieOptions: any;
  pieDataAccount: any;
  pieDataAwb: any;
  pieAwbOptions: any;
  awbData: any;

  refresh: boolean = true;


}
