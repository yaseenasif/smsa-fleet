import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Employee } from 'src/app/modal/employee';
import { EmployeeService } from '../service/employee.service';
import { Router } from '@angular/router';
import { Grade } from 'src/app/modal/grade';
import { GradeService } from '../../grade/grade.service';
import { City } from 'src/app/modal/City';
import { CityService } from '../../city/city.service';
import { RegionService } from '../../region/service/region.service';
import { Region } from 'src/app/modal/Region';
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

  // city: City = {
  //   id: undefined,
  //   name: undefined,
  //   region: undefined,
  //   status: undefined
  // };

  cityData: any[] = [];

  selectedCity !: City

  selectedGrade !: Grade
  vehicleBudgetFromGrade !: Number | null | undefined

  country!: Region[];
  region!: Region[];
  city: any;

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
    country: undefined,
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

  dummyData: any = [
    { id: 1, name: 'National Manager - Hub  Linehaul' }
  ]

  dummyDepartment: any = [
    { id: 1, name: 'STN' },
  ]

  dummySection: any = [
    { id: 1, name: 'Station Management' }
  ]

  nationalities: any = []
  sections: any = []
  jobTitles: any = []
  departments: any = []

//   dummyNationality: any = [
//     { id: 1, name: "Sudan-031" },
//     { id: 2, name: "Sudan-032" },
//     { id: 3, name: "Sudan-033" },
//     { id: 4, name: "Sudan-034" },
//     { id: 5, name: "Sudan-035" }
//   ]

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
    private regionService: RegionService,
    private productService: ProductFieldServiceService
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
    this.getCountry();
  }

  getCountry(): void {
    this.regionService.getRegion().subscribe(
      (res: Region[]) => {
        const uniqueCountries = this.getUniqueCountries(res, 'country');
        this.country = uniqueCountries;
      },
      (err) => {
      }
    );
  }

  getUniqueCountries(regions: Region[], propertyName: string): Region[] {
    const uniqueCountries: Region[] = [];
    const uniqueCountryNames: Set<string> = new Set();

    for (const region of regions) {
      const countryName = region[propertyName];

      if (!uniqueCountryNames.has(countryName)) {
        uniqueCountryNames.add(countryName);
        uniqueCountries.push(region);
      }
    }

    return uniqueCountries;
  }

  getRegions(country: string): void {
    this.regionService.getRegionByCountry(country).subscribe((res: Region[]) => {
      this.region = [];
      this.employee.region = null;
      res.forEach((r: any) => {
        const parsedCities = JSON.parse(r.cities);
        this.region.push({ ...r, cities: parsedCities });
      });
    }, err => {
    });
  }

  getAllCity(region: string): void {
    this.regionService.getCitiesByRegion(region).subscribe(
      (res: Region) => {
        this.cityData = [];
        let getCities = [];
        getCities.push(res);
        getCities.forEach((element: any) => {
          const parsedCities = JSON.parse(element.cities)
          this.cityData.push(...parsedCities);
        });
        this.cityData = this.cityData.map((city, index) => ({
          cities: city,
          id: index + 1,
        }));
      }, err => {
      });
  }

  getAllGrades() {
    this.gradeService.getGrades().subscribe((res: Grade[]) => {
      this.gradesData = res;
    })
  }

//   getAllCity() {
//     this.cityService.getCity().subscribe((res: City[]) => {
//       this.cityData = res;
//     })
//   }

  onAutoFilled() {
    this.gradeService.getGrades().subscribe((res: Grade[]) => {
      const selectedGrade = res.find((grade) => grade.name === this.employee.grade);

      if (selectedGrade) {
        this.employee.vehicleBudget = selectedGrade.vehicleBudget
      }
    })
  }

  onSubmit() {
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
