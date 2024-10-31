import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, Observable, of, throwError} from 'rxjs';
import {Session} from '../model/session';
import {Token, TokenType} from '../model/token';
import {TokenData} from '../model/token-data';
import {AppConfigService} from "../app-config.service";
import {catchError, map, mergeMap} from "rxjs/operators";
import {getErrorMessageFrom} from "../error/error-utils";
import {TranslateService} from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  readonly LS_SESSION_ITEM: string = "mainzellisteSession"
  private sessionSubject: BehaviorSubject<Session>;
  static translate: TranslateService;

  constructor(
    translate: TranslateService,
    private httpClient: HttpClient,
    private appConfigService: AppConfigService
  ) {
    SessionService.translate = translate;
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
      catchError((error) => SessionService.handleFailedRequest(SessionService.translate.instant('error.session_service_create_session'), error))
    )
  }

  createSessionIfNotValid(): Observable<boolean> {
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
      catchError((error) => SessionService.handleFailedRequest(SessionService.translate.instant('error.session_service_delete_session'), error))
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
      catchError((error) => SessionService.handleFailedRequest(SessionService.translate.instant('error.session_service_is_session_valid'), error))
    );
  }

  private static handleFailedRequest(errorMessage: string, error?: any) {
    if (error.status == 404)
      return of(false)
    else
      throw throwError(new Error(`${errorMessage}` + SessionService.translate.instant('error.session_service_handle_failed_request') + `${getErrorMessageFrom(error, SessionService.translate)}`));
  }

  public isSessionCreated(): boolean {
    return this.sessionId !== undefined;
  }

  /**
   * Create a request for generating a token for a given session
   * @param tokenType
   * @param tokenData
   * @param allowedUses
   */
  createToken(tokenType: TokenType, tokenData: TokenData, allowedUses? :number): Observable<Token> {
    return this.createSessionIfNotValid().pipe(
      mergeMap(r => this.httpClient.post<Token>(this.appConfigService.data[0].url + '/sessions/'
        + this.sessionId + '/tokens', {
        type: tokenType,
        allowedUses: allowedUses ?? 1,
        data: tokenData
      }, {
        headers: new HttpHeaders().append('mainzellisteApiVersion', '3.2')
      }))
    )
  }
}
