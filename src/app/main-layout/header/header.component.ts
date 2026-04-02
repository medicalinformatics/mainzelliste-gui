import { Component, OnInit } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { UserMenuComponent } from '../user-menu/user-menu.component';
import {MlTokenAuthService} from "../../services/ml-token-auth.service";
import {NgIf} from "@angular/common";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css'],
  imports: [MatToolbar, RouterLink, UserMenuComponent, NgIf]
})
export class HeaderComponent implements OnInit {

  constructor(
    protected readonly mlTokenAuthService: MlTokenAuthService
  ) { }

  ngOnInit(): void {
  }

}
