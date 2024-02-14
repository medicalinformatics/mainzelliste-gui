import { AssociatedId } from "./associated-id";
import {Id} from "./id";

export class Patient {

  public associatedIds: AssociatedId[];

  constructor(
    public fields: { [key: string]: string } = {},
    public ids: Array<Id> = []
  ) {
    this.associatedIds = [new AssociatedId("visit", "0", "0"), new AssociatedId("visit", "1", "1"), new AssociatedId("visit", "2", "2"), new AssociatedId("visit", "3", "3"), new AssociatedId("visit", "4", "4"), new AssociatedId("visit", "", "5"), new AssociatedId("visit", "", "6"), new AssociatedId("visit", "", "7"), new AssociatedId("visit", "", "8"), new AssociatedId("visit", "", "9")];
  }

  getIdString(type: string): string {
    return this.ids.find(id => id.idType == type)?.idString ?? "";
  }

  generateNewExtId(): string {
    let x: number = 0;
    while (this.extIdExists(x.toString())) {
      x++;
    }
    return x.toString();
  }

  generateNewIntId(): string {
    let x: number = 0;
    while (this.intIdExists(x.toString())) {
      x++;
    }
    return x.toString();
  }

  extIdExists(id: string): boolean {
    for(let x = 0; x < this.associatedIds.length; x++) {
      if (id === this.associatedIds[x].externalId) {
        return true;
      }
    }
    return false;
  }

  intIdExists(id: string): boolean {
    for(let x = 0; x < this.associatedIds.length; x++) {
      if (id === this.associatedIds[x].internalId) {
        return true;
      }
    }
    return false;
  }

  findAssociatedId(extId: string): AssociatedId | undefined {
    return this.associatedIds.find(id => {
      id.externalId === extId;
    });
  }
}
