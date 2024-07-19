import { animate, state, style, transition, trigger } from "@angular/animations";
import { ChangeDetectorRef, Component, HostBinding, Input, OnDestroy, OnInit } from "@angular/core";
import { filter, Subscription } from "rxjs";
import { LayoutService } from "../service/layout.service";
import { NavigationEnd, Router } from "@angular/router";
import { MenuService } from "./menu-service";

@Component({
  selector: "[app-menuitem]",
  template: '',
})

export class AppMenuitemComponent implements OnInit, OnDestroy{



  constructor() {}


  ngOnDestroy(): void {

  }
  ngOnInit(): void {
  }


}
