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
        id: Number | null | undefined;
        employeeNumber: Number | null | undefined;
        budgetRef: String | null | undefined;
        empName: String | null | undefined;
        gender: String | null | undefined;
        maritalStatus: String | null | undefined;
        dateOfBirth: Date | null | undefined;
        joiningDate: Date | null | undefined;
        jobTitle: String | null | undefined;
        status: String | null | undefined;
        region: String | null | undefined;
        location: String | null | undefined;
        organization: String | null | undefined;
        division: String | null | undefined;
        deptCode: String | null | undefined;
        department: String | null | undefined;
        contactNumber: String | null | undefined;
        section: String | null | undefined;
        iqamaNumber: String | null | undefined;
        svEmployeeNumber: String | null | undefined;
        svEmployeeName: String | null | undefined;
        city: String | null | undefined;
        age: number | null | undefined;
        portOfDestination: String | null | undefined;
        nationality: String | null | undefined;
        companyEmailAddress: String | null | undefined;
        grade: String | null | undefined;
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