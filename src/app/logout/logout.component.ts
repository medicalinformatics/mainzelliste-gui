import { Component, OnInit } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-logout',
    templateUrl: './logout.component.html',
    styleUrls: ['./logout.component.css'],
    imports: [TranslatePipe]
})
export class LogoutComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
