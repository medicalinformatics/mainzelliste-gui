import { Id } from "./id";
export class Identity {
  constructor(
    public fields: { [key: string]: string },
    public id: Id,
    public main: boolean,
  ) { };
}