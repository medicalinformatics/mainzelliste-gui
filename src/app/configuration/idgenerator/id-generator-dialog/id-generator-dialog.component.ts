import {Component, ViewChild} from '@angular/core';
import {
  ConsentTemplateDetailComponent
} from "../../../consent/consent-template-detail/consent-template-detail.component";
import {MatDialogRef} from "@angular/material/dialog";
import {TranslateService} from "@ngx-translate/core";
import {NgForm} from "@angular/forms";
import {IdGeneratorDetailComponent} from "../id-generator-detail/id-generator-detail.component";
import {IDGeneratorConfig, IDGeneratorType} from "../../../model/id-generator-config";
import {getErrorMessageFrom} from "../../../error/error-utils";
import {ConfigurationService} from "../../../services/configuration.service";

@Component({
  selector: 'app-id-generator-dialog',
  templateUrl: './id-generator-dialog.component.html',
  styleUrls: ['./id-generator-dialog.component.css']
})
export class IdGeneratorDialogComponent {

  @ViewChild(IdGeneratorDetailComponent) idGeneratorDetail!: IdGeneratorDetailComponent;
  public dataModel: IDGeneratorConfig = {
    idType: "",
    idGenerator: IDGeneratorType.SimpleIDGenerator,
    parameters: {}
  };
  public saving: boolean = false;
  errorMessages: string[] = [];

  constructor(
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
    this.configService.createMainzellisteIdGenerator(this.dataModel).subscribe(
      () => {},
      e => {
        this.errorMessages.push(getErrorMessageFrom(e, this.translate));
        this.saving = false;
      },
      () => {
        this.dialogRef.close(this.dataModel);
        this.saving = false;
      }
    )
  }

  public disable(form: NgForm): boolean {
    return !form.valid
  }
}
