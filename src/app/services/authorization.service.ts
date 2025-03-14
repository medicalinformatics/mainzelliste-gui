import {Injectable} from '@angular/core';
import {AppConfigService} from "../app-config.service";
import {UserAuthService} from "./user-auth.service";
import {TranslateService} from '@ngx-translate/core';
import {Operation, Tenant, TenantPermission} from "../model/tenant";
import {Permission} from "../model/permission";
import {ClaimPermissions} from "../model/api/configuration-claims-data";
import {IdType} from "../model/id-type";
import {AuthorizationState} from "../model/authorization-state";
import {LocalStorageService} from "./local-storage.service";

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {

  private readonly userRoles: string[] = [];
  private readonly configuredTenants: Tenant[];
  private readonly allowedUniqueIdTypes: Map<Operation, string[]> = new Map<Operation, string[]>();
  private readonly allowedExternalIdTypes: Map<Operation, string[]> = new Map<Operation, string[]>();
  private readonly allowedAssociatedIdTypes: Map<Operation, string[]> = new Map<Operation, string[]>();
  private readonly allowedAssociatedExternalIdTypes: Map<Operation, string[]> = new Map<Operation, string[]>();
  private readonly allowedAssociatedIdTypesMap: Map<string, IdType[]> = new Map<string, IdType[]>();
  private readonly allowedFieldNames: Map<Operation, string[]> = new Map<Operation, string[]>();
  public authorizationState :AuthorizationState = new AuthorizationState();

  constructor(
    private readonly translate: TranslateService,
    private readonly configService: AppConfigService,
    private readonly authentication: UserAuthService,
    private readonly localStorageService: LocalStorageService
  ) {
    this.userRoles = this.authentication.getRoles();
    this.configuredTenants = this.configService.getMainzellisteClaims()
        .filter(c => c.roles.some( r => this.userRoles.includes(r)))
        .map(e => {
          return new Tenant(e.permissions.tenant.id, e.permissions.tenant.name, e.roles,
            e.permissions.tenant?.idTypes || [],
            e.permissions.tenant?.consentTemplateIds || [],
            this.convertClaimPermissions(e.permissions))
        })
    if(this.currentTenantId.length == 0 || this.configuredTenants.every(t => t.id != this.currentTenantId)) {
      let uiTenants = this.getUITenants();
      this.currentTenantId = uiTenants.length > 0 ? uiTenants[0].id : "";
    } else {
      this.initUserAllowedAttributes();
      this.initAuthorizationState();
    }
  }

  public initUserAllowedIDTypes() {
    //init associatedId Map
    this.configService.getMainzellisteAssociatedIdGeneratorsMap().forEach((idGenerators, key) => {
      this.allowedAssociatedIdTypesMap.set(key, idGenerators.map(g => {
          return {
            name: g.idType,
            isExternal: g.isExternal,
            isAssociated: true,
            permissions: this.findOperations(g.idType, g.isExternal)
          }
        })
      )
    })

    // init internal id types permissions
    let internalIdTypeOperations: Operation[] = ["C", "R"];
    internalIdTypeOperations.forEach(o => {
      let allIdTypes = this.findAllowedIdTypes(o, false);
      this.allowedUniqueIdTypes.set(o, this.configService.getMainzellisteIdTypes().filter(t => allIdTypes.includes(t)))
      this.allowedAssociatedIdTypes.set(o, this.configService.getMainzellisteAssociatedIdGenerators()
      .filter(g => !g.isExternal && allIdTypes.includes(g.idType))
      .map(g => g.idType));
    });

    //put tenant Id types first
    let tenantIdTypes: string[] = this.configuredTenants.find(t => t.id == this.currentTenantId)?.idTypes || [];
    const operationList: Operation[] = ['C', 'U', 'R'];
    for (const operation of operationList) {
      let idTypes = this.allowedUniqueIdTypes.get(operation) || [];
      let newIdTypes = [];
      for (let i = 0; i < idTypes.length; i++) {
        if (tenantIdTypes.includes(idTypes[i]))
          newIdTypes.unshift(idTypes[i])
        else
          newIdTypes.push(idTypes[i])
      }
      this.allowedUniqueIdTypes.set(operation, newIdTypes);
    }

    // init external id types permissions
    let externalIdTypeOperations: Operation[] = ["C", "U", "R"];
    externalIdTypeOperations.forEach(o => {
      let allIdTypes = this.findAllowedIdTypes(o, true);
      this.allowedExternalIdTypes.set(o, this.configService.getMainzellisteIdTypes().filter(t => allIdTypes.includes(t)))
      this.allowedAssociatedExternalIdTypes.set(o, this.configService.getMainzellisteAssociatedIdGenerators()
      .filter(g => g.isExternal && allIdTypes.includes(g.idType))
      .map(g => g.idType));
    })
  }

  private initUserAllowedAttributes(){
    this.initUserAllowedIDTypes();
    // init fields permissions
    let fieldsOperations:Operation[] = ["C", "U", "R"];
    fieldsOperations.forEach( o => {
      let permittedFieldNames: string[] = this.configService.getMainzellisteClaims()
        .filter(c => c.permissions.tenant.id == this.currentTenantId)
        .filter(c => c.roles.some( r => this.userRoles.includes(r)))
        .map(c => c.permissions.resources.patient.resources.fields )
        .map(t => t.filter( i=> i.operations.includes(o)).map(i => i.name) || [])
        .reduce((accumulator, currentValue) => accumulator.concat(currentValue.filter(e => !accumulator.includes(e))), []);
      this.allowedFieldNames.set(o, !permittedFieldNames.some( t => t == "*") ? permittedFieldNames : this.configService.getMainzellisteFields());
    })
  }

  private initAuthorizationState(){
    let currentTenant: Tenant|undefined = this.configuredTenants.find( t => t.id == this.currentTenantId)
    if(currentTenant != undefined){
      currentTenant.permissions.forEach( permission => {
        if(permission.type == Tenant.DEFAULT_ID)
          this.authorizationState.DEFAULT = true;
        else if(permission.type == "patient")
          this.authorizationState.setPatient(permission.operations);
        else if(permission.type ==  "ids")
          this.authorizationState.setIds(permission.operations);
        else if(permission.type ==  "externalIds")
          this.authorizationState.setExternalIds(permission.operations);
        else if(permission.type ==  "fields")
          this.authorizationState.setFields(permission.operations);
        else if(permission.type ==  "consent")
          this.authorizationState.setConsent(permission.operations);
        else if(permission.type ==  "consentTemplate")
          this.authorizationState.setConsentTemplate(permission.operations);
      })
      this.authorizationState.setMiscellaneous(currentTenant.permissions
        .filter(p => p.type == "miscellaneous")
      );
    }
  }

  private convertClaimPermissions(claimPermissions: ClaimPermissions): TenantPermission[] {
    let permissions: TenantPermission[] = [];
    if (claimPermissions.resources.patient != undefined) {
      permissions.push({
        type: 'patient',
        operations: claimPermissions.resources.patient.operations
      })
      // ids permissions
      permissions.push({
        type: 'ids',
        operations: this.filterOperations(claimPermissions.resources.patient.resources.ids || [])
      })
      // externalIds permissions
      permissions.push({
        type: 'externalIds',
        operations: this.filterOperations(claimPermissions.resources.patient.resources.externalIds || [])
      })
      // fields permissions
      permissions.push({
        type: 'fields',
        operations: this.filterOperations(claimPermissions.resources.patient.resources.fields || [])
      })
    }

    if (claimPermissions.resources.patient.resources.consent != undefined) {
      permissions.push({
        type: 'consent',
        operations: claimPermissions.resources.patient.resources.consent.operations
      })

      if (claimPermissions.resources.patient.resources.consent.resources.provision != undefined) {
        permissions.push({
          type: 'provision',
          operations: claimPermissions.resources.patient.resources.consent.resources.provision.operations
        })
      }
      if (claimPermissions.resources.patient.resources.consent.resources.scans != undefined) {
        permissions.push({
          type: 'scans',
          operations: claimPermissions.resources.patient.resources.consent.resources.scans.operations
        })
      }
    }

    if (claimPermissions.resources.consentTemplate != undefined) {
      permissions.push({
        type: 'consentTemplate',
        operations: claimPermissions.resources.consentTemplate.operations
      })
    }

    if(this.configService.isConfigurationEnabled() && claimPermissions.miscellaneous != undefined) {
      claimPermissions.miscellaneous.filter(m => Tenant.ESSENTIAL_MISCELLANEOUS_PERMISSIONS.includes(m) )
      .forEach( m => permissions.push({
        type: 'miscellaneous',
        operations: [],
        miscellaneous: m
      }))
    }
    return permissions;
  }

  public isCurrentTenantPermissionsEmpty() {
    return this.configService.getMainzellisteClaims()
    .filter(c => c.roles.some(r => this.userRoles.includes(r)) && c.permissions.tenant.id == this.currentTenantId)
    .map(c => c.permissions.resources)
    .every(r => r.patient == undefined && r.consentTemplate == undefined
        && r.policy == undefined && r.policySet == undefined)
  }

  private filterOperations(items: { operations: Operation[] }[]) {
    return items.map(i => i.operations)
      .reduce((accumulator, currentValue) =>
        accumulator.concat(currentValue.filter(o => !accumulator.includes(o))), []
      );
  }

  getTenants(): { id: string, name: string, idTypes: string[], permissions: TenantPermission[]}[] {
    return this.configuredTenants;
  }

  getUITenants(): Tenant[]{
    return this.configuredTenants.filter( t => t.permissions.some( p =>
        p.type == 'miscellaneous' && !Tenant.ESSENTIAL_MISCELLANEOUS_PERMISSIONS.includes(p.miscellaneous ?? 'createSession')
        || !['miscellaneous', 'default'].includes(p.type) && p.operations.length >1 ))
  }

  set currentTenantId(tenantId: string){
    this.localStorageService.tenantId = tenantId;
    this.initUserAllowedAttributes();
    this.initAuthorizationState();
  }

  get currentTenantId():string {
    return this.localStorageService.tenantId;
  }

  hasPermission(permission: Permission): boolean {
    return this.hasAnyPermissions([permission]);
  }

  hasAnyPermissions(permissions: Permission[]): boolean {
    // return true, if tenant not configured in the backend
    if (this.configuredTenants == undefined)
      return true;
    // return true, if permission contain DEFAULT
    if(permissions.some( p => p.type == "default"))
      return true
    //check permission
    let tenants: Tenant[] = this.configuredTenants.filter(c => c.id == this.currentTenantId)
      .filter(t => this.userRoles.some(r => t.roles.includes(r)))
    if (tenants.length == 0)
      throw new Error(this.translate.instant('error.authorization_service') + `${this.userRoles}`)
    return tenants.some(role => permissions.some( p => this.checkPermission(role.permissions, p)));
  }

  private checkPermission(permissions: TenantPermission[], permission: Permission): boolean {
    return (permissions || []).some(p => p.type == permission.type
      && (p.operations.includes(permission.operation)
        || p.type == "miscellaneous" && p.miscellaneous == permission.miscellaneous))
  }

  getAllAllowedUniqueIdTypes(operation: Operation): string[] {
    return this.getAllowedUniqueIdTypes(operation, false).concat(this.getAllowedUniqueIdTypes(operation, true));
  }

  getAllowedUniqueIdTypes(operation: Operation, isExternal: boolean): string[] {
    return (isExternal? this.allowedExternalIdTypes.get(operation) : this.allowedUniqueIdTypes.get(operation)) || [];
  }

  getAllowedAssociatedIdTypes(operation: Operation, isExternal: boolean): string[] {
    return (isExternal? this.allowedAssociatedExternalIdTypes.get(operation) : this.allowedAssociatedIdTypes.get(operation)) || [];
  }

  getRelatedAssociatedIdTypes(searchIdType: string, areExternal:boolean, operation: Operation): string[] {
    for (let [k, idTypes] of this.allowedAssociatedIdTypesMap)
      if (idTypes.some(idType => idType.name == searchIdType))
        return idTypes.filter(idType => idType.isExternal == areExternal && operation.includes(operation))
        .map(idType => idType.name)
    return [];
  }

  getAllowedFieldNames(operation: Operation): string[] {
    return this.allowedFieldNames.get(operation) || [];
  }

  getAllTenantIdTypes(skipCurrentTenant?:boolean){
    return  this.configService.getMainzellisteClaims()
    .filter(c => c.permissions.tenant.id != Tenant.DEFAULT_ID && (
      !skipCurrentTenant || c.permissions.tenant.id != this.currentTenantId))
    .filter(c => c.roles.some( r => this.userRoles.includes(r)))
    .map(c => {
      if(c.permissions.resources.patient.resources.ids.some( id => id.type == "*"))
        return c.permissions.tenant.idTypes;
      else
        return c.permissions.resources.patient.resources.ids.filter( id =>
          id.operations.includes('R') && c.permissions.tenant.idTypes.includes(id.type))
        .map(i => i.type) || []
    })
    .reduce((accumulator, currentValue) => accumulator.concat(currentValue.filter(e => !accumulator.includes(e))), []);
  }

  findAllowedIdTypes(operation: Operation, isExternal: boolean): string[] {
    let permittedIdTypes: string[] = this.configService.getMainzellisteClaims()
      .filter(c => c.permissions.tenant.id == this.currentTenantId)
      .filter(c => c.roles.some( r => this.userRoles.includes(r)))
      .map(c => c.permissions.resources.patient.resources )
      .map(r => isExternal? r.externalIds : r.ids )
      .map(t => t.filter( i=> i.operations.includes(operation)).map(i => i.type) || [])
      .reduce((accumulator, currentValue) => accumulator.concat(currentValue.filter(e => !accumulator.includes(e))), []);
    return !permittedIdTypes.some( t => t == "*") ? permittedIdTypes :
      [ ...this.configService.getMainzellisteIdGenerators(), ...this.configService.getMainzellisteAssociatedIdGenerators()]
      .filter(g => g.isExternal == isExternal)
      .map(g => g.idType);
  }

  findOperations(idType:string, isExternal: boolean) {
    return this.configService.getMainzellisteClaims()
    .filter(c => c.permissions.tenant.id == this.currentTenantId)
    .filter(c => c.roles.some( r => this.userRoles.includes(r)))
    .map(c => c.permissions.resources.patient.resources )
    .map(r => isExternal? r.externalIds : r.ids )
    .map(ids => ids.find( id => id.type == idType || id.type == "*")?.operations || [])
    .reduce((accumulator, currentValue) => accumulator.concat(currentValue.filter(e => !accumulator.includes(e))), []);
  }

  getTenantIdTypes(): string[] {
    return this.configuredTenants
      .filter(c => c.id == this.currentTenantId)
      .filter(t => this.userRoles.some(r => t.roles.includes(r)))
      .map(r => r.idTypes)
      .reduce((accumulator, currentValue) => accumulator.concat(currentValue.filter(e => !accumulator.includes(e))), []);
  }

  getTenantConsentTemplate(): string[] {
    return this.configuredTenants
    .filter(c => c.id == this.currentTenantId)
    .filter(t => this.userRoles.some(r => t.roles.includes(r)))
    .map(r => r.consentTemplateIds)
    .reduce((accumulator, currentValue) => accumulator.concat(currentValue.filter(e => !accumulator.includes(e))), []);
  }
}
