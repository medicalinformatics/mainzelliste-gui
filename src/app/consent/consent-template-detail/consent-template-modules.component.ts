import {Component, Input, OnInit} from '@angular/core';
import {ChoiceItem, Item} from "../consent-template.model";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {ConsentPolicy} from "../../model/consent-policy";
import {MatSelectChange} from "@angular/material/select";
import {ConsentService} from "../consent.service";
import {ConsentPolicySet} from "../../model/consent-policy-set";
import {ControlContainer, NgForm} from "@angular/forms";

@Component({
  selector: 'app-consent-template-modules',
  templateUrl: './consent-template-modules.component.html',
  styleUrls: ['./consent-template-modules.component.css'],
  viewProviders: [{provide: ControlContainer, useExisting: NgForm}]
})
export class ConsentTemplateModulesComponent implements OnInit {

  public readonly ConsentPolicy = ConsentPolicy;

  @Input() templateModules!: Item[];

  public consentPolicySets: ConsentPolicySet[] = [];
  public consentPolicies: Map<String, ConsentPolicy[]> = new Map<String, ConsentPolicy[]>();
  public editedModule: Item | undefined;
  public policiesLoading: boolean = false;

  constructor(
    public consentService: ConsentService
  ) {
  }

  ngOnInit(): void {
    // fetch policySets from backend
    this.consentService.getPolicySets().subscribe(r => this.consentPolicySets = r);
  }

  dropModule(event: CdkDragDrop<any, any>) {
    moveItemInArray(this.templateModules, event.previousIndex, event.currentIndex);
  }

  deleteModule(module: Item) {
    let index = this.templateModules.indexOf(module);
    if (index > -1)
      this.templateModules.splice(index, 1);
  }

  editModule(m: Item) {
    this.editedModule = m.clone();
  }

  save(m: Item) {
    if (!this.editedModule)
      return
    m.text = this.editedModule.text;
    if (m.type == 'choice') {
      this.toChoiceItem(m).policy = this.toChoiceItem(this.editedModule).policy;
      this.toChoiceItem(m).policySet = this.toChoiceItem(this.editedModule).policySet;
    }
    this.editedModule = undefined;
  }

  cancel() {
    this.editedModule = undefined;
  }

  public getPolicies(): ConsentPolicy[] {
    return (this.consentPolicies.get(this.toChoiceItem(this.editedModule).policySet?.id || "") || [])
      .filter(p =>
        !this.templateModules.filter(i => i.id != this.editedModule?.id).some(
          i => i instanceof ChoiceItem && this.toChoiceItem(i).policy?.code == p.code
        )
      )
  }

  public fetchPolicies(matSelectChange: MatSelectChange) {
    let policies: ConsentPolicy[] | undefined = this.consentPolicies.get(matSelectChange.value.id);
    if ((policies == undefined || policies.length == 0) && this.editedModule != undefined) {
      this.policiesLoading = true;
      this.consentService.getPolicies(matSelectChange.value.id).subscribe(
        r => {
          this.consentPolicies.set(matSelectChange.value.id, r);
          this.policiesLoading = false;
        }
      )
    }
  }

  public toChoiceItem(item: Item | undefined): ChoiceItem {
    return item as ChoiceItem;
  }

  public isChoiceModule(): boolean {
    return this.editedModule instanceof ChoiceItem
  }
}
