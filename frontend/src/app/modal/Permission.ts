export interface Permission {
  id: number | null | undefined;
  name: string | null | undefined;
  status: boolean | null | undefined;
  crud?: Crud;
}

export interface Crud {
  createPermission: boolean | null | undefined;
  readPermission: boolean | null | undefined;
  updatePermission: boolean | null | undefined;
  deletePermission: boolean | null | undefined;
  [key: string]: boolean | null | undefined;
}
export interface VehiclesPermission {
  Vehicles: Permission[];
}
