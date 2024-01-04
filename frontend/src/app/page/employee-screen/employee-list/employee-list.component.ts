import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Employee } from 'src/app/modal/employee';
import { EmployeeService } from '../service/employee.service';
import { FileUpload } from 'primeng/fileupload';
import { PaginatedResponse } from 'src/app/modal/paginatedResponse';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss'],
  providers: [MessageService]
})
export class EmployeeListComponent implements OnInit{
  @ViewChild('fileUpload', { static: false })
  fileUpload!: FileUpload;
  fileSelected: boolean = false;


  constructor(
              private employeeService: EmployeeService,
              private messageService: MessageService) { }

  employee!: Employee[];
  statusVisible!: boolean;
  vId!: number
  query !: {
    page: number,
    size: number
  };
  value: number | null = null;
    totalRecords: number = 0;
  fileName : string = 'empSample.xlsx'
  items: MenuItem[] | undefined;
  selectedStatus = {name:'Active'};
  employeeStatus : any;

  ngOnInit(): void {

    this.items = [{
      label: 'Employee'
    }]
    this.employeeStatus = [
      {
        name: 'Active'
      },
      {
        name: 'Inactive'
      }
    ]

    this.getAllEmployees();

  }

  onCancel() {
    // Handle cancel logic here
    this.fileSelected = false;

    this.fileUpload.clear();

  }

  onFileSelect() {
    this.fileSelected = true;
  }

  onUpload(event: any) {
    const uploadedFile = event.files[0];

    if (uploadedFile) {
      this.employeeService.saveFile(uploadedFile).subscribe(
        (response) => {

          if (Array.isArray(response.message)) {

            response.message.forEach((message: any) => {
              this.messageService.add({ severity: 'success', summary: 'Upload Successful', detail: message });
            });

          } else if (response.message) {
            this.messageService.add({ severity: 'success', summary: 'Upload Successful', detail: response.message });
          } else {
            this.messageService.add({ severity: 'success', summary: 'Upload Successful', detail: 'File uploaded successfully.' });
          }

          this.getAllEmployees();
        },
        (error) => {
          console.error('Error while saving the file:', error);

          this.messageService.add({ severity: 'error', summary: 'Upload Error', detail: error.error });
        }
      );
    }
  }


  getAllEmployees() {

    this.employeeService.searchEmployee(this.value, this.query).subscribe((res: PaginatedResponse<Employee>) => {
      this.employee = res.content;
      this.query = { page: res.pageable.pageNumber, size: res.size }
      this.totalRecords = res.totalElements;
    console.log(res);

    })

  }
  getAllInactiveEmployee() {
    const stringValue = this.value !== null ? String(this.value) : null;
    this.employeeService.searchInactiveEmployee(stringValue, this.query).subscribe((res:PaginatedResponse<Employee>) => {
        this.employee = res.content;
        debugger
        this.query = { page: typeof res.pageable.pageNumber === 'number' ? res.pageable.pageNumber : 0, size: typeof res.size === 'number' ? res.size : 10 };
        this.totalRecords = res.totalElements;
    });
}
  onPageChange(event?: any) {
    this.query.page = event.page;
    this.query.size = event.rows;
    this.getAllEmployees()
  }

  flag='Active'
  OnSelectChange(){
    if(this.selectedStatus.name!=this.flag){
     this.query.page=0
     this.flag=this.selectedStatus.name
    }

    if(this.selectedStatus.name == 'Active'){
      this.getAllEmployees()
      }else{
        this.getAllInactiveEmployee()
      }
  }


  closeDialog() {
    this.statusVisible = false;
  }


downloadAttachment(fileName:string){
  this.employeeService.downloadAttachments(fileName).subscribe(blob => saveAs(blob,fileName));
}
activateEmployee(id:number){
  this.employeeService.activateEmployee(id).subscribe((res:Employee)=>{
    this.messageService.add({ severity: 'success', summary: 'Employee Activated'});
    this.closeDialog()
    this.getAllInactiveEmployee()
  })
 }


}
