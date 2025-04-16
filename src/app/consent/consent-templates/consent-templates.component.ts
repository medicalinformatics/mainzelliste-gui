import {Component, OnInit, ViewChild} from '@angular/core';
import {ConsentService} from "../consent.service";
import {ConsentTemplateFhirWrapper} from "../../model/consent-template-fhir-wrapper";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {Router} from "@angular/router";
import {GlobalTitleService} from "../../services/global-title.service";
import {MatDialog} from "@angular/material/dialog";
import {
  ConsentTemplateDialogComponent
} from "../consent-template-dialog/consent-template-dialog.component";
import {Permission} from "../../model/permission";
import {
  ConfirmDeleteDialogComponent
} from "../../shared/components/confirm-delete-dialog/confirm-delete-dialog.component";
import {AuthorizationService} from "../../services/authorization.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-consent-templates',
  templateUrl: './consent-templates.component.html',
  styleUrls: ['./consent-templates.component.css']
})
export class ConsentTemplatesComponent implements OnInit {

  loading: boolean = false;
  public displayedConsentTemplateColumns: string[] = ['id', 'name', 'title', 'status', 'actions'];
  templatesMatTableData: MatTableDataSource<ConsentTemplateFhirWrapper>;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  defaultPageSize: number = 10 as const;
  pageNumber: number = 100000;

  constructor(
    public consentService: ConsentService,
    public authorizationService: AuthorizationService,
    private readonly router: Router,
    private readonly titleService: GlobalTitleService,
    private readonly translate: TranslateService,
    public consentTemplateDialog: MatDialog,
    public confirmDeleteDialog: MatDialog
  ) {
    this.changeTitle();
    this.templatesMatTableData = new MatTableDataSource<ConsentTemplateFhirWrapper>([]);
  }

  ngOnInit(): void {
    this.loadTemplates(0, this.defaultPageSize);
    this.translate.onLangChange.subscribe(() => {
      this.changeTitle();
    })
  }

  changeTitle() {
    this.titleService.setTitle(this.translate.instant('consent_template_list.title'));
  }

  loadTemplates(pageIndex: number, pageSize: number) {
    this.loading = true;
    //TODO pagination pageIndex pageSize
    this.consentService.getConsentTemplates().subscribe({
      next: response => {
        this.templatesMatTableData.data = [...response.values()];
        this.pageNumber = this.templatesMatTableData.data.length / pageSize;
        this.loading = false;
      },
      error: error => {
        this.templatesMatTableData.data = [];
        this.pageNumber = 0;
        this.loading = false
        throw error;
      }
    })
  }

  handlePageEvent(event: PageEvent) {
    this.loadTemplates(event.pageIndex, event.pageSize);
  }

  editTemplate(row: ConsentTemplateRow) {
    // await this.router.navigate(["patient", this.idType, this.idString, 'edit-consent', row.id]);
  }

  async createTemplate() {
    await this.router.navigate(["create-consent-template"]);
  }

  openConsentTemplateDialog() {
    const dialogRef = this.consentTemplateDialog.open(ConsentTemplateDialogComponent, {
      width: '1100px',
      maxHeight: '95vw'
    });

    dialogRef.afterClosed().subscribe(consentTemplate => {
      if (consentTemplate) {
        this.loadTemplates(0, this.defaultPageSize);
      }
    });
  }

  protected readonly Permission = Permission;

  public openDeleteTemplateDialog(templateId: string): void {
    this.confirmDeleteDialog.open(ConfirmDeleteDialogComponent, {
      data: {
        itemI18nName: "confirm_delete_dialog.item_consent_template",
        callbackObservable: this.consentService.deleteConsentTemplate(templateId)
      },
    })
    .afterClosed().subscribe(result => {
      if (result)
        this.loadTemplates(this.paginator.pageIndex, this.paginator.pageSize);
    });
  }
}

export interface ConsentTemplateRow {id: string, title:string, name: string}

