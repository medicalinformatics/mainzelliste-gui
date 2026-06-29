import Keycloak from 'keycloak-js';
import {
  ActivatedRouteSnapshot,
  CanActivateChildFn,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
  UrlSegment,
  UrlTree
} from '@angular/router';
import {inject} from '@angular/core';
import {AuthorizationService} from "../services/authorization.service";
import {UserAuthService} from "../services/user-auth.service";
import {MlTokenAuthService} from "../services/ml-token-auth.service";
import {AppConfigService} from "../app-config.service";


const isAccessAllowed = async (state: RouterStateSnapshot) => {
  const isAuthenticated: boolean = inject(Keycloak)?.authenticated ?? false;
  return await inject(UserAuthService).login(isAuthenticated, state.url);
}

export const canActivateAuthRole : CanActivateFn = (route, state) => {
    return inject(AppConfigService).isOAuthConfigured()
      && !inject(MlTokenAuthService).isAuthenticated()
      && isAccessAllowed(state)
      || inject(Router).createUrlTree(['access-denied']);
};

export const canActivateMlToken: CanActivateFn = (route, state) => {
  return inject(MlTokenAuthService).isAuthenticated()
    || inject(Router).createUrlTree(['auth-failed']);
};

const checkTenantIdType = (
  authorizationService: AuthorizationService,
  router: Router,
  urlSegments: UrlSegment[]
): boolean | UrlTree => {
  return urlSegments == undefined || urlSegments.length < 2
    || authorizationService.getAllowedUniqueIdTypes('R', false).includes(urlSegments[1].path)
    || tryToSwitchTenant(authorizationService, urlSegments[1].path)
    || router.createUrlTree(['access-denied']);
}

const tryToSwitchTenant = (
  authorizationService: AuthorizationService,
  idType: string
): boolean => {
  const newTenantId = authorizationService.getTenants()
  .find(t =>
    authorizationService.findAllowedIdTypesFor(t.id, 'R', false).includes(idType)
  )?.id;

  // switch tenant
  if(newTenantId != undefined)
    authorizationService.currentTenantId = newTenantId;

  return newTenantId != undefined;
}

export const canActivateChildAuthRole: CanActivateChildFn = (  childRoute: ActivatedRouteSnapshot,  state: RouterStateSnapshot,) => {
  let accessGranted = false;
  const router = inject(Router);
  const authorizationService = inject(AuthorizationService);
  if(childRoute.data.permission != undefined)
    accessGranted =  authorizationService.hasPermission(childRoute.data.permission);
  else if(childRoute.data.anyPermissions != undefined && childRoute.data.anyPermissions.length > 0)
    accessGranted =  authorizationService.hasAnyPermissions(childRoute.data.anyPermissions);
  if(!accessGranted)
    return router.createUrlTree(['access-denied']);

  return !childRoute.data.checkIdType || checkTenantIdType(authorizationService, router, childRoute.url);
};
