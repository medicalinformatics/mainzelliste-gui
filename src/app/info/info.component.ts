import { Component, OnInit } from '@angular/core';
import {GlobalTitleService} from "../services/global-title.service";

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnInit {

  constructor(
    private titleService: GlobalTitleService
  ) {
    this.titleService.setTitle("Informationen und Hinweise zur Mainzelliste");
  }

  ngOnInit(): void {
  }

}
