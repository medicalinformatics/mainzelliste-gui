import {Directive, Input, TemplateRef, ViewContainerRef} from '@angular/core';
import {AuthorizationService} from "../../services/authorization.service";
import {Permission} from "../../model/permission";

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

  @Input() set appHasPermission(permission: Permission) {
    if (this.authorizationService.hasPermission(permission)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
