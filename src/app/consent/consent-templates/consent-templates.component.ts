import {Component, OnInit, ViewChild} from '@angular/core';
import {ConsentService} from "../consent.service";
import {ConsentTemplateFhirWrapper} from "../../model/consent-template-fhir-wrapper";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {Router} from "@angular/router";
import {GlobalTitleService} from "../../services/global-title.service";
import {MatDialog} from "@angular/material/dialog";
import {ConsentTemplateDialogComponent} from "../consent-template-dialog/consent-template-dialog.component";

@Component({
  selector: 'app-consent-templates',
  templateUrl: './consent-templates.component.html',
  styleUrls: ['./consent-templates.component.css']
})
export class ConsentTemplatesComponent implements OnInit {

  loading: boolean = false;
  public displayedConsentTemplateColumns: string[] = ['id', 'name', 'title', 'status'];
  templatesMatTableData: MatTableDataSource<ConsentTemplateFhirWrapper>;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  defaultPageSize: number = 10 as const;
  pageNumber: number = 100000;

  constructor(
    public consentService: ConsentService,
    private router: Router,
    private titleService: GlobalTitleService,
    public consentTemplateDialog: MatDialog
  ) {
    this.titleService.setTitle("Einwilligungsvorlagen", false);
    this.templatesMatTableData = new MatTableDataSource<ConsentTemplateFhirWrapper>([]);
  }

  ngOnInit(): void {
    this.loadTemplates(0, this.defaultPageSize);
  }

  loadTemplates(pageIndex: number, pageSize: number) {
    this.loading = true;
    //TODO pagination pageIndex pageSize
    this.consentService.getConsentTemplates().subscribe(
      response => {
        this.templatesMatTableData.data = [...response.values()];
        this.pageNumber = this.templatesMatTableData.data.length / pageSize;
        this.loading = false;
      },
      error => {
        this.templatesMatTableData.data = [];
        this.pageNumber = 0;
        this.loading = false
        throw error;
      }
    )
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
      width: '1100px'
    });

    dialogRef.afterClosed().subscribe(consentTemplate => {
      if (consentTemplate) {
        this.loadTemplates(0, this.defaultPageSize);
      }
    });
  }
}

export interface ConsentTemplateRow {id: string, title:string, name: string}

