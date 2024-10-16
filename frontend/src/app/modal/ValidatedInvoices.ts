import { VehicleAssignment } from "./vehicle-assignment";

export interface ValidatedInvoices {
   [invoiceId: number]: VehicleAssignment | null;
}
