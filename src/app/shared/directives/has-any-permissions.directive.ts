import {Directive, Input, TemplateRef, ViewContainerRef} from '@angular/core';
import {AuthorizationService} from "../../services/authorization.service";
import {Permission} from "../../model/permission";

@Directive({
  selector: '[appHasAnyPermissions]'
})
export class HasAnyPermissionsDirective {

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authorizationService: AuthorizationService
  ) {
  }

  @Input() set appHasAnyPermissions(permissions: Permission[]) {
    if (this.authorizationService.hasAnyPermissions(permissions)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
