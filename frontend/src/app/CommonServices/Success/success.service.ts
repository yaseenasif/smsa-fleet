import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class SuccessService {

  constructor(
    private messageService: MessageService,
  ) { }

  showSuccess(successMsg: string) {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: `${successMsg}` });
  }
}
