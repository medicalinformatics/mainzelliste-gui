import { Component,Input,  OnInit } from '@angular/core';
import { Id } from 'src/app/model/id';

@Component({
  selector: 'app-view-pseudonyms',
  templateUrl: './view-pseudonyms.component.html',
  styleUrls: ['./view-pseudonyms.component.css']
})
export class ViewPseudonymsComponent implements OnInit {
  @Input() ids: Id[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}