import {AuthGuardData, createAuthGuard} from 'keycloak-angular';
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

const isAccessAllowed = async (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  authData: AuthGuardData
): Promise<boolean | UrlTree> => {
  const { authenticated, grantedRoles } = authData;

  const router = inject(Router);
  const userAuthService = inject(UserAuthService);
  return userAuthService.login(authenticated, state.url).then() || router.createUrlTree(['access-denied']);
};

export const canActivateAuthRole = createAuthGuard<CanActivateFn>(isAccessAllowed);

const checkTenantIdType = (
  authorizationService: AuthorizationService,
  router: Router,
  urlSegments: UrlSegment[]
): boolean | UrlTree => {
  return urlSegments == undefined || urlSegments.length < 2
    || authorizationService.getAllowedUniqueIdTypes('R', false).includes(urlSegments[1].path)
    || router.createUrlTree(['access-denied']);
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
