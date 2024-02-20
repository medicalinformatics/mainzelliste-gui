export class AssociatedIdGroupTemplate {
    constructor(
        public name: string,
        public idTypes: [{name: string, id: string, isExternal: boolean}],
    ) {}
}