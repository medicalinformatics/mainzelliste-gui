import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from "@angular/forms";
import {HasPermissionDirective} from "./directives/has-permission.directive";
import {ErrorDialogComponent} from "./components/error-dialog/error-dialog.component";


@NgModule({
  imports: [CommonModule],
  declarations: [HasPermissionDirective, ErrorDialogComponent],
  exports: [HasPermissionDirective, ErrorDialogComponent,
    CommonModule, FormsModule]
})
export class SharedModule {
}
