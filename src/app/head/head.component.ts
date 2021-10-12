import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-head',
  templateUrl: './head.component.html',
  styleUrls: ['./head.component.css']
})
export class HeadComponent implements OnInit {

  pic1: string = "assets/images/magicPL-Logo.png";
  pic2: string = "assets/images/magicPL-Logo-Transparent.png";
  constructor() { }

  ngOnInit(): void {
  }

}
