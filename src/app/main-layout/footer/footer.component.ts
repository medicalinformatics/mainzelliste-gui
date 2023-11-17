import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  magicLogo: string = "assets/images/magic-logo.png";
  dkfzLogo: string = "assets/images/dkfzLogo-small.png";
  ummLogo: string = "assets/images/umm-logo.png";
  medmaLogo: string = "assets/images/medma-logo.png";
  constructor() { }

  ngOnInit(): void {
  }

}
