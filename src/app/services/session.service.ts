import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, Observable, of, throwError} from 'rxjs';
import {Session} from '../model/session';
import {Token, TokenType} from '../model/token';
import {TokenData} from '../model/token-data';
import {AppConfigService} from "../app-config.service";
import {catchError, map, mergeMap} from "rxjs/operators";
import {Router} from "@angular/router";
import {getErrorMessageFrom} from "../error/error-utils";

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  readonly LS_SESSION_ITEM: string = "mainzellisteSession"
  private sessionSubject: BehaviorSubject<Session>;

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private appConfigService: AppConfigService
  ) {
    const cachedSession = localStorage.getItem(this.LS_SESSION_ITEM)
    this.sessionSubject = new BehaviorSubject<Session>(cachedSession !== null ? JSON.parse(cachedSession) : new Session());
  }

  public get sessionId(): string | undefined {
    return this.sessionSubject.value.sessionId
  }

  createSession() {
    return this.httpClient.post<Session>(this.appConfigService.data[0].url + '/sessions', {}, {
      headers: new HttpHeaders().append('mainzellisteApiVersion', '3.2')
    })
    .pipe(
      map(session => {
        localStorage.setItem(this.LS_SESSION_ITEM, JSON.stringify(session));
        this.sessionSubject.next(session);
        return session;
      }),
      catchError((error) => SessionService.handleFailedRequest("Failed to create a mainzelliste session", error))
    )
  }

  createSessionIfNotValid(): Observable<boolean> {
    console.log("createSessionIfNotValid")
    return this.isSessionValid().pipe(
      mergeMap((isValid) => isValid ?
        of(true) : this.createSession().pipe(map(() => true))
      ))
  }

  deleteSession(): Observable<boolean> {
    localStorage.removeItem(this.LS_SESSION_ITEM);
    let oldSessionId = this.sessionId;
    this.sessionSubject.next(new Session());

    if (oldSessionId == undefined)
      return of(true);

    return this.httpClient.delete<Session>(
      this.appConfigService.data[0].url + '/sessions/' + oldSessionId)
    .pipe(
      map(() => true),
      catchError((error) => SessionService.handleFailedRequest("Failed to delete a mainzelliste session", error))
    );
  }

  public isSessionValid(): Observable<boolean> {
    if (!this.isSessionCreated()) {
      return of(false);
    }
    return this.httpClient.get<Session>(
      this.appConfigService.data[0].url + '/sessions/' + this.sessionId)
    .pipe(
      map(() => true),
      catchError((error) => SessionService.handleFailedRequest("Failed to read a mainzelliste session", error))
    );
  }

  private static handleFailedRequest(errorMessage: string, error?: any) {
    if (error.status == 404)
      return of(false)
    else
      throw throwError(new Error(`${errorMessage}. Cause: ${getErrorMessageFrom(error)}`));
  }

  public isSessionCreated(): boolean {
    return this.sessionId !== undefined;
  }

  /**
   * Create a request for generating a token for a given session
   * @param tokenType
   * @param tokenData
   */
  createToken(tokenType: TokenType, tokenData: TokenData): Observable<Token> {
    return this.httpClient.post<Token>(this.appConfigService.data[0].url + '/sessions/'
      + this.sessionId + '/tokens', {
      type: tokenType,
      data: tokenData
    }, {
      headers: new HttpHeaders().append('mainzellisteApiVersion', '3.2')
    });
  }
}
