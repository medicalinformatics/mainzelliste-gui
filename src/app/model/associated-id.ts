export class AssociatedId {
    constructor(
        public uniqueId: number,
        public name: string,
        public internalId: string,
        public externalId: string,
    ) {}
}