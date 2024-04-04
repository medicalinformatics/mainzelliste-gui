import {Injectable} from '@angular/core';
import {AppConfigService} from "../app-config.service";
import {UserAuthService} from "./user-auth.service";
import {TranslateService} from '@ngx-translate/core';
import {Operation, Tenant, TenantPermission} from "../model/tenant";
import {Permission} from "../model/permission";
import {ClaimPermissions, FieldPermissions, IDPermissions} from "../model/api/configuration-claims-data";

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {

  private readonly userRoles: string[] = [];
  private readonly configuredTenants: Tenant[];
  private currentTenantId: string;
  private allowedIdTypes: Map<Operation, string[]> = new Map<Operation, string[]>();
  private allowedExternalIdTypes: Map<Operation, string[]> = new Map<Operation, string[]>();
  private allowedFieldNames: Map<Operation, string[]> = new Map<Operation, string[]>();

  constructor(
    private translate: TranslateService,
    private configService: AppConfigService,
    private authentication: UserAuthService
  ) {
    this.userRoles = authentication.getRoles();
    this.configuredTenants = this.configService.getMainzellisteClaims()
        .filter(c => c.roles.some( r => this.userRoles.includes(r)))
        .map(e => {
          return new Tenant(e.permissions.tenant.id, e.permissions.tenant.name, e.roles,
            e.permissions.tenant?.idTypes || [],
            this.convertClaimPermissions(e.permissions))
        })
    this.currentTenantId = this.configuredTenants.length > 0 ? this.configuredTenants[0].id : "";
    this.initPatientAllowedAttributes()
  }

  private initPatientAllowedAttributes(){
    let internalIdTypeOperations:Operation[] = ["C", "R"];
    internalIdTypeOperations.forEach( o => this.allowedIdTypes.set(o, this.findAllowedIdTypes(o, false)));

    let externalIdTypeOperations:Operation[] = ["C", "U", "R"];
    externalIdTypeOperations.forEach( o => this.allowedExternalIdTypes.set(o, this.findAllowedIdTypes(o, true)))

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
        operations: this.extractOperationsFromPatientIdsPermissions(claimPermissions.resources.patient.resources.ids || [],
          claimPermissions.resources.patient.operations)
      })
      // fields permissions
      permissions.push({
        type: 'fields',
        operations: this.extractOperationsFromPatientContentPermissions(
          claimPermissions.resources.patient.resources.externalIds || [],
          claimPermissions.resources.patient.resources.fields || [],
          claimPermissions.resources.patient.operations)
      })
    }

    if (claimPermissions.resources.consent != undefined) {
      permissions.push({
        type: 'consent',
        operations: claimPermissions.resources.consent.operations
      })
    }
    return permissions;
  }

  private extractOperationsFromPatientIdsPermissions(idsPermissions: IDPermissions[],
                                                     patientOperations: Operation[]) {
    let operations: Operation[] = []
    this.concatOperations(idsPermissions, operations);
    return operations.length == 0 ? patientOperations : operations;
  }

  //TODO support external ids
  private extractOperationsFromPatientContentPermissions(idsPermissions: IDPermissions[],
                                                         fieldPermissions: FieldPermissions[],
                                                         patientOperations: Operation[]) {
    let operations: Operation[] = []
    this.concatOperations(idsPermissions, operations);
    this.concatOperations(fieldPermissions, operations);
    return operations.length == 0 ? patientOperations : operations;
  }

  private concatOperations(items: { operations: Operation[] }[], result: Operation[]) {
    for (let item of items) {
      item.operations.filter(o => !result.includes(o)).forEach(o => result.push(o))
      if (result.length == 4)
        break
    }
  }

  hasPermission(permission: Permission): boolean {
    return this.hasAnyPermissions([permission]);
  }

  getTenants(): { id: string, name: string }[] {
    return this.configuredTenants;
  }

  setTenant(tenantId: string){
    this.currentTenantId = tenantId;
    this.initPatientAllowedAttributes();
  }

  getCurrentTenant() {
    return this.currentTenantId;
  }

  hasAnyPermissions(permissions: Permission[]): boolean {
    // return true, if tenant not configured in the backend
    if (this.configuredTenants == undefined)
      return true;
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

  getAllAllowedIdTypes(operation: Operation): string[] {
    return this.getAllowedIdTypes(operation, false).concat(this.getAllowedIdTypes(operation, true));
  }

  getAllowedIdTypes(operation: Operation, isExternal: boolean): string[] {
    return (isExternal? this.allowedExternalIdTypes.get(operation) : this.allowedIdTypes.get(operation)) || [];
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

  getTenantIdTypes(): string[] {
    return this.configuredTenants
      .filter(c => c.id == this.currentTenantId)
      .filter(t => this.userRoles.some(r => t.roles.includes(r)))
      .map(r => r.idTypes)
      .reduce((accumulator, currentValue) => accumulator.concat(currentValue.filter(e => !accumulator.includes(e))), []);
  }
}
