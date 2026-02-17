import {Component, OnInit} from '@angular/core';
import {GlobalTitleService} from "../services/global-title.service";
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-page-not-found',
    templateUrl: './page-not-found.component.html',
    styleUrls: ['./page-not-found.component.css'],
    imports: [TranslatePipe]
})
export class PageNotFoundComponent implements OnInit{

  constructor(
    private titleService: GlobalTitleService
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle("", true);
  }
}
