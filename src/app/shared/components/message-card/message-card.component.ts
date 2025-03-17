import {Component, Input, OnChanges, OnInit, SimpleChange} from '@angular/core';
import {animate, style, transition, trigger} from "@angular/animations";

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
  ]
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
      if (changes['message'].currentValue.length > 0) {
        console.log("message changed ")
        this.showMessage = true;
      } else {
        console.log("message changed with empty")
        this.showMessage = false;
      }
    }
  }
}
