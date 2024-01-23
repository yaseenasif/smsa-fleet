import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { DashboardService } from './service/dashboard.service';
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [
    trigger('cardAnimation', [
      state('inactive', style({
        // transform: 'scale(1) rotate(0deg)',
        boxShadow: '0 3px 0px rgba(0, 0, 0, 0.3)',
        borderRadius: '20px',
      })),
      state('active', style({
        transform: 'scale(1.1) rotate(360deg)',
        boxShadow: '0 0px 3px rgba(0, 0, 0, 0.5)',
        borderRadius: '20px',
      })),
    //   transition('inactive => active', animate('700ms', keyframes([
    //     style({ transform: 'scale(1) rotate(0deg)', offset: 0 }),
    //     style({ transform: 'scale(1.1) rotate(180deg)', offset: 0.5 }),
    //     style({ transform: 'scale(1.1) rotate(360deg)', offset: 1.0 }),
    //   ]))),
    //   transition('active => inactive', animate('200ms ease-out')),
    ]),
  ],
})

export class DashboardComponent implements OnInit {
  vehiclesPerRegion: any = [];

  items: MenuItem[] | undefined;
  cardState: string = 'inactive';
  data: any;
  data2: any;
  data3: any;
  options: any;
  data1: any;
  options1: any;
  options2: any;
  options3: any;
  option4:any;
  option5:any;
  option6:any;
  data4:any;
  data5:any;
  data6:any;
  dialogVisibleRegion: boolean = false;
  dialogVisibleVendor: boolean = false;
  dashboardcounts: any;
  totalDriversCount: number = 0;
  vendorData!: any[];
  modelId!: any;
  isHover: boolean = false;
  isDonut1Hover: boolean = false;
  isDonut2Hover: boolean = false;
  isDonut3Hover: boolean = false;
  num: number = 0;
  newNum: number = 0;
  option = {
    startVal: this.num,
    useEasing: true,
    duration: 2,
  };
  interval: any;
  currentView: string = "";
  departmentCount: any;
  vehicleCount: any;
  regionCount: any;
  usageTypeCounts: any;
  vehicletab: boolean | undefined;
  unAssignVehicleTab: boolean | undefined;

  // countUpOptions: CountUpOptions = {
  //   duration: 2, // Animation duration in seconds
  // };

  constructor(private dashboardService: DashboardService, private router: Router) { }

  ngOnInit(): void {

    this.items = [{ label: 'DashBoard' }];
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    // this.data = {
    //   labels: ['A', 'B', 'C'],
    //   datasets: [
    //     {
    //       data: [300, 50, 100],
    //       backgroundColor: ["#4099ff", "#2ed8b6", "#FFB64D"],
    //       hoverBackgroundColor: ["#73b4ff", "#59e0c5", "#ffcb80"]
    //     }
    //   ]
    // };


    // this.options = {
    //   cutout: '60%',
    //   plugins: {
    //     legend: {
    //       labels: {
    //         color: textColor,
    //         usePointStyle: true,

    //       },
    //       position: 'bottom'
    //     }
    //   }
    // };

    // const documentStyle1 = getComputedStyle(document.documentElement);
    const textColor1 = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary1 = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder1 = documentStyle.getPropertyValue('--surface-border');



    this.options1 = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            color: this.isHover ? 'white' : textColorSecondary1,
            usePointStyle: true,
          },
          // position: 'bottom',
        },
        datalabels: {
          anchor: 'end',
          align: 'end',
          color: this.isHover ? 'white' : textColorSecondary1,
          font: {
            weight: 'bold',
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: this.isHover ? 'white' : textColorSecondary1,
            font: {
              weight: 'bold',
            },
          },
          grid: {
            color: surfaceBorder1,
            drawBorder: false,
          },
        },
        y: {
          title: {
            display: true,
            text: 'Total Vehicles',
            color: this.isHover ? 'white' : textColorSecondary1,
            font: {
              weight: 'bold',
            },
          },
          ticks: {
            color: textColorSecondary1,
          },
          grid: {
            color: surfaceBorder1,
            drawBorder: false,
          },
        },
      },
    };
    //   },
    //   min: 0, // Set the minimum value on the y-axis
    //       max: 10,
    // };
    this.getDashboardcounts();
    this.getDashboardPieChartCounts();
  }

  // toggleCardAnimation() {
  //   this.cardState = this.cardState === 'inactive' ? 'active' : 'inactive';
  // }

      // onChartHover(isHovered: boolean): void {
      //   this.isHover = isHovered;

      //   // Update the options1 object dynamically when isHover changes
      //   this.options1 = {
      //     ...this.options1, // Spread the existing properties
      //     plugins: {
      //       legend: {
      //         labels: {
      //         },
      //       }
      //     },
      //     scales: {
      //       ...this.options1.scales, // Spread the existing scales properties
      //       x: {
      //         ...this.options1.scales.x, // Spread the existing scales.x properties
      //         ticks: {
      //           ...this.options1.scales.x.ticks, // Spread the existing scales.x.ticks properties
      //           color: this.isHover ? "white" : "black", // Set the color based on isHover
      //         },
      //       },
      //       y: {
      //         title: {
      //           display: true,
      //           text: 'Total Vehicles',
      //           color: this.isHover ? 'white' : "black",
      //           font: {
      //             weight: 'bold',
      //           },
      //         },
      //         ticks: {
      //           color: this.isHover ? 'white' : "black",
      //         },
      //         grid: {
      //           color: this.isHover ? 'white' : "black",
      //           drawBorder: false,
      //         },
      //       },
      //     },
      //   };
      // }

  // onDonut1Hover(isHovered: boolean): void {
  //   this.isDonut1Hover = isHovered;
  //   // Update the options1 object dynamically when isHover changes
  //   this.options = {
  //     ...this.options, // Spread the existing properties
  //     plugins: {
  //       legend: {
  //         labels: {
  //           color: this.isDonut1Hover ? "white" : "black",
  //           usePointStyle: true,
  //         },
  //         position: 'bottom'
  //       }
  //     },
  //   };
  // }
  // onDonut2Hover(isHovered: boolean): void {
  //   this.isDonut2Hover = isHovered;

  //   // Update the options1 object dynamically when isHover changes
  //   this.options2 = {
  //     ...this.options2, // Spread the existing properties
  //     plugins: {
  //       legend: {
  //         labels: {
  //           color: this.isDonut2Hover ? "white" : "black",
  //           usePointStyle: true,
  //         },
  //         position: 'bottom'
  //       }
  //     },
  //   };
  // }
  // onDonut3Hover(isHovered: boolean): void {
  //   this.isDonut3Hover = isHovered;
  //   // Update the options1 object dynamically when isHover changes
  //   this.options3 = {
  //     ...this.options3, // Spread the existing properties
  //     plugins: {
  //       legend: {
  //         labels: {
  //           color: this.isDonut3Hover ? "white" : "black",
  //           usePointStyle: true,
  //         },
  //         position: 'bottom'
  //       }
  //     },
  //   };
  // }
  showDialouge(modelId: any) {
    if (modelId == "region") {
      this.dialogVisibleRegion = true;
    } else {
      this.dialogVisibleVendor = true;
    }
    this.modelId = modelId;
  }

  onDialogClosed() {
    this.dialogVisibleRegion = false;
    this.dialogVisibleVendor = false;
  }

  getDashboardcounts() {
    this.dashboardService.getDashboardCounts().subscribe(
      (res) => {
        this.dashboardcounts = res;
        this.newNum = res.totalActiveDrivers;
        this.vendorData = res.activeVehiclesPerVendor;
        this.vehiclesPerRegion = res.totalVehiclesPerRegion
        this.data1 = {
          labels: this.vendorData.map((vendor) => vendor.name),
          datasets: [
            {
              label: 'Vendors',
              backgroundColor: ['#ABC9FB'],
              backgroundColor2: 'black',
              borderColor: '#4099ff',
              data: this.vendorData.map((vendor) => vendor.totalVehicles),
            }

          ]
        };

        this.data = {
          labels: this.vehiclesPerRegion?.map((region: any) => region.name),
          datasets: [
            {
              label: 'Vehicles Per Region',
              data: this.vehiclesPerRegion.map((vendor: any) => vendor.totalVehicles),
              backgroundColor: ["#476BAD"],
              hoverBackgroundColor: ["#73b4ff", "#ffcb80", "#59e0c5"]
            },
          ]
        };
        this.data2 = {
          labels: this.vehiclesPerRegion?.map((region: any) => region.name),
          datasets: [
            {
              label: 'Vehicles Per Region1',
              data: this.vehiclesPerRegion.map((vendor: any) => vendor.totalVehicles),
              backgroundColor: ["#476BAD"],
              hoverBackgroundColor: ["#73b4ff", "#ffcb80", "#59e0c5"]
            },
          ]
        };
        this.data3 = {
          labels: this.vehiclesPerRegion?.map((region: any) => region.name),
          datasets: [
            {
              label: 'Vehicles Per Region2',
              data: this.vehiclesPerRegion.map((vendor: any) => vendor.totalVehicles),
              backgroundColor: ["#476BAD"],
              hoverBackgroundColor: ["#73b4ff", "#ffcb80", "#59e0c5"]
            },
          ]
        };

      });
  }
  getDashboardPieChartCounts() {
    this.dashboardService.getDashboardPieChartCounts().subscribe(
      (res) => {
         this.departmentCount = res.departmentCounts;
         this.vehicleCount = res.totalVehicleCount;
         this.regionCount = res.regionCounts;
         this.usageTypeCounts = res.usageTypeCounts;
         const labels1 = Object.keys(this.regionCount);
           const totalRegionCount: number = Object.values<number>(this.regionCount).reduce((acc, count) => acc + count, 0);
           const regionPercentages: number[] = Object.keys(this.regionCount).map(region => {
             return (this.regionCount[region] as number / totalRegionCount) * 100;
           });
           this.data4 = {
          labels:labels1,
          datasets: [
            {
              label: 'Percentage',
              data: regionPercentages,
              backgroundColor: ["#476BAD"],
              hoverBackgroundColor: ["#73b4ff", "#ffcb80", "#59e0c5"]
            },
          ]
        };
        const labels2 = Object.keys(this.departmentCount);
        const totalDepartCount: number = Object.values<number>(this.departmentCount).reduce((acc, count) => acc + count, 0);
        const departPercentage: number[] = Object.keys(this.departmentCount).map(region => {
          return (this.departmentCount[region] as number / totalDepartCount) * 100;
        });
      this.data5 = {
        labels: labels2,
        datasets: [
          {
            label: 'Percentage',
            data: departPercentage,
            backgroundColor: ["#476BAD", "#73b4ff", "#ffcb80", "#59e0c5"],
            hoverBackgroundColor: ["#73b4ff", "#ffcb80", "#59e0c5"]
          },
        ]
      };
      const totalUsageTypeCount = this.usageTypeCounts['NON-OPERATIONAL'] + this.usageTypeCounts.OPERATIONAL;
      const nonOperationalPercentage = (this.usageTypeCounts['NON-OPERATIONAL'] / totalUsageTypeCount) * 100;
      const operationalPercentage = (this.usageTypeCounts['OPERATIONAL'] / totalUsageTypeCount) * 100;
        const labels = Object.keys(this.usageTypeCounts); // Dynamically get labels from object keys
        this.data6 = {
          labels:labels,
          datasets: [
            {
              label: 'Percentage',
              data: [operationalPercentage,nonOperationalPercentage],
              backgroundColor: ["#476BAD","#ABC9FB"],
              hoverBackgroundColor: ["#C3EDF5", "#EAD6FD"]
            },
          ]
        };
      });
  }

  redirectToTheVehicles() {
    this.vehicletab = true;
    this.router.navigate(['/vehicle/vehicletab'], { queryParams: {
      vehicletab: this.vehicletab} });
    
  }

  redirectToTheUnassignedVehicles(){
    this.unAssignVehicleTab = true;
    this.router.navigate(['/vehicle/unAssignVehicleTab'], { queryParams: {
      unAssignVehicleTab: this.unAssignVehicleTab} });

  }

}
