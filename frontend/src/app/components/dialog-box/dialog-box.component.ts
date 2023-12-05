import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-dialog-box',
  templateUrl: './dialog-box.component.html',
  styleUrls: ['./dialog-box.component.scss']
})
export class DialogBoxComponent{

  
  @Input() visible!: boolean;
  @Output() dialogClosed: EventEmitter<void> = new EventEmitter<void>();
  @Input() regionCount: any;
  @Input() vendorCount: any;
  @Input() modelId!: any;


  closeModal() {
    this.visible = false;
    this.dialogClosed.emit(); 
  }

}
