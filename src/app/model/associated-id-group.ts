import { AssociatedId } from "./associated-id";

export class AssociatedIdGroup {
    constructor(
        public name: string,
        public associatedIds: AssociatedId[],
    ) {}
}