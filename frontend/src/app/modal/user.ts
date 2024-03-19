export interface User {

    id: number | null | undefined,
    name: string | null | undefined,
    email: string | null | undefined,
    password: string | null | undefined,
    employeeId: string | null | undefined,
    roles: Array<{
      id: number | null | undefined
      name: string | null | undefined
      permissions: Array<{
        id: number | null | undefined
        name: string | null | undefined
      }>
    }>

}
