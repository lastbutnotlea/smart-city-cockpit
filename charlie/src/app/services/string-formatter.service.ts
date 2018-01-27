import {Injectable} from '@angular/core';

@Injectable()
export class StringFormatterService {

  public toFirstUpperRestLower(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }

  public priorityToLabel(priority: string): string {
    if(priority === "FINE"){
      return "Low";
    } else if(priority === "PROBLEMATIC"){
      return "Medium";
    } else if(priority === "CRITICAL"){
      return "High";
    } else {
      return "";
    }
  }
}
