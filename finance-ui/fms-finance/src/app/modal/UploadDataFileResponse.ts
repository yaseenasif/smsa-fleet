export interface UploadDataFileResponse {
    status: boolean;
    message: string[];
    byteArrayResource: Blob; 
    excelStatus: boolean;
  }