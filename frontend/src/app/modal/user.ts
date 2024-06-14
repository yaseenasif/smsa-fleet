import { Region } from "./Region"

export interface User {

    id: number | null | undefined,
    name: string | null | undefined,
    email: string | null | undefined,
    password: string | null | undefined,
    employeeId: string | null | undefined,
    regions: Array<{
      id: number | null | undefined;
      name: string | null | undefined;
      country: string | null | undefined;
      cities: string | null | undefined| string[];
      status: boolean | null | undefined;
      [key: string]: any;
    }>,
    roles: Array<{
      id: number | null | undefined
      name: string | null | undefined
      permissions: Array<{
        id: number | null | undefined
        name: string | null | undefined
      }>
    }>

}
