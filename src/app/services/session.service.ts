import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, Observable, of, throwError} from 'rxjs';
import {Session} from '../model/session';
import {Token, TokenType} from '../model/token';
import {TokenData} from '../model/token-data';
import {AppConfigService} from "../app-config.service";
import {catchError, map} from "rxjs/operators";
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

  login () {
    return this.createSession().pipe(
      map(session => {
        localStorage.setItem("mainzellisteSession", JSON.stringify(session));
        this.sessionSubject.next(session);
        return session;
      })
    )
  }

  logout () {
    localStorage.removeItem("mainzellisteSession");
    let oldSessionId = this.sessionSubject.value.sessionId;
    this.sessionSubject.next(new Session());
    this.httpClient.delete<Session>(
      this.appConfigService.data[0].url + '/sessions/' + oldSessionId)
    .pipe(map(() => true),
      catchError( (error) => {
        console.log("can't delete session id " + error.status);
        if (error.status == 404)
          return of(false)
        else
          throw new Error("Mainzelliste Intenal System Error : " + error.message);
      })
    );
  }

  public isSessionValid(): Observable<boolean> {
    if (this.sessionSubject.value.sessionId == undefined) {
      return of(false);
    }
    return this.httpClient.get<Session>(
      this.appConfigService.data[0].url + '/sessions/' + this.sessionSubject.value.sessionId)
    .pipe(map(() => {
        return true;
      }), catchError( (error) => {
        // invalid session id
        if (error.status == 404)
          return of(false)
        else
          throw new Error("Mainzelliste Intenal System Error: - status [" + error.status
            + "] - message [" + error.message + "]");
      })
    );
  }

  public isLoggedIn(): boolean {
    return this.sessionValue.sessionId !== undefined;
  }
  /**
   * Create a new session, that allows us to create Tokens
   */
  private createSession(): Observable<Session> {
    return this.httpClient.post<Session>(this.appConfigService.data[0].url + '/sessions', {}, {
      headers: new HttpHeaders().append('mainzellisteApiVersion', '3.2')
    });
  }

  /**
   * Create a request for generating a token for a given session
   * @param tokenType
   * @param tokenData
   */
  createToken(tokenType: TokenType, tokenData: TokenData): Observable<Token> {
    return this.httpClient.post<Token>(this.appConfigService.data[0].url + '/sessions/'
      + this.sessionValue.sessionId + '/tokens', {
      type: tokenType,
      data: tokenData
    }, {
      headers: new HttpHeaders().append('mainzellisteApiVersion', '3.2')
    });
  }

}
