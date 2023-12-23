export interface Driver {
    id: Number | null | undefined
    empId: {
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
        costCentre: String | null | undefined
    }
    licenseNumber: String | null | undefined
    vehicleBudget: String | null | undefined
    costCentre: String | null | undefined
}
