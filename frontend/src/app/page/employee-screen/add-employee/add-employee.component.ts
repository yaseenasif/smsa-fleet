import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Employee } from 'src/app/modal/employee';
import { EmployeeService } from '../service/employee.service';
import { Router } from '@angular/router';
import { Grade } from 'src/app/modal/grade';
import { GradeService } from '../../grade/grade.service';
import { City } from 'src/app/modal/City';
import { CityService } from '../../city/city.service';
import { ProductFieldServiceService } from '../../product-field/service/product-field-service.service';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss'],
  providers: [MessageService]
})
export class AddEmployeeComponent implements OnInit {

  items: MenuItem[] | undefined;

  grade !: Grade[]

  city: City = {
    id: undefined,
    name: undefined,
    region: undefined,
    status: undefined
  };

  cityData: any = [];

  selectedCity !: City

  selectedGrade !: Grade
  vehicleBudgetFromGrade !: Number | null | undefined

  region: string = '';


  employee: Employee = {
    id: undefined,
    employeeNumber: undefined,
    budgetRef: undefined,
    empName: undefined,
    gender: undefined,
    maritalStatus: undefined,
    dateOfBirth: undefined,
    joiningDate: undefined,
    jobTitle: undefined,
    status: undefined,
    region: undefined,
    location: undefined,
    organization: undefined,
    division: undefined,
    deptCode: undefined,
    department: undefined,
    section: undefined,
    nationalIdNumber: undefined,
    svEmployeeNumber: undefined,
    svEmployeeName: undefined,
    city: undefined,
    age: undefined,
    costCentre: undefined,
    nationality: undefined,
    companyEmailAddress: undefined,
    grade: undefined,
    licenseNumber: undefined,
    vehicleBudget: undefined,
    contactNumber: undefined
  };



  dummyDepartment: any = [
    { id: 1, name: 'STN' },
  ]

  

  nationalities: any = []
  sections: any = []
  jobTitles: any = []
  departments: any = []


  dummyRegion: any = [
    { id: 1, name: "Head Quarter" }
  ]
  employeeStatus: any = [
    { id: 1, statusName: 'Active' },
    { id: 2, statusName: 'Resigned' },
    { id: 3, statusName: 'Terminated' },
    { id: 4, statusName: 'Deceased' }
  ]

  gradesData: any = [

  ]


  name!: string;

  size = 100000
  uploadedFiles: any[] = [];



  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private messageService: MessageService,
    private gradeService: GradeService,
    private cityService: CityService,
    private productService: ProductFieldServiceService,
  ) { }



  onUpload(event: any) {

  }

  onUpload1(event: any) {
    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }
  }

  ngOnInit(): void {
    this.getNationality();
    this.getJobTitle();
    this.getDepartment() ;
    this.getSections();
    this.items = [{ label: 'Employee', routerLink: '/employee' }, { label: 'Add Employee' }];

    this.getAllGrades();
    this.getAllCity();
  }

  getAllGrades() {
    this.gradeService.getGrades().subscribe((res: Grade[]) => {
      this.gradesData = res;
    })
  }

  getAllCity() {
    this.cityService.getCity().subscribe((res: City[]) => {
      this.cityData = res;
    })
  }

  onAutoFilled() {
    this.gradeService.getGrades().subscribe((res: Grade[]) => {
      const selectedGrade = res.find((grade) => grade.name === this.employee.grade);

      if (selectedGrade) {
        this.employee.vehicleBudget = selectedGrade.vehicleBudget
      }
    })
  }

  onSubmit() {

    console.log('Form submitted:', this.employee);


    this.employeeService.addEmployee(this.employee).subscribe((res) => {
      this.messageService.add({ severity: 'success', summary: 'Employee Added Successfully' });


      setTimeout(() => {
        this.router.navigate(['/employee'])
      }, 5000)

    },
      (error) => {
        console.error('Error while saving the file:', error);

        this.messageService.add({ severity: 'error', summary: 'Upload Error', detail: error.error });
      })

  }

  getAutoFilledRegion(city: City): void {
    const selectedCityObj = this.cityData.find((item: any) => item.name === city);
    this.region = selectedCityObj.region;
  }
  getNationality() {
    this.productService.getProductFieldByName('Nationality').subscribe(res => {
      this.nationalities = res.productFieldValuesList;
    }, error => {

    })
  }
  getJobTitle() {
    this.productService.getProductFieldByName('Job Title').subscribe(res => {
      this.jobTitles = res.productFieldValuesList;
    }, error => {

    })
  }
  getDepartment() {
    this.productService.getProductFieldByName('Department').subscribe(res => {
      this.departments = res.productFieldValuesList;
    }, error => {

    })
  }
  getSections() {
    this.productService.getProductFieldByName('Section').subscribe(res => {
      this.sections = res.productFieldValuesList;
    }, error => {

    })
  }
}
