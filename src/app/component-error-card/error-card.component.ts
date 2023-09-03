import {Component, OnInit} from '@angular/core';
import {ErrorNotificationService} from "../services/error-notification.service";

@Component({
  selector: 'app-error-card',
  templateUrl: './error-card.component.html',
  styleUrls: ['./error-card.component.css']
})
export class ErrorCardComponent implements OnInit {

  constructor(public errorNotificationService: ErrorNotificationService) {
  }

  ngOnInit(): void {
  }

  closeError(message : string){
    this.errorNotificationService.removeMessage(message);
  }
}
