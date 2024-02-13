import { AssociatedId } from "./associated-id";
import {Id} from "./id";

export class Patient {

  constructor(
    public fields: { [key: string]: string } = {},
    public ids: Array<Id> = [],
    public associatedIds: AssociatedId[] = []
  ) {
  }

  getIdString(type: string): string {
    return this.ids.find(id => id.idType == type)?.idString ?? "";
  }

  getLowestId(): number {
    let x: number = 0;
    this.associatedIds.forEach(id => {
      if (id.uniqueId > x) {
        x = id.uniqueId;
      }
    });
    return x;
  }

  findAssociatedId(uniqueId: number): AssociatedId | undefined {
    return this.associatedIds.find(id => {
      id.uniqueId == uniqueId;
    });
  }
}
