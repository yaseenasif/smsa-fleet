import { VehicleAssignment } from "./VehicleAssignment";

export interface ValidatedInvoices {
   [invoiceId: number]: VehicleAssignment | null;
}
