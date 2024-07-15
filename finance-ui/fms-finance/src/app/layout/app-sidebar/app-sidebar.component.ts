import { Component, ElementRef } from '@angular/core';
import { LayoutService } from '../service/layout.service';

@Component({
  selector: 'app-app-sidebar',
  templateUrl: './app-sidebar.component.html',
  styleUrl: './app-sidebar.component.scss'
})
export class AppSidebarComponent {

  constructor( public layoutService: LayoutService, public el: ElementRef ) {}

}
