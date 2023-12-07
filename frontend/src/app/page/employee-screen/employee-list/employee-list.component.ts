import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Employee } from 'src/app/modal/employee';
import { EmployeeService } from '../service/employee.service';
import { FileUpload } from 'primeng/fileupload';
import { PaginatedResponse } from 'src/app/modal/paginatedResponse';

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

  query !: {
    page: number,
    size: number
  };

  value: number | null = null;
  totalRecords: number = 0;

  items: MenuItem[] | undefined;

  ngOnInit(): void {

    this.items = [{
      label: 'Employee'
    }]

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
            // If response.message is a single message, display it
            this.messageService.add({ severity: 'success', summary: 'Upload Successful', detail: response.message });
          } else {
            // Display a generic success message if no message is provided
            this.messageService.add({ severity: 'success', summary: 'Upload Successful', detail: 'File uploaded successfully.' });
          }

          this.getAllEmployees();
        },
        (error) => {
          console.error('Error while saving the file:', error);

          this.messageService.add({ severity: 'error', summary: 'Upload Error', detail: error.error });
          // Handle error
        }
      );
    }
  }


  getAllEmployees() {

    this.employeeService.searchEmployee(this.value, this.query).subscribe((res: PaginatedResponse<Employee>) => {
      this.employee = res.content;
      this.query = { page: res.pageable.pageNumber, size: res.size }
      this.totalRecords = res.totalElements;
    })

  }

  onPageChange(event?: any) {
    this.query.page = event.page;
    this.query.size = event.rows;
    this.getAllEmployees()
  }

}
