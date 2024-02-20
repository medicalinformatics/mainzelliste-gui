import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorNotificationService {
  public messages: string[] = [];

  constructor() {
  }

  addMessage(message: string, clean?: boolean): void {
    if(clean != undefined && clean)
      this.messages = [];
    this.messages.push(message);
  }

  clearMessages() {
    this.messages = []
  }
}
