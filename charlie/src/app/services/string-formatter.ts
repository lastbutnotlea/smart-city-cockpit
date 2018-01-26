import {Injectable} from '@angular/core';

@Injectable()
export class StringFormatterService {

  public toFirstUpperRestLower(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }

}
