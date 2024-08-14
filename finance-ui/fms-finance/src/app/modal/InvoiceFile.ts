import { User } from "./User";

export interface InvoiceFile{
    id: number | null | undefined
    filename: string | null | undefined
    invoiceType: string | null | undefined
    invoiceMonth: Date | null | undefined
    createdAt: Date | null | undefined
    createdBy: User | null | undefined
}