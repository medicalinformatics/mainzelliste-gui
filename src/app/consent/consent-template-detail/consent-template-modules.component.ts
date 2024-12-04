import {Component, Input, OnInit} from '@angular/core';
import {ChoiceItem, Item, PolicyView} from "../consent-template.model";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {ConsentPolicy} from "../../model/consent-policy";
import {ConsentService} from "../consent.service";
import {ConsentPolicySet} from "../../model/consent-policy-set";
import {ControlContainer, NgForm} from "@angular/forms";
import {MatTableDataSource} from "@angular/material/table";
import {MatDialog} from "@angular/material/dialog";
import {ConsentTemplatePolicyDialog} from "./consent-template-policy-dialog";

@Component({
  selector: 'app-consent-template-modules',
  templateUrl: './consent-template-modules.component.html',
  styleUrls: ['./consent-template-modules.component.css'],
  viewProviders: [{provide: ControlContainer, useExisting: NgForm}]
})
export class ConsentTemplateModulesComponent implements OnInit {

  public readonly ConsentPolicy = ConsentPolicy;
  protected readonly Object = Object;

  @Input() templateModules!: Item[];

  public cachedPoliciesMap: Map<string, {policySet: ConsentPolicySet, policies: ConsentPolicy[]}> = new Map()
  public editedModule: Item | undefined;

  displayedColumns: string[] = ['policySetName', 'displayText', 'code'];
  policiesTableData: MatTableDataSource<PolicyView>  = new MatTableDataSource<PolicyView>([]);

  constructor(
    public consentService: ConsentService,
    private policyDialog: MatDialog,
  ) {
  }

  ngOnInit(): void {
    this.consentService.getPolicySets().subscribe(r =>
      r.forEach( s => this.cachedPoliciesMap.set(s.id, {policySet: s, policies: []}))
    );
  }

  dropModule(event: CdkDragDrop<any, any>) {
    moveItemInArray(this.templateModules, event.previousIndex, event.currentIndex);
    this.templateModules.forEach((module, index) => module.id = index)
  }

  deleteModule(module: Item) {
    let index = this.templateModules.indexOf(module);
    if (index > -1){
      this.templateModules.splice(index, 1);
      // update index of the remaining modules
      this.templateModules.forEach((module, index) => module.id = index)
    }
  }

  editModule(m: Item) {
    this.editedModule = m.clone();
  }

  save(m: Item) {
    if (!this.editedModule)
      return
    m.text = this.editedModule.text;
    if (m.type == 'choice') {
      this.toChoiceItem(m).policies = this.toChoiceItem(this.editedModule).policies
    }
    this.editedModule = undefined;
  }

  cancel() {
    this.editedModule = undefined;
    this.policiesTableData.data = []
  }

  public toChoiceItem(item: Item | undefined): ChoiceItem {
    return item as ChoiceItem;
  }

  public isChoiceModule(): boolean {
    return this.editedModule instanceof ChoiceItem
  }

  openPolicyDialog() {
    const dialogRef = this.policyDialog.open(ConsentTemplatePolicyDialog,
      {
        data: {
          addedPolicyViews: (this.templateModules
          .filter(m => m.id != this.editedModule?.id && m instanceof ChoiceItem)
          .map( m => (m as ChoiceItem).policies)
          .reduce((accumulator, currentValue) =>
            (accumulator??[]).concat(currentValue ?? []), []) ?? [])
          .concat((this.editedModule as ChoiceItem).policies ?? []),
          cachedPoliciesMap: this.cachedPoliciesMap
        },
        minWidth: '500px'
      });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        (this.editedModule as ChoiceItem).policies?.push(result.policyView);
        this.policiesTableData.data = (this.editedModule as ChoiceItem).policies ?? [];
        this.cachedPoliciesMap = result.cachedPoliciesMap
      }
    });
  }
}
