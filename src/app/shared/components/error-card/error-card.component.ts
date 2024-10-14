import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-error-card',
  templateUrl: './error-card.component.html',
  styleUrls: ['./error-card.component.css']
})
export class ErrorCardComponent implements OnInit {

  @Input() messages: string[] = [];
  @Output() messagesChange = new EventEmitter<string[]>();

  constructor() {
  }

  ngOnInit(): void {
  }

  closeError(message: string) {
    let index: number = this.messages.indexOf(message);
    if (index > -1)
      this.messages.splice(index, 1);
    else
      console.error("message '" + message + "'not found in error array");
  }
}
