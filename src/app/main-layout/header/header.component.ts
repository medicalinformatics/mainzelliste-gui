import { Component, OnInit } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { UserMenuComponent } from '../user-menu/user-menu.component';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css'],
    imports: [MatToolbar, RouterLink, UserMenuComponent]
})
export class HeaderComponent implements OnInit {

  pic1: string = "assets/images/magicPL-Logo.png";
  pic2: string = "assets/images/magicPL-Logo-Transparent.png";
  constructor() { }

  ngOnInit(): void {
  }

}
