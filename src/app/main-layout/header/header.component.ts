import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-head',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  pic1: string = "assets/images/magicPL-Logo.png";
  pic2: string = "assets/images/magicPL-Logo-Transparent.png";
  constructor() { }

  ngOnInit(): void {
  }

}
