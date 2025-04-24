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
import {EditorComponent} from "@tinymce/tinymce-angular";
import {Permission} from "../../model/permission";
import {TranslateService} from "@ngx-translate/core";
import {Validity} from "../consent-validity-period";

@Component({
  selector: 'app-consent-template-modules',
  templateUrl: './consent-template-modules.component.html',
  styleUrls: ['./consent-template-modules.component.css'],
  viewProviders: [{provide: ControlContainer, useExisting: NgForm}]
})
export class ConsentTemplateModulesComponent implements OnInit {

  protected readonly ConsentPolicy = ConsentPolicy;
  protected readonly Object = Object;

  @Input() templateModules!: Item[];
  @Input() readonly!: boolean;

  public cachedPoliciesMap: Map<string, {policySet: ConsentPolicySet, policies: ConsentPolicy[]}> = new Map()
  public editedModule: Item | undefined;

  moduleRichTextEditor: EditorComponent['init'] = {
    base_url: '/tinymce',
    suffix: '.min',
    height: 250,
    menubar: false,
    plugins: ['code', 'lists', 'link'],
    toolbar: 'code | undo redo | blocks | bold italic underline| alignleft aligncenter alignright alignjustify | outdent indent | bullist numlist | removeformat | link',
    toolbar_mode: 'sliding',
    branding: false,
    formats: {
      box: {
        attributes: {title: 'box'}, block: 'p', styles: {borderStyle: 'solid', borderWidth: '1px', padding: '2px 10px'}
      }
    },
    block_formats: 'Paragraph=p; Box=box; Heading 1=h1; Heading 2=h2; Heading 3=h3; Heading 4=h4; Heading 5=h5; Heading 6=h6;'
  };

  displayedColumns: string[] = ['policySetName', 'displayText', 'code', 'validity', 'actions'];
  policiesTableData: MatTableDataSource<PolicyView>  = new MatTableDataSource<PolicyView>([]);

  constructor(
    public consentService: ConsentService,
    public translate: TranslateService,
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
    this.editedModule = undefined;
    this.policiesTableData.data = []
  }

  editModule(m: Item) {
    this.editedModule = m.clone();
    this.policiesTableData.data =  (this.editedModule as ChoiceItem).policies ?? [];
  }

  save(m: Item) {
    if (!this.editedModule)
      return
    m.text = this.editedModule.text;
    if (m.type == 'choice') {
      this.toChoiceItem(m).policies = this.toChoiceItem(this.editedModule).policies
    }
    this.editedModule = undefined;
    this.policiesTableData.data = []
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
          cachedPoliciesMap: this.cachedPoliciesMap,
        },
        minWidth: '450px'
      });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        (this.editedModule as ChoiceItem).policies?.push(result.policyView);
        this.policiesTableData.data = (this.editedModule as ChoiceItem).policies ?? [];
        this.cachedPoliciesMap = result.cachedPoliciesMap
      }
    });
  }

  protected readonly Permission = Permission;

  removePolicy(policy:PolicyView) {
    let index = (this.editedModule as ChoiceItem).policies?.findIndex(p => p.code == policy.code && p.policySet.id == policy.policySet.id);
    if(index == undefined)
      console.error("index of policy not found");
    else if (index > -1){
      (this.editedModule as ChoiceItem).policies?.splice(index, 1);
    }
    this.policiesTableData.data = (this.editedModule as ChoiceItem).policies ?? []
  }

  public getValidityPeriodText(validityPeriod: Validity){
    return  validityPeriod?.year + ' Jahren - ' + validityPeriod?.month + ' Monaten - ' + validityPeriod?.day  + ' Tagen';
  }
}
