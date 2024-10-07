
export interface IDGeneratorParameters {
}

export interface PIDGeneratorParameters extends IDGeneratorParameters{
  k1: number,
  k2: number,
  k3: number,
  rndwidth: number
}

export enum IDGeneratorType {
  PIDGenerator = "PIDGenerator",
  ExternalIDGenerator = "ExternalIDGenerator",
  SimpleIDGenerator = "SimpleIDGenerator"
}

export class IDGeneratorConfig {
  idGenerator: IDGeneratorType;
  idType: string;
  parameters: IDGeneratorParameters;

  constructor(idGenerator: IDGeneratorType, idType: string, parameters: IDGeneratorParameters) {
    this.idGenerator = idGenerator;
    this.idType = idType;
    this.parameters = parameters;
  }
}
