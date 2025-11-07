import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FooterComponent} from "./footer/footer.component";
import {SharedModule} from "../shared/shared.module";
import {UserMenuComponent} from "./user-menu/user-menu.component";
import {MatMenuModule} from "@angular/material/menu";
import {HeaderComponent} from "./header/header.component";
import {MatToolbarModule} from "@angular/material/toolbar";
import {RouterModule} from "@angular/router";
import {NavigationComponent} from "./navigation/navigation.component";
import {MatDividerModule} from "@angular/material/divider";

@NgModule({
  imports: [
    CommonModule, SharedModule, MatMenuModule, MatToolbarModule, RouterModule, MatDividerModule
  ],
  declarations: [HeaderComponent, FooterComponent, NavigationComponent, UserMenuComponent],
  exports: [HeaderComponent, FooterComponent, NavigationComponent, UserMenuComponent]
})
export class MainLayoutModule { }
