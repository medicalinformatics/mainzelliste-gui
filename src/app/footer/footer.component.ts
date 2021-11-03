import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  pic1: string = "assets/images/magicPL-Logo.png";
  magicLogo: string = "assets/images/magicPL-Logo-Transparent.png";
  dkfzLogo: string = "assets/images/dkfzLogo.png";
  constructor() { }

  ngOnInit(): void {
  }

}
