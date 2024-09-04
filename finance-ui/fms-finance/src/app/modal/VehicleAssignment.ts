export interface VehicleAssignment {
    id: Number | null | undefined
    assignToEmpName: String | null | undefined
    assignToEmpId: {
      id: number | null | undefined;
      empName: string | null | undefined;
      employeeNumber: number | null | undefined;
      budgetRef: string | null | undefined;
      gender: string | null | undefined;
      maritalStatus: string | null | undefined;
      dateOfBirth: Date | null | undefined;
      joiningDate: Date | null | undefined;
      jobTitle: string | null | undefined;
      status: string | null | undefined;
      region: string | null | undefined;
      organization: string | null | undefined;
      division: string | null | undefined;
      deptCode: string | null | undefined;
      department: string | null | undefined;
      contactNumber: string | null | undefined;
      section: string | null | undefined;
      nationalIdNumber: number | null | undefined;
      svEmployeeNumber: string | null | undefined;
      svEmployeeName: string | null | undefined;
      location: string | null | undefined;
      country: string | null | undefined;
      nationality: string | null | undefined;
      companyEmailAddress: string | null | undefined;
      grade: string | null | undefined;
      licenseNumber: String | null | undefined
      vehicleBudget: Number | null | undefined
      costCentre: String | null | undefined;
    }
    vehicle: {
      id: Number | null | undefined,
      processOrderNumber: Number | null | undefined
      plateNumber: string | null | undefined
      make: String | null | undefined
      year: String | null | undefined
      design: String | null | undefined
      model: String | null | undefined
      type: String | null | undefined
      capacity: String | null | undefined
      power: String | null | undefined
      registrationExpiry: String | null | undefined | Date
      fuelType: String | null | undefined
      vendor: {
        id: Number | null | undefined
        vendorName: String | null | undefined
        officeLocation: String | null | undefined
        attachments: String | null | undefined
      }
      insuranceExpiry: String | null | undefined | Date
      leaseCost: Number | null | undefined
      leaseStartDate: String | null | undefined | Date
      leaseExpiryDate: String | null | undefined | Date
      usageType: String | null | undefined
      category: String | null | undefined
      replacementDate: Date | null | undefined
      replaceLeaseCost: Number | null | undefined
      vehicleStatus: String | null | undefined
    }
  
  }
  