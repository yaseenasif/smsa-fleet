import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-assignment-list',
  templateUrl: './assignment-list.component.html',
  styleUrls: ['./assignment-list.component.scss']
})
export class AssignmentListComponent {
  constructor() { }
  products:any=[{name:"Demo",contactNumber:"Demo",referenceNumber:"Demo"},
  {name:"Demo",contactNumber:"Demo",referenceNumber:"Demo"},
  {name:"Demo",contactNumber:"Demo",referenceNumber:"Demo"},
  {name:"Demo",contactNumber:"Demo",referenceNumber:"Demo"},
  {name:"Demo",contactNumber:"Demo",referenceNumber:"Demo"},
  {name:"Demo",contactNumber:"Demo",referenceNumber:"Demo"},
  {name:"Demo",contactNumber:"Demo",referenceNumber:"Demo"},
  {name:"Demo",contactNumber:"Demo",referenceNumber:"Demo"},
  {name:"Demo",contactNumber:"Demo",referenceNumber:"Demo"},
  {name:"Demo",contactNumber:"Demo",referenceNumber:"Demo"},];
  items: MenuItem[] | undefined;

 

  ngOnInit() {
      this.items = [{ label: 'Assignment'}];
  }
}
