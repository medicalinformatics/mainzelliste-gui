import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: '[app-patientenzeile]',
  templateUrl: './patientenzeile.component.html',
  styleUrls: ['./patientenzeile.component.css']
})
export class PatientenzeileComponent implements OnInit {
  @Input() patient: any;
  show = true;
 /* @Input() character: any;
  @Input() columns: string[] | undefined;
*/
  constructor() {

  }

  ngOnInit(): void {
  }

  editPatientenZeile() {

  }
}
