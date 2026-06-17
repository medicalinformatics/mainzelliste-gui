import {Component, Input, OnChanges, OnInit, SimpleChange} from '@angular/core';
import {animate, style, transition, trigger} from "@angular/animations";
import { NgIf, NgStyle } from '@angular/common';
import { MatCard, MatCardTitleGroup, MatCardContent } from '@angular/material/card';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
    selector: 'app-message-card',
    templateUrl: './message-card.component.html',
    styleUrls: ['./message-card.component.css'],
    animations: [
        trigger('messageDialogTrigger', [
            transition(':enter', [
                style({ opacity: 0 }),
                animate('300ms', style({ opacity: 1 })),
            ]),
            transition(':leave', [
                animate('100ms', style({ opacity: 0 }))
            ])
        ])
    ],
    imports: [NgIf, MatCard, MatCardTitleGroup, MatIconButton, MatIcon, MatCardContent, NgStyle]
})
export class MessageCardComponent implements OnInit, OnChanges {

  @Input() message: string = "";
  @Input() type: 'warn' | 'error' = 'error';

  showMessage: boolean = false;

  constructor() {
  }

  ngOnInit(): void {}

  public closeMessage() {
    this.showMessage = false;
  }

  ngOnChanges(changes: { [property: string]: SimpleChange }) {
    if(changes['message']) {
      this.showMessage = changes['message'].currentValue.length > 0
    }
  }
}
