import {Directive, Input, TemplateRef, ViewContainerRef} from '@angular/core';
import {PermissionName} from "../../model/patientlist";
import {AuthorizationService} from "../../services/authorization.service";

@Directive({
  selector: '[appHasPermission]'
})
export class HasPermissionDirective {

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authorizationService: AuthorizationService
  ) {
  }

  @Input() set appHasPermission(permissionName: PermissionName) {
    if (this.authorizationService.hasPermission(permissionName)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
