export interface Driver {
    id: Number | null | undefined
    empId: {
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
        location: string | null | undefined;
        organization: string | null | undefined;
        division: string | null | undefined;
        deptCode: string | null | undefined;
        department: string | null | undefined;
        contactNumber: string | null | undefined;
        section: string | null | undefined;
        nationalIdNumber: number | null | undefined;
        svEmployeeNumber: string | null | undefined;
        svEmployeeName: string | null | undefined;
        city: string | null | undefined;
        age: number | null | undefined;
        nationality: string | null | undefined;
        companyEmailAddress: string | null | undefined;
        grade: string | null | undefined;
        licenseNumber: String | null | undefined
        vehicleBudget: Number | null | undefined
        costCentre: String | null | undefined;

    }
    licenseNumber: String | null | undefined
    vehicleBudget: String | null | undefined
    costCentre: String | null | undefined
}
