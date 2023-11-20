export interface VehicleAssignment {
    id: Number | null | undefined
    design: String | null | undefined
    make: String | null | undefined
    assignToEmpName: String | null | undefined
    model: String | null | undefined
    year: String | null | undefined
    leaseExpiry: String | null | undefined
    leaseCost: Number | null | undefined
    plateNumber: String | null | undefined
    attachments: String | null | undefined
    assignToEmpId: {
        id: number | null | undefined;
        employeeNumber: number | null | undefined;
        budgetRef: string | null | undefined;
        empName: string | null | undefined;
        gender: string | null | undefined;
        maritalStatus: string | null | undefined;
        dateOfBirth: Date | null | undefined;
        joiningDate: Date | null | undefined;
        jobTitle: string | null | undefined;
        status: string | null | undefined;
        region: string | null | undefined;
        location: string | null | undefined;
        organization: string | null | undefined;
        division: string | null | undefined;
        deptCode: string | null | undefined;
        department: string | null | undefined;
        contactNumber: string | null | undefined;
        section: string | null | undefined;
        iqamaNumber: string | null | undefined;
        svEmployeeNumber: string | null | undefined;
        svEmployeeName: string | null | undefined;
        city: string | null | undefined;
        age: number | null | undefined;
        portOfDestination: string | null | undefined;
        nationality: string | null | undefined;
        companyEmailAddress: string | null | undefined;
        grade: string | null | undefined;
        licenseNumber: String | null | undefined
        vehicleBudget: Number | null | undefined
    }
    vehicle: {
        id: Number | null | undefined,
        processOrderNumber: Number | null | undefined
        plateNumber: String | null | undefined
        make: String | null | undefined
        year: String | null | undefined
        design: String | null | undefined
        model: String | null | undefined
        type: String | null | undefined
        capacity: String | null | undefined
        power: String | null | undefined
        registrationExpiry: String | null | undefined
        fuelType: String | null | undefined
        vendor: {
            id: Number| null | undefined
            vendorName: String| null | undefined
            officeLocation: String | null | undefined
            attachments: String | null | undefined
            }
        insuranceExpiry: String | null | undefined
        leaseCost: Number | null | undefined
        leaseStartDate: String | null | undefined
        leaseExpiryDate: String | null | undefined
        usageType: String | null | undefined
        attachments: String | null | undefined
    }

}