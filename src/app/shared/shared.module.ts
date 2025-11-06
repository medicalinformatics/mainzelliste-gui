import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HasPermissionDirective} from "./directives/has-permission.directive";
import {ErrorDialogComponent} from "./components/error-dialog/error-dialog.component";
import {MatLegacyFormFieldModule as MatFormFieldModule} from "@angular/material/legacy-form-field";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {HttpClient} from "@angular/common/http";
import {MatLegacyButtonModule as MatButtonModule} from "@angular/material/legacy-button";
import {MatLegacySelectModule as MatSelectModule} from "@angular/material/legacy-select";
import {MatLegacyCardModule as MatCardModule} from "@angular/material/legacy-card";
import {MatLegacyRadioModule as MatRadioModule} from "@angular/material/legacy-radio";
import {MatLegacyInputModule as MatInputModule} from "@angular/material/legacy-input";
import {MatLegacyDialogModule as MatDialogModule} from "@angular/material/legacy-dialog";
import {ErrorCardComponent} from "./components/error-card/error-card.component";
import {MatIconModule} from "@angular/material/icon";
import {MatLegacyTooltipModule as MatTooltipModule} from "@angular/material/legacy-tooltip";
import {MatLegacyChipsModule as MatChipsModule} from "@angular/material/legacy-chips";
import {MatLegacyAutocompleteModule as MatAutocompleteModule} from "@angular/material/legacy-autocomplete";
import {HasAnyPermissionsDirective} from "./directives/has-any-permissions.directive";
import {MatLegacySnackBarModule as MatSnackBarModule} from "@angular/material/legacy-snack-bar";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatLegacySlideToggleModule as MatSlideToggleModule} from "@angular/material/legacy-slide-toggle";
import {DragDropModule} from "@angular/cdk/drag-drop";
import { ConfirmDeleteDialogComponent } from './components/confirm-delete-dialog/confirm-delete-dialog.component';
import {MatLegacyProgressSpinnerModule as MatProgressSpinnerModule} from "@angular/material/legacy-progress-spinner";
import { MessageCardComponent } from './components/message-card/message-card.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    MatSelectModule,
    MatCardModule,
    MatRadioModule,
    MatDialogModule,
    MatIconModule,
    MatTooltipModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatSnackBarModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    MatProgressSpinnerModule
  ],
  declarations: [HasPermissionDirective, HasAnyPermissionsDirective, ErrorDialogComponent, ErrorCardComponent, ConfirmDeleteDialogComponent, MessageCardComponent],
  exports: [HasPermissionDirective, HasAnyPermissionsDirective, ErrorDialogComponent, ErrorCardComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    MatSelectModule,
    MatCardModule,
    MatRadioModule,
    MatDialogModule,
    MatIconModule,
    MatTooltipModule,
    MatChipsModule,
    MatAutocompleteModule,
    TranslateModule,
    MatExpansionModule,
    MatSlideToggleModule,
    DragDropModule,
    MatSnackBarModule,
    TranslateModule, MessageCardComponent
  ]
})
export class SharedModule {
}
