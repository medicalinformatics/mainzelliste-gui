import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from "@angular/router";
import { NgIf, NgFor, NgStyle } from '@angular/common';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatDialogContent } from '@angular/material/dialog';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-error-card',
    templateUrl: './error-card.component.html',
    styleUrls: ['./error-card.component.css'],
    imports: [NgIf, CdkScrollable, MatDialogContent, NgFor, NgStyle, MatIconButton, MatIcon, TranslatePipe]
})
export class ErrorCardComponent implements OnInit {

  @Input() messages: string[] = [];
  @Output() messagesChange = new EventEmitter<string[]>();
  widthPageMap: Map<string,string> = new Map([
    ["add-new-patient", "41%"],
    ["edit-patient", "92%"],
    ["idcard", "94%"],
  ]);

  constructor(
    private router: Router) {
  }

  ngOnInit(): void {
  }

  public getWidth(): string {
    let urlSegment = this.router.url.split('/');
    return urlSegment.length < 2 ? "100%" : this.widthPageMap.get(urlSegment[1]) ?? "100%";
  }

  closeError(message: string) {
    let index: number = this.messages.indexOf(message);
    if (index > -1)
      this.messages.splice(index, 1);
    else
      console.error("message '" + message + "'not found in error array");
  }
}
