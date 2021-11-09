import {Injectable} from '@angular/core';
import {User} from "../model/user";
import {HttpClient} from "@angular/common/http";
import {ConfigurationService} from "./configuration.service";

/** represents a mainzelliste session response */
export interface Session {
  sessionId: string,
  uri: URL
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public user: User = new User();

  constructor(
    private httpClient: HttpClient,
    private configService: ConfigurationService
  ) {
  }

  isLoggedIn(): boolean {
    console.log("This is users session: " + this.user.session);
    return this.user.session != undefined;
  }

  getSession(): Promise<Session> {
    return this.httpClient
    .post<Session>(
      this.configService.selectedPatientList.url.toString() + "/sessions",
      {},
      {headers: {"mainzellisteApiKey": this.configService.selectedPatientList.apiKey}})
    .toPromise()
  }

}
