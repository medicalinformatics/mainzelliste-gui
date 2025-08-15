import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HasPermissionDirective} from "./directives/has-permission.directive";
import {ErrorDialogComponent} from "./components/error-dialog/error-dialog.component";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {HttpClient} from "@angular/common/http";
import {MatButtonModule} from "@angular/material/button";
import {MatSelectModule} from "@angular/material/select";
import {MatCardModule} from "@angular/material/card";
import {MatRadioModule} from "@angular/material/radio";
import {MatInputModule} from "@angular/material/input";
import {MatDialogModule} from "@angular/material/dialog";
import {ErrorCardComponent} from "./components/error-card/error-card.component";
import {MatIconModule} from "@angular/material/icon";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatChipsModule} from "@angular/material/chips";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {HasAnyPermissionsDirective} from "./directives/has-any-permissions.directive";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {DragDropModule} from "@angular/cdk/drag-drop";
import { ConfirmDeleteDialogComponent } from './components/confirm-delete-dialog/confirm-delete-dialog.component';
import { SecondaryIdentitiesComponent} from './components/secondary-identities/secondary-identities.component'
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import { MessageCardComponent } from './components/message-card/message-card.component';
import { IdCardDialogComponent } from './components/secondary-identities/dialog/id-card-dialog.component';

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
    MatTableModule,
    MatPaginatorModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    MatProgressSpinnerModule
  ],
  declarations: [HasPermissionDirective, HasAnyPermissionsDirective, ErrorDialogComponent, ErrorCardComponent, ConfirmDeleteDialogComponent, MessageCardComponent, SecondaryIdentitiesComponent, IdCardDialogComponent],
  exports: [HasPermissionDirective, HasAnyPermissionsDirective, ErrorDialogComponent, ErrorCardComponent,SecondaryIdentitiesComponent, IdCardDialogComponent,
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
