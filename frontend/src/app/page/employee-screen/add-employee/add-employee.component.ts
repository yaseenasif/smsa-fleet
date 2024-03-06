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
import { ProductField } from 'src/app/modal/ProductField';
import { JobTitleService } from '../../job-title/job-title.service';
import { JobTitle } from 'src/app/modal/job-title';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss'],
  providers: [MessageService]
})
export class AddEmployeeComponent implements OnInit {

  // grade !: Grade[]

  // city: City = {
  //   id: undefined,
  //   name: undefined,
  //   region: undefined,
  //   status: undefined
  // };

  // selectedCity !: City

  // selectedGrade !: Grade
  // vehicleBudgetFromGrade !: Number | null | undefined

  // dummyData: any = [
  //   { id: 1, name: 'National Manager - Hub  Linehaul' }
  // ]

  // dummyDepartment: any = [
  //   { id: 1, name: 'STN' },
  // ]

  // dummySection: any = [
  //   { id: 1, name: 'Station Management' }
  // ]

  //   dummyNationality: any = [
  //     { id: 1, name: "Sudan-031" },
  //     { id: 2, name: "Sudan-032" },
  //     { id: 3, name: "Sudan-033" },
  //     { id: 4, name: "Sudan-034" },
  //     { id: 5, name: "Sudan-035" }
  //   ]

  // dummyRegion: any = [
  //   { id: 1, name: "Head Quarter" }
  // ]
  // employeeStatus: any = [
  //   { id: 1, statusName: 'Active' },
  //   { id: 2, statusName: 'Resigned' },
  //   { id: 3, statusName: 'Terminated' },
  //   { id: 4, statusName: 'Deceased' }
  // ]

  // name!: string;

  // size = 100000

  // onUpload(event: any) {

  // }

  // onUpload1(event: any) {
  //   for (let file of event.files) {
  //     this.uploadedFiles.push(file);
  //   }
  // }

  // getCountry(): void {
  //   this.regionService.getRegion().subscribe(
  //     (res: Region[]) => {
  //       const uniqueCountries = this.getUniqueCountries(res, 'country');
  //       this.country = uniqueCountries;
  //     },
  //     (err) => {
  //     }
  //   );
  // }

  // getUniqueCountries(regions: Region[], propertyName: string): Region[] {
  //   const uniqueCountries: Region[] = [];
  //   const uniqueCountryNames: Set<string> = new Set();

  //   for (const region of regions) {
  //     const countryName = region[propertyName];

  //     if (!uniqueCountryNames.has(countryName)) {
  //       uniqueCountryNames.add(countryName);
  //       uniqueCountries.push(region);
  //     }
  //   }

  //   return uniqueCountries;
  // }

  // getRegions(country: string): void {
  //   this.regionService.getRegionByCountry(country).subscribe((res: Region[]) => {
  //     this.region = [];
  //     this.employee.region = null;
  //     res.forEach((r: any) => {
  //       const parsedCities = JSON.parse(r.cities);
  //       this.region.push({ ...r, cities: parsedCities });
  //     });
  //   }, err => {
  //   });
  // }

  // getAllCity(region: string): void {
  //   this.regionService.getCitiesByRegion(region).subscribe(
  //     (res: Region) => {
  //       this.cityData = [];
  //       let getCities = [];
  //       getCities.push(res);
  //       getCities.forEach((element: any) => {
  //         const parsedCities = JSON.parse(element.cities)
  //         this.cityData.push(...parsedCities);
  //       });
  //       this.cityData = this.cityData.map((city, index) => ({
  //         cities: city,
  //         id: index + 1,
  //       }));
  //     }, err => {
  //     });
  // }

  //   getAllCity() {
  //     this.cityService.getCity().subscribe((res: City[]) => {
  //       this.cityData = res;
  //     })
  //   }

  // getAutoFilledRegion(city: City): void {
  //   const selectedCityObj = this.cityData.find((item: any) => item.name === city);
  //   this.region = selectedCityObj.region;
  // }

  items: MenuItem[] | undefined;
  country!: Region[];
  region!: Region[];
  cityData!: Region[];

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
    // age: undefined,
    costCentre: undefined,
    nationality: undefined,
    companyEmailAddress: undefined,
    grade: undefined,
    licenseNumber: undefined,
    vehicleBudget: undefined,
    contactNumber: undefined,
    fleetClassification: undefined,
    vehicleEligible: undefined
  };

  nationalities: ProductField | null | undefined;
  sections: ProductField | null | undefined;
  jobTitles: ProductField | null | undefined;
  departments: ProductField | null | undefined;

  gradesData!: Grade[];

  uploadedFiles!: Employee[];
  allJobTitle !: JobTitle[]
  temp !: JobTitle[];



  constructor(
    // private cityService: CityService,
    private employeeService: EmployeeService,
    private router: Router,
    private messageService: MessageService,
    private gradeService: GradeService,
    private regionService: RegionService,
    private productService: ProductFieldServiceService,
    private jobTitleService: JobTitleService
  ) { }


  ngOnInit(): void {
    this.items = [{ label: 'Employee', routerLink: '/employee' }, { label: 'Add Employee' }];
    this.getNationality();
    // this.getJobTitle();
    this.getDepartment();
    this.getSections();
    this.getAllGrades();
    this.getCountry();
    this.getAllJobTitle();
  }

  getCountry(): Region[] {
    this.regionService.getRegion().subscribe(
      (res: Region[]) => {
        const uniqueCountries = this.getUniqueCountries(res, 'country');
        this.country = uniqueCountries;
      },
      (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error });
      }
    );
    return this.country;
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

  getRegions(country: string): Region[] {
    this.regionService.getRegionByCountry(country).subscribe((res: Region[]) => {
      this.region = [];
      this.employee.region = null;
      this.region = res;
    }, err => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error });
    });
    return this.region;
  }

  getAllCity(region: string): Region[] {
    this.regionService.getCitiesByRegion(region).subscribe(
      (res: Region) => {
        this.employee.city = null;
        const getCities = typeof res.cities === 'string' ? JSON.parse(res.cities) : res.cities;
        this.cityData = getCities.map((city: Region, index: number) => ({
          cities: city,
          id: index + 1,
        }));
      }, err => {
        this.messageService.add({ severity: 'error', summary: 'Upload Error', detail: err.error });
      });
    return this.cityData;
  }

  getAllGrades() {
    this.gradeService.getGrades().subscribe((res: Grade[]) => {
      this.gradesData = res;
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
    this.employeeService.addEmployee(this.employee).subscribe((res: Employee) => {
      this.messageService.add({ severity: 'success', summary: 'Employee Added Successfully' });
      setTimeout(() => {
        this.router.navigate(['/employee'])
      }, 5000)
    },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Upload Error', detail: error.error });
      })

  }

  getNationality() {
    this.productService.getProductFieldByName('Nationality').subscribe((res: ProductField) => {
      this.nationalities = res;
    }, error => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error });
    })
  }
  // getJobTitle() {
  //   this.productService.getProductFieldByName('Job Title').subscribe((res: ProductField) => {
  //     this.jobTitles = res;
  //   }, error => {
  //     this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error });
  //   })
  // }
  getDepartment() {
    this.productService.getProductFieldByName('Department').subscribe((res: ProductField) => {
      this.departments = res;
    }, error => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error });
    })
  }
  getSections() {
    this.productService.getProductFieldByName('Section').subscribe((res: ProductField) => {
      this.sections = res;
    }, error => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error });
    })
  }

  getAllJobTitle() {
    this.jobTitleService.getJobTitle().subscribe((res) => {
      this.allJobTitle = res;
      console.log(this.allJobTitle);

    })
  }

  dataFilledbyField() {
    this.temp = this.allJobTitle.filter(jobTitleObj => jobTitleObj.jobTitle === this.employee.jobTitle);
    this.employee.department = this.temp[0].department
    this.employee.section = this.temp[0].section;
    this.employee.division = this.temp[0].division
    this.employee.fleetClassification = this.temp[0].fleetClassification;
    this.employee.vehicleEligible = this.temp[0].vehicleEligible

  }
}
