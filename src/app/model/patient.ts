import { AssociatedId } from "./associated-id";
import { AssociatedIdGroup } from "./associated-id-group";
import {Id} from "./id";

export class Patient {

  public associatedIdGroups: AssociatedIdGroup[];

  constructor(
    public fields: { [key: string]: string } = {},
    public ids: Array<Id> = []
  ) {
    this.associatedIdGroups = [new AssociatedIdGroup("lab", [new AssociatedId([new Id("extId", "32328"), new Id("intId", "78464")]), new AssociatedId([new Id("extId", "28975")]), ]), new AssociatedIdGroup("visit", [new AssociatedId([new Id("extId", "48785"), new Id("intId", "12075")]), new AssociatedId([new Id("extId", "06735")])]), new AssociatedIdGroup("cache", [new AssociatedId([new Id("inputId", "15485"), new Id("outputId", "01024")]), new AssociatedId([new Id("inputId", "19562")])]), new AssociatedIdGroup("temp", [new AssociatedId([new Id("teId", "51853"), new Id("mpId", "82546")]), new AssociatedId([new Id("teId", "35689")])])];
  }

  getIdString(type: string): string {
    return this.ids.find(id => id.idType == type)?.idString ?? "";
  }

  idExists(id: string): boolean {
    return this.findAssociatedId(id) != null;
  }

  findAssociatedId(id: string): AssociatedId | null {
    for (let x = 0; x < this.associatedIdGroups.length; x++) {
      for (let i = 0; i < this.associatedIdGroups[x].associatedIds.length; i++) {
        for (let h = 0; h < this.associatedIdGroups[x].associatedIds[i].idTypes.length; h++) {
          if (this.associatedIdGroups[x].associatedIds[i].idTypes[h].idString === id) {
            return this.associatedIdGroups[x].associatedIds[i];
          }
        }
      }
    }
    return null;
  }
}
