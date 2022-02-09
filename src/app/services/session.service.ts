import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {Session} from '../model/session';
import {Token, TokenType} from '../model/token';
import {TokenData} from '../model/token-data';
import {AppConfigService} from "../app-config.service";
import {map} from "rxjs/operators";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private sessionSubject: BehaviorSubject<Session>;
  public session: Observable<Session>;

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private appConfigService: AppConfigService
  ) {
    const cachedSession = localStorage.getItem("mainzellisteSession")
    if (cachedSession !== null) {
      this.sessionSubject = new BehaviorSubject<Session>(JSON.parse(cachedSession));
    } else {
      this.sessionSubject = new BehaviorSubject<Session>(new Session());
    }
    this.session = this.sessionSubject.asObservable()
  }

  public get sessionValue(): Session {
    return this.sessionSubject.value
  }

  login (apiKey: string) {
    return this.createSession(apiKey).pipe(
      map(session => {
        // TODO: It doesn't seem to be a good idea to save the apiKey inside the browser session.
        session.apiKey = window.btoa(apiKey);
        localStorage.setItem("mainzellisteSession", JSON.stringify(session));
        this.sessionSubject.next(session);
        return session;
      })
    )
  }

  logout () {
    localStorage.removeItem("mainzellisteSession");
    this.sessionSubject.next(new Session());
    // TODO: Implement Logout Page
    this.router.navigate(['logout'])
  }

  /**
   * Create a new session, that allows us to create Tokens
   * @param apiKey, the apiKey to identify the rights a user has
   */
  private createSession(apiKey: string): Observable<Session> {
    return this.httpClient.post<Session>(this.appConfigService.data[0].url + '/sessions', {}, {
      headers: new HttpHeaders()
      .append('mainzellisteApiKey', apiKey)
      .append('mainzellisteApiVersion', '3.2')
    });
  }

  /**
   * Create a request for generating a token for a given session
   * @param session
   * @param tokenType
   * @param tokenData
   */
  createToken(tokenType: TokenType, tokenData: TokenData): Observable<Token> {
    return this.httpClient.post<Token>(this.appConfigService.data[0].url + '/sessions/' + this.sessionValue.sessionId + '/tokens', {
      type: tokenType,
      data: tokenData
    }, {
      headers: new HttpHeaders()
      .append('mainzellisteApiKey', window.atob(this.sessionValue.apiKey))
      .append('mainzellisteApiVersion', '3.2')
    });
  }

}
