import {Component, OnInit} from '@angular/core';
import {GlobalTitleService} from "../services/global-title.service";

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.css']
})
export class PageNotFoundComponent implements OnInit{

  constructor(
    private titleService: GlobalTitleService
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle("", true);
  }
}
