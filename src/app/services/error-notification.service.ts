import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorNotificationService {
  public messages: string[] = [];
  public display: boolean = false;

  constructor() {
  }

  addMessage(message: string, clean?: boolean): void {
    if(clean != undefined && clean)
      this.messages = [];
    this.messages.push(message);
    this.display = true;
  }

  removeMessage(message: string): void {
    let index:number = this.messages.indexOf(message);
    if(index > -1)
      this.messages.splice(index, 1);
    else
      console.error("message '" + message + "'not found in error array");
    if(this.messages.length == 0)
      this.display = false
  }

  clearMessages() {
    this.messages = []
    this.display = false
  }
}
