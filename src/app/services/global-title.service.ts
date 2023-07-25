import {Injectable} from '@angular/core';
import {Title} from "@angular/platform-browser";

@Injectable({
  providedIn: 'root'
})
export class GlobalTitleService {
  private TITLE_PREFIX: string = "Mainzelliste - "
  private _titleIcon?: string;
  private _titleText: string = "";

  constructor(
    private titleService: Title
  ) {
  }

  setTitle(text: string, onlyMeta?: boolean, icon?: string) {
    this._titleText = onlyMeta || text == undefined ? "" : text;
    this._titleIcon = onlyMeta ? "" : icon;
    this.titleService.setTitle(this.TITLE_PREFIX + text);
  }


  public get titleIcon(): string | undefined {
    return this._titleIcon;
  }

  public get titleText(): string {
    return this._titleText;
  }
}
