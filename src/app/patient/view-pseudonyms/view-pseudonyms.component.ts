import { Component,Input,  OnInit } from '@angular/core';
import { Id } from 'src/app/model/id';
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-view-pseudonyms',
  templateUrl: './view-pseudonyms.component.html',
  imports: [
    NgForOf
  ],
  styleUrls: ['./view-pseudonyms.component.css']
})
export class ViewPseudonymsComponent implements OnInit {
  @Input() ids: Id[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  protected readonly NgForOf = NgForOf;
}
