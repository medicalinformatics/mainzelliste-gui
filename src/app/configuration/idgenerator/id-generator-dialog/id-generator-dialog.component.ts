import {Component, Inject, ViewChild} from '@angular/core';
import {
  ConsentTemplateDetailComponent
} from "../../../consent/consent-template-detail/consent-template-detail.component";
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from "@angular/material/dialog";
import { TranslateService, TranslatePipe } from "@ngx-translate/core";
import { NgForm, FormsModule } from "@angular/forms";
import {IdGeneratorDetailComponent} from "../id-generator-detail/id-generator-detail.component";
import {IDGeneratorConfig, IDGeneratorType} from "../../../model/id-generator-config";
import {getErrorMessageFrom} from "../../../error/error-utils";
import {ConfigurationService} from "../../../services/configuration.service";
import {Id} from "../../../model/id";
import { ErrorCardComponent } from '../../../shared/components/error-card/error-card.component';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatButton } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
    selector: 'app-id-generator-dialog',
    templateUrl: './id-generator-dialog.component.html',
    styleUrls: ['./id-generator-dialog.component.css'],
    imports: [MatDialogTitle, ErrorCardComponent, FormsModule, IdGeneratorDetailComponent, CdkScrollable, MatDialogContent, MatDialogActions, MatButton, NgIf, MatIcon, MatProgressSpinner, TranslatePipe]
})
export class IdGeneratorDialogComponent {

  @ViewChild(IdGeneratorDetailComponent) idGeneratorDetail!: IdGeneratorDetailComponent;
  public saving: boolean = false;
  errorMessages: string[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public dataModel: IDGeneratorConfig,
    public dialogRef: MatDialogRef<ConsentTemplateDetailComponent>,
    public configService: ConfigurationService,
    private translate: TranslateService
  ) {
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave() {
    this.saving = true;
    if(this.dataModel.nodeName == 'default')
      this.dataModel.nodeName = ''
    this.configService.createMainzellisteIdGenerator(this.dataModel).subscribe({
      next: () => {},
      error: (e) => {
        this.errorMessages.push(getErrorMessageFrom(e, this.translate));
        this.saving = false;
      },
      complete: () => {
        this.dialogRef.close(this.dataModel);
        this.saving = false;
      }
    })
  }

  public disable(form: NgForm): boolean {
    return !form.valid
  }
}
