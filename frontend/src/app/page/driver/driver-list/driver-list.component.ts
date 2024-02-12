// import { Component, OnInit } from '@angular/core';
// import { MenuItem, MessageService } from 'primeng/api';
// import { DriverService } from '../driver.service';
// import { Driver } from 'src/app/modal/driver';
// import { PaginatedResponse } from 'src/app/modal/paginatedResponse';

// @Component({
//   selector: 'app-driver-list',
//   templateUrl: './driver-list.component.html',
//   styleUrls: ['./driver-list.component.scss'],
//   providers: [MessageService]
// })
// export class DriverListComponent implements OnInit {


//   constructor(private driverService: DriverService, private messageService: MessageService) { }

//   driver!: Driver[];

//   items: MenuItem[] | undefined;
//   selectedStatus = {name:'Active'};
//   driverStatus : any;
//   statusVisible!: boolean;
//   vId!: number
//   query !: {
//     page: number,
//     size: number
//   };
//   replacementDriver!: Array<Driver>;

//   value: number | null = null;
//   totalRecords: number = 0;
//   visible: boolean = false;


//   ngOnInit() {
//       this.items = [{ label: 'Driver List'}];
//       this.driverStatus = [
//         {
//           name: 'Active'
//         },
//         {
//           name: 'Inactive'
//         }
//       ]
//       this.getAllDrivers();
//   }

//   getAllDrivers() {
//       this.driverService.searchDriver(this.value, this.query).subscribe((res: PaginatedResponse<Driver>) => {
//       this.driver = res.content;
//       this.query = { page: res.pageable.pageNumber, size: res.size }
//       this.totalRecords = res.totalElements;
//     })
//   }



//   deleteDriver(id: Number) {

//       this.driverService.deleteDriver(id).subscribe((res) => {

//         this.messageService.add({ severity: 'Delete Successfully', summary: 'Delete Successfully', detail: 'Employee has been deleted' });

//         this.getAllDrivers();

//       })

//   }


//   getAllInactiveDriver() {
//     const stringValue = this.value !== null ? String(this.value) : null;
//     debugger
//     this.driverService.searchInactiveDriver(stringValue, this.query).subscribe((res:PaginatedResponse<Driver>) => {
//         this.driver = res.content;
//         debugger
//         this.query = { page: typeof res.pageable.pageNumber === 'number' ? res.pageable.pageNumber : 0, size: typeof res.size === 'number' ? res.size : 10 };
//         this.totalRecords = res.totalElements;
//     });
// }
//   onPageChange(event?: any) {
//     this.query.page = event.page;
//     this.query.size = event.rows;
//     this.getAllDrivers()
//   }

//   closeDialog() {
//     this.statusVisible = false;
//   }
//   activateDriver(id:number){
//     debugger
//     this.driverService.activateDriver(id).subscribe((res:Driver)=>{
//       this.messageService.add({ severity: 'success', summary: 'Vehicle Activated'});
//   //
//   //     setTimeout(() => {
//   //
//   //       this.router.navigate(['/vehicle'])
//   //     },1000)
//       this.closeDialog()
//       this.getAllInactiveDriver()
//     })
//    }


//   flag='Active'
//   OnSelectChange(){
//     if(this.selectedStatus.name!=this.flag){
//      this.query.page=0
//      this.flag=this.selectedStatus.name
//     }

//     if(this.selectedStatus.name == 'Active'){
//       this.getAllDrivers()
//       }else{
//         this.getAllInactiveDriver()
//       }
//   }


//   showStatusDialog(id: number) {
//     this.vId = id;
//     this.statusVisible = true;
//     console.log(this.vId);
// }
// }
