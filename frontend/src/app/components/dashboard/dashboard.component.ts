import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { DialogBoxComponent } from '../dialog-box/dialog-box.component';
import { DashboardService } from './service/dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(private dashboardService: DashboardService) { }
  items: MenuItem[] | undefined;
  data: any;
  options: any;
  data1: any;
  options1: any;

  dialogVisibleRegion: boolean = false;
  dialogVisibleVendor: boolean = false;
  dashboardcounts!: any; 
  vendorData!: any[];
  modelId!: any;  

  ngOnInit(): void {

    this.items = [{ label: 'Dash Board'}];
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    this.data = {
        labels: ['A', 'B', 'C'],
        datasets: [
            {
                data: [300, 50, 100],
                backgroundColor: ["#4099ff","#2ed8b6", "#FFB64D"],
                hoverBackgroundColor: ["#73b4ff","#59e0c5","#ffcb80"]
            }
        ]
    };


    this.options = {
        cutout: '60%',
        plugins: {
            legend: {
                labels: {
                    color: textColor,
                    usePointStyle: true,
                
                },
                position:'bottom'
            }
        }
    };

    const documentStyle1= getComputedStyle(document.documentElement);
    const textColor1 = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary1= documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder1= documentStyle.getPropertyValue('--surface-border');
        

    
    this.options1= {
        maintainAspectRatio: false,
        aspectRatio: 0.8,
        plugins: {
            legend: {
                labels: {
                    color: textColor1,
                    usePointStyle: true,
                },
                position:'bottom'
            }
        },
        scales: {
            x: {
                ticks: {
                    color: textColorSecondary1,
                    font: {
                        weight: 'bold'
                    }
                },
                grid: {
                    color: surfaceBorder1,
                    drawBorder: false
                }
            },
            y: {
                ticks: {
                    color: textColorSecondary1
                },
                grid: {
                    color: surfaceBorder1,
                    drawBorder: false
                }
            }

        },
        // min: 0, // Set the minimum value on the y-axis
        //     max: 10,
    };
    this.getDashboardcounts();

  }

  showDialouge(modelId: any) {
      if(modelId == "region"){
      this.dialogVisibleRegion = true;
      }else{
        this.dialogVisibleVendor = true;
      }
      this.modelId=modelId;
  }

  onDialogClosed() {
      this.dialogVisibleRegion = false;
      this.dialogVisibleVendor = false;
  }

  getDashboardcounts(){
    this.dashboardService.getDashboardCounts().subscribe(
        (res) => {
            this.dashboardcounts = res;
            this.vendorData = res.activeVehiclesPerVendor;
            
            this.data1= {
                labels: this.vendorData.map((vendor) => vendor.name),
                datasets: [
                    {
                        label: 'Vendors',
                        backgroundColor:'#4099ff',
                        borderColor:'#4099ff',
                        data: this.vendorData.map((vendor)=> vendor.totalVehicles)
                    }
                  
                ]
            };
                    
         });
 }


}
