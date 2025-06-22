import { Component, enableProdMode } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Employee } from 'src/app/modal/employee';
import { EmployeeService } from '../service/employee.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { City } from 'src/app/modal/City';
import { CityService } from '../../city/city.service';
import { RegionService } from '../../region/service/region.service';
import { Region } from 'src/app/modal/Region';
import { GradeService } from '../../grade/grade.service';
import { Grade } from 'src/app/modal/grade';
import { JobTitleService } from '../../job-title/job-title.service';
import { JobTitle } from 'src/app/modal/job-title';
import { ProductFieldServiceService } from '../../product-field/service/product-field-service.service';
import { BackenCommonErrorThrow } from 'src/app/modal/BackendCommonErrorThrow';
import { ProductField } from 'src/app/modal/ProductField';
import { ErrorService } from 'src/app/CommonServices/Error/error.service';
import { DashboardRedirectServiceService } from 'src/app/CommonServices/dashboard-redirect-service.service';
import { AuthguardService } from 'src/app/auth-service/authguard/authguard.service';
import { UserService } from '../../user/user.service';
import { User } from 'src/app/modal/user';

@Component({
  selector: 'app-update-employee',
  templateUrl: './update-employee.component.html',
  styleUrls: ['./update-employee.component.scss'],
  providers: [MessageService, DatePipe]
})
export class UpdateEmployeeComponent {

  items: MenuItem[] | undefined;

  city: City = {
    id: undefined,
    name: undefined,
    region: undefined,
    status: undefined
  };

  gradesData: any = []
  cityData: any = [];

  selectedCity !: City
  // region: string | undefined | null;

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
    organization: undefined,
    division: undefined,
    deptCode: undefined,
    department: undefined,
    section: undefined,
    nationalIdNumber: undefined,
    svEmployeeNumber: undefined,
    svEmployeeName: undefined,
    location: undefined,
    costCentre: undefined,
    nationality: undefined,
    companyEmailAddress: undefined,
    grade: undefined,
    licenseNumber: undefined,
    vehicleBudget: undefined,
    contactNumber: undefined,
    country: undefined,
    fleetClassification: undefined,
    vehicleEligible: undefined
  }

  country!: Region[];
  region!: Region[];

  employeeId: Number | undefined;
  isDeleteButtonDisabled: boolean = true; // Set the initial value based on your logic
  assignedEmployeeCheck!: boolean;

  dummyData: any = [
    { id: '21', name: 'STN' }
  ]

  visible!: boolean;
  allJobTitle !: JobTitle[];
  temp !: JobTitle[];
  location: ProductField | null | undefined;
  organization: ProductField | null | undefined;
  deptCode: ProductField | null | undefined;
  user: User | undefined | null;
  role: string | null | undefined;

  constructor(private employeeService: EmployeeService,
    private router: Router,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private regionService: RegionService,
    private gradeService: GradeService,
    private jobTitleService: JobTitleService,
    private productFieldService: ProductFieldServiceService,
    private errorHandleService: ErrorService,
    private dashboardRedirectService: DashboardRedirectServiceService,
    private authService: AuthguardService,
    private userService: UserService,private errorService: ErrorService,
  ) { }


  name!: string;

  size = 100000
  uploadedFiles: any[] = [];

  onUpload(event: any) {

  }

  onUpload1(event: any) {
    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }
  }

  ngOnInit(): void {
    const decodedToken = this.decodeTokenTOGetUser();
    this.checkUserRole(decodedToken?.sub!);
    this.items = [{ label: 'Employee', routerLink: '/employee' }, { label: 'Edit Employee' }];
    this.employeeId = +this.route.snapshot.paramMap.get('id')!;
    this.getEmployeeById(this.employeeId)
    this.checkAssignedEmployee(this.employeeId);
    this.getAllJobTitle();
    this.getAllGrades();
    this.getLocationList("Location");
    this.getOrganizationList("Organization");
    this.getDeptcodeList("Dept Code");
    this.dashboardRedirectService.setDashboardValue('Employee');
    
  }

  decodeTokenTOGetUser(): { PERMISSIONS: string[], ROLES: string[], sub: string } | null {
    const token = localStorage.getItem('accessToken');
    return this.authService.getDecodedAccessToken(token!);
  }

  checkUserRole(employeeId: string): void {
    this.userService.getUserByEmpId(employeeId).subscribe(
      (user: User) => {
        this.role = user.roles[0].name;
      }, (err: BackenCommonErrorThrow) => {
        this.errorService.showError(err.error!)
      });
  }

  getEmployeeById(id: Number) {
    this.employeeService.getEmployeeById(id).subscribe((res: Employee) => {
      res.joiningDate = res.joiningDate ? new Date(res.joiningDate) : null;
      res.dateOfBirth = res.dateOfBirth ? new Date(res.dateOfBirth) : null;
      this.employee = res;
      this.getCountry();
    })
  }

  getCountry(): Region[] {
    this.regionService.getRegion().subscribe(
      (res: Region[]) => {
        const uniqueCountries = this.getUniqueCountries(res, 'country');
        this.country = uniqueCountries;
        const country = typeof this.employee?.country === 'string' ? this.employee.country : "";
        this.getRegions(country);
      },
      (err) => {
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
      this.region = res;
      const regionInEmployee = typeof this.employee?.region === 'string' ? this.employee.region : "";
      this.getAllCity(regionInEmployee);
    }, err => {
    });
    return this.region;
  }

  getAllCity(region: string): Region[] {
    this.regionService.getCitiesByRegion(region).subscribe(
      (res: Region) => {
        // let getCities = [];
        // this.cityData = [];
        // getCities.push(res);
        // getCities.forEach((element: any) => {
        //   const parsedCities = JSON.parse(element.cities)
        //   this.cityData.push(...parsedCities);
        // });
        const getCities = typeof res.cities === 'string' ? JSON.parse(res.cities) : res.cities;
        this.cityData = getCities.map((city: Region, index: number) => ({
          cities: city,
          id: index + 1,
        }));
      }, err => {
      });
    return this.cityData;
  }



  updateEmployee(employee: Employee) {
    this.employeeService.updateEmployee(this.employeeId!, employee).subscribe(
      (res) => {
        this.messageService.add({ severity: 'success', summary: 'Update Successfully', detail: 'Message Content' });
        setTimeout(() => {
          this.router.navigate(['/employee']);
        }, 5000);
      },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Edit Error', detail: error.error });
      }
    );
  }
  onSubmit() {
    this.updateEmployee(this.employee);
  }

  closeDialog() {
    this.visible = false;
  }

  showDialog() {
    this.visible = true;
  }

  deleteEmployee() {

    this.employeeService.deleteEmployee(this.employeeId!, this.employee).subscribe((res) => {
      this.employee = res;
      this.messageService.add({ severity: 'success', summary: 'Delete Successfully', detail: 'Employee has been deleted' });
      setTimeout(() => {
        this.router.navigate(['/employee'])
      }, 1000)
    })
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

  checkAssignedEmployee(id: Number){
    this.employeeService.checkAssignedEmployee(id).subscribe((res: any) => {
      this.assignedEmployeeCheck = res.check;
    })
  }

  getAllJobTitle() {
    this.jobTitleService.getJobTitle().subscribe((res) => {
      this.allJobTitle = res;

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

  private getLocationList(fieldName: string) {
    this.productFieldService.getProductFieldByName(fieldName).subscribe(
      (res: ProductField) => {
        this.location = res;
      }, (err: BackenCommonErrorThrow) => {
        this.errorHandleService.showError(err.error!);
      });
  }

  private getOrganizationList(fieldName: string) {
    this.productFieldService.getProductFieldByName(fieldName).subscribe(
      (res: ProductField) => {
        this.organization = res;
      }, (err: BackenCommonErrorThrow) => {
        this.errorHandleService.showError(err.error!);
      });
  }
  private getDeptcodeList(fieldName: string) {
    this.productFieldService.getProductFieldByName(fieldName).subscribe(
      (res: ProductField) => {
        this.deptCode = res;
      }, (err: BackenCommonErrorThrow) => {
        this.errorHandleService.showError(err.error!);
      });
  }
}

