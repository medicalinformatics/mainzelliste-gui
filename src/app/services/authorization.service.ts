import {Injectable} from '@angular/core';
import {AppConfigService} from "../app-config.service";
import {UserAuthService} from "./user-auth.service";
import {TranslateService} from '@ngx-translate/core';
import {Operation, Tenant, TenantPermission} from "../model/tenant";
import {Permission} from "../model/permission";
import {ClaimPermissions} from "../model/api/configuration-claims-data";
import {IdType} from "../model/id-type";
import {AuthorizationState} from "../model/authorization-state";

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {

  private readonly userRoles: string[] = [];
  private readonly configuredTenants: Tenant[];
  private currentTenantId: string;
  private allowedIdTypes: Map<Operation, string[]> = new Map<Operation, string[]>();
  private allowedExternalIdTypes: Map<Operation, string[]> = new Map<Operation, string[]>();
  private allowedAssociatedIdTypes: Map<Operation, string[]> = new Map<Operation, string[]>();
  private allowedAssociatedExternalIdTypes: Map<Operation, string[]> = new Map<Operation, string[]>();
  private allowedAssociatedIdTypesMap: Map<string, IdType[]> = new Map<string, IdType[]>();
  private allowedFieldNames: Map<Operation, string[]> = new Map<Operation, string[]>();
  public authorizationState :AuthorizationState;

  constructor(
    private translate: TranslateService,
    private configService: AppConfigService,
    private authentication: UserAuthService
  ) {
    this.userRoles = this.authentication.getRoles();
    this.configuredTenants = this.configService.getMainzellisteClaims()
        .filter(c => c.roles.some( r => this.userRoles.includes(r)))
        .map(e => {
          return new Tenant(e.permissions.tenant.id, e.permissions.tenant.name, e.roles,
            e.permissions.tenant?.idTypes || [],
            this.convertClaimPermissions(e.permissions))
        })
    this.currentTenantId = this.configuredTenants.length > 0 ? this.configuredTenants[0].id : "";

    //init. authorization state data model
    this.authorizationState = new AuthorizationState();
    this.initAuthorizationState()

    this.initPatientAllowedAttributes()
  }

  private initPatientAllowedAttributes(){
    //init associatedId Map
    this.configService.getMainzellisteAssociatedIdGeneratorsMap().forEach((idGenerators, key) => {
      this.allowedAssociatedIdTypesMap.set(key, idGenerators.map(g => {
          return {name: g.idType, isExternal: g.isExternal, isAssociated: true, permissions:this.findOperations(g.idType, g.isExternal)}
        })
      )
    })

    // init internal id types permissions
    let internalIdTypeOperations:Operation[] = ["C", "R"];
    internalIdTypeOperations.forEach( o => {
      let allIdTypes = this.findAllowedIdTypes(o, false);
      this.allowedIdTypes.set(o, this.configService.getMainzellisteIdTypes().filter( t => allIdTypes.includes(t)))
      this.allowedAssociatedIdTypes.set(o, this.configService.getMainzellisteAssociatedIdGenerators()
      .filter( g => !g.isExternal && allIdTypes.includes(g.idType))
      .map(g => g.idType));
    });

    //put tenant Id types first
    let tenantIdTypes: string[] = this.configuredTenants.find(t => t.id == this.currentTenantId)?.idTypes || [];
    const operationList:Operation[] =  ['C', 'U', 'R'];
    for(const operation of operationList) {
      let idTypes = this.allowedIdTypes.get(operation) || [];
      let newIdTypes = [];
      for (let i = 0; i < idTypes.length; i++) {
        if (tenantIdTypes.includes(idTypes[i]))
          newIdTypes.unshift(idTypes[i])
        else
          newIdTypes.push(idTypes[i])
      }
      this.allowedIdTypes.set(operation, newIdTypes);
    }

    // init external id types permissions
    let externalIdTypeOperations:Operation[] = ["C", "U", "R"];
    externalIdTypeOperations.forEach( o => {
      let allIdTypes = this.findAllowedIdTypes(o, true);
      this.allowedExternalIdTypes.set(o, this.configService.getMainzellisteIdTypes().filter( t => allIdTypes.includes(t)))
      this.allowedAssociatedExternalIdTypes.set(o, this.configService.getMainzellisteAssociatedIdGenerators()
      .filter( g => g.isExternal && allIdTypes.includes(g.idType))
      .map(g => g.idType));
    })

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
        if(permission.type == "default")
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

    if (this.configService.isConsentEnabled() && claimPermissions.resources.patient.resources.consent != undefined) {
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

    if (this.configService.isConsentEnabled() && claimPermissions.resources.consentTemplate != undefined) {
      permissions.push({
        type: 'consentTemplate',
        operations: claimPermissions.resources.consentTemplate.operations
      })
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

  getTenants(): { id: string, name: string }[] {
    return this.configuredTenants;
  }

  setTenant(tenantId: string){
    this.currentTenantId = tenantId;
    this.initPatientAllowedAttributes();
    this.initAuthorizationState();
  }

  getCurrentTenantId() {
    return this.currentTenantId;
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
      && p.operations.includes(permission.operation))
  }

  getAllAllowedUniqueIdTypes(operation: Operation): string[] {
    return this.getAllowedUniqueIdTypes(operation, false).concat(this.getAllowedUniqueIdTypes(operation, true));
  }

  getAllowedUniqueIdTypes(operation: Operation, isExternal: boolean): string[] {
    return (isExternal? this.allowedExternalIdTypes.get(operation) : this.allowedIdTypes.get(operation)) || [];
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

  findAllowedIdTypes(operation: Operation, isExternal: boolean): string[] {
    let permittedIdTypes: string[] = this.configService.getMainzellisteClaims()
      .filter(c => c.permissions.tenant.id == this.currentTenantId)
      .filter(c => c.roles.some( r => this.userRoles.includes(r)))
      .map(c => c.permissions.resources.patient.resources )
      .map(r => isExternal? r.externalIds : r.ids )
      .map(t => t.filter( i=> i.operations.includes(operation)).map(i => i.type) || [])
      .reduce((accumulator, currentValue) => accumulator.concat(currentValue.filter(e => !accumulator.includes(e))), []);
    return !permittedIdTypes.some( t => t == "*") ? permittedIdTypes :
      this.configService.getMainzellisteIdGenerators().filter(g => g.isExternal == isExternal)
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
}
