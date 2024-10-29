import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {IDGeneratorConfig} from "../model/id-generator-config";
import {catchError, mergeMap} from "rxjs/operators";
import {ErrorMessages} from "../error/error-messages";
import {Observable, throwError} from "rxjs";
import {MainzellisteError} from "../model/mainzelliste-error.model";
import {MainzellisteUnknownError} from "../model/mainzelliste-unknown-error";
import {SessionService} from "./session.service";
import {AppConfigService} from "../app-config.service";
import {TranslateService} from "@ngx-translate/core";
import {AuthorizationService} from "./authorization.service";

interface AppConfig {
  title?: string;
}

@Injectable({providedIn: 'root'})
export class ConfigurationService {

  data: AppConfig = {};

  constructor(
      private httpClient: HttpClient,
      private sessionService: SessionService,
      private appConfigService: AppConfigService,
      private authorizationService:AuthorizationService,
      private translate: TranslateService
  ) {
  }

  public createMainzellisteIdGenerator(idGeneratorConfig: IDGeneratorConfig) {
    return this.sessionService.createToken("editConfiguration", {})
    .pipe(
        mergeMap(token => this.resolveEditConfigurationToken(token.id,
          this.authorizationService.currentTenantId, idGeneratorConfig)),
        catchError(e => {
          // handle failed token creation
          if (e instanceof HttpErrorResponse && (e.status == 404) && ErrorMessages.ML_SESSION_NOT_FOUND.match(e))
            return throwError(new MainzellisteError(ErrorMessages.ML_SESSION_NOT_FOUND));
          else if (!(e instanceof MainzellisteError) && !(e instanceof MainzellisteUnknownError))
            return throwError(new MainzellisteUnknownError("failed to create editConfiguration token", e, this.translate));
          return throwError(e);
        }));
  }

  public resolveEditConfigurationToken(tokenId: string | undefined, tenantId:string, paylod: IDGeneratorConfig): Observable<any> {
    return this.httpClient.post(
        this.appConfigService.getMainzellisteUrl() + "/configuration/idGenerators?tokenId=" + tokenId + "&tenant=" + tenantId,
        paylod,
        {headers: new HttpHeaders().set('mainzellisteApiVersion', '3.2')}
    )
    .pipe(
        catchError((e) => throwError(new Error(""))),
    );
  }
}
