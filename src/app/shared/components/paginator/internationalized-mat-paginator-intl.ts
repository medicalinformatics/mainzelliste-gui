import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { Subject } from 'rxjs';
import { TranslateService } from "@ngx-translate/core";

@Injectable()
export class InternationalizedMatPaginatorIntl implements MatPaginatorIntl {

  firstPageLabel = "";
  itemsPerPageLabel = "";
  lastPageLabel = "";
  nextPageLabel = "";
  previousPageLabel = "";

  changes = new Subject<void>();

  constructor(
    private translate: TranslateService
  ) {
    this.onInit();
    this.updateTranslations();
  }

  onInit() {
    this.translate.onLangChange.subscribe(() => {
      this.updateTranslations();
    });
  }

  updateTranslations() {
    this.firstPageLabel = this.translate.instant('apatientlist_view.paginator_first_page_label');
    this.itemsPerPageLabel = this.translate.instant('patientlist_view.paginator_item_number_label');
    this.lastPageLabel = this.translate.instant('patientlist_view.paginator_last_page_label');
    this.nextPageLabel = this.translate.instant('patientlist_view.paginator_next_page_label');
    this.previousPageLabel = this.translate.instant('patientlist_view.paginator_previous_page_label');
    this.changes.next();
  }

  getRangeLabel(page: number, pageSize: number, length: number): string {
    if (length === 0) {
      return this.translate.instant('EMPTY');
    }
    const amountPages = Math.ceil(length / pageSize);
    return this.translate.instant('patientlist_view.paginator_current_page_label_text1') + ` ${page + 1} ` + this.translate.instant('patientlist_view.paginator_current_page_label_text2') + ` ${amountPages}`;
  }
}

