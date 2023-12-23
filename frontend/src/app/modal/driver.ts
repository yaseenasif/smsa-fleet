export interface Driver {
    id: Number | null | undefined 
    empId: {
        id: Number | null | undefined,
        employeeNumber: Number | null | undefined
        empName: String | null | undefined
        jobTitle: String | null | undefined
        joiningDate: Date | null | undefined
        department: String | null | undefined
        section: String | null | undefined
        region: String | null | undefined
        city: String | null | undefined
        nationality: String | null | undefined
        contactNumber: String | null | undefined
        companyEmailAddress: String | null | undefined
        grade: String | null | undefined
        licenseNumber: String | null | undefined 
        vehicleBudget: number | null | undefined |any
        costCenter: string | null | undefined ;

    }
    licenseNumber: String | null | undefined 
    vehicleBudget: String | null | undefined
    costCentre: String | null | undefined
}