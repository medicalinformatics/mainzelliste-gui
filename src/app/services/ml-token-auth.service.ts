import {Injectable} from '@angular/core';
import {SessionService} from "./session.service";
import {firstValueFrom, Observable, of, switchMap, tap, throwError} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {getErrorMessageFrom} from "../error/error-utils";
import {TranslateService} from "@ngx-translate/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AppConfigService} from "../app-config.service";
import {Permission} from "../model/permission";
import {Token, TokenType} from "../model/token";

@Injectable({
  providedIn: 'root'
})
export class MlTokenAuthService {

  private isTokenAuthentification: boolean = false;
  private readonly allowedPermissions: Permission[] = [];
  public tokenIds: Map<TokenType, string> = new Map<TokenType, string>();

  constructor(
    private readonly sessionService: SessionService,
    private readonly translate: TranslateService,
    private readonly httpClient: HttpClient,
    private readonly appConfigService: AppConfigService
  ) { }

  init(sessionId: string, tokenId: string){
    return this.validateTokenAndSession(sessionId, tokenId);
  }

  public isAuthenticated(): boolean {
    return this.isTokenAuthentification;
  }

  public getTokenId(type: TokenType){
    return this.isTokenAuthentification? this.tokenIds.get(type) : undefined;
  }

  private validateTokenAndSession(sessionId: string, tokenId: string) {
    return firstValueFrom(of(tokenId.length != 0 && sessionId.length != 0).pipe(
      switchMap(v => v ? this.sessionService.isSessionIdValid(sessionId) : of(false)),
      switchMap(v => v ? this.validateToken(sessionId, tokenId) : of(false)),
      tap(v => this.isTokenAuthentification = v)
    ));
  }

  private validateToken(sessionId: string, tokenId: string): Observable<boolean> {
    return this.httpClient.get<Token>(
      `${this.appConfigService.getMainzellisteUrl()}/sessions/${sessionId}/tokens/${tokenId}`,
      {headers: new HttpHeaders().set('mainzellisteApiVersion', '3.2')})
    .pipe(
      map((t) => {
        if(t.type == 'addPatient'){
          this.allowedPermissions.push(Permission.CREATE_PATIENT);
          this.tokenIds.set('addPatient', tokenId);
        }
        return true;
      }),
      catchError((error) => MlTokenAuthService.handleFailedRequest(this.translate.instant('error.session_service_is_session_valid'), error))
    );
  }

  private static handleFailedRequest(errorMessage: string, error?: any) {
    if (error.status == 404)
      return of(false)
    else
      throw throwError( () => new Error(`${errorMessage}` + SessionService.translate.instant('error.session_service_handle_failed_request') + `${getErrorMessageFrom(error, SessionService.translate)}`));
  }

  public hasPermission(permission: Permission): boolean {
    return this.hasAnyPermissions([permission]);
  }

  public hasAnyPermissions(permissions: Permission[]): boolean {
    return this.allowedPermissions.some( p => permissions.includes(p));
  }
}
